'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { HanoiControls } from './hanoi-controls';

// Hanoi 3D r3f — três pegs, N discos (1-8 desktop, cap 5 mobile via deviceMemory).
// Auto-solve recursivo gera lista de moves; useFrame anima cada disco entre
// keyframes (LIFT → TRANSLATE → DROP) com timing fixo (240ms por fase = 720ms/move).
// Spring overshoot opcional (snappy easing) via easeOutBack na drop.
// Reduced-motion: snap discos pra solução final em 1 frame, sem animação.

// === Constantes do mundo ===
const PEG_SPACING = 2.4;
const PEG_HEIGHT = 3.0;
const PEG_RADIUS = 0.08;
const DISC_HEIGHT = 0.32;
const DISC_MIN_RADIUS = 0.36;
const DISC_RADIUS_STEP = 0.18;
const LIFT_HEIGHT = 2.6;
const PHASE_DURATION = 0.24; // seconds per phase (lift / translate / drop)
const TOTAL_MOVE = PHASE_DURATION * 3;
const MAX_DISCS_DESKTOP = 8;
const MAX_DISCS_MOBILE = 5;

const LIME = new THREE.Color('#D2FF00');
// F4 (2026-08-29): rótulos dos pegs NÃO usam mais o <Text> do drei (troika).
//
// Bug medido, reproduzido em Chrome real (não é artefato de headless): o Hanoi
// 3D nunca aparecia. O <canvas> montava e era dimensionado (1341×446), mas a
// subárvore inteira ficava com `display: none !important` (é assim que o React
// esconde uma árvore suspensa) e o skeleton "CARREGANDO THREE.JS…" ficava
// para sempre. Provado por bissecção: sem o <Text> a cena renderiza; com ele,
// trava — com woff2 local, com ttf local e sem prop `font`.
//
// Causa original: sem `font`, troika@0.52 resolve a fonte via
// unicode-font-resolver, que faz fetch em cdn.jsdelivr.net dentro do worker;
// jsdelivr não está no `connect-src` (next.config.ts) → TypeError: Failed to
// fetch → a promise do Suspense nunca resolve. Apontar pra uma fonte local
// matou o erro de CSP, mas o troika continuou suspendendo — então a dependência
// inteira saiu deste caminho.
//
// Solução: sprite com textura de canvas 2D. Sem worker, sem fetch, sem
// superfície de CSP, ~20 linhas. `<sprite>` sempre encara a câmera, então o
// rótulo continua legível enquanto o usuário orbita — que era justamente o
// motivo de usar texto 3D aqui.
function PegLabel({ position, text }: { position: [number, number, number]; text: string }) {
  const texture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    // usa a MESMA família mono do resto do site (token --font-mono)
    const mono =
      getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim() ||
      'ui-monospace, monospace';
    ctx.clearRect(0, 0, size, size);
    ctx.font = `600 ${Math.round(size * 0.68)}px ${mono}`;
    ctx.fillStyle = `#${LIME.getHexString()}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, size / 2, size / 2 + size * 0.03);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }, [text]);

  useEffect(() => () => texture?.dispose(), [texture]);
  if (!texture) return null;

  return (
    <sprite position={position} scale={[0.55, 0.55, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

const PEG_COLOR = new THREE.Color('#3a4035');
const FLOOR_COLOR = new THREE.Color('#0F1310');

type Move = { discId: number; from: number; to: number };

interface DiscState {
  id: number;
  size: number; // 1 = smallest, N = largest
  peg: number; // current resting peg
  heightOnPeg: number; // 0 = bottom of stack
}

// Generate the standard Hanoi recursive solution as a flat move list.
function generateMoves(n: number, from = 0, to = 2, via = 1, out: Move[] = []): Move[] {
  if (n <= 0) return out;
  generateMoves(n - 1, from, via, to, out);
  out.push({ discId: n, from, to });
  generateMoves(n - 1, via, to, from, out);
  return out;
}

function initialDiscs(n: number): DiscState[] {
  // Disc id = its size. Largest (id=n) sits at bottom (heightOnPeg=0).
  // Smallest (id=1) sits at top (heightOnPeg=n-1).
  return Array.from({ length: n }, (_, i) => {
    const id = i + 1;
    return { id, size: id, peg: 0, heightOnPeg: n - id };
  });
}

function getMaxDiscs(): number {
  if (typeof navigator === 'undefined') return MAX_DISCS_DESKTOP;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (mem !== undefined && mem < 4) return MAX_DISCS_MOBILE;
  if (typeof window !== 'undefined' && window.matchMedia?.('(max-width: 640px)').matches) {
    return MAX_DISCS_MOBILE;
  }
  return MAX_DISCS_DESKTOP;
}

export function Hanoi3D() {
  const [maxDiscs, setMaxDiscs] = useState(MAX_DISCS_DESKTOP);
  const [n, setN] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [moveIndex, setMoveIndex] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const reduced = useReducedMotionSafe();

  // Detect mobile / low-memory device on mount, clamp n if needed.
  useEffect(() => {
    const cap = getMaxDiscs();
    setMaxDiscs(cap);
    setN((current) => Math.min(current, cap));
  }, []);

  const moves = useMemo(() => generateMoves(n), [n]);
  const totalMoves = moves.length;
  const minTheoretical = 2 ** n - 1;

  // === Refs mutáveis pra useFrame não causar re-render ===
  const discsRef = useRef<DiscState[]>(initialDiscs(n));
  const elapsedRef = useRef(0);
  const moveIndexRef = useRef(0);

  // Reset state quando n ou resetKey muda.
  // biome-ignore lint/correctness/useExhaustiveDependencies: resetKey é trigger explícito; corpo não lê o valor mas a mudança de identidade deve re-disparar o effect
  useEffect(() => {
    discsRef.current = initialDiscs(n);
    elapsedRef.current = 0;
    moveIndexRef.current = 0;
    setMoveIndex(0);
    setPlaying(false);
  }, [n, resetKey]);

  const handlePlay = useCallback(() => {
    if (moveIndexRef.current >= totalMoves) {
      // restart from beginning
      setResetKey((k) => k + 1);
      // wait next tick to enable play to allow state to flush
      requestAnimationFrame(() => setPlaying(true));
      return;
    }
    setPlaying(true);
  }, [totalMoves]);

  const handlePause = useCallback(() => setPlaying(false), []);

  const handleStep = useCallback(() => {
    if (moveIndexRef.current >= totalMoves) return;
    const move = moves[moveIndexRef.current];
    if (!move) return;
    applyMove(discsRef.current, move);
    // Zerar elapsed pra próxima frame partir do zero — caso usuário aperte Play depois.
    // (anteriormente setávamos TOTAL_MOVE, o que fazia a animação do PRÓXIMO move ser pulada.)
    elapsedRef.current = 0;
    moveIndexRef.current += 1;
    setMoveIndex(moveIndexRef.current);
    setPlaying(false);
  }, [moves, totalMoves]);

  const handleReset = useCallback(() => {
    setResetKey((k) => k + 1);
  }, []);

  const handleNChange = useCallback(
    (next: number) => {
      const clamped = Math.max(1, Math.min(maxDiscs, next));
      setN(clamped);
    },
    [maxDiscs]
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="relative h-[24rem] w-full overflow-hidden rounded-xl border border-(--color-hairline) bg-(--color-bg) sm:h-[28rem]">
        {/* W-perf revert (2026-05-25): frameloop="demand" condicional causava
            race condition no mount — useEffect que chamaria invalidate roda
            APÓS Canvas paint inicial, deixando discs em posições erradas
            (Y=0 todos) até o segundo frame. RAF "always" custa CPU mas é o
            comportamento garantido. OrbitControls damping também depende
            disso pra desaceleração suave após drag. */}
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [3.5, 4.2, 6.5], fov: 38 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
        >
          <SceneContent
            n={n}
            moves={moves}
            playing={playing}
            reduced={reduced ?? false}
            elapsedRef={elapsedRef}
            moveIndexRef={moveIndexRef}
            discsRef={discsRef}
            onMoveAdvance={setMoveIndex}
            onCompletion={() => setPlaying(false)}
          />
        </Canvas>
      </div>

      <HanoiControls
        n={n}
        maxN={maxDiscs}
        playing={playing}
        moveIndex={moveIndex}
        totalMoves={totalMoves}
        minTheoretical={minTheoretical}
        onNChange={handleNChange}
        onPlay={handlePlay}
        onPause={handlePause}
        onStep={handleStep}
        onReset={handleReset}
      />
    </div>
  );
}

interface SceneContentProps {
  n: number;
  moves: Move[];
  playing: boolean;
  reduced: boolean;
  elapsedRef: React.RefObject<number>;
  moveIndexRef: React.RefObject<number>;
  discsRef: React.RefObject<DiscState[]>;
  onMoveAdvance: (idx: number) => void;
  onCompletion: () => void;
}

function SceneContent({
  n,
  moves,
  playing,
  reduced,
  elapsedRef,
  moveIndexRef,
  discsRef,
  onMoveAdvance,
  onCompletion,
}: SceneContentProps) {
  // Refs pros meshes dos discos (id 1..n).
  const discMeshes = useRef<Array<THREE.Mesh | null>>([]);

  // Snap todos os discos pras posições atuais (chamado quando reduced=true).
  useEffect(() => {
    if (!reduced) return;
    // Para reduced-motion, apply ALL moves instantaneamente → estado final.
    for (let i = 0; i < moves.length; i += 1) {
      const move = moves[i];
      if (move) applyMove(discsRef.current, move);
    }
    moveIndexRef.current = moves.length;
    onMoveAdvance(moves.length);
  }, [reduced, moves, discsRef, moveIndexRef, onMoveAdvance]);

  useFrame((_, delta) => {
    if (!playing || reduced) {
      // Mesmo parado, sincronizar position dos meshes com state.
      syncMeshPositions(discMeshes.current, discsRef.current);
      return;
    }
    const idx = moveIndexRef.current;
    if (idx >= moves.length) {
      onCompletion();
      return;
    }
    const move = moves[idx];
    if (!move) return;

    elapsedRef.current = (elapsedRef.current ?? 0) + delta;
    const t = Math.min(1, (elapsedRef.current ?? 0) / TOTAL_MOVE);

    // Compute disc position interpolated through phases.
    const movingDisc = discsRef.current.find((d) => d.id === move.discId);
    if (!movingDisc) return;
    const fromPos = pegPosition(move.from);
    const toPos = pegPosition(move.to);
    const stackBefore = movingDisc.heightOnPeg;
    const stackAfter = peakHeight(discsRef.current, move.to, move.discId);

    const fromY = stackBefore * DISC_HEIGHT + DISC_HEIGHT / 2;
    const toY = stackAfter * DISC_HEIGHT + DISC_HEIGHT / 2;
    const peakY = LIFT_HEIGHT;

    let x: number;
    let y: number;
    if (t < 1 / 3) {
      // Phase 1: LIFT (fromY → peakY at fromPos.x)
      const k = ease(t * 3);
      x = fromPos[0];
      y = fromY + (peakY - fromY) * k;
    } else if (t < 2 / 3) {
      // Phase 2: TRANSLATE (fromPos.x → toPos.x at peakY)
      const k = ease((t - 1 / 3) * 3);
      x = fromPos[0] + (toPos[0] - fromPos[0]) * k;
      y = peakY;
    } else {
      // Phase 3: DROP (peakY → toY at toPos.x), snappy easeOutBack for satisfying landing
      const k = easeOutBack((t - 2 / 3) * 3);
      x = toPos[0];
      y = peakY + (toY - peakY) * k;
    }

    const mesh = discMeshes.current[move.discId - 1];
    if (mesh) {
      mesh.position.set(x, y, 0);
    }

    // Sync OUTROS discos (não-movendo) com estado quando parados.
    for (let i = 0; i < discsRef.current.length; i += 1) {
      const d = discsRef.current[i];
      if (!d || d.id === move.discId) continue;
      const m = discMeshes.current[d.id - 1];
      if (!m) continue;
      const dp = pegPosition(d.peg);
      m.position.set(dp[0], d.heightOnPeg * DISC_HEIGHT + DISC_HEIGHT / 2, 0);
    }

    // Phase completion: apply state mutation + advance.
    if (t >= 1) {
      applyMove(discsRef.current, move);
      moveIndexRef.current += 1;
      elapsedRef.current = 0;
      onMoveAdvance(moveIndexRef.current);
      if (moveIndexRef.current >= moves.length) {
        onCompletion();
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 4]} intensity={1.4} castShadow={false} />
      <pointLight position={[0, 4, 3]} intensity={0.4} color={LIME} distance={10} />

      {/* Pegs + labels A/B/C — label é único, usa como key. */}
      {(['A', 'B', 'C'] as const).map((label, i) => {
        const x = pegPosition(i)[0];
        return (
          <group key={`peg-${label}`}>
            <mesh position={[x, PEG_HEIGHT / 2, 0]}>
              <cylinderGeometry args={[PEG_RADIUS, PEG_RADIUS, PEG_HEIGHT, 24]} />
              <meshStandardMaterial color={PEG_COLOR} roughness={0.6} metalness={0.1} />
            </mesh>
            {/* y=-0.35 (posição herdada do <Text>) ficava ABAIXO do plano do
                chão (y=-0.05) e o rótulo era ocluído. Agora fica acima do
                piso e adiantado no eixo z, lendo como etiqueta na base do peg. */}
            <PegLabel position={[x, 0.24, 1.55]} text={label} />
          </group>
        );
      })}

      {/* Floor */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color={FLOOR_COLOR} roughness={0.85} metalness={0} />
      </mesh>

      {/* Floor lime hairline (line segment) */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.22, 64]} />
        <meshBasicMaterial color={LIME} opacity={0.18} transparent />
      </mesh>

      {/* Discs */}
      {Array.from({ length: n }, (_, i) => {
        const id = i + 1;
        return (
          <Disc
            key={id}
            id={id}
            n={n}
            meshRef={(m) => {
              discMeshes.current[id - 1] = m;
            }}
          />
        );
      })}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={14}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 6}
        target={[0, 1.2, 0]}
      />
    </>
  );
}

function Disc({
  id,
  n,
  meshRef,
}: {
  id: number;
  n: number;
  meshRef: (m: THREE.Mesh | null) => void;
}) {
  const radius = DISC_MIN_RADIUS + (id - 1) * DISC_RADIUS_STEP;
  // Hue per disc — varia tom suave do lime/cinza pra acentuar ordem.
  const hueShift = (id - 1) / Math.max(1, n - 1);
  const color = useMemo(() => {
    const base = new THREE.Color('#D2FF00');
    const muted = new THREE.Color('#85a020');
    return base.clone().lerp(muted, hueShift);
  }, [hueShift]);

  return (
    <mesh ref={meshRef} position={pegPosition(0)} castShadow={false} receiveShadow={false}>
      <cylinderGeometry args={[radius, radius, DISC_HEIGHT, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.15}
        emissive={color}
        emissiveIntensity={0.12}
      />
    </mesh>
  );
}

// === Helpers ===

function pegPosition(pegIndex: number): [number, number, number] {
  return [(pegIndex - 1) * PEG_SPACING, 0, 0];
}

function peakHeight(discs: DiscState[], peg: number, excludeId?: number): number {
  let count = 0;
  for (const d of discs) {
    if (d.peg === peg && d.id !== excludeId) count += 1;
  }
  return count;
}

function applyMove(discs: DiscState[], move: Move) {
  const disc = discs.find((d) => d.id === move.discId);
  if (!disc) return;
  // Recompute heights for source and destination pegs.
  const newHeight = peakHeight(discs, move.to, move.discId);
  disc.peg = move.to;
  disc.heightOnPeg = newHeight;

  // Adjust heightOnPeg of remaining discs on source peg (compaction).
  const sourceDiscs = discs.filter((d) => d.peg === move.from && d.id !== move.discId);
  sourceDiscs
    .sort((a, b) => a.heightOnPeg - b.heightOnPeg)
    .forEach((d, idx) => {
      d.heightOnPeg = idx;
    });
}

function syncMeshPositions(meshes: Array<THREE.Mesh | null>, discs: DiscState[]) {
  for (const d of discs) {
    const m = meshes[d.id - 1];
    if (!m) continue;
    const p = pegPosition(d.peg);
    m.position.set(p[0], d.heightOnPeg * DISC_HEIGHT + DISC_HEIGHT / 2, 0);
  }
}

// Standard cubic ease (in-out smoothstep).
function ease(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

// EaseOutBack (overshoot) — slight bounce ao pousar disco.
function easeOutBack(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2;
}

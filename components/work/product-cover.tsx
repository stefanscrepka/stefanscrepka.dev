import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  CaronasDiagram,
  EsteticaDiagram,
  EstruturaCDiagram,
  NexaCoreDiagram,
  SquadsDiagram,
  StjAppDiagram,
} from './diagrams';
import { MockupFrame } from './product-mockup';

// ProductCover — multiplexer:
//   - mode='image'   → next/image com src (quando screenshot real chega)
//   - mode='diagram' → SVG diagram custom por produto (fallback até screenshot)
//   - mode='mockup'  → MockupFrame wrapper de qualquer child custom
//
// Substitui ScreenshotPlaceholder (deprecated) com identidade visual ÚNICA por
// produto. Cada case study tem seu próprio diagrama — nunca o mesmo "SH" genérico.
//
// Para covers cinematográficos (radial-beam, arc-glow, portrait-glow, amber-soft)
// usados quando screenshot=null nos case studies featured, ver CinematicCover.

export type ProductDiagramKey =
  | 'squads'
  | 'nexacore'
  | 'stj'
  | 'estetica'
  | 'caronas'
  | 'estrutura-c';

const DIAGRAM_MAP = {
  squads: SquadsDiagram,
  nexacore: NexaCoreDiagram,
  stj: StjAppDiagram,
  estetica: EsteticaDiagram,
  caronas: CaronasDiagram,
  'estrutura-c': EstruturaCDiagram,
} as const;

type Tone = 'lime' | 'amber';
type AspectRatio = '16/10' | '16/9' | '4/3' | '3/2' | '1/1';
type Tilt = 'none' | 'subtle' | 'cinema';

type ProductCoverProps = {
  /** Tom do glow + border. Amber só pra Estética MD. */
  tone?: Tone | undefined;
  /** Aspect ratio do mockup wrapper. */
  aspectRatio?: AspectRatio | undefined;
  /** Intensidade do 3D tilt. */
  tilt?: Tilt | undefined;
  /** Classes no wrapper externo. */
  className?: string | undefined;
  /** Label acessível (passa pro Mockup + image alt). */
  label: string;
} & (
  | {
      mode: 'image';
      /** Path em /public/screenshots/{slug}.png (entregue pelo Stefan). */
      src: string;
      diagram?: never;
      children?: never;
    }
  | {
      mode: 'diagram';
      /** Qual diagrama SVG mostrar. */
      diagram: ProductDiagramKey;
      src?: never;
      children?: never;
    }
  | {
      mode: 'mockup';
      /** Children custom dentro do mockup. */
      children: React.ReactNode;
      src?: never;
      diagram?: never;
    }
);

const ASPECT_CLASSES: Record<AspectRatio, string> = {
  '16/10': 'aspect-[16/10]',
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '1/1': 'aspect-square',
};

// Translate legacy tilt → boolean tilted prop esperado por MockupFrame.
// 'subtle' e 'cinema' ambos => tilted=true (a intensidade real é gerenciada
// por CSS perspective dentro do MockupFrame, valor único sutil pra evitar
// distorção pesada em screenshots).
function tiltToBoolean(tilt: Tilt): boolean {
  return tilt !== 'none';
}

export function ProductCover(props: ProductCoverProps) {
  const { tone = 'lime', aspectRatio = '16/10', tilt = 'subtle', className, label } = props;

  if (props.mode === 'image') {
    return (
      <MockupFrame
        glow={tone}
        tilted={tiltToBoolean(tilt)}
        className={cn(ASPECT_CLASSES[aspectRatio], className)}
      >
        <Image
          src={props.src}
          alt={label}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority={false}
        />
      </MockupFrame>
    );
  }

  if (props.mode === 'mockup') {
    return (
      <MockupFrame
        glow={tone}
        tilted={tiltToBoolean(tilt)}
        className={cn(ASPECT_CLASSES[aspectRatio], className)}
      >
        {props.children}
      </MockupFrame>
    );
  }

  // mode === 'diagram'
  const DiagramComponent = DIAGRAM_MAP[props.diagram];
  return (
    <MockupFrame
      glow={tone}
      tilted={tiltToBoolean(tilt)}
      className={cn(ASPECT_CLASSES[aspectRatio], className)}
    >
      <div
        className={cn(
          'flex h-full w-full items-center justify-center p-3 sm:p-4',
          'bg-(--color-base)'
        )}
      >
        <DiagramComponent label={label} className="h-full w-full" />
      </div>
    </MockupFrame>
  );
}

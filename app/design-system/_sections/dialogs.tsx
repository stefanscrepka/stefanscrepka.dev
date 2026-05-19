import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function DialogsSection() {
  return (
    <section id="dialogs" className="flex flex-col gap-8">
      <header className="flex flex-col gap-2 hairline-bottom pb-6">
        <p className="eyebrow">03 · Diálogos</p>
        <h2 className="text-3xl font-semibold tracking-tight">4 tipos</h2>
        <p className="max-w-prose text-(--color-text-2) leading-relaxed text-sm">
          Radix Dialog com backdrop blur + spring entrance via{' '}
          <code className="font-mono">data-[state=open]:animate-in</code>. Focus trap + Esc fecha
          automáticos.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Default */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="lg">
              Default
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Recebido</DialogTitle>
              <DialogDescription>
                Sua mensagem caiu na inbox. Respondo em &lt;12h em dias úteis. Se for urgente,
                WhatsApp direto.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost">Fechar</Button>
              <Button>Voltar à home</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Destructive */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="lg">
              Destructive
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apagar este rascunho?</DialogTitle>
              <DialogDescription>
                Essa ação é permanente. O conteúdo deste rascunho será removido sem retorno.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost">Cancelar</Button>
              <Button variant="destructive">Apagar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Form */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="lg">
              Form
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Compartilhar este projeto</DialogTitle>
              <DialogDescription>
                Manda o link pro time. Recebem por email + Slack se conectado.
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="share-email">Email do destinatário</Label>
                <Input id="share-email" type="email" placeholder="dev@time.com" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="share-msg">Mensagem (opcional)</Label>
                <Textarea id="share-msg" placeholder="Bom dia, joga o olho nisso" />
              </div>
            </form>
            <DialogFooter>
              <Button variant="ghost">Cancelar</Button>
              <Button>Compartilhar →</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Content-rich */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" size="lg">
              Content-rich
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Sobre este site</DialogTitle>
              <DialogDescription>Stack honesta + motion narrative + créditos.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 text-sm text-(--color-text-2) leading-relaxed max-h-[60vh] overflow-y-auto">
              <p>
                Construído em Next 16 App Router + Tailwind v4 + Geist + r3f + GSAP + Lenis + Motion
                12 + Shiki SSR + Sentry. Hospedado em Vercel Fluid Compute.
              </p>
              <p>
                Hero 3D scene em react-three-fiber custom — 3 placas glass refractive, NÃO um Spline
                template. Reeded Liquid Glass inspiration reconstruído em código.
              </p>
              <p>
                Motion narrative: cada animação tem razão emocional ou física. Reduced-motion
                fallback obrigatório em toda animação (poster.png estático substitui canvas, marquee
                vira frame único, stats snap pra valor final).
              </p>
              <p className="font-mono text-xs text-(--color-text-3)">
                Fontes: Geist Sans + Geist Mono (Vercel, OFL) · PP Editorial New (Pangram Pangram,
                licença comercial single weight).
              </p>
            </div>
            <DialogFooter>
              <Button variant="ghost">Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const BUTTON_VARIANTS = [
  'default',
  'secondary',
  'outline',
  'ghost',
  'link',
  'destructive',
  'success',
  'accent',
] as const;

const BUTTON_SIZES = ['sm', 'default', 'lg', 'icon'] as const;

export function PrimitivesSection() {
  return (
    <section id="primitives" className="flex flex-col gap-12">
      <header className="flex flex-col gap-2 hairline-bottom pb-6">
        <p className="eyebrow">02 · Primitivos</p>
        <h2 className="text-3xl font-semibold !tracking-[-0.025em] !leading-[1.05]">
          Buttons, cards, form fields, navigation
        </h2>
        <p className="max-w-prose text-(--color-text-2) leading-relaxed text-sm">
          Hand-written em <code className="font-mono">components/ui/</code> usando
          <code className="font-mono"> radix-ui</code> unified +{' '}
          <code className="font-mono">cva</code>. React 19 ref-as-prop (zero{' '}
          <code className="font-mono">forwardRef</code>),
          <code className="font-mono"> data-slot</code> em todo root pra theming via CSS selector.
        </p>
      </header>

      {/* Buttons */}
      <div className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
          Button · 8 variants × 4 sizes (default | sm | lg | icon)
        </p>
        <div className="flex flex-col gap-4">
          {BUTTON_VARIANTS.map((variant) => (
            <div
              key={variant}
              className="flex flex-wrap items-center gap-3 rounded-md border border-(--color-hairline) px-4 py-3"
            >
              <span className="w-24 font-mono text-[11px] uppercase tracking-wider text-(--color-text-3)">
                {variant}
              </span>
              {BUTTON_SIZES.map((size) => (
                <Button key={size} variant={variant} size={size}>
                  {size === 'icon' ? (
                    <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <>
                      <span>{size}</span>
                      <svg viewBox="0 0 24 24" fill="none" className="size-3.5" aria-hidden="true">
                        <path
                          d="M5 12h14M13 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </Button>
              ))}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3 rounded-md border border-(--color-hairline) px-4 py-3">
            <span className="w-24 font-mono text-[11px] uppercase tracking-wider text-(--color-text-3)">
              loading
            </span>
            <Button loading>Enviando</Button>
            <Button variant="secondary" loading>
              Processando
            </Button>
            <Button variant="outline" disabled>
              Disabled
            </Button>
          </div>
        </div>
      </div>

      {/* Card variants */}
      <div className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
          Card · 4 variants
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['default', 'elevated', 'overlay', 'tracing'] as const).map((variant) => (
            <Card key={variant} variant={variant}>
              <CardHeader>
                <CardTitle>
                  Card variant <code className="font-mono text-sm">{variant}</code>
                </CardTitle>
                <CardDescription>
                  {variant === 'default' && 'bg-surface · hairline 1px · inner highlight'}
                  {variant === 'elevated' && 'bg-surface-elevated · shadow-md · highlight'}
                  {variant === 'overlay' && 'bg-surface-overlay · shadow-lg · backdrop-blur'}
                  {variant === 'tracing' && 'hover lime border + glow-lime-sm + lift -2px'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Composição{' '}
                  <code className="font-mono">
                    CardHeader → CardTitle → CardDescription → CardContent → CardFooter
                  </code>
                  .
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  Ver código
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
          Form fields
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <form className="flex flex-col gap-4 rounded-lg border border-(--color-hairline) p-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ds-name">Nome</Label>
              <Input id="ds-name" placeholder="Como posso te chamar?" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ds-email">Email</Label>
              <Input id="ds-email" type="email" placeholder="pra onde respondo" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ds-msg">Mensagem</Label>
              <Textarea id="ds-msg" placeholder="conta o problema" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Como prefere conversar?</Label>
              <RadioGroup defaultValue="wpp" className="flex gap-4">
                {(['wpp', 'email', 'cal'] as const).map((opt) => (
                  <Label
                    key={opt}
                    htmlFor={`ds-radio-${opt}`}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <RadioGroupItem id={`ds-radio-${opt}`} value={opt} />
                    <span className="text-sm">
                      {opt === 'wpp' ? 'WhatsApp' : opt === 'email' ? 'Email' : 'Cal.com'}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <Button type="submit">Enviar →</Button>
          </form>

          <form className="flex flex-col gap-4 rounded-lg border border-(--color-hairline) p-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ds-invalid">Email (estado inválido)</Label>
              <Input id="ds-invalid" defaultValue="not-an-email" aria-invalid="true" />
              <p className="text-xs text-(--color-danger)">Formato inválido: use seu@email.com</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ds-disabled">Disabled</Label>
              <Input id="ds-disabled" defaultValue="value" disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ds-readonly">Readonly</Label>
              <Input id="ds-readonly" defaultValue="snapshot" readOnly />
            </div>
          </form>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
          Tabs · variant line (default) + pill
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-lg border border-(--color-hairline) p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-(--color-text-3)">
              variant=line
            </p>
            <Tabs defaultValue="hanoi">
              <TabsList>
                <TabsTrigger value="hanoi">Hanoi 3D</TabsTrigger>
                <TabsTrigger value="fib">Fibonacci</TabsTrigger>
                <TabsTrigger value="parens">Parênteses</TabsTrigger>
              </TabsList>
              <TabsContent value="hanoi" className="pt-4 text-sm text-(--color-text-2)">
                r3f scene 3D, slider 1-8 discs, auto-solve com easing visible.
              </TabsContent>
              <TabsContent value="fib" className="pt-4 text-sm text-(--color-text-2)">
                Recharts dual-line: ingênuo O(2^n) vs memoizado O(n).
              </TabsContent>
              <TabsContent value="parens" className="pt-4 text-sm text-(--color-text-2)">
                SVG pilha visual com push/pop animado.
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex flex-col gap-3 rounded-lg border border-(--color-hairline) p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-(--color-text-3)">
              variant=pill
            </p>
            <Tabs defaultValue="dev">
              <TabsList variant="pill">
                <TabsTrigger value="dev">Dev</TabsTrigger>
                <TabsTrigger value="staging">Staging</TabsTrigger>
                <TabsTrigger value="prod">Prod</TabsTrigger>
              </TabsList>
              <TabsContent value="dev" className="pt-4 text-sm text-(--color-text-2)">
                localhost:3000 · Sentry sandbox · feature flags abertas.
              </TabsContent>
              <TabsContent value="staging" className="pt-4 text-sm text-(--color-text-2)">
                preview.vercel · Sentry dedicado · canary deploy.
              </TabsContent>
              <TabsContent value="prod" className="pt-4 text-sm text-(--color-text-2)">
                stefanscrepka.dev · Sentry prod · Lighthouse gate ≥92.
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Dropdown + Sheet trigger */}
      <div className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
          DropdownMenu + Sheet
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Opções ▾</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Conta</DropdownMenuLabel>
              <DropdownMenuItem>
                Perfil <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">Abrir Sheet →</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Sheet lateral</SheetTitle>
                <SheetDescription>
                  Slide-in from right via tw-animate-css. Mobile menu pattern.
                </SheetDescription>
              </SheetHeader>
              <p className="mt-6 text-sm text-(--color-text-2) leading-relaxed">
                Esc fecha. Focus trap automático (radix). Backdrop blur sobre overlay.
              </p>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
}

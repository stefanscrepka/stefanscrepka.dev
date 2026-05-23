'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { m } from 'motion/react';
import { useActionState, useEffect, useId, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { EASES } from '@/lib/animation/eases';
import { type ContactState, submitContact } from '@/lib/server-actions/contact';
import { cn } from '@/lib/utils';
import {
  type ContactInput,
  ContactSchema,
  PREFERE_OPTIONS,
  type PrefereCanal,
} from '@/lib/validation/contact-schema';

// ContactForm cinematic — RHF + useActionState. Server Action recebe FormData via
// jsonToFormData bridge. Progressive enhancement: <form action> fallback funciona
// sem JS (Server Action chamada nativamente pelo browser).
//
// Visual:
//   - Inputs hairline strong + focus lime glow (signature inset-bisel premium)
//   - "Como prefere conversar?" vira pill segmented control (não radio circle)
//   - Submit é pill lime grande com hover -2px translateY + glow expand
//   - Success state: TextGenerateEffect-like word reveal "Recebido. Respondo em <12h."
//
// States: idle / submitting / success / error / validation.
// aria-live polite + spring overshoot na success card pra fechar o loop emocional.

const PREFERE_LABELS: Record<PrefereCanal, string> = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  calcom: 'Cal.com 15min',
};

const initialState: ContactState = { status: 'idle' };

const SUCCESS_HEADLINE = 'Recebido. Respondo em <12h.';

export function ContactForm() {
  const reduced = useReducedMotionSafe();
  const formId = useId();
  const [state, action, isPending] = useActionState(submitContact, initialState);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    formState: { errors },
    watch,
    reset,
    trigger,
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      nome: '',
      email: '',
      prefere: 'email',
      mensagem: '',
      website: '',
    },
  });

  const prefereValue = watch('prefere');

  // Quando action retorna success, mostrar card e resetar form.
  useEffect(() => {
    if (state.status === 'success') {
      setShowSuccess(true);
      reset();
    }
  }, [state, reset]);

  // Server-side validation errors injetados no form (caso bypass do client passe).
  useEffect(() => {
    if (state.status !== 'validation') return;
    // RHF não tem setError tipado pra batch — caso necessário, expandir aqui.
  }, [state]);

  // W1.1+W1.3 (2026-05-23): submit nativo via React 19 form action.
  // RHF agora SÓ valida (trigger()), não controla submit. Se inválido, bloqueia
  // o submit nativo via preventDefault — erros renderizam via formState.errors.
  // Se válido, deixa o submit nativo passar — browser monta FormData a partir
  // dos inputs com name="..." e React invoca action={action} com esse FormData.
  // Antes: onValid() chamava requestSubmit() recursivo + jsonToFormData
  // descartado com void fd → bug + radio "prefere" sem name → null no server.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const ok = await trigger();
    if (!ok) {
      e.preventDefault();
    }
  };

  const handleSendAnother = () => {
    setShowSuccess(false);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ───────────── SUCCESS STATE ─────────────
  // Word-stagger reveal do headline ("Recebido. Respondo em <12h.") —
  // ecoa o pattern do Manifesto e fecha o loop motion. Spring overshoot
  // no container + check icon com glow lime.
  if (showSuccess) {
    const headlineWords = SUCCESS_HEADLINE.split(' ');

    return (
      <m.div
        role="status"
        aria-live="polite"
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={
          reduced ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 22, mass: 1 }
        }
        className={cn(
          'flex flex-col gap-5 rounded-2xl border border-(--color-accent)',
          'bg-(--color-accent-subtle) p-7 sm:p-9 shadow-(--shadow-glow-lime-sm)'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex size-12 items-center justify-center rounded-full',
            'bg-(--color-accent) text-(--color-text-on-accent) shadow-(--shadow-glow-lime-md)'
          )}
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
            <path
              d="M5 12.5 10 17.5 19.5 8"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <div className="flex flex-col gap-3">
          <h3
            className={cn(
              'text-2xl sm:text-3xl font-semibold tracking-[-0.025em] leading-[1.1]',
              'text-(--color-text-1)'
            )}
          >
            {reduced ? (
              SUCCESS_HEADLINE
            ) : (
              <>
                {/* SR-only full headline → leitores de tela anunciam a frase inteira de
                  uma só vez. Visual word-stagger fica aria-hidden — evita word-by-word
                  speech robotizado. */}
                <span className="sr-only">{SUCCESS_HEADLINE}</span>
                <span aria-hidden="true">
                  {headlineWords.map((word, idx) => (
                    <m.span
                      // biome-ignore lint/suspicious/noArrayIndexKey: SUCCESS_HEADLINE constante (split estático); word + idx + length pra unicidade caso palavra se repita
                      key={`success-w-${word}-${idx}-${word.length}`}
                      initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.5,
                        delay: 0.15 + idx * 0.05,
                        ease: EASES.outQuint,
                      }}
                      className="inline-block"
                    >
                      {word}
                      {idx < headlineWords.length - 1 ? ' ' : ''}
                    </m.span>
                  ))}
                </span>
              </>
            )}
          </h3>
          <p className="text-sm leading-relaxed text-(--color-text-2)">
            Confirmação automática chegou no seu email. Se for urgente, WhatsApp direto:{' '}
            <span className="font-mono text-(--color-text-1)">(42) 99859-2522</span>.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSendAnother}
          className={cn(
            'self-start font-mono text-xs uppercase tracking-widest text-(--color-accent)',
            'outline-none underline-offset-4 transition-colors hover:underline focus-visible:underline'
          )}
        >
          Enviar outra mensagem →
        </button>
      </m.div>
    );
  }

  // ───────────── FORM ─────────────
  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-6 sm:gap-7"
      aria-describedby={`${formId}-status`}
      aria-busy={isPending}
    >
      {/* Honeypot — invisível pra humanos, visível pra bots */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register('website')}
        className="absolute -left-[9999px] size-px opacity-0"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        <Field
          label="Nome"
          error={errors.nome?.message}
          input={
            <Input
              id={`${formId}-nome`}
              {...register('nome')}
              placeholder="Como posso te chamar?"
              autoComplete="name"
              aria-invalid={!!errors.nome}
              aria-describedby={errors.nome ? `${formId}-nome-error` : undefined}
              className="h-12 text-base"
            />
          }
          errorId={`${formId}-nome-error`}
          fieldId={`${formId}-nome`}
        />

        <Field
          label="Email"
          error={errors.email?.message}
          input={
            <Input
              id={`${formId}-email`}
              type="email"
              {...register('email')}
              placeholder="Pra onde respondo"
              autoComplete="email"
              inputMode="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? `${formId}-email-error` : undefined}
              className="h-12 text-base"
            />
          }
          errorId={`${formId}-email-error`}
          fieldId={`${formId}-email`}
        />
      </div>

      {/* Pill segmented control "Como prefere conversar?".
          Native radios (a11y), styled como pills lime-on-active. */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium leading-none text-(--color-text-1)">
          Como prefere conversar?
        </legend>
        <div
          role="radiogroup"
          aria-invalid={!!errors.prefere}
          aria-labelledby={errors.prefere ? `${formId}-prefere-error` : undefined}
          className={cn(
            'inline-flex flex-wrap gap-2 rounded-pill p-1',
            'border border-(--color-hairline) bg-(--color-surface)/40 shadow-(--shadow-inset-bisel)'
          )}
        >
          {PREFERE_OPTIONS.map((option) => {
            const active = prefereValue === option;
            const id = `${formId}-prefere-${option}`;
            return (
              <label key={option} htmlFor={id} className="contents">
                {/* W1.3 (2026-05-23): {...register('prefere')} adiciona
                    name="prefere" + ref/onChange RHF. Sem isso, Server Action
                    fazia formData.get('prefere') === null → Zod parse falhava
                    silenciosamente e o canal preferido nunca chegava no email. */}
                <input
                  {...register('prefere')}
                  id={id}
                  type="radio"
                  value={option}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    'inline-flex cursor-pointer items-center justify-center gap-2',
                    'rounded-pill px-4 py-2 sm:px-5 sm:py-2.5',
                    'font-mono text-xs uppercase tracking-widest',
                    'border outline-none transition-all duration-(--motion-fast) ease-(--ease-standard)',
                    'peer-focus-visible:shadow-(--shadow-glow-lime-sm)',
                    active
                      ? [
                          'border-(--color-accent) bg-(--color-accent)',
                          'text-(--color-text-on-accent)',
                          'shadow-(--shadow-glow-lime-sm)',
                        ].join(' ')
                      : [
                          'border-(--color-hairline)/0 bg-transparent',
                          'text-(--color-text-2) hover:text-(--color-text-1)',
                          'hover:bg-(--color-surface-elevated)/60',
                        ].join(' ')
                  )}
                >
                  {PREFERE_LABELS[option]}
                </span>
              </label>
            );
          })}
        </div>
        {errors.prefere ? (
          <p
            id={`${formId}-prefere-error`}
            role="alert"
            className="font-mono text-xs text-(--color-danger)"
          >
            {errors.prefere.message}
          </p>
        ) : null}
      </fieldset>

      <Field
        label="Sobre o que?"
        error={errors.mensagem?.message}
        input={
          <Textarea
            id={`${formId}-mensagem`}
            {...register('mensagem')}
            placeholder="Conta o problema. Eu respondo se faz sentido."
            rows={5}
            aria-invalid={!!errors.mensagem}
            aria-describedby={errors.mensagem ? `${formId}-mensagem-error` : undefined}
            className="min-h-32 text-base leading-relaxed"
          />
        }
        errorId={`${formId}-mensagem-error`}
        fieldId={`${formId}-mensagem`}
      />

      {/* Submit row: pill lime grande + microcopy mono.
          Hover -2px translateY + glow expand (sem scale per anti-pattern). */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <Button
          type="submit"
          variant="default"
          size="lg"
          loading={isPending}
          aria-label={isPending ? 'Enviando mensagem' : 'Enviar mensagem'}
          className={cn(
            'h-14 px-9 text-base font-semibold sm:self-start',
            'transition-[transform,box-shadow] duration-(--motion-fast) ease-(--ease-standard)',
            'hover:-translate-y-0.5 hover:shadow-(--shadow-glow-lime-md)',
            // Cancela o scale active default — usamos translateY only.
            'active:scale-100'
          )}
        >
          {isPending ? 'Enviando…' : 'Enviar →'}
        </Button>

        <div className="flex flex-col gap-1">
          <p
            id={`${formId}-status`}
            role="status"
            aria-live="polite"
            className={cn(
              'font-mono text-2xs uppercase tracking-widest leading-relaxed',
              state.status === 'error' ? 'text-(--color-danger)' : 'text-(--color-text-3)'
            )}
          >
            {state.status === 'error' ? state.message : 'Resposta em <12h em dias úteis.'}
          </p>
          {/* W1.6 (2026-05-23): consentimento LGPD — link pra política. */}
          <p className="font-mono text-2xs tracking-wide text-(--color-text-3)">
            Ao enviar, você aceita a{' '}
            <a
              href="/privacidade"
              className="text-(--color-accent) underline-offset-4 hover:underline"
            >
              política de privacidade
            </a>
            .
          </p>
        </div>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  error: string | undefined;
  input: React.ReactNode;
  errorId: string;
  fieldId: string;
}

function Field({ label, error, input, errorId, fieldId }: FieldProps) {
  return (
    <div className="group/field flex flex-col gap-2.5" data-disabled="false">
      <Label
        htmlFor={fieldId}
        className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)"
      >
        {label}
      </Label>
      {input}
      {error ? (
        <p id={errorId} role="alert" className="font-mono text-xs text-(--color-danger)">
          {error}
        </p>
      ) : null}
    </div>
  );
}

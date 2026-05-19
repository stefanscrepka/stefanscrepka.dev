'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { m } from 'motion/react';
import { useActionState, useEffect, useId, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { type ContactState, submitContact } from '@/lib/server-actions/contact';
import { jsonToFormData } from '@/lib/server-actions/form-data-bridge';
import { cn } from '@/lib/utils';
import {
  type ContactInput,
  ContactSchema,
  PREFERE_OPTIONS,
  type PrefereCanal,
} from '@/lib/validation/contact-schema';

// ContactForm — RHF + useActionState. Server Action recebe FormData via
// jsonToFormData bridge (gotcha #5). Progressive enhancement: <form action>
// fallback funciona sem JS (Server Action chamada nativamente pelo browser).
//
// States: idle / submitting / success / error / validation.
// aria-live polite num status panel; spring overshoot na success card.

const PREFERE_LABELS: Record<PrefereCanal, string> = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  calcom: 'Cal.com',
};

const initialState: ContactState = { status: 'idle' };

export function ContactForm() {
  const reduced = useReducedMotionSafe();
  const formId = useId();
  const [state, action, isPending] = useActionState(submitContact, initialState);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
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

  // Quando o action retorna success, mostrar card e resetar form depois.
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
    // Por enquanto deixamos a UI mostrar o erro genérico do server.
  }, [state]);

  const onValid = (data: ContactInput) => {
    if (!formRef.current) return;
    const fd = jsonToFormData(data);
    formRef.current.requestSubmit();
    // o requestSubmit acima dispara o action via form action — mas usamos
    // o jsonToFormData só pra garantir formato. RHF gerencia inputs nativos.
    void fd;
  };

  const handleSendAnother = () => {
    setShowSuccess(false);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (showSuccess) {
    return (
      <m.div
        role="status"
        aria-live="polite"
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={
          reduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 18, mass: 1 }
        }
        className={cn(
          'flex flex-col gap-4 rounded-2xl border border-(--color-accent)',
          'bg-(--color-accent-subtle) p-6 sm:p-8'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex size-10 items-center justify-center rounded-full',
            'bg-(--color-accent) text-(--color-text-on-accent) shadow-(--shadow-glow-lime-sm)'
          )}
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
            <path
              d="M5 12.5 10 17.5 19.5 8"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold tracking-tight text-(--color-text-1)">
            Recebido. Respondo em &lt;12h.
          </h3>
          <p className="text-sm leading-relaxed text-(--color-text-2)">
            Confirmação automática chegou no seu email. Se for urgente, WhatsApp direto: (42)
            99859-2522.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSendAnother}
          className={cn(
            'self-start font-mono text-xs text-(--color-accent) underline-offset-4',
            'outline-none transition-colors hover:underline focus-visible:underline'
          )}
        >
          Enviar outra mensagem →
        </button>
      </m.div>
    );
  }

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={handleSubmit(onValid)}
      noValidate
      className="flex flex-col gap-5"
      aria-describedby={`${formId}-status`}
      aria-busy={isPending}
    >
      {/* Honeypot: invisível pra humanos, visível pra bots */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register('website')}
        className="absolute -left-[9999px] size-px opacity-0"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Nome"
          name="nome"
          error={errors.nome?.message}
          input={
            <Input
              id={`${formId}-nome`}
              {...register('nome')}
              placeholder="Como posso te chamar?"
              autoComplete="name"
              aria-invalid={!!errors.nome}
              aria-describedby={errors.nome ? `${formId}-nome-error` : undefined}
            />
          }
          errorId={`${formId}-nome-error`}
          fieldId={`${formId}-nome`}
        />

        <Field
          label="Email"
          name="email"
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
            />
          }
          errorId={`${formId}-email-error`}
          fieldId={`${formId}-email`}
        />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-(--color-text-1)">
          Como prefere conversar?
        </legend>
        <RadioGroup
          value={prefereValue}
          onValueChange={(v) => setValue('prefere', v as PrefereCanal, { shouldValidate: true })}
          className="flex flex-wrap gap-x-6 gap-y-3"
          aria-invalid={!!errors.prefere}
        >
          {PREFERE_OPTIONS.map((option) => (
            <label
              key={option}
              htmlFor={`${formId}-prefere-${option}`}
              className="group/radio inline-flex cursor-pointer items-center gap-2.5"
            >
              <RadioGroupItem id={`${formId}-prefere-${option}`} value={option} />
              <span className="text-sm text-(--color-text-2) group-hover/radio:text-(--color-text-1)">
                {PREFERE_LABELS[option]}
              </span>
            </label>
          ))}
        </RadioGroup>
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
        name="mensagem"
        error={errors.mensagem?.message}
        input={
          <Textarea
            id={`${formId}-mensagem`}
            {...register('mensagem')}
            placeholder="Conta o problema. Eu respondo se faz sentido."
            rows={5}
            aria-invalid={!!errors.mensagem}
            aria-describedby={errors.mensagem ? `${formId}-mensagem-error` : undefined}
          />
        }
        errorId={`${formId}-mensagem-error`}
        fieldId={`${formId}-mensagem`}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          variant="default"
          size="lg"
          loading={isPending}
          aria-label={isPending ? 'Enviando mensagem' : 'Enviar mensagem'}
          className="sm:self-start"
        >
          {isPending ? 'Enviando…' : 'Enviar →'}
        </Button>

        <p
          id={`${formId}-status`}
          role="status"
          aria-live="polite"
          className={cn(
            'font-mono text-xs leading-relaxed',
            state.status === 'error' ? 'text-(--color-danger)' : 'text-(--color-text-3)'
          )}
        >
          {state.status === 'error'
            ? state.message
            : 'Respondo em <12h em dias úteis. Se for urgente, WhatsApp direto: (42) 99859-2522.'}
        </p>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: string;
  error: string | undefined;
  input: React.ReactNode;
  errorId: string;
  fieldId: string;
}

function Field({ label, error, input, errorId, fieldId }: FieldProps) {
  return (
    <div className="group/field flex flex-col gap-2" data-disabled="false">
      <Label htmlFor={fieldId}>{label}</Label>
      {input}
      {error ? (
        <p id={errorId} role="alert" className="font-mono text-xs text-(--color-danger)">
          {error}
        </p>
      ) : null}
    </div>
  );
}

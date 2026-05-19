import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import type { PrefereCanal } from '@/lib/validation/contact-schema';

// React Email — confirmação auto-reply enviada ao usuário.
// Paleta espelha o site (dark base + lime accent) com hex compilado dos OKLCH
// (clients de email não consomem CSS vars). Hex equivalentes:
//   base #080A07 · surface #0F1310 · accent #D2FF00 · text-1 #FAFAFA · text-3 #8C8E8B.

interface ContactConfirmationProps {
  nome: string;
  prefere: PrefereCanal;
  mensagem: string;
}

const PREFERE_COPY: Record<PrefereCanal, string> = {
  whatsapp: 'Vou puxar conversa no WhatsApp em <12h.',
  email: 'Resposta vem por este email em <12h.',
  calcom:
    'Te mando link de agendamento se fizer sentido, ou agenda direto em stefanscrepka.dev/#contato.',
};

export function ContactConfirmation({ nome, prefere, mensagem }: ContactConfirmationProps) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>Confirmação automática · Stefan Heinz Screpka</Preview>
      <Tailwind>
        <Body className="bg-[#080A07] font-mono text-[#FAFAFA]">
          <Container className="mx-auto max-w-[560px] px-6 py-10">
            <Text className="text-xs uppercase tracking-[0.16em] text-[#8C8E8B]">
              S/H · STEFAN HEINZ SCREPKA
            </Text>

            <Text className="mt-6 text-3xl font-semibold leading-tight text-[#D2FF00]">
              Recebido.
            </Text>

            <Text className="mt-4 text-base leading-relaxed text-[#FAFAFA]">
              Oi {nome}, mensagem chegou aqui. Respondo em &lt;12h em dias úteis.
            </Text>

            <Text className="mt-2 text-base leading-relaxed text-[#FAFAFA]">
              {PREFERE_COPY[prefere]}
            </Text>

            <Hr className="my-6 border-t border-[#1D2319]" />

            <Text className="text-[11px] uppercase tracking-[0.16em] text-[#8C8E8B]">
              SUA MENSAGEM
            </Text>
            <Section className="mt-2 rounded-md border-l-2 border-[#D2FF00] bg-[#0F1310] p-4">
              <Text className="m-0 text-sm leading-relaxed text-[#BFC1BE] whitespace-pre-wrap">
                {mensagem}
              </Text>
            </Section>

            <Hr className="my-6 border-t border-[#1D2319]" />

            <Text className="text-sm leading-relaxed text-[#BFC1BE]">
              Se for urgente, WhatsApp direto:{' '}
              <Link
                href="https://wa.me/5542998592522"
                className="text-[#D2FF00] underline-offset-2"
              >
                (42) 99859-2522
              </Link>
              .
            </Text>

            <Text className="mt-8 text-xs text-[#8C8E8B]">
              Stefan Heinz Screpka · AI Product Engineer ·{' '}
              <Link href="https://stefanscrepka.dev" className="text-[#D2FF00]">
                stefanscrepka.dev
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default ContactConfirmation;

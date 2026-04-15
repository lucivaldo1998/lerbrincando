import { z } from 'zod';

export function sanitizeCpf(v: string) {
  return (v || '').replace(/\D/g, '');
}

export function validCpf(cpf: string): boolean {
  const s = sanitizeCpf(cpf);
  if (s.length !== 11 || /^(\d)\1+$/.test(s)) return false;
  const calc = (slice: number) => {
    let sum = 0;
    for (let i = 0; i < slice; i++) sum += parseInt(s[i], 10) * (slice + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return calc(9) === parseInt(s[9], 10) && calc(10) === parseInt(s[10], 10);
}

export function sanitizePhone(v: string) {
  return (v || '').replace(/\D/g, '');
}

export const pixCheckoutSchema = z.object({
  name: z.string().min(3, 'Informe o nome completo'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().refine((v) => validCpf(v), 'CPF inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  answers: z.record(z.any()).optional(),
  utms: z.record(z.string()).optional(),
});

export const cardCheckoutSchema = pixCheckoutSchema.extend({
  token: z.string().min(5),
  installments: z.number().int().min(1).max(12),
  paymentMethodId: z.string().min(2),
  issuerId: z.string().optional(),
});

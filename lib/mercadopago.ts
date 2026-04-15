import { MercadoPagoConfig, Payment } from 'mercadopago';

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken && process.env.NODE_ENV === 'production') {
  console.warn('[mercadopago] MP_ACCESS_TOKEN não configurado.');
}

export const mpClient = new MercadoPagoConfig({
  accessToken: accessToken || 'TEST-MISSING',
  options: { timeout: 15000 },
});

export const mpPayment = new Payment(mpClient);

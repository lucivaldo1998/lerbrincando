'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { loadAnswers, getUtms } from '@/lib/answers';

declare global {
  interface Window {
    MercadoPago?: any;
  }
}

const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '';

type Method = 'pix' | 'card';

function onlyDigits(v: string) { return v.replace(/\D/g, ''); }
function formatCpf(v: string) {
  const s = onlyDigits(v).slice(0, 11);
  return s.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
function formatPhone(v: string) {
  const s = onlyDigits(v).slice(0, 11);
  if (s.length <= 10) return s.replace(/(\d{2})(\d{0,4})(\d{0,4})/, (_, a, b, c) => `(${a}) ${b}${c ? '-' + c : ''}`);
  return s.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
}
function formatCard(v: string) {
  return onlyDigits(v).slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}
function formatExp(v: string) {
  const s = onlyDigits(v).slice(0, 4);
  return s.length <= 2 ? s : s.slice(0, 2) + '/' + s.slice(2);
}

export function CheckoutForm({ price, priceFormatted, installmentValue }: { price: number; priceFormatted: string; installmentValue: string }) {
  const router = useRouter();
  const [method, setMethod] = useState<Method>('pix');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mpReady, setMpReady] = useState(false);
  const mpRef = useRef<any>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    emailConfirm: '',
    cpf: '',
    phone: '',
    cardNumber: '',
    cardHolder: '',
    cardExp: '',
    cardCvv: '',
    installments: 1,
  });

  useEffect(() => {
    if (window.MercadoPago && MP_PUBLIC_KEY && !mpRef.current) {
      try {
        mpRef.current = new window.MercadoPago(MP_PUBLIC_KEY, { locale: 'pt-BR' });
        setMpReady(true);
      } catch (e) {
        console.error('MP init', e);
      }
    }
  }, []);

  function onMpLoad() {
    if (!MP_PUBLIC_KEY) return;
    try {
      mpRef.current = new window.MercadoPago(MP_PUBLIC_KEY, { locale: 'pt-BR' });
      setMpReady(true);
    } catch (e) {
      console.error('MP init', e);
    }
  }

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validateCommon(): string | null {
    if (form.name.trim().split(/\s+/).length < 2) return 'Informe nome e sobrenome';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'E-mail inválido';
    if (form.email !== form.emailConfirm) return 'Os e-mails não coincidem';
    if (onlyDigits(form.cpf).length !== 11) return 'CPF inválido';
    if (onlyDigits(form.phone).length < 10) return 'Telefone inválido';
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cv = validateCommon();
    if (cv) { setError(cv); return; }

    setLoading(true);
    try {
      const answers = loadAnswers();
      const utms = getUtms();

      if (method === 'pix') {
        const res = await fetch('/api/checkout/pix', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            cpf: onlyDigits(form.cpf),
            phone: onlyDigits(form.phone),
            answers, utms,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Falha ao gerar PIX');
        router.push(`/obrigado?id=${data.orderId}`);
      } else {
        // Cartão: tokeniza com MP.js
        if (!mpRef.current) throw new Error('Aguardando SDK Mercado Pago — tente novamente em 2s');
        if (onlyDigits(form.cardNumber).length < 13) throw new Error('Número do cartão inválido');
        const [mm, yy] = form.cardExp.split('/');
        if (!mm || !yy || mm.length !== 2 || yy.length !== 2) throw new Error('Validade inválida (MM/AA)');

        const tokenRes = await mpRef.current.createCardToken({
          cardNumber: onlyDigits(form.cardNumber),
          cardholderName: form.cardHolder.trim(),
          cardExpirationMonth: mm,
          cardExpirationYear: '20' + yy,
          securityCode: form.cardCvv,
          identificationType: 'CPF',
          identificationNumber: onlyDigits(form.cpf),
        });

        if (!tokenRes?.id) throw new Error('Não foi possível validar o cartão. Verifique os dados.');

        const paymentMethod = await mpRef.current.getPaymentMethods({ bin: onlyDigits(form.cardNumber).slice(0, 6) });
        const paymentMethodId = paymentMethod?.results?.[0]?.id || 'visa';

        const res = await fetch('/api/checkout/card', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            cpf: onlyDigits(form.cpf),
            phone: onlyDigits(form.phone),
            token: tokenRes.id,
            installments: Number(form.installments),
            paymentMethodId,
            answers, utms,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Falha no pagamento');
        router.push(`/obrigado?id=${data.orderId}`);
      }
    } catch (err: any) {
      setError(err.message || String(err));
      setLoading(false);
    }
  }

  const installmentOptions = [1, 2, 3, 4, 5].map((n) => ({
    n,
    label: n === 1 ? `1× de R$ ${price.toFixed(2).replace('.', ',')} sem juros` : `${n}× de R$ ${(price / n).toFixed(2).replace('.', ',')} sem juros`,
  }));

  return (
    <>
      <Script src="https://sdk.mercadopago.com/js/v2" strategy="afterInteractive" onLoad={onMpLoad} />

      <form onSubmit={submit} className="space-y-4 animate-fade-up">
        <div className="card !p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Seu plano personalizado</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="font-display text-lg font-extrabold text-ink leading-tight">Plano de Alfabetização<br/>— 30 Dias</p>
            <div className="text-right">
              <p className="font-display text-3xl font-extrabold text-brand-600">R$ {priceFormatted}</p>
              <p className="text-xs text-ink/60">ou 5× de R$ {installmentValue}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="label">1. Seus dados</p>
          <div className="space-y-2.5">
            <input className="input" placeholder="Nome completo" value={form.name} onChange={(e) => update('name', e.target.value)} required />
            <input className="input" type="email" placeholder="Seu melhor e-mail" value={form.email} onChange={(e) => update('email', e.target.value)} required />
            <input className="input" type="email" placeholder="Confirme seu e-mail" value={form.emailConfirm} onChange={(e) => update('emailConfirm', e.target.value)} required />
            <input className="input" placeholder="CPF" value={form.cpf} onChange={(e) => update('cpf', formatCpf(e.target.value))} inputMode="numeric" required />
            <input className="input" placeholder="Celular com DDD" value={form.phone} onChange={(e) => update('phone', formatPhone(e.target.value))} inputMode="numeric" required />
          </div>
        </div>

        <div>
          <p className="label">2. Forma de pagamento</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setMethod('pix')}
              className={`rounded-2xl border-2 p-3 text-sm font-bold transition ${method === 'pix' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-brand-100 text-ink/60'}`}>
              <span className="mr-1">⚡</span> PIX
              <span className="block text-[10px] font-normal text-ink/50">Aprovação imediata</span>
            </button>
            <button type="button" onClick={() => setMethod('card')}
              className={`rounded-2xl border-2 p-3 text-sm font-bold transition ${method === 'card' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-brand-100 text-ink/60'}`}>
              <span className="mr-1">💳</span> Cartão
              <span className="block text-[10px] font-normal text-ink/50">Até 5× sem juros</span>
            </button>
          </div>
        </div>

        {method === 'card' && (
          <div className="space-y-2.5 animate-fade-up">
            <input className="input" placeholder="Número do cartão" value={form.cardNumber} onChange={(e) => update('cardNumber', formatCard(e.target.value))} inputMode="numeric" required />
            <input className="input" placeholder="Nome impresso no cartão" value={form.cardHolder} onChange={(e) => update('cardHolder', e.target.value.toUpperCase())} required />
            <div className="grid grid-cols-2 gap-2">
              <input className="input" placeholder="MM/AA" value={form.cardExp} onChange={(e) => update('cardExp', formatExp(e.target.value))} inputMode="numeric" required />
              <input className="input" placeholder="CVV" value={form.cardCvv} onChange={(e) => update('cardCvv', onlyDigits(e.target.value).slice(0, 4))} inputMode="numeric" required />
            </div>
            <select className="input" value={form.installments} onChange={(e) => update('installments', Number(e.target.value))}>
              {installmentOptions.map((o) => <option key={o.n} value={o.n}>{o.label}</option>)}
            </select>
          </div>
        )}

        {method === 'pix' && (
          <div className="rounded-2xl bg-brand-50 p-3 text-xs text-ink/70">
            Após clicar em <b>Pagar</b>, você verá o QR Code para pagar em segundos. A liberação é automática.
          </div>
        )}

        {error && <div className="rounded-2xl bg-coral-500/10 p-3 text-sm font-semibold text-coral-600">{error}</div>}

        <button type="submit" className="btn-primary" disabled={loading || (method === 'card' && !mpReady)}>
          {loading ? 'Processando…' : method === 'pix' ? `Gerar PIX · R$ ${priceFormatted}` : `Pagar R$ ${priceFormatted} →`}
        </button>

        <p className="text-center text-xs text-ink/50">
          🔒 Pagamento processado pelo Mercado Pago. Seus dados não passam pelo nosso servidor.
        </p>
      </form>
    </>
  );
}

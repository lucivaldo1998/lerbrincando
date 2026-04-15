'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/lib/config';

type Order = {
  id: string;
  status: string;
  paymentMethod: string;
  amountCents: number;
  mpQrCode: string | null;
  mpQrCodeBase64: string | null;
  mpTicketUrl: string | null;
};

export function PixWaiting({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  useEffect(() => {
    let stopped = false;
    async function tick() {
      try {
        const res = await fetch(`/api/order/${orderId}/status`, { cache: 'no-store' });
        const data = await res.json();
        if (!stopped) setOrder(data);
      } catch {}
    }
    tick();
    const iv = setInterval(tick, 4000);
    return () => { stopped = true; clearInterval(iv); };
  }, [orderId]);

  useEffect(() => {
    const iv = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (order?.status === 'approved') router.push(`/obrigado/sucesso?id=${orderId}`);
  }, [order?.status, orderId, router]);

  if (!order) {
    return <div className="py-12 text-center text-brand-700">Carregando pagamento…</div>;
  }

  if (order.status === 'rejected' || order.status === 'cancelled') {
    return (
      <div className="card text-center">
        <p className="text-4xl">😕</p>
        <h2 className="mt-3 font-display text-xl font-extrabold text-ink">Pagamento não aprovado</h2>
        <p className="mt-2 text-sm text-ink/70">Seu pagamento foi recusado. Você pode tentar novamente com outro método.</p>
        <button onClick={() => router.push('/checkout')} className="btn-primary mt-4">Tentar novamente</button>
      </div>
    );
  }

  if (order.paymentMethod !== 'pix') {
    // Cartão: confirmar pela polling
    return (
      <div className="card text-center">
        <div className="mx-auto grid h-16 w-16 animate-pulse-soft place-items-center rounded-full bg-brand-100 text-3xl">💳</div>
        <h2 className="mt-3 font-display text-xl font-extrabold text-ink">Confirmando pagamento…</h2>
        <p className="mt-2 text-sm text-ink/70">Aguarde alguns segundos enquanto confirmamos com o cartão.</p>
      </div>
    );
  }

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');

  async function copyCode() {
    if (!order?.mpQrCode) return;
    await navigator.clipboard.writeText(order.mpQrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="animate-fade-up">
      <div className="rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-5 text-center text-white shadow-soft">
        <p className="text-xs font-bold uppercase tracking-wider opacity-80">Pague via PIX</p>
        <p className="mt-1 font-display text-2xl font-extrabold">R$ {(order.amountCents / 100).toFixed(2).replace('.', ',')}</p>
        <p className="mt-1 text-xs opacity-80">Expira em {mm}:{ss}</p>
      </div>

      {order.mpQrCodeBase64 && (
        <div className="mt-5 text-center">
          <p className="text-sm font-bold text-ink">1. Escaneie o QR Code</p>
          <div className="mx-auto mt-3 inline-block rounded-3xl border-2 border-brand-200 bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`data:image/png;base64,${order.mpQrCodeBase64}`} alt="PIX QR Code" className="h-56 w-56" />
          </div>
        </div>
      )}

      {order.mpQrCode && (
        <div className="mt-5">
          <p className="text-sm font-bold text-ink">2. Ou copie o código PIX</p>
          <div className="mt-2 break-all rounded-2xl border-2 border-brand-200 bg-brand-50 p-3 text-xs font-mono text-ink/80">
            {order.mpQrCode}
          </div>
          <button onClick={copyCode} className="btn-primary mt-3">
            {copied ? '✅ Copiado!' : '📋 Copiar código PIX'}
          </button>
        </div>
      )}

      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-sun-500/10 p-3 text-sm text-ink">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-white">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/><path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
        </div>
        <div>
          <p className="font-bold">Aguardando pagamento…</p>
          <p className="text-xs text-ink/60">Assim que você pagar, a página atualiza sozinha.</p>
        </div>
      </div>

      <div className="mt-5 text-center text-xs text-ink/50">
        Dúvidas? Fale conosco no WhatsApp{' '}
        <a href={`https://wa.me/${siteConfig.whatsappClean}`} className="font-bold text-brand-600">clique aqui</a>.
      </div>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { siteConfig } from '@/lib/config';

type Order = {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCpf: string;
  amountCents: number;
  paymentMethod: string;
  status: string;
  quizAnswers: Record<string, any>;
  utmSource?: string | null;
  utmCampaign?: string | null;
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-sun-500/20 text-ink',
  approved: 'bg-brand-500 text-white',
  rejected: 'bg-coral-500/20 text-coral-600',
  cancelled: 'bg-ink/10 text-ink/60',
  refunded: 'bg-ink/20 text-ink/70',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Recusado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
};

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter) params.set('status', filter);
    if (q) params.set('q', q);
    const res = await fetch(`/api/admin/orders?${params}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
      setStats(data.stats || []);
    }
    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);
  useEffect(() => {
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, [filter, q]);

  async function setStatus(id: string, newStatus: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    load();
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    window.location.href = '/admin';
  }

  const summary = useMemo(() => {
    const m: Record<string, { count: number; sum: number }> = {};
    stats.forEach((s: any) => { m[s.status] = { count: s._count, sum: s._sum?.amountCents || 0 }; });
    const total = Object.values(m).reduce((a, b) => a + b.count, 0);
    const approved = m.approved?.count || 0;
    const revenue = (m.approved?.sum || 0) / 100;
    return { total, approved, revenue, pending: m.pending?.count || 0 };
  }, [stats]);

  return (
    <div className="w-full max-w-full">
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard label="Pedidos" value={String(summary.total)} />
        <StatCard label="Aprovados" value={String(summary.approved)} highlight />
        <StatCard label="Pendentes" value={String(summary.pending)} />
        <StatCard label="Receita" value={`R$ ${summary.revenue.toFixed(2).replace('.', ',')}`} highlight />
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="flex flex-wrap gap-1">
          {['', 'approved', 'pending', 'rejected', 'cancelled', 'refunded'].map((s) => (
            <button key={s || 'all'} onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${filter === s ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-700'}`}>
              {s ? STATUS_LABEL[s] : 'Todos'}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); load(); }} className="flex-1">
          <input className="input !py-2" placeholder="Buscar por nome, e-mail, telefone, CPF, ID…" value={q} onChange={(e) => setQ(e.target.value)} />
        </form>
        <button onClick={logout} className="rounded-2xl border-2 border-brand-200 px-3 py-2 text-xs font-bold text-brand-700 hover:bg-brand-50">Sair</button>
      </div>

      {loading && <p className="py-6 text-center text-sm text-ink/50">Carregando…</p>}

      <div className="space-y-2">
        {orders.map((o) => {
          const isOpen = expanded === o.id;
          const waText = encodeURIComponent(`Olá ${o.customerName.split(' ')[0]}! Aqui é do ${siteConfig.brand} 💜 Sobre o seu plano de alfabetização...`);
          return (
            <div key={o.id} className="rounded-2xl border border-brand-100 bg-white p-3 shadow-soft">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_COLORS[o.status] || 'bg-gray-100'}`}>{STATUS_LABEL[o.status] || o.status}</span>
                    <span className="text-[10px] text-ink/40">{new Date(o.createdAt).toLocaleString('pt-BR')}</span>
                    <span className="text-[10px] font-bold text-brand-600">{o.paymentMethod.toUpperCase()}</span>
                  </div>
                  <p className="mt-1 truncate font-bold text-ink">{o.customerName}</p>
                  <p className="truncate text-xs text-ink/60">{o.customerEmail} · {o.customerPhone}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-extrabold text-brand-600">R$ {(o.amountCents / 100).toFixed(2).replace('.', ',')}</p>
                  <button onClick={() => setExpanded(isOpen ? null : o.id)} className="mt-1 text-xs font-bold text-brand-700 underline">
                    {isOpen ? 'Fechar' : 'Detalhes'}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="mt-3 space-y-3 border-t border-brand-100 pt-3">
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`https://wa.me/55${o.customerPhone.replace(/\D/g, '')}?text=${waText}`}
                      target="_blank" rel="noopener noreferrer"
                      className="rounded-full bg-[#25D366] px-3 py-1 text-xs font-bold text-white">📲 WhatsApp</a>
                    <a href={`mailto:${o.customerEmail}`} className="rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white">✉ E-mail</a>
                    <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-mono text-ink/60">ID {o.id.slice(0, 10)}…</span>
                  </div>

                  <div className="rounded-2xl bg-brand-50 p-3">
                    <p className="text-xs font-bold text-brand-700">CPF</p>
                    <p className="text-xs font-mono text-ink">{o.customerCpf}</p>
                  </div>

                  {o.utmSource || o.utmCampaign ? (
                    <div className="rounded-2xl bg-sun-500/10 p-3 text-xs">
                      <p className="font-bold">Tráfego:</p>
                      <p>Fonte: {o.utmSource || '—'} · Campanha: {o.utmCampaign || '—'}</p>
                    </div>
                  ) : null}

                  {o.quizAnswers && Object.keys(o.quizAnswers).length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-bold text-brand-700">Respostas do quiz</p>
                      <div className="space-y-1 rounded-2xl bg-brand-50 p-3 text-xs">
                        {Object.entries(o.quizAnswers).map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-2">
                            <span className="font-mono text-ink/60">{k}</span>
                            <span className="font-bold text-ink">{Array.isArray(v) ? v.join(', ') : String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="mb-1 text-xs font-bold text-brand-700">Alterar status</p>
                    <div className="flex flex-wrap gap-1">
                      {['pending', 'approved', 'rejected', 'refunded', 'cancelled'].map((st) => (
                        <button key={st} disabled={st === o.status} onClick={() => setStatus(o.id, st)}
                          className={`rounded-full px-2 py-1 text-[10px] font-bold ${st === o.status ? 'bg-ink/10 text-ink/40' : 'bg-brand-500 text-white hover:bg-brand-600'}`}>
                          {STATUS_LABEL[st]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {!loading && orders.length === 0 && (
          <p className="py-8 text-center text-sm text-ink/40">Nenhum pedido encontrado.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-3 ${highlight ? 'bg-brand-500 text-white' : 'bg-white border border-brand-100'}`}>
      <p className="text-[10px] font-bold uppercase opacity-70">{label}</p>
      <p className="mt-1 font-display text-lg font-extrabold">{value}</p>
    </div>
  );
}

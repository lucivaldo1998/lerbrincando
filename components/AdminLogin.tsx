'use client';

import { useState } from 'react';

export function AdminLogin() {
  const [token, setToken] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    const res = await fetch('/api/admin/login', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (res.ok) window.location.reload();
    else { setErr('Token inválido'); setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="card mx-auto max-w-sm">
      <h1 className="font-display text-xl font-extrabold text-ink">🔐 Admin</h1>
      <p className="mt-1 text-sm text-ink/60">Acesso restrito à equipe.</p>
      <input type="password" className="input mt-4" placeholder="Token de admin" value={token} onChange={(e) => setToken(e.target.value)} required />
      {err && <p className="mt-2 text-xs font-bold text-coral-600">{err}</p>}
      <button type="submit" className="btn-primary mt-4" disabled={loading}>{loading ? 'Entrando…' : 'Entrar'}</button>
    </form>
  );
}

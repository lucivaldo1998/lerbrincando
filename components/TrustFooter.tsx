import Link from 'next/link';
import { siteConfig } from '@/lib/config';

export function TrustFooter() {
  return (
    <footer className="mt-8 flex flex-col items-center gap-3 border-t border-brand-100 pt-6 text-center text-xs text-brand-700/70">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="badge-trust">🔒 100% anônimo</span>
        <span className="badge-trust">🛡️ Dados criptografados</span>
        <span className="badge-trust">💳 Pagamento Mercado Pago</span>
      </div>
      <div className="flex flex-wrap justify-center gap-3 text-ink/60">
        <Link href="/termos" className="hover:text-brand-700">Termos</Link>
        <span>·</span>
        <Link href="/privacidade" className="hover:text-brand-700">Privacidade</Link>
        <span>·</span>
        <Link href="/reembolso" className="hover:text-brand-700">Reembolso</Link>
        <span>·</span>
        <a href={`mailto:${siteConfig.email}`} className="hover:text-brand-700">Contato</a>
      </div>
      <p className="text-[10px] text-ink/40">
        © {new Date().getFullYear()} {siteConfig.brand} · Plano personalizado de alfabetização
      </p>
    </footer>
  );
}

import { Header } from './Header';
import { TrustFooter } from './TrustFooter';
import Link from 'next/link';

export function LegalLayout({ title, updatedAt, children }: { title: string; updatedAt: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <h1 className="font-display text-2xl font-extrabold text-ink">{title}</h1>
        <p className="mt-1 text-xs text-ink/50">Última atualização: {updatedAt}</p>
        <article className="prose prose-sm mt-5 max-w-none text-ink/80 [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-extrabold [&_h2]:text-ink [&_p]:mt-2 [&_p]:leading-relaxed [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-brand-600 [&_a]:underline">
          {children}
        </article>
        <div className="mt-8 flex flex-wrap gap-2 text-xs">
          <Link href="/termos" className="rounded-full bg-brand-50 px-3 py-1 font-bold text-brand-700">Termos</Link>
          <Link href="/privacidade" className="rounded-full bg-brand-50 px-3 py-1 font-bold text-brand-700">Privacidade</Link>
          <Link href="/reembolso" className="rounded-full bg-brand-50 px-3 py-1 font-bold text-brand-700">Reembolso</Link>
        </div>
      </main>
      <TrustFooter />
    </>
  );
}

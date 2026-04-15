import Link from 'next/link';
import { siteConfig } from '@/lib/config';

export function Header() {
  return (
    <header className="mb-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 font-display text-xl font-extrabold text-brand-700">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white shadow-soft">L</span>
        {siteConfig.brand}
      </Link>
      <span className="badge-trust">🔒 100% seguro</span>
    </header>
  );
}

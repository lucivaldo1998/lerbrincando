import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Nunito, Poppins } from 'next/font/google';

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-poppins', display: 'swap' });

export const metadata: Metadata = {
  title: 'LerBrincando — Plano de Alfabetização Personalizado em 30 Dias',
  description: 'Descubra em 2 minutos o plano personalizado para seu filho(a) aprender a ler em 30 dias com o método fônico baseado na neurociência.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'LerBrincando — Seu filho lendo em 30 dias',
    description: 'Método fônico personalizado. Faça o teste e receba o plano do seu filho(a).',
    type: 'website',
    locale: 'pt_BR',
  },
};

export const viewport: Viewport = {
  themeColor: '#00b5a5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${poppins.variable}`}>
      <body className="min-h-screen">
        <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-6">{children}</div>
      </body>
    </html>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { TrustFooter } from '@/components/TrustFooter';
import { media } from '@/lib/quiz-config';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <div className="animate-fade-up">
          <h1 className="font-display text-3xl font-extrabold leading-[1.15] text-ink sm:text-4xl">
            Seu filho(a) <span className="text-brand-600">lendo em 30 dias</span> com um plano personalizado
          </h1>
          <p className="mt-3 text-base text-ink/70">
            Responda 8 perguntas em 2 minutos e receba um plano sob medida com o método fônico — o mesmo validado por Harvard e usado por mais de 15 mil famílias.
          </p>

          <div className="my-6 overflow-hidden rounded-3xl bg-brand-50 shadow-soft">
            <Image src={media.hero} alt="Criança feliz aprendendo a ler" width={900} height={600} className="h-auto w-full" priority />
          </div>

          <Link href="/quiz/tempo" className="btn-primary animate-pulse-soft">
            👉 Começar o teste grátis
          </Link>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="badge-trust">⚡ Resultado imediato</span>
            <span className="badge-trust">🔒 100% anônimo</span>
            <span className="badge-trust">📱 Feito em 2 minutos</span>
          </div>

          <div className="mt-8 rounded-2xl border border-sun-500/30 bg-sun-500/10 p-4 text-sm text-ink">
            <p className="font-bold">🧠 Por que funciona?</p>
            <p className="mt-1 text-ink/80">
              O método fônico ensina a criança a reconhecer o som de cada letra antes de juntá-las — é a forma mais eficiente de alfabetização nos primeiros anos, segundo estudos da Harvard Graduate School of Education.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-coral-400/30 bg-coral-500/5 p-4 text-center text-xs font-semibold text-coral-600">
            🚨 Apenas 1 plano personalizado por família
          </div>
        </div>
      </main>
      <TrustFooter />
    </>
  );
}

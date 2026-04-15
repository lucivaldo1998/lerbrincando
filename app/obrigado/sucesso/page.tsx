import Link from 'next/link';
import { Header } from '@/components/Header';
import { TrustFooter } from '@/components/TrustFooter';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Pagamento aprovado · LerBrincando' };

export default function Sucesso({ searchParams }: { searchParams: { id?: string } }) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col text-center">
        <div className="animate-fade-up py-6">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-500 text-4xl text-white shadow-soft">✓</div>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">Pagamento aprovado!</h1>
          <p className="mt-2 text-base text-ink/70">Parabéns por dar esse passo. Agora vamos te guiar pra liberar o plano do seu filho(a).</p>

          <div className="card mt-6 text-left">
            <p className="font-display text-lg font-extrabold text-ink">📱 Próximo passo:</p>
            <p className="mt-2 text-sm text-ink/70">
              Clique no botão abaixo para receber o plano completo pelo WhatsApp. Você será atendida pela nossa equipe em até 5 minutos.
            </p>
            <a
              href={`https://wa.me/${siteConfig.whatsappClean}?text=${encodeURIComponent('Olá! Acabei de comprar o Plano de Alfabetização 30 dias. Pedido: ' + (searchParams.id || ''))}`}
              className="btn-primary mt-4"
              target="_blank" rel="noopener noreferrer"
            >
              📲 Receber plano no WhatsApp
            </a>
          </div>

          <div className="mt-6 rounded-2xl bg-sun-500/10 p-4 text-left text-sm text-ink/80">
            <p className="font-bold">💡 Dica:</p>
            <p className="mt-1">Salve nosso contato como <b>{siteConfig.brand}</b> para não perder nenhuma mensagem do seu atendimento personalizado.</p>
          </div>

          <Link href="/" className="mt-6 inline-block text-sm text-brand-700 underline">← Voltar para o início</Link>
        </div>
      </main>
      <TrustFooter />
    </>
  );
}

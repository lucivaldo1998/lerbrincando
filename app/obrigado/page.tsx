import { Header } from '@/components/Header';
import { TrustFooter } from '@/components/TrustFooter';
import { PixWaiting } from '@/components/PixWaiting';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Pagamento · LerBrincando' };

export default function ObrigadoPage({ searchParams }: { searchParams: { id?: string } }) {
  const id = searchParams.id;
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        {id ? <PixWaiting orderId={id} /> : <p className="py-12 text-center">Pedido não encontrado.</p>}
      </main>
      <TrustFooter />
    </>
  );
}

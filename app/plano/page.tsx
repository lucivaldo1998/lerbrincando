import { Header } from '@/components/Header';
import { TrustFooter } from '@/components/TrustFooter';
import { QuizRunner } from '@/components/QuizRunner';

export default function PlanoPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <QuizRunner slug="plano-pronto" />
      </main>
      <TrustFooter />
    </>
  );
}

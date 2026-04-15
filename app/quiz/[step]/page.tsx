import { Header } from '@/components/Header';
import { TrustFooter } from '@/components/TrustFooter';
import { QuizRunner } from '@/components/QuizRunner';
import { steps } from '@/lib/quiz-config';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return steps.map((s) => ({ step: s.slug }));
}

export default function QuizStep({ params }: { params: { step: string } }) {
  const exists = steps.some((s) => s.slug === params.step);
  if (!exists) notFound();
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <QuizRunner slug={params.step} />
      </main>
      <TrustFooter />
    </>
  );
}

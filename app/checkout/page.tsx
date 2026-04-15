import { Header } from '@/components/Header';
import { TrustFooter } from '@/components/TrustFooter';
import { CheckoutForm } from '@/components/CheckoutForm';
import { siteConfig, priceFormatted, installmentValue } from '@/lib/config';

export const metadata = { title: 'Checkout · LerBrincando' };

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <div className="mb-5">
          <h1 className="font-display text-2xl font-extrabold text-ink">Finalize e libere o plano</h1>
          <p className="mt-1 text-sm text-ink/70">Acesso imediato após a confirmação do pagamento.</p>
        </div>
        <CheckoutForm price={siteConfig.priceBRL} priceFormatted={priceFormatted} installmentValue={installmentValue} />
      </main>
      <TrustFooter />
    </>
  );
}

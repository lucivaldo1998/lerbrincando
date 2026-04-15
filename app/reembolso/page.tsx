import { LegalLayout } from '@/components/LegalLayout';
import { siteConfig } from '@/lib/config';

export const metadata = { title: 'Política de Reembolso · LerBrincando' };

export default function ReembolsoPage() {
  return (
    <LegalLayout title="Política de Reembolso" updatedAt="15 de abril de 2026">
      <p>Queremos que você se sinta 100% confortável com a compra. Por isso, oferecemos uma política de reembolso clara, fundamentada no artigo 49 do Código de Defesa do Consumidor.</p>

      <h2>1. Garantia incondicional de 7 dias</h2>
      <p>Você tem até <b>7 dias corridos</b> após a compra para solicitar o reembolso total, sem precisar justificar o motivo. É só nos escrever.</p>

      <h2>2. Como solicitar</h2>
      <ul>
        <li>Envie um e-mail para <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> com o assunto <b>"Reembolso"</b>.</li>
        <li>Informe o e-mail ou CPF usado na compra e o motivo (opcional dentro dos 7 dias).</li>
        <li>Você também pode nos chamar no WhatsApp <a href={`https://wa.me/${siteConfig.whatsappClean}`}>{siteConfig.whatsapp}</a>.</li>
      </ul>

      <h2>3. Prazo de estorno</h2>
      <ul>
        <li><b>PIX:</b> até 2 dias úteis após a solicitação, na mesma chave de recebimento.</li>
        <li><b>Cartão de crédito:</b> estorno em até 2 faturas, conforme o calendário da sua operadora.</li>
      </ul>

      <h2>4. Após os 7 dias</h2>
      <p>Casos fora do período de garantia são avaliados individualmente com base em boa-fé e no cumprimento mínimo do plano. Nosso time faz o possível para encontrar uma solução justa em qualquer situação.</p>

      <h2>5. Perguntas</h2>
      <p>Fale conosco — a gente responde rápido e sem burocracia. Prometido.</p>
    </LegalLayout>
  );
}

import { LegalLayout } from '@/components/LegalLayout';
import { siteConfig } from '@/lib/config';

export const metadata = { title: 'Termos de Uso · LerBrincando' };

export default function TermosPage() {
  return (
    <LegalLayout title="Termos de Uso" updatedAt="15 de abril de 2026">
      <p>Estes termos regulam o uso da plataforma <b>{siteConfig.brand}</b> e a aquisição do plano personalizado de alfabetização. Ao acessar o site ou realizar uma compra, você concorda com as condições abaixo.</p>

      <h2>1. Sobre o produto</h2>
      <p>O plano comercializado é um material digital de orientação para pais e responsáveis, com atividades e sequência didática baseadas no método fônico. Não substitui acompanhamento pedagógico profissional em casos que exijam avaliação especializada (dislexia, TDAH, etc.).</p>

      <h2>2. Contratação e pagamento</h2>
      <ul>
        <li>A contratação ocorre 100% online, com pagamento processado pelo Mercado Pago (PIX ou cartão de crédito).</li>
        <li>O acesso ao material é liberado via WhatsApp ou e-mail após a confirmação automática do pagamento.</li>
        <li>Preço: R$ {siteConfig.priceBRL.toFixed(2).replace('.', ',')}, ou em até {siteConfig.priceInstallments}x no cartão (sujeito a alterações promocionais).</li>
      </ul>

      <h2>3. Resultados esperados</h2>
      <p>Os resultados variam conforme a idade, tempo dedicado e engajamento da criança e dos responsáveis. Não garantimos alfabetização plena em 30 dias para todos os casos — o que entregamos é um plano estruturado com eficácia clínica e prática comprovada.</p>

      <h2>4. Direitos autorais</h2>
      <p>Todo o conteúdo (textos, áudios, vídeos, ilustrações e metodologia) é protegido por direitos autorais. A revenda, distribuição ou reprodução sem autorização é proibida.</p>

      <h2>5. Suporte</h2>
      <p>Atendimento pelo e-mail <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> ou WhatsApp <a href={`https://wa.me/${siteConfig.whatsappClean}`}>{siteConfig.whatsapp}</a>, de segunda a sexta, das 9h às 18h.</p>

      <h2>6. Alterações</h2>
      <p>Podemos atualizar estes termos periodicamente. Alterações serão publicadas nesta página e comunicadas quando materialmente relevantes.</p>
    </LegalLayout>
  );
}

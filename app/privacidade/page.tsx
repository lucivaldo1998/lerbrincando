import { LegalLayout } from '@/components/LegalLayout';
import { siteConfig } from '@/lib/config';

export const metadata = { title: 'Política de Privacidade · LerBrincando' };

export default function PrivacidadePage() {
  return (
    <LegalLayout title="Política de Privacidade" updatedAt="15 de abril de 2026">
      <p>A <b>{siteConfig.brand}</b> respeita a privacidade dos seus dados e cumpre a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>

      <h2>1. Dados coletados</h2>
      <ul>
        <li><b>Durante o quiz:</b> idade da criança, tempo disponível, dificuldades relatadas e objetivos — sem qualquer dado identificável.</li>
        <li><b>Na compra:</b> nome completo, e-mail, telefone/WhatsApp e CPF — necessários para emissão fiscal e entrega do produto.</li>
        <li><b>Automáticos:</b> IP, navegador, UTMs da campanha de tráfego e eventos de navegação (via Facebook Pixel e Google Tag Manager).</li>
      </ul>

      <h2>2. Como usamos seus dados</h2>
      <ul>
        <li>Processar a compra e liberar o acesso ao plano.</li>
        <li>Enviar o material e comunicações relacionadas à sua conta.</li>
        <li>Enviar conteúdos educativos e ofertas complementares (você pode sair a qualquer momento).</li>
        <li>Analisar conversão para otimizar nossas campanhas de marketing.</li>
      </ul>

      <h2>3. Com quem compartilhamos</h2>
      <p>Compartilhamos apenas com parceiros estritamente necessários para operar o serviço: Mercado Pago (pagamento), provedores de e-mail e WhatsApp (comunicação), Railway/Vercel (hospedagem) e Meta/Google (métricas de campanha). Nenhum parceiro recebe seus dados para fins de venda a terceiros.</p>

      <h2>4. Seus direitos (LGPD)</h2>
      <ul>
        <li>Acessar, corrigir ou excluir seus dados.</li>
        <li>Revogar consentimento a qualquer momento.</li>
        <li>Portabilidade dos dados.</li>
        <li>Reclamar à ANPD caso se sinta prejudicado.</li>
      </ul>
      <p>Para exercer qualquer direito, escreva para <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>

      <h2>5. Segurança</h2>
      <p>Usamos HTTPS, cookies seguros, criptografia em trânsito e em repouso e acesso restrito por token ao nosso painel administrativo. Nunca armazenamos dados de cartão de crédito — a tokenização ocorre direto no Mercado Pago.</p>

      <h2>6. Retenção</h2>
      <p>Mantemos os dados de compra por 5 anos (exigência fiscal). Dados do quiz sem compra são apagados após 90 dias.</p>
    </LegalLayout>
  );
}

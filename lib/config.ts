export const siteConfig = {
  brand: process.env.NEXT_PUBLIC_BRAND || 'LerBrincando',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  email: process.env.NEXT_PUBLIC_EMAIL || 'meunegocio@gmail.com',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '+5592999999999',
  whatsappClean: (process.env.NEXT_PUBLIC_WHATSAPP || '+5592999999999').replace(/\D/g, ''),
  priceBRL: Number(process.env.PRODUCT_PRICE_BRL || '37.00'),
  priceInstallments: 5,
  product: {
    sku: 'plano-30dias',
    title: 'Plano de Alfabetização Personalizado — 30 Dias',
    description: 'Método fônico em passo a passo para alfabetizar seu filho(a) em 30 dias.',
  },
};

export const priceCents = Math.round(siteConfig.priceBRL * 100);
export const priceFormatted = siteConfig.priceBRL.toFixed(2).replace('.', ',');
export const installmentValue = (siteConfig.priceBRL / siteConfig.priceInstallments).toFixed(2).replace('.', ',');

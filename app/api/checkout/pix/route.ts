import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mpPayment } from '@/lib/mercadopago';
import { pixCheckoutSchema, sanitizeCpf, sanitizePhone } from '@/lib/validate';
import { priceCents, siteConfig } from '@/lib/config';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = pixCheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'validation', issues: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const cpf = sanitizeCpf(data.cpf);
    const phone = sanitizePhone(data.phone);

    const order = await prisma.order.create({
      data: {
        customerName: data.name,
        customerEmail: data.email.toLowerCase(),
        customerPhone: phone,
        customerCpf: cpf,
        quizAnswers: (data.answers || {}) as any,
        productSku: siteConfig.product.sku,
        productTitle: siteConfig.product.title,
        amountCents: priceCents,
        paymentMethod: 'pix',
        status: 'pending',
        utmSource: data.utms?.utm_source,
        utmCampaign: data.utms?.utm_campaign,
        utmMedium: data.utms?.utm_medium,
        utmContent: data.utms?.utm_content,
        utmTerm: data.utms?.utm_term,
        fbclid: data.utms?.fbclid,
        ip: req.headers.get('x-forwarded-for')?.split(',')[0] || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    });

    const amount = priceCents / 100;
    const mpRes = await mpPayment.create({
      body: {
        transaction_amount: amount,
        description: siteConfig.product.title,
        payment_method_id: 'pix',
        payer: {
          email: data.email.toLowerCase(),
          first_name: data.name.split(' ')[0],
          last_name: data.name.split(' ').slice(1).join(' ') || data.name.split(' ')[0],
          identification: { type: 'CPF', number: cpf },
        },
        external_reference: order.id,
        notification_url: `${siteConfig.url}/api/webhooks/mercadopago`,
        metadata: { order_id: order.id },
        date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
      requestOptions: { idempotencyKey: randomUUID() },
    });

    const qrBase64 = mpRes.point_of_interaction?.transaction_data?.qr_code_base64 || null;
    const qrCode = mpRes.point_of_interaction?.transaction_data?.qr_code || null;
    const ticketUrl = mpRes.point_of_interaction?.transaction_data?.ticket_url || null;

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        mpPaymentId: String(mpRes.id),
        mpQrCode: qrCode,
        mpQrCodeBase64: qrBase64,
        mpTicketUrl: ticketUrl,
        mpRaw: mpRes as any,
      },
    });

    await prisma.orderEvent.create({
      data: { orderId: order.id, type: 'created', payload: { method: 'pix', mpStatus: mpRes.status } as any },
    });

    return NextResponse.json({
      orderId: updated.id,
      paymentId: updated.mpPaymentId,
      qrCode,
      qrCodeBase64: qrBase64,
      ticketUrl,
      amount,
      status: mpRes.status,
    });
  } catch (err: any) {
    console.error('[pix]', err?.cause || err);
    return NextResponse.json({ error: 'pix_failed', message: err?.message || String(err) }, { status: 500 });
  }
}

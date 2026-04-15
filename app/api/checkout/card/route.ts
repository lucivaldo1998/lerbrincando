import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mpPayment } from '@/lib/mercadopago';
import { cardCheckoutSchema, sanitizeCpf, sanitizePhone } from '@/lib/validate';
import { priceCents, siteConfig } from '@/lib/config';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = cardCheckoutSchema.safeParse(body);
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
        paymentMethod: 'card',
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
        token: data.token,
        installments: data.installments,
        payment_method_id: data.paymentMethodId,
        issuer_id: data.issuerId ? Number(data.issuerId) : undefined,
        payer: {
          email: data.email.toLowerCase(),
          first_name: data.name.split(' ')[0],
          last_name: data.name.split(' ').slice(1).join(' ') || data.name.split(' ')[0],
          identification: { type: 'CPF', number: cpf },
        },
        external_reference: order.id,
        notification_url: `${siteConfig.url}/api/webhooks/mercadopago`,
        metadata: { order_id: order.id },
        statement_descriptor: (siteConfig.brand || 'LERBRINCANDO').slice(0, 22).toUpperCase(),
      },
      requestOptions: { idempotencyKey: randomUUID() },
    });

    const mappedStatus = mapMpStatus(mpRes.status);
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        mpPaymentId: String(mpRes.id),
        status: mappedStatus,
        mpRaw: mpRes as any,
      },
    });

    await prisma.orderEvent.create({
      data: { orderId: order.id, type: 'created', payload: { method: 'card', mpStatus: mpRes.status, detail: mpRes.status_detail } as any },
    });

    return NextResponse.json({
      orderId: updated.id,
      paymentId: updated.mpPaymentId,
      status: mappedStatus,
      mpStatus: mpRes.status,
      mpStatusDetail: mpRes.status_detail,
    });
  } catch (err: any) {
    console.error('[card]', err?.cause || err);
    return NextResponse.json({ error: 'card_failed', message: err?.message || String(err) }, { status: 500 });
  }
}

function mapMpStatus(mp?: string): string {
  switch (mp) {
    case 'approved': return 'approved';
    case 'in_process':
    case 'pending': return 'pending';
    case 'rejected': return 'rejected';
    case 'cancelled': return 'cancelled';
    case 'refunded':
    case 'charged_back': return 'refunded';
    default: return 'pending';
  }
}

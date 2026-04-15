import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mpPayment } from '@/lib/mercadopago';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const searchParams = new URL(req.url).searchParams;

    // MP envia eventos em vários formatos; cobrimos os dois principais
    const type = body.type || searchParams.get('type') || body.topic || searchParams.get('topic');
    const dataId = body.data?.id || body.resource || searchParams.get('data.id') || searchParams.get('id');

    if (!dataId || !String(type || '').includes('payment')) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const paymentId = String(dataId).replace(/^.*\/payments\//, '');
    const mp = await mpPayment.get({ id: paymentId });

    const orderId = mp.external_reference || mp.metadata?.order_id;
    if (!orderId) {
      console.warn('[webhook] sem order_id', mp.id);
      return NextResponse.json({ ok: true, skipped: 'no_order_ref' });
    }

    const status = mapMpStatus(mp.status);

    await prisma.order.updateMany({
      where: { id: String(orderId) },
      data: {
        status,
        mpPaymentId: String(mp.id),
        mpRaw: mp as any,
      },
    });

    await prisma.orderEvent.create({
      data: {
        orderId: String(orderId),
        type: 'webhook',
        payload: { mpStatus: mp.status, detail: mp.status_detail, id: mp.id } as any,
      },
    });

    return NextResponse.json({ ok: true, status, orderId });
  } catch (err: any) {
    console.error('[webhook]', err);
    // Retorna 200 de qualquer forma para evitar retry infinito do MP em erros nossos
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 200 });
  }
}

// MP às vezes faz GET para verificação
export async function GET() {
  return NextResponse.json({ ok: true });
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

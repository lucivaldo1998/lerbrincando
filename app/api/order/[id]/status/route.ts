import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mpPayment } from '@/lib/mercadopago';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Polling endpoint: frontend chama a cada ~4s para saber se PIX foi pago.
// Se ainda pendente e o MP tiver paymentId, reconsulta MP.
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    select: { id: true, status: true, mpPaymentId: true, paymentMethod: true, amountCents: true, mpQrCode: true, mpQrCodeBase64: true, mpTicketUrl: true },
  });
  if (!order) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  if (order.status === 'pending' && order.mpPaymentId) {
    try {
      const mp = await mpPayment.get({ id: order.mpPaymentId });
      const mapped = mapStatus(mp.status);
      if (mapped !== order.status) {
        await prisma.order.update({ where: { id: order.id }, data: { status: mapped } });
        await prisma.orderEvent.create({
          data: { orderId: order.id, type: 'polling_sync', payload: { mpStatus: mp.status } as any },
        });
        order.status = mapped;
      }
    } catch (e) {
      // ignora erro transitório
    }
  }

  return NextResponse.json(order);
}

function mapStatus(mp?: string): string {
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

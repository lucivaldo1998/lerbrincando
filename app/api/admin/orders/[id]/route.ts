import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthed } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthed()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { events: { orderBy: { createdAt: 'desc' }, take: 50 } },
  });
  if (!order) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthed()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const allowed = ['pending', 'approved', 'rejected', 'refunded', 'cancelled'];
  if (body.status && !allowed.includes(body.status)) {
    return NextResponse.json({ error: 'invalid_status' }, { status: 400 });
  }
  const updated = await prisma.order.update({
    where: { id: params.id },
    data: { ...(body.status ? { status: body.status } : {}) },
  });
  await prisma.orderEvent.create({
    data: { orderId: params.id, type: 'admin_note', payload: { ...body, admin: true } as any },
  });
  return NextResponse.json(updated);
}

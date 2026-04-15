import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthed } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!isAdminAuthed()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const q = url.searchParams.get('q');
  const limit = Math.min(200, Number(url.searchParams.get('limit') || 50));

  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { customerName: { contains: q, mode: 'insensitive' } },
              { customerEmail: { contains: q, mode: 'insensitive' } },
              { customerPhone: { contains: q } },
              { customerCpf: { contains: q } },
              { id: { equals: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true, createdAt: true, customerName: true, customerEmail: true, customerPhone: true,
      customerCpf: true, amountCents: true, paymentMethod: true, status: true, quizAnswers: true,
      utmSource: true, utmCampaign: true,
    },
  });

  const stats = await prisma.order.groupBy({
    by: ['status'],
    _count: true,
    _sum: { amountCents: true },
  });

  return NextResponse.json({ orders, stats });
}

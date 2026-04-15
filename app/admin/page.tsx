import { Header } from '@/components/Header';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AdminLogin } from '@/components/AdminLogin';
import { isAdminAuthed } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · LerBrincando', robots: { index: false } };

export default function AdminPage() {
  const authed = isAdminAuthed();
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <h1 className="mb-5 font-display text-2xl font-extrabold text-ink">Painel de Pedidos</h1>
        {authed ? <AdminDashboard /> : <AdminLogin />}
      </main>
    </>
  );
}

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import PrivateRoute from '@/components/PrivateRoute';
import ConfirmModal from '@/components/ConfirmModal';
import { GridSkeleton } from '@/components/Spinner';

function Listings() {
  const [rows, setRows] = useState(null);
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { api('/my-studios').then(setRows).catch((e) => { toast.error(e.message); setRows([]); }); }, []);
  const remove = async () => {
    setBusy(true);
    try { await api(`/studios/${del._id}`, { method: 'DELETE' }); setRows(rows.filter((r) => r._id !== del._id)); toast.success('Studio deleted.'); setDel(null); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="page py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="section-title">My studio listings</h1><p className="section-sub">Update or remove the spaces you host.</p></div>
        <Link href="/add-studio" className="btn btn-primary">Add New Studio</Link>
      </div>
      <div className="mt-8">
        {!rows ? <GridSkeleton n={3} /> : rows.length === 0 ? (
          <div className="card-eq items-center gap-3 p-12 text-center">
          <h2 className="font-display text-2xl font-bold">You have not listed a studio yet</h2>
          <p className="text-base-content/70">List your first space and start receiving booking requests.</p>
          <Link href="/add-studio" className="btn btn-primary">List a studio</Link></div>
    ) : (

  <div className="overflow-x-auto rounded-box border border-base-300">
  <table className="table">
    <thead><tr><th>Studio</th><th>Category</th><th>Rate</th><th>Location</th><th className="text-right">Actions</th></tr></thead>
    <tbody>{rows.map((s) => (<tr key={s._id}>
    <td><div className="flex items-center gap-3"><img src={s.image} alt="" className="h-12 w-16 rounded object-cover" /><Link href={`/studios/${s._id}`} className="font-semibold hover:underline">{s.title}</Link></div></td><td>{s.category}</td><td>${s.hourlyRate}/hr</td><td>{s.location}</td>
    <td className="space-x-2 text-right whitespace-nowrap">
    <Link href={`/studios/edit/${s._id}`} className="btn btn-sm btn-outline btn-primary">Update</Link>
    <button className="btn btn-sm btn-outline btn-error" onClick={() => setDel(s)}>Delete</button></td>
    </tr>
  ))}
  </tbody>
  </table>
  </div>
  )}
</div>
  <ConfirmModal open={!!del} danger busy={busy} title="Delete this studio?" confirmText="Delete studio"
    message={`"${del?.title}" will be removed permanently. This cannot be undone.`} onConfirm={remove} onCancel={() => setDel(null)} />
    </div>
  );
}
export default function Page() { return <PrivateRoute><Listings /></PrivateRoute>; }
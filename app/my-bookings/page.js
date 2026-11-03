'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import PrivateRoute from '@/components/PrivateRoute';
import ConfirmModal from '@/components/ConfirmModal';
import { GridSkeleton } from '@/components/Spinner';

const badge = { Pending: 'badge-warning', Confirmed: 'badge-info', Completed: 'badge-success', Cancelled: 'badge-error' };

async function invoice(b) {
  const { jsPDF } = await import('jspdf');
  const d = new jsPDF();
  d.setFontSize(20); d.text('StudioSpace - Booking Invoice', 20, 25);
  d.setFontSize(12);
  [`Booking ID: ${b._id}`, `Studio: ${b.studioTitle}`, `Guest: ${b.userName} (${b.userEmail})`, `Date: ${b.date} at ${b.startTime}`,
  `Duration: ${b.hours} hour(s) at $${b.hourlyRate}/hr`, `Security deposit: $${b.securityDeposit}`, `Total: $${b.total}`, `Status: ${b.status}`]
  .forEach((l, i) => d.text(l, 20, 45 + i * 10));
  d.save(`invoice-${b._id}.pdf`);
}

function Bookings() {
  const [tab, setTab] = useState(() =>
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('tab') === 'requests' ? 'requests' : 'mine');
  const [data, setData] = useState({ mine: null, requests: null });
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(() => {
    api('/bookings/mine').then((mine) => setData((d) => ({ ...d, mine }))).catch(() => setData((d) => ({ ...d, mine: [] })));
    api('/bookings/requests').then((requests) => setData((d) => ({ ...d, requests }))).catch(() => setData((d) => ({ ...d, requests: [] })));
  }, []);
  useEffect(load, [load]);

  const change = async (b, status, msg) => {
    setBusy(true);
    try { await api(`/bookings/${b._id}/status`, { method: 'PATCH', body: { status } }); toast.success(msg); load(); setTarget(null); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  const rows = data[tab];
  return (
    <div className="page py-10">
      <h1 className="section-title">My bookings</h1>
      <p className="section-sub">Track your reservations and manage requests for your own studios.</p>
      <div role="tablist" className="tabs tabs-boxed mt-6 w-fit">
        <button role="tab" className={`tab ${tab === 'mine' ? 'tab-active' : ''}`} onClick={() => setTab('mine')}>My reservations</button>
        <button role="tab" className={`tab ${tab === 'requests' ? 'tab-active' : ''}`} onClick={() => setTab('requests')}>Requests for my studios</button></div>

  <div className="mt-6"> {!rows ? <GridSkeleton n={3} /> : rows.length === 0 ? (
  <div className="card-eq items-center gap-3 p-12 text-center">
    <h2 className="font-display text-2xl font-bold">{tab === 'mine' ? 'No bookings yet' : 'No requests yet'}</h2>
    <p className="text-base-content/70">{tab === 'mine' ? 'Find a studio and reserve your first slot.' : 'Requests appear here when creators book your studios.'}</p>
    <Link href="/studios" className="btn btn-primary">Explore Studios</Link></div>
) : (
    <div className="grid gap-4 md:grid-cols-2">
    {rows.map((b) => (
    <div key={b._id} className="card-eq flex-row overflow-hidden">
    <img src={b.studioImage} alt="" className="hidden w-36 object-cover sm:block" />
    <div className="flex flex-1 flex-col gap-1 p-5">
    <div className="flex items-start justify-between gap-2"><h3 className="font-display text-lg font-bold">{b.studioTitle}</h3><span className={`badge ${badge[b.status]}`}>{b.status}</span></div>
    <p className="text-sm text-base-content/70">{b.date} at {b.startTime} for {b.hours} hr{tab === 'requests' && ` - ${b.userName}`}</p>
  <p className="font-semibold text-primary">Total ${b.total}</p>
  <div className="mt-auto flex flex-wrap gap-2 pt-2">
  {tab === 'mine' && b.status === 'Pending' && <button className="btn btn-sm btn-outline btn-error" onClick={() => setTarget(b)}>Cancel Booking</button>}
    {b.status === 'Confirmed' && <button className="btn btn-sm btn-outline" onClick={() => invoice(b)}>Download invoice</button>}
    {tab === 'requests' && b.status === 'Pending' && <>
    <button className="btn btn-sm btn-primary" onClick={() => change(b, 'Confirmed', 'Booking confirmed.')}>Confirm</button>
    <button className="btn btn-sm btn-outline btn-error" onClick={() => change(b, 'Cancelled', 'Booking declined.')}>Decline</button></>}
    {tab === 'requests' && b.status === 'Confirmed' && <button className="btn btn-sm btn-success" onClick={() => change(b, 'Completed', 'Marked as completed.')}>Mark completed</button>}
    </div>
    </div>
  </div>
))}
  </div>
  )}
</div>
    <ConfirmModal open={!!target} danger busy={busy} title="Cancel this booking?" confirmText="Cancel booking"
    message="The host will be notified and the slot will be released." onConfirm={() => change(target, 'Cancelled', 'Booking cancelled.')} onCancel={() => setTarget(null)} />
    </div>
  );
}
export default function Page() { return <PrivateRoute><Bookings /></PrivateRoute>; }
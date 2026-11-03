'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import { api, localDate } from '@/lib/api';

export default function BookingModal({ open, onClose, studio, initial = {} }) {
  const router = useRouter();
  const [f, setF] = useState({ date: localDate(), startTime: '10:00', hours: 2, ...initial });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (open) { setF({ date: localDate(), startTime: '10:00', hours: 2, ...initial }); setError(''); }
  }, [open]);


  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') closeRef.current(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  const deposit = studio.securityDeposit || 0;
  const hours = parseInt(f.hours, 10) || 0;
  const total = studio.hourlyRate * hours + deposit;
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setError(''); };

  const submit = async (e) => {
    e.preventDefault();
    if (hours < 1 || hours > 12) return setError('Choose between 1 and 12 hours.');
    setBusy(true); setError('');
    try {
      await api('/bookings', { method: 'POST', body: { studioId: studio._id, ...f, hours } });
      toast.success('Booking request sent. The host will confirm it shortly.');
      onClose();
      router.push('/my-bookings');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally { setBusy(false); }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}
      role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <form onSubmit={submit} className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-base-100 p-6 text-base-content shadow-2xl sm:max-w-md sm:rounded-3xl">
        <button type="button" onClick={onClose} disabled={busy} aria-label="Close"
          className="btn btn-ghost btn-sm btn-circle absolute right-4 top-4"><FiX size={18} /></button>

        <div className="flex items-center gap-3 pr-10">
          <img src={studio.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
          <div className="min-w-0">
            <p className="text-xs text-base-content/60">Book this studio</p>
            <h3 id="booking-title" className="line-clamp-1 font-display text-xl font-bold">{studio.title}</h3>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <label className="form-control">
            <span className="label-text mb-1">Date</span>
            <input type="date" min={localDate()} required value={f.date} onChange={set('date')} className="input input-bordered w-full" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="form-control">
              <span className="label-text mb-1">Start time</span>
              <input type="time" required value={f.startTime} onChange={set('startTime')} className="input input-bordered w-full" />
            </label>
            <label className="form-control">
              <span className="label-text mb-1">Hours (1-12)</span>
              <input type="number" min="1" max="12" required value={f.hours} onChange={set('hours')} className="input input-bordered w-full" />
            </label>
          </div>
        </div>

        <div className="mt-5 space-y-1.5 rounded-2xl bg-base-200 p-4 text-sm">
          <div className="flex justify-between"><span>${studio.hourlyRate} x {hours} hr</span><span>${studio.hourlyRate * hours}</span></div>
          <div className="flex justify-between"><span>Security deposit</span><span>${deposit}</span></div>
          <div className="flex justify-between border-t border-base-300 pt-2 text-base font-bold"><span>Total</span><span className="text-primary">${total}</span></div>
        </div>

        {error && (
          <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-error/10 p-3 text-sm text-error">
            <FiAlertCircle className="mt-0.5 shrink-0" /> {error}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>Cancel</button>
          <button className="btn btn-primary" disabled={busy}>
            {busy && <span className="loading loading-spinner loading-sm" />}Send request
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-base-content/60">You will not be charged now. The request stays Pending until the host confirms.</p>
      </form>
    </div>,
    document.body
  );
}
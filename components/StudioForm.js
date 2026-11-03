'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { AMENITIES, CATEGORIES, uploadImage } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

function Field({ label, value, onChange, type = 'text', ...rest }) {
  return (
    <label className="form-control">
      <span className="label-text mb-1">{label}</span>
      <input type={type} required value={value} onChange={onChange} className="input input-bordered" {...rest} />
    </label>
  );
}

export default function StudioForm({ initial = {}, onSubmit, submitLabel }) {
  const { user } = useAuth();
  const [f, setF] = useState({
    title: '', category: CATEGORIES[0], hourlyRate: '', securityDeposit: '', capacity: '', location: '',
    image: '', amenities: [], description: '', ...initial, gallery: (initial.gallery || []).join(', '),
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const toggle = (a) => setF((p) => ({ ...p, amenities: p.amenities.includes(a) ? p.amenities.filter((x) => x !== a) : [...p.amenities, a] }));

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const t = toast.loading('Uploading image...');
    try {
      const url = await uploadImage(file);
      setF((p) => ({ ...p, image: url }));
      toast.success('Image uploaded', { id: t });
    } catch (err) { toast.error(err.message, { id: t }); }
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await onSubmit({ ...f, gallery: f.gallery.split(',').map((x) => x.trim()).filter(Boolean) }); }
    catch (err) { toast.error(err.message); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
      <Field label="Studio title" value={f.title} onChange={set('title')} placeholder="e.g. Whiteout Cyc Wall Studio" />
      <label className="form-control">
        <span className="label-text mb-1">Category</span>
        <select value={f.category} onChange={set('category')} className="select select-bordered">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <Field label="Hourly rate ($)" type="number" min="1" value={f.hourlyRate} onChange={set('hourlyRate')} />
      <Field label="Security deposit ($)" type="number" min="0" value={f.securityDeposit} onChange={set('securityDeposit')} />
      <Field label="Max capacity" type="number" min="1" value={f.capacity} onChange={set('capacity')} />
      <Field label="Location / address" value={f.location} onChange={set('location')} />
      <Field label="Main image URL" type="url" value={f.image} onChange={set('image')} placeholder="https://..." />
      <label className="form-control">
        <span className="label-text mb-1">Or upload an image (imgbb)</span>
        <input type="file" accept="image/*" onChange={upload} className="file-input file-input-bordered" />
      </label>
      <label className="form-control md:col-span-2">
        <span className="label-text mb-1">Extra gallery image URLs (comma separated, optional)</span>
        <input value={f.gallery} onChange={set('gallery')} className="input input-bordered" />
      </label>
      <div className="md:col-span-2">
        <span className="label-text">Amenities</span>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {AMENITIES.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={f.amenities.includes(a)} onChange={() => toggle(a)} />{a}
            </label>
          ))}
        </div>
      </div>
      <label className="form-control md:col-span-2">
        <span className="label-text mb-1">Detailed overview</span>
        <textarea required rows={5} value={f.description} onChange={set('description')} className="textarea textarea-bordered" />
      </label>
      <label className="form-control">
        <span className="label-text mb-1">Host name</span>
        <input readOnly value={user?.name || ''} className="input input-bordered bg-base-200" />
      </label>
      <label className="form-control">
        <span className="label-text mb-1">Host email</span>
        <input readOnly value={user?.email || ''} className="input input-bordered bg-base-200" />
      </label>
      <button className="btn btn-primary md:col-span-2" disabled={busy}>
        {busy && <span className="loading loading-spinner loading-sm" />}{submitLabel}
      </button>
    </form>
  );
}
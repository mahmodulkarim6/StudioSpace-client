'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FiUpload, FiUser } from 'react-icons/fi';
import { authClient } from '@/lib/auth-client';
import { uploadImage } from '@/lib/api';
import GoogleButton from '@/components/GoogleButton';
import PasswordInput from '@/components/PasswordInput';

export default function Register() {
  const router = useRouter();
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const importPhoto = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image file.');
    if (file.size > 8 * 1024 * 1024) return toast.error('Image is too large. Choose one under 8 MB.');
    setUploading(true);
    try { setPhoto(await uploadImage(file)); toast.success('Photo imported. Its URL is now in the box.'); }
    catch (x) { toast.error(x.message); }
    finally { setUploading(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    const { name, email, password } = Object.fromEntries(new FormData(e.target));
    const msg = !/^https?:\/\/.+/i.test(photo) ? 'Please paste a photo URL or import a photo.'
      : !/[A-Z]/.test(password) ? 'Password must include an uppercase letter.'
      : !/[a-z]/.test(password) ? 'Password must include a lowercase letter.'
      : password.length < 6 ? 'Password must be at least 6 characters.' : '';
    setErr(msg);
    if (msg) return toast.error(msg);
    setBusy(true);
    const { error } = await authClient.signUp.email({ name, email, password, image: photo });
    setBusy(false);
    if (error) { setErr(error.message); return toast.error(error.message); }
    toast.success('Account created. Please log in.');
    router.push('/login' + window.location.search);
  };

  return (
    <div className="page flex min-h-[70vh] items-center justify-center py-10">
      <div className="w-full max-w-md rounded-2xl border border-base-300 p-8">
        <h1 className="section-title">Create your account</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input name="name" required placeholder="Full name" className="input input-bordered w-full" />
          <input name="email" type="email" required placeholder="Email" className="input input-bordered w-full" />
          <div>
          <div className="flex items-center gap-2">
          <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-base-200 text-base-content/50">
          {photo ? <img src={photo} alt="Profile preview" className="h-full w-full object-cover" /> : <FiUser size={20} />}</span>
          <input type="url" required value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="Photo URL" className="input input-bordered min-w-0 flex-1" />
          <button type="button" onClick={() => fileRef.current.click()} disabled={uploading} className="btn btn-outline shrink-0">
          {uploading ? <span className="loading loading-spinner loading-sm" /> : <FiUpload />} Import</button>
        <input ref={fileRef} type="file" accept="image/*" onChange={importPhoto} className="hidden" /></div>
        <p className="mt-1 text-xs text-base-content/60">Paste an image link or import a photo from your device.</p></div>
        <PasswordInput />
      {err && <p className="text-sm text-error" role="alert">{err}</p>}
      <button className="btn btn-primary w-full" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />}Register</button></form>
      <div className="divider">or</div>
    <GoogleButton />
    <p className="mt-6 text-center text-sm">
      Already registered?{' '}
      <a href="/login" className="link link-primary" onClick={(e) => { e.preventDefault(); router.push('/login' + window.location.search); }}>Login</a>
    </p></div>
  </div>
  );
}

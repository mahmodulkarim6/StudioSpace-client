'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { safeNext } from '@/lib/api';
import { authClient } from '@/lib/auth-client';
import GoogleButton from '@/components/GoogleButton';
import PasswordInput from '@/components/PasswordInput';

export default function Login() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await authClient.signIn.email({ email: e.target.email.value, password: e.target.password.value });
    setBusy(false);
    if (error) return toast.error(error.message || 'Incorrect email or password.');
    toast.success(`Welcome back, ${data.user.name}!`);
    router.replace(safeNext(new URLSearchParams(window.location.search).get('next')));
  };
  return (
    <div className="page flex min-h-[70vh] items-center justify-center py-10">
    <div className="w-full max-w-md rounded-2xl border border-base-300 p-8">
    <h1 className="section-title">Log in</h1>
    <p className="mt-1 text-sm text-base-content/70">Book studios and manage your listings.</p>
    <form onSubmit={submit} className="mt-6 space-y-4">
    <input name="email" type="email" required placeholder="Email" className="input input-bordered w-full" />
    <PasswordInput />
    <div className="text-right text-sm"><button type="button" className="link" onClick={() => toast.info('Password reset is not available yet. Use the examiner account from the README.')}>Forgot password?</button></div>
    <button className="btn btn-primary w-full" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />}Login</button></form>
  <div className="divider">or</div>
  <GoogleButton />
  <p className="mt-6 text-center text-sm">New to StudioSpace? <a href="/register" className="link link-primary" onClick={(e) => { e.preventDefault(); router.push('/register' + window.location.search); }}>Register</a></p>
  </div>
  </div>
  );
}

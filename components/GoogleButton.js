'use client';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { safeNext } from '@/lib/api';
import { authClient } from '@/lib/auth-client';

export default function GoogleButton() {
  const go = async () => {
    const next = safeNext(new URLSearchParams(window.location.search).get('next'));
    const { error } = await authClient.signIn.social({ provider: 'google', callbackURL: next });
    if (error) toast.error(error.message || 'Google sign-in is not available right now.');
  };
  return (
    <button type="button" onClick={go} className="btn btn-outline w-full gap-2">
    <FcGoogle size={20} /> Continue with Google
    </button>
  );
}
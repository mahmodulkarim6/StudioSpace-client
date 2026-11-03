'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { authClient } from '@/lib/auth-client';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export default function AuthProvider({ children }) {
  const { data, isPending } = authClient.useSession();
  const user = data?.user || null;
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user) api('/wishlist').then(setWishlist).catch(() => {});
    else setWishlist([]);
  }, [user?.id]);

  const logout = async () => { await authClient.signOut(); toast.success('Logged out. See you soon!'); };

  const toggleWish = useCallback(async (id) => {
    if (!user) return toast.error('Log in to save studios to your wishlist.');
    try {
      const { saved } = await api(`/wishlist/${id}`, { method: 'POST' });
      setWishlist((w) => (saved ? [...w, id] : w.filter((x) => x !== id)));
      toast.success(saved ? 'Saved to your wishlist' : 'Removed from your wishlist');
    } catch (e) { toast.error(e.message); }
  }, [user]);

  return <Ctx.Provider value={{ user, loading: isPending, logout, wishlist, toggleWish }}>{children}</Ctx.Provider>;
}

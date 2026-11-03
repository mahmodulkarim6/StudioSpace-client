'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';
import StudioForm from '@/components/StudioForm';
import Spinner from '@/components/Spinner';

function Edit() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [s, setS] = useState(null);
  useEffect(() => {
    api(`/studios/${id}`).then((d) => {
      if (d.ownerEmail !== user.email) { toast.error('You can only edit your own listings.'); router.replace('/my-listings'); } else setS(d);
    }).catch((e) => { toast.error(e.message); router.replace('/my-listings'); });
  }, [id, user, router]);
  if (!s) return <Spinner />;
  const save = async (data) => {
    await api(`/studios/${id}`, { method: 'PUT', body: data });
    toast.success('Studio updated.');
    router.push('/my-listings');
  };
  return (
    <div className="page max-w-4xl py-10">
      <h1 className="section-title">Update studio</h1>
      <p className="section-sub mb-8">Changes appear on the studio page right away.</p>
      <StudioForm initial={s} onSubmit={save} submitLabel="Save changes" />
    </div>
  );
}
export default function Page() { return <PrivateRoute><Edit /></PrivateRoute>; }
'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import PrivateRoute from '@/components/PrivateRoute';
import StudioForm from '@/components/StudioForm';

export default function AddStudio() {
  const router = useRouter();
  const save = async (data) => {
    await api('/studios', { method: 'POST', body: data });
    toast.success('Studio listed. Creators can book it now.');
    router.push('/my-listings');
  };
  return (
    <PrivateRoute>
      <div className="page max-w-4xl py-10">
      <h1 className="section-title">Add a new studio</h1>
      <p className="section-sub mb-8">Tell creators what the space offers and what it costs.</p>
      <StudioForm onSubmit={save} submitLabel="List my studio" />
      </div>
    </PrivateRoute>
  );
}

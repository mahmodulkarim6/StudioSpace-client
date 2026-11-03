'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiHeart } from 'react-icons/fi';
import { api, CATEGORIES } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import StudioCard from '@/components/StudioCard';
import { GridSkeleton } from '@/components/Spinner';

function Explore() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, loading, wishlist } = useAuth();
  const category = params.get('category') || 'All';
  const savedOnly = params.get('saved') === '1';
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [studios, setStudios] = useState(null);

  const go = (cat, saved) => {
    const q = new URLSearchParams();
    if (cat !== 'All') q.set('category', cat);
    if (saved) q.set('saved', '1');
    const qs = q.toString();
    router.replace(qs ? `/studios?${qs}` : '/studios', { scroll: false });
  };

  useEffect(() => {
    setStudios(null);
    const t = setTimeout(() => {
      const q = new URLSearchParams({ category, search, sort });
      api(`/studios?${q}`).then(setStudios).catch(() => setStudios([]));
    }, 300);
    return () => clearTimeout(t);
  }, [category, search, sort]);

  const list = studios && (savedOnly ? studios.filter((s) => wishlist.includes(s._id)) : studios);
  const needLogin = savedOnly && !loading && !user;

  return (
    <div className="page py-10">
      <h1 className="section-title">{savedOnly ? 'Saved studios' : 'Explore studios'}</h1>
      <p className="section-sub">{savedOnly ? 'The spaces you have marked with a heart.' : 'Search by name or neighbourhood, then narrow by category.'}</p>

      <div role="tablist" className="tabs tabs-boxed mt-6 w-fit">
        <button role="tab" className={`tab ${!savedOnly ? 'tab-active' : ''}`} onClick={() => go(category, false)}>All studios</button>
        <button role="tab" className={`tab gap-1.5 ${savedOnly ? 'tab-active' : ''}`} onClick={() => go(category, true)}>
        <FiHeart className="fill-accent text-accent" /> Saved {user ? `(${wishlist.length})` : ''}
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_200px_200px]">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search studios or locations" className="input input-bordered w-full" />
        <select value={category} onChange={(e) => go(e.target.value, savedOnly)} className="select select-bordered">
          <option>All</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="select select-bordered">
          <option value="newest">Newest first</option><option value="rating">Top rated</option>
          <option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div className="mt-8">
        {needLogin ? (
          <div className="card-eq items-center gap-3 p-12 text-center">
            <h2 className="font-display text-2xl font-bold">Log in to see your saved studios</h2>
            <p className="text-base-content/70">Saved studios are linked to your account.</p>
            <Link href="/login?next=%2Fstudios%3Fsaved%3D1" className="btn btn-primary">Login</Link>
          </div>
        ) : !list || (savedOnly && loading) ? <GridSkeleton /> : list.length === 0 ? (
          savedOnly ? (
            <div className="card-eq items-center gap-3 p-12 text-center">
              <h2 className="font-display text-2xl font-bold">No saved studios yet</h2>
              <p className="text-base-content/70">Tap the heart on any studio and it will show up here.</p>
              <button className="btn btn-primary" onClick={() => go('All', false)}>Browse all studios</button>
            </div>
          ) : (
            <div className="card-eq items-center gap-3 p-12 text-center">
              <h2 className="font-display text-2xl font-bold">No studios match that search</h2>
              <p className="text-base-content/70">Try a different keyword or clear the category filter.</p>
              <button className="btn btn-primary" onClick={() => { setSearch(''); go('All', false); }}>Clear filters</button>
            </div>
          )
        ) : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((s) => <StudioCard key={s._id} s={s} />)}</div>}
      </div>
    </div>
  );
}
export default function Page() { return <Suspense><Explore /></Suspense>; }
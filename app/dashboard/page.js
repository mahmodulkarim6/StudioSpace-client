'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';

function Dash() {
  const { user, wishlist } = useAuth();
  const [n, setN] = useState({ studios: '-', bookings: '-', requests: '-' });
  useEffect(() => {
    Promise.all([api('/my-studios'), api('/bookings/mine'), api('/bookings/requests')])
    .then(([a, b, c]) => setN({ studios: a.length, bookings: b.length, requests: c.filter((x) => x.status === 'Pending').length })).catch(() => {});
  }, []);
  const cards = [
    ['Studios I host', n.studios, '/my-listings'],
    ['My bookings', n.bookings, '/my-bookings'],
    ['Pending requests', n.requests, '/my-bookings?tab=requests'],
    ['Saved studios', wishlist.length, '/studios?saved=1'],
  ];
  return (
    <div className="page py-10">
    <h1 className="section-title">Welcome back, {user.name}</h1>
    <p className="section-sub">Here is where your studios and bookings stand.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {cards.map(([l, v, h]) => <Link key={l} href={h} className="card-eq p-6 hover:border-primary"><p className="text-4xl font-bold text-primary">{v}</p><p className="mt-1 text-base-content/70">{l}</p></Link>)}
</div>
</div>
);
}
export default function Page() { return <PrivateRoute><Dash /></PrivateRoute>; }
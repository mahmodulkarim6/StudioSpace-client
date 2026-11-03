'use client';
import Link from 'next/link';
import { toast } from 'sonner';
import { FaXTwitter, FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa6';
import { CATEGORIES } from '@/lib/api';
import Logo from './Logo';

export default function Footer() {
  const subscribe = (e) => {
    e.preventDefault();
    toast.success(`Subscribed! Studio news will arrive at ${e.target.email.value}.`);
    e.target.reset();
  };
  return (
    <footer className="mt-20 bg-neutral text-neutral-content">
      <div className="page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
        <Logo light />
          <p className="mt-3 text-sm opacity-80">Our mission is to put every creator in the right room: verified studios, clear prices and instant booking.</p>
          <div className="mt-4 flex gap-3 text-lg">
          <a href="https://x.com" aria-label="X" target="_blank" rel="noreferrer"><FaXTwitter /></a>
          <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer"><FaInstagram /></a>
          <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer"><FaFacebookF /></a>
          <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noreferrer"><FaYoutube /></a>
      </div>
    </div>
    <div>
      <h4 className="mb-3 font-bold">Quick links</h4>
    <ul className="space-y-2 text-sm opacity-80">{[['/', 'Home'], ['/studios', 'Explore Studios'],['/#how-it-works', 'How It Works'], ['/#about', 'About Us'], ['/add-studio', 'Host Your Space']].map(([h, l]) => <li key={h}><Link href={h} className="hover:underline">{l}</Link></li>)}</ul>
  </div>
  <div>
    <h4 className="mb-3 font-bold">Popular categories</h4>
    <ul className="space-y-2 text-sm opacity-80">{CATEGORIES.map((c) => <li key={c}><Link href={`/studios?category=${encodeURIComponent(c)}`} className="hover:underline">{c}</Link></li>)}
    </ul></div>
    <div>
    <h4 className="mb-3 font-bold">Newsletter</h4>
    <form onSubmit={subscribe} className="join w-full">
    <input name="email" type="email" required placeholder="you@email.com" className="input join-item w-full text-base-content" />
    <button className="btn btn-primary join-item">Join</button>
    </form></div>
    </div>
    <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">
    &copy; {new Date().getFullYear()} StudioSpace. All rights reserved. By booking you agree to our Terms and Privacy Policy.
    </div>
    </footer>
  );
}
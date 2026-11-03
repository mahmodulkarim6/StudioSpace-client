'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const links = [['/', 'Home'], ['/studios', 'Explore Studios'], ['/#how-it-works', 'How It Works'], ['/#about', 'About Us']];
const menu = [['/dashboard', 'Dashboard'], ['/add-studio', 'Add New Studio'], ['/my-listings', 'My Studio Listings'], ['/my-bookings', 'My Bookings']];

export default function Navbar() {
  const path = usePathname();
  const { user, loading, logout } = useAuth();
  const active = (h) => (h.includes('#') ? false : h === '/' ? path === '/' : path.startsWith(h));
  const NavLinks = () => links.map(([h, l]) => (
    <li key={h}><Link href={h} className={active(h) ? 'border-b-2 border-primary font-semibold text-primary rounded-none' : 'rounded-none'}>{l}</Link></li>
  ));

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="navbar page gap-1">
        <div className="navbar-start gap-1 max-lg:!w-auto max-lg:min-w-0 max-lg:flex-1">
          <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle btn-sm sm:btn-md" aria-label="Open menu"><FiMenu size={20} /></label>
          <ul tabIndex={0} className="menu dropdown-content z-10 mt-3 w-56 rounded-box bg-base-100 p-2 shadow">
          <NavLinks />
          {!user && !loading && <li className="sm:hidden"><Link href="/login">Login</Link></li>}</ul>
      </div>
      <Logo />
      </div>

    <div className="navbar-center hidden lg:flex">
      <ul className="menu menu-horizontal gap-1"><NavLinks /></ul>
        </div>
        <div className="navbar-end gap-1 max-lg:!w-auto max-lg:flex-none">
        <ThemeToggle />
        {loading ? <span className="loading loading-dots" /> : user ? (
        <div className="dropdown dropdown-end dropdown-hover">
        <label tabIndex={0} className="btn btn-ghost btn-circle btn-sm avatar sm:btn-md" title={user.name}>
        <div className="w-8 rounded-full sm:w-10">
        <img src={user.image || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name)}`} alt={user.name} /></div>
        </label>
        <ul tabIndex={0} className="menu dropdown-content z-10 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
        <li className="menu-title text-base-content">{user.name}</li>
        {menu.map(([h, l]) => <li key={h}><Link href={h}>{l}</Link></li>)}
        <li><button onClick={logout}>Logout</button></li>
    </ul>
    </div>
) : (
<>
    <Link href="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex md:btn-md">Login</Link>
    <Link href="/register" className="btn btn-primary btn-sm md:btn-md">Register</Link></>
  )}
    </div>
  </div>
  </header>
  );
}
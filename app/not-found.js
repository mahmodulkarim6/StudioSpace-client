import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="page flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <svg width="220" height="190" viewBox="0 0 220 190" fill="none" aria-hidden="true" className="text-primary">
        <path d="M110 40 L40 170 H180 Z" fill="currentColor" opacity=".12" />
        <rect x="90" y="14" width="40" height="30" rx="6" fill="currentColor" />
        <rect x="104" y="44" width="12" height="40" fill="currentColor" opacity=".6" />
        <circle cx="110" cy="150" r="22" stroke="currentColor" strokeWidth="4" />
        <path d="M110 128 L121 147 M110 128 L99 147 M88 150 H132" stroke="currentColor" strokeWidth="3" />
      </svg>
      <h1 className="font-display text-6xl font-bold">404</h1>
      <p className="text-xl font-semibold">This set is empty.</p>
      <p className="max-w-md text-base-content/70">The page you are looking for was struck, moved or never existed. Head back and find a studio that is open.</p>
      <Link href="/" className="btn btn-primary">Return to Home</Link>
    </div>
  );
}
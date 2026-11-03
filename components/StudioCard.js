'use client';
import Link from 'next/link';
import { FiMapPin, FiStar, FiHeart, FiUsers, FiArrowUpRight, FiShield } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

export default function StudioCard({ s }) {
  const { wishlist, toggleWish } = useAuth();
  const saved = wishlist.includes(s._id);
  const isNew = s.createdAt && Date.now() - new Date(s.createdAt).getTime() < 14 * 864e5;
  const tag = s.rating >= 4.8 ? 'Top rated' : isNew ? 'New' : null;
  const amenities = s.amenities || [];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-base-300 bg-base-100 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
      <Link href={`/studios/${s._id}`} aria-label={`View ${s.title}`} className="relative block h-56 shrink-0 overflow-hidden">
        <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
        <span className="absolute left-3 top-3 rounded-full bg-base-100/90 px-3 py-1 text-xs font-bold text-primary backdrop-blur">{s.category}</span>
        {tag && <span className="absolute left-3 top-12 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold text-white shadow">{tag}</span>}
        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between text-white">
          <p className="text-2xl font-bold leading-none">${s.hourlyRate}<span className="ml-1 text-xs font-medium text-white/70">/ hr</span></p>
          <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold backdrop-blur">
            <FiStar className="fill-yellow-400 text-yellow-400" /> {s.rating ? s.rating.toFixed(1) : 'New'}
          </span>
        </div>
      </Link>

      <button onClick={() => toggleWish(s._id)} aria-pressed={saved} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full shadow-md backdrop-blur transition-all hover:scale-110 ${saved ? 'bg-white' : 'bg-black/40 text-white hover:bg-black/60'}`}>
        <FiHeart size={17} className={saved ? 'heart-pop fill-accent text-accent' : ''} />
      </button>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="flex items-center gap-1.5 text-xs font-medium text-base-content/60"><FiMapPin className="shrink-0 text-primary" /><span className="line-clamp-1">{s.location}</span></p>
        <h3 className="line-clamp-1 font-display text-xl font-bold transition-colors group-hover:text-primary">{s.title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-base-content/70">{s.description}</p>

        <div className="flex min-h-[1.75rem] flex-wrap gap-1.5">
          {amenities.slice(0, 3).map((a) => <span key={a} className="rounded-full bg-base-200 px-2.5 py-1 text-[11px] font-medium">{a}</span>)}
          {amenities.length > 3 && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">+{amenities.length - 3}</span>}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-base-300 pt-3 text-xs text-base-content/70">
          <span className="flex items-center gap-1.5"><FiUsers className="text-primary" /> Up to {s.capacity}</span>
          <span className="flex items-center justify-end gap-1.5"><FiShield className="text-primary" /> ${s.securityDeposit} deposit</span>
        </div>
        <Link href={`/studios/${s._id}`} className="btn btn-primary w-full gap-2">
          View Details <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
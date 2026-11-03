'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css'; import 'swiper/css/navigation'; import 'swiper/css/pagination';
import { toast } from 'sonner';
import { FiMapPin, FiStar, FiShare2, FiHeart, FiCalendar, FiCheckCircle, FiShield, FiUsers, FiClock, FiChevronRight, FiLock } from 'react-icons/fi';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import BookingModal from '@/components/BookingModal';
import StudioCard from '@/components/StudioCard';
import Spinner from '@/components/Spinner';

const TABS = [['overview', 'Overview'], ['amenities', 'Amenities'], ['reviews', 'Reviews'], ['host', 'Host']];

export default function StudioDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user, wishlist, toggleWish } = useAuth();
  const [s, setS] = useState(null);
  const [missing, setMissing] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [swiper, setSwiper] = useState(null);
  const [tab, setTab] = useState('overview');
  const [similar, setSimilar] = useState([]);

  useEffect(() => { setS(null); setMissing(false); api(`/studios/${id}`).then(setS).catch(() => setMissing(true)); }, [id, user?.id]);
  useEffect(() => {
    if (!s?.category) return;
    api(`/studios?category=${encodeURIComponent(s.category)}&sort=rating&limit=4`).then((r) => setSimilar(r.filter((x) => x._id !== id).slice(0, 3))).catch(() => {});
  }, [s?.category, id]);
  useEffect(() => {
    if (!s) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setTab(e.target.id)), { rootMargin: '-30% 0px -60% 0px' });
    TABS.forEach(([t]) => { const el = document.getElementById(t); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [s]);

  if (missing) return (
    <div className="page py-20 text-center">
      <h1 className="section-title">Studio not found</h1>
      <p className="section-sub mx-auto">This listing may have been removed by its host.</p>
      <Link href="/studios" className="btn btn-primary mt-6">Back to studios</Link>
    </div>
  );
  if (!s) return <Spinner />;

  const images = [s.image, ...(s.gallery || [])];
  const saved = wishlist.includes(s._id);
  const isOwner = !!user && s.ownerEmail === user.email;
  const reviews = s.reviews || [];
  const dist = [5, 4, 3, 2, 1].map((n) => [n, reviews.filter((r) => Math.round(r.rating) === n).length]);

  const book = () => {
    if (!user) { toast.error('Please log in to book this studio.'); return router.push(`/login?next=${encodeURIComponent(`/studios/${id}`)}`); }
    if (isOwner) return toast.info('This is your own listing.');
    setOpen(true);
  };
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); toast.success('Studio link copied to clipboard'); }
    catch { toast.error('Could not copy the link.'); }
  };
  const go = (t) => { setTab(t); document.getElementById(t)?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <div className="page rise pb-10 pt-6">
      <nav className="flex flex-wrap items-center gap-1 text-xs text-base-content/60" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><FiChevronRight />
        <Link href="/studios" className="hover:text-primary">Studios</Link><FiChevronRight />
        <Link href={`/studios?category=${encodeURIComponent(s.category)}`} className="hover:text-primary">{s.category}</Link>
      </nav>

      <div className="relative mt-4 overflow-hidden rounded-[2rem] shadow-xl">
        <Swiper modules={[Autoplay, Navigation, Pagination]} navigation pagination={{ clickable: true }} rewind
          autoplay={images.length > 1 ? { delay: 5000, disableOnInteraction: true } : false}
          onSwiper={setSwiper} onSlideChange={(sw) => setActive(sw.activeIndex)} className="h-72 sm:h-[26rem] lg:h-[32rem]">
          {images.map((src, i) => <SwiperSlide key={i}><img src={src} alt={`${s.title} photo ${i + 1}`} className="h-full w-full object-cover" /></SwiperSlide>)}
        </Swiper>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute left-4 top-4 z-10 flex gap-2">
          <span className="rounded-full bg-base-100/90 px-3 py-1 text-xs font-bold text-primary backdrop-blur">{s.category}</span>
          <span className="flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur"><FiStar className="fill-yellow-400 text-yellow-400" /> {s.rating ? s.rating.toFixed(1) : 'New'}</span>
        </div>
        <div className="absolute right-4 top-4 z-10 flex gap-2">
          <button onClick={share} aria-label="Share studio" className="grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:scale-110 hover:bg-black/60"><FiShare2 size={17} /></button>
          <button onClick={() => toggleWish(s._id)} aria-pressed={saved} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`grid h-10 w-10 place-items-center rounded-full shadow-md backdrop-blur transition hover:scale-110 ${saved ? 'bg-white' : 'bg-black/40 text-white hover:bg-black/60'}`}>
            <FiHeart className={saved ? 'fill-accent text-accent' : ''} />
          </button>
        </div>
        <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-10 text-white sm:left-8">
          <h1 className="font-display text-3xl font-bold leading-tight drop-shadow sm:text-4xl lg:text-5xl">{s.title}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-white/85"><FiMapPin /> {s.location}<span className="ml-auto rounded-full bg-black/60 px-3 py-1 text-xs font-bold">{active + 1} / {images.length}</span></p>
        </div>
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button key={i} onClick={() => swiper?.slideTo(i)} aria-label={`Show photo ${i + 1}`}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${i === active ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}>
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

    <div className="sticky top-16 z-30 -mx-4 mt-6 border-b border-base-300 bg-base-100/90 px-4 backdrop-blur md:mx-0 md:px-0">
      <div className="flex gap-1 overflow-x-auto">
      {TABS.map(([t, l]) => (
      <button key={t} onClick={() => go(t)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${tab === t ? 'border-primary text-primary' : 'border-transparent text-base-content/60 hover:text-base-content'}`}>{l}</button>
    ))}
      </div>
    </div>

    <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-10">
          <section id="overview" className="scroll-mt-36">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[[FiClock, 'Hourly rate', `$${s.hourlyRate}`], [FiShield, 'Deposit', `$${s.securityDeposit}`], [FiUsers, 'Capacity', `${s.capacity} people`], [FiStar, 'Rating', s.rating ? `${s.rating.toFixed(1)} (${reviews.length})` : 'New']].map(([Icon, l, v]) => (
          <div key={l} className="rounded-2xl border border-base-300 p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary"><Icon size={17} /></span>
          <p className="mt-3 text-xs text-base-content/60">{l}</p><p className="font-display text-lg font-bold">{v}</p>
          </div>
          ))}
    </div>
      <h2 className="mt-8 font-display text-2xl font-bold">About this space</h2>
      <p className="mt-3 whitespace-pre-line leading-relaxed text-base-content/80">{s.description}</p></section>

          <section id="amenities" className="scroll-mt-36">
            <h2 className="font-display text-2xl font-bold">Equipment &amp; amenities</h2>
            {s.amenities?.length ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {s.amenities.map((a) => <li key={a} className="flex items-center gap-3 rounded-xl border border-base-300 px-4 py-3 text-sm font-medium"><FiCheckCircle className="text-success" size={18} /> {a}</li>)}
              </ul>
            ) : <p className="mt-3 text-sm text-base-content/70">The host has not listed amenities yet.</p>}
          </section>

          <section id="reviews" className="scroll-mt-36">
            <h2 className="font-display text-2xl font-bold">Reviews</h2>
            {reviews.length ? (
              <div className="mt-4 grid gap-6 md:grid-cols-[200px_1fr]">
                <div className="rounded-2xl border border-base-300 p-5 text-center">
                  <p className="font-display text-5xl font-bold text-primary">{s.rating ? s.rating.toFixed(1) : '-'}</p>
                  <div className="mt-1 flex justify-center gap-0.5 text-yellow-400">{[1, 2, 3, 4, 5].map((n) => <FiStar key={n} className={n <= Math.round(s.rating) ? 'fill-yellow-400' : ''} />)}</div>
                  <p className="mt-1 text-xs text-base-content/60">{reviews.length} reviews</p>
                  <div className="mt-4 space-y-1.5">
                    {dist.map(([n, c]) => (
                      <div key={n} className="flex items-center gap-2 text-xs"><span className="w-3">{n}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-base-300"><div className="h-full rounded-full bg-primary" style={{ width: `${(c / reviews.length) * 100}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {reviews.map((r, i) => (
                    <div key={i} className="rounded-2xl border border-base-300 p-4">
                      <div className="flex items-center gap-3">
                        <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(r.name)}`} alt="" className="h-10 w-10 rounded-full" />
                        <div className="flex-1"><p className="font-semibold">{r.name}</p><p className="text-xs text-base-content/50">Verified booking</p></div>
                        <span className="flex items-center gap-1 text-sm font-bold"><FiStar className="fill-yellow-400 text-yellow-400" /> {r.rating}</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-base-content/75">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : <p className="mt-3 text-sm text-base-content/70">No reviews yet. Book this studio and be the first to leave one.</p>}
          </section>

          <section id="host" className="scroll-mt-36">
            <h2 className="font-display text-2xl font-bold">Your host</h2>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-base-300 p-5">
              <div className="flex items-center gap-4">
                <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(s.ownerName)}`} alt="" className="h-14 w-14 rounded-full" />
                <div>
                  <p className="flex items-center gap-2 font-bold">{s.ownerName} <span className="badge badge-success badge-sm">Verified Host</span></p>
                  {s.ownerEmail ? <p className="text-sm text-base-content/60">{s.ownerEmail}</p>
                    : <Link href={`/login?next=${encodeURIComponent(`/studios/${id}`)}`} className="flex items-center gap-1 text-sm text-primary hover:underline"><FiLock size={13} /> Log in to see host contact</Link>}
                </div>
              </div>
              <span className="flex items-center gap-2 rounded-full bg-base-200 px-3 py-2 text-xs text-base-content/70"><FiShield /> Protected by StudioSpace Host Guarantee</span>
            </div>
          </section>
        </div>

        <aside className="card-eq h-fit self-start p-6 shadow-lg lg:sticky lg:top-32">
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-primary">${s.hourlyRate}<span className="text-sm font-normal text-base-content/60"> / hour</span></p>
            <span className="flex items-center gap-1 text-sm"><FiStar className="fill-yellow-400 text-yellow-400" /> {s.rating ? s.rating.toFixed(1) : 'New'}</span>
          </div>
          <dl className="mt-5 space-y-2 border-t border-base-300 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-base-content/60">Security Deposit</dt><dd className="font-bold">${s.securityDeposit}</dd></div>
            <div className="flex justify-between"><dt className="text-base-content/60">Cancellation Policy</dt><dd className="font-bold text-success">Free before shoot confirmation</dd></div>
            <div className="flex justify-between"><dt className="text-base-content/60">Availability</dt><dd className="font-bold">Instant Request Slots</dd></div>
          </dl>
          <button className="btn btn-primary mt-5 w-full" onClick={book} disabled={isOwner}><FiCalendar /> {isOwner ? 'This is your listing' : 'Book Workspace Now'}</button>
          <p className="mt-3 text-center text-xs text-base-content/60">You will not be charged immediately. Your reservation will enter Pending status for host approval.</p>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold">More {s.category.toLowerCase()} spaces</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{similar.map((x) => <StudioCard key={x._id} s={x} />)}</div>
        </section>
      )}
      <BookingModal open={open} onClose={() => setOpen(false)} studio={s} />
    </div>
  );
}
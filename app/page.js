'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css'; import 'swiper/css/pagination'; import 'swiper/css/navigation'; import 'swiper/css/effect-fade';
import { FiCamera, FiMic, FiMusic, FiFilm, FiTool, FiSearch, FiClock, FiZap, FiStar, FiShield, FiUserCheck, FiHeadphones, FiArrowRight, FiCheck, FiFileText, FiMapPin, FiCalendar } from 'react-icons/fi';
import { api } from '@/lib/api';
import StudioCard from '@/components/StudioCard';
import { GridSkeleton } from '@/components/Spinner';

const slides = [
  { img: 'https://picsum.photos/seed/ss-hero1/1800/900', h: 'Find the room where your next frame gets made', p: 'Cyc walls, sound stages and recording suites, bookable by the hour from hosts who care about your shoot.' },
  { img: 'https://picsum.photos/seed/ss-hero2/1800/900', h: 'Press record in a podcast lounge, not your closet', p: 'Treated rooms, broadcast mics and a host who has already set the levels.' },
  { img: 'https://picsum.photos/seed/ss-hero3/1800/900', h: 'Own an empty room? Put it to work', p: 'List your studio, set your hourly rate and confirm bookings on your schedule.' },
];
const cats = [
  ['Photo Studio', 'Photo Studios', FiCamera, 'Cyclorama walls, natural daylight lofts and professional lighting setups.', 'bg-sky-500/15 text-sky-500'],
  ['Film Stage', 'Sound Stages', FiFilm, 'Acoustic blackboxes, green screens, camera-ready power and drive-in access.', 'bg-purple-500/15 text-purple-500'],
  ['Podcast Lounge', 'Podcast Rooms', FiMic, 'Turnkey audio and video recording with multi-cam switchers and pro mics.', 'bg-emerald-500/15 text-emerald-500'],
  ['Music Suite', 'Music Suites', FiMusic, 'Monitoring rooms, analog consoles, vocal booths and live rooms.', 'bg-amber-500/15 text-amber-500'],
  ['Workshop', 'Art Workshops', FiTool, 'Ceramic kilns, pottery wheels, printmaking presses and maker space.', 'bg-pink-500/15 text-pink-500'],
];
const steps = [
  ['Discover Spaces', 'Filter verified cyc walls, podcast lounges, soundstages and mixing suites by location, gear and creator reviews.', FiSearch, 'bg-amber-500/15 text-amber-500'],
  ['Select Shoot Hours', 'Pick a date, start time and length, and see the full price breakdown with zero surprise fees.', FiClock, 'bg-sky-500/15 text-sky-500'],
  ['Book Instantly', 'Lock in your reservation with double-booking prevention, host confirmation and downloadable invoices.', FiZap, 'bg-emerald-500/15 text-emerald-500'],
  ['Create & Produce', 'Arrive at the stage, plug into ready equipment and bring your vision to life.', FiStar, 'bg-purple-500/15 text-purple-500'],
];
const promises = [
  ['$1,000,000 Host Liability Protection', 'Comprehensive property and stage damage coverage backed by creative insurance underwriters for every booking.', FiShield],
  ['Identity & Professional Verification', 'Every studio host and booking creator goes through ID and portfolio verification for workspace safety.', FiUserCheck],
  ['Production Equipment Safeguard', 'High-value lenses, microphones and lighting grids are protected with itemized check-in and check-out protocols.', FiTool],
  ['24/7 Dedicated Production Concierge', 'On-call assistance for technical access, power hookups, acoustic calibration and emergency reschedules.', FiHeadphones],
];

function CountUp({ to, prefix = '', suffix = '' }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min((t - start) / 1400, 1);
        setV(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{prefix}{Math.round(v)}{suffix}</span>;
}

function SpotCard({ children, className = '' }) {
  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
      }}
      className={`group relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl ${className}`}>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(280px circle at var(--x, 50%) var(--y, 50%), oklch(var(--p) / 0.18), transparent 70%)' }} />
      <div className="relative">{children}</div>
    </div>
  );
}

function Preview({ i }) {
  const panels = [
    <div key="0" className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-base-300 px-3 py-2.5 text-sm text-base-content/60"><FiSearch /> Search studios or locations</div>
      <div className="flex flex-wrap gap-2">
        {['Photo Studio', 'Film Stage', 'Podcast Lounge', 'Music Suite'].map((c, k) => (
          <span key={c} className={`rounded-full px-3 py-1 text-xs font-semibold ${k === 0 ? 'bg-primary text-primary-content' : 'bg-base-200'}`}>{c}</span>
        ))}
      </div>
      {[['Whiteout Cyc Wall Studio', '$45 / hr', '4.9'], ['Northlight Loft', '$38 / hr', '4.7']].map(([n, p, r]) => (
        <div key={n} className="flex items-center justify-between rounded-xl border border-base-300 p-3">
          <div className="flex items-center gap-3">
            <span className="h-11 w-14 rounded-lg bg-gradient-to-br from-primary/50 to-accent/40" />
            <div><p className="text-sm font-bold">{n}</p><p className="flex items-center gap-1 text-xs text-base-content/60"><FiStar className="text-warning" /> {r}</p></div>
          </div>
          <span className="text-sm font-bold text-primary">{p}</span>
        </div>
      ))}
    </div>,

    <div key="1" className="space-y-4">
      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16'].map((d, k) => (
          <span key={d} className={`rounded-xl py-2 font-semibold ${k === 2 ? 'bg-primary text-primary-content' : 'bg-base-200'}`}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        {['09:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map((t, k) => (
          <span key={t} className={`rounded-lg border py-2 font-semibold ${k === 1 ? 'border-primary text-primary' : 'border-base-300 text-base-content/60'}`}>{t}</span>
        ))}
      </div>
      <div className="space-y-1.5 rounded-xl bg-base-200 p-4 text-sm">
        <div className="flex justify-between"><span>$45 x 3 hr</span><span>$135</span></div>
        <div className="flex justify-between"><span>Security deposit</span><span>$100</span></div>
        <div className="flex justify-between border-t border-base-300 pt-2 font-bold"><span>Total</span><span className="text-primary">$235</span></div>
      </div>
    </div>,

    <div key="2" className="space-y-4">
      <div className="space-y-3">
        {[['Request sent', 'Wed 14, 10:00 to 13:00'], ['Host confirmed', 'Slot locked for you'], ['No overlap found', 'Double-booking check passed']].map(([t, d]) => (
          <div key={t} className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-success/20 text-success"><FiCheck /></span>
            <div><p className="text-sm font-bold">{t}</p><p className="text-xs text-base-content/60">{d}</p></div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl border border-success/40 bg-success/10 p-4">
        <span className="text-sm font-bold">Booking status</span>
        <span className="badge badge-success">Confirmed</span>
      </div>
    </div>,

    <div key="3" className="space-y-4">
      <div className="rounded-xl border border-dashed border-base-300 p-4">
        <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-bold"><FiFileText /> Invoice #SS-2048</span><span className="badge badge-outline">PDF</span></div>
        <div className="mt-3 space-y-1 text-xs text-base-content/70">
          <p className="flex items-center gap-2"><FiMapPin /> Whiteout Cyc Wall Studio</p>
          <p className="flex items-center gap-2"><FiCalendar /> Wed 14, 10:00 to 13:00</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        {['Gear ready', 'Lights on', 'Roll camera'].map((t) => <span key={t} className="rounded-lg bg-primary/10 py-3 font-semibold text-primary">{t}</span>)}
      </div>
    </div>,
  ];
  const urls = ['explore', 'book', 'confirmation', 'invoice'];
  return (
    <div className="rounded-3xl border border-base-300 bg-base-100 shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-base-300 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-error/70" /><span className="h-2.5 w-2.5 rounded-full bg-warning/70" /><span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <span className="ml-3 text-xs text-base-content/50">studiospace / {urls[i]}</span>
      </div>
      <div key={i} className="min-h-[19rem] p-5" style={{ animation: 'ssfade .45s ease' }}>{panels[i]}</div>
    </div>
  );
}

function HowItWorks() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((x) => (x + 1) % steps.length), 5000);
    return () => clearTimeout(t);
  }, [i, paused]);
  return (
    <section id="how-it-works" className="page mt-24 scroll-mt-24">
      <style>{`@keyframes ssfade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes ssfill{from{width:0}to{width:100%}}`}</style>
      <div className="rounded-[2rem] bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-6 md:p-12">
        <div className="max-w-2xl">
          <h2 className="section-title">Book a studio in four easy steps</h2>
          <p className="section-sub">Pick a step to see exactly what you will see on screen.</p>
        </div>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="space-y-3">
            {steps.map(([t, d, Icon], k) => (
              <button key={t} onClick={() => setI(k)}
                className={`relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${k === i ? 'border-primary/40 bg-base-100 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <div className="flex items-start gap-4">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors ${k === i ? 'bg-primary text-primary-content' : 'bg-base-300'}`}><Icon size={20} /></span>
                  <div>
                    <h3 className="font-display text-lg font-bold">{t}</h3>
                    <p className={`mt-1 text-sm leading-relaxed text-base-content/70 ${k === i ? '' : 'line-clamp-1'}`}>{d}</p>
                  </div>
                </div>
                {k === i && <span key={i} className="absolute bottom-0 left-0 h-0.5 bg-primary" style={{ animation: 'ssfill 5s linear forwards', animationPlayState: paused ? 'paused' : 'running' }} />}
              </button>
            ))}
            <Link href="/studios" className="btn btn-primary mt-3">Start Exploring Workspaces <FiArrowRight /></Link>
          </div>
          <Preview i={i} />
        </div>
      </div>
    </section>
  );
}

function About({ total }) {
  const stats = [[total, '', 'Studios listed', ''], [5, '', 'Creative categories', ''], [1, '$', 'Million host protection', 'M'], [24, '', 'Hour support, 7 days', '/7']];
  return (
    <section id="about" className="page mt-24 scroll-mt-24">
      <div className="grid items-end gap-10 lg:grid-cols-2">
        <div>
          <h2 className="section-title">Built for creators and the people who host them</h2>
          <p className="mt-4 max-w-prose leading-relaxed text-base-content/70">
            Great studios sit empty while photographers, podcasters and musicians search for somewhere to work. StudioSpace connects them with clear prices, verified profiles and a calendar that cannot be double-booked.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map(([n, pre, label, suf]) => (
            <div key={label} className="rounded-2xl border border-base-300 p-5">
              <p className="font-display text-4xl font-bold text-primary"><CountUp to={n} prefix={pre} suffix={suf} /></p>
              <p className="mt-1 text-sm text-base-content/70">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {promises.map(([t, d, Icon]) => (
          <SpotCard key={t} className="p-6">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:rotate-6 group-hover:bg-primary group-hover:text-primary-content"><Icon size={22} /></span>
            <h3 className="mt-4 font-display text-lg font-bold leading-snug">{t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-base-content/70">{d}</p>
          </SpotCard>
        ))}
      </div>

      <div className="relative mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-r from-primary to-accent p-8 text-white md:p-12">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="font-display text-2xl font-bold md:text-3xl">Have an empty room? Turn it into a studio people love.</h3>
            <p className="mt-2 text-white/85">List your space in minutes, set your own hourly rate and confirm bookings when it suits you.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/add-studio" className="btn border-0 bg-white text-black hover:bg-white/90">Become a Verified Host</Link>
            <Link href="/studios" className="btn btn-outline border-white text-white hover:bg-white hover:text-black">Browse Protected Spaces</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState(null);
  const [stats, setStats] = useState({ total: 0, byCategory: {} });
  useEffect(() => { api('/stats').then(setStats).catch(() => {}); }, []);
  useEffect(() => { api('/studios?sort=rating&limit=6').then(setFeatured).catch(() => setFeatured([])); }, []);

  return (
    <>
      <Swiper modules={[Autoplay, Pagination, Navigation, EffectFade]} effect="fade" autoplay={{ delay: 5000 }} pagination={{ clickable: true }} navigation loop className="h-[70vh] min-h-[480px]">
        {slides.map((s, i) => (
          <SwiperSlide key={i} className="relative">
            <img src={s.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="page relative flex h-full flex-col justify-center text-white">
              <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight md:text-6xl">{s.h}</h1>
              <p className="mt-4 max-w-xl text-lg text-white/85">{s.p}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
                <Link href="/studios" className="btn btn-outline border-white text-white hover:bg-white hover:text-black">Host Your Space</Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <section className="page mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Curated production categories</p>
            <h2 className="section-title mt-2">Browse by Creative Discipline</h2>
          </div>
          <Link href="/studios" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            Explore All Workspaces <FiArrowRight />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cats.map(([v, label, Icon, desc, tone]) => (
            <Link key={v} href={`/studios?category=${encodeURIComponent(v)}`}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                e.currentTarget.style.transform = `perspective(700px) rotateX(${(-y * 10).toFixed(1)}deg) rotateY(${(x * 10).toFixed(1)}deg) translateY(-8px)`;
              }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
              className="card-eq group flex flex-col gap-3 p-5 transition-all duration-150 ease-out will-change-transform hover:border-primary hover:shadow-2xl hover:shadow-primary/20">
              <span className={`grid h-11 w-11 place-items-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${tone}`}><Icon size={20} /></span>
              <h3 className="font-display text-lg font-bold transition-colors group-hover:text-primary">{label}</h3>
              <p className="text-sm leading-relaxed text-base-content/70">{desc}</p>
              <div className="mt-auto flex items-center justify-between border-t border-base-300 pt-3 text-xs text-base-content/60">
                <span>{stats.byCategory[v] || 0} Spaces</span>
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
              <FiZap /> Top-rated spaces
            </span>
            <h2 className="section-title mt-3">Featured Creative Workspaces</h2>
            <p className="section-sub">Hand-inspected production facilities and studio suites top-rated by directors, producers and audio engineers.</p>
          </div>
          <Link href="/studios" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            View All Workspaces <FiArrowRight />
          </Link>
        </div>
        <div className="mt-8">
          {!featured ? <GridSkeleton /> : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{featured.map((s) => <StudioCard key={s._id} s={s} />)}</div>
          )}
        </div>
      </section>

      <HowItWorks />
      <About total={stats.total} />
    </>
  );
}
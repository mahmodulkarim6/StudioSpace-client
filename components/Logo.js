import Link from 'next/link';
import { FiAperture } from 'react-icons/fi';

export default function Logo({ size = 'md', tagline = true, light = false, href = '/' }) {
  const big = size === 'lg';
  return (
    <Link href={href} className="group inline-flex min-w-0 items-center gap-2 sm:gap-3" aria-label="StudioSpace home">
      <span className={`grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#6d55ff] to-[#3a22b5] text-white shadow-md shadow-primary/30 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 ${big ? 'h-12 w-12' : 'h-9 w-9 sm:h-10 sm:w-10'}`}>
        <FiAperture size={big ? 26 : 22} className="transition-transform duration-700 group-hover:rotate-180" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`whitespace-nowrap font-display font-bold tracking-tight ${big ? 'text-3xl' : 'text-xl sm:text-2xl'} ${light ? 'text-white' : ''}`}>
        Studio<span className={light ? 'text-[#a99dff]' : 'text-primary'}>Space</span>
        </span>
        {tagline && (
        <span className={`mt-1 hidden text-[11px] font-medium tracking-wide sm:block ${light ? 'text-white/60' : 'text-base-content/60'}`}>
        Creative marketplace</span>
      )}
  </span>
    </Link>
  );
}
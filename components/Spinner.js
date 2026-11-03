import { FiAperture } from 'react-icons/fi';
export default function Spinner({ label = 'Loading StudioSpace...' }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-primary" role="status">
      <FiAperture className="animate-spin" size={44} />
      <span className="text-sm text-base-content/70">{label}</span>
    </div>
  );
}
export function GridSkeleton({ n = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: n }).map((_, i) => <div key={i} className="skeleton h-[26rem] w-full rounded-2xl" />)}
    </div>
  );
}
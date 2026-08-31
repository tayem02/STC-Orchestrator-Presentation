import type { CSSProperties } from 'react';

const orbs = [
  {
    className: 'left-[-14%] top-[-18%] h-[46rem] w-[46rem] bg-stc/45',
    style: { '--duration': '30s', '--delay': 0 },
  },
  {
    className: 'right-[-16%] top-[6%] h-[38rem] w-[38rem] bg-pwc/30',
    style: { '--duration': '24s', '--delay': 2200 },
  },
  {
    className: 'bottom-[-24%] left-[24%] h-[42rem] w-[42rem] bg-stc-bright/25',
    style: { '--duration': '34s', '--delay': 4800 },
  },
] as const;

export default function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {orbs.map((orb) => (
        <div
          key={orb.className}
          className={`orb absolute rounded-full blur-[130px] ${orb.className}`}
          style={orb.style as CSSProperties}
        />
      ))}
      <div className="grid-field absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-ink)_92%)]" />
    </div>
  );
}

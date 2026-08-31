import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type RevealProps = {
  delay?: number;
  className?: string;
  children: ReactNode;
};

/** Fades and lifts content into place. `delay` is in milliseconds. */
export function Reveal({ delay = 0, className = '', children }: RevealProps) {
  return (
    <div className={`reveal ${className}`} style={{ '--delay': delay } as CSSProperties}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.24em] text-white/65 uppercase">
      <span className="relative flex h-1.5 w-1.5">
        <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-pwc-amber" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-pwc-amber" />
      </span>
      {children}
    </span>
  );
}

export function SlideTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-4xl leading-[1.08] font-semibold tracking-tight text-balance text-white md:text-5xl xl:text-[3.4rem]">
      {children}
    </h2>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-2xl text-base leading-relaxed text-pretty text-white/60 md:text-lg">
      {children}
    </p>
  );
}

/** Counts up to `value` once the slide it lives on becomes active. */
export function Counter({
  value,
  duration = 1500,
  decimals = 0,
  prefix = '',
  suffix = '',
}: {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic keeps the final digits from crawling.
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(value * eased);
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/** Types out each string in sequence, then holds on the last one. */
export function Typewriter({
  lines,
  speed = 34,
  startDelay = 0,
  className = '',
}: {
  lines: string[];
  speed?: number;
  startDelay?: number;
  className?: string;
}) {
  const [text, setText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const full = lines[lineIndex] ?? '';
    let charIndex = 0;
    let typeTimer: ReturnType<typeof setTimeout>;
    let advanceTimer: ReturnType<typeof setTimeout>;

    const typeNext = () => {
      charIndex += 1;
      setText(full.slice(0, charIndex));
      if (charIndex < full.length) {
        typeTimer = setTimeout(typeNext, speed);
      } else if (lineIndex < lines.length - 1) {
        advanceTimer = setTimeout(() => setLineIndex((i) => i + 1), 1400);
      }
    };

    setText('');
    typeTimer = setTimeout(typeNext, lineIndex === 0 ? startDelay : 220);

    return () => {
      clearTimeout(typeTimer);
      clearTimeout(advanceTimer);
    };
  }, [lines, lineIndex, speed, startDelay]);

  return (
    <span className={className}>
      {text}
      <span className="caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-pwc-amber" />
    </span>
  );
}

export function Card({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-pwc-amber/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {children}
    </div>
  );
}

import { Reveal } from '../components/primitives';

const asks = [
  { label: 'Pilot scope', value: 'Two ITGC audits, six weeks' },
  { label: 'From stc', value: 'Read-only access and a control owner' },
  { label: 'From PwC', value: 'Delivery pod and the assurance framework' },
];

export default function Closing() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-10">
      <Reveal delay={60}>
        <p className="text-[11px] font-semibold tracking-[0.3em] text-white/45 uppercase">
          Where we go next
        </p>
      </Reveal>

      <Reveal delay={160}>
        <h2 className="max-w-4xl text-5xl leading-[1.02] font-semibold tracking-tight text-balance md:text-6xl xl:text-7xl">
          Let the team spend its <span className="shimmer-text">judgement</span> on risk, not on
          spreadsheets.
        </h2>
      </Reveal>

      <Reveal delay={320}>
        <div className="grid max-w-3xl gap-4 sm:grid-cols-3">
          {asks.map((ask) => (
            <div key={ask.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-pwc-amber uppercase">
                {ask.label}
              </p>
              <p className="mt-2 text-sm text-white/75">{ask.value}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={480}>
        <div className="flex items-center gap-5 border-t border-white/10 pt-6 text-[11px] font-semibold tracking-[0.28em] text-white/40 uppercase">
          <span className="text-white/75">stc</span>
          <span className="h-4 w-px bg-white/20" />
          <span>Group Internal Audit</span>
          <span className="h-4 w-px bg-white/20" />
          <span className="text-pwc-amber">PwC Data &amp; Analytics · 2026</span>
        </div>
      </Reveal>
    </div>
  );
}

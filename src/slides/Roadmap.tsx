import type { CSSProperties } from 'react';
import SlideFrame from '../components/SlideFrame';
import { Reveal } from '../components/primitives';

const phases = [
  {
    horizon: 'Now',
    window: 'Weeks 1–6',
    title: 'Pilot on ITGC',
    points: ['Two connectors live', 'Access and change controls', 'Baseline against manual tests'],
    state: 'active' as const,
  },
  {
    horizon: 'Next',
    window: 'Weeks 7–16',
    title: 'Scale the plan',
    points: ['Revenue assurance and procurement', 'Workpaper templates in-product', 'Reviewer workflow'],
    state: 'upcoming' as const,
  },
  {
    horizon: 'Then',
    window: 'Weeks 17–30',
    title: 'Continuous auditing',
    points: ['Always-on control monitoring', 'Alerts to control owners', 'Remediation re-testing'],
    state: 'upcoming' as const,
  },
  {
    horizon: 'Horizon',
    window: 'Year 2',
    title: 'Assurance across the group',
    points: ['Risk, compliance and SOX reuse', 'Board-level risk view', 'Subsidiary rollout'],
    state: 'future' as const,
  },
];

export default function Roadmap() {
  return (
    <SlideFrame
      eyebrow="Roadmap"
      title={
        <>
          From one pilot audit to{' '}
          <span className="text-pwc-amber">continuous assurance</span>.
        </>
      }
    >
      <div className="relative">
        <span className="absolute top-[13px] right-0 left-0 hidden h-px bg-gradient-to-r from-pwc via-pwc-amber/50 to-transparent lg:block" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map((phase, index) => (
            <Reveal key={phase.title} delay={340 + index * 140}>
              <div className="flex h-full flex-col gap-4">
                <span className="relative flex h-[27px] items-center">
                  <span
                    className={`relative grid h-[27px] w-[27px] place-items-center rounded-full border-2 ${
                      phase.state === 'active'
                        ? 'border-pwc-amber bg-ink'
                        : phase.state === 'upcoming'
                          ? 'border-white/30 bg-ink'
                          : 'border-white/15 bg-ink'
                    }`}
                  >
                    {phase.state === 'active' ? (
                      <>
                        <span
                          className="pulse-ring absolute inset-0 rounded-full bg-pwc-amber/50"
                          style={{ '--delay': 400 } as CSSProperties}
                        />
                        <span className="h-2.5 w-2.5 rounded-full bg-pwc-amber" />
                      </>
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-white/25" />
                    )}
                  </span>
                </span>

                <div>
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-pwc-amber uppercase">
                    {phase.horizon}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-white/40">{phase.window}</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{phase.title}</h3>
                </div>

                <ul className="flex flex-col gap-2 text-sm text-white/55">
                  {phase.points.map((point) => (
                    <li key={point} className="flex gap-2.5">
                      <span className="mt-2 h-px w-3 shrink-0 bg-white/25" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

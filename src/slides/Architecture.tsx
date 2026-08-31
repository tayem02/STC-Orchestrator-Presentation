import type { CSSProperties } from 'react';
import SlideFrame from '../components/SlideFrame';
import { Reveal } from '../components/primitives';

const stages = [
  {
    step: '01',
    title: 'Connect',
    body: 'Read-only connectors to SAP, ServiceNow, Workday, the GRC platform and the evidence drive.',
  },
  {
    step: '02',
    title: 'Structure',
    body: 'Documents, tickets and tables are parsed into one audit-aware index with entity and date awareness.',
  },
  {
    step: '03',
    title: 'Reason',
    body: 'The model plans the test, writes the query, runs it over the full population and checks its own arithmetic.',
  },
  {
    step: '04',
    title: 'Evidence',
    body: 'Every assertion is bound to a source row, screenshot or paragraph before it reaches the auditor.',
  },
  {
    step: '05',
    title: 'Deliver',
    body: 'Findings, workpapers and the audit committee summary are drafted in the house template.',
  },
];

export default function Architecture() {
  return (
    <SlideFrame
      eyebrow="How it works"
      title={
        <>
          Five stages between a question
          <br className="hidden md:block" /> and a{' '}
          <span className="text-pwc-amber">defensible workpaper</span>.
        </>
      }
    >
      <div className="relative">
        <svg
          aria-hidden
          className="absolute top-[34px] right-6 left-6 hidden h-2 lg:block"
          preserveAspectRatio="none"
          viewBox="0 0 1000 2"
        >
          <line
            x1="0"
            y1="1"
            x2="1000"
            y2="1"
            className="flow-line"
            stroke="url(#flow)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="flow" x1="0" x2="1">
              <stop offset="0%" stopColor="#4f008c" />
              <stop offset="55%" stopColor="#d04a02" />
              <stop offset="100%" stopColor="#ffb600" />
            </linearGradient>
          </defs>
        </svg>

        <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {stages.map((stage, index) => (
            <Reveal key={stage.step} delay={360 + index * 120}>
              <li className="flex h-full flex-col gap-3">
                <span className="relative grid h-[68px] w-[68px] place-items-center rounded-2xl border border-white/12 bg-ink-soft font-mono text-sm text-pwc-amber">
                  <span
                    className="pulse-ring absolute inset-0 rounded-2xl border border-pwc-amber/50"
                    style={{ '--delay': index * 420 } as CSSProperties}
                  />
                  {stage.step}
                </span>
                <h3 className="text-lg font-semibold text-white">{stage.title}</h3>
                <p className="text-sm leading-relaxed text-white/55">{stage.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>

      <Reveal delay={980}>
        <p className="text-sm text-white/45">
          Nothing leaves the tenant. The model reasons over stc data inside stc infrastructure.
        </p>
      </Reveal>
    </SlideFrame>
  );
}

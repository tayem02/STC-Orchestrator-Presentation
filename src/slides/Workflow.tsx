import { useEffect, useState } from 'react';
import SlideFrame from '../components/SlideFrame';
import { Reveal } from '../components/primitives';

const steps = [
  { label: 'Interpreting the request', detail: 'Control IA-C-114 · Privileged access revocation' },
  { label: 'Pulling the population', detail: '1,284 leavers · Workday · 1 Apr – 30 Jun' },
  { label: 'Joining access stores', detail: 'SAP · Active Directory · ServiceNow · 3 more' },
  { label: 'Applying the test', detail: 'Revocation within 24h of last working day' },
  { label: 'Validating exceptions', detail: '11 exceptions · each traced to a source record' },
  { label: 'Drafting the finding', detail: 'IA-2026-041 · High · awaiting reviewer' },
];

const STEP_INTERVAL = 900;

export default function Workflow() {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    if (completed >= steps.length) return;
    const timer = setTimeout(() => setCompleted((n) => n + 1), STEP_INTERVAL);
    return () => clearTimeout(timer);
  }, [completed]);

  const finished = completed >= steps.length;

  return (
    <SlideFrame
      eyebrow="Inside a run"
      title={
        <>
          A four-day test, <span className="text-pwc-amber">done while you read this</span>.
        </>
      }
    >
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_0.8fr]">
        <Reveal delay={300}>
          <ol className="glass flex flex-col gap-1 rounded-2xl p-5">
            {steps.map((step, index) => {
              const done = index < completed;
              const active = index === completed;

              return (
                <li
                  key={step.label}
                  className={`flex items-center gap-4 rounded-xl px-3 py-2.5 transition-all duration-500 ${
                    done || active ? 'opacity-100' : 'opacity-35'
                  } ${active ? 'bg-white/[0.05]' : ''}`}
                >
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] transition-colors duration-500 ${
                      done
                        ? 'border-pwc-amber bg-pwc-amber text-ink'
                        : active
                          ? 'border-pwc-amber text-pwc-amber'
                          : 'border-white/20 text-white/40'
                    }`}
                  >
                    {done ? '✓' : index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-white/90">
                      {step.label}
                    </span>
                    <span className="block truncate font-mono text-[11px] text-white/45">
                      {step.detail}
                    </span>
                  </span>
                  {active ? (
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-pwc-amber" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-pwc-amber" />
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </Reveal>

        <Reveal delay={440}>
          <div className="flex flex-col gap-4">
            <div
              className={`rounded-2xl border p-5 transition-all duration-700 ${
                finished
                  ? 'border-pwc-amber/40 bg-pwc-amber/[0.07]'
                  : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              <p className="text-[11px] font-semibold tracking-[0.2em] text-white/45 uppercase">
                Elapsed
              </p>
              <p className="mt-1 font-mono text-4xl font-semibold text-white">
                {finished ? '00:38' : '––:––'}
              </p>
              <p className="mt-3 text-sm text-white/55">
                The same test, run by hand across six systems, took the team four working days last
                cycle.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-white/45 uppercase">
                Auditor keeps
              </p>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-white/70">
                <li>Judgement on the rating</li>
                <li>The conversation with the control owner</li>
                <li>Sign-off before anything is issued</li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </SlideFrame>
  );
}

import SlideFrame from '../components/SlideFrame';
import { Reveal } from '../components/primitives';

const conversation = [
  {
    from: 'auditor' as const,
    text: 'Test privileged access revocation for leavers in Q2. Full population.',
  },
  {
    from: 'assistant' as const,
    text: 'Matched 1,284 leavers from Workday against 6 privileged access stores. 11 accounts stayed active beyond the 24-hour SLA.',
    meta: '4 sources · 1,284 records · 38 seconds',
  },
  {
    from: 'assistant' as const,
    text: 'Drafted finding IA-2026-041 at High rating, with the exception listing and control owner attached.',
    meta: 'Ready for reviewer sign-off',
  },
];

const pillars = [
  { title: 'Ask in plain language', body: 'No SQL, no export requests, no ticket queue.' },
  { title: 'Work the full population', body: 'Every record tested, not a sample of forty.' },
  { title: 'Answer with evidence', body: 'Each claim links back to the source row or document.' },
];

export default function Solution() {
  return (
    <SlideFrame
      eyebrow="The solution"
      title={
        <>
          One assistant that sits across{' '}
          <span className="text-pwc-amber">every audit system</span>.
        </>
      }
    >
      <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal delay={320}>
          <div className="glass flex flex-col gap-3 rounded-2xl p-5">
            {conversation.map((message, index) => (
              <Reveal key={message.text} delay={460 + index * 320}>
                <div
                  className={
                    message.from === 'auditor'
                      ? 'ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-br from-stc to-stc-bright/80 px-4 py-3'
                      : 'mr-auto max-w-[92%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-4 py-3'
                  }
                >
                  <p className="text-sm leading-relaxed text-white/90">{message.text}</p>
                  {message.meta ? (
                    <p className="mt-2 font-mono text-[11px] tracking-wide text-pwc-amber/80">
                      {message.meta}
                    </p>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <div className="flex flex-col gap-4">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={520 + index * 150}>
              <div className="flex gap-4">
                <span className="mt-1 h-full w-px shrink-0 bg-gradient-to-b from-pwc via-pwc-amber/40 to-transparent" />
                <div>
                  <h3 className="text-base font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/55">{pillar.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

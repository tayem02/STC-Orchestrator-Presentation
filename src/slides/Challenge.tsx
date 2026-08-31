import SlideFrame from '../components/SlideFrame';
import { Card, Counter, Reveal } from '../components/primitives';

const pains = [
  {
    stat: <Counter value={70} suffix="%" />,
    label: 'of audit hours',
    body: 'go to gathering, reconciling and formatting evidence rather than forming a judgement on risk.',
  },
  {
    stat: <Counter value={12} suffix=" systems" />,
    label: 'per engagement',
    body: 'ERP, ITSM, HR, GRC and shared drives — each with its own export, owner and waiting time.',
  },
  {
    stat: <Counter value={4} suffix=" weeks" />,
    label: 'average lag',
    body: 'between a control breaking and the audit committee hearing about it in a report.',
  },
];

export default function Challenge() {
  return (
    <SlideFrame
      eyebrow="The problem"
      title={
        <>
          Audit teams are experts in judgement,
          <br className="hidden md:block" /> spending their days on{' '}
          <span className="text-pwc-amber">logistics</span>.
        </>
      }
      lede="Coverage is capped not by capability, but by how fast a human can pull, read and cross-reference evidence."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {pains.map((pain, index) => (
          <Reveal key={pain.label} delay={380 + index * 130}>
            <Card className="h-full">
              <p className="text-4xl font-semibold tracking-tight text-white xl:text-5xl">
                {pain.stat}
              </p>
              <p className="mt-1 text-xs font-semibold tracking-[0.18em] text-pwc-amber uppercase">
                {pain.label}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/55">{pain.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={820}>
        <p className="border-l-2 border-pwc pl-5 text-sm text-white/50 italic md:text-base">
          The result: sampling instead of full populations, findings that arrive after the decision,
          and a backlog that grows faster than the team.
        </p>
      </Reveal>
    </SlideFrame>
  );
}

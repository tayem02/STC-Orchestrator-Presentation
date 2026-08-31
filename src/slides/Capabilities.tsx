import SlideFrame from '../components/SlideFrame';
import { Card, Reveal } from '../components/primitives';

const capabilities = [
  {
    glyph: 'RA',
    title: 'Risk assessment',
    body: 'Scans incidents, change records and prior findings to propose where the annual plan should focus.',
  },
  {
    glyph: 'CT',
    title: 'Control testing',
    body: 'Executes design and operating effectiveness tests across the full population, not a sample.',
  },
  {
    glyph: 'EV',
    title: 'Evidence review',
    body: 'Reads contracts, policies and tickets, then flags the clauses that contradict the control narrative.',
  },
  {
    glyph: 'AN',
    title: 'Anomaly detection',
    body: 'Surfaces duplicate payments, segregation-of-duty conflicts and out-of-hours privileged activity.',
  },
  {
    glyph: 'WP',
    title: 'Workpaper drafting',
    body: 'Produces the finding, the rating rationale and the management action in the standard template.',
  },
  {
    glyph: 'FU',
    title: 'Follow-up tracking',
    body: 'Monitors remediation commitments and re-tests the control when the due date arrives.',
  },
];

export default function Capabilities() {
  return (
    <SlideFrame
      eyebrow="Capabilities"
      title={
        <>
          Built for the audit lifecycle,
          <br className="hidden md:block" /> not just the{' '}
          <span className="text-pwc-amber">chat window</span>.
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {capabilities.map((capability, index) => (
          <Reveal key={capability.title} delay={340 + index * 90}>
            <Card className="h-full">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/12 bg-gradient-to-br from-stc/70 to-transparent font-mono text-xs font-semibold tracking-wider text-white">
                {capability.glyph}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">{capability.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{capability.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </SlideFrame>
  );
}

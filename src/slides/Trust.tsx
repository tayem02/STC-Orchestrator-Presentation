import SlideFrame from '../components/SlideFrame';
import { Card, Reveal } from '../components/primitives';

const guardrails = [
  {
    title: 'Citation or silence',
    body: 'The assistant may not assert a fact it cannot link to a source record. Unsupported statements are withheld, not guessed.',
  },
  {
    title: 'Read-only by design',
    body: 'Connectors hold read scopes only. The assistant can never write to a source system of record.',
  },
  {
    title: 'Human sign-off',
    body: 'No finding is issued, rated or closed without a named auditor approving it. The tool drafts; people decide.',
  },
  {
    title: 'Data stays home',
    body: 'Processing runs inside the stc tenant in-Kingdom. No customer or employee data trains an external model.',
  },
  {
    title: 'Full audit trail',
    body: 'Every prompt, query, source and version is logged — so the audit of the audit is itself auditable.',
  },
  {
    title: 'Bias and drift checks',
    body: 'Sampling logic and model outputs are re-validated each quarter against manually tested baselines.',
  },
];

export default function Trust() {
  return (
    <SlideFrame
      eyebrow="Governance"
      title={
        <>
          Internal audit cannot use a tool
          <br className="hidden md:block" /> it could not{' '}
          <span className="text-pwc-amber">audit itself</span>.
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {guardrails.map((guardrail, index) => (
          <Reveal key={guardrail.title} delay={320 + index * 95}>
            <Card className="h-full">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pwc-amber" />
                <div>
                  <h3 className="text-base font-semibold text-white">{guardrail.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{guardrail.body}</p>
                </div>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </SlideFrame>
  );
}

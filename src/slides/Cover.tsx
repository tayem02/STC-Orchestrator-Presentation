import { Reveal, Typewriter } from '../components/primitives';

const prompts = [
  'Which access controls failed re-certification last quarter?',
  'Summarise every exception raised on the revenue assurance audit.',
  'Draft the finding, rated, with evidence references.',
];

export default function Cover() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-10">
      <Reveal delay={0}>
        <div className="flex items-center gap-4 text-[11px] font-semibold tracking-[0.3em] text-white/45 uppercase">
          <span className="text-white/80">stc</span>
          <span className="h-4 w-px bg-white/20" />
          <span>Group Internal Audit</span>
          <span className="h-4 w-px bg-white/20" />
          <span className="text-pwc-amber">PwC Data &amp; Analytics</span>
        </div>
      </Reveal>

      <div className="flex flex-col gap-6">
        <Reveal delay={120}>
          <h1 className="text-6xl leading-[0.95] font-semibold tracking-tighter text-balance md:text-7xl xl:text-[6.5rem]">
            <span className="block text-white">Internal Audit</span>
            <span className="shimmer-text block">Assistant</span>
          </h1>
        </Reveal>

        <Reveal delay={260}>
          <p className="max-w-2xl text-lg text-pretty text-white/60 md:text-xl">
            An AI colleague for the audit team — it reads the evidence, tests the controls, and
            drafts the findings, with a citation behind every sentence.
          </p>
        </Reveal>
      </div>

      <Reveal delay={420}>
        <div className="glass flex w-full max-w-3xl items-center gap-4 rounded-2xl px-5 py-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-pwc to-pwc-rose text-sm font-bold text-white">
            IA
          </span>
          <p className="truncate font-mono text-sm text-white/85 md:text-base">
            <Typewriter lines={prompts} startDelay={900} />
          </p>
        </div>
      </Reveal>

      <Reveal delay={560}>
        <p className="text-xs tracking-[0.2em] text-white/35 uppercase">
          Use the arrow keys, scroll, or swipe to advance
        </p>
      </Reveal>
    </div>
  );
}

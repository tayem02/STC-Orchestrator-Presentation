import type { CSSProperties } from 'react';
import SlideFrame from '../components/SlideFrame';
import { Counter, Reveal } from '../components/primitives';

const metrics = [
  {
    value: <Counter value={100} suffix="%" />,
    label: 'Population coverage',
    note: 'Up from a 40-item judgemental sample',
  },
  {
    value: <Counter value={8.5} decimals={1} suffix="×" />,
    label: 'Faster fieldwork',
    note: 'Median control test, pilot cycle',
  },
  {
    value: <Counter value={62} suffix="%" />,
    label: 'Less drafting effort',
    note: 'Measured on first-draft workpapers',
  },
  {
    value: <Counter value={3} suffix=" days" />,
    label: 'Issue-to-report',
    note: 'Previously four weeks',
  },
];

const cycles = [
  { label: 'Q1', manual: 62, assisted: 0 },
  { label: 'Q2', manual: 58, assisted: 24 },
  { label: 'Q3', manual: 41, assisted: 66 },
  { label: 'Q4', manual: 22, assisted: 94 },
];

export default function Impact() {
  return (
    <SlideFrame
      eyebrow="Impact"
      title={
        <>
          More coverage, sooner, with the{' '}
          <span className="text-pwc-amber">same headcount</span>.
        </>
      }
      lede="Figures from the pilot across IT general controls and revenue assurance."
    >
      <div className="grid items-end gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <Reveal key={metric.label} delay={360 + index * 120}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-4xl font-semibold tracking-tight text-white xl:text-5xl">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm font-medium text-white/80">{metric.label}</p>
                <p className="mt-0.5 text-xs text-white/40">{metric.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={520}>
          <div className="glass rounded-2xl p-6">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-white/45 uppercase">
              Controls tested per quarter
            </p>
            <div className="mt-6 flex h-52 items-end gap-5">
              {cycles.map((cycle, index) => (
                <div key={cycle.label} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex h-full w-full items-end justify-center gap-1.5">
                    <span
                      className="bar-grow w-1/2 rounded-t-md bg-white/15"
                      style={
                        { height: `${cycle.manual}%`, '--delay': 620 + index * 110 } as CSSProperties
                      }
                    />
                    <span
                      className="bar-grow w-1/2 rounded-t-md bg-gradient-to-t from-pwc to-pwc-amber"
                      style={
                        {
                          height: `${cycle.assisted}%`,
                          '--delay': 720 + index * 110,
                        } as CSSProperties
                      }
                    />
                  </div>
                  <span className="text-xs text-white/45">{cycle.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-5 text-xs text-white/50">
              <span className="flex items-center gap-2">
                <span className="h-2 w-4 rounded-sm bg-white/15" /> Manual
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-4 rounded-sm bg-gradient-to-r from-pwc to-pwc-amber" />{' '}
                Assistant-supported
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </SlideFrame>
  );
}

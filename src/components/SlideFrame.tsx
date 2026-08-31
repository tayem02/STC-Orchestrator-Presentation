import type { ReactNode } from 'react';
import { Lede, Reveal, SectionLabel, SlideTitle } from './primitives';

type SlideFrameProps = {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
};

export default function SlideFrame({ eyebrow, title, lede, children }: SlideFrameProps) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-8">
      <header className="flex flex-col gap-5">
        <Reveal delay={40}>
          <SectionLabel>{eyebrow}</SectionLabel>
        </Reveal>
        <Reveal delay={140}>
          <SlideTitle>{title}</SlideTitle>
        </Reveal>
        {lede ? (
          <Reveal delay={240}>
            <Lede>{lede}</Lede>
          </Reveal>
        ) : null}
      </header>
      {children}
    </div>
  );
}

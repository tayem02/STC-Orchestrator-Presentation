import type { ComponentType } from 'react';
import Architecture from './Architecture';
import Capabilities from './Capabilities';
import Challenge from './Challenge';
import Closing from './Closing';
import Cover from './Cover';
import Impact from './Impact';
import Roadmap from './Roadmap';
import Solution from './Solution';
import Trust from './Trust';
import Workflow from './Workflow';

export type Slide = {
  id: string;
  name: string;
  Component: ComponentType;
};

export const slides: Slide[] = [
  { id: 'cover', name: 'Cover', Component: Cover },
  { id: 'challenge', name: 'The problem', Component: Challenge },
  { id: 'solution', name: 'The solution', Component: Solution },
  { id: 'architecture', name: 'How it works', Component: Architecture },
  { id: 'capabilities', name: 'Capabilities', Component: Capabilities },
  { id: 'workflow', name: 'Inside a run', Component: Workflow },
  { id: 'impact', name: 'Impact', Component: Impact },
  { id: 'trust', name: 'Governance', Component: Trust },
  { id: 'roadmap', name: 'Roadmap', Component: Roadmap },
  { id: 'closing', name: 'Next steps', Component: Closing },
];

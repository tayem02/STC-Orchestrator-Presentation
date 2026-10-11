import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const NAV_ITEMS = [
  { id: "full-engagement", label: "Full Engagement Workflows" },
  { id: "engagement-setup", label: "Engagement Setup & Context" },
  { id: "inherent-risk", label: "Inherent Risk Workflow" },
  { id: "apm-generator", label: "APM Generator" },
  { id: "rcm-generator", label: "RCM Generator" },
  { id: "test-plan", label: "Test Plan Generator" },
  { id: "data-request", label: "Data Request Generator" },
  { id: "testing-workflow", label: "Testing Workflow" },
  { id: "observations-generator", label: "Observations Generator" },
];
const SLIDE_IDS = ["hero", ...NAV_ITEMS.map(({ id }) => id), "validation-depth", "thank-you"];
const WORKFLOW_STEPS = OVERVIEW_STEP_LABELS();

function OVERVIEW_STEP_LABELS() {
  return [
    "Engagement Setup & Context",
    "Inherent Risk",
    "APM Generator",
    "RCM Generator",
    "Test Plan",
    "Data Request",
    "Testing",
    "Observations",
  ];
}

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function useActiveSlide() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observers = SLIDE_IDS.map((id) => {
      const element = document.getElementById(id);
      if (!element) return null;
      const observer = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setActive(id),
        { threshold: 0.42 },
      );
      observer.observe(element);
      return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  return active;
}

const HEXAGONS = [
  { x: 3, y: 5, size: 180, opacity: 0.12, delay: 0 },
  { x: 12, y: 58, size: 110, opacity: 0.08, delay: 1.5 },
  { x: 68, y: 8, size: 200, opacity: 0.1, delay: 0.8 },
  { x: 80, y: 48, size: 140, opacity: 0.09, delay: 2 },
  { x: 45, y: 78, size: 90, opacity: 0.07, delay: 1.2 },
  { x: 28, y: 28, size: 75, opacity: 0.06, delay: 2.5 },
  { x: 88, y: 78, size: 160, opacity: 0.08, delay: 0.5 },
];

function HexBackground() {
  return (
    <div className="hex-background" aria-hidden="true">
      {HEXAGONS.map((hex, index) => {
        const height = hex.size * 1.1547;
        const points = `${hex.size / 2},0 ${hex.size},${height / 4} ${hex.size},${(height * 3) / 4} ${hex.size / 2},${height} 0,${(height * 3) / 4} 0,${height / 4}`;
        return (
          <svg
            key={index}
            className="hex-float"
            width={hex.size}
            height={height}
            viewBox={`0 0 ${hex.size} ${height}`}
            style={{
              left: `${hex.x}%`,
              top: `${hex.y}%`,
              opacity: hex.opacity,
              animationDelay: `${hex.delay}s`,
            }}
          >
            <polygon points={points} fill="none" stroke="var(--hex-stroke)" strokeWidth="1.5" />
          </svg>
        );
      })}
    </div>
  );
}

function Legend() {
  return (
    <div className="legend">
      <span><i className="legend-dot ai" />AI Agent</span>
      <span><i className="legend-dot human" />Human Action</span>
    </div>
  );
}

type NodeVariant = "input" | "process" | "ai" | "output";

function Node({
  label,
  sublabel,
  variant = "process",
  tooltip,
  delay = 0,
  visible = true,
  width,
}: {
  label: string;
  sublabel?: string;
  variant?: NodeVariant;
  tooltip?: string;
  delay?: number;
  visible?: boolean;
  width?: number;
}) {
  return (
    <div
      className={`node-wrap ${variant === "ai" ? "has-ai" : ""}`}
      style={{ width: width ?? 164 }}
    >
      {variant === "ai" && <span className="ai-badge">AI</span>}
      <div
        className={`workflow-node ${variant} ${visible ? "node-enter" : "before-enter"}`}
        style={{ animationDelay: `${delay}s` }}
      >
        <strong>{label}</strong>
        {sublabel && <small>{sublabel}</small>}
      </div>
      {tooltip && <p className={`node-description ${variant === "output" ? "output-description" : ""}`}>{tooltip}</p>}
    </div>
  );
}

function Arrow({
  label,
  pink = false,
  delay = 0,
  visible = true,
  width = 70,
}: {
  label?: string;
  pink?: boolean;
  delay?: number;
  visible?: boolean;
  width?: number;
}) {
  return (
    <div
      className={`flow-arrow ${pink ? "pink" : ""} ${visible ? "arrow-enter" : "before-enter"}`}
      style={{ width, animationDelay: `${delay}s` }}
    >
      {label && <span>{label}</span>}
      <div className="arrow-line">
        {pink && <i style={{ animationDelay: `${delay}s` }} />}
      </div>
    </div>
  );
}

function Inputs({
  items,
  visible,
  delay = 0,
  label = "What happens",
}: {
  items: Array<{ text: string; pink?: boolean }>;
  visible: boolean;
  delay?: number;
  label?: "Inputs" | "What happens";
}) {
  return (
    <div
      className={`input-list ${visible ? "fade-enter" : "before-enter"}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <small className={`detail-label ${label === "Inputs" ? "inputs-label" : ""}`}>{label}</small>
      {items.map((item) => (
        <span key={item.text} className={item.pink ? "pink" : ""}>{item.text}</span>
      ))}
    </div>
  );
}

function NodeColumn({
  children,
  width,
}: {
  children: ReactNode;
  width?: number;
}) {
  return <div className="node-column" style={{ width }}>{children}</div>;
}

function Loop({ children, visible, delay = 0, label = "Loop" }: { children: ReactNode; visible: boolean; delay?: number; label?: string }) {
  return (
    <div
      className={`loop-wrap ${visible ? "fade-enter loop-pulse" : "before-enter"}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <span>{label}</span>
      {children}
    </div>
  );
}

function ArrowTrack() {
  return <i aria-hidden="true">{[0, 1, 2].map((arrow) => <b key={arrow} />)}</i>;
}

function FeedbackLoop({ visible, delay }: { visible: boolean; delay: number }) {
  return (
    <div
      className={`feedback-loop ${visible ? "fade-enter" : "before-enter"}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <span>Reflect Comments</span>
      <ArrowTrack />
    </div>
  );
}

function MovingArrowheads({ path }: { path: string }) {
  return (
    <g className="apm-moving-arrows">
      {[0, -2.67, -5.33].map((begin) => (
        <path d="M-5 -3 L2 0 L-5 3 Z" key={begin}>
          <animateMotion begin={`${begin}s`} dur="8s" repeatCount="indefinite" path={path} rotate="auto" />
        </path>
      ))}
    </g>
  );
}

function SectionHeader({
  title,
  visible,
  showLegend = true,
  titleAction,
}: {
  title: string;
  visible: boolean;
  showLegend?: boolean;
  titleAction?: ReactNode;
}) {
  return (
    <header className={visible ? "section-header section-enter" : "section-header before-enter"}>
      <div className="eyebrow"><i />AI Orchestrator</div>
      <div className="heading-row">
        <h2>{title}</h2>
        {titleAction}
        {showLegend && <Legend />}
      </div>
      <div className="header-rule" />
    </header>
  );
}

/** Lets a lightbox name the slide it was opened from, on screen and in the PDF export. */
const SlideTitleContext = createContext("Slide");

function LightboxBack({
  label,
  onClick,
  autoFocus = false,
}: {
  label: string;
  onClick: () => void;
  autoFocus?: boolean;
}) {
  return (
    <button autoFocus={autoFocus} type="button" className="lightbox-back" onClick={onClick}>
      <i aria-hidden="true">←</i>
      <span>Back to {label}</span>
    </button>
  );
}

function Section({
  id,
  title,
  alt = false,
  step,
  showRail = true,
  showLegend = true,
  titleAction,
  children,
}: {
  id: string;
  title: string;
  alt?: boolean;
  step?: number;
  showRail?: boolean;
  showLegend?: boolean;
  titleAction?: ReactNode;
  children: (visible: boolean) => ReactNode;
}) {
  const { ref, visible } = useInView();
  return (
    <SlideTitleContext.Provider value={title}>
      <section id={id} className={`deck-section ${alt ? "alt" : ""}`}>
        <div className="slide-canvas">
          <HexBackground />
          <SlideChrome />
          <div className={`slide-body ${showRail ? "" : "without-rail"}`}>
            <div ref={ref} className="section-content">
              <SectionHeader title={title} visible={visible} showLegend={showLegend} titleAction={titleAction} />
              {children(visible)}
            </div>
            {showRail && <WorkflowRail currentStep={step} />}
          </div>
        </div>
      </section>
    </SlideTitleContext.Provider>
  );
}

function StcLogo() {
  return (
    <div className="stc-logo">
      <img src="/stc-logo-white.png" alt="stc" />
    </div>
  );
}

function SlideChrome() {
  return (
    <>
      <StcLogo />
      <footer className="slide-footer">
        <span>Audit Transformation &amp; Innovation</span>
        <i />
        <span>Orchestrator Transformation</span>
        <i />
        <span className="footer-ai-core">AI Core</span>
      </footer>
    </>
  );
}

function WorkflowRail({ currentStep }: { currentStep?: number }) {
  return (
    <aside className="workflow-rail" aria-label="Eight workflow steps">
      <ol>
        {WORKFLOW_STEPS.map((label, index) => {
          const active = currentStep === index + 1;
          const complete = currentStep !== undefined && index + 1 < currentStep;
          return (
            <li key={label} className={`${active ? "active" : ""} ${complete ? "complete" : ""}`}>
              <button onClick={() => document.getElementById(NAV_ITEMS[index + 1].id)?.scrollIntoView({ behavior: "smooth" })}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{label}</b>
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="slide-canvas">
        <HexBackground />
        <div className="hero-aura" />
        <SlideChrome />
        <div className="hero-copy">
          <p>STC Internal Audit · AI Orchestrator</p>
          <h1>AI Orchestrator<br /><span>Workflows</span></h1>
          <time>August · 2026</time>
        </div>
        <div className="scroll-cue"><span>Scroll for next slide</span><i /></div>
      </div>
    </section>
  );
}

const OVERVIEW = [
  { num: "01", icon: "⚙", label: "Engagement Setup & Context", inputs: ["Engagement Related Documents"], output: "Engagement Context", ai: true, tip: "Structures all engagement information and documents." },
  { num: "02", icon: "⚠", label: "Inherent Risk Generator", inputs: ["Engagement Context", "Risk Library", "Scoring Matrix"], output: "Inherent Risks", ai: true, tip: "Identifies, writes, and scores inherent risks." },
  { num: "03", icon: "▤", label: "APM Generator", inputs: ["Engagement Context", "Inherent Risks"], output: "APM", ai: true, tip: "Drafts the audit scope, objectives, and APM." },
  { num: "04", icon: "▣", label: "RCM Generator", inputs: ["Engagement Context", "APM", "Inherent Risks"], output: "RCM", ai: true, tip: "Maps risks and writes the required controls." },
  { num: "05", icon: "⚗", label: "Test Plan Generator", inputs: ["Engagement Context", "RCM"], output: "Full RCM with Test Details", ai: true, tip: "Creates tests for every risk and control pair." },
  { num: "06", icon: "◆", label: "Data Request Generator", inputs: ["Engagement Context", "Full RCM with Test Details"], output: "Data Request", ai: true, tip: "Defines the data required to perform each test." },
  { num: "07", icon: "✓", label: "Testing Execution", inputs: ["Engagement Context", "Full RCM", "Collected Data"], output: "Test Results", ai: true, tip: "Executes four testing methods in parallel." },
  { num: "08", icon: "◉", label: "Observations Generator", inputs: ["Engagement Context", "Full RCM", "Test Results"], output: "Observations", ai: true, tip: "Analyzes exceptions and drafts observations." },
];

const AI_GENERATED_INPUTS = new Set([
  "Engagement Context",
  "Inherent Risks",
  "APM",
  "RCM",
  "Full RCM",
  "Full RCM with Test Details",
  "Test Results",
]);

const ALL_AUTOMATIONS_IMAGE = new URL(
  "../AI Core screens for the Presentation/All Automations.png",
  import.meta.url,
).href;

function OverviewCard({
  item,
  visible,
  index,
}: {
  item: (typeof OVERVIEW)[number];
  visible: boolean;
  index: number;
}) {
  return (
    <div className="overview-column">
      <div className="overview-inputs" aria-label={`Inputs: ${item.inputs.join(", ")}`}>
        <ul>
          {item.inputs.map((input) => (
            <li key={input} className={AI_GENERATED_INPUTS.has(input) ? "ai-generated" : ""}>{input}</li>
          ))}
        </ul>
      </div>
      <div className="overview-vertical-arrow" aria-hidden="true" />
      <div className="overview-node-wrap">
        <span className="overview-number-badge">{item.num}</span>
        <div
          className={`overview-card ${item.ai ? "ai" : ""} ${visible ? "node-enter" : "before-enter"}`}
          style={{ animationDelay: `${index * 0.48 + 0.15}s` }}
        >
          <em>{item.icon}</em><strong>{item.label}</strong>
        </div>
        <p className="overview-description">{item.tip}</p>
      </div>
      <div className="overview-vertical-arrow" aria-hidden="true" />
      <div className={`output-pill ${visible ? "node-enter" : "before-enter"}`} aria-label={`Output: ${item.output}`} style={{ animationDelay: `${index * 0.48 + 0.55}s` }}>
        <span>{item.output}</span>
      </div>
    </div>
  );
}

function FullEngagement() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 320);
  }, []);

  useEffect(() => {
    if (!previewOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closePreview, previewOpen]);

  return (
    <>
      <Section
        id="full-engagement"
        title="Orchestrator Architecture"
        alt
        showRail={false}
        showLegend={false}
        titleAction={(
          <button
            ref={triggerRef}
            type="button"
            className="ai-core-question"
            onClick={() => setPreviewOpen(true)}
            aria-haspopup="dialog"
          >
            <span className="ai-core-question-spark" aria-hidden="true">✦</span>
            <span>How does it look on <strong>AI Core?</strong></span>
            <span className="ai-core-question-arrow" aria-hidden="true"><i /></span>
          </button>
        )}
      >
        {(visible) => (
          <div className="workflow-scroll overview-scroll">
            <div className="io-row-outline inputs-outline" aria-hidden="true" />
            <div className="io-row-outline outputs-outline" aria-hidden="true" />
            <span className="io-axis-label input-label">Inputs</span>
            <span className="io-axis-label output-label">Outputs</span>
            <div className="overview-flow">
              {OVERVIEW.map((item, index) => (
                <div className="overview-step" key={item.num}>
                  {index > 0 && <Arrow pink visible={visible} delay={index * 0.48} width={42} />}
                  <OverviewCard item={item} visible={visible} index={index} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>
      <div
        className={`workflow-lightbox ${previewOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="All automations in AI Core"
        aria-hidden={!previewOpen}
        onClick={closePreview}
      >
        <div className="workflow-lightbox-frame" onClick={(event) => event.stopPropagation()}>
          <LightboxBack label="Orchestrator Architecture" onClick={closePreview} />
          <img src={ALL_AUTOMATIONS_IMAGE} alt="All automations in AI Core" />
        </div>
      </div>
    </>
  );
}

type WorkflowScreenshot = { src: string; alt: string; label: string };

const screenshot = (file: string, alt: string, label: string): WorkflowScreenshot => ({
  src: new URL(`../AI Core screens for the Presentation/${file}`, import.meta.url).href,
  alt,
  label,
});

const WORKFLOW_SCREENSHOTS = {
  engagementInputs: [
    screenshot("Engagement Context - Input - Basic Information.png", "Engagement basic information input screen", "Basic information"),
    screenshot("Engagement Context - Input - Upload Docs.png", "Engagement document upload input screen", "Upload documents"),
  ],
  engagementOutput: [screenshot("Engagement Context - Output.png", "Generated engagement context output", "View output")],
  inherentInput: [screenshot("Inherent Risk - Input - Upload Documents.png", "Inherent risk document upload input", "View input")],
  inherentOutput: [screenshot("Inherent Risk - Output.png", "Generated inherent risk output", "View output")],
  apmInput: [screenshot("APM - Inputs - Upload Docs.png", "APM document upload input", "View input")],
  apmOutput: [screenshot("APM - Output.png", "Generated APM output", "View output")],
  rcmInput: [screenshot("RCM - Inputs - Upload Docs.png", "RCM document upload input", "View input")],
  rcmOutput: [screenshot("RCM - Output.png", "Generated RCM output", "View output")],
  testPlanInput: [screenshot("Test Plan - Inputs - Upload Docs.png", "Test plan document upload input", "View input")],
  testPlanOutput: [screenshot("Test Plan Generator - Output.png", "Generated test plan output", "View output")],
  dataRequestInput: [screenshot("Data Request Generator - Input - Upload Docs.png", "Data request document upload input", "View input")],
  dataRequestOutput: [screenshot("Data Request Generator - Output.png", "Generated data request output", "View output")],
  testingInput: [screenshot("Test Execution - Inputs - Upload Docs.png", "Test execution document upload input", "View input")],
  testingOutput: [screenshot("Test Execution - Output.png", "Generated test execution output", "View output")],
};

function Stage({
  type,
  title,
  visible,
  delay,
  children,
}: {
  type: "inputs" | "processing" | "outputs";
  title: string;
  visible: boolean;
  delay: number;
  children: ReactNode;
}) {
  return (
    <div className={`workflow-stage ${type} ${visible ? "fade-enter" : "before-enter"}`} style={{ animationDelay: `${delay}s` }}>
      <span className="workflow-stage-label">{title}</span>
      <div className="workflow-stage-content">{children}</div>
    </div>
  );
}

function PhaseConnector({ label, pink = false }: { label: string; pink?: boolean }) {
  return <div className={`workflow-phase-connector ${pink ? "pink" : ""}`}><i /><span>{label}</span></div>;
}

function CompactArrow({ label, vertical = false }: { label?: string; vertical?: boolean }) {
  return <div className={`compact-arrow ${vertical ? "vertical" : ""}`}><ArrowTrack />{label && <span>{label}</span>}</div>;
}

function WorkflowDetail({
  visible,
  inputScreens = [],
  outputScreens = [],
  inputs,
  inputResult,
  processing,
  processingResult,
  output,
}: {
  visible: boolean;
  inputScreens?: WorkflowScreenshot[];
  outputScreens?: WorkflowScreenshot[];
  inputs: ReactNode | ((renderScreens: (images: WorkflowScreenshot[], outputStyle?: boolean) => ReactNode) => ReactNode);
  inputResult: string;
  processing: ReactNode;
  processingResult: string;
  output: ReactNode;
}) {
  const backLabel = useContext(SlideTitleContext);
  const [preview, setPreview] = useState<WorkflowScreenshot | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openPreview = (image: WorkflowScreenshot, trigger: HTMLButtonElement) => {
    if (closeTimeoutRef.current !== null) window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
    triggerRef.current = trigger;
    setPreview(image);
    setPreviewOpen(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setPreviewOpen(true)));
  };

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
    if (closeTimeoutRef.current !== null) window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = window.setTimeout(() => {
      setPreview(null);
      closeTimeoutRef.current = null;
      triggerRef.current?.focus();
    }, 320);
  }, []);

  useEffect(() => {
    if (!preview) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closePreview, preview]);

  useEffect(() => () => {
    if (closeTimeoutRef.current !== null) window.clearTimeout(closeTimeoutRef.current);
  }, []);

  const thumbnails = (images: WorkflowScreenshot[], outputStyle = false) => images.length ? (
    <div className={`workflow-thumbnails ${images.length > 1 ? "multiple" : ""}`}>
      {images.map((image) => (
        <button
          className={`workflow-thumbnail ${outputStyle ? "output-thumbnail" : ""}`}
          type="button"
          key={image.src}
          onClick={(event) => openPreview(image, event.currentTarget)}
          aria-label={`Enlarge ${image.alt}`}
        >
          <img src={image.src} alt={`${image.alt} preview`} />
          <span>{image.label}</span>
        </button>
      ))}
    </div>
  ) : null;
  const renderedInputs = typeof inputs === "function" ? inputs(thumbnails) : inputs;

  return (
    <>
      <div className="workflow-scroll workflow-detail"><div className="workflow-three-stage">
        <Stage type="inputs" title="Inputs" visible={visible} delay={0}>
          {renderedInputs}
          {thumbnails(inputScreens)}
        </Stage>
        <PhaseConnector label={inputResult} />
        <Stage type="processing" title="Processing" visible={visible} delay={0.28}>
          {processing}
        </Stage>
        <PhaseConnector label={processingResult} pink />
        <Stage type="outputs" title="Outputs" visible={visible} delay={0.72}>
          {output}
          {thumbnails(outputScreens, true)}
        </Stage>
      </div></div>
      {preview && (
        <div className={`workflow-lightbox ${previewOpen ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label={preview.alt} onClick={closePreview}>
          <div className="workflow-lightbox-frame" onClick={(event) => event.stopPropagation()}>
            <LightboxBack label={backLabel} onClick={closePreview} autoFocus />
            <img src={preview.src} alt={preview.alt} />
          </div>
        </div>
      )}
    </>
  );
}

function EngagementSetup() {
  return (
    <Section id="engagement-setup" title="Engagement Setup & Context" step={1}>
      {(visible) => (
        <WorkflowDetail
          visible={visible}
          outputScreens={WORKFLOW_SCREENSHOTS.engagementOutput}
          inputResult=""
          processingResult=""
          inputs={(renderScreens) => <div className="stage-stack engagement-input-map"><div className="input-image-pair"><Node label="Basic Info about the engagement" variant="input" tooltip="Fill in the basic engagement information" visible={visible} />{renderScreens([WORKFLOW_SCREENSHOTS.engagementInputs[0]])}</div><CompactArrow label="Engagement information" vertical /><div className="input-image-pair"><Node label="Upload Files" variant="input" tooltip="Upload all context-related documents" visible={visible} delay={0.18} />{renderScreens([WORKFLOW_SCREENSHOTS.engagementInputs[1]])}</div></div>}
          processing={<div className="processing-chain"><Loop visible={visible} delay={0.36} label="Loop · For each file"><Node label="Document Extraction & Indexing" variant="ai" tooltip="Extracts and indexes document content for analysis" visible={visible} delay={0.44} width={210} /><CompactArrow label="Extracted & indexed content" vertical /><Node label="One paragraph summarizing the file content" variant="ai" tooltip="AI generates a one-paragraph summary per document" visible={visible} delay={0.56} width={210} /></Loop><CompactArrow /><Node label="Engagement Context Analysis" variant="ai" tooltip="Uses all document summaries to write the structured engagement context" visible={visible} delay={0.68} width={210} /></div>}
          output={<Node label="Engagement Context File" variant="output" visible={visible} delay={0.82} width={178} />}
        />
      )}
    </Section>
  );
}

function InherentRisk() {
  return (
    <Section id="inherent-risk" title="Inherent Risk Workflow" alt step={2}>
      {(visible) => (
        <WorkflowDetail
          visible={visible}
          inputScreens={WORKFLOW_SCREENSHOTS.inherentInput}
          outputScreens={WORKFLOW_SCREENSHOTS.inherentOutput}
          inputResult=""
          processingResult=""
          inputs={<NodeColumn width={178}><Node label="Upload required documents" variant="input" visible={visible} width={178} /><Inputs label="Inputs" items={[{ text: "Engagement Context", pink: true }, { text: "Risk Library" }, { text: "Risk Matrix" }]} visible={visible} delay={0.1} /></NodeColumn>}
          processing={(
            <div className="processing-chain inherent-risk-steps">
              <div className="inherent-risk-step">
                <Node label="Risk Areas Identifier" variant="ai" tooltip="Identifies all risk areas that could affect the engagement" visible={visible} delay={0.34} width={184} />
              </div>
              <div className="inherent-step-connector">
                <span>Risk Areas</span>
                <ArrowTrack />
              </div>
              <div className="inherent-risk-step">
                <Node label="Inherent Risk Generator" variant="ai" tooltip="Writes each structured risk as a risk statement and description" visible={visible} delay={0.46} width={184} />
              </div>
              <div className="inherent-step-connector">
                <span>For each risk</span>
                <ArrowTrack />
              </div>
              <div className="inherent-risk-step">
                <Loop visible={visible} delay={0.56}>
                  <Node label="Risk Evaluator" variant="ai" tooltip="Assigns impact and likelihood, then calculates the risk score" visible={visible} delay={0.62} width={184} />
                </Loop>
              </div>
            </div>
          )}
          output={<Node label="Inherent Risk" variant="output" visible={visible} delay={0.82} width={178} />}
        />
      )}
    </Section>
  );
}

function ReviewNode({ label, visible, delay, width }: { label: string; visible: boolean; delay: number; width?: number }) {
  return <div className="review-node"><FeedbackLoop visible={visible} delay={delay} /><Node label={label} variant="process" tooltip={`Review and provide comments on the generated ${label === "Comments" ? "output" : label}`} visible={visible} delay={delay} width={width} /><div className="review-answer"><span>Yes ↑</span><span>No →</span></div></div>;
}

function APM() {
  return (
    <Section id="apm-generator" title="APM Generator" step={3}>
      {(visible) => (
        <WorkflowDetail
          visible={visible}
          inputScreens={WORKFLOW_SCREENSHOTS.apmInput}
          outputScreens={WORKFLOW_SCREENSHOTS.apmOutput}
          inputResult=""
          processingResult=""
          inputs={<NodeColumn width={178}><Node label="Upload required documents" variant="input" visible={visible} width={178} /><Inputs label="Inputs" items={[{ text: "Engagement Context", pink: true }, { text: "Inherent Risk", pink: true }, { text: "Any additional files" }]} visible={visible} delay={0.1} /></NodeColumn>}
          processing={(
            <div className="processing-chain">
              <div className="apm-review-flow">
                <div className="apm-writer-flow">
                  <div className="apm-writer-pair">
                    <div className="apm-flow-card">
                      <Node label="Objective Writer" variant="ai" tooltip="Parallel AI agent writing audit objectives" visible={visible} delay={0.34} width={170} />
                    </div>
                    <div className="apm-flow-card">
                      <Node label="Scope Writer" variant="ai" tooltip="AI agent writing audit scope from Engagement Context and Inherent Risk" visible={visible} delay={0.42} width={170} />
                    </div>
                  </div>
                  <svg className="apm-branch-arrows" viewBox="0 0 240 100" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <marker id="apm-arrow-down" viewBox="0 0 8 8" refX="4" refY="7" markerWidth="7" markerHeight="7" orient="0"><path d="M0 0 L8 0 L4 8 Z" /></marker>
                      <marker id="apm-arrow-up" viewBox="0 0 8 8" refX="4" refY="1" markerWidth="7" markerHeight="7" orient="0"><path d="M0 8 L8 8 L4 0 Z" /></marker>
                    </defs>
                    <path d="M0 23 H160 V27" markerEnd="url(#apm-arrow-down)" />
                    <MovingArrowheads path="M0 23 H160 V27" />
                    <path d="M0 77 H160 V73" markerEnd="url(#apm-arrow-up)" />
                    <MovingArrowheads path="M0 77 H160 V73" />
                  </svg>
                  <div className="apm-generator-target apm-flow-card">
                    <Node label="APM Generator" variant="ai" tooltip="Writes the structured APM using the predefined template" visible={visible} delay={0.54} width={160} />
                  </div>
                </div>
                <CompactArrow label="Draft APM" />
                <ReviewNode label="Comments" visible={visible} delay={0.66} />
                <svg className="apm-comment-return" viewBox="0 0 632 100" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <marker id="apm-comment-arrow-down" viewBox="0 0 8 8" refX="4" refY="7" markerWidth="7" markerHeight="7" orient="0"><path d="M0 0 L8 0 L4 8 Z" /></marker>
                  </defs>
                  <path d="M550 24 V10 H330 V27" markerEnd="url(#apm-comment-arrow-down)" />
                  <MovingArrowheads path="M550 24 V10 H330 V27" />
                </svg>
                <span className="apm-comment-return-label">Reflect comments</span>
              </div>
            </div>
          )}
          output={<Node label="APM" variant="output" visible={visible} delay={0.82} width={178} />}
        />
      )}
    </Section>
  );
}

function RCM() {
  return (
    <Section id="rcm-generator" title="RCM Generator" alt step={4}>
      {(visible) => (
        <WorkflowDetail
          visible={visible}
          inputScreens={WORKFLOW_SCREENSHOTS.rcmInput}
          outputScreens={WORKFLOW_SCREENSHOTS.rcmOutput}
          inputResult=""
          processingResult=""
          inputs={<NodeColumn width={178}><Node label="Upload required documents" variant="input" visible={visible} width={178} /><Inputs label="Inputs" items={[{ text: "Engagement Context", pink: true }, { text: "APM", pink: true }, { text: "Inherent Risk", pink: true }]} visible={visible} delay={0.1} /></NodeColumn>}
          processing={(
            <div className="processing-chain inherent-risk-steps">
              <div className="inherent-risk-step">
                <Node label="Objective – Risk Mapping" variant="ai" tooltip="Maps each in-scope risk to its most suitable objective" visible={visible} delay={0.34} width={184} />
              </div>
              <div className="inherent-step-connector">
                <span>Mapped risks</span>
                <ArrowTrack />
              </div>
              <div className="inherent-risk-step">
                <Node label="Risk Categorizer" variant="ai" tooltip="Assigns the best-fit risk category to each risk" visible={visible} delay={0.46} width={184} />
              </div>
              <div className="inherent-step-connector">
                <span>Categorized risks</span>
                <ArrowTrack />
              </div>
              <div className="inherent-risk-step">
                <Node label="Control Writer" variant="ai" tooltip="Writes an appropriate control for each risk" visible={visible} delay={0.58} width={184} />
              </div>
            </div>
          )}
          output={<Node label="RCM" variant="output" visible={visible} delay={0.82} width={178} />}
        />
      )}
    </Section>
  );
}

function TestPlan() {
  return (
    <Section id="test-plan" title="Test Plan Generator" step={5}>
      {(visible) => (
        <WorkflowDetail
          visible={visible}
          inputScreens={WORKFLOW_SCREENSHOTS.testPlanInput}
          outputScreens={WORKFLOW_SCREENSHOTS.testPlanOutput}
          inputResult=""
          processingResult=""
          inputs={<NodeColumn width={178}><Node label="Upload required documents" variant="input" visible={visible} width={178} /><Inputs label="Inputs" items={[{ text: "Engagement Context", pink: true }, { text: "RCM", pink: true }]} visible={visible} delay={0.1} /></NodeColumn>}
          processing={(
            <div className="processing-chain">
              <div className="test-plan-review-flow">
                <Node label="Test Writer" variant="ai" tooltip="Writes a test statement for each risk and control, covering all possible scenarios" visible={visible} delay={0.34} width={190} />
                <CompactArrow label="Draft test plan" />
                <ReviewNode label="Comments" visible={visible} delay={0.56} />
                <svg className="test-plan-comment-return" viewBox="0 0 499 38" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <marker id="test-plan-comment-arrow-down" viewBox="0 0 8 8" refX="4" refY="7" markerWidth="7" markerHeight="7" orient="0"><path d="M0 0 L8 0 L4 8 Z" /></marker>
                  </defs>
                  <path d="M417 38 V8 H95 V38" markerEnd="url(#test-plan-comment-arrow-down)" />
                  <MovingArrowheads path="M417 38 V8 H95 V38" />
                </svg>
                <span className="test-plan-comment-return-label">Reflect comments</span>
              </div>
            </div>
          )}
          output={<Node label="Full RCM (with all tests details)" variant="output" visible={visible} delay={0.82} width={190} />}
        />
      )}
    </Section>
  );
}

function DataRequest() {
  return (
    <Section id="data-request" title="Data Request Generator" alt step={6}>
      {(visible) => (
        <WorkflowDetail
          visible={visible}
          inputScreens={WORKFLOW_SCREENSHOTS.dataRequestInput}
          outputScreens={WORKFLOW_SCREENSHOTS.dataRequestOutput}
          inputResult=""
          processingResult=""
          inputs={<NodeColumn width={178}><Node label="Upload required documents" variant="input" visible={visible} width={178} /><Inputs label="Inputs" items={[{ text: "Engagement Context", pink: true }, { text: "Full RCM (with all tests details)", pink: true }]} visible={visible} delay={0.1} /></NodeColumn>}
          processing={(
            <div className="processing-chain inherent-risk-steps">
              <div className="inherent-risk-step">
                <Node label="Test Analyzer" variant="ai" tooltip="Understands each test and generates clarification questions for the auditor" visible={visible} delay={0.34} width={184} />
              </div>
              <div className="inherent-step-connector">
                <span>Clarification questions</span>
                <ArrowTrack />
              </div>
              <div className="inherent-risk-step">
                <Node label="Data Clarification Questions" tooltip="The auditor answers the listed questions about known data sources" visible={visible} delay={0.46} width={184} />
              </div>
              <div className="inherent-step-connector">
                <span>Auditor answers</span>
                <ArrowTrack />
              </div>
              <div className="inherent-risk-step">
                <Node label="Data Request Generator" variant="ai" tooltip="Generates the final structured data request document" visible={visible} delay={0.58} width={184} />
              </div>
            </div>
          )}
          output={<Node label="Data Request" variant="output" visible={visible} delay={0.82} width={178} />}
        />
      )}
    </Section>
  );
}

const EXECUTORS = [
  { label: "Document & Evidence Review", icon: "▱" },
  { label: "Structured Data Testing", icon: "▥" },
  { label: "Analytical & Anomaly Review", icon: "⌁" },
  { label: "Manual & Fieldwork Testing", icon: "✓" },
];

function Testing() {
  return (
    <Section id="testing-workflow" title="Testing Workflow" step={7}>
      {(visible) => (
        <WorkflowDetail
          visible={visible}
          inputScreens={WORKFLOW_SCREENSHOTS.testingInput}
          outputScreens={WORKFLOW_SCREENSHOTS.testingOutput}
          inputResult=""
          processingResult=""
          inputs={<NodeColumn width={178}><Node label="Upload required documents" variant="input" visible={visible} width={178} /><Inputs label="Inputs" items={[{ text: "Engagement Context", pink: true }, { text: "Full RCM", pink: true }, { text: "Collected Data" }]} visible={visible} delay={0.1} /></NodeColumn>}
          processing={(
            <div className="processing-chain testing-processing">
              <Node label="Test Classifier" variant="ai" tooltip="Classifies each test into one of four methods: document review, structured data testing, analytical review, or manual testing" visible={visible} delay={0.34} width={420} />
              <CompactArrow label="Classified tests" vertical />
              <div className="executor-group">
                <div className="executor-grid">
                  {EXECUTORS.map((item, index) => (
                    <NodeColumn width={210} key={item.label}>
                      <Node label="Test Executor" sublabel={`${item.icon} ${item.label}`} variant="ai" tooltip={`Executes ${item.label} tests and generates test results`} visible={visible} delay={0.48 + index * 0.12} width={210} />
                    </NodeColumn>
                  ))}
                </div>
              </div>
            </div>
          )}
          output={<Node label="Test Results" variant="output" visible={visible} delay={0.96} width={178} />}
        />
      )}
    </Section>
  );
}

function ObservationsGenerator() {
  return (
    <Section id="observations-generator" title="Observations Generator" alt step={8}>
      {(visible) => (
        <WorkflowDetail
          visible={visible}
          inputResult=""
          processingResult=""
          inputs={<NodeColumn width={178}><Node label="Upload required documents" variant="input" visible={visible} width={178} /><Inputs label="Inputs" items={[{ text: "Engagement Context", pink: true }, { text: "Full RCM", pink: true }, { text: "Test Results", pink: true }]} visible={visible} delay={0.1} /></NodeColumn>}
          processing={(
            <div className="processing-chain inherent-risk-steps observations-steps">
              <div className="inherent-risk-step">
                <Node label="Exceptions Analyzer" variant="ai" tooltip="Analyzes all test exceptions and identifies potential observations" visible={visible} delay={0.34} width={184} />
              </div>
              <div className="inherent-step-connector">
                <span>Identified observations</span>
                <ArrowTrack />
              </div>
              <div className="inherent-risk-step">
                <Node label="Observations Generator" variant="ai" tooltip="Uses identified observations to generate structured details and a summary" visible={visible} delay={0.46} width={184} />
              </div>
              <div className="inherent-step-connector">
                <span>Draft observations</span>
                <ArrowTrack />
              </div>
              <div className="inherent-risk-step">
                <ReviewNode label="Comments" visible={visible} delay={0.6} width={184} />
              </div>
              <svg className="observations-comment-return" viewBox="0 0 716 256" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <marker id="observations-comment-arrow-down" viewBox="0 0 8 8" refX="4" refY="7" markerWidth="7" markerHeight="7" orient="0"><path d="M0 0 L8 0 L4 8 Z" /></marker>
                </defs>
                <path d="M624 192 V20 H358 V64" markerEnd="url(#observations-comment-arrow-down)" />
                <MovingArrowheads path="M624 192 V20 H358 V64" />
              </svg>
              <span className="observations-comment-return-label">Reflect comments</span>
            </div>
          )}
          output={<Node label="Observations" variant="output" visible={visible} delay={0.82} width={178} />}
        />
      )}
    </Section>
  );
}

const APPENDIX_SCREENS: (WorkflowScreenshot & { caption: string })[] = [
  { src: ALL_AUTOMATIONS_IMAGE, alt: "All automations in AI Core", label: "All automations", caption: "AI Core · All automations" },
  { ...WORKFLOW_SCREENSHOTS.engagementInputs[0], caption: "01 · Engagement Setup — Basic information" },
  { ...WORKFLOW_SCREENSHOTS.engagementInputs[1], caption: "01 · Engagement Setup — Upload documents" },
  { ...WORKFLOW_SCREENSHOTS.engagementOutput[0], caption: "01 · Engagement Setup — Output" },
  { ...WORKFLOW_SCREENSHOTS.inherentInput[0], caption: "02 · Inherent Risk — Input" },
  { ...WORKFLOW_SCREENSHOTS.inherentOutput[0], caption: "02 · Inherent Risk — Output" },
  { ...WORKFLOW_SCREENSHOTS.apmInput[0], caption: "03 · APM Generator — Input" },
  { ...WORKFLOW_SCREENSHOTS.apmOutput[0], caption: "03 · APM Generator — Output" },
  { ...WORKFLOW_SCREENSHOTS.rcmInput[0], caption: "04 · RCM Generator — Input" },
  { ...WORKFLOW_SCREENSHOTS.rcmOutput[0], caption: "04 · RCM Generator — Output" },
  { ...WORKFLOW_SCREENSHOTS.testPlanInput[0], caption: "05 · Test Plan — Input" },
  { ...WORKFLOW_SCREENSHOTS.testPlanOutput[0], caption: "05 · Test Plan — Output" },
  { ...WORKFLOW_SCREENSHOTS.dataRequestInput[0], caption: "06 · Data Request — Input" },
  { ...WORKFLOW_SCREENSHOTS.dataRequestOutput[0], caption: "06 · Data Request — Output" },
  { ...WORKFLOW_SCREENSHOTS.testingInput[0], caption: "07 · Testing Execution — Input" },
  { ...WORKFLOW_SCREENSHOTS.testingOutput[0], caption: "07 · Testing Execution — Output" },
];

function Appendix() {
  const [preview, setPreview] = useState<number | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openPreview = (index: number, trigger: HTMLButtonElement) => {
    if (closeTimeoutRef.current !== null) window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
    triggerRef.current = trigger;
    setPreview(index);
    setPreviewOpen(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setPreviewOpen(true)));
  };

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
    if (closeTimeoutRef.current !== null) window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = window.setTimeout(() => {
      setPreview(null);
      closeTimeoutRef.current = null;
      triggerRef.current?.focus();
    }, 320);
  }, []);

  useEffect(() => {
    if (preview === null) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closePreview, preview]);

  useEffect(() => () => {
    if (closeTimeoutRef.current !== null) window.clearTimeout(closeTimeoutRef.current);
  }, []);

  const current = preview === null ? null : APPENDIX_SCREENS[preview];

  return (
    <section id="appendix" className="appendix">
      <div className="slide-canvas">
        <HexBackground />
        <SlideChrome />
        <div className="appendix-copy">
          <p>STC Internal Audit · AI Orchestrator</p>
          <h2>Appendix</h2>
          <span>All AI Core screens · select any screen to open it full size</span>
        </div>
        <div className="appendix-grid">
          {APPENDIX_SCREENS.map((screen, index) => (
            <button
              type="button"
              key={screen.src}
              className="appendix-card"
              data-screen={index}
              onClick={(event) => openPreview(index, event.currentTarget)}
              aria-label={`Enlarge ${screen.alt}`}
            >
              <img src={screen.src} alt={`${screen.alt} preview`} />
              <span>{screen.caption}</span>
            </button>
          ))}
        </div>
      </div>
      {current && (
        <div
          className={`workflow-lightbox appendix-lightbox ${previewOpen ? "is-open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={closePreview}
        >
          <div className="workflow-lightbox-frame" onClick={(event) => event.stopPropagation()}>
            <LightboxBack label="Appendix" onClick={closePreview} autoFocus />
            <img src={current.src} alt={current.alt} />
          </div>
        </div>
      )}
    </section>
  );
}

function ValidationDepth() {
  return (
    <Section id="validation-depth" title="Quality Cowworkers" alt showRail={false} showLegend={false}>
      {(visible) => (
        <div className={`validator-flow ${visible ? "fade-enter" : "before-enter"}`}>
          <div className="validator-stage validator-input-stage">
            <span className="validator-stage-label">Input</span>
          </div>
          <div className="validator-stage validator-agents-stage" />
          <div className="validator-stage validator-output-stage" />

          <svg className="validator-flow-lines" viewBox="0 0 1300 650" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <marker id="validator-arrow" viewBox="0 0 8 8" refX="4" refY="7" markerWidth="7" markerHeight="7" orient="0">
                <path d="M0 0 L8 0 L4 8 Z" />
              </marker>
            </defs>
            <path className="validator-branch" d="M650 64 V120 H210 V157" markerEnd="url(#validator-arrow)" />
            <path className="validator-branch" d="M650 64 V157" markerEnd="url(#validator-arrow)" />
            <path className="validator-branch" d="M650 64 V120 H1090 V157" markerEnd="url(#validator-arrow)" />
            <path className="validator-merge" d="M210 251 V345 H650 V405" markerEnd="url(#validator-arrow)" />
            <path className="validator-merge" d="M650 251 V405" markerEnd="url(#validator-arrow)" />
            <path className="validator-merge" d="M1090 251 V345 H650 V405" markerEnd="url(#validator-arrow)" />
            <path className="validator-final" d="M650 499 V570" markerEnd="url(#validator-arrow)" />
          </svg>

          <span className="validator-branch-label">Selected depth</span>
          <span className="validator-merge-label">Selected validation result</span>

          <div className="validator-layer-copy validator-choice">
            <span>User Choose the depth of the Analysis</span>
          </div>

          <div className="validator-agent-row">
            <div className="validator-node">
              <Node label="Concise Validator" sublabel="Agent will focus on critical comments only" variant="ai" visible={visible} delay={0.2} width={320} />
            </div>
            <div className="validator-node">
              <Node label="Balance Validator" sublabel="Agent will focus on critical comments and key improvements" variant="ai" visible={visible} delay={0.32} width={320} />
            </div>
            <div className="validator-node">
              <Node label="Comprehensive Validator" sublabel="Agent will focus on critical comments, key improvements and suggestions" variant="ai" visible={visible} delay={0.44} width={320} />
            </div>
          </div>

          <div className="validator-node validator-template">
            <Node label="Template Validator" sublabel="Agent will check if the file is following the template" variant="ai" visible={visible} delay={0.6} width={370} />
          </div>

          <div className="validator-layer-copy validator-output">
            <strong>Combined Output</strong>
            <span>Agent will consolidate the output and present it to the user</span>
          </div>
        </div>
      )}
    </Section>
  );
}

function ThankYou() {
  return (
    <section id="thank-you" className="thank-you">
      <div className="slide-canvas">
        <HexBackground />
        <SlideChrome />
        <div className="thank-copy">
          <h2>Thank you</h2>
          <i />
          <p>STC Internal Audit · AI Orchestrator · August 2026</p>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const active = useActiveSlide();
  const wheelLocked = useRef(false);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) return;
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName ?? "")) return;
      event.preventDefault();
      const index = Math.max(0, SLIDE_IDS.indexOf(active));
      const forward = event.key === "ArrowDown" || event.key === "ArrowRight";
      const next = Math.min(Math.max(index + (forward ? 1 : -1), 0), SLIDE_IDS.length - 1);
      document.getElementById(SLIDE_IDS[next])?.scrollIntoView({ behavior: "smooth" });
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [active]);

  useEffect(() => {
    const updateScale = () => {
      const scale = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
      document.documentElement.style.setProperty("--slide-scale", String(scale));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 12 || wheelLocked.current) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      const index = Math.max(0, SLIDE_IDS.indexOf(active));
      const direction = event.deltaY > 0 ? 1 : -1;
      const next = Math.min(Math.max(index + direction, 0), SLIDE_IDS.length - 1);
      if (next === index) return;
      wheelLocked.current = true;
      document.getElementById(SLIDE_IDS[next])?.scrollIntoView({ behavior: "smooth" });
      window.setTimeout(() => { wheelLocked.current = false; }, 750);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [active]);

  return (
    <main className="presentation-deck">
      <Hero />
      <FullEngagement />
      <EngagementSetup />
      <InherentRisk />
      <APM />
      <RCM />
      <TestPlan />
      <DataRequest />
      <Testing />
      <ObservationsGenerator />
      <ValidationDepth />
      <ThankYou />
    </main>
  );
}

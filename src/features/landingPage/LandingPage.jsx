import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  PlayCircle,
  Menu,
  X,
  Sun,
  Moon,
  Wand2,
  RefreshCw,
  History,
  LayoutDashboard,
  FileDown,
  Save,
  PenLine,
  FolderKanban,
  Lightbulb,
  ChevronDown,
  Check,
  Loader2,
  Circle,
  Star,
  GraduationCap,
  Rocket,
  Zap,
  Building2,
  TrendingUp,
  Users,
  ArrowUp,
//   Github,
//   Linkedin,
  Clock,
  ShieldCheck,
  Target,
  SlidersHorizontal,
} from 'lucide-react';
import './LandingPage.css';
import { Link } from 'react-router-dom';

/* ============================================================================
   STATIC CONTENT — kept as data so sections render via .map() instead of
   hardcoded repeated JSX.
   ============================================================================ */

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Why PitchCraft', href: '#why' },
  { label: 'FAQ', href: '#faq' },
];

const TRUSTED_BY = [
  { label: 'Students', icon: GraduationCap },
  { label: 'Founders', icon: Rocket },
  { label: 'Hackathons', icon: Zap },
  { label: 'Incubators', icon: Building2 },
  { label: 'Accelerators', icon: TrendingUp },
  { label: 'Universities', icon: Users },
];

const FEATURES = [
  {
    icon: Wand2,
    title: 'AI Pitch Generator',
    desc: 'Turn a rough idea into a structured, investor-ready pitch — written section by section, not dumped in one block.',
  },
  {
    icon: LayoutDashboard,
    title: 'Section-by-Section Generation',
    desc: 'Generate Problem, Solution, Market, or Financials on their own. Nothing else gets touched until you ask.',
  },
  {
    icon: RefreshCw,
    title: 'AI Refinement',
    desc: 'Tell any section to get shorter, more persuasive, or more technical — refine in place, one instruction at a time.',
  },
  {
    icon: History,
    title: 'Version History',
    desc: 'Every generation is saved automatically. Compare versions side by side and restore any of them instantly.',
  },
  {
    icon: FolderKanban,
    title: 'Project Workspace',
    desc: 'Every startup idea lives in its own workspace — sections, versions, and exports organized in one place.',
  },
  {
    icon: Lightbulb,
    title: 'AI Suggestions',
    desc: 'PitchCraft flags what a real investor would ask about: missing numbers, a weak value proposition, thin market sizing.',
  },
  {
    icon: PenLine,
    title: 'Rich Editor',
    desc: 'A clean, distraction-free writing surface for editing AI output by hand, with formatting that stays consistent.',
  },
  {
    icon: Save,
    title: 'Autosave',
    desc: 'Every edit is saved as you type. Close the tab, come back tomorrow — nothing is ever lost.',
  },
  {
    icon: FileDown,
    title: 'Export',
    desc: 'Ship your pitch as a formatted PDF or DOCX, ready to send to investors or drop into a deck.',
  },
];

const WORKFLOW_STEPS = [
  { step: '01', title: 'Create Project', desc: 'Start a new workspace for a single startup idea.' },
  { step: '02', title: 'Describe Startup', desc: 'Give PitchCraft the raw idea in your own words.' },
  { step: '03', title: 'Generate Sections', desc: 'Generate Problem, Solution, Market, and more — one at a time.' },
  { step: '04', title: 'Edit with AI', desc: 'Refine any section, or edit it directly yourself.' },
  { step: '05', title: 'Export Pitch', desc: 'Download a polished, investor-ready PDF or DOCX.' },
];

const PITCH_SECTIONS_FLOW = ['Idea', 'Problem', 'Solution', 'Business Model', 'Financials', 'Pitch Ready'];

const WHY_REASONS = [
  { icon: Clock, title: 'Save hours of work', desc: 'What takes a weekend of blank-page staring takes minutes with a guided workflow.' },
  { icon: ShieldCheck, title: 'Professional quality', desc: 'Structured output modeled on how real pitch decks are actually written.' },
  { icon: Target, title: 'Investor-friendly', desc: 'Language and structure tuned for the questions investors actually ask.' },
  { icon: LayoutDashboard, title: 'Structured workflow', desc: 'No blank page. Every section has a clear starting point.' },
  { icon: SlidersHorizontal, title: 'Maintain complete control', desc: 'AI drafts, you decide. Edit, regenerate, or leave it exactly as written.' },
  { icon: Wand2, title: 'Generate only what you need', desc: 'Skip sections you already have. Regenerate only the ones that need work.' },
];

const TESTIMONIALS = [
  {
    name: 'Amara Chen',
    role: 'Founder, Loop Health',
    quote: 'I had the idea for months and no idea how to structure it. PitchCraft gave me a pitch I actually sent to investors the same week.',
    initials: 'AC',
  },
  {
    name: 'Daniel Osei',
    role: 'Computer Science Student',
    quote: 'Used it for a hackathon pitch at 2am. The section-by-section flow meant I could fix just the parts judges pushed back on.',
    initials: 'DO',
  },
  {
    name: 'Priya Nair',
    role: 'Incubator Program Lead',
    quote: 'We now recommend it to every cohort. It gets founders past the blank page without writing the pitch for them.',
    initials: 'PN',
  },
];

const FAQS = [
  {
    q: 'Can I edit the AI output?',
    a: 'Yes. Every section opens in a full editor. Edit AI-generated text directly, or ask AI to refine it and edit the result.',
  },
  {
    q: 'Can I export my pitch?',
    a: 'Yes, as a formatted PDF or DOCX at any point — even before every section is finished.',
  },
  {
    q: 'Does AI replace me as the founder?',
    a: 'No. PitchCraft drafts structure and language. The idea, decisions, and final wording are always yours to keep or change.',
  },
  {
    q: 'Can I create multiple startups?',
    a: 'Yes. Your dashboard holds unlimited projects, each with its own sections, versions, and export history.',
  },
];

const FOOTER_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'Terms', href: '#terms' },
];

const GENERATION_LOG = [
  { label: 'Problem', status: 'done' },
  { label: 'Solution', status: 'done' },
  { label: 'Market', status: 'done' },
  { label: 'Business Model', status: 'active' },
  { label: 'Financials', status: 'queued' },
  { label: 'Team', status: 'queued' },
];

/* ============================================================================
   ANIMATION HELPERS
   ============================================================================ */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = (stagger = 0.08, delay = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

function Reveal({ children, className = '', delay = 0, once = true, amount = 0.2 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================================
   SHARED SMALL COMPONENTS
   ============================================================================ */

function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-secondary)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-indigo)]" />
      {children}
    </span>
  );
}

function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const alignClass = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';
  return (
    <Reveal className={`flex flex-col gap-4 max-w-2xl ${alignClass}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-semibold leading-[1.1] text-[var(--text-primary)]">
        {title}
      </h2>
      {subtitle && <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">{subtitle}</p>}
    </Reveal>
  );
}

/* ============================================================================
   NAVBAR
   ============================================================================ */

function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-5 transition-all duration-300 ${
            scrolled ? 'glass-panel py-2.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.3)]' : 'py-1.5'
          }`}
        >
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2 shrink-0" aria-label="PitchCraft home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-blue-500">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-[var(--text-primary)]">
              PitchCraft
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link
            to={"/login"}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-2"
            >
              Login
            
            </Link>
            <a
              href="#get-started"
              className="btn-primary inline-flex items-center gap-1.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] text-sm font-semibold px-4 py-2 hover:opacity-90 transition-opacity"
            >
              Get Started
            </a>
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)]"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-primary)]"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden mt-2"
            >
              <div className="glass-panel rounded-2xl p-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="h-px bg-[var(--border)] my-2" />
                <a href="#login" className="px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)]">
                  Login
                </a>
                <a
                  href="#get-started"
                  className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] text-sm font-semibold px-4 py-2.5"
                >
                  Get Started
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

/* ============================================================================
   HERO — signature element: a "generation log" dashboard mock rendered in
   monospace, animating section-by-section the way the product actually works.
   ============================================================================ */

function HeroDashboardMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 4 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-md"
      style={{ perspective: 1200 }}
    >
      <div className="glass-card rounded-2xl p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
        {/* Panel header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Project</p>
            <p className="font-display text-sm font-semibold text-[var(--text-primary)] mt-0.5">Aurora Health</p>
          </div>
          <span className="font-mono text-[11px] px-2 py-1 rounded-md bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-secondary)]">
            4 / 6 sections
          </span>
        </div>

        {/* Progress ring + summary */}
        <div className="flex items-center gap-4 py-4">
          <svg width="56" height="56" viewBox="0 0 90 90" className="shrink-0 -rotate-90">
            <circle cx="45" cy="45" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
            <circle
              className="progress-ring"
              cx="45"
              cy="45"
              r="40"
              fill="none"
              stroke="url(#pcGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="251"
              strokeDashoffset="84"
            />
            <defs>
              <linearGradient id="pcGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">67% complete</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Business Model generating now</p>
          </div>
        </div>

        {/* Generation log */}
        <div className="font-mono text-[12px] space-y-2 py-3 border-t border-[var(--border)]">
          {GENERATION_LOG.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                {row.status === 'done' && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                {row.status === 'active' && <Loader2 className="h-3.5 w-3.5 text-[var(--accent-indigo)] animate-spin" />}
                {row.status === 'queued' && <Circle className="h-3 w-3 text-[var(--text-tertiary)]" />}
                {row.label}
              </span>
              <span
                className={
                  row.status === 'done'
                    ? 'text-emerald-400'
                    : row.status === 'active'
                    ? 'text-[var(--accent-indigo)] caret-blink'
                    : 'text-[var(--text-tertiary)]'
                }
              >
                {row.status === 'done' ? 'done' : row.status === 'active' ? 'generating' : 'queued'}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <History className="h-3.5 w-3.5" />
            v4 saved 2m ago
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)] px-2.5 py-1.5 rounded-lg border border-[var(--border)]">
            <FileDown className="h-3.5 w-3.5" />
            Export PDF
          </span>
        </div>
      </div>

      {/* Floating suggestion chip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="glass-card absolute -left-8 -bottom-6 hidden sm:flex items-center gap-2 rounded-xl px-3.5 py-2.5 shadow-[0_20px_50px_-15px_rgba(99,102,241,0.4)]"
      >
        <Lightbulb className="h-4 w-4 text-[var(--accent-violet)] shrink-0" />
        <p className="text-xs text-[var(--text-secondary)] max-w-[160px]">
          Add pricing detail to <span className="text-[var(--text-primary)] font-medium">Business Model</span>
        </p>
      </motion.div>
    </motion.div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative pt-40 pb-28 sm:pt-48 sm:pb-36 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-grid bg-radial-fade pointer-events-none" />
      <div
        className="glow-blob absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--glow), transparent 70%)' }}
      />
      <div
        className="glow-blob absolute top-10 right-0 h-[360px] w-[360px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)', animationDelay: '4s' }}
      />

      <div className="relative max-w-6xl mx-auto px-5">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
          {/* Left: copy */}
          <motion.div initial="hidden" animate="show" variants={staggerContainer(0.12)}>
            <motion.div variants={fadeUp}>
              <Eyebrow>Guided AI pitch workflow</Eyebrow>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display mt-6 text-[2.6rem] leading-[1.05] sm:text-6xl sm:leading-[1.05] font-semibold tracking-tight text-[var(--text-primary)]"
            >
              Build investor-ready pitches, <span className="gradient-text">one section at a time</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg text-[var(--text-secondary)] leading-relaxed max-w-lg"
            >
              PitchCraft turns a rough startup idea into a structured, professional pitch — generated,
              edited, and refined section by section, with a guided AI workflow instead of a single
              overwhelming response.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#get-started"
                className="btn-primary inline-flex items-center gap-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] font-semibold px-5 py-3 text-sm hover:opacity-90 transition-opacity"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#workflow"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] transition-colors"
              >
                <PlayCircle className="h-4 w-4" />
                Watch Demo
              </a>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-8 font-mono text-xs text-[var(--text-tertiary)]">
              No credit card required · Free plan available
            </motion.p>
          </motion.div>

          {/* Right: dashboard mock */}
          <div className="flex justify-center lg:justify-end">
            <HeroDashboardMock />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   TRUSTED BY
   ============================================================================ */

function TrustedBy() {
  const doubled = [...TRUSTED_BY, ...TRUSTED_BY];
  return (
    <section className="py-14 border-y border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-5">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-tertiary)] mb-8">
          Built for the people actually pitching ideas
        </p>
      </div>
      <div className="overflow-hidden">
        <div className="marquee-track flex items-center gap-16 w-max">
          {doubled.map((item, i) => (
            <div
              key={`${item.label}-${i}`}
              className="flex items-center gap-2.5 grayscale opacity-50 hover:opacity-80 transition-opacity shrink-0"
            >
              <item.icon className="h-5 w-5 text-[var(--text-secondary)]" />
              <span className="font-display text-base font-medium text-[var(--text-secondary)] whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   FEATURES GRID
   ============================================================================ */

function FeaturesGrid() {
  return (
    <section id="features" className="py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHeading
          eyebrow="Features"
          title="Everything a real pitch workflow needs"
          subtitle="Not a single-shot generator. A workspace built around generating, editing, and refining one section at a time."
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer(0.06)}
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 via-violet-500/15 to-blue-500/15 border border-[var(--border)]">
                <f.icon className="h-5 w-5 text-[var(--accent-violet)]" strokeWidth={1.75} />
              </div>
              <h3 className="font-display mt-4 text-base font-semibold text-[var(--text-primary)]">{f.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================================
   HOW IT WORKS — real sequential timeline, numbering is meaningful here
   ============================================================================ */

function HowItWorks() {
  return (
    <section id="workflow" className="py-28 sm:py-36 bg-[var(--bg-elevated)]">
      <div className="max-w-5xl mx-auto px-5">
        <SectionHeading
          eyebrow="Workflow"
          title="How it works"
          subtitle="Five steps, each one optional to redo. Nothing forces a full restart."
        />

        <div className="mt-20 relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[var(--border)] -translate-x-1/2" />
          <div className="space-y-10 md:space-y-0">
            {WORKFLOW_STEPS.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.05}>
                <div
                  className={`md:grid md:grid-cols-2 md:gap-10 items-center py-6 ${
                    i % 2 === 1 ? '' : ''
                  }`}
                >
                  <div className={`${i % 2 === 0 ? 'md:text-right md:pr-10' : 'md:order-2 md:pl-10'}`}>
                    <span className="font-mono text-xs text-[var(--accent-indigo)]">{s.step}</span>
                    <h3 className="font-display text-xl font-semibold text-[var(--text-primary)] mt-1">{s.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed max-w-sm md:ml-auto">
                      {s.desc}
                    </p>
                  </div>
                  <div className={`hidden md:flex ${i % 2 === 0 ? 'md:order-2 justify-start pl-10' : 'justify-end pr-10'}`}>
                    <span className="flex h-3 w-3 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 ring-4 ring-[var(--bg-elevated)]" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   WHY PITCHCRAFT — two column, reasons + mockup
   ============================================================================ */

function WhyPitchCraft() {
  return (
    <section id="why" className="py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <Eyebrow>Why PitchCraft</Eyebrow>
          <h2 className="font-display mt-6 text-3xl sm:text-4xl font-semibold leading-tight text-[var(--text-primary)]">
            Built for control, not automation for its own sake
          </h2>
          <div className="mt-10 space-y-6">
            {WHY_REASONS.map((r) => (
              <div key={r.title} className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-hover)] border border-[var(--border)]">
                  <r.icon className="h-4 w-4 text-[var(--accent-indigo)]" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[var(--text-primary)]">{r.title}</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <p className="font-display text-sm font-semibold text-[var(--text-primary)]">Business Model</p>
              <span className="font-mono text-[10px] px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                edited
              </span>
            </div>
            <div className="py-4 space-y-3">
              <div className="h-2.5 rounded-full bg-[var(--surface-hover)] w-full" />
              <div className="h-2.5 rounded-full bg-[var(--surface-hover)] w-11/12" />
              <div className="h-2.5 rounded-full bg-[var(--surface-hover)] w-4/5" />
              <div className="h-2.5 rounded-full bg-[var(--surface-hover)] w-full" />
              <div className="h-2.5 rounded-full bg-[var(--surface-hover)] w-3/4" />
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-[var(--border)]">
              <button className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)] rounded-lg px-3 py-1.5 hover:text-[var(--text-primary)]">
                <RefreshCw className="h-3.5 w-3.5" /> Regenerate
              </button>
              <button className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)] rounded-lg px-3 py-1.5 hover:text-[var(--text-primary)]">
                <Wand2 className="h-3.5 w-3.5" /> Make investor-friendly
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================================
   AI WORKFLOW SHOWCASE — horizontal flow, sequence is real here too
   ============================================================================ */

function WorkflowShowcase() {
  return (
    <section className="py-28 sm:py-36 bg-[var(--bg-elevated)] overflow-hidden">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHeading
          eyebrow="AI Workflow"
          title="From idea to pitch, in order"
          subtitle="Each node is generated using everything decided before it — so the output stays consistent end to end."
        />

        <div className="mt-16 flex flex-wrap lg:flex-nowrap items-center justify-center gap-3">
          {PITCH_SECTIONS_FLOW.map((node, i) => (
            <div key={node} className="flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`glass-card rounded-xl px-5 py-3.5 whitespace-nowrap ${
                  node === 'Pitch Ready' ? 'border-[var(--accent-indigo)]/40' : ''
                }`}
              >
                <span
                  className={`font-mono text-sm font-medium ${
                    node === 'Pitch Ready' ? 'gradient-text font-semibold' : 'text-[var(--text-primary)]'
                  }`}
                >
                  {node}
                </span>
              </motion.div>
              {i < PITCH_SECTIONS_FLOW.length - 1 && (
                <ArrowRight className="h-4 w-4 text-[var(--text-tertiary)] shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   DASHBOARD PREVIEW
   ============================================================================ */

function DashboardPreview() {
  const projects = [
    { name: 'Aurora Health', progress: 67, sections: '4/6' },
    { name: 'Fleet Sense', progress: 100, sections: '6/6' },
    { name: 'Nomad Ledger', progress: 33, sections: '2/6' },
  ];
  const activity = [
    { label: 'Business Model generated', time: '2m ago', icon: Wand2 },
    { label: 'Exported Fleet Sense to PDF', time: '1h ago', icon: FileDown },
    { label: 'Restored v2 of Target Audience', time: '3h ago', icon: History },
    { label: 'AI suggestion applied to Pricing', time: 'Yesterday', icon: Lightbulb },
  ];

  return (
    <section className="py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHeading
          eyebrow="Dashboard"
          title="Every startup idea, in one workspace"
          subtitle="Track progress, revisit versions, and pick up exactly where you left off."
        />

        <Reveal delay={0.1} className="mt-16">
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8">
              {/* Projects list */}
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-tertiary)] mb-4">
                  Projects
                </p>
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3.5 hover:border-[var(--border-strong)] transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{p.name}</p>
                        <p className="font-mono text-[11px] text-[var(--text-tertiary)] mt-0.5">{p.sections} sections</p>
                      </div>
                      <div className="flex items-center gap-3 w-32">
                        <div className="h-1.5 flex-1 rounded-full bg-[var(--surface-hover)] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-[var(--text-secondary)] w-8 text-right">
                          {p.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent activity */}
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-tertiary)] mb-4">
                  Recent Activity
                </p>
                <div className="space-y-4">
                  {activity.map((a) => (
                    <div key={a.label} className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-hover)] border border-[var(--border)]">
                        <a.icon className="h-3.5 w-3.5 text-[var(--accent-indigo)]" />
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-primary)] leading-snug">{a.label}</p>
                        <p className="font-mono text-[10px] text-[var(--text-tertiary)] mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================================
   TESTIMONIALS
   ============================================================================ */

function Testimonials() {
  return (
    <section className="py-28 sm:py-36 bg-[var(--bg-elevated)]">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHeading eyebrow="Testimonials" title="Founders and builders, before the funding round" />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer(0.08)}
          className="mt-16 grid md:grid-cols-3 gap-5"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div key={t.name} variants={fadeUp} className="glass-card rounded-2xl p-6 flex flex-col">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[var(--accent-violet)] text-[var(--accent-violet)]" />
                ))}
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">“{t.quote}”</p>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[var(--border)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-blue-500 text-white text-xs font-semibold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================================
   FAQ — animated accordion
   ============================================================================ */

function FAQItem({ item, isOpen, onClick }) {
  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-[var(--text-primary)]">{item.q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--text-secondary)] transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section id="faq" className="py-28 sm:py-36">
      <div className="max-w-3xl mx-auto px-5">
        <SectionHeading eyebrow="FAQ" title="Common questions" />
        <div className="mt-14">
          {FAQS.map((item, i) => (
            <FAQItem
              key={item.q}
              item={item}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   CTA BANNER
   ============================================================================ */

function CTABanner() {
  return (
    <section className="py-24 px-5">
      <Reveal className="max-w-5xl mx-auto">
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500">
          <div className="relative rounded-3xl bg-[var(--bg)] px-8 py-16 sm:py-20 text-center overflow-hidden">
            <div className="absolute inset-0 bg-grid bg-radial-fade opacity-60 pointer-events-none" />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-[var(--text-primary)] max-w-2xl mx-auto">
                Ready to build your next winning pitch?
              </h2>
              <p className="mt-4 text-[var(--text-secondary)] max-w-md mx-auto">
                Start with your idea. PitchCraft handles the structure.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#get-started"
                  className="btn-primary inline-flex items-center gap-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] font-semibold px-6 py-3.5 text-sm hover:opacity-90 transition-opacity"
                >
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-6 py-3.5 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ============================================================================
   FOOTER
   ============================================================================ */

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-14">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 via-violet-500 to-blue-500">
              <Sparkles className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </span>
            <span className="font-display text-base font-semibold text-[var(--text-primary)]">PitchCraft</span>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Footer">
            {FOOTER_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* <div className="flex items-center gap-3">
            <a
              href="#github"
              aria-label="GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="#linkedin"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div> */}
        </div>

        <div className="mt-10 pt-8 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--text-tertiary)]">© {new Date().getFullYear()} PitchCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================================
   BACK TO TOP + SCROLL INDICATOR
   ============================================================================ */

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full glass-panel text-[var(--text-primary)] shadow-lg hover:border-[var(--border-strong)] transition-colors"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500"
    />
  );
}

/* ============================================================================
   ROOT
   ============================================================================ */

export default function LandingPage() {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div
      className="pc-root min-h-screen bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300"
      data-theme={theme}
    >
      <ScrollProgress />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero />
        <TrustedBy />
        <FeaturesGrid />
        <HowItWorks />
        <WhyPitchCraft />
        <WorkflowShowcase />
        <DashboardPreview />
        <Testimonials />
        <FAQ />
        <CTABanner />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

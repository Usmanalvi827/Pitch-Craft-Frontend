import { useEffect, useState, useRef, useContext } from 'react';
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
  Check,
  Loader2,
  Circle,
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
  Target,
  Eye,
  FileText,
  Layers,
  ListChecks,
  LayoutTemplate,
  Presentation,
  CheckCircle2,
  FileEdit,
} from 'lucide-react';
import './LandingPage.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/context/auth.context';

/* ============================================================================
   STATIC CONTENT — kept as data so sections render via .map() instead of
   hardcoded repeated JSX.
   ============================================================================ */

const NAV_LINKS = [
  // { label: 'Features', href: '#features' },
  // { label: 'Workflow', href: '#workflow' },
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
    icon: Lightbulb,
    title: 'AI Suggestions',
    desc: 'PitchCraft flags what a real investor would ask about: missing numbers, a weak value proposition, thin market sizing.',
  },

  {
    icon: Save,
    title: 'Autosave',
    desc: 'Every edit is saved as you type. Close the tab, come back tomorrow — nothing is ever lost.',
  },

];

const PRODUCT_STEPS = [
  {
    step: '01',
    icon: Rocket,
    title: 'Create Your Startup',
    description: 'Start with your startup name, idea, industry, and target country.',
  },
  {
    step: '02',
    icon: LayoutDashboard,
    title: 'Build Your Startup',
    description:
      'Generate your overview, business model, audience, features, landing page, and pitch — one section at a time, not all at once.',
  },
  {
    step: '03',
    icon: Eye,
    title: 'View Your Results',
    description: 'Open each generated section and see your AI-generated startup content in one place.',
  },
  {
    step: '04',
    icon: Check,
    title: 'Complete Your Pitch',
    description: 'Finish all six sections and turn your startup idea into a complete, investor-ready pitch.',
  },
];

const PITCHCRAFT_MODULES = [
  { icon: FileText, label: 'Startup Overview' },
  { icon: Layers, label: 'Business Model' },
  { icon: Users, label: 'Target Audience' },
  { icon: ListChecks, label: 'Core Features' },
  { icon: LayoutTemplate, label: 'Landing Page' },
  { icon: Presentation, label: 'Investor Pitch' },
];

const WORKFLOW_STEPS = [
  { step: '01', title: 'Create Project', desc: 'Start a new workspace for a single startup idea.' },
  { step: '02', title: 'Describe Startup', desc: 'Give PitchCraft the raw idea in your own words.' },
  { step: '03', title: 'Generate Sections', desc: 'Generate Problem, Solution, Market, and more — one at a time.' },
];

const PITCH_SECTIONS_FLOW = ['Idea', 'Problem', 'Solution', 'Business Model', 'Financials', 'Pitch Ready'];

const FOOTER_LINKS = [
  // { label: 'Features', href: '#features' },
  // { label: 'Pricing', href: '#pricing' },
  // { label: 'Contact', href: '#contact' },
  // { label: 'Privacy', href: '#privacy' },
  // { label: 'Terms', href: '#terms' },
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
            <Link to={"/register"}
              href="#get-started"
              className="btn-primary inline-flex items-center gap-1.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] text-sm font-semibold px-4 py-2 hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
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
                <Link to={"/login"}  className="px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)]">
                  Login
                </Link>
                <Link to={"/register"}
                  href="#get-started"
                  className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] text-sm font-semibold px-4 py-2.5"
                >
                  Get Started
                </Link>
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
              <Link to={"/register"}
                href="#get-started"
                className="btn-primary inline-flex items-center gap-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] font-semibold px-5 py-3 text-sm hover:opacity-90 transition-opacity"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
             
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
          subtitle="Not a single-shot generator. A workspace built around generating, and refining one section at a time."
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
   HOW PITCHCRAFT WORKS — the real product flow: create, build section by
   section, view results, complete the pitch. Kept separate from the older
   HowItWorks/WorkflowShowcase sections below rather than replacing them.
   ============================================================================ */

function HowPitchCraftWorks() {
  const { user } = useContext(AuthContext);

  return (
    <section className="py-24 sm:py-32 bg-[var(--bg-elevated)]">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHeading
          eyebrow="How It Works"
          title="How PitchCraft Works"
          subtitle="Turn your startup idea into a complete pitch, one section at a time."
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer(0.08)}
          className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {PRODUCT_STEPS.map((item) => (
            <motion.div key={item.step} variants={fadeUp} className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 via-violet-500/15 to-blue-500/15 border border-[var(--border)]">
                  <item.icon className="h-5 w-5 text-[var(--accent-violet)]" strokeWidth={1.75} />
                </div>
                <span className="font-mono text-xs text-[var(--text-tertiary)]">{item.step}</span>
              </div>
              <h3 className="font-display mt-4 text-base font-semibold text-[var(--text-primary)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <Reveal delay={0.1} className="mt-8">
          <div className="glass-card rounded-2xl px-6 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {PITCHCRAFT_MODULES.map((module) => (
              <div key={module.label} className="flex items-center gap-2">
                <module.icon className="h-4 w-4 text-[var(--accent-indigo)]" strokeWidth={1.75} />
                <span className="text-sm font-medium text-[var(--text-secondary)]">{module.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex justify-center">
          <Link
            to={user ? '/dashboard' : '/register'}
            className="btn-primary inline-flex items-center gap-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] font-semibold px-5 py-3 text-sm hover:opacity-90 transition-opacity"
          >
            Start Building Your Pitch
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================================
   HOW IT WORKS — real sequential timeline, numbering is meaningful here
   ============================================================================ */

function HowItWorks() {
  return (
    <section id="workflow" className="py-28 sm:py-36">
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
   DASHBOARD PREVIEW — one compact panel that actually matches the real
   dashboard (greeting, stats, one project card), not an invented mockup.
   ============================================================================ */

function DashboardPreview() {
  const stats = [
    { label: 'Total Projects', value: 4, icon: Layers },
    { label: 'Completed', value: 1, icon: CheckCircle2 },
    { label: 'In Progress', value: 2, icon: Loader2 },
    { label: 'Drafts', value: 1, icon: FileEdit },
  ];

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHeading
          eyebrow="Dashboard"
          title="Your projects, at a glance"
          subtitle="Every startup you build lives in one dashboard — progress, status, and next steps included."
        />

        <Reveal delay={0.1} className="mt-14 max-w-xl mx-auto">
          <div className="glass-card rounded-2xl p-6 sm:p-7">
            <p className="font-display text-sm font-semibold text-[var(--text-primary)]">
              Welcome back, John 👋
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              Turn your ideas into successful startups.
            </p>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-[var(--border)] p-3">
                  <stat.icon className="h-3.5 w-3.5 text-[var(--accent-indigo)]" />
                  <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{stat.value}</p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-[var(--border)] p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-sm font-semibold text-[var(--text-primary)]">HealthMate AI</p>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  In Progress
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface-hover)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500"
                  style={{ width: '67%' }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-[var(--text-tertiary)]">Last updated Today</span>
                <span className="font-medium text-[var(--accent-indigo)]">Open Workspace →</span>
              </div>
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
                <Link to={"/register"}
                  href="#get-started"
                  className="btn-primary inline-flex items-center gap-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] font-semibold px-6 py-3.5 text-sm hover:opacity-90 transition-opacity"
                >
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
             
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
        <HowPitchCraftWorks />
        <HowItWorks />
        <DashboardPreview />
        <WorkflowShowcase />
        <CTABanner />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ScanText,
  FileText,
  Brain,
  ShieldCheck,
  Github,
  ExternalLink,
  Server,
  Layers,
  Zap,
  Code2,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Badge from '../components/ui/Badge'
import { pageTransition, staggerContainer, fadeUp, slideInLeft, slideInRight } from '../animations/variants'

const techStack = [
  {
    category: 'Frontend',
    icon: Layers,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    items: ['React 19', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'React Router v6'],
  },
  {
    category: 'Backend',
    icon: Server,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    items: ['Python Flask', 'Tesseract OCR', 'pdfplumber', 'Pillow', 'NLTK', 'REST API'],
  },
  {
    category: 'Analysis',
    icon: Brain,
    color: 'text-accent-violet',
    bg: 'bg-accent-violet/10',
    border: 'border-accent-violet/20',
    items: ['Engagement Scoring', 'Readability Index', 'Sentiment Analysis', 'Hook Strength', 'CTA Detection', 'Hashtag Analysis'],
  },
]

const archSteps = [
  { label: 'User uploads file', icon: '📤', color: 'bg-blue-500/20 border-blue-500/30' },
  { label: 'Flask API receives', icon: '🌐', color: 'bg-emerald-500/20 border-emerald-500/30' },
  { label: 'OCR / PDF parse', icon: '🔍', color: 'bg-amber-500/20 border-amber-500/30' },
  { label: 'AI analysis runs', icon: '🧠', color: 'bg-violet-500/20 border-violet-500/30' },
  { label: 'JSON report returned', icon: '📊', color: 'bg-indigo-500/20 border-indigo-500/30' },
  { label: 'React renders UI', icon: '✨', color: 'bg-pink-500/20 border-pink-500/30' },
]

function AboutPage() {
  useEffect(() => {
    document.title = 'About — SocialLens'
  }, [])

  return (
    <motion.div
      key="about"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-background flex flex-col"
    >
      <Navbar />

      <main className="flex-1 space-y-0 w-full">
        {/* ─── Hero ─────────────────────────────────────────────────── */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 grid-overlay opacity-30" aria-hidden="true" />
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #6366F1, transparent)' }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="indigo" size="md" dot className="mb-6">
                About SocialLens
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-primary"
            >
              Built for{' '}
              <span className="gradient-text">social media</span>{' '}
              professionals
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-secondary text-xl leading-relaxed max-w-2xl mx-auto"
            >
              SocialLens is an AI-powered content analyzer that helps creators,
              marketers, and brands understand what makes social media posts
              perform — and how to improve them.
            </motion.p>
          </div>
        </section>

        {/* ─── Technology Stack ───────────────────────────────────────── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/30" aria-labelledby="tech-heading">
          <div className="max-w-6xl mx-auto space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-3"
            >
              <h2 id="tech-heading" className="text-3xl font-bold text-primary">
                Technology Stack
              </h2>
              <p className="text-secondary">
                Built with modern, battle-tested technologies
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {techStack.map((tech) => {
                const { category, icon: Icon, color, bg, border, items } = tech
                return (
                  <motion.div
                    key={category}
                    variants={fadeUp}
                    className={`bg-surface border ${border} rounded-2xl p-6 space-y-5`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                        <Icon size={18} className={color} />
                      </div>
                      <h3 className="font-bold text-primary">{category}</h3>
                    </div>
                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm text-secondary"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${color.replace('text-', 'bg-')}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ─── Architecture ───────────────────────────────────────────── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" aria-labelledby="arch-heading">
          <div className="max-w-5xl mx-auto space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-3"
            >
              <h2 id="arch-heading" className="text-3xl font-bold text-primary">
                How It Works Inside
              </h2>
              <p className="text-secondary">
                A simple, clean architecture for fast and reliable analysis
              </p>
            </motion.div>

            {/* Architecture flow */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
            >
              {archSteps.map((step, i) => (
                <motion.div
                  key={step.label}
                  variants={fadeUp}
                  className="flex flex-col items-center text-center gap-2 group"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl border ${step.color} flex items-center justify-center text-2xl transition-transform duration-200 group-hover:-translate-y-1`}
                  >
                    {step.icon}
                  </div>
                  <p className="text-xs text-secondary leading-tight">{step.label}</p>
                  {i < archSteps.length - 1 && (
                    <div className="hidden lg:block absolute text-border text-lg" style={{ right: '-1rem', top: '1rem' }}>→</div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Flow diagram in text/box form */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-surface border border-border rounded-2xl p-6 font-mono text-xs space-y-2"
            >
              <div className="flex items-center gap-2 mb-4">
                <Code2 size={14} className="text-accent-indigo" />
                <span className="text-secondary">System Architecture</span>
              </div>
              {[
                '┌─────────────────────────────────────────────────────┐',
                '│  Browser (React 19)                                 │',
                '│  DropZone → FilePreview → UploadProgress            │',
                '│                    ↓  axios POST /api/upload        │',
                '├─────────────────────────────────────────────────────┤',
                '│  Flask API (Python)                                  │',
                '│  /upload → Tesseract OCR or pdfplumber              │',
                '│  /analyze → Engagement scorer, NLP analysis         │',
                '│              ↓  JSON response                        │',
                '├─────────────────────────────────────────────────────┤',
                '│  Browser: AnalysisReport → RadarChart + MetricCards │',
                '└─────────────────────────────────────────────────────┘',
              ].map((line, i) => (
                <div key={i} className="text-muted whitespace-pre">
                  {line}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── Privacy ────────────────────────────────────────────────── */}
        <section
          className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/30"
          aria-labelledby="privacy-heading"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface border border-success/20 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={30} className="text-success" />
              </div>
              <div className="space-y-3">
                <h2 id="privacy-heading" className="text-2xl font-bold text-primary">
                  Your files are never stored
                </h2>
                <p className="text-secondary leading-relaxed">
                  SocialLens processes your uploaded files entirely in memory. Once your
                  analysis is complete, the file is discarded. We never write your content
                  to disk or any database. Your data stays private — always.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['No database storage', 'In-memory processing', 'No third-party sharing', 'GDPR friendly'].map((item) => (
                    <Badge key={item} variant="success" size="sm" dot>
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Open Source ─────────────────────────────────────────────── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold text-primary">Open Source</h2>
              <p className="text-secondary max-w-xl mx-auto">
                SocialLens is an open-source project. The full source code for both
                the frontend and backend is available on GitHub.
              </p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-surface2 border border-border text-primary font-medium text-sm hover:border-border2 hover:bg-border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo"
              >
                <Github size={18} />
                View on GitHub
                <ExternalLink size={13} className="text-muted" />
              </a>
            </motion.div>

            {/* Tech badges */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-2 pt-4"
            >
              {['React 19', 'Python 3.11', 'Flask', 'Tesseract OCR', 'pdfplumber', 'Recharts', 'Framer Motion', 'Tailwind CSS'].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-surface2 border border-border text-xs text-secondary"
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </motion.div>
  )
}

export default AboutPage

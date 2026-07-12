import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Play, Zap, BarChart2, Shield } from 'lucide-react'
import Button from '../ui/Button'
import { fadeUp, staggerContainer } from '../../animations/variants'

const stats = [
  { value: '95%', label: 'Accuracy Rate', icon: Zap },
  { value: '< 5s', label: 'Real-time Results', icon: Shield },
]

// Floating gradient orb
function Orb({ className, style, animate: animateProps }) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      animate={animateProps}
      transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      style={style}
    />
  )
}

// Word-by-word reveal animation
function AnimatedHeadline() {
  const words1 = ['Analyze.', 'Improve.', 'Engage.']

  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
      {words1.map((word, i) => (
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.7,
            delay: i * 0.15 + 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="inline-block gradient-text"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* ─── Background effects ─────────────────────────────────────── */}
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-40" aria-hidden="true" />

      {/* Gradient orbs */}
      <Orb
        className="w-96 h-96 blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)',
          top: '10%',
          left: '15%',
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
      />
      <Orb
        className="w-80 h-80 blur-3xl opacity-15"
        style={{
          background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
          top: '25%',
          right: '10%',
        }}
        animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
      />
      <Orb
        className="w-64 h-64 blur-3xl opacity-10"
        style={{
          background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)',
          bottom: '20%',
          left: '30%',
        }}
        animate={{ x: [0, 20, 0], y: [0, 25, 0] }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`
        }}
      />

      {/* ─── Content ────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 text-accent-indigo text-sm font-medium"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-accent-indigo"
              aria-hidden="true"
            />
            AI-Powered Content Analysis
          </motion.div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
              <AnimatedHeadline />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-xl md:text-2xl font-light text-secondary mt-6 max-w-2xl mx-auto leading-relaxed"
            >
              Upload any social media post image or PDF and get instant
              AI analysis — engagement scores, readability metrics,
              and smart improvement suggestions.
            </motion.p>
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/analyzer">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <button className="inline-flex items-center gap-2.5 h-13 px-7 text-base font-semibold rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet text-white shadow-glow btn-glow transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo">
                  Start Analyzing
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            </Link>

            <Link to="/about">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <button className="inline-flex items-center gap-2.5 h-13 px-7 text-base font-medium rounded-xl bg-transparent text-secondary border border-border hover:border-border2 hover:text-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo">
                  <Play size={16} fill="currentColor" />
                  See How It Works
                </button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Social proof / stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6"
          >
            {stats.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + i * 0.1 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-accent-indigo" aria-hidden="true" />
                  <span className="text-2xl font-bold text-primary">{value}</span>
                </div>
                <span className="text-xs text-muted">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border-2 border-border flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-muted" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection

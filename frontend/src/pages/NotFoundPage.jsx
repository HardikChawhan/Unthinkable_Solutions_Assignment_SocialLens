import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { pageTransition } from '../animations/variants'

// Floating particles component
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 3,
    opacity: Math.random() * 0.4 + 0.1,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-accent-indigo"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function NotFoundPage() {
  useEffect(() => {
    document.title = '404 — Page Not Found · SocialLens'
  }, [])

  return (
    <motion.div
      key="notfound"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-background flex flex-col"
    >
      <Navbar />

      <main className="flex-1 relative flex items-center justify-center py-20 px-4 overflow-hidden w-full">
        {/* Background decoration */}
        <div className="absolute inset-0 grid-overlay opacity-20" aria-hidden="true" />
        <FloatingParticles />

        {/* Glow orbs */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(99,102,241,0.08)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(139,92,246,0.06)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 text-center space-y-8 max-w-lg mx-auto">
          {/* 404 Number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.175, 0.885, 0.32, 1.275],
            }}
          >
            <h1 className="text-[10rem] md:text-[14rem] font-black leading-none tabular-nums">
              <span className="gradient-text">404</span>
            </h1>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-3"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              Lost in the algorithm
            </h2>
            <p className="text-secondary text-base leading-relaxed">
              This page got lost in the algorithm and couldn't be found.
              Don't worry — let's get you back on track.
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <button className="inline-flex items-center gap-2 h-11 px-6 text-sm font-semibold rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet text-white shadow-glow btn-glow transition-all duration-200">
                  <Home size={16} />
                  Back to Home
                </button>
              </motion.div>
            </Link>

            <Link to="/analyzer">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <button className="inline-flex items-center gap-2 h-11 px-6 text-sm font-medium rounded-xl bg-transparent text-secondary border border-border hover:border-border2 hover:text-primary transition-all duration-200">
                  <ArrowLeft size={16} />
                  Go to Analyzer
                </button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Fun fact */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-xs text-muted"
          >
            📊 Fun fact: Even the best content has a 404 moment sometimes.
          </motion.p>
        </div>
      </main>

      <Footer />
    </motion.div>
  )
}

export default NotFoundPage

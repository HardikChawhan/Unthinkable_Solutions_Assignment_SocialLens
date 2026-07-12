import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/landing/HeroSection'
import FeatureCards from '../components/landing/FeatureCards'
import HowItWorks from '../components/landing/HowItWorks'
import { pageTransition } from '../animations/variants'

function LandingPage() {
  useEffect(() => {
    document.title = 'SocialLens — AI Social Media Content Analyzer'
  }, [])

  return (
    <motion.div
      key="landing"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-background flex flex-col"
    >
      <Navbar />
      <main className="flex-1 w-full">
        <HeroSection />

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <FeatureCards />

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <HowItWorks />

        {/* Bottom CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative bg-surface border border-border rounded-3xl p-10 md:p-16 text-center overflow-hidden"
            >
              {/* Background decoration */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)',
                }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 grid-overlay" aria-hidden="true" />

              {/* Content */}
              <div className="relative z-10 space-y-6">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-5xl"
                  aria-hidden="true"
                >
                  📊
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary">
                  Ready to improve your{' '}
                  <span className="gradient-text">content?</span>
                </h2>
                <p className="text-secondary text-lg max-w-xl mx-auto">
                  Join thousands of content creators using SocialLens to optimize
                  their social media posts for maximum engagement.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="/analyzer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet text-white font-semibold text-base shadow-glow hover:shadow-glow btn-glow transition-all duration-200"
                  >
                    Start Analyzing — Free
                  </a>
                  <a
                    href="/about"
                    className="text-sm text-secondary hover:text-primary transition-colors"
                  >
                    Learn more →
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </motion.div>
  )
}

export default LandingPage

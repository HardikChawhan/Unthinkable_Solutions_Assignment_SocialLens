import { motion } from 'framer-motion'
import { Upload, ScanText, BarChart2, ArrowRight } from 'lucide-react'
import { staggerContainer, fadeUp } from '../../animations/variants'

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your Content',
    description:
      'Drag and drop or browse to upload a JPEG, PNG screenshot of your social media post, or a PDF document.',
    gradient: 'from-blue-500 to-indigo-500',
    glow: 'rgba(99,102,241,0.3)',
  },
  {
    number: '02',
    icon: ScanText,
    title: 'Text Extraction',
    description:
      'Our AI-powered OCR engine extracts all text from your image using Tesseract. PDFs are parsed with pdfplumber.',
    gradient: 'from-violet-500 to-purple-500',
    glow: 'rgba(139,92,246,0.3)',
  },
  {
    number: '03',
    icon: BarChart2,
    title: 'Instant Analysis',
    description:
      'Get a comprehensive report with engagement scores, readability metrics, sentiment analysis, and AI improvement suggestions.',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.3)',
  },
]

function HowItWorks() {
  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-medium">
            Simple 3-step process
          </div>
          <h2
            id="how-it-works-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary"
          >
            How <span className="gradient-text">SocialLens</span> works
          </h2>
          <p className="text-secondary text-lg max-w-xl mx-auto">
            From upload to insights in seconds. No account required, no data stored.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          className="relative"
        >
          {/* Connecting lines (desktop only) */}
          <div className="hidden lg:block absolute top-8 left-1/2 -translate-x-1/2 w-2/3 h-px" aria-hidden="true">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 relative z-10">
            {steps.map((step, i) => {
              const { number, icon: Icon, title, description, gradient, glow } = step
              const isLast = i === steps.length - 1

              return (
                <motion.div
                  key={number}
                  variants={fadeUp}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Arrow between steps (desktop) */}
                  {!isLast && (
                    <div className="hidden lg:flex absolute top-[22px] -right-3 z-20 items-center justify-center text-muted" aria-hidden="true">
                      <ArrowRight size={20} className="text-border2" />
                    </div>
                  )}

                  {/* Icon circle */}
                  <motion.div
                    whileHover={{ scale: 1.1, y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-card-elevated`}
                    style={{
                      boxShadow: `0 8px 24px ${glow}`,
                    }}
                  >
                    {/* Pulse ring */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient}`}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                    />
                    <Icon size={26} className="text-white relative z-10" aria-hidden="true" />

                    {/* Step number badge */}
                    <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-surface2 border border-border flex items-center justify-center">
                      <span className="text-2xs font-bold text-muted">{number}</span>
                    </div>
                  </motion.div>

                  {/* Text */}
                  <div className="space-y-2 max-w-xs">
                    <h3 className="text-lg font-bold text-primary">{title}</h3>
                    <p className="text-sm text-secondary leading-relaxed">{description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <a
            href="/analyzer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet text-white font-semibold text-sm shadow-glow hover:shadow-glow transition-all duration-200"
          >
            Try It Now — It's Free
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks

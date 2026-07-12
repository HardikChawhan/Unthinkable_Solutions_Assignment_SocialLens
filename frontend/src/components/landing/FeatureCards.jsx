import { motion } from 'framer-motion'
import { ScanText, FileText, BarChart2, Lightbulb, ShieldCheck, Zap } from 'lucide-react'
import { staggerContainer, fadeUp } from '../../animations/variants'

const features = [
  {
    icon: ScanText,
    title: 'OCR Text Extraction',
    description:
      'Powered by Tesseract OCR, accurately extract text from any social media post image — screenshots, stories, or posts.',
    gradient: 'from-blue-500/10 to-blue-600/5',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
    border: 'hover:border-blue-500/30',
  },
  {
    icon: FileText,
    title: 'PDF Support',
    description:
      'Extract text from multi-page PDF documents using pdfplumber. Perfect for newsletters, ad copies, and long-form content.',
    gradient: 'from-rose-500/10 to-rose-600/5',
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-400/10',
    border: 'hover:border-rose-500/30',
  },
  {
    icon: BarChart2,
    title: 'Engagement Scoring',
    description:
      'Analyze 10+ metrics including engagement potential, readability, hook strength, CTA effectiveness, and hashtag optimization.',
    gradient: 'from-accent-indigo/10 to-accent-violet/5',
    iconColor: 'text-accent-indigo',
    iconBg: 'bg-accent-indigo/10',
    border: 'hover:border-accent-indigo/30',
  },
  {
    icon: Lightbulb,
    title: 'Smart Suggestions',
    description:
      'Get actionable, prioritized recommendations to improve your content. Each suggestion includes an example rewrite.',
    gradient: 'from-yellow-500/10 to-yellow-600/5',
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-400/10',
    border: 'hover:border-yellow-500/30',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy First',
    description:
      'Your files are processed in memory and never stored on our servers. What you upload stays private — always.',
    gradient: 'from-emerald-500/10 to-emerald-600/5',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-400/10',
    border: 'hover:border-emerald-500/30',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Get comprehensive analysis results in under 5 seconds. Our optimized pipeline ensures you never wait long.',
    gradient: 'from-amber-500/10 to-amber-600/5',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-400/10',
    border: 'hover:border-amber-500/30',
  },
]

function FeatureCard({ feature, index }) {
  const { icon: Icon, title, description, gradient, iconColor, iconBg, border } = feature

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`relative bg-surface border border-border rounded-2xl p-6 overflow-hidden group transition-all duration-300 ${border} hover:shadow-card-hover`}
    >
      {/* Card gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative space-y-4">
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} transition-transform duration-200`}
        >
          <Icon size={20} className={iconColor} aria-hidden="true" />
        </motion.div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-primary group-hover:text-white transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-secondary leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Subtle corner accent */}
      <div
        className={`absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${iconBg} blur-xl`}
        aria-hidden="true"
      />
    </motion.div>
  )
}

function FeatureCards() {
  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-labelledby="features-heading"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-xs font-medium">
          Everything you need
        </div>
        <h2
          id="features-heading"
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary"
        >
          Powerful features for{' '}
          <span className="gradient-text">content creators</span>
        </h2>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          From OCR extraction to AI-powered analysis, SocialLens gives you everything
          you need to optimize your social media content.
        </p>
      </motion.div>

      {/* Cards grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </motion.div>
    </section>
  )
}

export default FeatureCards

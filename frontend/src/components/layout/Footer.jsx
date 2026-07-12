import { NavLink } from 'react-router-dom'
import { BarChart2, Github, Twitter, ExternalLink, Heart } from 'lucide-react'

const footerLinks = {
  product: [
    { label: 'Home', to: '/' },
    { label: 'Analyzer', to: '/analyzer' },
    { label: 'About', to: '/about' },
  ],
  technology: [
    { label: 'OCR Engine', href: 'https://tesseract.projectnaptha.com/', external: true },
    { label: 'PDF Parsing', href: 'https://pdfplumber.readthedocs.io/', external: true },
    { label: 'Flask API', href: 'https://flask.palletsprojects.com/', external: true },
    { label: 'React 19', href: 'https://react.dev', external: true },
  ],
  legal: [
    { label: 'Privacy Policy', to: '/' },
    { label: 'Terms of Use', to: '/' },
    { label: 'No Data Stored', to: '/about' },
  ],
}

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="border-t border-border bg-surface/50"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center">
                <BarChart2 size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">SocialLens</span>
            </div>
            <p className="text-secondary text-sm leading-relaxed max-w-xs">
              AI-powered social media content analyzer. Upload any image or PDF
              and get instant engagement insights and improvement suggestions.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface2 border border-border text-secondary hover:text-primary hover:border-border2 transition-colors"
              >
                <Github size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface2 border border-border text-secondary hover:text-primary hover:border-border2 transition-colors"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-widest">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology links */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-widest">
              Technology
            </h3>
            <ul className="space-y-3">
              {footerLinks.technology.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-secondary hover:text-primary transition-colors inline-flex items-center gap-1.5"
                  >
                    {link.label}
                    <ExternalLink size={10} className="opacity-50" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-widest">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            © {currentYear} SocialLens. All rights reserved.
          </p>
          <p className="text-xs text-muted flex items-center gap-1.5">
            Built with{' '}
            <Heart size={10} className="text-error fill-error" aria-hidden="true" />{' '}
            using React 19 &amp; Flask
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart2, Menu, X, Zap, Home, Info } from 'lucide-react'
import clsx from 'clsx'

const navLinks = [
  { to: '/', label: 'Home', icon: Home, shortcut: 'G H' },
  { to: '/analyzer', label: 'Analyzer', icon: Zap, shortcut: 'G A' },
  { to: '/about', label: 'About', icon: Info, shortcut: 'G B' },
]

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const menuRef = useRef(null)

  // Track scroll for navbar blur effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileOpen(false)
      }
    }
    if (mobileOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [mobileOpen])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'glass border-b border-border/60 shadow-card'
          : 'bg-transparent border-b border-transparent'
      )}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        role="navigation"
        aria-label="Main navigation"
        ref={menuRef}
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo rounded-lg"
            aria-label="SocialLens — Go to homepage"
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center shadow-glow-sm"
            >
              <BarChart2 size={16} className="text-white" />
            </motion.div>
            <span className="font-bold text-lg tracking-tight gradient-text">
              SocialLens
            </span>
          </NavLink>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1" role="menubar">
            {navLinks.map((link) => (
              <DesktopNavLink key={link.to} {...link} />
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <NavLink
              to="/analyzer"
              className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet text-white shadow-glow-sm hover:shadow-glow transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo"
            >
              <Zap size={14} />
              Analyze Now
            </NavLink>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-lg text-secondary hover:text-primary hover:bg-surface2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="md:hidden overflow-hidden border-t border-border/50 bg-surface/95 backdrop-blur-md"
            >
              <div className="py-4 px-2 space-y-1">
                {navLinks.map((link) => (
                  <MobileNavLink key={link.to} {...link} />
                ))}
                <div className="pt-3 px-2">
                  <NavLink
                    to="/analyzer"
                    className="flex items-center justify-center gap-2 h-10 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet text-white text-sm font-medium"
                  >
                    <Zap size={14} />
                    Analyze Now
                  </NavLink>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

function DesktopNavLink({ to, label, shortcut, icon: Icon }) {
  const location = useLocation()
  const isActive =
    to === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(to)
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <NavLink
      to={to}
      role="menuitem"
      aria-current={isActive ? 'page' : undefined}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={clsx(
        'relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo',
        isActive
          ? 'text-primary bg-accent-glow'
          : 'text-secondary hover:text-primary hover:bg-white/5'
      )}
    >
      <Icon size={15} aria-hidden="true" />
      {label}

      {/* Active indicator */}
      {isActive && (
        <motion.span
          layoutId="navbar-active-indicator"
          className="absolute inset-0 rounded-lg bg-accent-glow border border-accent-indigo/20"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}

      {/* Tooltip with shortcut */}
      <AnimatePresence>
        {showTooltip && shortcut && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap"
          >
            <div className="bg-surface2 border border-border rounded-lg px-2.5 py-1.5 text-xs text-secondary shadow-card-elevated">
              <span className="font-mono text-accent-indigo">{shortcut}</span>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-surface2" />
          </motion.div>
        )}
      </AnimatePresence>
    </NavLink>
  )
}

function MobileNavLink({ to, label, icon: Icon }) {
  const location = useLocation()
  const isActive =
    to === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(to)

  return (
    <NavLink
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors',
        isActive
          ? 'text-primary bg-accent-glow border border-accent-indigo/20'
          : 'text-secondary hover:text-primary hover:bg-white/5'
      )}
    >
      <Icon size={18} aria-hidden="true" />
      {label}
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-indigo" aria-hidden="true" />
      )}
    </NavLink>
  )
}

export default Navbar

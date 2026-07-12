// Framer Motion animation variants

export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const fadeIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerFast = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
}

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const slideInLeft = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const slideInRight = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const slideDown = {
  hidden: {
    opacity: 0,
    y: -10,
    height: 0,
  },
  visible: {
    opacity: 1,
    y: 0,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    height: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
}

export const cardHover = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  hover: {
    y: -4,
    scale: 1.01,
    boxShadow: '0 8px 25px rgba(0,0,0,0.4), 0 0 20px rgba(99,102,241,0.1)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

export const dropzoneHover = {
  rest: {
    scale: 1,
    borderColor: '#1E1E2E',
    boxShadow: 'none',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.01,
    borderColor: '#6366F1',
    boxShadow: '0 0 20px rgba(99,102,241,0.2), 0 0 40px rgba(99,102,241,0.05)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  drag: {
    scale: 1.02,
    borderColor: '#8B5CF6',
    boxShadow: '0 0 30px rgba(139,92,246,0.3), 0 0 60px rgba(99,102,241,0.1)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
}

export const pageTransition = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.25,
      ease: 'easeIn',
    },
  },
}

export const listItem = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

export const popIn = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 300,
    },
  },
}

export const shake = {
  animate: {
    x: [0, -10, 10, -8, 8, -4, 4, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
}

export const floatAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const pulseScale = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const counterAnimation = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

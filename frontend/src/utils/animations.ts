// Animation configurations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

export const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.4, 
      ease: [0.2, 0.6, 0.3, 1],
      staggerChildren: 0.1
    }
  },
  exit: { 
    y: -20, 
    opacity: 0,
    transition: { 
      duration: 0.3, 
      ease: [0.2, 0.6, 0.3, 1] 
    }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

export const itemAnimation = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.2, 0.6, 0.3, 1]
    }
  }
};

// Hover animations
export const hoverScale = {
  scale: 1.02,
  transition: { 
    type: 'spring',
    stiffness: 400,
    damping: 10
  }
};

export const tapScale = {
  scale: 0.98
};

// Button animations
export const buttonHover = {
  scale: 1.05,
  transition: { 
    type: 'spring',
    stiffness: 400,
    damping: 10
  }
};

export const buttonTap = {
  scale: 0.98
};

// Card animations
export const cardHover = {
  y: -5,
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 20
  }
};

// Notification animations
export const notificationSlideIn = {
  initial: { x: '100%', opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  },
  exit: { 
    x: '100%', 
    opacity: 0,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  }
};

// Loading animations
export const loadingPulse = {
  initial: { opacity: 0.6 },
  animate: { 
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 1.5,
      ease: 'easeInOut'
    }
  }
};

// Shimmer effect for loading states
export const shimmerAnimation = {
  backgroundSize: '200% 100%',
  backgroundImage: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
  animation: 'shimmer 1.5s infinite linear',
  '@keyframes shimmer': {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' }
  }
};

// Responsive variants
export const responsiveVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  }
};

// Page transitions
export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

// Modal animations
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const modalContent = {
  initial: { y: 20, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: 'spring',
      damping: 30,
      stiffness: 400
    }
  },
  exit: { 
    y: 20, 
    opacity: 0,
    transition: { 
      type: 'spring',
      damping: 30,
      stiffness: 400
    }
  }
};

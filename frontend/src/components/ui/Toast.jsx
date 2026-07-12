import { Toaster as HotToaster, toast as hotToast } from 'react-hot-toast'
import { CheckCircle, XCircle, AlertCircle, Info, Loader2, X } from 'lucide-react'

// Custom Toaster component styled for dark mode
export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#16161E',
          color: '#F8FAFC',
          border: '1px solid #2A2A3E',
          borderRadius: '0.75rem',
          padding: '12px 16px',
          fontSize: '0.875rem',
          fontFamily: 'Inter, sans-serif',
          boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
          maxWidth: '380px',
        },
        success: {
          style: {
            background: '#16161E',
            border: '1px solid rgba(16,185,129,0.3)',
          },
          iconTheme: {
            primary: '#10B981',
            secondary: '#16161E',
          },
        },
        error: {
          style: {
            background: '#16161E',
            border: '1px solid rgba(239,68,68,0.3)',
          },
          iconTheme: {
            primary: '#EF4444',
            secondary: '#16161E',
          },
          duration: 5000,
        },
        loading: {
          style: {
            background: '#16161E',
            border: '1px solid rgba(99,102,241,0.3)',
          },
          iconTheme: {
            primary: '#6366F1',
            secondary: '#16161E',
          },
        },
      }}
    />
  )
}

// Toast helpers with consistent styling
export const toast = {
  success: (message, options = {}) =>
    hotToast.success(message, {
      icon: '✅',
      ...options,
    }),

  error: (message, options = {}) =>
    hotToast.error(message, {
      icon: '❌',
      ...options,
    }),

  loading: (message, options = {}) =>
    hotToast.loading(message, {
      icon: undefined,
      ...options,
    }),

  info: (message, options = {}) =>
    hotToast(message, {
      icon: 'ℹ️',
      style: {
        background: '#16161E',
        color: '#F8FAFC',
        border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: '0.75rem',
        padding: '12px 16px',
        fontSize: '0.875rem',
        fontFamily: 'Inter, sans-serif',
        boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
      },
      ...options,
    }),

  warning: (message, options = {}) =>
    hotToast(message, {
      icon: '⚠️',
      style: {
        background: '#16161E',
        color: '#F8FAFC',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: '0.75rem',
        padding: '12px 16px',
        fontSize: '0.875rem',
        fontFamily: 'Inter, sans-serif',
        boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
      },
      ...options,
    }),

  dismiss: hotToast.dismiss,
  promise: hotToast.promise,
}

export default toast

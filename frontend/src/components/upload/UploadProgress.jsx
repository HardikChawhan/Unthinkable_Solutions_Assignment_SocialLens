import { motion } from 'framer-motion'
import { Upload, ScanText, Brain, Check, Loader2 } from 'lucide-react'
import clsx from 'clsx'

const STEPS = [
  {
    id: 'upload',
    label: 'Uploading',
    sublabel: 'Sending to server',
    Icon: Upload,
  },
  {
    id: 'extract',
    label: 'Extracting',
    sublabel: 'Reading text via OCR',
    Icon: ScanText,
  },
  {
    id: 'analyze',
    label: 'Analyzing',
    sublabel: 'Computing metrics',
    Icon: Brain,
  },
]

const stepOrder = ['upload', 'extract', 'analyze']

function getStepStatus(stepId, currentStep) {
  const current = stepOrder.indexOf(currentStep)
  const index = stepOrder.indexOf(stepId)
  if (index < current) return 'complete'
  if (index === current) return 'active'
  return 'pending'
}

function StepIcon({ Icon, status, size = 20 }) {
  return (
    <div
      className={clsx(
        'relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
        status === 'complete'
          ? 'bg-success/20 border-2 border-success'
          : status === 'active'
          ? 'bg-accent-indigo/20 border-2 border-accent-indigo'
          : 'bg-surface2 border-2 border-border'
      )}
    >
      {status === 'active' && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-accent-indigo opacity-50"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      {status === 'complete' ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <Check size={16} className="text-success" />
        </motion.div>
      ) : status === 'active' ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 size={16} className="text-accent-indigo" />
        </motion.div>
      ) : (
        <Icon size={16} className="text-muted" />
      )}
    </div>
  )
}

function UploadProgress({ currentStep = 'upload', uploadProgress = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-surface border border-border rounded-xl p-6 space-y-6"
    >
      {/* Steps */}
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div
          className="absolute top-5 left-10 right-10 h-0.5 bg-border"
          aria-hidden="true"
        />
        {/* Progress line */}
        <motion.div
          className="absolute top-5 left-10 h-0.5 bg-gradient-to-r from-accent-indigo to-accent-violet"
          initial={{ width: '0%' }}
          animate={{
            width:
              currentStep === 'upload'
                ? '0%'
                : currentStep === 'extract'
                ? '50%'
                : currentStep === 'analyze'
                ? '100%'
                : '0%',
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ right: 'auto' }}
          aria-hidden="true"
        />

        {STEPS.map((step) => {
          const status = getStepStatus(step.id, currentStep)
          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center gap-2"
              aria-current={status === 'active' ? 'step' : undefined}
            >
              <StepIcon Icon={step.Icon} status={status} />
              <div className="text-center">
                <p
                  className={clsx(
                    'text-xs font-semibold',
                    status === 'complete'
                      ? 'text-success'
                      : status === 'active'
                      ? 'text-primary'
                      : 'text-muted'
                  )}
                >
                  {step.label}
                </p>
                <p className="text-2xs text-muted hidden sm:block">
                  {step.sublabel}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Upload progress bar (only shown during upload) */}
      {currentStep === 'upload' && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-secondary">Uploading file…</span>
            <span className="text-accent-indigo font-semibold tabular-nums">
              {uploadProgress}%
            </span>
          </div>
          <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-indigo to-accent-violet rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Status messages */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 5 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-sm"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 flex-shrink-0"
        >
          <Loader2 size={14} className="text-accent-indigo" />
        </motion.div>
        <span className="text-secondary">
          {currentStep === 'upload' && 'Uploading your file to the server…'}
          {currentStep === 'extract' && 'Extracting text using OCR / PDF parser…'}
          {currentStep === 'analyze' && 'Running AI analysis on extracted content…'}
        </span>
      </motion.div>
    </motion.div>
  )
}

export default UploadProgress

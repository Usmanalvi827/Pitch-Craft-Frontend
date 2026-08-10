import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import GeneratedContentView from './GeneratedContentView'

export default function ResultModal({ open, onClose, title, data }) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[560px] max-h-[80vh] flex flex-col rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111113] shadow-2xl"
          >
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-zinc-200 dark:border-white/10">
              <div>
                <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-white">
                  {title}
                </h2>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">AI Generated Result</p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6">
              <GeneratedContentView data={data} />
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-white/10">
              <p className="text-xs text-emerald-500">Generated successfully.</p>
              <button
                onClick={onClose}
                className="h-9 px-4 rounded-lg text-sm font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, ArrowRight, Loader2, Check } from 'lucide-react'

const statusStyles = {
  'Not Generated': 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20',
  Generated: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
}

export default function ModuleCard({ module, status, onGenerate, onViewResult }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const isGenerated = status === 'Generated'

  async function handleGenerateClick() {
    if (isGenerating) return
    setIsGenerating(true)
    try {
      await onGenerate()
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 shadow-sm transition-all hover:shadow-lg hover:border-zinc-300 dark:hover:border-white/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-indigo-500/15 via-violet-500/15 to-blue-500/15">
          <module.icon className="h-5 w-5 text-violet-500" />
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
        >
          {isGenerated && <Check className="h-3 w-3" />}
          {isGenerated ? 'Generated' : status}
        </span>
      </div>

      <h3 className="mt-4 font-display text-base font-semibold text-zinc-900 dark:text-white">
        {module.title}
      </h3>
      <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        {isGenerated ? `Your ${module.title.toLowerCase()} has been generated.` : module.description}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
          <Clock className="h-3.5 w-3.5" />
          {module.estimatedTime}
        </span>

        {isGenerated ? (
          <button
            onClick={onViewResult}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-500 transition-colors hover:text-indigo-400"
          >
            View Result
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-500 transition-colors hover:text-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isGenerating ? 'Generating...' : module.buttonLabel}
            {!isGenerating && <ArrowRight className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function WelcomeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex items-start gap-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-indigo-500/15 via-violet-500/15 to-blue-500/15">
        <Sparkles className="h-5 w-5 text-violet-500" />
      </div>
      <div>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          Every startup pitch is generated step by step. Complete each module below.
        </p>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          When all modules are complete, PitchCraft will generate your complete
          investor-ready startup pitch.
        </p>
      </div>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { startupModules } from '../data/startupModules'

export default function CompletionCard() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-blue-500/5 p-8 text-center"
    >
      <p className="text-3xl">🎉</p>
      <h2 className="mt-3 font-display text-xl font-semibold text-zinc-900 dark:text-white">
        Your Startup Pitch is Ready
      </h2>
      <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
        You've completed all 6 sections of your startup.
      </p>

      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {startupModules.map((module) => (
          <li
            key={module.id}
            className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-300"
          >
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            {module.title}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex items-center justify-center">
        <button
          onClick={() => navigate(`/startup/${id}/complete`)}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          View Complete Pitch
        </button>
      </div>
    </motion.div>
  )
}

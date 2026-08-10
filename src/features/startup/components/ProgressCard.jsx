import { motion } from 'framer-motion'

export default function ProgressCard({ completed, total }) {
  const percent = Math.round((completed / total) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-zinc-900 dark:text-white">
          Create
        </h2>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {completed} / {total} Modules Completed
        </span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </motion.div>
  )
}

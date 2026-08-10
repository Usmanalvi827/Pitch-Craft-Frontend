import { motion } from 'framer-motion'
import { useState } from 'react'

export default function WorkspaceHeader({ name, status, progress }) {
  const [loadingProjects, setLoadingProjects] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
    >
      {/* Left side: Avatar + Title */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <motion.img
          src="/avatar.png" // replace with your avatar path
          alt="Project Avatar"
          className="h-12 w-12 rounded-full border border-zinc-200 dark:border-white/10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        <div>
          {loadingProjects ? (
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white">
              {name}
            </h1>
          ) : (
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white">
              Loading...
            </h1>
          )}
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Welcome back 👋 Let's build your startup one module at a time.
          </p>
        </div>
      </div>

      {/* Right side: Status + Progress */}
      <div className="flex items-center gap-6">
        <div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Status</p>
          <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-white">
            {status}
          </p>
        </div>
        <div className="h-8 w-px bg-zinc-200 dark:bg-white/10" />
        <div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Progress</p>
          <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-white">
            {progress}%
          </p>
        </div>
      </div>
    </motion.div>
  )
}

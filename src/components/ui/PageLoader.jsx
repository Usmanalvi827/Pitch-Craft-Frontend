import { Sparkles } from 'lucide-react'
import './PageLoader.css'

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-white dark:bg-[#0a0a0b]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="loader-glow absolute inset-0 rounded-2xl bg-indigo-500/40 blur-xl" />
          <div className="loader-logo relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-blue-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="text-center">
          <p className="font-display text-lg font-semibold text-zinc-900 dark:text-white">
            PitchCraft
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Preparing your workspace...
          </p>
        </div>
      </div>

      <div className="loader-ring h-8 w-8 rounded-full" />
    </div>
  )
}

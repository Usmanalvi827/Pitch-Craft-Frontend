import { Lightbulb } from 'lucide-react'

export default function AiTipsCard() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
        <Lightbulb className="h-4 w-4 text-indigo-500" />
      </div>
      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <span className="font-medium text-zinc-900 dark:text-white">Tip: </span>
        Start with the Overview. Later modules use it as context, so a strong
        overview makes every other section sharper.
      </p>
    </div>
  )
}

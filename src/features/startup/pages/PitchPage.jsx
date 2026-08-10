import { useLocation, useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import GeneratedContentView from '../components/GeneratedContentView'

export default function PitchPage() {
  const { id } = useParams()
  const location = useLocation()
  const data = location.state?.data

  return (
    <div className="dark">
      <div className="min-h-screen bg-white dark:bg-[#0a0a0b]">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Link
            to={`/startup/${id}`}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Workspace
          </Link>

          <h1 className="mt-6 font-display text-2xl font-semibold text-zinc-900 dark:text-white">
            Investor Pitch
          </h1>

          <div className="mt-8">
            {data ? (
              <GeneratedContentView data={data} />
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-white/10 p-8 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Nothing to show here yet. Generate this section from the workspace to see it.
                </p>
                <Link
                  to={`/startup/${id}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
                >
                  Go to Workspace
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

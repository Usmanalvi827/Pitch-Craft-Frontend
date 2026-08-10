import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowLeft } from 'lucide-react'
import GeneratedContentView from '../components/GeneratedContentView'
import { startupModules } from '../data/startupModules'
import { getCompleteReportRes } from '../hooks/usedata'
import { getErrorMessage } from '../../../lib/getErrorMessage'

export default function CompletePitchPage() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReport() {
      setLoading(true)
      try {
        const data = await getCompleteReportRes(id)
        setReport(data?.data)
      } catch (error) {
        toast.error(getErrorMessage(error, 'Could not load the complete pitch.'), {
          className: 'pc-toast pc-toast--error',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [id])

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
            Complete Pitch
          </h1>

          {loading ? (
            <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
          ) : report ? (
            <div className="mt-8 space-y-10">
              {startupModules.map((module) => (
                <div key={module.id}>
                  <h2 className="font-display text-lg font-semibold text-zinc-900 dark:text-white pb-3 border-b border-zinc-200 dark:border-white/10">
                    {module.title}
                  </h2>
                  <div className="mt-4">
                    <GeneratedContentView data={report[module.dataKey]} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-zinc-200 dark:border-white/10 p-8 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Nothing to show here yet. Complete all 6 modules in the workspace first.
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
  )
}

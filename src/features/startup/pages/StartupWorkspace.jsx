import { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import WorkspaceHeader from '../components/WorkspaceHeader'
import WelcomeCard from '../components/WelcomeCard'
import ProgressCard from '../components/ProgressCard'
import AiTipsCard from '../components/AiTipsCard'
import ModuleCard from '../components/ModuleCard'
import ResultModal from '../components/ResultModal'
import CompletionCard from '../components/CompletionCard'
import { startupModules, hasContent } from '../data/startupModules'
import { getSingleUserRes, generateSectionRes } from '../hooks/usedata'
import { UserDataShowContext } from '../context/main.context'
import { getErrorMessage } from '../../../lib/getErrorMessage'
import { ArrowLeft } from 'lucide-react'

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const STATUS_LABELS = {
  draft: 'Draft',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

export default function StartupWorkspace() {
  const { singleUser, setSingleUser } = useContext(UserDataShowContext)
  const { id } = useParams()
  const [loadingProject, setLoadingProject] = useState(true)
  const [activeResultId, setActiveResultId] = useState(null)

  useEffect(() => {
    async function fetchProject() {
      setLoadingProject(true)
      try {
        if(!singleUser) {
        const data = await getSingleUserRes(id)
        
        setSingleUser(data)
        }
      } catch (error) {
        toast.error(getErrorMessage(error, 'Could not load this project.'), {
          className: 'pc-toast pc-toast--error',
        })
      } finally {
        setLoadingProject(false)
      }
    }

    fetchProject()
  }, [id])

  async function handleGenerate(module) {
    try {
      await generateSectionRes(id, module.apiPath)
      // refetch instead of merging the response in manually - the backend
      // is the source of truth for status, so this avoids recalculating
      // Draft/In Progress/Completed logic a second time on the frontend
      const data = await getSingleUserRes(id)
      setSingleUser(data)
      toast.success(`${module.title} generated.`, { className: 'pc-toast pc-toast--success' })
    } catch (error) {
      toast.error(getErrorMessage(error, `Could not generate ${module.title}.`), {
        className: 'pc-toast pc-toast--error',
      })
    }
  }

  const project = singleUser?.singlepROJ
  const completedCount = startupModules.filter((module) => hasContent(project?.[module.dataKey])).length
  const progress = Math.round((completedCount / startupModules.length) * 100)
  const statusLabel = STATUS_LABELS[project?.status] || 'Draft'

  const activeModule = startupModules.find((m) => m.id === activeResultId) || null

  if (loadingProject) {
    return (
      <div className="dark">
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0b]">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dark">
      <div className="min-h-screen bg-white dark:bg-[#0a0a0b]">
        <div className="max-w-[1200px] mx-auto px-6 py-12 space-y-8">

    <Link
            to={`/dashboard`}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>

          <WorkspaceHeader
            name={project?.title || 'Untitled Project'}
            status={statusLabel}
            progress={progress}
          />

          <WelcomeCard />

          <ProgressCard completed={completedCount} total={startupModules.length} />

          <AiTipsCard />

          <div>
            <h2 className="mb-6 font-display text-xl font-semibold text-zinc-900 dark:text-white">
              Generation Modules
            </h2>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
              className="grid gap-5 sm:grid-cols-2"
            >
              {startupModules.map((module) => (
                <motion.div key={module.id} variants={cardVariants}>
                  <ModuleCard
                    module={module}
                    status={hasContent(project?.[module.dataKey]) ? 'Generated' : 'Not Generated'}
                    onGenerate={() => handleGenerate(module)}
                    onViewResult={() => setActiveResultId(module.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {completedCount === startupModules.length && <CompletionCard />}
        </div>
      </div>

      <ResultModal
        open={!!activeModule}
        title={activeModule?.title}
        data={activeModule ? project?.[activeModule.dataKey] : null}
        onClose={() => setActiveResultId(null)}
      />
    </div>
  )
}

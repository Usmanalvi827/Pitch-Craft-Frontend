import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { X, ChevronDown, Loader2 } from 'lucide-react'
import './Dashboard.css'
import { createStartupRes } from '../startup/hooks/usedata'
import { getErrorMessage } from '../../lib/getErrorMessage'

const industries = [
  'HealthTech',
  'EdTech',
  'FinTech',
  'AI / SaaS',
  'E-commerce',
  'Food & Delivery',
  'Travel',
  'Real Estate',
  'Logistics',
  'Other',
]

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

const selectClasses =
  'w-full h-11 pl-4 pr-10 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-sm text-zinc-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 hover:border-zinc-300 dark:hover:border-white/20 transition dark:[color-scheme:dark]'

const optionClasses = 'bg-white text-zinc-900 dark:bg-[#111113] dark:text-white'

export default function CreateStartupModal({ open, onClose }) {
  const [title, setTitle] = useState('')
  const [idea, setIdea] = useState('')
  const [industry, setIndustry] = useState(industries[0])
  const [country, setCountry] = useState('')
  const [status, setStatus] = useState(statusOptions[0].value)
  const [isCreating, setIsCreating] = useState(false)
  const navigate = useNavigate()

  // close on ESC
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  async function handleSubmit(e) {
    e.preventDefault()
    if (isCreating) return

    if (!title.trim() || !idea.trim()) {
      toast.warning('Startup name and idea description are required.', {
        className: 'pc-toast pc-toast--warning',
      })
      return
    }

    setIsCreating(true)

    try {
      const data = await createStartupRes({
        title: title.trim(),
        idea: idea.trim(),
        industry,
        country: country.trim() || 'Not specified',
        status,
      })

      toast.success(data?.message || 'Startup created.', { className: 'pc-toast pc-toast--success' })
      onClose()
      navigate(`/startup/${data?.project?._id || data?._id}`)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not create this project.'), {
        className: 'pc-toast pc-toast--error',
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[560px] rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111113] shadow-2xl"
          >
            {/* header */}
            <div className="flex items-start justify-between px-6 pt-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-white">
                  Create Startup
                </h2>
                <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Start a new project and let AI help transform your idea into an
                  investor-ready startup pitch.
                </p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} className="px-6 pt-6 pb-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Startup Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isCreating}
                  placeholder="e.g. HealthMate AI"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 hover:border-zinc-300 dark:hover:border-white/20 transition disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Idea Description
                </label>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  disabled={isCreating}
                  placeholder="Describe your startup idea in a few sentences..."
                  rows={4}
                  className="modal-scroll w-full h-[110px] px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 hover:border-zinc-300 dark:hover:border-white/20 transition disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Industry
                  </label>
                  <div className="relative">
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      disabled={isCreating}
                      className={selectClasses}
                    >
                      {industries.map((option) => (
                        <option key={option} value={option} className={optionClasses}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={isCreating}
                      className={selectClasses}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value} className={optionClasses}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Target Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={isCreating}
                  placeholder="e.g. Pakistan, UAE, USA"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 hover:border-zinc-300 dark:hover:border-white/20 transition disabled:opacity-60"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isCreating}
                  className="h-11 px-5 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="relative h-11 px-5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isCreating ? 'Creating Project...' : 'Create Project'}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

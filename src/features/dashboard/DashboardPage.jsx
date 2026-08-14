import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Plus,
  ArrowRight,
  Layers,
  CheckCircle2,
  Loader2,
  FileEdit,
  Sparkles,
  RefreshCw,
  FileDown,
  Wand2,
  MessagesSquare,
  Users,
  Presentation,
  GitCompare,
  Rocket,
  LogOut,
  Trash2,
} from "lucide-react";
import "./Dashboard.css";
import CreateStartupModal from "./CreateStartupModal";
import { handleLogout } from "../auth/hook/useAuth";
import { AuthContext } from "../auth/context/auth.context";
import { getAllUsersRes, deleteUserStartUp } from "../startup/hooks/usedata";
import { UserDataShowContext } from "../startup/context/main.context";
import { getErrorMessage } from "../../lib/getErrorMessage";

const activity = [
  { text: "Created AI Resume Builder", time: "2 hours ago", icon: Sparkles },
  { text: "Updated Market Analysis", time: "Yesterday", icon: RefreshCw },
  { text: "Exported Pitch PDF", time: "3 days ago", icon: FileDown },
];

const upcomingFeatures = [
  { label: "AI Pitch Coach", icon: Wand2 },
  { label: "Investor Feedback", icon: MessagesSquare },
  { label: "Team Collaboration", icon: Users },
  { label: "Presentation Mode", icon: Presentation },
  { label: "Version Comparison", icon: GitCompare },
];

const statusStyles = {
  Completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "In Progress": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Draft: "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20",
};

const STATUS_LABELS = {
  draft: "Draft",
  "in-progress": "In Progress",
  completed: "Completed",
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function formatRelativeDate(dateString) {
  if (!dateString) return "";

  const diffDays = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "Last week";
  return new Date(dateString).toLocaleDateString();
}

export default function DashboardPage() {
  const [darkMode] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const { user, setUser } = useContext(AuthContext);
  const { allUserProjects, setAllUserProjects } =
    useContext(UserDataShowContext);
  const navigate = useNavigate();

  const firstName = user?.firstName;

  const userProjects = allUserProjects?.projects || [];
  // console.log(userProjects)

  const normalizedProjects = userProjects.map((project) => {
    const ideaText = project.idea || "";
    // Roughly 150 characters equal 4 lines on standard desktop layouts
    const truncatedDescription =
      ideaText.length > 150
        ? ideaText.slice(0, 150).trim() + "..............."
        : ideaText;

    return {
      id: project._id || project.id,
      name: project.title || "Untitled Startup",
      description: truncatedDescription,
      updated: formatRelativeDate(project.updatedAt) || "",
      progress: Math.round(((project.modulesCompleted || 0) / 6) * 100),
      status: STATUS_LABELS[project.status] || "Draft",
    };
  });

  const stats = [
    {
      label: "Total Projects",
      value: allUserProjects?.count ?? normalizedProjects.length,
      icon: Layers,
    },
    {
      label: "Completed",
      value: normalizedProjects.filter((p) => p.status === "Completed").length,
      icon: CheckCircle2,
    },
    {
      label: "In Progress",
      value: normalizedProjects.filter((p) => p.status === "In Progress")
        .length,
      icon: Loader2,
    },
    {
      label: "Drafts",
      value: normalizedProjects.filter((p) => p.status === "Draft").length,
      icon: FileEdit,
    },
  ];

  async function logoutClickHandler() {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await handleLogout();
    } catch (error) {
      // even if the backend call fails, we still clear the user locally
      // so they can't stay stuck on the dashboard with a dead session
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
      setLoggingOut(false);
      toast.success("Logged out successfully.", {
        className: "pc-toast pc-toast--success",
      });
      navigate("/login");
    }
  }

  async function handleDeleteProject(project) {
    const confirmed = window.confirm(
      `Delete "${project.name}"? This can't be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(project.id);
    try {
      await deleteUserStartUp(project.id);
      setAllUserProjects((prev) => ({
        ...prev,
        count: Math.max((prev?.count || 1) - 1, 0),
        projects: (prev?.projects || []).filter(
          (p) => (p._id || p.id) !== project.id,
        ),
      }));
      toast.success("Project deleted.", {
        className: "pc-toast pc-toast--success",
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete this project."), {
        className: "pc-toast pc-toast--error",
      });
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    async function fetchProjects() {
      setLoadingProjects(true);
      try {
        const data = await getAllUsersRes();
        // console.log(data)
        setAllUserProjects(data);
      } catch (error) {
        console.log(error.message);
        if (error?.response?.status === 404) {
          setAllUserProjects({ count: 0, projects: [] });
        } else {
          toast.error(getErrorMessage(error, "Could not load your projects."), {
            className: "pc-toast pc-toast--error",
          });
        }
      } finally {
        setLoadingProjects(false);
      }
    }

    fetchProjects();
  }, []);

  // console.log("After UseEffect ==>>", userProjects)

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-[#0a0a0b]">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          {/* header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="dashboard-grid rounded-3xl px-6 py-8 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
          >
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white">
                Welcome back, {firstName} 👋
              </h1>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                Turn your ideas into successful startups.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={logoutClickHandler}
                disabled={loggingOut}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <LogOut className="h-4 w-4" />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>

              <motion.button
                onClick={() => setOpenModal(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 shadow-lg shadow-indigo-500/20 w-fit"
              >
                <Plus className="h-4 w-4" />
                New Startup
              </motion.button>
            </div>
          </motion.div>

          {/* quick stats */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-indigo-500/10">
                  <stat.icon className="h-4 w-4 text-indigo-500" />
                </div>
                <p className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* projects */}
          <div className="mt-12">
            <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-white">
              Your Startup Projects
            </h2>

            {loadingProjects ? (
              <div className="mt-6 grid sm:grid-cols-2 gap-5">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 animate-pulse"
                  >
                    <div className="h-5 w-2/3 rounded bg-zinc-100 dark:bg-white/5" />
                    <div className="mt-3 h-3 w-full rounded bg-zinc-100 dark:bg-white/5" />
                    <div className="mt-2 h-3 w-4/5 rounded bg-zinc-100 dark:bg-white/5" />
                    <div className="mt-6 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-white/5" />
                  </div>
                ))}
              </div>
            ) : normalizedProjects.length > 0 ? (
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                className="mt-6 grid sm:grid-cols-2 gap-5"
              >
                {normalizedProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    variants={fadeUp}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 shadow-sm hover:shadow-xl hover:border-zinc-300 dark:hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-white">
                        {project.name}
                      </h3>
                      <span
                        className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[project.status]}`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mt-5">
                      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <button
                        onClick={() => handleDeleteProject(project)}
                        disabled={deletingId === project.id}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 dark:text-zinc-500 hover:text-red-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {deletingId === project.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        {deletingId === project.id ? "Deleting..." : "Delete"}
                      </button>

                      <button
                        onClick={() => navigate(`/startup/${project.id}`)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
                      >
                        Open Workspace
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-zinc-200 dark:border-white/10 py-20 px-6">
                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-indigo-500/10">
                  <Rocket className="h-6 w-6 text-indigo-500" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-zinc-900 dark:text-white">
                  No Startup Projects Yet
                </h3>
                <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
                  Every big startup starts as a rough idea. Create your first
                  project and let PitchCraft help you shape it into something
                  investor-ready.
                </p>
                <button
                  onClick={() => setOpenModal(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Startup
                </button>
              </div>
            )}
          </div>
        </div>

        <CreateStartupModal
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      </div>
    </div>
  );
}

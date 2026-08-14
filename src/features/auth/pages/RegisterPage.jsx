import { useContext, useState } from "react";
import {
  User,
  AtSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Sun,
  Moon,
  Wand2,
  LayoutDashboard,
  History,
  FileDown,
} from "lucide-react";
import "../css/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { handleRegister } from "../hook/useAuth";
import { AuthContext } from "../context/auth.context";
import { toast } from "react-toastify";

const features = [
  { icon: Wand2, label: "AI Pitch Generation" },
  { icon: LayoutDashboard, label: "Section-by-Section Editing" },
  { icon: History, label: "Version History" },
  { icon: FileDown, label: "Export to PDF" },
];

// just a rough visual estimate, not real validation
function getPasswordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}

const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
const strengthColors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
];

export default function RegisterPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const strength = getPasswordStrength(password);

  const { loadingBtn, setLoadingBtn } = useContext(AuthContext);
  const navigate = useNavigate();

  // component form submit
  async function submitBtnHandler(e) {
    e.preventDefault();

    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
    const userName = e.target.userName.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword = e.target.confirmPassword.value.trim();

    if (
      !firstName ||
      !lastName ||
      !userName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.warning("All fields are required.", {
        className: "pc-toast pc-toast--warning",
      });
      setLoadingBtn(false);
      return;
    }

    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters.", {
        className: "pc-toast pc-toast--warning",
      });
      setLoadingBtn(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match.", {
        className: "pc-toast pc-toast--warning",
      });
      setLoadingBtn(false);
      return;
    }

    setLoadingBtn(true);

    try {
      const data = await handleRegister({
        firstName,
        lastName,
        userName,
        email,
        password,
        confirmPassword,
      });

      toast.success(data?.message || "Registration successful.", {
        className: "pc-toast pc-toast--success",
      });
      navigate("/login");
    } catch (error) {
      const backendMessage = error?.response?.data?.message;

      if (backendMessage) {
        toast.error(backendMessage, { className: "pc-toast pc-toast--error" });
      } else if (error?.response?.status === 429) {
        // console.log("TOO MANY REQUESTS. PLEASE RETRY AFTER 15 MIN");
        toast.error("Too many requests. Please retry after 15 minutes.", {
          className: "pc-toast pc-toast--error",
        });
      } else {
        toast.error("Something went wrong. Please try again.", {
          className: "pc-toast pc-toast--error",
        });
      }
    } finally {
      setLoadingBtn(false);
    }
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-[#0a0a0b] grid lg:grid-cols-2">
        {/* left side - branding */}
        <div className="hidden lg:flex relative flex-col justify-center gap-16 overflow-hidden px-14 py-12 auth-grid">
          {" "}
          <div className="glow absolute -top-24 -left-16 h-96 w-96 rounded-full bg-indigo-500/20" />
          <div className="glow absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/20" />
          <Link to={"/"} className="relative flex items-center gap-2 w-fit">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-blue-500">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-lg font-semibold text-zinc-900 dark:text-white">
              PitchCraft
            </span>
          </Link>
          <div className="relative max-w-md">
            <h1 className="font-display text-4xl font-semibold leading-tight text-zinc-900 dark:text-white">
              Build investor-ready pitches with AI
            </h1>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A guided workspace that turns a rough startup idea into a
              structured, professional pitch — one section at a time.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {features.map((item) => (
                <div
                  key={item.label}
                  className="glass-card rounded-xl px-3.5 py-3 flex items-center gap-2.5"
                >
                  <item.icon className="h-4 w-4 text-violet-500 shrink-0" />
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right side - form */}
        <div className="relative flex items-center justify-center px-6 py-16">
          {/* <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-6 right-6 h-9 w-9 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button> */}

          <div className="w-full max-w-sm animate-slide-up">
            {/* <Link to={"/"} className="lg:hidden flex items-center gap-2 mb-8">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-blue-500">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <span className="font-display text-lg font-semibold text-zinc-900 dark:text-white">
                PitchCraft
              </span>
            </Link> */}

            <h2 className="font-display text-2xl font-semibold text-zinc-900 dark:text-white">
              Create your account
            </h2>

            <form className="mt-8 space-y-5" onSubmit={submitBtnHandler}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      name="firstName"
                      type="text"
                      placeholder="john"
                      className="w-full pl-11 pr-3 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      name="lastName"
                      type="text"
                      placeholder="last"
                      className="w-full pl-11 pr-3 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    name="userName"
                    type="text"
                    placeholder="john last"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    name="email"
                    type="email"
                    placeholder="you@startup.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${
                            i < strength
                              ? strengthColors[strength - 1]
                              : "bg-zinc-200 dark:bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {strengthLabels[strength - 1] || "Weak"} password
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingBtn}
                aria-busy={loadingBtn}
                className="relative w-full h-12 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="flex items-center justify-center gap-2">
                  {loadingBtn && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {loadingBtn ? "Creating Account..." : "Create Account"}
                </span>
              </button>
            </form>

            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-8">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="font-medium text-zinc-900 dark:text-white hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

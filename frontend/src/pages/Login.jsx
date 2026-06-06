import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileScan, Mail, Lock, ArrowRight } from "lucide-react";
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../useAuth.js'
import toast from "react-hot-toast";

export default function Login() {
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const isLogin = mode === "login";

    const { login, register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const trimmedEmail = email.trim()

        if (!trimmedEmail || !password.trim()) {
            toast.error('Please fill out all fields')
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            toast('Enter a valid email ID', { icon: '📧' });
            return
        }

        setLoading(true)
        const result = mode === 'login'
            ? await login(trimmedEmail, password)
            : await register(trimmedEmail, password)
        if (result.success) navigate('/upload')
        setLoading(false)
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-base-100 text-base-content flex items-center justify-center px-4">
            {/* Radial gradient blob */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-500/40 via-blue-500/30 to-transparent blur-3xl" />
            </div>
            <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] shadow-lg shadow-purple-500/30">
                            <FileScan className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-base-content tracking-tight">
                            ResumeRadar
                        </h1>
                    </div>
                    <p className="mt-3 text-sm text-base-content/60">
                        AI-powered resume analysis
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-base-content/10 bg-base-200 p-8 shadow-2xl">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-base-content">
                            {isLogin ? "Welcome back" : "Create an account"}
                        </h2>
                        <p className="mt-1 text-sm text-base-content/60">
                            {isLogin
                                ? "Sign in to continue analyzing"
                                : "Get started in seconds"}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={mode}
                            initial={{ opacity: 0, x: isLogin ? -10 : 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isLogin ? 10 : -10 }}
                            transition={{ duration: 0.25 }}
                            onSubmit={handleSubmit}
                            noValidate
                            className="space-y-4"
                        >
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-base-content/10 bg-base-100 py-3 pl-10 pr-3 text-sm text-base-content placeholder:text-base-content/40 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                />
                            </div>

                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-base-content/10 bg-base-100 py-3 pl-10 pr-3 text-sm text-base-content placeholder:text-base-content/40 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:shadow-purple-500/40 disabled:opacity-60"
                            >
                                {loading ? (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                ) : (
                                    <>
                                        <span>{isLogin ? "Sign in" : "Create account"}</span>
                                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                    </>
                                )}
                            </button>
                        </motion.form>
                    </AnimatePresence>

                    <div className="mt-6 text-center text-sm text-base-content/60">
                        {isLogin ? "New here?" : "Already have an account?"}{" "}
                        <button
                            onClick={() => setMode(isLogin ? "register" : "login")}
                            className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] hover:underline"
                        >
                            {isLogin ? "Create an account" : "Sign in"}
                        </button>
                    </div>
                </div>

            </motion.div>
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
                <div className="flex items-center gap-3">
                    <a
                        href="https://github.com/SidharthGops"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center h-9 w-9 rounded-xl border border-base-content/10 bg-base-200 text-base-content/60 hover:text-base-content hover:border-purple-500/40 transition"
                    >
                        <FaGithub size={18} />
                    </a>
                    <a
                        href="https://linkedin.com/in/sidharthgopan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center h-9 w-9 rounded-xl border border-base-content/10 bg-base-200 text-base-content/60 hover:text-base-content hover:border-purple-500/40 transition"
                    >
                        <FaLinkedin size={18} />
                    </a>
                </div>
                <p className="text-xs text-base-content/50 tracking-wide">
                    Powered by Groq × Llama 3.3
                </p>
            </div>
        </div>
    );
}

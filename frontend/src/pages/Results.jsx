import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import ScoreRing from '../components/ScoreRing.jsx'
import Navbar from '../components/Navbar.jsx'

function Tag({ children, variant, index }) {
    const styles =
        variant === "good"
            ? "from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-300"
            : "from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-300";
    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.7, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.06, type: "spring", stiffness: 260 }}
            className={`inline-flex items-center rounded-full border bg-gradient-to-r ${styles} px-3 py-1 text-xs font-medium`}
        >
            {children}
        </motion.span>
    );
}

export default function Results() {
    const navigate = useNavigate();
    const location = useLocation();

    // Real data will come from navigate('/results', { state: { result } })
    const result = location.state?.result;
    if (!result) {
        return <Navigate to="/upload" replace />;
    }
    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            <Navbar />

            <motion.main
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mx-auto max-w-6xl px-6 py-12"
            >
                {/* Score ring */}
                <div className="flex flex-col items-center mb-12">
                    <ScoreRing score={result.score} />
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-base-content/10 bg-base-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-base-content">Matched skills</h3>
                                <p className="text-xs text-base-content/60">{result.matchedSkills.length} keywords aligned with the role</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {result.matchedSkills.map((m, i) => (
                                <Tag key={m} variant="good" index={i}>{m}</Tag>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-base-content/10 bg-base-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/15">
                                <AlertTriangle className="h-5 w-5 text-orange-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-base-content">Gaps</h3>
                                <p className="text-xs text-base-content/60">{result.gaps.length} skills missing from your resume</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {result.gaps.map((g, i) => (
                                <Tag key={g} variant="bad" index={i}>{g}</Tag>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => navigate("/upload")}
                    className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:shadow-purple-500/40"
                >
                    <RefreshCw className="h-5 w-5" />
                    New Analysis
                </button>
            </motion.main>
        </div>
    );
}

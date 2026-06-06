import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Clock, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import toast from 'react-hot-toast'

export default function History() {
    const [analyses, setAnalyses] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/resumes/history', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = await res.json()
                setAnalyses(data)
            } catch {
                toast.error('Failed to load history')
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [token])

    const deleteOne = async (id) => {
        try {
            await fetch(`/api/resumes/delete/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
            setAnalyses(prev => prev.filter(a => a._id !== id))
            toast('Deleted', { icon: '🗑️' });
        } catch {
            toast.error('Failed to delete')
        }
    }

    const clearAll = async () => {
        try {
            await fetch('/api/resumes/deleteAll', {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
            setAnalyses([])
            toast.success('History cleared')
        } catch {
            toast.error('Failed to clear history')
        }
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400'
        if (score >= 60) return 'text-yellow-400'
        if (score >= 40) return 'text-orange-400'
        return 'text-red-400'
    }

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            <Navbar />

            <motion.main
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto max-w-4xl px-6 py-12"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Analysis History</h1>
                        <p className="text-base-content/60 mt-1 text-sm">Your past resume analyses</p>
                    </div>
                    {analyses.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition"
                        >
                            <Trash2 size={15} />
                            Clear all
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    </div>
                ) : analyses.length === 0 ? (
                    <div className="text-center py-20 text-base-content/50">
                        <Clock size={40} className="mx-auto mb-4 opacity-30" />
                        <p>No analyses yet</p>
                        <button
                            onClick={() => navigate('/upload')}
                            className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
                        >
                            Analyze your first resume →
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {analyses.map((a, i) => (
                            <motion.div
                                key={a._id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="flex items-center justify-between rounded-2xl border border-base-content/10 bg-base-200 px-6 py-5"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`text-3xl font-black tabular-nums ${getScoreColor(a.score)}`}>
                                        {a.score}
                                        <span className="text-sm font-normal opacity-60">%</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-base-content font-medium line-clamp-1">
                                            {a.jobDescription?.slice(0, 60)}...
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {new Date(a.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {a.matchedSkills?.slice(0, 4).map(s => (
                                                <span key={s} className="text-xs bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full px-2 py-0.5">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigate('/results', { state: { result: a } })}
                                        className="flex items-center gap-1 rounded-lg border border-base-content/10 px-3 py-1.5 text-xs text-base-content/70 hover:border-purple-500/40 hover:text-base-content transition"
                                    >
                                        View <ArrowRight size={12} />
                                    </button>
                                    <button
                                        onClick={() => deleteOne(a._id)}
                                        className="rounded-lg border border-base-content/10 p-1.5 text-base-content/50 hover:border-red-500/40 hover:text-red-400 transition"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.main>
        </div>
    )
}

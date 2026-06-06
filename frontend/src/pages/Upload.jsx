import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UploadCloud, FileText, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from '../components/Navbar.jsx'

export default function Upload() {
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [jd, setJd] = useState("");
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);

    const onPick = (f) => {
        if (!f) return;
        if (f.type !== "application/pdf") {
            toast.error("Please upload a PDF file");
            return;
        }
        setFile(f);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        onPick(e.dataTransfer.files?.[0]);
    };

    const analyze = async () => {
        if (!file) return toast.error("Upload a resume PDF first");
        if (!jd.trim()) return toast.error("Paste a job description");
        setLoading(true);

        const analysisPromise = (async () => {
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('jobDescription', jd);

            const token = localStorage.getItem('token');
            const res = await fetch('/api/resumes/analyze', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Analysis failed');
            }

            navigate('/results', { state: { result: data } });
            return data;
        })();

        try {
            await toast.promise(
                analysisPromise,
                {
                    loading: 'Analyzing...',
                    success: 'Analysis complete!',
                    error: (err) => err.message || 'Analysis failed. Try again.',
                },
                {
                    success: {
                        duration: 5000,
                    },
                }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            <Navbar />

            <motion.main
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mx-auto max-w-6xl px-6 py-12"
            >
                {/* Hero */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent">
                            Analyze your resume
                        </span>{" "}
                        <span className="text-base-content">in seconds</span>
                    </h1>
                    <p className="mt-3 text-base-content/60 max-w-xl mx-auto">
                        Upload your PDF and a job description — get matched skills, gaps, and a fit score instantly.
                    </p>
                </div>

                {/* Two-column */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Upload zone */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={onDrop}
                        onClick={() => inputRef.current?.click()}
                        className="relative cursor-pointer rounded-2xl p-[2px] bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6]"
                    >
                        <div
                            className={`rounded-2xl bg-base-200 border-2 border-dashed ${dragging ? "border-purple-400" : "border-base-content/10"
                                } p-10 h-full flex flex-col items-center justify-center text-center transition min-h-[280px]`}
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] mb-4">
                                <UploadCloud className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="font-semibold text-base-content">Drop your resume PDF here</h3>
                            <p className="mt-1 text-sm text-base-content/60">or click to browse files</p>
                            {file && (
                                <div className="mt-5 flex items-center gap-2 rounded-lg border border-base-content/10 bg-base-100 px-3 py-2 text-sm text-base-content">
                                    <FileText className="h-4 w-4 text-purple-400" />
                                    {file.name}
                                </div>
                            )}
                            <input
                                ref={inputRef}
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => onPick(e.target.files?.[0])}
                            />
                        </div>
                    </div>

                    {/* JD textarea */}
                    <div className="rounded-2xl border border-base-content/10 bg-base-200 p-6">
                        <label className="text-sm font-medium text-base-content">Job description</label>
                        <p className="text-xs text-base-content/60 mt-1">Paste the full posting for the best match analysis.</p>
                        <textarea
                            value={jd}
                            onChange={(e) => setJd(e.target.value)}
                            placeholder="We're hiring a Senior Frontend Engineer with experience in React, TypeScript..."
                            className="mt-4 w-full h-56 resize-none rounded-xl border border-base-content/10 bg-base-100 p-4 text-sm text-base-content placeholder:text-base-content/40 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                    </div>
                </div>

                {/* Analyze button */}
                <button
                    onClick={analyze}
                    disabled={loading}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:shadow-purple-500/40 disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-5 w-5" />
                            Analyze Resume
                        </>
                    )}
                </button>
            </motion.main>
        </div>
    );
}

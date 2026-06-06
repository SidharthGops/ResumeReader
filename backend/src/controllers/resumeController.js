import Analysis from "../models/Analysis.js";
import { parsePdf } from "../services/pdfParser.js";
import { analyzeWithAI } from "../services/aiOrchestrator.js";

export async function getHistory(req, res) {
    try {
        const finds = await Analysis.find({ email: req.user.email });
        res.json(finds);
    } catch (e) {
        res.json({ message: "Error fetching history...", error: e });
    }
}

export async function analyze(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume PDF is required" });
        }

        if (!req.body.jobDescription?.trim()) {
            return res.status(400).json({ message: "Job description is required" });
        }
        const buffer = req.file.buffer;
        const email = req.user.email;
        const { jobDescription } = req.body;

        const cleaned = await parsePdf(buffer);
        const analysis = await analyzeWithAI(cleaned, jobDescription);
        if (
            typeof analysis.score !== "number" ||
            !Array.isArray(analysis.matchedSkills) ||
            !Array.isArray(analysis.gaps)
        ) {
            return res.status(502).json({ message: "AI returned an invalid analysis format" });
        }
        const newAnalysis = new Analysis({
            email,
            resumeText: cleaned,
            jobDescription,
            score: analysis.score,
            matchedSkills: analysis.matchedSkills,
            gaps: analysis.gaps
        });

        await newAnalysis.save();

        res.json({
            score: newAnalysis.score,
            matchedSkills: newAnalysis.matchedSkills,
            gaps: newAnalysis.gaps
        });
    } catch (e) {
        console.error(e);
        res.json({ message: "Error doing analysis", error: e });
    }
}

export async function deleteHistory(req, res) {
    try {
        await Analysis.findOneAndDelete({ _id: req.params.id, email: req.user.email });
        res.json({ message: "History deleted successfully" })
    } catch (e) {
        res.json({ message: "Error fetching history...", error: e });
    }
}

export async function clearHistory(req, res) {
    try {
        await Analysis.deleteMany({ email: req.user.email });
        res.json({ message: "History cleared successfully" })
    } catch (e) {
        res.json({ message: "Error fetching history...", error: e });
    }
}
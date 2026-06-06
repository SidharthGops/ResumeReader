import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzeWithAI(resumeText, jobDescription) {
    const prompt = `You are a resume expert. Compare this resume to this job description.\nRESUME: ${resumeText}.\nJOB DESCRIPTION: ${jobDescription}.\nReturn ONLY valid JSON, no explanation, no markdown, no backticks:
{
"score": <0-100>,
"matchedSkills": ["skill1", "skill2",..],
"gaps": ["missing1", "missing2",..]
}`

    const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
    });

    const text = response.choices[0].message.content;
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();

    try {
        return JSON.parse(cleaned);
    } catch (e) {
        throw new Error("AI returned invalid JSON: " + text + e);
    }
}
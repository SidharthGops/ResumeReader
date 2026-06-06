import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

export async function parsePdf(buffer) {
    const data = await pdfParse(buffer);

    const cleanText = data.text.replace(/\n{3,}/g, "\n\n").trim();

    if (!cleanText) throw new Error("The server could not extract text from the uploaded PDF");

    return cleanText;
}
import express from "express";
import { getHistory, analyze, deleteHistory, clearHistory } from "../controllers/resumeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() });

router.get("/history", authMiddleware, getHistory);
router.post("/analyze", authMiddleware, upload.single("resume"), analyze);
router.delete("/delete/:id", authMiddleware, deleteHistory);
router.delete("/deleteAll", authMiddleware, clearHistory);

export default router;
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import express from "express";
import resumeRoutes from "./routes/resumeRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config({ quiet: true });
const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT

const app = express()
app.use(express.json());

try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    app.use("/api/auth", authRoutes)
    app.use("/api/resumes", resumeRoutes);

    app.listen(PORT, () => {
        console.log("Server listening on PORT 5001");
    });

} catch (error) {
    console.log("Error connecting to MongoDB", error);
}


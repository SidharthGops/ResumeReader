import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function register(req, res) {
    try {
        const { email, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.json({ message: "An account with this email ID already exists" });

        const passwordHash = await bcrypt.hash(password, 12);
        const newUser = new User({ email, passwordHash });
        await newUser.save();

        const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.json({ token, message: "User created" });
    } catch (e) {
        res.json({ message: "Error creating user", error: e });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.json({ message: "An account with this email ID doesn't exist" });

        const matches = await bcrypt.compare(password, user.passwordHash);
        if (!matches) return res.json({ message: "Invalid credentials" });

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token });
    } catch (e) {
        res.json({ message: "Error validating user", error: e });
    }
}
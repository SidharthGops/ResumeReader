import jwt from "jsonwebtoken"

export default function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const matches = jwt.verify(token, process.env.JWT_SECRET);
        req.user = matches;
        next();
    } catch (e) {
        res.status(401).json({ message: "Invalid or expired token", error: e });
    }
}
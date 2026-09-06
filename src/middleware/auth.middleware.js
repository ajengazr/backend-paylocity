import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
async function authMiddleware(req, res, next) {
    // Prioritas: cookie (set saat login via res.cookie), fallback ke header Authorization.
    let token = req.cookies?.accessToken;

    if (!token) {
        const authHeader = req.headers?.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.slice(7).trim();
        }
    }

    if (!token) {
        return res.status(401).json({
            message: "Belum Terverifikasi",
        });
    }
    
    try {
        const decoded = jwt.verify(
            token, 
            process.env.JWT_TOKEN
        );
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token Tidak Valid.",
        });
    }
}

export {authMiddleware};
import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_for_development");
        
        // Get user from database
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Auth error:", error);
        return res.status(401).json({ message: "Not authenticated" });
    }
};

export default isAuth;
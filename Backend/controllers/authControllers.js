import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Simple signup that accepts any user
export const signup = async (req, res) => {
    try {
        console.log("📝 SIGNUP REQUEST RECEIVED:", req.body);
        
        const { firstName, lastName, userName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            console.log("🔄 User exists, logging in:", email);
        } else {
            // Create new user if doesn't exist
            console.log("🆕 Creating new user:", email);
            const hashedPassword = await bcrypt.hash(password, 12);

            const user = new User({
                firstName: firstName || "User",
                lastName: lastName || "Name", 
                userName: userName || email.split('@')[0],
                email: email,
                password: hashedPassword
            });

            await user.save();
            console.log("✅ User created successfully:", user.email);
        }

        // Get the user (either existing or new)
        const user = await User.findOne({ email });
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || "fallback_secret_for_development",
            { expiresIn: "7d" }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Return user data
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            profileImage: user.profileImage,
            coverImage: user.coverImage,
            headline: user.headline,
            location: user.location
        };

        console.log("🎉 Signup successful for:", email);

        res.status(200).json({
            success: true,
            message: "Signup successful",
            user: userResponse
        });

    } catch (error) {
        console.error("❌ Signup error:", error);
        res.status(500).json({
            success: false,
            message: "Signup failed. Please try again."
        });
    }
};

// Login controller
export const login = async (req, res) => {
    try {
        console.log("🔐 LOGIN REQUEST RECEIVED:", req.body);
        
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("❌ Invalid password for:", email);
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || "fallback_secret_for_development",
            { expiresIn: "7d" }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Return user data
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            profileImage: user.profileImage,
            coverImage: user.coverImage,
            headline: user.headline,
            location: user.location
        };

        console.log("✅ Login successful for:", email);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: userResponse
        });

    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logout successful"
    });
};
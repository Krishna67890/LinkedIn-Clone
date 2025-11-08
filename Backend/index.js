import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 8000;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync('./uploads')) {
            fs.mkdirSync('./uploads');
        }
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Add request logging
app.use((req, res, next) => {
  console.log('=== REQUEST ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Headers:', req.headers);
  }
  console.log('================');
  next();
});

// TEMPORARY AUTH ROUTES
app.post("/api/auth/signup", (req, res) => {
    console.log("🎯 TEMP SIGNUP HIT:", req.body);
    
    res.cookie("token", "temp_token_" + Date.now(), {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({
        success: true,
        message: "Temporary signup successful!",
        user: {
            _id: "user_" + Date.now(),
            firstName: req.body.firstName || "Test",
            lastName: req.body.lastName || "User",
            email: req.body.email,
            userName: req.body.userName || "testuser",
            profileImage: "",
            coverImage: "",
            headline: "",
            location: "India"
        }
    });
});

app.post("/api/auth/login", (req, res) => {
    console.log("🎯 TEMP LOGIN HIT:", req.body);
    
    res.cookie("token", "temp_token_" + Date.now(), {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({
        success: true,
        message: "Temporary login successful!", 
        user: {
            _id: "user_123",
            firstName: "Test",
            lastName: "User",
            email: req.body.email,
            userName: "testuser",
            profileImage: "",
            coverImage: "",
            headline: "Software Developer",
            location: "India"
        }
    });
});

// UPDATE PROFILE ROUTE - FIXED VERSION
app.put("/api/user/updateprofile", upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
]), (req, res) => {
    try {
        console.log("🎯 UPDATE PROFILE HIT - BODY:", req.body);
        console.log("📁 FILES:", req.files);
        
        // Handle file URLs
        let profileImageUrl = userData?.profileImage || "";
        let coverImageUrl = userData?.coverImage || "";
        
        if (req.files?.profileImage) {
            profileImageUrl = `/uploads/${req.files.profileImage[0].filename}`;
            console.log("📸 Profile image saved:", profileImageUrl);
        }
        
        if (req.files?.coverImage) {
            coverImageUrl = `/uploads/${req.files.coverImage[0].filename}`;
            console.log("🖼️ Cover image saved:", coverImageUrl);
        }
        
        // Parse JSON strings from frontend
        let skills = [];
        let education = [];
        let experience = [];
        
        try {
            if (req.body.skills) {
                skills = typeof req.body.skills === 'string' ? JSON.parse(req.body.skills) : req.body.skills;
            }
            if (req.body.education) {
                education = typeof req.body.education === 'string' ? JSON.parse(req.body.education) : req.body.education;
            }
            if (req.body.experience) {
                experience = typeof req.body.experience === 'string' ? JSON.parse(req.body.experience) : req.body.experience;
            }
        } catch (error) {
            console.log("❌ Error parsing JSON data:", error);
        }
        
        const updatedUser = {
            _id: "user_123",
            firstName: req.body.firstName || "Test",
            lastName: req.body.lastName || "User", 
            userName: req.body.userName || "testuser",
            email: "test@example.com",
            headline: req.body.headline || "",
            location: req.body.location || "India",
            gender: req.body.gender || "other",
            skills: skills,
            education: education,
            experience: experience,
            profileImage: profileImageUrl,
            coverImage: coverImageUrl
        };
        
        console.log("✅ PROFILE UPDATED:", updatedUser);
        
        res.json({
            success: true,
            message: "Profile updated successfully!",
            user: updatedUser
        });
        
    } catch (error) {
        console.error("❌ ERROR IN UPDATE PROFILE:", error);
        res.status(500).json({
            success: false,
            message: "Error updating profile"
        });
    }
});

// Test routes
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!" });
});

app.get("/api/user/test", (req, res) => {
    res.json({ message: "User routes are working!" });
});

app.get("/api/user/currentuser", (req, res) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    
    res.json({
        _id: "user_123",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        userName: "testuser",
        profileImage: "",
        coverImage: "",
        headline: "Software Developer",
        location: "India",
        skills: [],
        education: [],
        experience: []
    });
});

// Test update profile route
app.get("/api/user/test-update", (req, res) => {
    res.json({ 
        success: true, 
        message: "Update profile route is working!",
        test: "You can now update profiles"
    });
});

app.listen(port, () => {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync('./uploads')) {
        fs.mkdirSync('./uploads');
        console.log('✅ Created uploads directory');
    }
    
    connectDb();
    console.log(`🚀 Server started on port ${port}`);
    console.log(`✅ Test backend at: http://localhost:${port}/api/test`);
    console.log(`✅ Update profile test: http://localhost:${port}/api/user/test-update`);
});
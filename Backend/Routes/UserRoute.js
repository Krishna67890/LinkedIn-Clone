import express from "express";
import { updateProfile, getCurrentUser } from "../controllers/UserController.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Get current user route
router.get("/currentuser", isAuth, getCurrentUser);

// Update profile route with file uploads
router.put(
    "/updateprofile",
    isAuth,
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    updateProfile
);

// TEST ROUTES - Add these for testing
router.get("/test", (req, res) => {
    res.json({ 
        success: true, 
        message: "User routes are working!",
        availableEndpoints: [
            "GET /api/user/currentuser",
            "PUT /api/user/updateprofile", 
            "GET /api/user/test"
        ]
    });
});

// Test route that doesn't require auth
router.get("/test-public", (req, res) => {
    res.json({ 
        success: true, 
        message: "Public user test route is working!",
        user: {
            _id: "test123",
            firstName: "Test",
            lastName: "User",
            email: "test@example.com"
        }
    });
});

// Test auth route
router.get("/test-auth", isAuth, (req, res) => {
    res.json({ 
        success: true, 
        message: "Auth test successful!",
        user: req.user
    });
});

export default router;
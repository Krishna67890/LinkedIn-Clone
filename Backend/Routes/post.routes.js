// routes/postRoutes.js
import express from "express";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
import { 
  createPost, 
  getPosts, 
  getUserPosts, 
  likePost, 
  savePost, 
  commentOnPost 
} from "../controllers/Post.Controller.js";

const postRouter = express.Router();

// Post creation route - handle both text and image
postRouter.post('/create', isAuth, upload.single('image'), createPost);

// Get all posts for feed
postRouter.get('/all', isAuth, getPosts);

// Get user's specific posts
postRouter.get('/user-posts', isAuth, getUserPosts);

// Like a post
postRouter.post('/:postId/like', isAuth, likePost);

// Save a post
postRouter.post('/:postId/save', isAuth, savePost);

// Comment on a post
postRouter.post('/:postId/comment', isAuth, commentOnPost);

// TEST ROUTES
postRouter.get("/test", (req, res) => {
    res.json({ 
        success: true, 
        message: "Post routes are working!",
        availableEndpoints: [
            "POST /api/post/create",
            "GET /api/post/all",
            "GET /api/post/user-posts",
            "POST /api/post/:postId/like",
            "POST /api/post/:postId/save",
            "POST /api/post/:postId/comment"
        ]
    });
});

export default postRouter;
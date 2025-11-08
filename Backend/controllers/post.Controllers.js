// controllers/Post.Controller.js
import Post from "../models/Post.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { description, audience = 'public' } = req.body;
    
    if (!description && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Post must have either text or image"
      });
    }

    const postData = {
      user: req.user._id,
      description: description || "",
      audience
    };

    // Add image if uploaded
    if (req.file) {
      postData.image = req.file.path;
    }

    const post = new Post(postData);
    await post.save();

    // Populate user data
    await post.populate('user', 'firstName lastName profileImage headline company location');

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post
    });

  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Error creating post",
      error: error.message
    });
  }
};

// Get all posts for feed
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('user', 'firstName lastName profileImage headline company location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      posts,
      currentPage: page,
      totalPosts: await Post.countDocuments()
    });

  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: error.message
    });
  }
};

// Get user's specific posts
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id })
      .populate('user', 'firstName lastName profileImage headline company location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      posts,
      totalPosts: posts.length
    });

  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user posts",
      error: error.message
    });
  }
};

// Like/Unlike a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    const likeIndex = post.likes.indexOf(req.user._id);
    
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();
    
    res.json({
      success: true,
      likes: post.likes.length,
      liked: likeIndex === -1 // true if now liked, false if now unliked
    });

  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({
      success: false,
      message: "Error liking post",
      error: error.message
    });
  }
};

// Save/Unsave a post
export const savePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    const saveIndex = post.savedBy.indexOf(req.user._id);
    
    if (saveIndex > -1) {
      // Unsave
      post.savedBy.splice(saveIndex, 1);
    } else {
      // Save
      post.savedBy.push(req.user._id);
    }

    await post.save();
    
    res.json({
      success: true,
      saved: saveIndex === -1 // true if now saved, false if now unsaved
    });

  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({
      success: false,
      message: "Error saving post",
      error: error.message
    });
  }
};

// Comment on a post
export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required"
      });
    }

    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    const comment = {
      user: req.user._id,
      text
    };

    post.comments.push(comment);
    await post.save();

    // Populate the last comment's user data
    await post.populate('comments.user', 'firstName lastName profileImage');

    const newComment = post.comments[post.comments.length - 1];

    res.json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
      totalComments: post.comments.length
    });

  } catch (error) {
    console.error("Error commenting on post:", error);
    res.status(500).json({
      success: false,
      message: "Error commenting on post",
      error: error.message
    });
  }
};
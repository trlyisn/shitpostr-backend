const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/Post");

// @route   POST /api/posts
// @desc    Create a post (protected)
// @access  Private
router.post("/", auth, async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ msg: "Post text is required" });
  }

  try {
    const newPost = new Post({
      text: text.trim(),
      user: req.user.id,
    });

    const post = await newPost.save();

    // Populate the user field (name and email only)
    await post.populate("user", ["name", "email"]).execPopulate?.();

    res.status(201).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/posts
// @desc    Get all posts (public)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", ["name", "email"]);

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

const Post = require("../../models/post/Post");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");

//create
const createPostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    if (!title || !description || !category || !req.file) {
      return next(appErr("All fields are required"));
    }
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);

    if (!userFound) {
      return next(appErr("User not found"));
    }

    // create post
    const postCreated = await Post.create({
      title,
      description,
      category,
      image: req.file.path,
      user: userFound._id,
    });

    // push the post created into the array of user's posts
    userFound.posts.push(postCreated._id);

    await userFound.save(); // Use await here to make sure the user is saved before responding

    res.json({
      status: "success",
      msg: "Post created",
      data: postCreated,
    });
  } catch (error) {
    next(appErr("Error creating post"));
  }
};

//all
const fetchPostsCtrl = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("comments");
    res.json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//details
const fetchPostCtrl = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id).populate("comments");
    res.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    res.json(error);
  }
};

//delete
const deletePostCtrl = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.session.userAuth) {
      return next(appErr("You are not allowed to delete this post", 403));
    }
    // delete
    await Post.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      user: "Post has been deleted successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//update
const updatePostCtrl = async (req, res) => {
  const { title, description, category } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.session.userAuth) {
      return next(appErr("You are not allowed to update this post", 403));
    }

    const postUpdate = await Post.findByIdAndUpdate(req.params.id, {
      title,
      description,
      category,
      image: req.file.path,
    });

    res.json({
      status: "success",
      user: "Post updated",
    });
  } catch (error) {
    res.json(error);
  }
};
module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
};

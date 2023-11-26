const Post = require("../../models/post/Post");
const User = require("../../models/user/User");
const Comment = require("../../models/comment/Comment");
const appErr = require("../../utils/appErr");

//create
const createCommentCtrl = async (req, res) => {
  const { message } = req.body;
  try {
    const post = await Post.findById(req.params.id);

    const comment = await Comment.create({
      user: req.session.userAuth,
      message,
    });
    post.comments.push(comment._id);

    const user = await User.findById(req.session.userAuth);

    user.comments.push(comment._id);

    await post.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });

    res.json({
      status: "success",
      user: "comment created",
      data: comment,
    });
  } catch (error) {
    res.json(error);
  }
};

//single
const commentDetailsCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Post comments",
    });
  } catch (error) {
    res.json(error);
  }
};

//delete
const deleteCommentCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "comment deleted",
    });
  } catch (error) {
    res.json(error);
  }
};

//Update
const updateCommentCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "comment updated",
    });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  createCommentCtrl,
  commentDetailsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
};

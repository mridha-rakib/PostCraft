const express = require("express");
const multer = require("multer");
const storage = require("../../config/cloudinary");
const {
  createPostCtrl,
  deletePostCtrl,
  fetchPostCtrl,
  fetchPostsCtrl,
  updatePostCtrl,
} = require("../../controllers/posts/posts");
const protected = require("../../middlewares/protected");

const postRoutes = express.Router();

// file upload
const upload = multer({
  storage,
});

// //POST/api/v1/posts
postRoutes.post("/", protected, upload.single("file"), createPostCtrl);

// //GET/api/v1/posts
postRoutes.get("/", fetchPostsCtrl);

// //GET/api/v1/posts/:id
postRoutes.get("/:id", fetchPostCtrl);

// //DELETE/api/v1/posts/:id
postRoutes.delete("/:id", deletePostCtrl);

// //PUT/api/v1/posts/:id
postRoutes.put("/:id", updatePostCtrl);

module.exports = postRoutes;

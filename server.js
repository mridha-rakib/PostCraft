require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/posts/posts");
const commentRoutes = require("./routes/comments/comment");

require("./config/dbConnect");

// app initialize
const app = express();

//middlewares
//------
//users route
app.use("/api/v1/users", userRoutes);

//posts route
app.use("/api/v1/posts", postRoutes);

//comments
app.use("/api/v1/comments", commentRoutes);

//Error handler middlewares

const PORT = process.env.SERVER_PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

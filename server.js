require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const methodOverride = require("method-override");
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/posts/posts");
const commentRoutes = require("./routes/comments/comment");
const globalErrHandler = require("./middlewares/globalErrorHandler");
const { truncatePost } = require("./utils/helpers");
const Post = require("./models/post/Post");
require("./config/dbConnect");

// app initialize
const app = express();
//configure ejs
app.set("view engine", "ejs");
//serve static files
app.use(express.static(__dirname + "/public"));

//helpers
app.locals.tuncatePost = truncatePost;
//middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//method override
app.use(methodOverride("_method"));

// session configuration
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60,
    }),
  })
);

//save the login user into locals
app.use((req, res, next) => {
  if (req.session.userAuth) {
    res.locals.userAuth = req.session.userAuth;
  } else {
    res.locals.userAuth = null;
  }
  next();
});

//render home
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user");
    res.render("index", { posts });
  } catch (error) {
    res.render("index", { error: error.message });
  }
});
//users route
app.use("/api/users", userRoutes);

// //posts route
app.use("/api/posts", postRoutes);

// //comments
app.use("/api/comments", commentRoutes);

//Error handler middlewares

app.use(globalErrHandler);

const PORT = process.env.SERVER_PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

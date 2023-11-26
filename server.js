require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/posts/posts");
const commentRoutes = require("./routes/comments/comment");
const globalErrHandler = require("./middlewares/globalErrorHandler");

require("./config/dbConnect");

// app initialize
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

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

//middlewares
//------
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

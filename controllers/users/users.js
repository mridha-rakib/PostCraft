const bcrypt = require("bcryptjs");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");

//register

const registerCtrl = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      // return next(appErr("All fields are required"));
      return res.render("users/register", {
        error: "All fields are required",
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // return next(appErr("User already exists"));
      return res.render("users/register", {
        error: "Exist is taken",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    // Return success response
    // res.json({
    //   status: "success",
    //   user,
    // });
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    // Handle errors
    res.json(error);
  }
};

//login
const loginCtrl = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      // return next(appErr("Email and password fields are required"));
      return res.render("users/login", {
        error: "Email and password fields are required",
      });
    }
    const userFound = await User.findOne({ email });

    if (!userFound) {
      // return next(appErr("Invalid Login credentials"));
      return res.render("users/login", {
        error: "Invalid login credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, userFound.password);

    if (!isPasswordValid) {
      // return res.json({
      //   status: "failed",
      //   data: "Invalid Login credentials",
      // });
      return res.render("users/login", {
        error: "Invalid login credentials",
      });
    }
    req.session.userAuth = userFound._id;

    // res.json({
    //   status: "success",
    //   data: userFound,
    // });
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    // Handle errors
    // res.status(500).json({ status: "error", data: error.message });
    res.json(error);
  }
};

//profile
const profileCtrl = async (req, res, next) => {
  try {
    const userId = req.session.userAuth;
    const user = await User.findById(userId)
      .populate("posts")
      .populate("comments");
    res.render("users/profile", { user });

    // res.json({
    //   status: "success",
    //   data: user,
    // });
  } catch (error) {
    res.json(error);
  }
};

//details
const userDetailsCtrl = async (req, res, next) => {
  try {
    const userId = req.params.id;
    //find the user
    const user = await User.findById(userId);

    if (!user) {
      return next(appErr("User not found"));
    }

    // res.json({
    //   status: "success",
    //   data: user,
    // });
    res.render("users/updateUser", {
      user,
      error: "",
    });
  } catch (error) {
    res.render("users/updateUser", {
      error: error.message,
    });
  }
};

//upload profile photo
const uploadProfilePhotoCtrl = async (req, res, next) => {
  try {
    //check if file exist
    if (!req.file) {
      return res.render("users/uploadProfilePhoto", {
        error: "Please upload image",
      });
    }
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    if (!userFound) {
      return res.render("users/uploadProfilePhoto", {
        error: "User not found",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        profileImage: req.file.path,
      },
      { new: true }
    );
    res.redirect("/api/v1/users/profile-page");
    // res.json({
    //   status: "success",
    //   user: "You have successfully updated your profile photo.",
    //   data: user,
    // });
  } catch (error) {
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};

//upload cover image

const uploadCoverImgCtrl = async (req, res, next) => {
  try {
    //check if file exist
    if (!req.file) {
      return res.render("users/uploadProfilePhoto", {
        error: "Please upload image",
      });
    }
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    if (!userFound) {
      return res.render("users/uploadProfilePhoto", {
        error: "User not found",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        coverImage: req.file.path,
      },
      { new: true }
    );

    res.redirect("/api/v1/users/profile-page");
    // res.json({
    //   status: "success",
    //   user: "You have successfully updated your cover photo.",
    //   data: user,
    // });
  } catch (error) {
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};

//update password
const updatePasswordCtrl = async (req, res) => {
  const { userPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        password: hashedPassword,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }
    res.redirect("/api/v1/users/profile-page");
    // res.json({
    //   status: "success",
    //   message: "Password has been changed successfully",
    //   user: updatedUser,
    // });
  } catch (error) {
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};

//update user
const updateUserCtrl = async (req, res, next) => {
  try {
    const { fullname, email } = req.body;
    if (!fullname || !email) {
      return res.render("users/updateUser", {
        error: "Please provide details",
        user: "",
      });
    }

    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.render("users/updateUser", {
          error: "Email is taken",
          user: "",
        });
      }
    }

    // update the user
    await User.findByIdAndUpdate(
      req.session.userAuth,
      {
        fullname,
        email,
      },
      {
        new: true,
      }
    );
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/updateUser", {
      error: error.message,
      user: "",
    });
  }
};

//logout
const logoutCtrl = async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/api/v1/users/login");
  });
};

module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
};

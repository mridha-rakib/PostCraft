const bcrypt = require("bcryptjs");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");

//register

const registerCtrl = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(appErr("User already exists"));
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
    res.json({
      status: "success",
      user,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
};

//login
const loginCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.json({ status: "false", data: "Invalid Email" });
    }

    const isPasswordValid = await bcrypt.compare(password, userFound.password);

    if (!isPasswordValid) {
      return res.json({
        status: "failed",
        data: "Invalid Login credentials",
      });
    }

    res.json({
      status: "success",
      data: userFound,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ status: "error", data: error.message });
  }
};

//details
const userDetailsCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User Details",
    });
  } catch (error) {
    res.json(error);
  }
};
//profile
const profileCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User profile",
    });
  } catch (error) {
    res.json(error);
  }
};

//upload profile photo
const uploadProfilePhotoCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User profile image upload",
    });
  } catch (error) {
    res.json(error);
  }
};

//upload cover image

const uploadCoverImgCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User cover image upload",
    });
  } catch (error) {
    res.json(error);
  }
};

//update password
const updatePasswordCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User password update",
    });
  } catch (error) {
    res.json(error);
  }
};

//update user
const updateUserCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User  update",
    });
  } catch (error) {
    res.json(error);
  }
};

//logout
const logoutCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User logout",
    });
  } catch (error) {
    res.json(error);
  }
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

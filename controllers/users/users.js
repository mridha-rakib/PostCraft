const bcrypt = require("bcryptjs");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");

//register

const registerCtrl = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return next(appErr("All fields are required"));
    }
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
    res.status(500).json({ error: error });
  }
};

//login
const loginCtrl = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(appErr("Email and password fields are required"));
    }
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return next(appErr("Invalid Login credentials"));
    }

    const isPasswordValid = await bcrypt.compare(password, userFound.password);

    if (!isPasswordValid) {
      return res.json({
        status: "failed",
        data: "Invalid Login credentials",
      });
    }
    req.session.userAuth = userFound._id;

    res.json({
      status: "success",
      data: userFound,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ status: "error", data: error.message });
  }
};

//profile
const profileCtrl = async (req, res) => {
  try {
    const userId = req.session.userAuth;

    const user = await User.findById(userId);

    res.json({
      status: "success",
      user: user,
    });
  } catch (error) {
    res.json(error);
  }
};

//details
const userDetailsCtrl = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return next(appErr("User not found"));
    }

    res.json({
      status: "success",
      user: "User Details",
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
const updateUserCtrl = async (req, res, next) => {
  try {
    const { fullname, email } = req.body;

    console.log(email);
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return next(appErr("Email is taken", 400));
      }
    }

    // update the user
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullname,
        email,
      },
      { new: true }
    );

    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.json(next(appErr(error.message)));
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

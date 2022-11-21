const { comparePassword } = require("../../utils/password");
const { generateToken } = require("../../utils/token");
const createError = require("http-errors");
const { transporter } = require("../../utils/mail");
const moment = require("moment");
const {
  existsUserService,
  registerUserService,
  getUsersListService,
  deleteUsersListService,
  findUserByEmailService,
  findUserByIdService,
  editUserService,
  deleteUserByIdService,
  resetPasswordService,
  findLoggedInUserService,
} = require("./user.service");

// register user
const registerUser = async (req, res, next) => {
  try {
    let user = await existsUserService(req, res, next);
    if (user) {
      next(createError(400, "User already exists"));
    } else {
      let data = await registerUserService(req, res, next);
      if (data) {
        return res
          .status(201)
          .json({ message: "account registered successfully", data });
      }
    }
  } catch (error) {
    next(error);
  }
};

// get users list
const getUsersList = async (req, res, next) => {
  try {
    let data = await getUsersListService(req, res, next);
    if (data) {
      res.status(200).json(data);
    }
  } catch (error) {
    next(error);
  }
};

// delete users list
const deleteUsersList = async (req, res, next) => {
  try {
    let data = await deleteUsersListService(req, res, next);
    if (data) {
      res.status(200).json({ message: "user list have been deleted", data });
    }
  } catch (error) {
    next(error);
  }
};

// login user
const loginUser = async (req, res, next) => {
  try {
    let user = await findUserByEmailService(req, res, next);
    if (user && (await comparePassword(req.body.password, user.password))) {
      let token = generateToken(user._id, user.email, user.role);
      let data = {
        user,
        token,
      };
      return res
        .cookie("token", token, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
        })
        .status(200)
        .json({ message: "Login success", data });
    } else {
      next(createError(400, "Invalid username or password"));
    }
  } catch (error) {
    next(error);
  }
};

// logout user
const logoutUser = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (token) {
      res
        .clearCookie("token")
        .status(200)
        .json({ message: "user have been logged out" });
    } else {
      next(createError(400, "user not logged in"));
    }
  } catch (error) {
    next(error);
  }
};

// get user by id
const getUserById = async (req, res, next) => {
  try {
    let user = await findUserByIdService(req, res, next);
    if (user) {
      return res.status(200).json(user);
    } else {
      next(createError(404, "user not found /api/users/id"));
    }
  } catch (error) {
    next(error);
  }
};

// edit user by id
const editUserById = async (req, res, next) => {
  try {
    let user = await editUserService(req, res, next);
    if (user) {
      res.status(200).json({ message: "User have been updated", user });
    } else {
      next(createError(404, "user not found /api/users/id"));
    }
  } catch (error) {
    next(error);
  }
};

// delete user by id
const deleteUserById = async (req, res, next) => {
  try {
    const user = await deleteUserByIdService(req, res, next);
    if (user) {
      return res
        .status(200)
        .json({ message: "User have been deleted!", user: user.userName });
    } else {
      next(createError(404, "user not found /api/users/id"));
    }
  } catch (error) {
    next(error);
  }
};

// reset password
const resetPassword = async (req, res, next) => {
  try {
    let user = await resetPasswordService(req, res, next);
    if (user) {
      return res
        .status(200)
        .json({ message: "Password have been updated", user });
    } else {
      next(
        createError(
          404,
          "email and mobileNumber does not match /api/users/reset-password"
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

// Send Pin
const SendPin = async (req, res, next) => {
  try {
    const user = await findUserByEmailService(req, res, next);
    if (user) {
      let code = Math.floor(1000 + Math.random() * 9000);
      user.pin = {
        code,
        willExpire: moment(),
      };
      await user.save();
      // nodemailer
      let mailData = {
        from: process.env.MAIL,
        to: user.email,
        subject: "password reset",
        html: `Hi there, <br /> your secret code is ${code}`,
      };

      transporter.sendMail(mailData, async (err, info) => {
        if (info) {
          let data = {
            info: info.envelope,
            code,
          };

          return res.status(200).json({
            message: "Email have been sent",
            data,
          });
        }
        if (err) {
          next(createError(400, err));
        }
      });
      // nodemailer ends
    } else {
      next(createError(404, "user does not exists"));
    }
  } catch (error) {
    next(error);
  }
};

// verify pin
const verifyPin = async (req, res, next) => {
  try {
    const user = await findLoggedInUserService(req, res, next);
    if (user) {
      let currentTime = moment().utc(); // using utc because of mongoose atlas
      let willExpire = moment(user.pin.willExpire);
      let minutes = currentTime.diff(willExpire, "minutes");
      if (minutes <= 2 && user.pin.code === req.body.code) {
        user.pin = {};
        await user.save();
        return res.status(200).json({ message: "Pin Code Matches" });
      } else {
        next(createError(400, "Invalid pin or pin expired"));
      }
    }
  } catch (error) {
    next(error);
  }
};

const accessDashboard = async (req, res, next) => {
  try {
    res.send("accessing dashboard");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  getUsersList,
  deleteUsersList,
  loginUser,
  logoutUser,
  getUserById,
  editUserById,
  deleteUserById,
  resetPassword,
  SendPin,
  verifyPin,
  accessDashboard,
};

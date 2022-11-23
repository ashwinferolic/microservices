const { comparePassword } = require("../../utils/password");
const { generateToken } = require("../../utils/token");
const createError = require("http-errors");
const { transporter } = require("../../utils/mail");
const moment = require("moment");
const { userLogger } = require("../../utils/logger");
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
const logger = userLogger();

// register user
const registerUser = async (req, res, next) => {
  try {
    let user = await existsUserService(req, res, next);
    if (user) {
      // logger
      logger.log("error", "User already exists", {
        METHOD: req.method,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
      });

      next(createError(400, "User already exists"));
    } else {
      let user = await registerUserService(req, res, next);
      if (user) {
        let token = generateToken(user._id, user.email, user.role);
        let data = {
          user,
          token,
        };

        logger.log("info", "User registered successfully", {
          METHOD: req.method,
          url: req.protocol + "://" + req.get("host") + req.originalUrl,
          token,
        });

        return res
          .cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
          })
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
      logger.log("info", "getting users List", {
        METHOD: req.method,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
      });
      return res.status(200).json(data);
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
      logger.log("info", "deleting users List", {
        METHOD: req.method,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
      });
      return res
        .status(200)
        .json({ message: "user list have been deleted", data });
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

      logger.log("info", "User login success", {
        METHOD: req.method,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
        token,
      });

      return res
        .cookie("token", token, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
        })
        .status(200)
        .json({ message: "Login success", data });
    } else {
      logger.log("error", "invalid username and password", {
        METHOD: req.method,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
      });
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
      logger.log("info", "user logout", {
        METHOD: req.method,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
      });
      return res
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
      logger.log("info", "getting user details", {
        METHOD: req.method,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
        user: req.params.id,
      });
      return res.status(200).json(user);
    } else {
      logger.log("error", "user not found", {
        METHOD: req.method,
        user_id: req.params.id,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
      });
      return next(createError(404, "user not found /api/users/id"));
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
      logger.log("info", "updating user details", {
        METHOD: req.method,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
        user: req.params.id,
      });
      res.status(200).json({ message: "User have been updated", user });
    } else {
      logger.log("error", "user not found", {
        METHOD: req.method,
        user_id: req.params.id,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
      });
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
      logger.log("info", "deleting user", {
        METHOD: req.method,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
        user: req.params.id,
      });
      return res
        .status(200)
        .json({ message: "User have been deleted!", user: user.userName });
    } else {
      logger.log("error", "user not found", {
        METHOD: req.method,
        user_id: req.params.id,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
      });
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
      logger.log("info", "resetting password", {
        METHOD: req.method,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
      });
      return res
        .status(200)
        .json({ message: "Password have been updated", user });
    } else {
      logger.log(
        "error",
        "resetting password : mobile number and email does not match",
        {
          METHOD: req.method,
          url: req.protocol + "://" + req.get("host") + req.originalUrl,
        }
      );
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

          logger.log("info", "Email have been sent", {
            METHOD: req.method,
            url: req.protocol + "://" + req.get("host") + req.originalUrl,
            user_mail: user.email,
            token: req.cookies.token,
          });

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
      logger.log("error", "User does not exists", {
        METHOD: req.method,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
      });
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

        logger.log("info", "sending pin to user", {
          METHOD: req.method,
          url: req.protocol + "://" + req.get("host") + req.originalUrl,
          user_pin: user.pin,
          token: req.cookies.token,
        });

        return res.status(200).json({ message: "Pin Code Matches" });
      } else {
        logger.log("error", "invalid Pin", {
          METHOD: req.method,
          user_pin: req.body.code,
          url: req.protocol + "://" + req.get("host") + req.originalUrl,
        });
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

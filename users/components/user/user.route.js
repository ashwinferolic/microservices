const express = require("express");
const router = express.Router();
const {
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
} = require("./user.controller");
const { protected } = require("../../utils/token");
const { validate } = require("../../middleware/joi.middleware");
const {
  userSchema,
  loginUserSchena,
  registerUserSchema,
  resetPasswordSchema,
  sendPINSchema,
  verifyPINSchema,
} = require("./user.validation");

// register and login
router.post("/register", validate(registerUserSchema), registerUser);
router.post("/login", validate(loginUserSchena), loginUser);
router.post("/logout", protected, logoutUser);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/send-pin", validate(sendPINSchema), SendPin);
router.post("/verify-pin", protected, validate(verifyPINSchema), verifyPin);
router.get("/dashboard", protected, accessDashboard);

// users list
router.get("/list", getUsersList);
router.delete("/list", deleteUsersList);

// update user by id
router.get("/details/:id", getUserById);
router.put("/details/:id", validate(userSchema), editUserById);
router.delete("/details/:id", deleteUserById);

module.exports = router;

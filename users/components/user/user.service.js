const User = require("./user.model");
const { hashPassword } = require("../../utils/password");
const { paginate } = require("../../utils/paginate");

// check if user exists
const existsUserService = async (req, res, next) => {
  try {
    return await User.findOne({
      $or: [{ userName: req.body.userName }, { email: req.body.email }],
    });
  } catch (error) {
    next(error);
  }
};

// register user
const registerUserService = async (req, res, next) => {
  try {
    let hashedPassword = await hashPassword(req.body.password);
    let data = await User.create({
      userName: req.body.userName,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      password: hashedPassword,
      address: req.body.address,
    });
    return data;
  } catch (error) {
    next(error);
  }
};

// get users list
const getUsersListService = async (req, res, next) => {
  try {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : 2;
    let start = (page - 1) * limit;
    let cmd = {};
    if (req.query.role) {
      cmd.role = req.query.role;
    }
    let totalCount = await User.countDocuments(cmd);
    let usersList = await User.find(cmd).skip(start).limit(limit);
    let data = paginate(usersList, page, limit, totalCount);
    return data;
  } catch (error) {
    next(error);
  }
};

// delete users list
const deleteUsersListService = async (req, res, next) => {
  try {
    await User.deleteMany();
    let data = await User.find();
    return data;
  } catch (error) {
    next(error);
  }
};

// find user by email
const findUserByEmailService = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    return user;
  } catch (error) {
    next(error);
  }
};

// find user by id
const findUserByIdService = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    return user;
  } catch (error) {
    next(error);
  }
};

// update user
const editUserService = async (req, res, next) => {
  try {
    return await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          mobileNumber: req.body.mobileNumber,
          address: req.body.address,
        },
      },
      { new: true }
    );
  } catch (error) {
    next(error);
  }
};

// delete user by id
const deleteUserByIdService = async (req, res, next) => {
  try {
    let user = await User.findByIdAndDelete({ _id: req.params.id });
    return user;
  } catch (error) {
    next(error);
  }
};

// reset password
const resetPasswordService = async (req, res, next) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    let user = await User.findOneAndUpdate(
      {
        $and: [
          { email: req.body.email },
          { mobileNumber: req.body.mobileNumber },
        ],
      },
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );
    return user;
  } catch (error) {
    next(error);
  }
};

// find login user service
const findLoggedInUserService = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    return user;
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};

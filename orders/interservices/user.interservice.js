const { API } = require("./config");

const getUsersInterService = async (req, res, next) => {
  try {
    let userIds = req.body.userIds;
    let userData = userIds.map(async (user) => await API.getUser(user));
    let userDetails = await Promise.all(userData).then((a) => a);
    return userDetails;
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsersInterService };

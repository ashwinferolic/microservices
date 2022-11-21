const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: {
    type: String,
  },
  email: {
    type: String,
  },
  mobileNumber: {
    type: Number,
  },
  role: {
    type: String,
    default: "customer",
  },
  password: {
    type: String,
  },
  address: {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  pin: {
    code: {
      type: String,
    },
    willExpire: {
      type: Date,
    },
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;

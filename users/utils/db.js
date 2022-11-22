const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongodb Connected`.blue);
  } catch (err) {
    console.error(`Error : ${err}`.red);
    // unhandled fatal exceptation
    process.exit(1);
  }
};

module.exports = { connectDB };

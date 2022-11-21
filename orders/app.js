require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const colors = require("colors");
const { connectDB } = require("./utils/db");
const { protected } = require("./utils/token");
const { errorHandler } = require("./middleware/error.middleware");
const app = express();
connectDB();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(cookieParser());
app.use(cors());
app.use("/uploads", express.static("uploads"));

//api routes
app.use("/api/orders", require("./components/orders/order.route"));
// protected route
app.get("/dashboard", protected, (req, res) => {
  res.send("Your secret key is batman!");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;
app.listen(PORT, () => {
  console.log(
    `Order server is running in ${NODE_ENV} mode on port ${PORT}`.blue
  );
});

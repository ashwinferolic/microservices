require("dotenv").config();
const express = require("express");
const logger = require("morgan");
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
app.use("/uploads", express.static("uploads"));

//api routes
app.use("/api/products", require("./components/product/product.route"));
// protected route
app.get("/dashboard", protected, (req, res) => {
  res.send("Your secret key is batman!");
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV;
app.listen(PORT, () => {
  console.log(
    `Product server is running in ${NODE_ENV} mode on port ${PORT}`.blue
  );
});

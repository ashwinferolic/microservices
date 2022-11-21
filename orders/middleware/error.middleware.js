const errorHandler = (err, req, res, next) => {
  console.log("Error");
  console.log(err);
  let errorStatus = err.statusCode || 500;
  let errMsg = err.message || "Something Went Wrong";
  res.status(errorStatus).json({
    status: errorStatus,
    error_message: errMsg,
    stack: process.env.NODE_ENV === "development" ? err.stack : [],
  });
};

module.exports = { errorHandler };

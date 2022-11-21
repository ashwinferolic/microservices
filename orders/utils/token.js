const Jwt = require("jsonwebtoken");

// create json web token
const generateToken = (id, email, role) => {
  return Jwt.sign({ id, email, role }, process.env.TOKEN_KEY, {
    expiresIn: "12d",
  });
};

// decode json web token with user id and email
const protected = (req, res, next) => {
  let token;

  // get token from authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    token = req.params.token || req.query.token;
  }
  if (!token) {
    return res.status(403).send("Auth failed, please login!");
  }
  try {
    const decoded = Jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (error) {
    return res.status(401).json({
      status: res.statusCode,
      error: error.message,
    });
  }
  return next();
};

module.exports = { generateToken, protected };

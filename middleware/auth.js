const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header("x-auth-token");

  // Check if no token is present
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add the user payload from the token to the request object
    req.user = decoded.user;
    next(); // Move on to the next piece of middleware or the route handler
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

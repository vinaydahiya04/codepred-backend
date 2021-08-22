const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decodedToken = jwt.verify(token, process.env.USER_JWT_SECRET);
      req.userData = { _id: decodedToken._id };
    } else if (req.body.id) {
      req.userData = { _id: req.body.id };
    }
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ status: false, message: "Auth failed" });
  }
};

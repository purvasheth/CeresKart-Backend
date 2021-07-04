const jwt = require("jsonwebtoken");
const { findUserById } = require("../controllers/users-controller");

async function verifyAuth(req, res, next) {
  try {
    const token = req.header("token");
    if (!token) {
      throw new Error("Unauthenticated request");
    }
    const { userId } = jwt.verify(token, process.env["secret"]);
    const user = await findUserById(userId);
    if (user) {
      req.user = user;
      return next();
    }
    throw new Error("Unauthenticated request");
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

module.exports = verifyAuth;

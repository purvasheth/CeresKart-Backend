const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  findUserByEmail,
  saveNewUser,
  updatePassword,
} = require("../controllers/users-controller");
const verifyAuth = require("../middleware/verify-auth");
const { wrapWithTryCatch } = require("../utils");

const router = express.Router();

function generateToken(userId, res) {
  jwt.sign(
    { userId },
    process.env["secret"],
    { expiresIn: "24h" },
    (error, token) => {
      if (error) {
        res.status(500).json({ message: error.message });
      }
      res.status(200).json({ token });
    }
  );
}

router.post("/signup", async (req, res) => {
  wrapWithTryCatch(res, async () => {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (user) {
      res.status(403).json({
        errors: { email: "user is already present" },
      });
    }
    const { _id } = await saveNewUser(req.body);
    return generateToken(_id, res);
  });
});

router.post("/login", async (req, res) => {
  wrapWithTryCatch(res, async () => {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(404).json({
        errors: { email: "user does not exist" },
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ errors: { password: "incorrect password" } });
    }
    return generateToken(user._id, res);
  });
});

router.get("/self", verifyAuth, (req, res) => {
  res.status(200).json({ message: "success" });
});

router.post("/reset-password", async (req, res) => {
  wrapWithTryCatch(res, async () => {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(404).json({ errors: { email: "user does not exist" } });
    }
    await updatePassword(user, password);
    return res.status(201).json({ message: "success" });
  });
});

module.exports = router;

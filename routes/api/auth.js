const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../../models/User");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/",
  [
    check("email", "Email is not valid").isEmail(),
    check("password", "Please enter a password").exists(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check to see if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // Check to see if entered password matches with hashed password in db
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);

      // If passwords don't match respond back with invalid credentials
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: `Invalid credentials. User with ${email} doesn't exist.` }] });
      }

      // Sign with JWT
      jwt.sign(
        {
          user: {
            id: user.id,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: "5 days" },
        (err, token) => {
          if(err) throw err;
          res.json({ token });
        }
      );

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error 500");
    }
  }
);

module.exports = router;

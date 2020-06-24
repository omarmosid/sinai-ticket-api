const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const auth = require("../../middleware/auth");

// @route    GET api/users
// @desc     Get all users
// @access   Public
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ date: -1 });
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// @route    GET api/me
// @desc     Get loggedin user data
// @access   Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user)
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// @route    GET api/users/:id
// @desc     Get specific user
// @access   Public
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});


// @route    POST api/users
// @desc     create a user
// @access   Public
router.post(
  "/",
  [
    check("email", "Not a valid email").isEmail(),
    check(
      "password",
      "Please make sure your password is atleast 8 characters long"
    ).isLength(8),
  ],
  async (req, res) => {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Main
    const { email, password, role } = req.body;
    try {
      // Check to see if user with same email already exists
      let user = await User.findOne({ email });
      console.log(user);
      if (user) {
        console.log("user exists");
        return res.status(400).json({
          errors: [{ msg: `User with email ${email} already exists` }],
        });
      }

      console.log("doesnt exist");

      // create user using User Model
      user = new User({
        name: "",
        email: email,
        username: email.split("@")[0],
        role: role,
        password: password,
      });

      // Encrypt password
      const salt = await bycrypt.genSalt(10);
      const hash = await bycrypt.hash(password, salt);
      user.password = hash;

      await user.save();

      // Sign with JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        {
          user: {
            id: user.id,
            email: user.email
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

// @route    DELETE api/users
// @desc     delete a user
// @access   Public
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    await user.remove();

    return res.json({
      msg: "User has been deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;

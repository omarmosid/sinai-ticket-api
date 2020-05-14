const express = require('express');
const router = express.Router();

const User = require('../../models/User');

// @route    GET api/users
// @desc     Get all users
// @access   Public
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ date: -1 });
    res.json(users);
  } catch(err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// @route    GET api/users/:id
// @desc     Get specific user
// @access   Public
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user)
  } catch(err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// @route    POST api/users
// @desc     create a user
// @access   Public
router.post("/", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      role: req.body.role,
      password: req.body.password
    });

    const user = await newUser.save();
    res.json(user)

  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
})

// @route    DELETE api/users
// @desc     delete a user
// @access   Public
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    await user.remove();

    return res.json({
      msg: "User has been deleted"
    })
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
})

module.exports = router
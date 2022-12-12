const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const fetchUser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const JWT_SECRET = "Harryisagoodb$oy";

// ROUTE 1: Create a User using: Post "/api/auth/sign_up". No Login requiered
router.post(
  "/sign_up",
  [
    body("name", "Name at lest 3 charecter").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password at least 5 charecters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,  errors: errors.array() });
    }
    try {
      //  Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,  error: "Sorry a user with this email is already exists" });
      }
      // Generate password in hass + salt code;
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      // Create a new user
      user = await User.create({
        username: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      // .then(user => res.json(user)).catch(err => {
      //   console.log(err);
      //   res.json({error: "Please enter a unique value for email", message: err.message})
      // })
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      // res.json(user);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      // Show Other errors
      console.error(error.message);
      res.status(500).send("Iternal server error");
    }
  }
);

// ROUTE 2: Authenticate a User: POST "api/auth/login". Login required
router.post(
  "/login",
  [
    body("email", "Invalid Email").isEmail(),
    body("password", "Invalid Password").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success, error: "Invalid username or password" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false
        return res.status(400).json({ success, error: "Invalid username or password" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      // Show Other errors
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2: Get logging use details using POST"/api/auth/user". Login required
router.post("/user", fetchUser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

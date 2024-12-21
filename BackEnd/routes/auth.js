const express = require("express");
const User = require("../models/User");
var bcrypt = require("bcryptjs");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var fetchUser = require("../middleware/fetchUser");

const JWT_SECRET = "gameofthrones$theoffice";

// Route 1
// Create a User using : POST "/api/auth/createuser". Doesn't require auth
router.post(
  "/createuser",
  [
    body("name", "Enter a Valid Name with atleast 3 characters").isLength({
      min: 5,
    }),
    body("email", "Enter a Valid Email").isEmail(),
    body(
      "password",
      "Enter a Valid Password with atleast 8 characters"
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    let success = false;
    // If there is an Error it will give bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    // To check whether user with same email exists already

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Enter different Email Bitch!" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Creating a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      // To catch if any error occured
      console.log(error.message);
      res.status(500).send("Some Internal Server Error Occured");
    }
  }
);

// Route 2
// Authenticate a User using : POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Enter a Password with more than 8 characters").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there is an Error it will give bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({ error: "Enter a valid Email" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Enter a valid Password" });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(payload, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      // To catch if any error occured
      console.log(error.message);
      res.status(500).send("Some Internal Server Error Occured");
    }
  }
);

// Route 3
// Get Detils of User using : POST "/api/auth/getuser". Login required
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    // To catch if any error occured
    console.log(error.message);
    res.status(500).send("Some Internal Server Error Occured");
  }
});
module.exports = router;

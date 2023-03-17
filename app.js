require("dotenv").config();
require("./config/database").connect();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const User = require("./model/user");

const app = express();
app.use(express.json());

app.post("/register", async (req, res) => {
  console.log("resight post call is being hit");
  try {
    // Get user input
    console.log(req.body);
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // console.log(process.env.TOKEN_KEY);

    // Create token
    const token = jwt.sign({ user_id: user._id, email }, process.env.JWT_KEY, {
      expiresIn: "2h",
    });
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/post", (req, res) => {
  console.log("login post call is being hit");
});

module.exports = app;

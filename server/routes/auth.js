const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

const {
  registerValidation,
  loginValidation,
} = require("../scripts/validation");

// REGISTER USER
router.post("/register", async (req, res) => {
  // ORGANIZATIONAL PASSWORD. REQUIRED TO REGISTER USERS.
  if (req.body.passcode !== process.env.PASSCODE) {
    return res.status(401).send("Organizational passcode is invalid");
  }

  // VALIDATE DATA
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // CHECK IF USERNAME ALREADY EXISTS
  const registeredUser = await User.findOne({ name: req.body.name });
  if (registeredUser) return res.status(400).send("Username already exists");

  // ENCRYPT THE PASSWORD
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // CREATE A NEW USER
  const user = new User({
    name: req.body.name,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.status(201).send({ _id: savedUser._id });
  } catch (error) {
    return res.status(400).send(error);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  // VALIDATE DATA
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // CHECK IF USERNAME IS REGISTERED, IF NOT, SEND ERROR
  const registeredUser = await User.findOne({ name: req.body.name });
  if (!registeredUser)
    return res.status(401).send("Username or password is invalid");

  // AUTHENTICATE PASSWORD
  try {
    const validPassword = await bcrypt.compare(
      req.body.password,
      registeredUser.password
    );
    if (!validPassword)
      return res.status(401).send("Username or password is invalid");

    // CREATE SESSION, STORE ID
    req.session.userId = registeredUser._id;
    res
      .status(200)
      .cookie("loggedIn", "true", {
        domain: process.env.DOMAIN,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 2,
      })
      .send("Login successful.");
  } catch (error) {
    return res.status(500).send(error);
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.status(500).send(`Unable to logout due to a server error`);
    res
      .clearCookie("sid", { domain: process.env.DOMAIN, path: "/" })
      .clearCookie("loggedIn", { domain: process.env.DOMAIN, path: "/" })
      .send("Session ended, user has been logged out.");
  });
});

module.exports = router;

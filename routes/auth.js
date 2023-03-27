/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */


const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ExpressError = require("../expressError");
const { SECRET_KEY } = require("../config");

// authenticate user through db, create and return jwt token
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (await User.authenticate(username, password)) {
      await User.updateLoginTimestamp(username);
    //   attaches username to token, can add additional info to token as needed like role or email 
      const token = jwt.sign({ username }, SECRET_KEY);
      return res.json({ token });
    } else {
      throw new ExpressError("Invalid username/password", 400);
    }
  } catch (err) {
    return next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { username } = await User.register(req.body);
    await User.updateLoginTimestamp(username);
    //   attaches username to token, can add additional info to token as needed like role or email 
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

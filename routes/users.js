/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

// format below is for testing purposes
// {
//     "username": "joel",
//     "password": "password",
//     "first_name": "Joel",
//     "last_name": "Burton",
//     "phone": "+14155551212"
// }

router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const users = await User.all();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

router.get("/:username", ensureLoggedIn, ensureCorrectUser, async (req, res, next) => {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.get("/:username/to", ensureLoggedIn, ensureCorrectUser, async (req, res, next) => {
  try {
    const messages = await User.messagesTo(req.params.username);
    return res.json({ messages });
  } catch (err) {
    return next(err);
  }
});

router.get("/:username/from", ensureLoggedIn, ensureCorrectUser, async (req, res, next) => {
  try {
    const messages = await User.messagesFrom(req.params.username);
    return res.json({ messages });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;


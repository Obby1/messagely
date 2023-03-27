/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/


const express = require("express");
const router = new express.Router();
const Message = require("../models/message");
const { ensureLoggedIn } = require("../middleware/auth");

// retreive message by id, ensure user logged in, and ensure user is either the sender or recipient
router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    const message = await Message.get(req.params.id);
    if (req.user.username === message.from_user.username || req.user.username === message.to_user.username) {
      return res.json({ message });
    } else {
      throw new ExpressError("Unauthorized", 401);
    }
  } catch (err) {
    return next(err);
  }
});

// create a new message, ensure user logged in
router.post("/", ensureLoggedIn, async (req, res, next) => {
  try {
    // create method accepts 3 params, "to_username" and "body" collected using spread syntax on ...req.body 
    // would be a good idea to add better error handling here
    const message = await Message.create({ from_username: req.user.username, ...req.body });
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

// mark message as read by updating timestamp, ensure user logged in, and ensure user is the recipient
router.post("/:id/read", ensureLoggedIn, async (req, res, next) => {
  try {
    const message = await Message.get(req.params.id);
    if (req.user.username === message.to_user.username) {
      const result = await Message.markRead(req.params.id);
    //   result is message id and read_at timestamp
      return res.json({ message: result });
    } else {
      throw new ExpressError("Unauthorized", 401);
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;


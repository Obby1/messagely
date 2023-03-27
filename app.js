/** Express app for message.ly. */


const express = require("express");
const cors = require("cors");
const { authenticateJWT } = require("./middleware/auth");

const ExpressError = require("./expressError")
const app = express();

// allow both form-encoded and json body parsing to turn req.body into an object we can work with in our routes
app.use(express.json());
// extended: true: The middleware will use the qs library to parse the data. This allows for the parsing of nested objects and arrays, 
// resulting in a richer data structure. This is the recommended option for most use cases.
app.use(express.urlencoded({extended: true}));

// allows connections from different domains or else API will block them due to default same origin policy
app.use(cors());

// get auth token for all routes
app.use(authenticateJWT);

/** routes */

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

/** 404 handler for routes that don't exist  */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler when error passed to next*/

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if (process.env.NODE_ENV != "test") console.error(err.stack);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;

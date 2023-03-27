/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken");
const ExpressError = require("../expressError");
const { SECRET_KEY } = require("../config");

/** Middleware: Authenticate user. */
function authenticateJWT(req, res, next) {
  try {
    const tokenFromBody = req.body._token;
    const payload = jwt.verify(tokenFromBody, SECRET_KEY);
    // Attach the payload to the request object for use in the route handler
    req.user = payload; 
    return next();
  } catch (err) {
    return next();
    // not a good idea to return invalid token error below as below routes will catch better errors and return
    // more appriopriate error messages
    // return next(new ExpressError("Invalid token", 401));
  }
}

/** Middleware: Requires user is authenticated. Above route creates req.user which authenticates. 
  Below route return error message */
function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return next({ status: 401, message: "Unauthorized" });
  } else {
    return next();
  }
}

/** Middleware: Requires correct username. */

function ensureCorrectUser(req, res, next) {
  try {
    if (req.user.username === req.params.username) {
      return next();
    } else {
      return next({ status: 401, message: "Unauthorized" });
    }
  } catch (err) {
    // errors would happen here if we made a request and req.user is undefined
    return next({ status: 401, message: "Unauthorized" });
  }
}


module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser
};


// Study Notes: 
// This structures follows the principal of separation of concerns
// useful to separate because we have more control over which routes we want to authenticate, which 
// error messages are shown, etc. Can be used to authenticate and show only specific messages, but not others
// can use all 3 routes or just 1 or 2, etc.
// By separating these middlewares, we maintain a modular and clean codebase, making it easier to maintain 
// and extend the functionality of the application.
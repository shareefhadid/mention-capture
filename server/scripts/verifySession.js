// MIDDLEWARE FUNCTION FOR VERIFYING SESSIONS
module.exports = function (req, res, next) {
  // IF NOT IN PRODUCTION, RETURN NEXT()
  if (process.env.NODE_ENV !== "production") {return next()}

  // CHECK THAT A SESSION EXISTS AND THE USERID WAS SENT IN THE COOKIE
  if (req.session && req.session.userId) {
    next();
  } else {
    return res
      .clearCookie("sid", { domain: process.env.DOMAIN, path: "/" })
      .clearCookie("loggedIn", { domain: process.env.DOMAIN, path: "/" })
      .send("Please login to view this resource.")
  }
};

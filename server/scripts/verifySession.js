// MIDDLEWARE FUNCTION FOR VERIFYING SESSIONS
module.exports = function (req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    return res
      .clearCookie("sid", { domain: process.env.DOMAIN, path: "/" })
      .clearCookie("loggedIn", { domain: process.env.DOMAIN, path: "/" })
      .send("Please login to view this resource.")
  }
};

const express = require("express");
const Newsletter = require("../models/Newsletter.js");
const jwt = require("jsonwebtoken");

// SET UP ROUTER
const router = express.Router();

// GET TO UNSUB FROM NEWSLETTER
router.get("/", async (req, res) => {
  try {
    const token = req.query.token;
    if (!token)
      return res
        .status(401)
        .json({ err: "Access Denied: Requires token", output: output });
    jwt.verify(
      token,
      process.env.UNSUB_TOKEN_SECRET,
      async (err, tokenPayload) => {
        let output = {};
        if (err)
          return res
            .status(403)
            .json({ err: `Access Denied: ${err}`, output: output });
        output.mongo = await Newsletter.findOneAndUpdate(
          { _id: tokenPayload.id },
          { $pull: { emails: tokenPayload.email } },
          { new: true }
        );
        res.status(200).redirect("/unsubscribe");
      }
    );
  } catch (error) {
    return res
      .status(500)
      .send("<h1>There was an error processing your request</h1>");
  }
});

module.exports = router;
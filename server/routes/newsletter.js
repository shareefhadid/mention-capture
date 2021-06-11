// MODULES
const express = require("express");
// MODELS
const Newsletter = require("../models/Newsletter.js");
const Search = require("../models/Capture.js");
const Result = require("../models/Result.js");
// SCRIPTS
const mailer = require("../scripts/mailer.js");
const scheduler = require("../scripts/scheduler.js");
const {
  newsletterValidation,
  testNewsletterValidation,
} = require("../scripts/validation");

// SET UP ROUTER
const router = express.Router();

// GET ALL NEWSLETTERS SORTED BY MOST RECENTLY UPDATED
router.get("/", async (req, res) => {
  let output = {};
  try {
    output.mongo = await Newsletter.find().sort({ updatedAt: "descending" });
  } catch (error) {
    return res.status(400).json({ err: error, output: output });
  }
  res.status(200).json({ output: output });
});

// POST TO ADD NEWSLETTER
router.post("/", async (req, res) => {
  let output = {};

  // CHECK IF SEARCHES EXISTS. IF ANY DO NOT, RESPOND WITH ARRAY CONTAINING THEIR IDs
  const searchExists = await Search.find({ _id: { $in: req.body.searches } });
  const searchNoExists = req.body.searches.filter(
    (requestId) => !searchExists.map(({ id }) => id).includes(requestId)
  );
  if (searchNoExists.length > 0)
    return res.status(400).json({ searchNoExists: searchNoExists });

  // CHECK IF THERE ARE ALREADY 15 NEWSLETTERS. IF THERE ARE, RESPOND WITH ERROR
  const newsletterCount = await Newsletter.countDocuments({});
  if (newsletterCount > 15) {
    return res.status(400).json({
      err:
        "You can have a maximum of 15 newsletters, please delete one and try again",
    });
  }

  // VALIDATE DATA
  const { error } = newsletterValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newsletter = new Newsletter({
    name: req.body.name,
    title: req.body.title,
    emails: req.body.emails,
    searches: req.body.searches,
    max_results: req.body.max_results,
    min_results: req.body.min_results,
    interval: req.body.interval,
    start_date: req.body.start_date,
    active: req.body.active,
  });
  try {
    output.mongo = await newsletter.save();
    if (req.body.active == true) {
      output.scheduler = await scheduler.addScheduler(
        req.body.name,
        req.body.start_date,
        req.body.interval
      );
    }
  } catch (error) {
    if (error.message.includes("duplicate key error")) {
      return res.status(500).send("This newsletter name already exists. Please select a different newsletter name.")
    }
    return res.status(400).json({ err: error, output: output });
  }
  res.status(201).json({ output: output });
});

// PUT TO EDIT NEWSLETTER
router.put("/", async (req, res) => {
  let output = {};

  // CHECK IF SEARCHES EXISTS. IF ANY DO NOT, RESPOND WITH ARRAY CONTAINING THEIR IDs
  const searchExists = await Search.find({ _id: { $in: req.body.searches } });
  const searchNoExists = req.body.searches.filter(
    (requestId) => !searchExists.map(({ id }) => id).includes(requestId)
  );
  if (searchNoExists.length > 0)
    return res.status(400).json({ searchNoExists: searchNoExists });

  // VALIDATE DATA
  const { error } = newsletterValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const updatedNewsletter = {
    name: req.body.name,
    title: req.body.title,
    emails: req.body.emails,
    searches: req.body.searches,
    max_results: req.body.max_results,
    min_results: req.body.min_results,
    interval: req.body.interval,
    start_date: req.body.start_date,
    active: req.body.active,
  };
  try {
    output.mongo = await Newsletter.findOneAndUpdate(
      { _id: req.body._id },
      updatedNewsletter
    );
    const oldNewsletterName = output.mongo.name;
    output.scheduler = await scheduler.deleteScheduler(oldNewsletterName);
    if (req.body.active == true) {
      output.scheduler = await scheduler.addScheduler(
        req.body.name,
        req.body.start_date,
        req.body.interval
      );
    }
  } catch (error) {
    if (error.message.includes("duplicate key error")) {
      return res.status(500).send("This newsletter name already exists. Please select a different newsletter name.")
    }
    return res.status(400).json({ err: error, output: output });
  }
  res.status(200).json({ output: output });
});

// DELETE NEWSLETTER
router.delete("/", async (req, res) => {
  let output = {};
  try {
    if (req.body.active == true) {
      output.scheduler = await scheduler.deleteScheduler(req.body.name);
    }
    output.mongo = await Newsletter.findOneAndDelete({
      name: req.body.name,
    });
  } catch (error) {
    return res.status(500).json({ err: error, output: output });
  }
  res.status(200).json({ output: output });
});

// POST TO TEST NEWSLETTER. ALLOWS SPECIFYING RECIPIENTS OF TEST, OTHER THAN THOSE SPECIFIED FOR THE ACTUAL NEWSLETTER.
router.post("/test", async (req, res) => {
  let output = {};

  // VALIDATE DATA
  const { error } = testNewsletterValidation({
    title: req.body.newsletter.title,
    searches: req.body.newsletter.searches,
    max_results: req.body.newsletter.max_results,
    testEmails: req.body.testEmails,
  });
  if (error) return res.status(400).send(error.details[0].message);

  try {
    output.mailer = await mailer.test(req.body.newsletter, req.body.testEmails);
  } catch (error) {
    return res.status(500).json({ err: error, output: output });
  }
  res.status(200).json({ output: output });
});

// TEST ROUTE TAKE THIS OUT
router.post("/maseh", async (req, res) => {
  try {
    const searches = await Search.find({ _id: { $in: newsletter.searches } });

    if (req.body.newsletter.last_sent == undefined) {
      req.body.newsletter.last_sent = new Date("2021-01-01T00:00:00.000Z");
    }
    const result = await Result.aggregate([
      {
        $match: {
          search_id: { $in: req.body.newsletter.searches },
          createdAt: { $gt: req.body.newsletter.last_sent },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            _id: "$result_url",
            result_source: "$result_source",
            result_title: "$result_title",
            result_url: "$result_url",
            result_date: "$result_date",
            result_excerpt: "$result_excerpt",
            terms_found: "$terms_found",
          },
        },
      },
      { $replaceRoot: { newRoot: "$_id" } },
      { $limit: 100 },
    ]);

    res.status(200).send(result)

  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;

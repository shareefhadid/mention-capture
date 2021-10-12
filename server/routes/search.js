// MODULES
const express = require("express");
// MODELS
const Capture = require("../models/Capture.js");
const Result = require("../models/Result.js");
// SCRIPTS
const execCaptureSearch = require("../scripts/execCaptureSearch");
const { searchValidation } = require("../scripts/validation");

// SET UP ROUTER
const router = express.Router();

// GET ALL SEARCHES SORTED BY MOST RECENTLY UPDATED
router.get("/", async (req, res) => {
  let output = {};
  try {
    output.mongo = await Capture.find().sort({ updatedAt: "descending" });
  } catch (error) {
    return res.status(400).json({ err: error, output: output });
  }
  res.status(200).json({ output: output });
});

// POST TO ADD SEARCH
router.post("/", async (req, res) => {
  let output = {};
  const captureCount = await Capture.countDocuments({});
  if (captureCount > 25) {
    return res.json({
      err:
        "You can have a maximum of 25 searches, please delete one and try again",
      output: output,
    });
  }
  // VALIDATE DATA
  const { error } = searchValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const search = new Capture({
    capture_name: req.body.capture_name,
    sources: req.body.sources,
    search_options: req.body.searchOptions,
    email_options: req.body.emailOptions,
    user_id: req.body.user_id,
  });
  try {
    output.mongo = await search.save();
  } catch (error) {
    if (error.message.includes("duplicate key error")) {
      return res.status(500).send("This search name already exists. Please select a different search name.")
    }
    return res.status(400).json({ err: error, output: output });
  }
  res.status(201).json({ output: output });
});

// PUT TO EDIT SEARCH
router.put("/", async (req, res) => {
  let output = {};

  // VALIDATE DATA
  const { error } = searchValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const updatedSearch = {
    search_name: req.body.search_name,
    search_terms: req.body.search_terms,
    sources: req.body.sources,
  };
  try {
    output.mongo = await Search.findOneAndUpdate(
      { _id: req.body._id },
      updatedSearch,
      { new: true }
    );

    // REMOVE RESULTS THAT DO NOT CONTAIN THE UPDATED SOURCES OR TERMS
    const sources = updatedSearch.sources.map(({ source_url }) => source_url)
    const searchTerms = updatedSearch.search_terms
    await Result.deleteMany({ result_source_url: { $nin: sources }, search_id: req.body._id })
    await Result.deleteMany({
      terms_found: {
        $not: {
          $elemMatch:
            { $in: searchTerms }
        }
      }, search_id: req.body._id
    })
  } catch (error) {
    if (error.message.includes("duplicate key error")) {
      return res.status(500).send("This search name already exists. Please select a different search name.")
    }
    return res.status(500).json({ err: error, output: output });
  }
  res.status(200).json({ output: output });
});

// DELETE SEARCH
router.delete("/", async (req, res) => {
  let output = {};
  try {
    output.mongo = await Search.deleteMany({
      _id: { $in: req.body.search_ids },
    });
    output.mongo = await Newsletter.updateMany(
      { searches: { $in: req.body.search_ids } },
      { $pull: { searches: { $in: req.body.search_ids } } },
      { new: true }
    );
    output.mongo = await Result.deleteMany({
      search_id: { $in: req.body.search_ids },
    });
  } catch (error) {
    return res.status(500).json({ err: error, output: output });
  }
  res.status(200).json({ output: output });
});

// EXECUTE SCRAPER
router.post("/scrape", async (req, res) => {
  let output = {};
  try {
    const now = new Date();
    output.scraper = await executePalliatrack(req.body.search_ids)
    output.mongo = await Result.find({
      search_id: { $in: req.body.search_ids },
      createdAt: { $gt: now },
    })
  } catch (error) {
    res.status(500).json({ err: error, output: output });
  }
  res.status(200).json({ output: output });
});

// GET RESULTS
router.get("/results", async (req, res) => {
  let output = {};
  try {
    output.mongo = await Result.find()
      .sort({ createdAt: "descending" })
      .limit(100);
  } catch (error) {
    res.status(400).json({ err: error, output: output });
  }
  res.status(200).json({ output: output });
});

// POST RESULTS BY SEARCH
router.post("/results", async (req, res) => {
  let output = {};
  try {
    output.mongo = await Result.find({ search_id: req.body.search_id })
      .sort({ createdAt: "descending" })
      .limit(100);
  } catch (error) {
    res.status(400).json({ err: error, output: output });
  }
  res.status(200).json({ output: output });
});

module.exports = router;

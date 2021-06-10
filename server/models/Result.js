const mongoose = require("mongoose");

// Each result along with its source, child of resultsSchema
const resultsSchema = mongoose.Schema(
  {

  },
  { _id: false }
);

// Results are outputted by the Python script, child of searchSchema
const searchResultsSchema = mongoose.Schema(
  {
    search_id: {
      type: String,
      required: true,
    },
    terms_found: [
      {
        type: String,
      },
    ],
    result_source: {
      type: String,
      required: true,
      trim: true,
    },
    result_source_url: {
      type: String,
      required: true,
      trim: true,
    },
    result_title: {
      type: String,
    },
    result_url: {
      type: String,
    },
    result_excerpt: {
      type: String,
      trim: true,
    },
    result_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: "results_collection",
  }
);

module.exports = mongoose.model("result", searchResultsSchema);

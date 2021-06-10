const mongoose = require("mongoose");

// Sources to search, child of parametersSchema
const sourceSchema = new mongoose.Schema(
  {
    source_name: {
      type: String,
      required: true,
      trim: true,
    },
    source_url: {
      type: String,
      required: true,
      trim: true,
    },
  }, { _id: false }
);

// The search collection which contains all search documents
const searchSchema = mongoose.Schema(
  {
    search_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    bad_urls: [
      {
        type: String,
      },
    ],
    search_terms: [
      {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, "Please ensure your search terms are not left blank"],
      },
    ],
    sources: [sourceSchema],
  },
  { timestamps: true, collection: "search_collection" }
);

module.exports = mongoose.model("search", searchSchema);

const mongoose = require("mongoose");

// CONTAINS SOURCES
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
    errs: [
      {
        type: String,
      },
    ],
    categories: [
      {
        type: String,
      }
    ]
  },
);

// CONTAINS OPTIONS FOR SEARCH
const searchSchema = mongoose.Schema(
  {
    or_terms: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    and_terms: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    not_terms: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    case_sensitive: {
      type: Boolean,
      default: false,
    },
    full_word: {
      type: Boolean,
      default: false,
    },
    min_pubdate: {
      type: Boolean,
      default: false,
    },
    max_pubdate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// CONTAINS OPTIONS FOR EMAIL
const emailSchema = mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    emails: {
      type: [
        {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
      ],
      validate: [
        arrayLimit,
        "The maximum number of emails is 100. Please reduce the number of emails.",
      ],
    },
    recurrence: {
      type: String,
      required: true,
      trim: true,
      enum: ["One Time", "Daily", "Weekly", "Monthly", "Quarterly", "Annually"],
    },
    start_date: {
      type: Date,
    },
    min_results: {
      type: Number,
      required: true,
    },
    max_results: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    last_sent: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// PARENT OBJECT, CONTAINS SOURCES, SEARCH OPTIONS, EMAIL OPTIONS,
const captureSchema = mongoose.Schema(
  {
    capture_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    sources: [sourceSchema],
    search_options: searchSchema,
    email_options: emailSchema,
    user_id: {
      type: String,
      required: true
    },
  },
  { timestamps: true, collection: "capture_collection" }
);

// For email limit
function arrayLimit(val) {
  return val.length <= 100;
}

module.exports = mongoose.model("capture", captureSchema);

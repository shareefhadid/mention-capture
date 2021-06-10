const mongoose = require("mongoose");

const newsletterSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    title: {
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
    searches: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    max_results: {
      type: Number,
      required: true,
    },
    min_results: {
      type: Number,
      required: true,
    },
    interval: {
      type: String,
      required: true,
      trim: true,
      enum: ["One Time", "Daily", "Weekly", "Monthly", "Quarterly", "Annually"],
    },
    start_date: {
      type: Date,
    },
    last_sent: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "newsletter_collection",
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length <= 100;
}

module.exports = mongoose.model("newsletter", newsletterSchema);

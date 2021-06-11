// MODULES
const jwt = require("jsonwebtoken");
const path = require("path");
const nodemailer = require("nodemailer");
// MODELS
const Newsletter = require("../models/Newsletter");
const Result = require("../models/Result");
// SCRIPTS
const execCaptureSearch = require("./execCaptureSearch");
const newsletter_template = require("./newsletter_template");

// AGGREGATOR. SET OF STEPS THAT ALLOW FEWER QUERY RESULTS AFTER EACH STEP. FINAL ARRAY CONTAINS CORRECT STRUCTURE FOR MAILER.
async function aggregator(newsletter) {
  if (newsletter.last_sent == undefined) {
    newsletter.last_sent = new Date("2021-01-01T00:00:00.000Z");
  }
  return await Result.aggregate([
    {
      $match: {
        search_id: { $in: newsletter.searches },
        createdAt: { $gt: newsletter.last_sent },
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
}

// DISTRIBUTOR (HELPER FUNCTION). DISTRIBUTES RESULTS EVENLY ACROSS SOURCES.
function distributor(results, max_results) {
  let assorted_results = [];
  let i = 1;
  let j;
  do {
    j = 0;
    for (result of results) {
      let numOfExistingSourceResults = assorted_results.filter(
        (existing_result) =>
          existing_result.result_source == result.result_source
      );
      if (
        !assorted_results.includes(result) &&
        numOfExistingSourceResults.length < i
      ) {
        if (assorted_results.length >= max_results) {
          break;
        }
        assorted_results.push(result);
        j++;
      }
    }
    i++;
  } while (j > 0);
  return assorted_results;
}

// TERMCOUTNER (HELPER FUNCTION). RETURNS OBJECT WITH TERMS (KEY) AND NUMBER OF UNIQUE OCCURANCES (VALUE)
function termCounter(results) {
  let uniqueTerms = new Set();
  let allTerms = [];
  let termCounter = {};
  for (result of results) {
    for (term of result.terms_found) {
      uniqueTerms.add(term);
      allTerms.push(term);
    }
  }
  for (uniqueTerm of uniqueTerms) {
    termCounter[uniqueTerm] = allTerms.reduce(
      (a, v) => (v === uniqueTerm ? a + 1 : a),
      0
    );
  }
  return termCounter;
}

// UNSUBMAKER (HELPER FUNCTION). CREATES A UNIQUE UNSUB LINK BASED ON RECIPIENT EMAIL A NEWSLETTER ID.
function unsubMaker(recipient, id) {
  const token = jwt.sign(
    { email: recipient, id: id },
    process.env.UNSUB_TOKEN_SECRET
  );
  const unsubLink = `${process.env.DOMAIN}/api/unsubscribe?token=${token}`;
  return unsubLink;
}

// INITIALIZER FOR MAILER
const start = () =>
  nodemailer.createTransport({
    host: "mail.deeptox.co",
    port: 465,
    secure: true,
    auth: {
      user: "test@deeptox.co",
      pass: "C3~Y2y{G-_P~",
    },
  });

// SEND NEWSLETTER
const send = async (newsletterName) => {
  try {
    const newsletter = await Newsletter.findOne({ name: newsletterName });
    await executePalliatrack(newsletter.searches);
    const results = await aggregator(newsletter);
    if (results.length < newsletter.min_results) {
      return `Less than ${newsletter.min_results} result(s) were found, newsletter has not been sent`;
    }
    const termMentions = termCounter(results);
    const lastSentString =
      newsletter.last_sent == undefined
        ? `found since ${newsletter.last_sent.toDateString()}`
        : "";
    const numNewArticles = results.length;
    const assortedResults = distributor(results, newsletter.max_results);
    const recipients = newsletter.emails;
    const subject = `CHPCA Newsletter: ${newsletter.title}`;
    recipients.forEach(async (recipient) => {
      const unsubLink = unsubMaker(recipient, newsletter._id);
      await transporter.sendMail(
        {
          from: '"Test" <test@deeptox.co>',
          to: recipient,
          subject: subject,
          html: newsletter_template(
            newsletter.title,
            assortedResults,
            unsubLink,
            numNewArticles,
            lastSentString,
            termMentions
          ),
          attachments: [
            {
              filename: "image.png",
              path: path.join(__dirname, "../assets/chpca-logo.png"),
              cid: "chpca-logo",
            },
          ],
        },
        async (error, info) => {
          if (error) {
            return error;
          }
          await Newsletter.findOneAndUpdate(
            { name: newsletterName },
            { last_sent: new Date() }
          );
          return "Message sent: " + info.response;
        }
      );
    });
  } catch (error) {
    return error;
  }
};

// SEND TEST NEWSLETTER.
const test = async (newsletter, recipients) => {
  try {
    await executePalliatrack(newsletter.searches);
    const results = await aggregator(newsletter);
    const termMentions = termCounter(results);
    const lastSentString =
      newsletter.last_sent == undefined
        ? `found since ${newsletter.last_sent.toDateString()}`
        : "";
    const numNewArticles = results.length;
    const assortedResults = distributor(results, newsletter.max_results);
    const subject = `CHPCA Newsletter: ${newsletter.title}`;
    recipients.forEach(async (recipient) => {
      await transporter.sendMail(
        {
          from: '"Test" <test@deeptox.co>',
          to: recipient,
          subject: subject,
          html: newsletter_template(
            `${newsletter.title} (TEST)`,
            assortedResults,
            "",
            numNewArticles,
            lastSentString,
            termMentions
          ),
          attachments: [
            {
              filename: "image.png",
              path: path.join(__dirname, "../assets/chpca-logo.png"),
              cid: "chpca-logo",
            },
          ],
        },
        async (error, info) => {
          if (error) {
            return error;
          }
          return "Message sent: " + info.response;
        }
      );
    });
  } catch (error) {
    return error;
  }
};

module.exports.start = start;
module.exports.test = test;
module.exports.send = send;

// MODULES
const schedule = require("node-schedule");
// MODELS
const Newsletter = require("../models/Newsletter");
const mailer = require("./mailer");
// SCRIPTS
const execCaptureSearch = require("./execCaptureSearch");

var jobs = {};

const dailyScrape = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const activeNewsletters = await Newsletter.find({ active: true });
      let searches = [];
      if (activeNewsletters.length > 0) {
        activeNewsletters.forEach((newsletter) => {
          searches.push(...newsletter.searches);
        });
      }
      const rule = new schedule.RecurrenceRule();
      rule.hour = 5;
      rule.minute = 0;
      rule.second = 0;
      // Creates a key in the jobs object using the newsletter name, schedules the job and sets it as the value
      jobs["Daily Scrape"] = schedule.scheduleJob(
        "Daily Scrape",
        { rule: rule, tz: "Etc/UTC" },
        function () {
          executePalliatrack(searches);
        }
      );
      resolve("Daily Scraper Running");
    } catch (error) {
      reject(error);
    }
  });
};

const runScheduler = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const newsletters = await Newsletter.find({ active: true });
      for (newsletter of newsletters) {
        // Skip an iteration if the start date is in the past and the interval is one time
        let now = new Date();
        if (newsletter.interval == "One Time" && newsletter.start_date < now) {
          continue;
        }
        // Sets a recurrence rule based on the interval and newsletter.start_date. 1 day is not part of the case switch, as it is the default.
        // We add 1 second so that the recurrence rule falls after the start date. Otherwise it won't run on the start date.
        const rule = new schedule.RecurrenceRule();
        rule.hour = newsletter.start_date.getUTCHours();
        rule.minute = newsletter.start_date.getUTCMinutes();
        rule.second = newsletter.start_date.getUTCSeconds() + 1;
        switch (newsletter.interval) {
          case "Weekly":
            rule.dayOfWeek = newsletter.start_date.getUTCDay();
            break;
          case "Monthly":
            rule.date = newsletter.start_date.getUTCDate();
            break;
          case "Quarterly":
            rule.month = [0, 3, 6, 9];
            rule.date = newsletter.start_date.getUTCDate();
            break;
          case "Annually":
            rule.month = newsletter.start_date.getUTCMonth();
            rule.date = newsletter.start_date.getUTCDate();
        }
        // If the interval is one time, sets the job to runs once, otherwise, sets a recurring job. Stores job in an object so that we can easily accessed it by indexing the name to access properties and cancel job
        if (newsletter.interval == "One Time") {
          jobs[newsletter.name] = schedule.scheduleJob(
            newsletter.start_date,
            async function () {
              const mailerRes = await mailer.send(newsletter.name);
            }
          );
        } else {
          jobs[newsletter.name] = schedule.scheduleJob(
            newsletter.name,
            { start: newsletter.start_date, rule: rule, tz: "Etc/UTC" },
            async function () {
              const mailerRes = await mailer.send(newsletter.name);
            }
          );
        }
      }
      resolve("Scheduler Initialized");
    } catch (error) {
      reject(error);
    }
  });
};

// Add code for adding scheduler
const addScheduler = (newsletterName, start_date, interval) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Initialize schedule options object, set later on
      const startDate = new Date(start_date);
      // Sets a recurrence rule based on the interval and start_date. 1 day is not part of the case switch, as it is the default.
      // We add 1 second so that the recurrence rule falls after the start date. Otherwise it won't run on the start date.
      const rule = new schedule.RecurrenceRule();
      rule.hour = startDate.getUTCHours();
      rule.minute = startDate.getUTCMinutes();
      rule.second = startDate.getUTCSeconds() + 1;
      switch (interval) {
        case "Weekly":
          rule.dayOfWeek = startDate.getUTCDay();
          break;
        case "Monthly":
          rule.date = startDate.getUTCDate();
          break;
        case "Quarterly":
          rule.month = [0, 3, 6, 9];
          rule.date = startDate.getUTCDate();
          break;
        case "Annually":
          rule.month = startDate.getUTCMonth();
          rule.date = startDate.getUTCDate();
      }
      // If the interval is one time, sets the job to runs once, otherwise, sets a recurring job. Stores job in an object so that we can easily accessed it by indexing the name to access properties and cancel job
      if (interval == "One Time") {
        jobs[newsletterName] = schedule.scheduleJob(
          startDate,
          async function () {
            const mailerRes = await mailer.send(newsletterName);
          }
        );
      } else {
        jobs[newsletterName] = schedule.scheduleJob(
          newsletterName,
          { start: startDate, rule: rule, tz: "Etc/UTC" },
          async function () {
            const mailerRes = await mailer.send(newsletterName);
          }
        );
      }
      resolve("Scheduler Initialized");
    } catch (error) {
      reject(error);
    }
  });
};

// Add code for deleting scheduler
const deleteScheduler = (newsletterName) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (jobs[newsletterName]) {
        jobs[newsletterName].cancel();
        delete jobs[newsletterName];
        resolve("Scheduler cancelled");
      } else resolve("There was no scheduler to cancel");
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.dailyScrape = dailyScrape;
module.exports.runScheduler = runScheduler;
module.exports.addScheduler = addScheduler;
module.exports.deleteScheduler = deleteScheduler;

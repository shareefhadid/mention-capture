// MODULES
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv/config");
// SCRIPTS
const connectDB = require("./scripts/connectDB");
const mailer = require("./scripts/mailer");
const scheduler = require("./scripts/scheduler");
const verifySession = require("./scripts/verifySession");

// SET UP EXPRESS
const app = express();

// TRUST FIRST PROXY (FOR SSL REVERSE PROXY WITH NGINX IN PRODUCTION)
if (process.env.NODE_ENV === "production") {
  app.set('trust proxy', 1)
}

// CONNECTS TO DATABASE
connectDB();

// INITIALIZE SCHEDULER (NODE-SCHEDULE). SCHEDULES ALL ACTIVE NEWSLETTERS (RUNSCHEDULER) AND SCHEDULES A DAILY SCRAPE TO AVOID MISSING ARTICLES
const db = mongoose.connection;
db.once("open", async function () {
  await scheduler.runScheduler();
  await scheduler.dailyScrape();
});

// INITIALIZE EMAIL TRANSPORTER FOR NODEMAILER
transporter = mailer.start();
transporter.verify((error, success) => {
  if (error) {
    console.log(`Mailer error: ${error}`);
  } else {
    console.log(`Mailer ready`);
  }
});

// BASIC MIDDLEWARE FOR CROSS ORIGIN REQUESTS AND FORM HANDLING IN REQUESTS.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// SESSION MIDDLEWARE FOR AUTH
app.use(
  session({
    name: "sid",
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      domain: process.env.DOMAIN,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
    store: MongoStore.create({
      client: db.getClient(),
      ttl: 60 * 60 * 2, // 2 hours, in seconds
      touchAfter: 24 * 3600, // time period in seconds
      crypto: {
        secret: process.env.STORE_SECRET,
      },
    }),
  })
);

// API ROUTE HANDLERS
const authRoute = require("./routes/auth");
app.use("/api/user", authRoute);

const searchRoute = require("./routes/search");
app.use("/api/search", verifySession, searchRoute);

const newsletterRoute = require("./routes/newsletter");
app.use("/api/newsletter", verifySession, newsletterRoute);

const unsubRoute = require("./routes/unsubscribe");
app.use("/api/unsubscribe", unsubRoute);

// CATCH-ALL ROUTER FOR VUE. NECESSARY FOR SINGLE PAGE APPLICATION ROUTING. API/BACKEND ROUTES MUST BE HANDLED BEFORE THIS.
app.use(express.static(`${__dirname}/public`));
app.get(/.*/, (req, res) => res.sendFile(`${__dirname}/public/index.html`));

// EXPOSE PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

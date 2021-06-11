const mongoose = require("mongoose");
require("dotenv/config");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.NODE_ENV === "production" ? process.env.MONGO_URI : process.env.DEV_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
      (err) => console.log(err || "Connected to DB")
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;

const mongoose = require("mongoose");
require("dotenv/config");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/palliatrack_db?authSource=admin`,
      // `mongodb://localhost:27017/palliatrack_db`,
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

const functions = require("firebase-functions");
const mongoose = require("mongoose");

const uri = functions.config().env.pointsuri || "mongodb:localhost:databasetest";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;

connection.once("open",
  () => {
    console.log("DB is conneted!");
  }
);
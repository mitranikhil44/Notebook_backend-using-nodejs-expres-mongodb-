const mongoose = require("mongoose");
const mongoURL = "mongodb://127.0.0.1:27017/iNotebook"; // MongoDb connection string

const connectToMongo = () => {
  mongoose.connect(mongoURL, () => {
    console.log("conneted to Mongo DB successfully");
  });
};

module.exports = connectToMongo;

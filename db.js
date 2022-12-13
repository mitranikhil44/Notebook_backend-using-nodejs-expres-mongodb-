const mongoose = require("mongoose");
const mongoURL = "mongodb+srv://Mitranikhil33:Babul%40123%4033@project.p9cvq4x.mongodb.net/?retryWrites=true&w=majority/iNotebook"; // MongoDb connection string

const connectToMongo = () => {
  mongoose.connect(mongoURL, () => {
    console.log("conneted to Mongo DB successfully");
  });
};

module.exports = connectToMongo;

const mongoose = require("mongoose");
mongoose.plugin(require("meanie-mongoose-to-json"));

async function connectDB() {
  try {
    await mongoose.connect(process.env["uri"], {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("connected to db successfully");
  } catch (e) {
    console.log(e);
    console.log("failed to connect to db");
  }
}

module.exports = { connectDB };

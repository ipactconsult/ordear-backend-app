let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: [true, "email required"],
    unique: [true, "email already registered"],
  },
  firstName: String,
  lastName: String,
  photo: String,
  password: String,
  source: { type: String, required: [false, "source not specified"] },
  lastVisited: { type: Date, default: new Date() }
});

var userModel = mongoose.model("user", userSchema, "user");

module.exports = userModel;

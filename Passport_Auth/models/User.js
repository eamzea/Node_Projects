const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    username: String,
    password: String,
    slackID: String,
    googleID: String,
    outlookID: String,
    role: {
      type: String,
      enum: ["GUEST", "ADMIN"],
      default: "GUEST"
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

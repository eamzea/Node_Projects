const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = Schema({
  name: String,
  desc: String,
  owner: { type: Schema.Types.ObjectId, ref: "User" }
});

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;

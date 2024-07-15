import mongoose from "mongoose";

const schema = new mongoose.Schema({
  discord_id: {
    type: String,
    required: false,
    unique: true,
  },
  displayname: {
    type: String,
  },
});

const Users = mongoose.model("users", schema);

export { Users };

const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  authCreatedAt: {
    type: Date,
    default: Date.now()
  },
},
  {
    versionKey: false,
  }
);


module.exports = mongoose.model("Auth", AuthSchema);

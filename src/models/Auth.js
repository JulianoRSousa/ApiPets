const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
  expired: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
}, {
  id: false,
  versionKey: false,
}
);


module.exports = mongoose.model("Auth", AuthSchema);

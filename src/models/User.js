const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    picture: String,
    pictures: String,
    email: String,
    username: String,
    pass: String,
    firstName: String,
    lastName: String,
    birthDate: String,
    location: String,
    foneNumber: String,
    latitude: String,
    longitude: String,
    dataVersion: Number,
    notification: [String],
    tags: [String],
    followingList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Follow",
      },
    ],
    followerList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Follow",
      },
    ],
    postList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    petList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.virtual("picture_url").get(function () {
  return process.env.PETS_URL + this.picture;
});

module.exports = mongoose.model("User", UserSchema);

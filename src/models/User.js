const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userId: String,
    userEmail: String,
    userUsername: String,
    userFullName: String,
    userBirthdate: String,
    userPicture: String,
    userPictureUrl: String,
    userPass: String,
    userTagsList: [String],
    userFollowingsList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Follow",
      },
    ],
    userFollowersList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Follow",
      },
    ],
    userPostsList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    userPetsList: [
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
  return process.env.PETS_URL + this.userPicture;
});

module.exports = mongoose.model("User", UserSchema);

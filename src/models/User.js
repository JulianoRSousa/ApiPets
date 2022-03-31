const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userEmail: String,
    userUsername: String,
    userFullname: String,
    userBirthdate: String,
    userPicture: String,
    userCreatedAt: {
      type: Date,
      default: Date.now
    },
    userPassword: {
      type: String,
      select: false
    },
    userGender: String,
    userDataVersion: Number,
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
    userPetsList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
      },
    ],
    userPostsList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      }
    ]

  },
  {
    id: false,
    toJSON: {
      virtuals: true,
      useProjection: true,
      transform: function (doc, ret) {
        ret.userDataVersion = ret.__v, delete ret.__v
      }
    },
  }
);


UserSchema.virtual("userPictureUrl").get(function () {
  return process.env.PETS_URL + this.userPicture;
})


module.exports = mongoose.model("User", UserSchema);

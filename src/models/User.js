const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: String,
    username: String,
    fullname: String,
    birthdate: String,
    picture: String,
    gender: String,
    dataVersion: Number,
    tagList: [String],
    pictureList: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    firstAccess: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      select: false
    },
    notificationList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
      }
    ],
    followingList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Follow",
      }
    ],
    followerList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Follow",
      }
    ],
    petList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
      }
    ],
    postList: [
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
        ret.dataVersion = ret.__v, delete ret.__v
      }
    },
  }
);


UserSchema.virtual("pictureUrl").get(function () {
  return process.env.PETS_URL + this.picture;
})


module.exports = mongoose.model("User", UserSchema);

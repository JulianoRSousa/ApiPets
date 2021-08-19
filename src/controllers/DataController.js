const Auth = require("../models/Auth");
const User = require("../models/User");
const Post = require("../models/Post");
const Pet = require("../models/Pet");
const Follow = require("../models/Follow");

module.exports = {
  async getData(req, res) {
    const { token } = req.headers;
    try {
      const authenticated = await Auth.findOne({ _id: token });
      if (authenticated) {
        const user = await User.findOne({ _id: authenticated.user });
        if (user) {
          const pets = await Pet.find({ user: user._id });
          const posts = await Post.find({ user: user._id });
          const following = await Follow.find({ following: user._id });
          const follower = await Follow.find({ follower: user._id });
          user.postList = posts;
          user.petList = pets;
          user.followingList = following;
          user.followerList = follower;
          user.pass.remove();
        }
        return res.status(201).json(user);
      } else {
        return res.status(401).json({ error: "Invalid Token for this user" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ Error: "Probably Invalid Token OR > " + error.message });
    }
  },

  // async confirmauth(req, res) {
  //   const { token } = req.headers;
  //   if (token == null || token == "") {
  //     return res.status(403).json({ Error: "Initial Mode" });
  //   } else {
  //     try {
  //       const authenticated = await Auth.findOne({ _id: token });
  //       if (authenticated) {
  //         await authenticated.populate("user").execPopulate();
  //         return res.status(200).json(authenticated);
  //       } else {
  //         return res.status(200).json({ Error: "Invalid Token" });
  //       }
  //     } catch (error) {
  //       return res.status(500).json({ Error: "Invalid Token Format" });
  //     }
  //   }
  // },

  // async isOn(req, res) {
  //   return res.status(200).json({ "Server Status": "Online" });
  // },

  // async showAllSessions(req, res) {
  //   if (process.env.ENVIRONMENT == "dev") {
  //     try {
  //       const auth = await Auth.find({ auth: true }).populate({ path: "user" });
  //       return res.json(auth);
  //     } catch (error) {
  //       console.log(error);
  //       return error;
  //     }
  //   }
  //   return res.status(403).json({ error: "No system admin logged" });
  // },

  // async deleteauth(req, res) {
  //   const { token } = req.headers;
  //   try {
  //     const auth = await Auth.deleteOne({ _id: token });
  //     if (auth.deletedCount) return res.status(201).json(auth);
  //     return res.status(401).json({ Error: "No auth for this token" });
  //   } catch (error) {
  //     return res.status(500).json({ "Internal Server Error": error.message });
  //   }
  // },

  // async deleteallauth(req, res) {
  //   if (process.env.ENVIRONMENT == "dev") {
  //     try {
  //       await Auth.deleteMany();
  //     } catch (error) {
  //       return res.status(500).json({ Error: "Error on delete" });
  //     }
  //     return res.json({ message: "Deleted" });
  //   }
  //   return res.status(403).json({ error: "No system admin logged" });
  // },
};

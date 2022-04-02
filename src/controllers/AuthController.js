const Auth = require("../models/Auth");
const User = require("../models/User");
const Post = require("../models/Post");
const Pet = require("../models/Pet");
const Follow = require("../models/Follow");

//index, show, store, update, destroy

module.exports = {
  async confirmauth(req, res) {
    const { token } = req.headers;
    if (token == null || token == "") {
      return res.status(403).json({ Error: "Initial Mode" });
    } else {
      try {
        const authenticated = await Auth.findOne({ _id: token });
        if (authenticated) {
          await authenticated.populate("user").execPopulate();
          return res.status(200).json(authenticated);
        } else {
          return res.status(401).json({ Error: "Invalid Token" });
        }
      } catch (error) {
        return res.status(500).json({ Error: "Invalid Token Format" });
      }
    }
  },

  async isOn(req, res) {
    return res.status(200).json({ ServerStatus: 'Online' });
  },

  async showAllSessions(req, res) {
    if (process.env.ENVIRONMENT == "dev") {
      try {
        const auth = await Auth.find().populate({ path: "user" });
        return res.status(200).json(auth);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ Error: error.message });
      }
    }
    return res.status(403).json({ error: "No system admin logged" });
  },

  async createauth(req, res) {
    const { email, password } = req.headers;
    try {
      const user = await User.findOne({ email, password }).populate({ path: "user" });
      if (user) {
        const pets = await Pet.find({ userTutor: user });
        const posts = await Post.find({ user });
        const following = await Follow.find({ following: user });
        const follower = await Follow.find({ follower: user });
        user.postList = posts;
        user.petList = pets;
        user.followingList = following;
        user.followerList = follower;
        await Auth.deleteMany({ user });
        const authenticated = await Auth.create({
          user,
        });
        return res.status(201).json(authenticated);
      } else {
        return res.status(401).json({ Error: "User not found" });
      }
    } catch (error) {
      return res.status(500).json({ Error: error.message });
    }
  },

  async loadUser(req, res) {
    const { token } = req.headers;
    try {
      const auth = await Auth.findOne({ _id: token });
      if (auth) {
        const user = await User.findOne({ _id: auth.user._id });
        if (user) {
          return res.status(201).json(auth);
        } else {
          return res
            .status(401)
            .json({ Error: "User not found" });
        }
      }
      return res.status(401).json({ Error: "Token not found" });
    } catch (error) {
      return res.status(500).json({ Error: error.message });
    }
  },

  async deleteauth(req, res) {
    const { token } = req.headers;
    try {
      const auth = await Auth.deleteOne({ _id: token });
      if (auth.deletedCount) {
        return res.status(201).json(auth)
      } else {
        return res.status(401).json({ Error: "No auth for this token" })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ Error: error.message });
    }
  },

  async deleteallauth(req, res) {
    if (process.env.ENVIRONMENT == "dev") {
      try {
        const DeletedAuth = await Auth.deleteMany();
        return res.json(DeletedAuth);
      } catch (error) {
        console.error(error)
        return res.status(500).json({ Error: error.message });
      }
    }
    return res.status(403).json({ Error: "You are not an Admin" });
  },
};

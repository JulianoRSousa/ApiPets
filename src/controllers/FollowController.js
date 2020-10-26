const Auth = require("../models/Auth");
const User = require("../models/User");
const Post = require("../models/Post");
const Pet = require("../models/Pet");
const Image = require("../models/Image");
const Follow = require("../models/Follow");
const PostController = require("./PostController");
const PetController = require("./PetController");

//index, show, store, update, destroy

module.exports = {

  async getFollowerByToken(req, res) {
    try {
      const token = req.headers;
      const auth = await Auth.findOne({ _id: token });
      if (auth) {
        const followers = await Follow.find({ follower: auth.user });
        return res.status(200).json(followers);
      }
      return res.status(401).json({ error: "Invalid Authentication" });
    } catch (error) {
      return res.status(500).json({ "Internal Server Error": error.message });
    }
  },

  async getFollowingByToken(req, res) {
    try {
      const token = req.headers;
      const auth = await Auth.findOne({ _id: token });
      if (auth) {
        const following = await Follow.find({ following: auth.user });
        return res.status(200).json(following);
      }
      return res.status(401).json({ error: "Invalid Authentication" });
    } catch (error) {
      return res.status(500).json({ "Internal Server Error": error.message });
    }
  },


  async getFollowingByUserId(req, res) {
    try {
      const { token, userId } = req.headers;
      const auth = await Auth.findOne({ _id: token });
      if (auth) {
        const following = await Follow.find({ following: userId });
        return res.status(200).json(following);
      }
      return res.status(401).json({ error: "Invalid Authentication" });
    } catch (error) {
      return res.status(500).json({ "Internal Server Error": error.message });
    }
  },

  async getFollowerByUserId(req, res) {
    try {
      const { token, userId } = req.headers;
      const auth = await Auth.findOne({ _id: token });
      if (auth) {
        const follower = await Follow.find({ follower: userId });
        return res.status(200).json(follower);
      }
      return res.status(401).json({ error: "Invalid Authentication" });
    } catch (error) {
      return res.status(500).json({ "Internal Server Error": error.message });
    }
  },


  async followFunction(req, res) {
    try {
      const { token, userId } = req.headers;
      const auth = await Auth.findOne({ _id: token });
      if (auth) {
        const follow = await Follow.findOne({follower: auth.user, following: userId})

        if(follow){
          const noFollow = await Follow.remove({follower: auth.user, following: userId})
          return res.status(200).json(noFollow)
        }else{
          const following = await Follow.create({follower: auth.user, following: userId,})
          return res.status(201).json(following)
        }
      } else {
        return res.status(401).json({ error: "Invalid Authentication" });
      }
    } catch (error) {
      return res.status(500).json({ "Internal Sever Error": error.message });
    }
  },

};

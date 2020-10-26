const Auth = require("../models/Auth");
const User = require("../models/User");
const Post = require("../models/Post");
const Pet = require("../models/Pet");
const Image = require("../models/Image");
const PostController = require("./PostController");
const PetController = require("./PetController");
const Follow = require("../models/follow");
const { auth } = require("googleapis/build/src/apis/abusiveexperiencereport");

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


  async stopFollowing(req, res) {
    try {
      const { token, userId } = req.headers;
      const auth = await Auth.findOne({ _id: token });
      if (auth) {
        try {
          do {
            0
            var countPet = await Pet.find({ user: auth.user });
            await PetController.UserDeleteAccount(token);
          } while (countPet.length > 0);
        } catch (error) {
          console.log(error.message);
        }
        try {
          do {
            var countPost = await Post.find({ user: auth.user });
            await PostController.UserDeleteAccount(token);
          } while (countPost.length > 0);
        } catch (error) {
          console.log(error.message);
        }

        const deleteUser = await User.deleteOne({ _id: auth.user });
        const deleteAuth = await Auth.deleteOne({ _id: auth._id });
        return res
          .status(201)
          .json({ UserDelete: deleteUser, AuthDelete: deleteAuth });
      } else {
        return res.status(401).json({ Error: "Invalid Token" });
      }
    } catch (error) {
      return res.status(500).json({ "Internal Sever Error": error.message });
    }
  },

  // async editBorn(req, res){
  //     let data = [];
  //    data[0] = token = req.headers;
  //    data[1]  = born = req.headers.born;

  //     //  console.log("tosource",valueOf(data[0]))
  //      if(valueOf(data[1])){
  //          console.log("nao veio")
  //      }else{
  //          console.log("veio")
  //      }

  //  console.log(valueOf(data[1]))
  //  console.log(valueOf(data[2]))
  //  function filterByID(obj) {
  //     if (Object.values(obj) == Object.values(error) ) {
  //         console.log("false")
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }
  //   var safeData = data.filter(filterByID)

  // console.log("safedata::>",safeData)

  // let edit = await Auth.findOne({ _id: token })

  //     if(edit.user == user){
  //         let result1 = await User.findOne({_id: user})
  //         let abc = await User.updateOne({_id: user},{ born: born})
  //         result1.save()
  //         return res.json(abc)
  //     }
  //     return res.json({'Error': 'Data do not match!'})
  // },

  async createLogin(req, res) {
    try {
      const username = req.headers.username.toLowerCase();
      const { pass, fullname, male } = req.headers;

      const getuser = await User.findOne({ username });
      if (!getuser) {
        const user = await User.create({
          username,
          pass,
          firstName: fullname.split(" ")[0],
          lastName: fullname.split(" ").slice(1).join(" "),
          male,
          profilePicture: "InitialProfile.png",
        });

        const auth = await Auth.create({
          user: user._id,
          auth: true,
        });

        await auth.populate("user").execPopulate();

        return res.status(201).json(auth);
      }
      return res
        .status(202)
        .json({ Error: "This username is already in use!" });
    } catch (error) {
      console.log(error.message);
    }
  },
};

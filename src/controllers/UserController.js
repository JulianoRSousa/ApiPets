const Auth = require("../models/Auth");
const User = require("../models/User");
const Post = require("../models/Post");
const Pet = require("../models/Pet");
const Image = require("../models/Image");
const PostController = require("../controllers/PostController");
const PetController = require("../controllers/PetController");

//index, show, store, update, destroy

module.exports = {
  async commandList(req, res) {
    return res.status(200).json({
      "/": "This Page",
      "           /setprofile": "",
      "           /createLogin": "",
      "           /getuserbyusername": "",
      "           /showallusers": "",
      "           /getuserbyid": "",
      "           /deleteuserbyid": "",
    });
  },

  async getUserByUsername(req, res) {
    try {
      const username = req.headers.username.toLowerCase();
      const user = await User.find({ username: username });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ "Internal Server Error": error.message });
    }
  },

  async showallusers(req, res) {
    if (process.env.ENVIRONMENT == "dev") {
      try {
        const users = await User.find();
        return res.status(200).json(users);
      } catch (error) {
        return res.status(500).json({ "Internal Sever Error": error.message });
      }
    }
    return res.status(401).json({ error: "No system admin logged" });
  },

  async getUserById(req, res) {
    try {
      const { user_id } = req.headers;
      const user = await User.find({ _id: user_id });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  },

  async loadUser(req, res) {
    try {
      const { token } = req.headers;
      const auth = await Auth.findOne({ _id: token });

      if (auth) {
        const user = await User.findOne({ _id: auth.user });
        user.pass = null
        return res.status(200).json(user);
      } else {
        return res.status(401).json({ error: "Invalid Token" });
      }
    } catch (error) {
      return res.status(500).json({ Error: error.message });
    }
  },

  async setProfilePicture(req, res) {
    if (req.file) {
      try {
        const { originalname: name, size, key, location: url = "" } = req.file;
        const { token } = req.headers;
        const auth = await Auth.findOne({ _id: token });
        if (auth) {
          try {
            const image = await Image.create({
              name,
              size,
              key,
              url,
            });

            const user = await User.findOne({ _id: auth.user });
            user.profilePicture = image.key;
            await user.save();
            return res.json(user);
          } catch (error) {
            return res
              .status(500)
              .json({ "Internal Sever Error": error.message });
          }
        }
        return res.status(401).json({ Error: "Invalid Token" });
      } catch (error) {
        return res.status(500).json({ "Internal Server Error": error.message });
      }
    }
    return res.status(415).json({ Error: "Invalid Picture" });
  },

  async deleteUserById(req, res) {
    try {
      const { token } = req.headers;
      const auth = await Auth.findOne({ _id: token });
      if (auth) {
        try {
          do {
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
        return res.status(401).json({ error: "Invalid Token" });
      }
    } catch (error) {
      return res.status(500).json({ "Internal Sever Error": error.message });
    }
  },

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
      return res.status(500).json({ "Internal Server Error": error.message });
    }
  },
};

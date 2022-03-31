const Auth = require("../models/Auth");
const User = require("../models/User");
const Post = require("../models/Post");
const Pet = require("../models/Pet");
const Image = require("../models/Image");
const Follow = require("../models/Follow");
const PostController = require("../controllers/PostController");
const PetController = require("../controllers/PetController");
const { json } = require("body-parser");

//index, show, store, update, destroy

module.exports = {

  async getUserByUsername(req, res) {
    try {
      const username = req.headers.username.toLowerCase();
      const user = await User.findOne({ userUsername: username });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ "Internal Server Error": error.message });
    }
  },
  async getUserByEmail(req, res) {
    try {
      const email = req.headers.email.toLowerCase();
      const user = await User.findOne({ userEmail: email });
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
      const user = await User.findOne({ _id: user_id });
      if (user) {
        const pets = await Pet.find({ petUserTutor: user._id });
        const posts = await Post.find({ postUser: user._id });
        const following = await Follow.find({ following: user._id });
        const follower = await Follow.find({ follower: user._id });
        user.userPostsList = posts;
        user.userPetsList = pets;
        user.userFollowingsList = following;
        user.userFollowersList = follower;
        return res.status(200).json(user);
      } else {
        return res.status(401).json({ error: "Invalid user" });
      }
    } catch (error) {
      return res.status(500).json({ Error: error.message });
    }
  },

  async loadUser(req, res) {
    try {
      const { token } = req.headers;
      const auth = await Auth.findOne({ _id: token });

      if (auth) {
        const user = await User.findOne({ _id: auth.user });
        const pets = await Pet.find({ user: user._id });
        const posts = await Post.find({ user: user._id });
        user.postsCount = posts.length;
        user.petsCount = pets.length;
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
            user.picture = image.key;
            await user.save();
            return res.json(user);
          } catch (error) {
            return res
              .status(500)
              .json({ "Internal Server Error": error.message });
          }
        }
        return res.status(401).json({ Error: "Invalid Token" });
      } catch (error) {
        return res.status(500).json({ "Internal Server Error": error.message });
      }
    }
    return res.status(415).json({ Error: "Invalid Picture" });
  },

  async deleteUserByUserId(req, res) {
    if (process.env.ENVIRONMENT == "dev") {
      try {
        const { user_id } = req.headers;
        const userToDelete = await User.deleteOne({ _id: user_id })
        if (userToDelete.deletedCount > 0) {
          return res
            .status(201)
            .json({ User: user_id, Deleted: true, userToDelete })
        }
        else {
          return res.status(401).json({ error: "User not Found" })
        }
      } catch (error) {
        return res.status(500).json({ "Internal Sever Error": error.message });
      }
    } else {
      return res.status(401).json("You need an admin to do that");
    }
  },


  async deleteUserByToken(req, res) {
    try {
      const { token } = req.headers;
      const auth = await Auth.findOne({ _id: token })
      if (auth) {
        try {
          do {
            var countPet = await Pet.find({ petUserTutor: auth.user._id });
            await PetController.UserDeleteAccount(token);
          } while (countPet.length > 0);
        } catch (error) {
          console.log(error.message);
        }
        try {
          do {
            var countPost = await Post.find({ postUser: auth.user._id });
            await PostController.UserDeleteAccount(token);
          } while (countPost.length > 0);
        } catch (error) {
          console.log(error.message);
        }

        const deleteUser = await User.deleteOne({ _id: auth.user._id });
        const deleteAuth = await Auth.deleteOne({ _id: token });
        return res
          .status(201)
          .json({ deleteUser, deleteAuth });
      } else {
        return res.status(401).json({ error: "Invalid Token" });
      }
    } catch (error) {
      return res.status(500).json({ "Internal Sever Error": error.message });
    }
  },

  async createUser(req, res) {
    try {
      const email = req.headers.email.toLowerCase();
      const { password, fullname, birthdate, latitude, longitude, cityCode, gender } = req.headers;
      let username = email.split("@")[0];
      let validUsername = await User.findOne({ userUsername: username });
      let validEmail = await User.findOne({ userEmail: email });

      if (!validEmail) {
        if (validUsername) {
          for (i = 1; validUsername; i++) {
            let newUser = username + i;
            validUsername = await User.findOne({ userUsername: newUser });
            if (!validUsername) {
              username = newUser;
            }
          }
        }
      } else {
        return res.status(401).json("The email: " + email.toUpperCase() + " is already being used");
      }

      const taggable = (username + " " + fullname).split(" ").join(".");
      const userTagsList = taggable.toUpperCase().split(".");
      const upperName = username.toUpperCase();
      userTagsList.push(upperName);

      const user = await User.create({
        userEmail: email,
        userUsername: username,
        userTagsList,
        userPassword: password,
        userNotificationsList: [],
        userFullname: fullname,
        userBirthdate: birthdate ?? '',
        userGender: gender ?? '',
        userLocation: {
          latitude: latitude ?? '',
          longitude: longitude ?? '',
          cityCode: cityCode ?? ''
        },
        userPicture: "InitialProfile.png",
      });
      return res.status(201).json(user);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ "Internal Server Error": error.message });
    }
  },
};

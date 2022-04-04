const Post = require("../models/Post");
const Auth = require("../models/Auth");
const Image = require("../models/Image");
const User = require("../models/User");
const Pet = require("../models/Pet");

module.exports = {
  async getPostByStatus(req, res) {
    try {
      const { status } = req.headers;
      const post = await Post.find({ status }).sort({ _id: -1 });
      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ Error: error.message });
    }
  },

  async getPostByToken(req, res) {
    try {
      const { token } = req.headers;
      const auth = await Auth.findOne({ _id: token });
      if (auth) {
        const posts = await Post.find({ user: auth.user })
          .sort({ _id: -1 })
          .populate({ path: "user" })
          .populate({ path: "pet" });
        return res.status(200).json(posts);
      }
      return res.status(401).json({ error: "Invalid Token" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async showAllPosts(req, res) {
    if (process.env.ENVIRONMENT != "dev") {
      return res.status(401).json({ error: "No system admin logged" });
    } else {
      try {
        const posts = await Post.find().sort({ _id: -1 });
        return res.status(200).json(posts);
      } catch (error) {
        return res.status(500).json({ Error: error.message });
      }
    }
  },
  async getMainFeed(req, res) {
    try {
      const posts = await Post.find()
        .sort({ _id: -1 })
        .populate({ path: "user" })
        .populate({ path: "pet" });

      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getFeed(req, res) {
    try {
      const { token } = req.headers;
      const auth = Auth.findOne({ _id: token });
      if (auth) {
        const posts = await Post.find()
          .sort({ _id: -1 })
          .populate({ path: "user" })
          .populate({ path: "pet" });

        return res.status(200).json(posts);
      }
      return res.status(403).json({ Error: "Invalid Token" });
    } catch (error) {
      return res.status(500).json({ Error: error.message });
    }
  },

  async getPage(req, res) {
    try {
      const { token, page } = req.headers;
      const auth = Auth.findOne({ _id: token });
      const limitPerPage = 5;
      var viewdItems = page * limitPerPage;
      if (auth) {
        if (page == 0) {
          const pages = Math.ceil(
            (await Post.find().estimatedDocumentCount()) / limitPerPage
          );
          res.header("pages", [pages]);
        }
        const posts = await Post.find()
          .sort({ _id: -1 })
          .skip(viewdItems)
          .limit(5)
          .populate({ path: "user" })
          .populate({ path: "pet" });
        return res.status(200).json(posts);
      }
      return res.status(403).json({ Error: "Invalid Token" });
    } catch (error) {
      return res.status(500).json({ Error: error.message });
    }
  },

  async createPost(req, res) {
    if (req.file) {
      const { originalname: name, size, key, location: url = "" } = req.file;
      const { status, description } = req.body;
      const { pet_id, token } = req.headers;

      const authResult = await Auth.findOne({ _id: token }).populate({ path: "user" })
      const petResult = await Pet.findOne({ _id: pet_id })
      try {
        if (authResult && petResult) {
          try {
            const image = await Image.create({
              name,
              size,
              key,
              url,
              user: authResult.user,
            });

            const post = await Post.create({
              picture: image.key,
              pictureList: [image.key],
              status,
              description,
              user: authResult.user,
              pet: petResult,
            });
            const userInfo = await User.findOne({ _id: authResult.user._id })
            const postList = await Post.find({ user: authResult.user._id })
            userInfo.postList = postList;
            userInfo.save();
            return res.status(201).json(post);
          } catch (error) {
            return res
              .status(500)
              .json({ Error: error.message });
          }
        } else {
          return res.status(401).json({ Error: "Invalid Token" });
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    } else {
      const { status, description } = req.body;
      const { pet_id, token } = req.headers;
      const authResult = await Auth.findOne({ _id: token }).populate({ path: "user" });
      const petResult = await Pet.findOne({ _id: pet_id })

      try {
        if (authResult && petResult) {
          try {
            const post = await Post.create({
              picture: "NoPicturePost.jpg",
              pictureList: ["NoPicturePost.jpg"],
              status,
              description,
              user: authResult.user,
              pet: petResult,
            });
            return res.status(201).json(post);
          } catch (error) {
            return res
              .status(500)
              .json({ Error: error.message });
          }
        } else {
          return res.status(401).json({ Error: "Invalid Token" });
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  },

  async deletePostDevMode(req, res) {
    if (process.env.ENVIRONMENT == "dev") {
      try {
        var { post_id } = req.headers;
        const postResult = await Post.findOne({ _id: post_id })
        if (postResult) {
          if (postResult?.picture == 'NoPicturePost.jpg') {
            const deletedPost = await postResult.remove()
            return res.status(200).json({ PostDeleted: deletedPost });
          } else {
            const deletedPost = await postResult.remove()
            const imageResult = await Image.findOne({ key: postResult.picture })
            const deletedImage = await imageResult.remove();
            return res.status(200).json({ PostDeleted: deletedPost, ImageDeleted: deletedImage });
          }
        } else {
          return res.status(403).json({ Error: 'Post not found' });
        }
      } catch (error) {
        return res.status(500).json({ Error: error.message });
      }
    } else {
      console.log(process.env.ENVIRONMENT)
      return res.status(500).json({ Error: 'You are not a dev' });
    }
  },



  async deletePost(req, res) {
    try {
      var { post_id, token } = req.headers;
      const auth = await Auth.findOne({ _id: token });
      if (auth) {
        const postData = await Post.findOne({ _id: post_id, user: auth.user._id });
        if (postData) {
          const image = await Image.findOne({
            key: postData.picture,
          });
          if (image) {
            try {
              await image.remove();
              await postData.remove();
            } catch (error) {
              return res
                .status(500)
                .json({ Error: error.message });
            }
          } else {
            try {
              await postData.remove();
            } catch (error) {
              return res
                .status(500)
                .json({ Error: error.message });
            }
          }
        } else {
          return res.status(403).json({ Error: "Invalid Post" });
        }
      } else {
        return res.status(403).json({ Error: "Invalid Token" });
      }
    } catch (error) {
      return res.status(500).json({ Error: error.message });
    }
  },

  async deleteAllPostsBySessionToken(req, res) {

    try {
      var { token } = req.headers;
      const authResult = await Auth.findOne({ _id: token })
      console.log(authResult)
      const postResult = await Post.deleteMany({ user: authResult.user })
      return res.status(200).json({ authResult: authResult, postResult: postResult });
    } catch (error) {
      return res.status(500).json({ "Internal Server Error": error.message });
    }
  },

  async UserDeleteAccount(token) {
    try {
      const auth = await Auth.findOne({ _id: token });
      if (auth) {
        const postData = await Post.findOne({ user: auth.user });
        if (postData) {
          const image = await Image.findOne({
            key: postData.picture,
          });
          if (image) {
            try {
              await image.remove();
              await postData.remove();
            } catch (error) {
              return 0;
            }
          } else {
            try {
              await postData.remove();
            } catch (error) {
              return res
                .status(500)
                .json({ Error: error.message });
            }
          }
        } else {
          return 0;
        }
      } else {
        return res.status(403).json({ Error: "Invalid Token" });
      }
    } catch (error) {
      return res.status(500).json({ Error: error.message });
    }
  },
};

const Post = require("../models/Post");
const Auth = require("../models/Auth");
const Image = require("../models/Image");
const User = require("../models/User");

module.exports = {
  async getPostByState(req, res) {
    try {
      const { state } = req.headers;
      const post = await Post.find({ state: state }).sort({ _id: -1 });
      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ error: error.message });
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
      return status(403).json({ error: "Invalid Token" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async showAllPosts(req, res) {
    if (process.env.ENVIRONMENT != "dev") {
      return res.status(403).json({ error: "No system admin logged" });
    } else {
      try {
        const posts = await Post.find().sort({ _id: -1 });
        return res.status(200).json(posts);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
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
      return status(403).json({ error: "Invalid Token" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getPage(req, res) {
    try {
      const { token, page } = req.headers;
      const auth = Auth.findOne({ _id: token });
      const limitPerPage = 5;
      var viewdItems = page * limitPerPage;
      if (auth) {
        if(page==0){
          const pages = Math.ceil(await Post.find().estimatedDocumentCount()/limitPerPage)
          res.header('pages', [pages])
        }
        const posts = await Post.find()
          .sort({ _id: -1 })
          .skip(viewdItems)
          .limit(5)
          .populate({ path: "user" })
          .populate({ path: "pet" });
        return res.status(200).json(posts);
      }
      return status(403).json({ error: "Invalid Token" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async createPost(req, res) {
    if (req.file) {
      const { originalname: name, size, key, location: url = "" } = req.file;
      const { state, description } = req.body;
      const { pet_id, token } = req.headers;

      const auth = await Auth.findOne({ _id: token });

      try {
        if (auth) {
          try {
            const image = await Image.create({
              name,
              size,
              key,
              url,
              user: auth.user,
            });

            var date = new Date();

            const post = await Post.create({
              picture: image.key,
              state,
              description,
              postDate:
                date.getDate() +
                "/" +
                (date.getMonth() + 1) +
                "/" +
                date.getFullYear(),
              postTime: date.getHours() + ":" + date.getMinutes(),
              user: auth.user,
              pet: pet_id,
            });
            return res.json(post);
          } catch (error) {
            return res
              .status(500)
              .json({ "Server Internal Error": error.message });
          }
        } else {
          return res.status(403).json({ Error: "Invalid Token" });
        }
      } catch (error) {
        console.log("error.message = ", error.message);
      }
    } else {
      const { state, description } = req.body;
      const { pet_id, token } = req.headers;

      const auth = await Auth.findOne({ _id: token });

      try {
        if (auth) {
          try {
            var date = new Date();
            const post = await Post.create({
              picture: "NoPicturePost.jpg",
              state,
              description,
              postDate:
                date.getDate() +
                "/" +
                (date.getMonth() + 1) +
                "/" +
                date.getFullYear(),
              postTime: date.getHours() + ":" + date.getMinutes(),
              user: auth.user,
              pet: pet_id,
            });
            return res.json(post);
          } catch (error) {
            return res
              .status(500)
              .json({ "Server Internal Error": error.message });
          }
        } else {
          return res.status(403).json({ Error: "Invalid Token" });
        }
      } catch (error) {
        console.log("error.message = ", error.message);
      }
    }
  },

  async deletePost(req, res) {
    try {
      var { post, token } = req.headers;
      const auth = await Auth.findOne({ _id: token });
      if (auth) {
        const postData = await Post.findOne({ _id: post, user: auth.user });
        if (postData) {
          const image = await Image.findOne({
            key: postData.picture_url.replace(process.env.PETS_URL, ""),
          });
          if (image) {
            try {
              await image.remove();
              await postData.remove();
            } catch (error) {
              return res
                .status(500)
                .json({ "Internal Server Error": error.message });
            }
          } else {
            try {
              await postData.remove();
            } catch (error) {
              return res
                .status(500)
                .json({ "Internal Server Error": error.message });
            }
          }
        } else {
          return res.status(403).json({ error: "Invalid Post" });
        }
      } else {
        console.log("token" + token);
        return res.status(403).json({ error: "Invalid Token" });
      }
    } catch (error) {
      return res.status(500).json({ "Internal Server Error": error.message });
    }
  },

  async UserDeletePosts(req, res) {
    try {
      var { token } = req.headers;
      const auth = await Auth.findOne({ _id: token });
      if (auth) {
        const postData = await Post.findOne({ user: auth.user });
        if (postData) {
          const image = await Image.findOne({
            key: postData.picture_url.replace(process.env.PETS_URL, ""),
          });
          if (image) {
            try {
              await image.remove();
              await postData.remove();
            } catch (error) {
              return res
                .status(500)
                .json({ "Internal Server Error": error.message });
            }
          } else {
            try {
              await postData.remove();
            } catch (error) {
              return res
                .status(500)
                .json({ "Internal Server Error": error.message });
            }
          }
          return res.status(201).json({ "Internal Server Message": postData });
        } else {
          return res.status(403).json({ error: "Invalid Post" });
        }
      } else {
        return res.status(403).json({ error: "Invalid Token" });
      }
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
            key: postData.picture_url.replace(process.env.PETS_URL, ""),
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
                .json({ "Internal Server Error": error.message });
            }
          }
        } else {
          return 0;
        }
      } else {
        return res.status(403).json({ error: "Invalid Token" });
      }
    } catch (error) {
      return res.status(500).json({ "Internal Server Error": error.message });
    }
  },
};

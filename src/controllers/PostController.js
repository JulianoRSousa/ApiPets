const Post = require('../models/Post');
const Auth = require('../models/Auth');
const Image = require('../models/Image');
var aws = require('ibm-cos-sdk');



module.exports = {

    async getPostByState(req, res) {
        const { state } = req.headers;
        try {
            const post = await Post.find({ state: state });
            return res.status(200).json(post);
        } catch (error) {
            return res.status(500).json({ 'Error': 'Cant Find PostState' });
        }
    },

    async getPostByUserId(req, res) {
        const { user_id } = req.headers;
        try {
            const post = await Post.find({ user: user_id });
            return res.status(200).json(post);
        } catch (error) {
            return res.status(500).json({ 'Error': 'Invalid User Format' });
        }
    },

    async showAllPosts(req, res) {
        if (process.env.ENVIRONMENT == "dev") {
            try {
                const posts = await Post.find()
                return res.status(200).json(posts)
            } catch (error) {
                return res.status(500).json({ 'Error': 'Cant find posts' });
            }
        }
        return res.status(403).json({ "error": "No system admin logged" });
    },

    async createPost(req, res) {
        if (req.file) {
            const { originalname: name, size, key, location: url = "" } = req.file;
            const { state, description } = req.body;
            const { pet_id, token } = req.headers;

            const auth = await Auth.findOne({ _id: token })

            try {
                if (auth) {
                    try {
                        const image = await Image.create({
                            name,
                            size,
                            key,
                            url,
                            user: auth.user
                        });

                        var date = new Date();

                        const post = await Post.create({
                            picture: image.key,
                            state,
                            description,
                            postDate: date.getDate() + '/' +
                                (date.getMonth() + 1) + '/' +
                                date.getFullYear(),
                            postTime: date.getHours() + ':' +
                                date.getMinutes(),
                            user: auth.user,
                            pet: pet_id,
                        })
                        return res.json(post);

                    } catch (error) {
                        return res.status(500).json({ "Server Internal Error": error.message  })
                    }
                } else {
                    return res.status(403).json({ "Error": "Invalid Token" })
                }
            } catch (error) {
                console.log("error.message = ", error.message,)
            }
        } else {
            const { state, description } = req.body;
            const { pet_id, token } = req.headers;

            const auth = await Auth.findOne({ _id: token })

            try {
                if (auth) {
                    try {
                        var date = new Date();
                        const post = await Post.create({
                            picture: "NoPicturePost.jpg",
                            state,
                            description,
                            postDate: date.getDate() + '/' +
                                (date.getMonth() + 1) + '/' +
                                date.getFullYear(),
                            postTime: date.getHours() + ':' +
                                date.getMinutes(),
                            user: auth.user,
                            pet: pet_id,
                        })
                        return res.json(post);

                    } catch (error) {
                        return res.status(500).json({ "Server Internal Error": error.message })
                    }
                } else {
                    return res.status(403).json({ "Error": "Invalid Token" })
                }
            } catch (error) {
                console.log("error.message = ", error.message,)
            }
        }
    },




    async deleteImage(req, res) {
        try {
            if (process.env.ENVIRONMENT == 'dev') {
                const { key } = req.headers;
                const image = await Image.findOne({ key: key })
                await image.remove();
                return res.status(201).json({ "Image Removed - Key": key });
            } else {
                return res.status(401).json({ "Error": "No system admin logged" })
            }
        } catch (error) {
            return res.status(500).json({ "Internal Server Error": error.message })
        }

    },


    async deletePost(req, res) {
        try {
            var { post, token } = req.header;
            const auth = await Auth.findOne({ _id: token });
            if (auth) {
                const postData = await Post.findOne({ _id: post, user: auth.user });
                if (postData) {
                    const image = await Image.findOne({ key: (postData.picture_url.replace(process.env.PETS_URL, "")) })
                    if (image) {
                        try {
                            await image.remove();
                            await postData.remove();
                        } catch (error) {
                            return res.status(500).json({ "Internal Server Error": error.message });
                        }
                    } else {
                        try {
                            await postData.remove();
                        } catch (error) {
                            return res.status(500).json({ "Internal Server Error": error.message });
                        }
                    }
                } else {
                    return res.status(403).json({ "error": "Invalid Post" })
                }
            } else {
                return res.status(403).json({ "error": "Invalid Token" })
            }
        } catch (error) {
            return res.status(500).json({ 'Internal Server Error': error.message });
        }
    }
};

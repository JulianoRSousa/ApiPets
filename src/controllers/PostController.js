const Post = require('../models/Post');
const Auth = require('../models/Auth');

module.exports = {

    async getPostByStatus(req, res) {
        const { status } = req.query;

        const post = await Post.find({ status: status });

        return res.json(post);
    },

    async getPostByUser(req, res) {
        const { user } = req.query;

        const post = await Post.find({ user: user });

        return res.json(post);
    },

    async getAllPosts(req, res) {
        const posts = await Post.find({})
        return res.json(posts)
    },
    
    async store(req, res) {
        const { status, description } = req.body;
        const { user_id, pet_id, token } = req.headers;

        const auth = await Auth.findOne({ _id: token })

        try {
            if (req.file) {
                if (auth) {
                    try {
                        var date = new Date();
                        const post = await Post.create({
                            picture: "petProfile.png",
                            status,
                            description,
                            postDate: date.getDate() + '/' +
                                (date.getMonth() + 1) + '/' +
                                date.getFullYear(),
                            postTime: date.getHours() + ':' +
                                date.getMinutes(),
                            user: user_id,
                            pet: pet_id,
                        })
                        return res.json(post);

                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        } catch (error) {
            console.log("error.message = ",error.message,)
        }
    }

};

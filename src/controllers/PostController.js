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
        // const { filename } = req.file;
        const { status, description } = req.body;
        const { user_id, pet_id, token } = req.headers;
        
        const auth = await Auth.findOne({ _id: token })
        if (auth.length !== 0) {
            console.log(token,"<<<<< - token");
            console.log('entrou no if')
        }else{
            console.log(token,"<<<<< - token");
            console.log('Não entrou no if')
        }
            var date = new Date();
            console.log("date time is = ",date.getDate(),';',
            (date.getMonth() + 1),';',
            date.getFullYear(),' ',
            date.getHours(),';',
            date.getMinutes())
            const post = await Post.create({
                picture: "InitialProfile.png",
                status,
                description,
                postDate: date.getDate() + '/' +
                    (date.getMonth() + 1) + '/' +
                    date.getFullYear() + ' ' +
                    date.getHours() + ':' +
                    date.getMinutes(),
                user: user_id,
                pet: pet_id,
            })
            
            return res.json(post);
        // }

        // return res.json();
    }
};
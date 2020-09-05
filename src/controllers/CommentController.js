const Comment = require('../models/Comment');

module.exports = {


    async getCommentByPostId(req, res) {
        const { post_id } = req.headers;

        const comments = await Comment.find({ post_id: post_id});

        return res.json(comments);
    },
    
    async showAllComments(req, res) {

        const comments = await Comment.find();

        return res.json(comments);
    },


    async store(req, res) {
        const { message, registerDate, commenter, post_id } = req.headers;
        
        const comment = await Comment.create({
            commenter: commenter,
            post_id: post_id,
            message: message,
            registerDate: registerDate,
        })

        return res.json(comment);
    },


    async deletecomment(req, res){
        const { comment_id } = req.headers;

            const comment = await Comment.deleteOne({
                _id: comment_id
            });
        return res.json(comment);
    }
};
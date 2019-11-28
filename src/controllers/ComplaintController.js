const Complaint = require('../models/Complaint');

module.exports = {

    async getComplaintByPostId(req, res) {
        const { post_id } = req.query;

        const complaint = await Complaint.find({ post_id: post_id.toLowerCase()});

        return res.json(complaint);
    },

    async store(req, res) {
        const { 
            message,
            registerDate,
            reason,
        } = req.body;
        const { caller_id, post_id } = req.headers;

        
        const complaint = await Complaint.create({
            message: message,
            registerDate: registerDate,
            reason: reason,
            post_id: post_id,
            caller_id: caller_id,
        })

        return res.json(complaint);
    }
};
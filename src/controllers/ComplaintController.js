const Complaint = require('../models/Complaint');
const Auth = require('../models/Auth');

module.exports = {

    async getComplaintByPostId(req, res) {
        const { post_id } = req.headers;
        if (process.env.ENVIRONMENT == 'dev') {
            try {
                const complaint = await Complaint.find({ post_id });
                if (complaint.length != 0) {
                    return res.status(202).json(complaint);
                }
                return res.status(202).json(complaint);
            } catch (error) {
                return res.status(404).json({ 'Error': 'Invalid PostID' });
            }
        }
        return res.status(403).json({ "error": "No system admin logged" });
    },

    async showAllComplaint(req, res) {
        if (process.env.ENVIRONMENT == 'dev') {
            const complaint = await Complaint.find({}).populate('post_id').exec();
            return res.status(202).json(complaint);
        }
        return res.status(403).json({ "error": "No system admin logged" });
    },

    async createComplaint(req, res) {
        try {
            const {
                message,
                reason,
                post_id, token } = req.headers;
    
            var date = new Date();
            const authenticated = await Auth.findOne({ _id: token })
            if (authenticated.auth) {
                const complaint = await Complaint.create({
                    message: message,
                    registerDate: date.getHours() + ':' + date.getMinutes() + " - " +
                        date.getDate() + '/' +
                        (date.getMonth() + 1) + '/' +
                        date.getFullYear(),
                    reason: reason,
                    post_id: post_id,
                    caller_id: authenticated.user,
                })
                return res.status(201).json(complaint);
            }
            return res.status(401).json({ 'Error': 'Invalid Token' });
        } catch (error) {
            return res.status(401).json({ 'Error': 'Invalid Token Format' });
        }
    }
};
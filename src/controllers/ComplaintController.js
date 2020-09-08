const Complaint = require('../models/Complaint');
const { populate } = require('../models/Complaint');

module.exports = {

    async getComplaintByPostId(req, res) {
        const { post_id } = req.query;

        const complaint = await Complaint.find({ post_id });

        return res.json(complaint);
    },

    async showAllComplaint(req, res) {
        const { masterUser, masterPass } = req.headers;
        if(masterUser == process.env.MASTERUSER && masterPass == process.env.MASTERPASS){
            const complaint = await Complaint.find({ });
            await complaint.populate('post_id').execPopulate();
            
            return  res.status(202).json(complaint);
        }

        return res.json({"error":"No system admin logged"});
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
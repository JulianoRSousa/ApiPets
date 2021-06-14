const mongoose =  require('mongoose');

const AuthSchema = new mongoose.Schema({
     user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
     },
     createdAt: Date,
    auth: Boolean
});

module.exports = mongoose.model('Auth', AuthSchema);
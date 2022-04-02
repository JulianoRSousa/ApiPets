const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    title: String,
    message: String,
    type: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    userList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
});

module.exports = mongoose.model('Notification', NotificationSchema);
const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    profilePicture: String,
    pictures: String,
    firstName: String,
    lastName: String,
    color: String,
    coatSize: String,
    size: String,
    birthdate: String,
    male: Boolean,
    state: String,
    breed: String,
    type: String,
    registerDate: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    toJSON: {
        virtuals: true,
    },
});

PetSchema.virtual('picture_url').get(function () {
    return process.env.PETS_URL + this.profilePicture;
})

module.exports = mongoose.model('Pet', PetSchema);
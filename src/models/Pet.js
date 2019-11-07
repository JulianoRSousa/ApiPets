const mongoose =  require('mongoose');

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
    status: String,
    breed: String,
    type: String,
    registerDate: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Pet', PetSchema);
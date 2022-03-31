const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    petPicture: String,
    petType: String,
    petFullName: String,
    petColor: String,
    petCoat: String,
    petBirthdate: String,
    petIsMale: String,
    petPictureUrl: String,
    petSize: String,
    petState: String,
    petBreed: String,
    createAt: Date,
    petPictures: [
        String
    ],
    petUserTutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    toJSON: {
        virtuals: true,
    },
});

PetSchema.virtual('picture_url').get(function () {
    return process.env.PETS_URL + this.petPicture;
})

module.exports = mongoose.model('Pet', PetSchema);
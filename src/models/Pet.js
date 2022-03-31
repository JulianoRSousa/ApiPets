const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    petId: String,
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
    petCreatedAt: {
        type: Date,
        default: Date.now
    },
    petDataVersion: Number,
    petPictures: [
        String
    ],
    petUserTutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    toJSON: {
        virtuals: false,
        versionKey: true,
        useProjection: true,
        transform: function (doc, ret) {
            ret.petId = ret._id, delete ret._id,
                ret.petDataVersion = ret.__v, delete ret.__v
        }
    },
});

PetSchema.virtual('picture_url').get(function () {
    return process.env.PETS_URL + this.petPicture;
})

module.exports = mongoose.model('Pet', PetSchema);
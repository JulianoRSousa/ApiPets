const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    petId: String,
    petPicture: {
        type: String,
        default: "InitialPetProfile.jpg"
    },
    petType: {
        type: String,
        default: 'dog'
    },
    petFullname: String,
    petColor: String,
    petCoat: String,
    petBirthdate: String,
    petIsMale: String,
    petSize: String,
    petBreed: String,
    petDataVersion: Number,
    petStatus: {
        type: String,
        default: '0',
    },
    petCreatedAt: {
        type: Date,
        default: Date.now
    },
    petPictureList: [{
        type: String,
        default: "InitialPetProfile.jpg"
    }],
    petUserTutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    toJSON: {
        virtuals: true,
        versionKey: true,
        useProjection: true,
        transform: function (doc, ret) {
            ret.petId = ret._id,
                ret.petDataVersion = ret.__v, delete ret.__v
        }
    },
});

PetSchema.virtual('petPictureUrl').get(function () {
    return process.env.PETS_URL + this.petPicture;
})

module.exports = mongoose.model('Pet', PetSchema);
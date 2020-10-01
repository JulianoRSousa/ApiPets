const Pet = require('../models/Pet');
const Auth = require('../models/Auth');
const Image = require('../models/Image');

module.exports = {

    async getPetByUserId(req, res) {
        const { user_id } = req.headers;

        try {
            const pets = await Pet.find({ user: user_id });
            return res.status(200).json(pets);
        } catch (error) {
            return res.status(500).json({ "Error": "Invalid User Format" });
        }
    },

    async showallpets(req, res) {
        if (process.env.ENVIRONMENT == 'dev') {
            try {
                const pets = await Pet.find();
                return res.status(200).json(pets);
            } catch (error) {
                return res.status(403).json({ 'Error': 'Cant Find Pets' });
            }
        }
        return res.status(403).json({ "Error": "No system admin logged" });
    },




    async createPet(req, res) {
        try {
            if (req.file) {
                const { originalname: name, size, key, location: url = "" } = req.file;
                const {
                    firstName,
                    lastName,
                    color,
                    coatSize,
                    birthdate,
                    male,
                } = req.body;
                const { token } = req.headers;

                try {
                    const auth = await Auth.findOne({ _id: token });
                    if (auth) {
                        const image = await Image.create({
                            name,
                            size,
                            key,
                            url
                        });
                        const pet = await Pet.create({
                            profilePicture: image.key,
                            pictures: "",
                            status: "Neutral",
                            firstName: firstName,
                            lastName: lastName,
                            color: color,
                            coatSize: coatSize,
                            birthdate: birthdate,
                            male: male,
                            user: auth.user,
                        })
                        return res.status(201).json(pet);
                    } else {
                        return res.status(401).json({ 'Error': 'Invalid Token' });
                    }
                } catch (error) {
                    return res.status(500).json({ 'Error': 'Invalid Token Format' });
                }
            } else {
                try {
                    const {
                        firstName,
                        lastName,
                        color,
                        coatSize,
                        birthdate,
                        male,
                    } = req.body;
                    const { token } = req.headers;
                    const auth = await Auth.findOne({ _id: token });
                    if (auth) {
                        const pet = await Pet.create({
                            profilePicture: 'InitialPetProfile.jpg',
                            pictures: "",
                            status: "Neutral",
                            firstName: firstName,
                            lastName: lastName,
                            color: color,
                            coatSize: coatSize,
                            birthdate: birthdate,
                            male: male,
                            user: auth.user,
                        })
                        return res.status(201).json(pet);
                    } else {
                        return res.status(401).json({ 'Error': 'Invalid Token' });
                    }
                } catch (error) {
                    return res.status(500).json({ 'Error': 'Invalid Token Format' });
                }
            }
        } catch (error) {
            return res.status(500).json({ "Internal Server Error": error.message })
        }
    },

    async deletepet(req, res) {
        try {
            const { pet, token } = req.headers;
            const auth = await Auth.findOne({ _id: token });
            if (auth) {
                const deletePet = await Pet.findOne({ _id: pet })
                if (deletePet) {
                    if (deletePet.user == auth.user) {
                        if (deletePet.profilePicture != "InitialPetProfile.jpg") {
                            const image = await Image.findOne({ key: deletePet.profilePicture })
                            image.remove();
                        }
                        deletePet.remove();
                    } else {
                        return res.status(403).json({ "error": "User and pet does not match" });
                    }
                } else {
                    return res.status(404).json({ "error": "Pet not found" })
                }
            } else {
                return res.status(401).json({ 'error': 'Invalid Token' });
            }
        } catch (error) {
            return res.status(500).json({ 'Internal Server Error': error.message });
        }
    },


    async UserDeleteAccount(token) {
        try {
            const auth = await Auth.findOne({ _id: token });
            if (auth) {
                const petsData = await Pet.findOne({ user: auth.user });
                if (petsData) {
                    const image = await Image.findOne({ key: petsData.profilePicture })
                    if (image) {
                        try {
                            await image.remove();
                            await petsData.remove();
                        } catch (error) {
                            return 0
                        }
                    } else {
                        try {
                            await petsData.remove();
                        } catch (error) {
                            return res.status(500).json({ "Internal Server Error": error.message });
                        }
                    }
                } else {
                    return 0
                }
            } else {
                return res.status(403).json({ "error": "Invalid Token" })
            }
        } catch (error) {
            return res.status(500).json({ 'Internal Server Error': error.message });
        }
    }
    /*
    async deleteallpets(req, res) {

        try {
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
        } catch (error) {
        }
        return res.json({ message: 'Deleted' });
    }
*/

};
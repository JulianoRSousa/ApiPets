const Image = require('../models/Image');
require("dotenv").config();



module.exports = {

    async getImageByKey(req, res) {
        const { key } = req.headers;
        try {
            const image = await Image.findOne({ key: key });
            return res.status(200).json(image);
        } catch (error) {
            return res.status(500).json({ 'Internas Server Error': error.message });
        }
    },

    async showAllImages(req, res) {
        if (process.env.ENVIRONMENT == "dev") {
            try {
                const images = await Image.find()

                return res.status(200).json(images)
            } catch (error) {
                return res.status(500).json({ 'Error': 'Cant find Images' });
            }
        }
        return res.status(403).json({ "error": "No system admin logged" });
    },

    async createImage(req, res) {
        try {
            if (process.env.ENVIRONMENT == "dev") {
                if (req.file) {
                    const { originalname: name, size, key, location: url = "" } = req.file;
                    
                    const image = await Image.create({
                        name,
                        size,
                        key,
                        url,  
                    });
                    return res.status(201).json(image)
                }else{
                    return res.status(415).json({ 'Internal Server Error': 'Invalid Media Type' })
                }
            }
            return res.status(401).json({ 'Error': 'No admin logged' })
        } catch (error) {
            return res.status(500).json({ 'Internal Server Error': error.message })
        }

    },


    async deleteImageByKey(req, res) {
        try {
            if (process.env.ENVIRONMENT == 'dev') {
                const { key } = req.headers;
                const image = await Image.findOne({ key: key })
                await image.remove();
                return res.status(201).json({ "Image Removed - Key": key });
            } else {
                return res.status(401).json({ "Error": "No system admin logged" })
            }
        } catch (error) {
            return res.status(500).json({ "Internal Server Error": error.message })
        }

    },



};

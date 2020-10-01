const Image = require('../models/Image');



module.exports = {

    async getImageByKey(req, res) {
        const { key } = req.headers;
        try {
            const image = await Image.findOne({ key: key });
            return res.status(200).json(Image);
        } catch (error) {
            return res.status(500).json({ 'Internas Server Error': error.message });
        }
    },

    async showAllImages(req, res) {
        if (process.env.ENVIRONMENT == "dev") {
            try {
                const posts = await Post.find()
                return res.status(200).json(posts)
            } catch (error) {
                return res.status(500).json({ 'Error': 'Cant find posts' });
            }
        }
        return res.status(403).json({ "error": "No system admin logged" });
    },

    async createImage(req, res) {
        try {
            if (process.env.ENVIRONMENT == 'dev') {
                if (req.file) {
                    const { originalname: name, size, key, location: url = "" } = req.file;

                    const image = await Image.create({
                        name,
                        size,
                        key,
                        url,
                        user: auth.user
                    });
                    return res.status(201).json(image)
                }
                return res.status(415).json({ 'Internal Server Error': 'Invalid Media Type' })
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

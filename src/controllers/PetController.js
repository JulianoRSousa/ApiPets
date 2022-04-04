const Pet = require("../models/Pet");
const Auth = require("../models/Auth");
const Image = require("../models/Image");
const User = require("../models/User");

module.exports = {

  async getPetByPetId(req, res) {
    const { pet_id } = req.headers;
    try {
      const petResult = await Pet.findOne({ _id: pet_id });
      return res.status(200).json(petResult);
    } catch (error) {
      return res.status(500).json({ Error: "Invalid Pet Token Format" });
    }
  },

  async getPetByToken(req, res) {
    const { token } = req.headers;
    try {
      const auth = await Auth.findOne({ _id: token });
      if (auth) {
        const pets = await Pet.find({ userTutor: auth.user._id });
        return res.status(200).json(pets);
      } else {
        return res.status(403).json({ Error: "Invalid Token" });
      }
    } catch (error) {
      return res.status(500).json({ Error: "Invalid User Format" });
    }
  },

  async showallpets(req, res) {
    if (process.env.ENVIRONMENT == "dev") {
      try {
        const pets = await Pet.find();
        return res.status(200).json(pets);
      } catch (error) {
        return res.status(401).json({ Error: "Pets Not Found" });
      }
    }
    return res.status(403).json({ Error: "No system admin logged" });
  },

  async createPet(req, res) {
    try {
      if (req.file) {
        const { originalname: name, size, key, location: url = "" } = req.file;
        const {
          fullname,
          color,
          coatSize,
          type,
          birthdate,
          isMale,
          status,
        } = req.body;
        const { token } = req.headers;

        try {
          const auth = await Auth.findOne({ _id: token });
          if (auth) {
            const image = await Image.create({
              name,
              size,
              key,
              url,
              user: auth.user,
            });

            const pet = await Pet.create({
              picture: image.key,
              pictureList: [image.key],
              type,
              fullname,
              color,
              coatSize,
              birthdate,
              isMale,
              status: status ?? '0',
              userTutor: auth.user,
            });
            const petList = await Pet.find({ userTutor: auth.user })
            const userInfo = await User.findOne({ _id: auth.user._id })
            userInfo.petList = petList
            userInfo.save();
            return res.status(201).json(pet);
          } else {
            return res.status(401).json({ Error: "Invalid Token" });
          }
        } catch (error) {
          return res.status(500).json({ Error: error });
        }
      } else {
        try {
          const {
            fullname,
            color,
            coatSize,
            birthdate,
            isMale,
            status
          } = req.body;
          const { token } = req.headers;
          const auth = await Auth.findOne({ _id: token });
          if (auth) {
            const pet = await Pet.create({
              status: status ?? '0',
              fullname,
              color,
              coatSize,
              birthdate,
              isMale,
              userTutor: auth.user,
            });
            return res.status(201).json(pet);
          } else {
            return res.status(401).json({ Error: "Invalid Token" });
          }
        } catch (error) {
          return res.status(500).json({ Error: error.message });
        }
      }
    } catch (error) {
      return res.status(500).json({ Error: error.message });
    }
  },

  async deletepet(req, res) {
    try {
      const { pet_id, token } = req.headers;
      const auth = await Auth.findOne({ _id: token })
      if (auth) {
        const deletePet = await Pet.findOneAndDelete({ _id: pet_id })
        if (deletePet) {
          if (String(deletePet.userTutor) == String(auth.user)) {
            const image = await Image.findOne({ key: deletePet.picture });
            deletePet.picture = image
            image.remove();
            return res.status(201).json(deletePet)
          } else {
            return res
              .status(403)
              .json({ error: "User and pet does not match" });
          }
        } else {
          return res.status(403).json({ error: "Pet not found" });
        }
      } else {
        return res.status(403).json({ error: "Invalid Token" });
      }
    } catch (error) {
      return res.status(500).json({ "Internal Server Error": error.message });
    }
  },

  async UserDeleteAccount(token) {
    try {
      const auth = await Auth.findOne({ _id: token });
      if (auth) {
        const petsData = await Pet.findOne({ userTutor: auth.user._id });
        if (petsData) {
          const image = await Image.findOne({ key: petsData.picture });
          if (image) {
            try {
              await image.remove();
              await petsData.remove();
            } catch (error) {
              return 0;
            }
          } else {
            try {
              await petsData.remove();
            } catch (error) {
              return res
                .status(500)
                .json({ "Internal Server Error": error.message });
            }
          }
        } else {
          return 0;
        }
      } else {
        return res.status(403).json({ error: "Invalid Token" });
      }
    } catch (error) {
      return res.status(500).json({ "Internal Server Error": error.message });
    }
  },
};

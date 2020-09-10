const Auth = require('../models/Auth');
const User = require('../models/User');
const Post = require('../models/Post');
const Pet = require('../models/Pet');
const path = require('path');

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const https = require("https");
const { deleteauth } = require('./AuthController');

//index, show, store, update, destroy


module.exports = {

    async getUserByEmail(req, res) {
        const email = req.headers.email.toLowerCase();
        try {
            const userData = await User.find({ email: email });
            return res.status(200).json(userData);
        } catch (error) {
            return res.status(500).json({ 'Error': 'Cant Find User' });
        }
    },

    async showallusers(req, res) {
        if (process.env.ENVIRONMENT == 'dev') {
            try {
                const users = await User.find();
                return res.status(200).json(users);
            } catch (error) {
                return res.status(500).json({'Error':'Cant Find Users'});
            }
        }
        return res.status(403).json({ "error": "No system admin logged" });
    },

    async getUserById(req, res) {
        const { user_id } = req.headers;
        try {
            const userData = await User.find({ _id: user_id });
            return res.status(200).json(userData);
        } catch (error) {
            return res.status(404).json({ 'Error': 'User Not Found' });
        }
    },


    async setProfilePicture(req, res) {
        const profilePicture = req.file
        const token = req.headers.token;
        let user = null;

        console.log("ProfilePic => ", profilePicture);

        await Auth.findOne({ _id: token }).then(Response => {
            user = Response.user
        })

        console.log("User => ", user)

        if (user) {
            try {
                user = await User.findOne({ _id: user })
                user.profilePicture = profilePicture.filename
                await user.save()



                const url = https.get("https://back-apipets.herokuapp.com/files/" + profilePicture + "", response => {
                    response.pipe(file);
                });

                const file = fs.createWriteStream(url);

                return res.status(201).json(user);

            } catch (error) {
                console.log("Erro = ", error)
            }

        }

        return res.status(202).json({ 'Error': 'No changes done' })
    },

    async deleteUserById(req, res) {
        const { token } = req.headers;
        try {
            const authenticated = await Auth.findOne({ _id: token })
            if (authenticated) {
                const deletePet = await Pet.deleteMany({ user: authenticated.user });
                if (deletePet.deletedCount) {
                    const deletePost = await Post.deleteMany({ user: authenticated.user })
                    if (deletePost.deletedCount) {
                        const deleteAuth = await Auth.deleteOne({ _id: authenticated._id })
                        if (deleteAuth.deletedCount) {
                            const deleteUser = await User.deleteOne({ _id: authenticated.user });
                            if (deleteUser.deletedCount) {
                                return res.status(201).json(deleteUser)
                            }
                            return res.status(403).json({ 'Error': "Invalid Paramns to Delete all User Data" })
                        }
                    }
                }
            }
            return res.status(401).json({ 'Error': "Invalid Token!" })
        } catch (error) {
            return res.status(500).json({ 'Error': "Invalid Token Format" })
        }
    },


    // async editBorn(req, res){
    //     let data = [];
    //    data[0] = token = req.headers;
    //    data[1]  = born = req.headers.born;

    //     //  console.log("tosource",valueOf(data[0]))
    //      if(valueOf(data[1])){
    //          console.log("nao veio")
    //      }else{
    //          console.log("veio")
    //      }

    //  console.log(valueOf(data[1]))
    //  console.log(valueOf(data[2]))
    //  function filterByID(obj) {
    //     if (Object.values(obj) == Object.values(error) ) {
    //         console.log("false")
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   }
    //   var safeData = data.filter(filterByID)

    // console.log("safedata::>",safeData)

    // let edit = await Auth.findOne({ _id: token })

    //     if(edit.user == user){
    //         let result1 = await User.findOne({_id: user})
    //         let abc = await User.updateOne({_id: user},{ born: born})
    //         result1.save()
    //         return res.json(abc)
    //     }
    //     return res.json({'Error': 'Data do not match!'})
    // },


    async createLogin(req, res) {
        const email = req.headers.email.toLowerCase();
        const { pass, fullname, male } = req.headers;

        const getuser = await User.findOne({ email });
        try {
            if (!getuser) {
                let user = await User.create({
                    email,
                    pass,
                    firstName: fullname.split(" ")[0],
                    lastName: fullname.split(" ").slice(1).join(' '),
                    male,
                    profilePicture: "InitialProfile.png"
                });

                const auth = await Auth.create({
                    user: user._id,
                    auth: true,
                });

                await auth.populate('user').execPopulate();

                return res.status(201).json(auth);
            }
            return res.status(202).json({ 'Error': 'This email is already in use!' })
        } catch (error) {
            console.log(error.message);
        }
    }
};
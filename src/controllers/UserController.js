const Auth = require('../models/Auth');
const User = require('../models/User');
const path = require('path');

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

//index, show, store, update, destroy


module.exports = {

    async getUserByEmail(req, res) {
        const email = req.headers.email.toLowerCase();

        const user = await User.find({ email });

        return res.json(user);
    },

    async showallusers(req, res) {

        const users = await User.find();

        return res.json(users);
    },

    async getUserById(req, res) {
        const { user } = req.headers;

        const userData = await User.find({ _id: user });

        return res.json(userData);
    },


    async setProfilePicture(req, res) {
        const profilePicture = req.file.filename
        const token = req.headers.token;
        let user = null;

        console.log("ProfilePic => ", profilePicture);

        await Auth.findOne({ _id: token }).then(Response => {
            user = Response.user
        })

        if (user) {
            try {
                user = await User.findOne({ _id: user })
                user.profilePicture = profilePicture
                await user.save()

                const http = require("http");
                const file = fs.createWriteStream(profilePicture);

                http.get("https://back-apipets.herokuapp.com/files/"+profilePicture+"", response => {
                    response.pipe(file);
                });


                //##########################################################################


                // If modifying these scopes, delete token.json.
                const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
                // The file token.json stores the user's access and refresh tokens, and is
                // created automatically when the authorization flow completes for the first
                // time.
                const TOKEN_PATH = 'token.json';

                // Load client secrets from a local file.
                fs.readFile('credentials.json', (err, content) => {
                    if (err) return console.log('Error loading client secret file:', err);
                    // Authorize a client with credentials, then call the Google Drive API.
                    authorize(JSON.parse(content), createFile);
                    authorize(JSON.parse(content), listFiles);
                });

                /**
                 * Create an OAuth2 client with the given credentials, and then execute the
                 * given callback function.
                 * @param {Object} credentials The authorization client credentials.
                 * @param {function} callback The callback to call with the authorized client.
                 */
                function authorize(credentials, callback) {
                    const { client_secret, client_id, redirect_uris } = credentials.installed;
                    const oAuth2Client = new google.auth.OAuth2(
                        client_id, client_secret, redirect_uris[0]);

                    // Check if we have previously stored a token.
                    fs.readFile(TOKEN_PATH, (err, token) => {
                        if (err) return getAccessToken(oAuth2Client, callback);
                        oAuth2Client.setCredentials(JSON.parse(token));
                        callback(oAuth2Client);
                    });
                }

                /**
                 * Get and store new token after prompting for user authorization, and then
                 * execute the given callback with the authorized OAuth2 client.
                 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
                 * @param {getEventsCallback} callback The callback for the authorized client.
                 */
                function getAccessToken(oAuth2Client, callback) {
                    const authUrl = oAuth2Client.generateAuthUrl({
                        access_type: 'offline',
                        scope: SCOPES,
                    });
                    console.log('Authorize this app by visiting this url:', authUrl);
                    const rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout,
                    });
                    rl.question('Enter the code from that page here: ', (code) => {
                        rl.close();
                        oAuth2Client.getToken(code, (err, token) => {
                            if (err) return console.error('Error retrieving access token', err);
                            oAuth2Client.setCredentials(token);
                            // Store the token to disk for later program executions
                            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                                if (err) return console.error(err);
                                console.log('Token stored to', TOKEN_PATH);
                            });
                            callback(oAuth2Client);
                        });
                    });
                }

                /**
                 * Lists the names and IDs of up to 10 files.
                 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
                 */
                function listFiles(auth) {
                    const drive = google.drive({ version: 'v3', auth });
                    drive.files.list({
                        pageSize: 5,
                        fields: 'nextPageToken, files(id, name)',
                    }, (err, res) => {
                        if (err) return console.log('The API returned an error: ' + err);
                        const files = res.data.files;
                        if (files.length) {
                            console.log('Files:');
                            files.map((file) => {
                                console.log(`${file.name} (${file.id})`);
                            });
                        } else {
                            console.log('No files found.');
                        }
                    });
                }

                var fileMetadata = {
                    'name': profilePicture
                };
                var media = {
                    mimeType: 'image/png',
                    body: fs.createReadStream("files/" + profilePicture + ""),
                };


                function createFile(auth) {
                    const drive = google.drive({ version: 'v3', auth });
                    drive.files.create({
                        resource: fileMetadata,
                        media: media,
                        fields: 'id'
                    }, function (err, file) {
                        if (err) {
                            // Handle error
                            console.error(err);
                        } else {
                            console.log('File Id: ', file.id);
                        }
                    })
                }


                //##########################################################################

                return res.status(201).json(user);

            } catch (error) {
                console.log("Erro = ", error)
            }

        }

        return res.status(202).json({ 'Error': 'No changes done' })
    },

    async deleteUserByEmail(req, res) {
        const email = req.headers.email.toLowerCase();

        const deleted = await User.findOneAndDelete({ email })
        if (deleted == null)
            return res.status(202).json({ 'Error': 'This email was not found!' })
        return res.status(200).json(deleted)
    },

    async deleteUserById(req, res) {
        const { user_id } = req.headers;

        const deleted = await User.findOneAndDelete({ _id: user_id })
        if (deleted == null)
            return res.status(202).json({ 'Error': 'This email was not found!' })
        return res.status(200).json(deleted)
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
            return res.status(202).json({ 'Error': 'This email is already registered!' })
        } catch (error) {
            console.log(error.message);
        }



    }
};
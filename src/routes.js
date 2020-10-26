const express =  require('express');
const multer = require('multer');
const multerConfig = require('./config/upload');

const uploadConfig = require('./config/upload')
const UserController = require('./controllers/UserController');
const PetController = require('./controllers/PetController');
const PostController = require('./controllers/PostController');
const CommentController = require('./controllers/CommentController');
const LikeController = require('./controllers/LikeController');
const AuthController = require('./controllers/AuthController');
const ComplaintController = require('./controllers/ComplaintController');
const ImageController = require('./controllers/ImageController');
const FollowController = require('./controllers/FollowController');


const routes = express.Router();
const upload = multer(uploadConfig);



//FUNCTION NEED REMOVING {

//showallusers;
//getuserbyid;
//deleteuserbyemail;

//showallpets
//deleteallpets

//showallposts;
//showallcomments;

//showsessions;
//gettrue;
//deleteallauth;
//  }

routes.get('/', UserController.commandList); //OK//


//IMAGE routes
routes.post('/createimage', upload.single('image'), ImageController.createImage); //OK//
routes.get('/getimagebykey', ImageController.getImageByKey); //OK//
routes.get('/showallimages', ImageController.showAllImages); //OK//
routes.delete('/deleteimagebykey', ImageController.deleteImageByKey); //OK//

//USER routes
routes.post('/setprofile', upload.single('profilePicture'), UserController.setProfilePicture); //OK//
routes.post('/createlogin', UserController.createLogin); //OK//
routes.get('/getuserbyemail', UserController.getUserByUsername); //OK//
routes.get('/showallusers', UserController.showallusers); //OK//
routes.get('/getuserbyid', UserController.getUserById); //OK//
routes.get('/loaduser', UserController.loadUser); //OK//
routes.delete('/deleteuserbyid', UserController.deleteUserById); //OK//

//PETS routes
routes.post('/createpet', upload.single('profilePicture'), PetController.createPet); //OK//
routes.get('/getpetbyuserid', PetController.getPetByUserId); //OK//
routes.get('/showallpets', PetController.showallpets); //OK//
routes.delete('/deletepet', PetController.deletepet); //OK//
//routes.delete('/deleteallpets', PetController.deleteallpets);

//UserPOST routes
routes.post('/createpost', upload.single('picture'), PostController.createPost); //OK//
routes.get('/getpostbystate', PostController.getPostByState); //OK//
routes.get('/getpostbyuserid', PostController.getPostByUserId); //OK//
routes.get('/showallposts', PostController.showAllPosts); //OK//
routes.get('/getfeed', PostController.getFeed); //OK//
routes.delete('/deletepost', PostController.deletePost); //OK//

//COMMENT routes
routes.post('/createcomment', CommentController.createComment); //OK//
routes.get('/getcommentbypostid', CommentController.getCommentByPostId); //OK//
routes.get('/showallcomments', CommentController.showAllComments); //OK//
routes.delete('/deletecomment', CommentController.deleteComment); //OK//

//LIKE routes
routes.post('/createlike', LikeController.createLike); //OK//
routes.get('/getlikebypost', LikeController.getLikeByPostId); //OK//
routes.get('/getpostlikecount', LikeController.getLikeCount); //OK//
routes.get('/showalllikes', LikeController.showAllLikes); //OK//

//COMPLAINT routes
routes.post('/createcomplaint', ComplaintController.createComplaint); //OK//
routes.get('/getcomplaintbypost', ComplaintController.getComplaintByPostId); //OK//
routes.get('/showallcomplaint', ComplaintController.showAllComplaint); //OK//

//AUTH routes
routes.post('/createauth', AuthController.createauth); //OK//
routes.get('/confirmauth', AuthController.confirmauth); //OK//
routes.get('/showsessions', AuthController.showAllSessions); //OK//
routes.get('/ison', AuthController.isOn); //OK//
routes.delete('/deleteauth', AuthController.deleteauth); //OK//
routes.delete('/deleteallauth', AuthController.deleteallauth); //OK//

//FOLLOW routes
routes.post('/followfunction', FollowController.followFunction);
routes.get('/getfollowerbytoken', FollowController.getFollowerByToken);
routes.get('/getfollowerbyuserid', FollowController.getFollowerByUserId);
routes.get('/getfollowingbytoken', FollowController.getFollowingByToken);
routes.get('/getfollowingbyuserid', FollowController.getFollowingByUserId);



module.exports = routes;

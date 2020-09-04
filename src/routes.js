const express =  require('express');
const multer = require('multer');

const uploadConfig = require('./config/upload')
const UserController = require('./controllers/UserController');
const PetController = require('./controllers/PetController');
const PostController = require('./controllers/PostController');
const CommentController = require('./controllers/CommentController');
const LikeController = require('./controllers/LikeController');
const AuthController = require('./controllers/AuthController');
const ComplaintController = require('./controllers/ComplaintController');


const routes = express.Router();
const upload = multer(uploadConfig);


//USER routes
routes.put('/setprofile', upload.single('profilePicture'), UserController.setProfilePicture); //Untested route
routes.post('/createlogin', UserController.createLogin); //ok
routes.get('/getuserbyemail', UserController.getUserByEmail); //ok
routes.get('/showallusers', UserController.showallusers); //ok
routes.get('/getuserbyid', UserController.getUserById); //ok
routes.delete('/deleteuserbyemail', UserController.deleteUserByEmail); //ok
routes.delete('/deleteuserbyid', UserController.deleteUserById); //ok

//PETS routes
routes.post('/createpet', upload.single('profilePicture'), PetController.store); //ok - Need fix the pet profile picture
routes.get('/getpetbyuserid', PetController.getPetByUserId); //ok
routes.get('/showallpets', PetController.showallpets); //ok
routes.delete('/deletepet', PetController.deletepet); //ok
//routes.delete('/deleteallpets', PetController.deleteallpets);

//UserPOST routes
routes.post('/createpost', upload.single('picture'), PostController.store);
routes.get('/getpostbystate', PostController.getPostByState);
routes.get('/getpostbyuser', PostController.getPostByUser);
routes.get('/getallposts', PostController.getAllPosts);

//COMMENT routes
routes.post('/createcomment', CommentController.store);
routes.get('/getcommentbypost', CommentController.getCommentByPostId);
routes.delete('/deletecomment', CommentController.deletecomment);

//LIKE routes
routes.post('/createlike', LikeController.store);
routes.get('/getlikebypost', LikeController.getLikeByPostId);
routes.get('/getlikecount', LikeController.getLikeCount);
routes.delete('/deletelike', LikeController.deletelike);

//COMPLAINT routes
routes.post('/createcomplaint', ComplaintController.store);
routes.get('/getcomplaintbypost', ComplaintController.getComplaintByPostId);

//AUTH routes
routes.post('/createauth', AuthController.createauth);
routes.get('/confirmauth', AuthController.confirmauth);
routes.get('/showsessions', AuthController.showSession);
routes.get('/gettrue', AuthController.gettrue);
routes.delete('/deleteauth', AuthController.deleteauth);
routes.delete('/deleteallauth', AuthController.deleteallauth);


module.exports = routes;

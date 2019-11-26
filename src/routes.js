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



routes.post('/setprofile', upload.single('profilePicture'), UserController.setProfilePicture);
routes.post('/createlogin', UserController.createLogin);
routes.get('/getuserbyemail', UserController.getUserByEmail);
routes.get('/showallusers', UserController.showallusers);
routes.get('/getuserbyid', UserController.getUserById);
routes.delete('/deleteuserbyemail', UserController.deleteUserByEmail);
// routes.put('/updateBornByTokenAndUserId', UserController.editBorn);

routes.post('/createpet', upload.single('profilePicture'), PetController.store);
routes.get('/getpetbyuserid', PetController.getPetByUserId);
routes.delete('/deletepet', PetController.deletepet);

routes.post('/createpost', upload.single('picture'), PostController.store);
routes.get('/getpostbystate', PostController.getPostByStatus);
routes.get('/getpostbyuser', PostController.getPostByUser);
routes.get('/getallposts', PostController.getAllPosts);

routes.post('/createcomment', CommentController.store);
routes.get('/getcommentbypost', CommentController.getCommentByPostId);
routes.delete('/deletecomment', CommentController.deletecomment);

routes.post('/createlike', LikeController.store);
routes.get('/getlikebypost', LikeController.getLikeByPostId);
routes.get('/getlikecount', LikeController.getLikeCount);
routes.delete('/deletelike', LikeController.deletelike);

routes.post('/createcomplaint', ComplaintController.store);
routes.get('/getcomplaintbypost', ComplaintController.getComplaintByPostId);

routes.post('/createauth', AuthController.createauth);
routes.get('/confirmauth', AuthController.confirmauth);
routes.get('/showsessions', AuthController.showSession);
routes.get('/gettrue', AuthController.gettrue);
routes.delete('/deleteauth', AuthController.deleteauth);
routes.delete('/deleteallauth', AuthController.deleteallauth);


module.exports = routes;

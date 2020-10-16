const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv').config();

const routes = require('./routes');


const app = express();
try {
    mongoose.connect(
       // mongodb://pets:<password>@petsdb-shard-00-00.wm6vq.mongodb.net:27017,petsdb-shard-00-01.wm6vq.mongodb.net:27017,petsdb-shard-00-02.wm6vq.mongodb.net:27017/petsDB?ssl=true&replicaSet=atlas-6oetxh-shard-0&authSource=admin&retryWrites=true&w=majority
       // mongodb+srv://pets:<password>@petsdb.wm6vq.mongodb.net/<dbname>?retryWrites=true&w=majority
        'mongodb+srv://'
        + process.env.USERMONGODB + ':'
        + process.env.PASSMONGODB +
        process.env.MONGODBCONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
} catch (error) {
    console.log(error.message())
}

app.use(cors())
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(routes);


app.listen(process.env.PORT || 3333);


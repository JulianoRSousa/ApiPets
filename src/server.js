const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const routes = require('./routes');


const app = express();
try {
    mongoose.connect('mongodb://'
    +process.env.USERMONGODB+':'+process.env.PASSMONGODB
    +'@petsdb1-shard-00-00.i0iht.gcp.mongodb.net:27017,petsdb1-shard-00-01.i0iht.gcp.mongodb.net:27017,petsdb1-shard-00-02.i0iht.gcp.mongodb.net:27017/test?replicaSet=PetsDB1-shard-0&ssl=true&authSource=admin',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
} catch (error) {
    console.log(error.message())
}


//GET, POST, PUT, DELETE

app.use(cors())
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(routes);

app.listen(process.env.PORT || 3333);


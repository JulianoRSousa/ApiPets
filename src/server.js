const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const routes = require('./routes');


const app = express();

mongoose.connect('mongodb://petspets:petspets@petsdb-shard-00-00-i0iht.mongodb.net:27017,petsdb-shard-00-01-i0iht.mongodb.net:27017,petsdb-shard-00-02-i0iht.mongodb.net:27017/test?ssl=true&replicaSet=PetsDB-shard-0&authSource=admin&retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

//GET, POST, PUT, DELETE

app.use(cors())
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(routes);

app.listen(3333);


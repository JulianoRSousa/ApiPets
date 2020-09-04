const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const routes = require('./routes');


const app = express();
try {
    mongoose.connect(
        'mongodb://'
        + process.env.USERMONGODB + ':'
        + process.env.PASSMONGODB
        + process.env.MONGOCONNECTION, {
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


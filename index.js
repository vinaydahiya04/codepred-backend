const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const bodyParser = require("body-parser");
const mongoSantize = require("express-mongo-sanitize")
const authRoutes = require('./routes/authRoute')
const predRoutes = require('./routes/predRoutes')
const initi = require('./predictor/model')
const nodemailer = require('nodemailer')


const port = process.env.PORT || 5000;
const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("port", port);
app.use(cors());
app.use(mongoSantize())

var data_store;



var server = app.listen(port, () => {
    console.log("server listening at " + port);
});

mongoose
    .connect(`${process.env.DATABASE}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(
        () => {
            console.log("Connected to database");
            app.use("/api/user", authRoutes);
            app.use("/api/prediction", predRoutes);

        },
        (err) => {
            console.log(err);
            console.log("Connection Failed retry");
            console.log(`${process.env.DATABASE}`)
        }
    );





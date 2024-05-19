const app=require('express');
const http=require('http').Server(app);
const mongoose=require('mongoose');
const User=require('./src/models/User')

const dotenv = require("dotenv")

dotenv.config()

const mongoString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@test.pxqht.mongodb.net/Users?retryWrites=true&w=majority`

mongoose.connect(mongoString, {useNewUrlParser: true})

mongoose.connection.on("error", function(error) {
  console.log(error)
})

mongoose.connection.on("open", function() {
  console.log("Connected to MongoDB database.")
})
http.listen(3000,function(){
    console.log("server is running");
})
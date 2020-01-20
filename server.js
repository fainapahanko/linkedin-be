const express = require("express")
const mongoose =  require("mongoose")
const path = require("path")
const dotenv = require("dotenv")
const server = express()
const port = process.env.PORT

mongoose.connect("mongodb://localhost:27017/linkedin-db",{useNewUrlParser: true})
  .then(db => console.log("connected to mongodb"), err => console.log("error", err))
dotenv.config();

server.use(express.json())

server.listen(port, () => {
    console.log("We are running on localhost", port)
})


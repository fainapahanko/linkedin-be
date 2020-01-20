const express = require("express")
const mongoose =  require("mongoose")
const path = require("path")
const experienceRouter = require("./src/routers/experience/index")
const dotenv = require("dotenv")
const server = express()
dotenv.config();
const port = process.env.PORT

mongoose.connect("mongodb://localhost:27017/linkedin-db",{useNewUrlParser: true})
  .then(db => console.log("connected to mongodb"), err => console.log("error", err))

server.use("/img", express.static("img"))
server.use(express.json())
server.use("/experiences", experienceRouter)

server.listen(port, () => {
    console.log("We are running on localhost", port)
})


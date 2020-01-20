const express = require("express")
const mongoose =  require("mongoose")
const path = require("path")
const experienceRouter = require("./src/routers/experience/index")
const dotenv = require("dotenv")
const server = express()
<<<<<<< HEAD
const cors = require("cors")
=======
dotenv.config();
>>>>>>> 50d4e733ff5d19ca79c2e46208c8a2def9d0fda4
const port = process.env.PORT

mongoose.connect("mongodb://localhost:27017/linkedin-db",{useNewUrlParser: true})
  .then(db => console.log("connected to mongodb"), err => console.log("error", err))

<<<<<<< HEAD
server.use(cors())
=======
server.use("/img", express.static("img"))
>>>>>>> 50d4e733ff5d19ca79c2e46208c8a2def9d0fda4
server.use(express.json())
server.use("/experiences", experienceRouter)

server.listen(port, () => {
    console.log("We are running on localhost", port)
})


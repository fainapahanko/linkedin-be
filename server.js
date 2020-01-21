const listEndpoints = require("express-list-endpoints");
const express = require("express")
const mongoose =  require("mongoose")
var bodyParser = require('body-parser')
const profilesRouter = require("./src/routers/profiles/index");
const usersRouter = require("./src/routers/users/index");
const experienceRouter = require("./src/routers/experience/index")
const dotenv = require("dotenv")
const server = express()
const cors = require("cors")
const PORT = process.env.PORT || 3333
dotenv.config()

// mongoose.connect("mongodb://localhost:27017/linkedin-db",{useNewUrlParser: true})
//   .then(db => console.log("connected to mongodb"), err => console.log("error", err))



server.use(cors())
server.use(express.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use("/profiles", profilesRouter);
server.use("/experiences", experienceRouter)
server.use("/users", usersRouter)

const LoggerMiddleware = (req, res, next) => {
    console.log(`${req.url} ${req.method} -- ${new Date()}`);
    next();
};

server.use(LoggerMiddleware);

const requireJSONContentOnlyMiddleware = () => {
    return (req, res, next) => {
        if (req.headers["content-type"] !== "application/json") {
            res
                .status(400)
                .send("Server requires application/json only as content type");
        } else {
            next();
        }
    };
};

//catch not found errors
server.use((err, req, res, next) => {
    if (err.httpStatusCode === 404) {
        console.log(err);
        res.status(404).send("Resource not found!");
    }
    next(err);
});
//catch not found errors
server.use((err, req, res, next) => {
    if (err.httpStatusCode === 401) {
        console.log(err);
        res.status(401).send("Unauthorized!");
    }
    next(err);
});
//catch forbidden errors
server.use((err, req, res, next) => {
    if (err.httpStatusCode === 403) {
        console.log(err);
        res.status(403).send("Operation Forbidden");
    }
    next(err);
});
//catch all
server.use((err, req, res, next) => {
    if (!res.headersSent) {
        res.status(err.httpStatusCode || 500).send(err);
    }
});

console.log(listEndpoints(server));
server.post("/", (req,res) => {
  console.log(req.body.username)
  res.send(req.body)
})
let options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };       
mongoose.connect(process.env.LOCAL, options)
    .then(() => {
        console.log("MongoDB connected.");
        server.listen(PORT, () => {
            console.log("We are running on localhost", PORT)
        })
    }
    )
    .catch(err => console.log(err));

const listEndpoints = require("express-list-endpoints");
const express = require("express");
const mongoose =  require("mongoose");
const profilesRouter = require("./src/routers/profiles/index");
const authRouter = require("./src/routers/auth/index");
const usersRouter = require("./src/routers/users/index");
const experienceRouter = require("./src/routers/experience/index");
const postsRouter = require("./src/routers/posts/index");
const dotenv = require("dotenv");
const passport = require('passport')
const server = express();
const cors = require("cors");
const PORT = process.env.PORT || 3433;
dotenv.config();

mongoose.connect(process.env.LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => console.log(err ? err : "MongoDB connected successefully") )

const LoggerMiddleware = (req, res, next) => {
    console.log(`${req.url} ${req.method} -- ${new Date()}`);
    //console.log(req.session);
    next();
};


server.use(LoggerMiddleware);
server.use(cors());
// server.use(session({ 
//     secret: 'abcdefg',
//     resave: true,
//     saveUninitialized: false
//  }));
server.use(express.json())
server.use(passport.initialize())
server.use(passport.session())

server.use("/profile", profilesRouter);
server.use("/auth", authRouter);
server.use("/profile/:username/experiences", experienceRouter);
server.use("/image", express.static('image'));
server.use("/users", usersRouter);
server.use("/posts", postsRouter);

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
server.listen(PORT, () => {
    console.log("We are running on localhost", PORT)
})



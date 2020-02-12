const passport = require('passport')
const UserModal = require('../models/users.js')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const auth = require('../utils/auth')
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

passport.serializeUser(UserModal.serializeUser())
passport.deserializeUser(UserModal.deserializeUser())

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.TOKEN_PASSWORD
}


module.exports = {
    getToken: (user) => jwt.sign(user, jwtOptions.secretOrKey, {expiresIn: 360}),

    jwtPassport: passport.use(new JwtStrategy(jwtOptions, (jwtPayload, callback) => {
        UserModal.findById(jwtPayload._id, (err,user) => {
            if(user) return callback(null, user)
            else if(err) return callback(err, false)
            else return callback(null, false)
        })
    })),

    local: passport.use(new LocalStrategy(UserModal.authenticate()))
}

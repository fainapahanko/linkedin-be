const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require("passport")
const User = require('../models/users')
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')
dotenv.config()

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

passport.use(new LocalStrategy({      
    usernameField: 'username',
}, User.authenticate()))

const jwtConfig = { jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.TOKEN_PASSWORD  }

passport.use(new JwtStrategy(jwtConfig,
    (jwtPayload, next) =>{
        User.findById(jwtPayload._id, (err, user) =>{
            if (err) return next(err, null)
            else if (user) return next(null, user)
            else return (null, false)
        })
    }
))

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3433/auth/facebook/callback"
  },
  async(accessToken, refreshToken, profile, done) => {
      try{
        const userFromFaceebook = await User.findOne({facebookId: profile.id}) 
        if(userFromFaceebook) return done(null, userFromFaceebook)
        else{
            const name = profile.displayName.split(' ')
            const username = name.join('')
            const newUser = await User.create({
                facebookId: profile.id,
                username: username,
                accessToken: accessToken
            }) 
            newUser.save()
            console.log(newUser)
            return done(null, newUser)
        }
      } catch(err){
        console.log(err)
        return done(err)
      }  
  }
));

module.exports = {
    getToken: userInfo => jwt.sign(userInfo, process.env.TOKEN_PASSWORD, { expiresIn: 6000 })
}
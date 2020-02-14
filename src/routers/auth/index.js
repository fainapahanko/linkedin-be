const express = require('express')
const router = express()
const passport = require('passport')
const {getToken} = require('../../utils/auth')

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login'
    }), (req, res) => {
        console.log(req.user.username)
        res.redirect('http://localhost:3000/callback?token=' + getToken({ _id: req.user._id }) + '&username=' + req.user.username);
    }
);

module.exports = router
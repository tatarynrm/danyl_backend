// passport-config.js

const passport = require('passport');
const db = require('../db/db');
const { googleAuthMethod } = require('../services/auth/google.method');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `/auth/google/callback`,
},
async function(accessToken, refreshToken, profile, cb) {
  // Here you can handle user creation or authentication logic
  // console.log('OK',profile);
  const result = await googleAuthMethod(profile?._json?.email)
// console.log('PROFILEJSON',result);
  await cb(null,result)
  
}
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
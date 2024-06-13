// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: `https://api.vendmarket.tech/auth/google/callback`,
  
//   },
//     function(accessToken, refreshToken, profile, cb) {
//       console.log(profile);
//       console.log('PROFILEPICTURE',profile);
//       console.log('PROFILEEMAIL',profile._json.email);
//       // User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       //   return cb(err, user);
//       // });
//     }
//   ));
  
  
//   passport.serializeUser((user, done) => {
//     done(null, user)
//   })
  
//   passport.deserializeUser((user, done) => {
//     done(null, user)
//   })

  
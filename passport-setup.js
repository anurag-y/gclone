const passport=require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(profile, done) {
    /*
    From the profile take just the id (to minimize the cookie size) and just pass the id of the profile
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, profile);
  });
  
passport.deserializeUser(function(profile, done) {
    /*
    Instead of profile this function usually recives the id 
    then you use the id to select the profile from the db and pass the profile obj to the done callback
    PS: You can later access this data in any routes in: req.profile
    */
    done(null, profile);
});

passport.use(new GoogleStrategy({
    clientID: "1029831532156-1deb90dbkfs4s18bek83v0ioo4pmca9c.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    
      return done(null, profile);

  }
));
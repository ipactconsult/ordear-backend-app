const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserService = require("./user");


const passport = require("passport");


const GOOGLE_CLIENT_ID =
    "314847443556-cfc0b2lf0p3a9p39ar1ji896dikmm8br.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";



passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/google/callback",
      scope: [ 'email', 'profile' ]
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile)
      const id = profile.id;
      const email =  profile?.emails[0]?.value    ;
      const firstName = profile.name.givenName;
      const lastName = profile.name.familyName;
      const profilePhoto = profile.photos[0].value;
      const source = "google";

   
      const currentUser = await UserService.getUserById({ id});
      if (!currentUser) {
        const newUser = await UserService.addGoogleUser({
          id,
          email,
          firstName,
          lastName,
          profilePhoto
        })
        return done(null, newUser);
    
      }
      if (currentUser.source != "google") {
        //return error
        return done(null, false, { message: `You have previously signed up with a different signin method` });
      }
      currentUser.lastVisited = new Date();
      return done(null, currentUser);


    }
    

  )
);



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const currentUser = await User.findOne({ id });
  done(null, currentUser)});

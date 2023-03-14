const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserService = require("./user");


const passport = require("passport");


const GOOGLE_CLIENT_ID =
    "46652329299-i0rbbo5m02qt5eluapdr1buollqv52tq.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "AIzaSyBviYbJpI5y42UnLe0TP5ez7bj0j6DPiBU";



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
      const phone = profile.phone;
      const source = "google";

   
      const currentUser = await UserService.getUserById({ id});
      if (!currentUser) {
        const newUser = await UserService.addGoogleUser({
          id,
          email,
          firstName,
          lastName,
          phone
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

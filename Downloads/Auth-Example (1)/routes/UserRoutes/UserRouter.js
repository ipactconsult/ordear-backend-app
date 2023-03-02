const router = require('express').Router()
const userController = require ('../../controllers/UserController/UserController');
const CLIENT_URL = "http://localhost:3000/";
const passport = require("passport");





//passport register with google route file

router.post('/register',userController.register_controller);
router.post('/login',userController.login_controller);
router.post('/activate',userController.validationAccount_controller);
router.put('/forgot-password',userController.forgotPassword_controller);
router.put('/reset-password',userController.resetPassword_controller);
router.post('/is-validate-token',userController.isValidateToken_controller);
router.get('/logout',userController.logout_controller);

//Profile Routes
router.get('/profile/get-user',userController.getUser_controller);
router.put('/profile/update-user/:id',userController.updateUser_controller);
router.put('/profile/update-user-image/:id',userController.updateImage_controller);
//passport re
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "CLIENT_URL",
    failureRedirect: "/login/failed",
  })
);
router.get("/login/failed", (req, res) => {
    res.status(401).json({
      success: false,
      message: "failure",
    });
  });
 
  router.get("/login/success", (req, res) => {
    if (req.user) {
      res.status(200).json({
        success: true,
        message: "successfull",
        user: req.user,
        
        //   cookies: req.cookies
      }
      
      );
    }
  });
  
  
module.exports = router;

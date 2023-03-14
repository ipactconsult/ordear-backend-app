const router = require('express').Router()
const userController = require ('../../controllers/UserController/UserController');


router.post('/login',userController.login_controller);

router.put('/reset-password',userController.resetPassword_controller);
router.post('/is-validate-token',userController.isValidateToken_controller);


//------------------------ path nouveau ajouté --------------------------------------
router.post('/registerwithcode',userController.registercode_controller);
router.post('/activatewithcode',userController.validationAccountwithcode_controller);

router.put('/forgotPassWithcode',userController.validationCodeForgotPass_controller);
router.post('/activatewithcodePassword',userController.validationCodePassword_controller);
router.put('/modifierPass', userController.modifPass_controller)

router.get('/viewProfile', userController.viewProfile_controller)
router.put('/editProfile', userController.editProfile_controller)
router.put('/editPassword', userController.editPassword_Controller)
router.put('/editPhone', userController.editPhone_Controller)
router.get('/logout', userController.logout_Controller)
//router.get('/logout',userController.logout_controller);
const passport = require("passport");

// ---------------------------- connecter avec google --------------------------------
router.get("/google", passport.authenticate("google", { scope: ["profile","email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5000/",
    failureRedirect: "/login/failed",
  })
);
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }));

  router.get('/setcookie', (req, res) => {
    res.cookie(`Cookie token name`,`encrypted cookie string Value`);
    res.send('Cookie have been saved successfully');
});
  

router.get("/login/failed", (req, res) => {
    res.status(401).json({
      success: false,
      message: "failure",
    });
  });
 

module.exports = router;

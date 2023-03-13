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



module.exports = router;

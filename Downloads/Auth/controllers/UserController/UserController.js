const userService = require("../../services/UserServices/UserService");

const UserController = {



  /* -------------------register with code  + verification -----------------*/
  registercode_controller: async (req,  res) => {
    userService.registerwithcode(req, res);
  },
  validationAccountwithcode_controller: async (req, res) => {
    userService.activationAccountwithcode(req, res);
  },

  /* --------------------- Login ------------------------------------ */ 

  login_controller: async (req, res) => {
    userService.login(req, res);
  },


  // ------------ validate code password  + reset Pass -------------------
  validationCodePassword_controller: async (req, res) => {
    userService.verifCodeForgotPassword(req, res);
  },

  validationCodeForgotPass_controller: async (req, res) => {
    userService.forgotPasswordWithCode(req, res);
  },

  modifPass_controller: async (req, res) => {
    userService.resetPasswordWithCode(req, res);
  },

  // ------------------------ profile -------------------------------------
  viewProfile_controller: async (req, res) => {
    userService.viewProfile(req, res);
  },

  editProfile_controller: async (req, res) => {
    userService.editProfile(req, res);
  },

  editPassword_Controller: async (req, res) => {
    userService.editPassword(req, res);
  },

  editPhone_Controller: async (req, res) => {
    userService.editPhone(req, res);
  },
  
  logout_Controller : async (req, res) => {
    userService.logout(req, res);
  },
  //--------------------------------------------------------------------------

  resetPassword_controller: async (req, res) => {
    userService.resetPassword(req, res);
  },

  /*logout_controller: async (req, res) => {
    userService.logout(req, res);
  },
*/
  isValidateToken_controller: async (req, res) => {
    userService.validateToken(req, res);
  },

 
};

module.exports = UserController;

const jwt_decode = require("jwt-decode");
const User = require("../../models/client");
const bcrypt = require("bcryptjs");
const fs = require('fs'); 
const jwt = require("jsonwebtoken");
const _ = require("lodash");
//command line to install 
const nodemailer = require("nodemailer");
const { error } = require("console");
const RandomString = require("randomstring");

const express = require("express");
const route = express.Router();



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'ettouils505@gmail.com',    
    pass:'sgyvsyhnwbmvjacs',
  },
});

const UserService = {
  

  // ------------ register with code + verification--------------
  registerwithcode: async (req, res) => {
    const { firstName, lastName, phone ="+1 11111111", adresse="Montreal, Canada", genre="Male", birthday="01/01/2023", email, password, passwordVerify } = req.body;
    User.findOne({ email }).exec((err, user) => {
      if (user) {
        return res.status(400).json({ error: "Email is already taken" });
      }
    });

    if (password !== passwordVerify) {
      return res.status(400).json({ error: "Mismatch password" });
    }
    //generate random string for activation code
    const activationCode = RandomString.generate({
      length: 4,
      charset: "numeric",
    });
    const token = jwt.sign(
      { firstName,lastName, email, password, passwordVerify, phone, genre, adresse, birthday ,activationCode },
      `${process.env.JWT_ACC_ACTIVATE}`,
      { expiresIn: "10m" }
    );

  res.cookie("token", token, { expiresIn: "10m" });  

    const options = {
      from: "ettouils505@gmail.com",
      to: email,
      subject: "Account Activation Code",
      html: `
           <div style="max-width: 700px; margin:auto; border: 5px solid #ddd; padding: 50px 20px; font-size: 110%;">
           <h2 style="text-align: center; text-transform: uppercase;color: #FF1717;">Welcome to Ordear</h2>
           <p>Congratulations! 
               Just click the button below to validate your email address.
           </p>
           
           
           <a>${activationCode}</a>
           
       
         
           </div>
           `,
    };

    transporter.sendMail(options, function (err, info) {
      if (err) {
        console.log("Error in signup while account activation: ", err);
        return res.status(400).json({ error: "Error activating account" });
      } else {
        return res.status(200).json({ message: "An email has been sent" });
      }
    });
  },

  activationAccountwithcode: async (req, res) => {
    const token = req.cookies.token;        
   
    if (token) {
      jwt.verify(
        token,
        `${process.env.JWT_ACC_ACTIVATE}`,
        function (err, decodedToken) {
          if (err) {
            return res
              .status(400)
              .json({ error: "Incorrect or Expired code." });
          }
          const { firstName,lastName, email, password,activationCode } = decodedToken;
            console.log(decodedToken);
            console.log(activationCode);
          User.findOne({ email }).exec(async (err, user) => {
            if (user) {
              return res
                .status(400)
                .json({ error: "User with this email already exists." });
            }
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);
            console.log(passwordHash);

            const code= req.body.activationCode;
            if (code !== activationCode) {
              return res.status(400).json({ error: "Mismatch code" });
            }

            let newUser = new User({          
             
              firstName,
              lastName, 
              phone:"",
              adresse: "",
              birthday:"",
              genSalt:"",
              email,
              password: passwordHash,
              
            });
            newUser.save((err, success) => {
              if (err) {
                console.log("Error in signup : ", err);
                return res.status(400).json({ error: err });
              } else {
                return res.status(200).json({
                  message: "Signup success",
                });
              }
            });
          });
        }
      );
    } else {
      return res.json({ error: "Something went wrong." });
    }
  },

 // ------------------------- Login -----------------------------
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      //validate
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Not all fields have been entered" });
      }
      const user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "No account with this email has been founded" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      //Using token for login
      const tokenLogin = jwt.sign({ id: user._id }, `${process.env.JWT_SECRET}`);
     

      console.log("**********************")
      console.log(" Your token is :")
      console.log(tokenLogin);

      res.cookie("tokenLogin", tokenLogin);

      res.json({
        user: {
          id: user._id,
          //role: user.role,
         // avatar: user.avatar,
          firstName: user.firstName,
          lastName: user.lastName,
          adresse: user.adresse,
          phone: user.phone,
          email: user.email,
          birthday: user.birthday,
         genre: user.genre,
        },
      });

     /* const tokenLog = jwt.sign(
        { id, firstName,lastName, adresse, phone, email, birthday, genre },
        `${process.env.JWT_ACC_ACTIVATE}`,
        { expiresIn: "10m" }
      );*/
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  },


   /* -------------------------------- Forgot password with EMAIL code --------------------------------*/

  forgotPasswordWithCode : async (req, res) => {
 
      const { email } = req.body;
      User.findOne({ email }).exec((err, user) => {
        if (!user) {
          return res.status(400).json({ error: "User does not exist" });
        }
      }); 
     
      //generate random string for activation code
      const activationCodeForgotPass = RandomString.generate({
        length: 4,
        charset: "numeric",
      });
      const tokenForgotPass = jwt.sign(
        { email, activationCodeForgotPass },
        `${process.env.JWT_ACC_ACTIVATE}`,
        { expiresIn: "10m" }
      );
  
    res.cookie("tokenForgotPass", tokenForgotPass, { expiresIn: "10m" });  
  
      const options = {
        from: "ettouils505@gmail.com",
        to: email,
        subject: "Code Reset Password",
        html: `
             <div style="max-width: 700px; margin:auto; border: 5px solid #ddd; padding: 50px 20px; font-size: 110%;">
             <h2 style="text-align: center; text-transform: uppercase;color: #FF1717;">Welcome to Ordear</h2>
             <p>Congratulations! 
                 Just click the button below to validate your email address.
             </p>
             
             
             <a>${activationCodeForgotPass}</a>         
           
             </div>
             `,
      };

      transporter.sendMail(options, function (err, info) {
        if (err) {
          console.log("Error while account validation: ", err);
          return res.status(400).json({ error: "Error verifying account" });
        } else {
          return res.status(200).json({ message: "An email has been sent" });
        }
    });

       
      
   },

  verifCodeForgotPassword: async (req, res) => {
    const tokenForgotPass = req.cookies.tokenForgotPass; 
    
    var decodeTokenLogin = jwt_decode(tokenForgotPass);

    var emailUser = decodeTokenLogin.email;
    var codeVerif = decodeTokenLogin.activationCodeForgotPass;

    console.log("your email is : " +emailUser);
    console.log("your code is :"+codeVerif);
   
    if (tokenForgotPass) {
      jwt.verify(
        tokenForgotPass,
        `${process.env.JWT_ACC_ACTIVATE}`,
        function (err, decodedTokenForgotPass) {
          if (err) {
            return res
              .status(400)
              .json({ error: "Incorrect or Expired code." });
          }
          const { email,activationCodeForgotPass } = decodedTokenForgotPass;

            console.log(decodedTokenForgotPass);
            console.log(activationCodeForgotPass);

          User.findOne({ email }).exec(async (err, user) => {
            if (!user) {
              return res
                .status(400)
                .json({ error: "User exist." });
            }
           
            const code= req.body.activationCodeForgotPass;
            if (code !== activationCodeForgotPass) {
              return res.status(400).json({ error: "Mismatch code" });
            }

            console.log("your forgot token pass " +tokenForgotPass);
            res.cookie("tokenForgotPass", tokenForgotPass ); //{ expiresIn: "10m" }
            console.log('code verified'); 

            const options = {
              from: "ettouils505@gmail.com",
              to: email,
              subject: "Email confirmation",
              html: `
                   <div style="max-width: 700px; margin:auto; border: 5px solid #ddd; padding: 50px 20px; font-size: 110%;">
                   <h2 style="text-align: center; text-transform: uppercase;color: #FF1717;">Welcome to Ordear</h2>
                   <p>Congratulations! 
                      Your adress email has been verified.
                   </p>
                        
                 
                   </div>
                   `,
            };
      
            transporter.sendMail(options, function (err, info) {
              if (err) {
                console.log("Error while account validation: ", err);
                return res.status(400).json({ error: "Error verifying account" });
              } else {
                return res.status(200).json({ message: "An email has been sent" });
              }
          });
      
             
          
          });
        }
      );
    } else {
      return res.status(401).json({ error: "Authentication error." });
    }
  },

  resetPasswordWithCode: async (req, res) => {

      const tokenForgotPass = req.cookies.tokenForgotPass;

      var decodeTokenLogin = jwt_decode(tokenForgotPass);

      var emailUser = decodeTokenLogin.email;
      var codeVerif = decodeTokenLogin.activationCodeForgotPass;

      const { resetLinkPass, newPass } = req.body;
      
      var salt = bcrypt.genSaltSync(10);
      User.updateOne(
       {"email": emailUser}, // Filter
       {$set:{"password":  bcrypt.hashSync(req.body.password, salt)}} // Update
   )
   .then((obj) => {
       console.log('Updated - ' + obj);
       res.send(obj)
   })
   .catch((err) => {
       console.log('Error: ' + err);
   })

  
  },

// ---------------------------- get + edit profile -----------------------------
viewProfile: async(req,res)=>{
  const tokenViewProfile = req.cookies.tokenLogin;

  var decodeTokenLogin = jwt_decode(tokenViewProfile);

  var idUser = decodeTokenLogin.id;

 // const user = await User.findOne({ email: email });
  const user = await User.findOne({"_id": idUser});
       
  User.find({"_id": idUser},(err,docs)=>{
        if(err)
        {
          res.send(err)
        }
        else {
          /*res.json({
            user: {
              id: user._id,
             // avatar: user.avatar,
              firstName: user.firstName,
              lastName: user.lastName,
              adresse: user.adresse,
              phone: user.phone,
              email: user.email,
              birthday: user.birthday,
              genre: user.genre,
            },
          });*/
            res.send(docs)
        }
    })

},

editProfile : async(req,res)=>{

  const tokenProfile = req.cookies.tokenLogin; 

  var decodeTokenLogin = jwt_decode(tokenProfile);

  var idUser = decodeTokenLogin.id;

  console.log(decodeTokenLogin);
  console.log("***************");
  console.log("your id : "+idUser);

  User.updateOne(
    //{ "_id": req.params.id}, // Filter
    {"_id": idUser},
    {$set:{"firstName":req.body.firstName,"lastName":req.body.lastName ,"phone": req.body.phone,"adresse":req.body.adresse,"birthday":req.body.birthday, "genre": req.body.genre}} // Update
    /*
    {$set: {"lastName": req.body.lastName}},
    {$set: {"phone": req.body.phone}},
    {$set: {"adresse":req.body.addresse}},
    {$set: {"birthday":req.body.birthday}},
    {$set: {"genre": req.body.genre}},// 
    */
  )
    .then((obj) => {
      console.log('Updated - ' + obj);
      res.send(obj)
    })
    .catch((err) => {
      console.log('Error: ' + err);
    })
          
},

editPassword: async (req, res) =>{
  const tokenProfile = req.cookies.tokenLogin; 

  var decodeTokenLogin = jwt_decode(tokenProfile);

  var idUser = decodeTokenLogin.id;
          
      var salt = bcrypt.genSaltSync(10);
      User.updateOne(
      {"_id": idUser}, // Filter
      {$set:{"password":  bcrypt.hashSync(req.body.password, salt)},

    } // Update
    )
    .then((obj) => {
      console.log('Updated - ' + obj);
      res.send(obj)
    })
    .catch((err) => {
      console.log('Error: ' + err);
    })
},

// --------------------------- edit Phone number ------------------------------
editPhone : async (req, res) => {

  const tokenProfile = req.cookies.tokenLogin; 

  var decodeTokenLogin = jwt_decode(tokenProfile);

  var idUser = decodeTokenLogin.id;

  User.updateOne(
    {"_id": idUser},
    {$set:{"phone": req.body.phone}} // Update
  )
    .then((obj) => {
      console.log('Updated - ' + obj);
      res.send(obj)
    })
    .catch((err) => {
      console.log('Error: ' + err);
    })

},


// ---------------------------- Logout ------------------------------------
logout: async (req, res) => {
  
  const tokenProfile = req.cookies.tokenLogin; 

  var decodeTokenLogin = jwt_decode(tokenProfile);

  var idUser = decodeTokenLogin.id;
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "Logged out" });
},

/* ***************************************************************************************** */

};

module.exports = UserService;

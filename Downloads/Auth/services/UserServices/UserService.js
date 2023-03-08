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
  register: async (req, res) => {
    const { firstName,lastName, email, password, passwordVerify,phone="", adresse="", avatar="", birthday="", genre=""} = req.body; //name, country, phone, email, password, passwordVerify
    User.findOne({ email }).exec((err, user) => {
      if (user) {
        return res.status(400).json({ error: "Email is already taken" });
      }
    });

    if (password !== passwordVerify) {
      return res.status(400).json({ error: "Mismatch password" });
    }
    const token = jwt.sign(
      { firstName,lastName, email, password, passwordVerify },
     `${process.env.JWT_ACC_ACTIVATE}`,
      { expiresIn: "10m" }
    );

    const options = {
      from: 'ettouils505@gmail.com',
      to: email,
      subject: "Account Activation Link",
      html: `
           <div style="max-width: 700px; margin:auto; border: 5px solid #ddd; padding: 50px 20px; font-size: 110%;">
           <h2 style="text-align: center; text-transform: uppercase;color: #FF1717;">Welcome to Ordear.</h2>
           <p>Congratulations! 
               Just click the button below to validate your email address.
           </p>
           
           
           <a href="${process.env.CLIENT_URL}/authenticate/activate/${token}"
              target="_blank"
              style="background: #FF1717; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">
              Verify Your Email Address
           </a>
           
       
           <p>If the button doesn't work for any reason, you can also copy this link below and paste it in the browser:</p>
       
           <a>${process.env.CLIENT_URL}/authenticate/activate/${token}</a>
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

  // ------------ register with code + verification--------------
  registerwithcode: async (req, res) => {
    const { firstName, lastName, email, password, passwordVerify } = req.body;
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
      { firstName,lastName, email, password, passwordVerify ,activationCode },
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
           <h2 style="text-align: center; text-transform: uppercase;color: blue;">Welcome to Ordear</h2>
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

  // --------------------------------------------------


  activationAccount: async (req, res) => {
    const { token } = req.body;
    if (token) {
      jwt.verify(
        token,
        `${process.env.JWT_ACC_ACTIVATE}`,
        function (err, decodedToken) {
          if (err) {
            console.log(err);
            return res
              .status(400)
              .json({ error: "Incorrect or Expired link." });
          }
          const { role, avatar, firstName, lastName, email, password } =
            decodedToken;
          User.findOne({ email }).exec(async (err, user) => {
            if (user) {
              return res
                .status(400)
                .json({ error: "User with this email already exists." });
            }
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);
            console.log(passwordHash);

            let newUser = new User({
              role: "user",
              avatar: "https://image.flaticon.com/icons/png/512/61/61205.png",
              firstName,   
              lastName,  
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
      console.log(err);
      return res.json({ error: "Something went wrong." });
    }
  },

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
      const token = jwt.sign({ id: user._id }, `${process.env.JWT_SECRET}`);
      res.json({
        token,
        user: {
          id: user._id,
          //role: user.role,
         // avatar: user.avatar,
          firstName: user.firstName,
          lastName: user.lastName,
         // country: user.country,
         // phone: user.phone,
          email: user.email,
          //birthday: user.birthday,
         // bio: user.bio,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    User.findOne({ email }).exec((err, user) => {
      if (err || !user) {
       // console.log(err);
        return res          
          .status(400)
          .json({ error: "User with this email does not exists" });
      }

      const activationCodeForgot = RandomString.generate({
        length: 4,
        charset: "numeric",
      });

      const tokenForgot = jwt.sign(
        { email, activationCodeForgot },
        `${process.env.JWT_ACC_ACTIVATE}`,
       // `${process.env.RESET_PASSWORD_KEY}`,
        { expiresIn: "10m" }
      );
      

      res.cookie("tokenForgot", tokenForgot, { expiresIn: "10m" });  

      const options = {
        from: "ettouils505@gmail.com",
        to: email,
        subject: "Reset password",
        html: `
        <div style="max-width: 700px; margin:auto; border: 5px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: blue;">Welcome to Ordear</h2>
        <p>Congratulations! 
            Just validate the code below to validate your email address.
        </p>
        
        
        <a>${activationCodeForgot}</a>
        </div>
            `,
      };
      return user.updateOne({ resetLink: tokenForgot }, function (err, success) {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: "reset password link error." });
        } else {
          //SEND MAIL HERE
          transporter.sendMail(options, function (err, info) {
            if (err) {
              console.log(err);
              return;
            }
            console.log("Sent: " + info.response);
          });
        }
      });
    });
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
             <h2 style="text-align: center; text-transform: uppercase;color: blue;">Welcome to Ordear</h2>
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
            res.cookie("tokenForgotPass", tokenForgotPass, { expiresIn: "10m" }); 

            //const resetTokenPass = tokenForgotPass;

          /*  const tokenLinkPass = jwt.sign(
              { email},
              `${process.env.JWT_ACC_ACTIVATE}`,
              { expiresIn: "10m" }
            );

                    
          res.cookie("tokenLinkPass", tokenLinkPass, { expiresIn: "10m" });  
        */
           // res.cookie("resetLinkPass", resetTokenPass, { expiresIn: "10m" }); 
           /* console.log("***************************"); 
            console.log("New token : email"); 
            console.log("***************************"); 
            console.log("");
            console.log(tokenLinkPass); */

            console.log('code verified'); 
            
            /*return User.updateOne({resetLinkPass: tokenForgotPass}), function (err, success) {;
              console.log("");
              console.log("************");
              console.log("****reset link: " + resetLinkPass);
        
              if(success){
                res.cookie("resetLinkPass", resetLinkPass, { expiresIn: "10m" });
              }
                
        
              } */  
          });
        }
      );
    } else {
      return res.status(401).json({ error: "Authentication error." });
    }
  },

  resetPasswordWithCode: async (req, res) => {


      const tokenForgotPass = req.cookies.tokenForgotPass;

      const { resetLinkPass, newPass } = req.body;
      
      var salt = bcrypt.genSaltSync(10);
      User.updateOne(
       {tokenForgotPass}, // Filter
       {$set:{"password":  bcrypt.hashSync(req.body.password, salt)}} // Update
   )
   .then((obj) => {
       console.log('Updated - ' + obj);
       res.send(obj)
   })
   .catch((err) => {
       console.log('Error: ' + err);
   })

    //const linkPass = req.cookies.resetLinkPass;
   /* const { resetLinkPass, newPass } = req.body;

    if (resetLinkPass) {
      jwt.verify(
        resetLinkPass,
        `${process.env.JWT_ACC_ACTIVATE}`,
        function (error, decodedData) {
          if (error) {
            return res.status(401).json({
              error: "Incorrect token or It is expired.",
            });
          }
          User.findOne({ resetLinkPass }, async (err, user) => {
            if (err || !user) {
              return res
                .status(400)
                .json({ error: "User with token does not exists" });
            }

            const salt = await bcrypt.genSalt();
            const passwordHash1 = await bcrypt.hash(newPass, salt);
            console.log(passwordHash1);

            const obj = {
              password: passwordHash1,
              resetLinkPass: "",
            };
            user = _.extend(user, obj);
            user.save((err, result) => {
              if (err) {
                return res.status(400).json({ error: "reset password error" });
              } else {
                return res
                  .status(200)
                  .json({ message: "Your password has been changed." });
              }
            });
          });
        }
      );
    } else {
      return res.status(401).json({ error: "Authentication error." });
    }*/
  },

 
/*resetPasswordWithCode :async(req,res)=>{

  const tokenLinkPass = req.cookies.tokenForgotPass; 
  const newPass  = req.body;

   var salt = bcrypt.genSaltSync(10);
      User.updateOne(
       { "email": tokenLinkPass}, // Filter
       {$set:{"password":  bcrypt.hashSync(req.body.newPass, salt)}} // Update
   )
   .then((obj) => {
       console.log('Updated - ' + obj);
       res.send(obj)
   })
   .catch((err) => {
       console.log('Error: ' + err);
   })
},*/

// -------------------------------------------------------------------------------------------------

updatePWD: async (req, res) =>{
  var salt = bcrypt.genSaltSync(10);
  User.updateOne(
   { "email": req.params.id}, // Filter
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
  //Profile Management

    //Display User Informations
  getInformations : async(req,res)=> {
    const user = await User.findById(req.user);
    res.json({
      id: user?._id,
      avatar : user?.avatar,
      username: user?.username,
      //country: user.country,
      //phone: user?.phone,
      email: user?.email,
    })
  },



    //Update User Informations
 /* updateInformations : async(req,res)=> {
    try {
      let {
        firstName,
        lastName,
        phone,
        email,
          //bio,
          //birthday
      } = req.body;
      const userUpdate = await User.findById(req.params.id);
      if(!firstName){
        firstName= userUpdate.firstName
    }
    if(!lastName){
      lastName= userUpdate.lastName
  }
      if(!email){
        email= userUpdate.email
    }
      
      if(!phone){
        phone= userUpdate.phone
      }
     /* if(!birthday){
        birthday= userUpdate.birthday
      }
      if(!bio){
        bio= userUpdate.bio
      }*/
    /*  userUpdate.username = username;
      userUpdate.email = email;
      userUpdate.country = country;
      userUpdate.phone = phone;
      //userUpdate.birthday = birthday;
      //userUpdate.bio = bio;
      await userUpdate.save();
      res.json(
        
        {
          user:{
            id: userUpdate._id,
            //avatar : userUpdate.avatar,
            //role : userUpdate.role,
            username: userUpdate.username,
            //country: userUpdate.country,
            phone: userUpdate.phone,
            email: userUpdate.email,
            //bio: userUpdate.bio,
            //birthday: userUpdate.birthday
          }     
        }
      );
  
    } catch (error) {
      console.log(error);
    }
  },


    //Update User Profile Image
  updateImage: async (req, res) => {
    try {
      let { avatar } = req.body;
      const userUpdate = await User.findById(req.params.id);
      if (!avatar) {
        avatar = userUpdate.avatar;
      }
      userUpdate.avatar = avatar;
      await userUpdate.save();
      res.json({
        user: {
          id: userUpdate.id,
          username: userUpdate.username,
          email: userUpdate.email,
          phone: userUpdate.phone,
          country: userUpdate.country,
          avatar: userUpdate.avatar,
          birthday: userUpdate.birthday,
          bio: userUpdate.bio,
          role: userUpdate.role,
        },
      });
    } catch (error) {
      console.log(error);
    }
  },*/
};

module.exports = UserService;

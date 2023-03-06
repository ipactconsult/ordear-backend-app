const User = require("../../user/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const RandomString = require("randomstring");
//npm install random string

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'amine.benothmane1@gmail.com',
    
    pass:'mrhbwfgbiifdtcva',
  },
});

const UserService = {
  register: async (req, res) => {
    const { firstName, lastName, email, password, passwordVerify } = req.body;
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
      process.env.JWT_ACC_ACTIVATE,
      { expiresIn: "10m" }
    );
 
  

    const options = {
      from: "noreply@gmail.com",
      to: email,
      subject: "Account Activation Link",
      html: `
           <div style="max-width: 700px; margin:auto; border: 5px solid #ddd; padding: 50px 20px; font-size: 110%;">
           <h2 style="text-align: center; text-transform: uppercase;color: blue;">Welcome to our website.</h2>
           <p>Congratulations! 
               Just click the button below to validate your email address.
           </p>
           
           
           <a href="${process.env.CLIENT_URL}/authenticate/activate/${token}"
              target="_blank"
              style="background: darkblue; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">
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
      length: 6,
      charset: "numeric",
    });
    const token = jwt.sign(
      { firstName,lastName, email, password, passwordVerify ,activationCode },
      process.env.JWT_ACC_ACTIVATE,
      { expiresIn: "10m" }
    );

  res.cookie("token", token, { expiresIn: "10m" });
    
 
    
 
  

    const options = {
      from: "noreply@gmail.com",
      to: email,
      subject: "Account Activation Code",
      html: `
           <div style="max-width: 700px; margin:auto; border: 5px solid #ddd; padding: 50px 20px; font-size: 110%;">
           <h2 style="text-align: center; text-transform: uppercase;color: blue;">Welcome to our website.</h2>
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


  


  
  




  activationAccount: async (req, res) => {
    const { token } = req.body;
        if (token) {
      jwt.verify(
        token,
        process.env.JWT_ACC_ACTIVATE,
        function (err, decodedToken) {
          if (err) {
            return res
              .status(400)
              .json({ error: "Incorrect or Expired link." });
          }
          const {  firstName,lastName,email, password } =
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
             
              firstName,
             
            
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
  activationAccountwithcode: async (req, res) => {
    const token = req.cookies.token;
           
   
    
    if (token) {
      jwt.verify(
        token,
        process.env.JWT_ACC_ACTIVATE,
        function (err, decodedToken) {
          if (err) {
            return res
              .status(400)
              .json({ error: "Incorrect or Expired link." });
          }
          const {   firstName,lastName, email, password ,activationCode } =
            decodedToken;
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
      const tokenlog = jwt.sign({ user: user.email}, process.env.JWT_SECRET);
      res.json({
        tokenlog,
        user: {
          
          firstName: user.firstName,
          lastName: user.lastName,
        
         
          email: user.email,
         
          
        },
      });
      res.cookie('tokenlog',tokenlog,{maxAge:900000,httpOnly:true}) 
      
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    User.findOne({ email }).exec((err, user) => {
      if (err || !user) {
        return res
          .status(400)
          .json({ error: "User with this email does not exists" });
      }
      const token = jwt.sign(
        { _id: user._id },
        process.env.RESET_PASSWORD_KEY,
        { expiresIn: "10m" }
      );

      const options = {
        from: "noreply@hello.com",
        to: email,
        subject: "Account Activation Link",
        html: `
            <div style="max-width: 700px; margin:auto; border: 5px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: blue;">Welcome to our website.</h2>
            <p>Congratulations! 
                Just click the button below to reset your password.
            </p>
            
            <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
            `,
      };
      return user.updateOne({ resetLink: token }, function (err, success) {
        if (err) {
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

  resetPassword: async (req, res) => {
    const { resetLink, newPass } = req.body;
    if (resetLink) {
      jwt.verify(
        resetLink,
        process.env.RESET_PASSWORD_KEY,
        function (error, decodedData) {
          if (error) {
            return res.status(401).json({
              error: "Incorrect token or It is expired.",
            });
          }
          User.findOne({ resetLink }, async (err, user) => {
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
              resetLink: "",
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
    }
  },

  logout: async (req, res) => {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.json({ message: "Logged out" });
  },

  validateToken: async (req, res) => {
    try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);

      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) return res.json(false);
      const user = await User.findById(verified.id);
      if (!user) return res.json(false);

      return res.json(true);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  //Profile Management

    //Display User Informations
  getInformations : async(req,res)=> {
    const user = await User.findById(req.user);
    res.json({
      id: user._id,
      avatar : user.avatar,
      name: user.name,
      country: user.country,
      phone: user.phone,
      email: user.email,
        bio: user.bio,
        birthday : user.birthday,
        role: user.role
    })
  },

    //Update User Informations
  updateInformations : async(req,res)=> {
    try {
      let {
        name,
        country,
        phone,
        email,
          bio,
          birthday
      } = req.body;
      const userUpdate = await User.findById(req.params.id);
      if(!name){
        name= userUpdate.name
    }
      if(!email){
        email= userUpdate.email
    }
      if(!country){
        country= userUpdate.country
      }
      if(!phone){
        phone= userUpdate.phone
      }
      if(!birthday){
        birthday= userUpdate.birthday
      }
      if(!bio){
        bio= userUpdate.bio
      }
      userUpdate.name = name;
      userUpdate.email = email;
      userUpdate.country = country;
      userUpdate.phone = phone;
      userUpdate.birthday = birthday;
      userUpdate.bio = bio;
      await userUpdate.save();
      res.json(
        
        {
          user:{
            id: userUpdate._id,
            avatar : userUpdate.avatar,
            role : userUpdate.role,
            name: userUpdate.name,
            country: userUpdate.country,
            phone: userUpdate.phone,
            email: userUpdate.email,
            bio: userUpdate.bio,
            birthday: userUpdate.birthday
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
          name: userUpdate.name,
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
  },






  
};



module.exports = UserService;

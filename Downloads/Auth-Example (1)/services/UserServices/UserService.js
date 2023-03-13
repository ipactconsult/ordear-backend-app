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
    user: 'mohamedamine.benothmane@esprit.tn',
    
    pass:'xxfgyqtbhsxasiao',
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
    //encrypy password
   
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("password"+hashedPassword)

   /* const token = jwt.sign(
      { firstName,lastName, email, password, passwordVerify ,activationCode },
      process.env.JWT_ACC_ACTIVATE,
    
    );*/
    const token=jwt.sign({firstName,lastName, email, hashedPassword,activationCode },process.env.JWT_ACC_ACTIVATE,{expiresIn: "60m"}

    )
    console.log("token value"+token)
    
      // try this
  



 
 
    
 
  

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
        //console.log({token})

         //return res.status(200).json({ message: "An email has been sent" });
        return  res.cookie("tokentest",token, { expiresIn: "60m" }).send({message:"An email has been sent"});
      }
    });
 
  },

  registerwithsmscode: async (req, res) => {
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
      { firstName,lastName, email, password, passwordVerify ,activationCode },
      process.env.JWT_ACC_ACTIVATE,
      { expiresIn: "10m" }
    );

  res.cookie("token", token, { expiresIn: "50m" });


    
 // Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
const accountSid = "AC5cf80f54d180d0e60d3c36d2dbdb4819";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = "VA13d9fe62faa4cd1221cfc738d57f0db9";
const client = require("twilio")(accountSid, authToken);

client.verify.v2
  .services(verifySid)
  .verifications.create({ to: "+21696675347", channel: "sms" })
  .then((verification) => console.log(verification.status))
  .then(() => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("Please enter the OTP:", (otpCode) => {
      client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+21696675347", code: otpCode })
        .then((verification_check) => console.log(verification_check.status))
        .then(() => readline.close()).then(()=>res.json('sms send successfully'));
    });
  });
 
  

    
  },

  
  Smsapprouvedcode: async (req, res) => {
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
    const token = req.cookies.tokentest;
    
    //return res.send(token)
           
   
    
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
          const {   firstName,lastName, email, hashedPassword ,activationCode } =
            decodedToken;
            console.log(decodedToken);
            console.log(activationCode);
          User.findOne({ email }).exec(async (err, user) => {
            if (user) {
              return res
                .status(400)
                .json({ error: "User with this email already exists." });
            }



            const code= req.body.activationCode;
            if (code !== activationCode) {
              return res.status(400).json({ error: "Mismatch code" });
            }



         


            let newUser = new User({
              
             
              firstName:firstName,
              lastName:lastName,
              email:email,
              password:hashedPassword,
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
      //console.log(password)
      //validate
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Not all fields have been entered" });
      }
      const user = await User.findOne({ email: email });
     // console.log("user"+user);
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
      const tokenlog =  await jwt.sign({ user: user.email}, process.env.JWT_SECRET);
     /* res.json({
        tokenlog,
        user: {
          
          firstName: user.firstName,
          lastName: user.lastName,
        
         
          email: user.email,
         
          
        },
      });*/
      return res.cookie("tokenAccess",tokenlog).send({message:"you are logged in"}) 
      
    } catch (err) {
      return res.status(500).json({ message: err});
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
        { user: user.email},
        process.env.RESET_PASSWORD_KEY,
        { expiresIn: "20m" }
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
    res.cookie("tokenAccess", "", {
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

    const user = await User.findOne({ email: req.user })
    console.log(user)
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,

       
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

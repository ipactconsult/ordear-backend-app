
const exp=require('express')

const route=exp.Router()
const employees=require('../Entities/Employee')

var bcrypt=require('bcryptjs')
var CryptoJS=require('crypto-js')
var jwt=require('jsonwebtoken')
const sessions = require('../Entities/EmployeeSession')
const Post = require('../Entities/Post')
const { session } = require('passport')

const nodemailer = require("nodemailer");
const { error } = require("console");
const RandomString = require("randomstring");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'donia.zidi.dz@gmail.com',    
    pass:'vzxawfjnnpzkijpu',
  },
});

/**************************************************add franchise_responsible **********************************************************************/
route.post('/add_franchise_responsible',async(req,res)=>{
    Post.find({post:"Responsible_Franchise"},(err,docs)=>{
        if(err) res.send(err)
        else 
        {
            console.log(docs[0]._id)
            var salt = bcrypt.genSaltSync(15);
          employees.create({
            username:req.body.username,
            email:req.body.email,
            password: bcrypt.hashSync(req.body.password, salt),
            phone:req.body.phone,
            image:req.body.image,
            address:req.body.address,
            role:docs[0]._id,
            restaurant:req.body.restaurant
          },(err,docs)=>{
            if(err) res.send(err)
            else res.send(docs)
          })  
        }
    })
})
/*******************************************************************************************************************/
route.post('/sign_up_super_admin',async(req,res)=>{
    Post.find({post:"super-admin"},(err,docs)=>{
        if(err) res.send(err)
        else 
        {
            console.log(docs[0]._id)
            var salt = bcrypt.genSaltSync(15);
          employees.create({
            username:req.body.username,
            email:req.body.email,
            password: bcrypt.hashSync(req.body.password, salt),
            phone:req.body.phone,
            image:req.body.image,
            address:req.body.address,
            role:docs[0]._id,
          
          },(err,docs)=>{
            if(err) res.send(err)
            else res.send(docs)
          })  
        }
    })
})

/***********************************************simple login **************************************** */
route.post('/Login',async(req,res)=>{
    const{email, password} = req.body;
    if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Not all fields have been entered" });
      }
    //var salt = bcrypt.genSaltSync(10);  
    employees.find({  
        email:email,   
    },(err,docs)=>{
        if(err){
            res.send(err)
        }
        else { 
             console.log(docs)
             if(docs.length==0)
             {
                res.send('not found')
             }
             else  {
                if( bcrypt.compareSync(password, docs[0].password)==true )
           {
            let user=docs
            console.log("found")
             // res.send("correct") 
                 
                var hash = CryptoJS.SHA256(email+password)
                            
                let jwtSecretKey = hash.toString(CryptoJS.enc.Base64);

                let data = {
                    time: Date(),
                    Email:docs[0].email,
                    Username:docs[0]._id,
                // iss:hash
                }
                let  init_time=new Date(Date.now())
                let expire=   new Date(Date.now()+8*3600000)
                const token = jwt.sign(data, jwtSecretKey);
                console.log(token)
                sessions.create({
                    employee:data.Username,
                    token_parsed:token,
                    init_time:init_time,
                    expire:expire
                },
                (err,docs)=>{
                if(err) res.send(err)
                sessions.find({employee:user[0]._id},(err,docs)=>{
                    if(err) res.send(err)
                    else res.send(docs)
                })
               
              });
            }}}
           
          
        });
    });                                   
/**************************************************login as Franchise_responsible*********************************************************************************/
route.post('/login_as_a_franchise_responsible/:email',async(req,res)=>{
    var salt = bcrypt.genSaltSync(10);  
    employees.find({  
        email:req.params.email,
        
    },(err,docs)=>{
        if(err){
            res.send(err)
            
        }
        else { 
             console.log(docs)
             if(docs.length==0)
             {
                res.send('not found')
             }
             else if(docs.length!=0)
             {
                if(req.body.password==undefined)
                { 
                    console.log('undefined')
                    res.send(500,'no password provided ')
                }
            else { //console.log(req.body.password)
           if( bcrypt.compareSync(req.body.password, docs[0].password)==true)
           {
            var role = docs[0].role
            var hash = CryptoJS.SHA256(req.params.email+req.params.password)
            
            let jwtSecretKey = hash.toString(CryptoJS.enc.Base64);
            
            let data = {
                time: Date(),
                Email:docs[0].email,
                Username:docs[0]._id,
               // iss:hash
            }
          
            const token = jwt.sign(data, jwtSecretKey);
            console.log(token)
            let  init_time=new Date(Date.now())
            let expire=   new Date(Date.now()+8*3600000)
            console.log("init=>"+init_time)
            console.log("expire="+req.body.auth_token)
            console.log("expiredate="+req.body.auth_token_expire)
            if(init_time.getTime()>new Date(req.body.auth_token_expire).getTime()) {
                res.send("token expired")
            }
            else {
                  
                sessions.create({
                    employee:data.Username,
                    token_parsed:token,
                    init_time:init_time,
                    expire:expire
                })
                Post.find({_id:role},(err,docs)=>{
                    if(err)
                    console.log(err)
                    else { 
                     //   console.log(docs)
                    if(docs[0].post=="responsible_restaurant")
                    res.redirect('http://localhost:3000/login_as_restaurant_responsible?q='+token)
                    else if(docs[0].post=="Responsible_Franchise")
                    res.redirect('http://localhost:3000/login_as_franchise_responsible?q='+token)
                    else if(docs[0].post=="super-admin")
                    res.redirect('http://localhost:3000/login_as_super-admin?q='+token)
                    }
                })
                
            }
            // var token= hash.toString(CryptoJS.enc.Base64)
            
           }
           else 
           {
            res.send('incorrect credentials')
           }
        }
        }
    }
    })  
})
/**************************************************add restaurant_responsible  **********************************************************/
route.post('/add_restaurant_responsible',async(req,res)=>{
    
                            Post.find({post:"responsible_restaurant"},(err,docs)=>{
                                if(err) res.send(err)
                                else 
                                {
                                    console.log(docs[0]._id)
                                    console.log(req.body.password)
                                    var salt = bcrypt.genSaltSync(15);
                                  employees.create({
                                    username:req.body.username,
                                    email:req.body.email,
                                    password: bcrypt.hashSync(req.body.password, salt),
                                    phone:req.body.phone,
                                    image:req.body.image,
                                    address:req.body.address,
                                    role:docs[0]._id,
                                    restaurant:req.body.restaurant
                                  },(err,docs)=>{
                                    if(err) { res.send(err) }
                                    else{ 
                                    res.send(docs)
                                    }
                                  })  
                                }
                            })      
                         }
                        
                    )
/**********************************************set password*********************************************************/
route.put("/set_password/:id",async(req,res)=>{
                       var salt = bcrypt.genSaltSync(10);
                           employees.updateOne(
                            { "_id": req.params.id}, // Filter
                            {$set:{"password":  bcrypt.hashSync(req.body.password, salt)}} // Update
                        )
                        .then((obj) => {
                            console.log('Updated - ' + obj);
                            res.send(obj)
                        })
                        .catch((err) => {
                            console.log('Error: ' + err);
                        })

})  
/******************************Login**********************************/     
route.post('/SignIn',async (req, res) => {
    var salt = bcrypt.genSaltSync(10);  
    try {
      const { email, password } = req.body;
      //validate
      if (!email || !password) {
        //console.log(err)
        return res
          .status(400)
          .json({ message: "Not all fields have been entered" });
      }
      const user = await employees.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "No account with this email has been founded" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Invalid credentials')
        return res.status(400).json({ message: "Invalid credentials" });
        
      }
       
      //Using token for login
      const token = jwt.sign({ id: user._id }, `${process.env.JWT_SECRET}`);
      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          image: user.image,
          address: user.address,
        },
      });
      console.log('connected')
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  },)   

  /*****************************Forgot password************************/

  route.put('/forgotPass', async (req, res) => {
 
    const { email } = req.body;
    employees.findOne({ email }).exec((err, user) => {
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
      from:"donia.zidi.dz@gmail.com",
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

     
    
 }),
  
 route.post('/codePass',  async (req, res) => {
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

        employees.findOne({ email }).exec(async (err, user) => {
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

          console.log('code verified'); 

          res.cookie("tokenForgotPass", tokenForgotPass, { expiresIn: "10m" });  

          const options = {
            from:"donia.zidi.dz@gmail.com",
            to: email,
            subject: "Code verified",
            html: `
                 <div style="max-width: 700px; margin:auto; border: 5px solid #ddd; padding: 50px 20px; font-size: 110%;">
                 <h2 style="text-align: center; text-transform: uppercase;color: blue;">Welcome to Ordear</h2>
                 <p>Congratulations! 
                     Your adress email is verified.
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
          
        
        });
      }
    );
  } else {
    return res.status(401).json({ error: "Authentication error." });
  }

}),

route.put('/resetPass',  async (req, res) => {
  const tokenForgotPass = req.cookies.tokenForgotPass;

      const { resetLinkPass, newPass } = await req.body;
      
      var salt = await bcrypt.genSaltSync(10);
      employees.updateOne(
       {tokenForgotPass}, // Filter
       {$set:{"password":  await bcrypt.hashSync(req.body.password, salt)}} // Update
   )
   .then((obj) => {
       console.log('Updated - ' + obj);
       res.send(obj)
   })
   .catch((err) => {
       console.log('Error: ' + err);
   })

}),



                
module.exports=route
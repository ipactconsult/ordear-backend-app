const exp=require('express')
const route=exp.Router()
const employees=require('../Entities/Employee')
var bcrypt=require('bcryptjs')
var CryptoJS=require('crypto-js')
var jwt=require('jsonwebtoken')
const sessions = require('../Entities/EmployeeSession')
const Post = require('../Entities/Post')
/**************************************************add employee********************************************************/
route.post('/add_employee',async(req,res)=>{
   
                            var salt = bcrypt.genSaltSync(15);
                            employees.create({
                                username:req.body.username,
                                email:req.body.email,
                                password: bcrypt.hashSync(req.body.password, salt),
                                phone:req.body.phone,
                                image:req.body.image,
                                address:req.body.address,
                               // role:req.body.role,
                               // restaurant:req.body.restaurant
                            },(err,docs)=>{
                                if(err){
                                    res.send(err)       
                                }
                                else res.send(docs)
                            })                          
                        
                      
                    
            
    //console.log(req.headers.authorization.substring(6,req.headers.authorization.length))
})
/**************************************************assign post to  employee********************************************************/
route.post('/assign_post_to_employee/:id_emp',async(req,res)=>{
    
    var salt = bcrypt.genSaltSync(10);
    employees.updateOne(
        { "_id": req.params.id_emp}, // Filter
        {$set:{"role":req.body.role}} // Update
    )
    .then((obj) => {
        console.log('Updated - ' + obj);
        res.send(obj)
    })
    .catch((err) => {
        console.log('Error: ' + err);
    })
})
/**************************************************get  employee role (admin-executive-responsible)********************************************************/
route.get('/get_role/:id_emp',async(req,res)=>{
    var salt = bcrypt.genSaltSync(10);
    employees.find(
        { "_id": req.params.id_emp}, // Filter
          )
    .then((obj) => {
      //  console.log('Updated - ' + obj);
        Post.find({"_id":obj[0].role},(err,docs)=>{if(err) res.send(err)
        else res.send(docs)})
         })
    .catch((err) => {
        console.log('Error: ' + err);
    })
})
/**************************************************login_employee********************************************************/ 
route.post('/login_employee/:email',async(req,res)=>{
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
        else { console.log(req.body.password)
       if( bcrypt.compareSync(req.body.password, docs[0].password)==true)
       {
        
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
            res.redirect('http://localhost:3000/login_as_executor?q='+token) 
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
/**************************************************get auth employee ************************************************* */
route.post('/auth_employee/',async(req,res)=>{
    sessions.find({token_parsed:req.body.token},(err,docs)=>{
        if(err)
         { console.log(err)
            res.send(err)}
         else {
            console.log(docs)
            res.send(docs)
         }
    })
})
route.post('/register_with_twitter',async(req,res)=>{
})
/**************************************************view employee(executor+responsible) profile*******************************************************/
route.get("/view_profile/:id",async(req,res)=>{
    sessions.find({employee:req.params.id},(err,docs)=>{
        if(err){
            res.send(err)     
        }
        else {
            console.log(docs)
            if(docs.length==0)
            {
                res.send("you must activate your account by validating your email")
            }
            else {
    employees.find({_id:req.params.id},(err,docs)=>{
        if(err)
        {
            res.send(err)

        }
        else {
            res.send(docs)
        }
    })
}
}
})
})
/***************************************************edit employee (executor+responsible) profile *****************************************************/
route.put("/edit_profile/:id",async(req,res)=>{
    sessions.find({customer:req.params.id},(err,docs)=>{
        if(err){
            res.send(err)     
        }
        else {
            if(docs[0].length==0)
            {
                res.send("you must activate your account by validating your email")
            }
            else {
                    employees.updateOne(
                        { "_id": req.params.id}, // Filter
                        {$set:{"phone":req.body.phone,"address":req.body.address,"image":req.body.image,"password":req.body.password}} // Update
                    )
                    .then((obj) => {
                        console.log('Updated - ' + obj);
                        res.send(obj)
                    })
                    .catch((err) => {
                        console.log('Error: ' + err);
                    })
            }
        }
    })
})
/********************************************************************************/
route.get('/list/:id_rest',async(req,res)=>{
    employees.aggregate([{
        $lookup:
        {
          from: "posts",
          localField: "role",
          foreignField: "_id",
          as: "role"
        }
    }],(err,docs)=>{
        if(err) res.send(err)
        else 
        {
            let array=docs
            Post.find({post:'responsible_restaurant'},(err,result)=>{
                if(err) res.send(err)
                else {
                  //  console.log(array)
                   // console.log(result[0]._id)
                  let list = array.filter(e=>e.role[0]._id!=result[0]._id.toString())
                 // console.log(list)
                  Post.find({post:'Responsible_Franchise'},(err,result1)=>{
                   // console.log(result1)
                    let list1 = list.filter(e=>e.role[0]._id!=result1[0]._id.toString())
                    
                    //res.send(list1)
                    Post.find({post:'super-admin'},(err,result2)=>{
                       // console.log(result2)
                        let list2 = list1.filter(e=>e.role[0]._id!=result2[0]._id.toString()).filter(e=>e.restaurant==req.params.id_rest)
                        
                        res.send(list2)
                      })
                  })
                }

            })
        }
    })
})
/**************************************************viewprofile**********************************************/
route.get('/getUserProfile', async (req, res) => {
    try {
      const userId = req.user.id; // Assuming you're using some kind of authentication middleware to get the user ID from the request object
      const user = await employees.findOne({ _id: userId });
      if (!user) {
        return res
          .status(400)
          .json({ message: "No account with this ID has been found" });
      }
      res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        image: user.image,
        address: user.address,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  });
module.exports=route
const users=require('../Entities/User')
const Post = require('../Entities/Post')
const AddExecutor = async(req,res)=>{   
    var salt = bcrypt.genSaltSync(15);
    users.create({
        username:req.body.username,
        email:req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        phone:req.body.phone,
        image:req.body.image,
        address:req.body.address,
        role:req.body.role,
        restaurant:req.body.restaurant
    },(err,docs)=>{
        if(err){
            res.send(err)       
        }
        else res.send(docs)
    })                          
}
const AssignRoleToExecutor = async(req,res)=>{
    users.updateOne(
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
}
const RetrieveExecutor = async(req,res)=>{
    users.find({_id:req.params.id},(err,docs)=>{
        if(err)
        {
            res.send(err)

        }
        else {
            res.send(docs)
        }
    })
    }
 const Edit_Executor  =   async(req,res)=>{
    
      
        users.updateOne(
            { "_id": req.params.id}, // Filter
            {$set:{"phone":req.body.phone,"address":req.body.address,"image":req.body.image,"password":bcrypt.hashSync(req.body.password, salt)}} // Update
        )
        .then((obj) => {
            console.log('Updated - ' + obj);
            res.send(obj)
        })
        .catch((err) => {
            console.log('Error: ' + err);
        })
}
const DisplayEmployeesByRestaurant= async(req,res)=>{
    users.aggregate([{
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
}
const GetRole = async(req,res)=>{
    users.find(
        { "_id": req.params.id_emp})
    .then((obj) => {
      //  console.log('Updated - ' + obj);
        Post.find({"_id":obj[0].role},(err,docs)=>{if(err) res.send(err)
        else res.send(docs)})
         })
    .catch((err) => {
        console.log('Error: ' + err);
    })
}
module.exports={
    AddExecutor,
    AssignRoleToExecutor,
    RetrieveExecutor,
    Edit_Executor,
    DisplayEmployeesByRestaurant,
    GetRole
}
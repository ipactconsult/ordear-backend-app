const jwt = require('jsonwebtoken');
function auth(req,res,next){
    try{
        const token = req.cookies.tokenAccess;
          
        if(!token) return console.log('err');
       //res.status(401).json({token});
              
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        //console.log({verified});
        req.user = verified.user;
        console.log('test if this works'+req.user)
                next();
    }catch(err){
        console.error(err);
        res.status(401).json({errorMessage:"Unauthorized"})
    }
}

module.exports=auth;
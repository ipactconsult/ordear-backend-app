const jwt = require('jsonwebtoken');
function auth(req,res,next){
    try{
        const token = req.cookies.token;
        console.log({token});
        if(!token) return console.log('err');
        res.status(401).json({token});
        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log({verified});
        req.user = verified.user;
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({errorMessage:"Unauthorized"})
    }
}

module.exports=auth;
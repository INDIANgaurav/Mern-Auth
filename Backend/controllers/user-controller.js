const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET_KEY = "MyKey";


//SIGN-UP 
const signup = async( req,res) => {
    let existingUser ;
    const {name, email, password} = req.body ;

    try{
        existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                message: 'User Already Exists'
            })
        }
    }catch(err){
        console.log(err)
    }
    const hashedPassword = bcrypt.hash(password,10);
    const user = new User({
        name,
         email,
        password: hashedPassword ,
        
    });
    try{
        await user.save();


    }catch(err){
        console.log(err)
    }


return res.status(201).json({
    message: 'User Created ' , user
})
}

// LOG-IN
const login =async (req, res) => { 
    const {email,password} = req.body ;
    let existinguser ;
    try{
        existinguser = await User.findOne({email})
    }catch(err){
    return new Error(err)
    }


    if(!existinguser){
        return res.status(400).json({
            message: 'User Does Not Exist'
        })
    }

    const isPassword = bcrypt.compareSync(password, existinguser.password) ;
    if(!isPassword){
        return res.status(400).json({
            message: 'Password Does Not Match'
        })
    }
     //generate token 
    const token = jwt.sign( {id:existinguser._id } ,  JWT_SECRET_KEY , {
         expiresIn: "30s" 
    })

    res.cookie(String(existinguser._id),token,{
        path: '/',
        expires : new Date(Date.now() + 1000*60*60*3),
        httpOnly: true,
        sameSite:"lax"

    })


    return res.status(200).json({ 
        message: 'User Logged In',
        user: existinguser,
        token
    })


}


// TOKEN VERIFICATION
const verifyToken = (req,res,next) =>{
    const cookies = req.headers.cookie;
    console.log("your cookie is: " + cookies)
    const token = cookies.split("=")[1];
    console.log( "your token :-" ,token)
    
    if(!token){
        return res.status(400).json({
            message: 'No Token Provided'
        })
    }
    jwt.verify(String(token), JWT_SECRET_KEY , (err,user) => {
        if(err){
            return res.status(400).json({
                message: 'Invalid Token'
            })
        }
        
        console.log( "user id ->",user.id )   ;
        req.id = user.id ;
        

    });
    next();
 
} 

// GET USER
const getUser =async (req, res) => {
    const userId = req.id ;
    let user ;
    try{
        user = await User.findById(userId, "-password" ) ;

    }catch(err){
        return new Error(err) ;
    }

if(!user){
    return res.status(400).json({
        message: 'User Does Not Exist'
    })
}

return res.status(200).json({
    message: 'User Retrieved',
    user

})
}


exports.signup = signup
exports.login = login ;
exports.verifyToken = verifyToken ;
exports.getUser = getUser ;
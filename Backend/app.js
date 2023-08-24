 const express = require('express');
 const mongoose = require('mongoose');
 const  router = require('./routes/user-routes');
 const app = express();
 const cookieParser = require('cookie-parser');
app.use(express.json())
app.use( '/api' , router ) ;

app.use(cookieParser())


 mongoose.connect("mongodb+srv://gaurav:XMSGZ9F0J6XYFkR4@cluster0.zcwmy4j.mongodb.net/")
 .then(()=>{
    app.listen(5000);
    console.log("connected to Database");
 }).catch((err)=> console.log(err));

 
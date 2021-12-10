const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express(); 
const port = 3000; 
const jsonfile = require('jsonfile');
const mongoose = require('mongoose');

const User = require('./models/user');
const Product = require('./models/product');
const Favorite = require('./models/favorite');
mongoose.set('useFindAndModify', false);
//updated the new password here
mongoose.connect("mongodb+srv://max:ppFhpzx1OyT3JU4l@cluster0.w1omp.mongodb.net/group_project?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to the database!');
  }).catch((e) => {
    console.log('Connection failed! ' + e);
  });


app.use(cors());

app.listen(port, () =>
    console.log(`Server Started at http://localhost:${port}`)
)

//http://localhost:3000/validateemailifexist
app.post('/validateemailifexist', urlencodedParser, (req, res)=>{
    var email = req.body.email;

    var auth = User.findOne({email: email}).exec();
    auth.then(function (doc) {
        console.log(doc + " " + email);
        if(doc != null){
            res.status(200).send({message: "Success", "messagedesc": "This email is recognized."});
        }else{
            res.status(404).send({message: "Failed", "messagedesc": "This email is unrecognized."});            
        }
    });
})

//http://localhost:3000/getuser
app.post('/getuser', urlencodedParser, (req, res)=>{ 
    var id = req.body.id;
    var auth = User.findById(id).exec();
    auth.then(function(doc){
        if(doc != null){
            res.status(200).send({message: "Success", user: doc});
        }else{
            res.status(404).send({message: "Failed", user: ""});
        }
    });
})

//http://localhost:3000/login
app.post('/login', urlencodedParser, (req, res)=>{
    var email = req.body.email;
    var password = req.body.password;

    var auth = User.findOne({email: email, password: password}).exec();
    auth.then(function(doc){
        if(doc != null){
            res.status(200).send({message: "Success", user: doc});
        }else{
            res.status(200).send({message: "Failed", user: ""});
        }
    });
})

//http://localhost:3000/register -- REGISTRATION
app.post('/register', urlencodedParser, (req,res)=>{
    
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var phone_number = req.body.phone_number;
    var age = req.body.age;
    
    try {
        const user = new User({
            name: name,
            email: email,
            password: password,
            phone_number: phone_number,
            age: age
        });
        
        var errorbuild = [];
        
        if(name == null || name == ""){
            errorbuild.push("Name[required]");
        }

        if(email == null || email == ""){
            errorbuild.push("Email[required]");
        }

        if(password == null || password == ""){
            errorbuild.push("Password[required]");
        }

        if(phone_number == null || phone_number == ""){
            errorbuild.push("Phone Number[required]");
        }

        if(age == null || age == ""){
            errorbuild.push("Age[required]");
        }
        
        if(isNaN(age)){
            errorbuild.push("Age[must be a number]");
        }

        if(isNaN(phone_number)){
            errorbuild.push("Phone Number[must all be numbers]");
        }
        

        if(errorbuild == ""){
            var auth = User.findOne({email: email}).exec();
            auth.then(function(doc){
                if(doc != null){
                    res.status(404).send({message: "Failed", messagedesc: "Email[is already registered]"});
                }else{
                    user.save();
                    res.status(200).send({message:"Success"});
                }
            });
        }else{
            res.status(404).send({message: "Failed", messagedesc: errorbuild});
        }

    } catch (error) {
        res.status(404).send({message: error.message});
    }
    
})

//http://localhost:3000/validateemail
app.post('/validateemail', urlencodedParser, (req, res)=>{
    var email = req.body.email;

    var auth = User.findOne({email: email}).exec();
    auth.then(function (doc) {
        if(doc == null){
            res.status(200).send({message: "This is a valid email"});
        }else{
            res.status(404).send({message: "This email is already taken"});
        }
    });
})

//http://localhost:3000/edituser
app.post('/edituser', urlencodedParser,(req, res)=>{
    var id = req.body._id;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var phone_number = req.body.phone_number;
    var age = req.body.age;


    var auth = User.findOne({email: email, _id : {$ne: id}}).exec();
    auth.then(function(doc){
        if(doc != null){
            res.status(404).send({message: "Failed", messagedesc: "Email[is already registered]"});
        }else{ //success
            try{
                var auth = User.findByIdAndUpdate({_id: id}, {name: name, email: email, password: password, phone_number: phone_number, age: age});
            auth.then(function (doc) {
                if(doc != null){
                    res.status(200).send({message: "Success"});
                }else{
                    res.status(404).send({message: "Failed"});
                }
            });
            }catch(e){
                res.status(404).send({message: "Failed"});
            }
        }
    });
})

//http://localhost:3000/insertProducts
app.post('/insertProducts', urlencodedParser, (req,res)=>{
    var name = req.body.name;
    var type = req.body.type;
    var description = req.body.description;
    var price = req.body.price;
    var tags = req.body.tags;
    var image = req.body.image;

    const user = new Product({
        name: name,
        type: type,
        description: description,
        price: price,
        tags: tags,
        image: image
    });
    user.save();
    res.status(200).send({message:"Success"});
});

//http://localhost:3000/getAllProducts
app.get('/getAllProducts', urlencodedParser, (req,res)=>{
    Product.find({}, function(err, products) {
        var productMap = {};

        products.forEach(function(product) {
            productMap[product._id] = product;
        });

        res.status(200).send({message:"Success", products: productMap});
    });
});

//http://localhost:3000/getAllProducts
app.post('/getAllProducts', urlencodedParser, (req,res)=>{
    Product.find({}, function(err, products) {
        var productMap = {};

        products.forEach(function(product) {
            productMap[product._id] = product;
        });

        res.status(200).send({message:"Success", products: productMap});
    });
});

//http://localhost:3000/getOtherProducts
app.post('/getOtherProducts', urlencodedParser, (req,res)=>{
    //var user = "604b5eb72c34ac4bbcbdf8c0";
    var user = req.body.user;
    var productMap = [];
    var auth = Favorite.find({user: {$ne: user}}, function(err, favorites){
        if(err){
            throw error;
        }
        favorites.forEach(function(favorites){
            Product.findById(favorites.product, function(err, product){
                if(err){
                    throw error;
                }
                productMap.push(product);
            }).then(function(doc){
                return res.status(200).send({message:"Success", products: productMap});
            }).catch(error =>{throw error;});
        });
    }).catch(error =>{throw error;});
});

//http://localhost:3000/favoritethisitem
app.post('/favoritethisitem', urlencodedParser, (req,res)=>{
    var user = req.body.user;
    var product = req.body.product;
    
    var auth = Favorite.find({user: user, product: product}, function(err, result){
        if(err){
            throw error;
        }
        console.log(result.length);
        if(result.length){
            console.log("Failed to favorite");
            res.status(200).send({message:"Failed"});
        }else{
            console.log("Success to favorite");
            const favorite = new Favorite({user: user, product: product});
            favorite.save();
            res.status(200).send({message:"Success"});
        }
    }).catch(error =>{throw error;});
});

//http://localhost:3000/unfavoritethisitem
app.post('/unfavoritethisitem', urlencodedParser, (req,res)=>{
    var user = req.body.user;
    var product = req.body.product;
    var auth = Favorite.find({user: user, product: product}, function(err, result){
        if(err){
            throw error;
        }
        console.log(result.length);
        if(result.length == 0){
            console.log("Failed to unfavorite");
            res.status(200).send({message:"Failed"});
        }else{
            console.log("Success to unfavorite");

            Favorite.deleteOne({user: user, product: product}, function(err1, result1){
                console.log(result1);
                if(err1){
                    console.log("err1:"+err1);
                    res.status(200).send({message:"Failed"});
                }else{
                    res.status(200).send({message:"Success"});
                }
            });
        }
    }).catch(error =>{throw error;});
});

//http://localhost:3000/checkiffavorite
app.post('/checkiffavorite', urlencodedParser, (req,res)=>{
    var user = req.body.user;
    var product = req.body.product;
    var auth = Favorite.find({user: user, product: product}, function(err, result){
        if(err){
            res.status(200).send({message:"Failed"});
        }
        console.log("user: " + user + "\nproduct:" + product + result);
        if(result.length == 0){
            res.status(200).send({message:"Failed"});
        }else{
            res.status(200).send({message:"Success"});
        }
    }).catch(error =>{throw error;});
});


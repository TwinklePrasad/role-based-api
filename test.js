const express = require('express'); //"^4.13.4"
const config = require('./config');
const bodyParser = require('body-parser');
var jwt    = require('jsonwebtoken');

const cors = require('cors')
var ObjectId = require('mongodb').ObjectID;
const MongoClient = require("mongodb").MongoClient;

const app = express();


app.use(bodyParser.json());

var mongoose = require("mongoose");
const CONNECTION_URL = "mongodb://localhost:27017/config";
const DATABASE_NAME = "config";



app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var Product = new mongoose.Schema({
 
  Categories_name: {
		type: String
		
	}
});


var database, collection5;
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
       
        collection5 = database.collection("login");
        
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
    app.post('/login', (req, res) => {
        // console.log(req.file) // to see what is returned to you
         //console.log(req.files[0].secure_url);
        
         var product = ({
            // Categories: req.body.Categories,last_name
     
           user_type: req.body.user_type,
            username: req.body.username,
            your_email:req.body.email,
            password: req.body.password,
             
           // mobile:req.body.mobile,
            //Agency: req.body.Agency,
            });
       //  console.log(product);
         collection5.insert(product, (error, result) => {
                        
             res.send(result.result);
             
         });
        
       });
       app.post('/logindata', (req, res) => {
        // console.log(req.file) // to see what is returned to you
        let userdata = req.body;
        console.log(userdata);
         collection5.findOne({"your_email" : userdata.email,"password" : userdata.password}, (error, result) => {
          if(error) {
            return res.status(500).send(error);
        }
        if(result == null){
            res.json({
                success:false
              });
        }else{
           // console.log(result._id);
            const payload = {
                id: result._id    
            };
                  var token = jwt.sign(payload,  
                    config.secret,
                    { expiresIn: '24h' // expires in 24 hours
                    });
                  // return the information including token as JSON
                  res.json({
                    success: true,
                    message: 'login successfull!',
                    token: token
                  });
                } 
            })
       });
       app.get("/getiuserid/:id" , (req,res) =>{

        collection5.find({ "_id": new ObjectId(req.params.id)}).toArray((err , result) =>{
          if(err){
            return res.status(500).send(error);
          }else{
            res.send(result);
            //console.warn(result)
          }
        })
      })
module.exports = app;
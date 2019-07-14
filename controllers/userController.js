// const express = require("express")
// const users = express.Router()
// const cors = require("cors")
// const jwt = require("jsonwebtoken")
// const bcrypt = require("bcrypt")

// const User = require("../models/User")
// users.use(cors())

// process.env.SECRET_KEY = 'secret'

// users.post('/register', (req, res) => {
//     const today = new Date()
//     const userData = {
//         // first_name: req.body.first_name,
//         // last_name: req.body.last_name,
//         email: req.body.email,
//         password: req.body.password,
//         // created: today
//     }

//     User.findOne({
//         email: req.body.email
//     })
//         .then(user => {
//             if (!user) {
//                 bcrypt.hash(req.body.password, 10, (err, hash) => {
//                     userData.password = hash
//                     User.create(userData)
//                         .then(user => {
//                             res.json({ status: user.email + ' registered!' })
//                         })
//                         .catch(err => {
//                             res.send('error: ' + err)
//                         })
//                 })
//             } else {
//                 res.json({ error: 'User already exists' })
//             }
//         })
//         .catch(err => {
//             res.send('error: ' + err)
//         })
// })

// users.post('/login', (req, res) => {
//     User.findOne({
//         email: req.body.email
//     })
//         .then(user => {
//             if (user) {
//                 if (bcrypt.compareSync(req.body.password, user.password)) {
//                     const payload = {
//                         _id: user._id,
//                         // first_name: user.first_name,
//                         // last_name: user.last_name,
//                         email: user.email
//                     }
//                     let token = jwt.sign(payload, process.env.SECRET_KEY, {
//                         expiresIn: 1440
//                     })
//                     res.send(token)
//                 } else {
//                     res.json({ error: "User does not exist" })
//                 }
//             } else {
//                 res.json({ error: "User does not exist" })
//             }
//         })
//         .catch(err => {
//             res.send('error: ' + err)
//         })
// })

// users.get('/', (req, res) => {
//     var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

//     User.findOne({
//         _id: decoded._id
//     })
//         .then(user => {
//             if (user) {
//                 res.json(user)
//             } else {
//                 res.send("User does not exist")
//             }
//         })
//         .catch(err => {
//             res.send('error: ' + err)
//         })
// })

// module.exports = users






const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken')
 
// mongoose.Promise = global.Promise;
 

function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  let payload = jwt.verify(token, 'secretKey')
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }
  req.userId = payload.subject
  next()
}
router.get('/',(req,res)=>{
  res.send('api works');
})

// router.get('/events', (req,res) => {
//   let events = [
//     {
//       "_id": "1",
//       "name": "Auto Expo",
//       "description": "lorem ipsum",
//       "date": "2012-04-23T18:25:43.511Z"
//     },
    
   
//   ]
//   res.json(events)
// })

// router.get('/special', verifyToken, (req, res) => {
//   let specialEvents = [
//     {
//       "_id": "1",
//       "name": "Auto Expo Special",
//       "description": "lorem ipsum",
//       "date": "2012-04-23T18:25:43.511Z"
//     },
    
    
    
    
//   ]
//   res.json(specialEvents)
// })

router.post('/register', (req, res) => {
  let userData = req.body
  let user = new User(userData)
  user.save((err, registeredUser) => {
    if (err) {
      console.log(err)      
    } else {
      let payload = {subject: registeredUser._id}
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({token})
    }
  })
})

router.post('/login', (req, res) => {
  let userData = req.body
  User.findOne({email: userData.email}, (err, user) => {
    if (err) {
      console.log(err)    
    } else {
      if (!user) {
        res.status(401).send('Invalid Email')
      } else 
      if ( user.password !== userData.password) {
        res.status(401).send('Invalid Password')
      } else {
        let payload = {subject: user._id}
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token})
      }
    }
  })
})

module.exports = router;
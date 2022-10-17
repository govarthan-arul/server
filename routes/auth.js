const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const mongodb = require('mongodb')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')
const {v1:uuidv1} = require('uuid')
const { db, updateOne } = require('../image.model')
router.use(express.json())


router.post('/signup', (req,res)=>{
    const {name, email, password, Age, DOB, FavouriteFoods} = req.body
    if(!email || !password || !name || !Age || !DOB || !FavouriteFoods){
       return res.status(422).json({error:'please add all details'})
    }
    res.json({message:'Successfully posted'})

    User.findOne({email:email})
    .then((retid)=>{
        if(retid){
            return res.status(422).json({error:'User already exists with that email'}) 
        }
        const uid = uuidv1();
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
        const user = new User({
            email,
            name, 
            password:hashedpassword,
            Age,
            DOB,
            FavouriteFoods,
            UID: uid
        })

        user.save()
        .then((user)=>{
            res.json({message:'Saved successfully'})
        })
        .catch(err=>{
            console.log(err)
        })
    })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin', (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:'please add email or password'})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:'Invalid email or password'})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:'Successfully signedin'})
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                res.json({token})
            }else{
                return res.status(422).json({error:'Invalid email or password'})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

// router.get('/paid',(req,res)=>{
//     User.find({paid:"true"})
//     .then((result)=>{
//         res.json(result)
//     })
//     .catch(err=>{
//         console.log(err)
//     })
    
// })

router.get('/:name',(req, res)=>{
    
    User.findOne({name:req.params.name},{name:1,Age:1,email:1,DOB:1,FavouriteFoods:1})
    .then((result)=>{
        User.password = undefined
        res.json(result)
    })
    .catch(err=>{
        console.log(err)
    }) 
})

router.delete('/:name',async (req, res) => {
    const result =await User.deleteOne({name:req.params.name})
    res.send(result)
})

router.patch('/:name',async (req, res) => {
    const result = await User.updateOne({name:req.params.name},{$set:{Age:req.body.Age,DOB:req.body.DOB,FavouriteFoods:req.body.FavouriteFoods}})
    res.send(result)
})

router.get('/',(req,res)=>{
    User.find({},{name:1,email:1,DOB:1,Age:1,FavouriteFoods:1})
    .then((result)=>{
        res.json(result)
    })
    .catch((err)=>{
        console.log(err)
    })
})

module.exports = router
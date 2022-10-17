const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGOURI} = require('./keys')
const multer = require('multer')
//const fs = require('fs')
//const Imagemodel = require('./image.model')
//const imgModel = require('./model');
const bodyParser = require('body-parser')
//const path = require('path')
require('dotenv/config');

require('./models/user')
require('./models/post')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
  

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))


mongoose.connect(MONGOURI)
mongoose.connection.on('connected',()=>{
    console.log('connected to DB')
})
mongoose.connection.on('error',(err)=>{
    console.log('error',err)
})

// const Storage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null, 'uploads')
//     },
//     filename:(req,file,cb)=>{
//         cb(null,file.fieldname + '-' +Date.now())
//     }
// })

// const upload = multer({
//     storage:Storage
// })

// app.post('/upload',(req,res)=>{
//     upload(req,res,(err)=>{
//         if(err){
//             console.log(err)
//         }else{
//             const newImage = new Imagemodel({
//                 name:req.body.name,
//                 image:{
//                     data:req.file.filename,
//                     contentType:'image/jpg'
//                 }
//             })
//             newImage.save()
//             .then(()=>res.send('Successfully uploaded'))
//             .catch(err=>{
//                 console.log(err)
//             })
//         }
//     })

// })

// app.get('/', (req, res) => {
//     imgModel.find({}, (err, items) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('An error occurred', err);
//         }
//         else {
//             res.render('imagesPage', { items: items });
//         }
//     });
// });

// app.post('/', upload.single('image'), (req, res, next) => {
//     var obj = {
//         name: req.body.name,
//         desc: req.body.desc,
//         img: {
//             data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
//             contentType: 'image/png'
//         }
//     }
//     imgModel.create(obj, (err, item) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             // item.save();
//             res.redirect('/');
//         }
//     });
// });

// app.get('/images',(req,res)=>{
//     const {name} = req.body
//     Imagemodel.findOne({name:name},(err,data)=>{
//         if(err){
//             res.json({error:'Try'})
//         }else{
//             console.log(data)
//             res.sendFile('/imagemodels/sample.jpg')
//         }
//     })
// })

app.listen(PORT,()=>{
    console.log('Server up and running', PORT)
})
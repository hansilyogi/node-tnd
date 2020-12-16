var express = require('express');
var router = express.Router();
var cors = require("cors");
var fs = require('fs'); 
var path = require('path');
var multer = require('multer');
var model = require('../model/test.model');
const { json } = require('body-parser');
var cloudinary = require('cloudinary').v2;

var storage = multer.diskStorage({ 
  destination: (req, file, cb) => { 
      cb(null, 'uploads') 
  }, 
  filename: (req, file, cb) => { 
      cb(null, file.originalname + '-' + Date.now()) 
  } 
});

var upload = multer({ storage: storage });

router.get('/',async function(req,res,next){
  var record = await model.find({},function(err,data){
    var result = {};
    if(err){
      // result.Message= "Not Found.";
      // result.Data = [];
      // result.isSuccess = false;
      // return res.status(404).json(result);
      res.status(500).json({ IsSuccess: false , Data: [] , Message: "Not Found" });
    }
    else{
      // result.Message= "Found.";
      // result.Data = data;
      // result.isSuccess = true;
      res.status(200).json({ IsSuccess: true , Data: [data] , Message: "Data Found" });
    }
  });
});

router.post('/deletee' ,async function(req,res,next) {
  var id =  req.body.id;
  try {
    let data = await model.findByIdAndDelete(id);
    if(data) {
      res.status(200).json({ Message : "Deleted Successfully" ,Data : 1, IsSuccess : true});
    }
    else{
      res.status(200).json({ Message : "User Not Found" , Data : 0, IsSuccess : true});
    }

  }
  catch (err){
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
  }
});

/* POST Personal Information Directory. */

router.post('/:name',upload.single('img'), function(req, res, next) {
  var name = req.params.name;
  console.log(name);
  
  if(req.file){
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: 'dckj2yfap',
      api_key: '693332219167892',
      api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
    });
    var path = req.file.path;
    var uniqueFilename = new Date().toISOString();
    console.log(path);
    console.log(uniqueFilename);
    console.log(req.body);
    cloudinary.uploader.upload(
      path,
      { public_id: `blog/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
      function(err, image) {
        if (err) return res.send(err)
        console.log('file uploaded to Cloudinary');
        // remove file from server
        const fs = require('fs');
        fs.unlinkSync(path);
        // return image details
        var image_data = json(image);
        console.log(image_data);
      }
    )
  }
  if(req.file){
    var record = new model({
      date_of_birth : req.body.date_of_birth,
      gender : req.body.gender,
      address : req.body.address,
      spouse_name : req.body.spouse_name,
      spouse_birth_date : req.body.spouse_birth_date,
      number_of_child : req.body.number_of_child,
      img:'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/'+uniqueFilename,
      keyword: req.body.keyword,
      business_category: req.body.business_category,
      experience: req.body.experience,
      about_business: req.body.about_business,
      achievement: req.body.achievement
    });
  }else{
    var record = new model({
      date_of_birth : req.body.date_of_birth,
      gender : req.body.gender,
      address : req.body.address,
      spouse_name : req.body.spouse_name,
      spouse_birth_date : req.body.spouse_birth_date,
      number_of_child : req.body.number_of_child,
      keyword: req.body.keyword,
      business_category: req.body.business_category,
      experience: req.body.experience,
      about_business: req.body.about_business,
      achievement: req.body.achievement
    });
  }

  // console.log(record);

  if(req.file){
    model.findOneAndUpdate({name:req.params.name},{
      date_of_birth : record.date_of_birth,
      gender : record.gender,
      address : record.address,
      spouse_name : record.spouse_name,
      spouse_birth_date : record.spouse_birth_date,
      number_of_child : record.number_of_child,
      img: 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/'+uniqueFilename,
      keyword: record.keyword,
      keyword: record.keyword,
      business_category: record.business_category,
      experience: record.experience,
      about_business: record.about_business,
      achievement: record.achievement
    },(err,record)=>{
      var result = {};
      if(err){
        // result.Message= "Not Found.";
        // result.Data = [];
        // result.isSuccess = false;
        return res.status(200).json({ IsSuccess: false, Data: 0 , Message: err.message});
      }
      else{
        // result.Message= "Found.";
        // result.Data = record;
        // result.isSuccess = true;
        return res.status(200).json({ IsSuccess: true, Data: [record] , Message: "Data Found" });
      }
    });
  }else{
    model.findOneAndUpdate({name:req.params.name},{
      date_of_birth : record.date_of_birth,
      gender : record.gender,
      address : record.address,
      spouse_name : record.spouse_name,
      spouse_birth_date : record.spouse_birth_date,
      number_of_child : record.number_of_child,
      keyword: record.keyword,
      keyword: record.keyword,
      business_category: record.business_category,
      experience: record.experience,
      about_business: record.about_business,
      achievement: record.achievement
    },(err,record)=>{
      var result = {};
      if(err){
        // result.Message= "Not Found.";
        // result.Data = [];
        // result.isSuccess = false;
        return res.status(200).json({ IsSuccess: false , Data: 0 , Message: "Not Found"});
      }
      else{
        // result.Message= "Found.";
        // result.Data = record;
        // result.isSuccess = true;
        return res.status(200).json({ IsSuccess: true , Data: record , Message: "Found" });
      }
    });
  }

});

module.exports = router;

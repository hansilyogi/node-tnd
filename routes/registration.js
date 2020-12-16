var express = require('express');
var router = express.Router();
var cors = require("cors");
var model = require('../model/test.model');
const { param } = require('./users');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
const isEmpty = require('lodash.isempty');
var moment = require('moment');
const testModel = require('../model/test.model');
var axios = require("axios");

var userProfile = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "uploads/users");   
  },
  filename: function (req, file, cb) {
      cb(
          null,
          file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      );
  },
});

var uploadUserProfile = multer({ storage: userProfile });

/* POST Registration (http://localhost:3000/registration) */ 
router.post('/', async function(req, res, next) {

  if(isEmpty(req.body)){
    res.status(404).send("404 ERROR");
  }
  else{
    var record = new model({
      name : req.body.name,
      mobile : req.body.mobile,
      email : req.body.email,
      company_name : req.body.company_name,
      referred_by : req.body.referred_by,
      fcmToken: req.body.fcmToken,
      isVerified: req.body.isVerified,  
    });
    console.log(record);
    record.save();
    return res.status(200).send({ IsSuccess: true, Message : "Registration Successfull" , Data: [record]});
  }
});

//add personal Information
router.post("/updatePersonal" , uploadUserProfile.single("img") , async function(req,res,next){
  const { id , name , email , mobile , company_name , referred_by , date_of_birth , gender, 
          address , spouse_name , spouse_birth_date , achievement ,
          number_of_child , img , memberOf, business_category, experience, about_business, 
          faceBook , instagram , linkedIn , twitter , whatsApp , youTube
        } = req.body;
  const file = req.file;
  if(req.file){
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: 'dckj2yfap',
      api_key: '693332219167892',
      api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
    });
    var path = req.file.path;
    var uniqueFilename = new Date().toISOString();
    // console.log(path);
    // console.log(uniqueFilename);
    // console.log(req.body);
    cloudinary.uploader.upload(
      path,
      { public_id: `blog/users/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
      function(err, image) {
        if (err) return res.send(err)
        // console.log('file uploaded to Cloudinary');
        // remove file from server
        const fs = require('fs');
        fs.unlinkSync(path);
        // return image details
        // var image_data = json(image);
        // console.log(image_data);
      }
    )
  }
  try {
    var update = {
      name : name,
      mobile : mobile,
      email : email,
      company_name : company_name,
      referred_by : referred_by,
      date_of_birth: date_of_birth,
      gender: gender,
      address: address,
      spouse_name: spouse_name,
      spouse_birth_date: spouse_birth_date,
      achievement: achievement,
      number_of_child: number_of_child,
      img: file == undefined ? "" : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/users/'+uniqueFilename,
      memberOf: memberOf,
      business_category: business_category,
      experience: experience,
      about_business: about_business,
      faceBook: faceBook,
      instagram: instagram,
      linkedIn: linkedIn,
      twitter: twitter,
      whatsApp: whatsApp,
      youTube: youTube,
    }
    var record = await model.findByIdAndUpdate( id , update );
    let dataPass = await model.find({ _id: id });
    res.status(200).json({ IsSuccess: true , Data: dataPass , Message: "Data Updated" });  
  } catch (error) {
    res.status(500).json({ IsSuccess: false , Message: error.message });
  }
});

// router.post("/sendotp", async function(req, res, next) {
//   const { mobile, code, appSignature } = req.body;
//   try {
//       let message = "Your verification code is " + code + " " + appSignature;
//       let msgportal =
//           "http://promosms.itfuturz.com/vendorsms/pushsms.aspx?user=" +
//           process.env.SMS_USER +
//           "&password=" +
//           process.env.SMS_PASS +
//           "&msisdn=" +
//           mobile +
//           "&sid=" +
//           process.env.SMS_SID +
//           "&msg=" +
//           message +
//           "&fl=0&gwid=2";
//       let getresponse = await axios.get(msgportal);
//       if (getresponse.data.ErrorMessage == "Success") {
//           res
//               .status(200)
//               .json({ Message: "Message Sent!", Data: 1, IsSuccess: true });
//       } else {
//           res
//               .status(200)
//               .json({ Message: "Message Not Sent!", Data: 0, IsSuccess: true });
//       }
//   } catch (err) {
//       res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
//   }
// });

router.post("/verify", async function(req, res, next) {
  const { mobile, fcmToken } = req.body;
  try {
      let updateCustomer = await testModel.findOneAndUpdate({ mobile: mobile }, { isVerified: true, fcmToken: fcmToken });
      if (updateCustomer != null) {
          res
              .status(200)
              .json({ Message: "Verification Complete!", Data: 1, IsSuccess: true });
      } else {
          res
              .status(200)
              .json({ Message: "Verification Failed!", Data: 0, IsSuccess: true });
      }
  } catch (err) {
      res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
  }
});

router.get('/registration/:id',async function(req,res){
  var name = req.params.id;
  var query = { name : name };  
 
  var record = await model.find(query);
  console.log(record);
  if(record){
    res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Data Found" });
  }else{
    res.status(200).json({ IsSuccess: false , Data: 0 , Message: "Data not found" });
  }
});

module.exports = router;

//git remote add origin git@github.com:VENDETTA-STACK/blog-vlog.git
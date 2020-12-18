var express = require('express');
const app = require('../app.js');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
const path = require('path');
// var moment = require('moment');
const moment = require('moment-timezone');
const mongoose = require("mongoose");

var newsCategorySchema = require('../model/newsCategory.js');
var titleSchema = require('../model/titleModel');
var bannerSchema = require('../model/bannerModel');
var offerSchema = require('../model/offerModel');
var newsModelSchema = require('../model/newsModel');
var successStorySchema = require('../model/successStoryModel');
var eventSchema = require('../model/eventModel');
const bannerModel = require('../model/bannerModel');
var directoryData = require('../model/test.model');
var businessCategorySchema = require('../model/businessCategoryModel');
var bookMarkSchema = require("../model/userBookMarkNews");
var memberModelSchema = require("../model/memberModel");
const { off } = require('../app.js');
const { time } = require('console');
const { where } = require('../model/test.model');

var newCategoryImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/newsCategoryPic");   
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var newsImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/newsPictures");   
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var bannerlocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/banners");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var offerBannerlocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/offer");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var successStorylocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/successStory");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var eventlocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/eventsPic");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var businessCategorylocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/businessCategory");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var memberShiplocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/memberShip");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var uploadCategoryImg = multer({ storage: newCategoryImage });
var uploadNewsImg = multer({ storage: newsImage });
var uploadbanner = multer({ storage: bannerlocation });
var uploadOfferbanner = multer({ storage: offerBannerlocation });
var uploadSuccessStory = multer({ storage: successStorylocation });
var uploadEvent = multer({ storage: eventlocation });
var uploadBusinessCategory = multer({ storage: businessCategorylocation });
var uploadMemberShip = multer({ storage: memberShiplocation });

router.post('/adminlogin',async function(req,res,next){
    const { username , password } = req.body;

    try {
        if( req.body.username=="admin003" && req.body.password == "admin" ){
            res.status(200).json({ IsSuccess : true , Data: 1 , Message : "Admin LoggedIn...!!!" });
        }else{
            res.status(200).json({ IsSuccess : false , Message : "Credential Mismatched...!!!" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess : false , Message : "Something Wrong...!!!" });
    }
});

router.post("/addNewsCategory" , uploadCategoryImg.single("categoryImage") , async function(req,res,next){
    const { newsType , newsDate , categoryImage } = req.body;
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
        
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/newsCategoryPic/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
            
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }
    try {
        var record = await new newsCategorySchema({
            newsType: newsType,
            newsDate: newsDate,
            // categoryImage: file == undefined ? null : file.path,
            categoryImage: file == undefined ? null : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/newsCategoryPic/'+uniqueFilename,
        });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "News Category Added" });
            await record.save();
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "News Category Not Added"});
        }
    } catch (error) {
        res.status(500).json({ Message: error.message , IsSuccess: false });
    }
});

router.post("/getNewsCategory" , async function(req,res,next){
    try {
        var record = await newsCategorySchema.find();
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "News Category Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Category Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/addTitle" , async function(req,res,next) {
    const { title } = req.body;
    try {
        var existTitle = await titleSchema.find({
            title: title,
        });
        if (existTitle.length != 0) {
            res.status(200).json({
                Message: "Title is already taken!",
                Data: 0,
                IsSuccess: true,
            });
        } else {
            let newadmin = new titleSchema({
                // _id: new mongoose.Types.ObjectId(),
                title: title,
            });
            await newadmin.save();
            res
                .status(200)
                .json({ Message: "new Title registered!", Data: newadmin, IsSuccess: true });
        }
    }
    catch(err){
        res.status(500).json({ IsSuccess: false , Message: err.message });
    }
});

router.post('/getTitle' ,async function(req,res,next) {
    try{
       var excittitle = await titleSchema.find({});
       if(excittitle){
           res.status(200).json({IsSuccess : true, Count : excittitle.length, Message : "Title Fetched", Data : excittitle});
       }
       else{
        res.status(200).json({IsSuccess : true, Message : "Title not Fetched", Data : 0});
       }
    }
    catch(err){
        res.status(500).json({ IsSuccess: false , Message: err.message });
    }
});

router.post('/updateflag' ,async function(req , res, next) {
    const { id } = req.body;
    // console.log(req.body);
    try{
        var flag = await titleSchema.find({
            _id: id
        });
        console.log(flag);
        if(flag.length == 1){
            var updatedata = await titleSchema.findByIdAndUpdate(id,{"isActive" : true});
            // console.log(updatedata);
            res.status(200).json({ Message : "Data Updated" , Data : 1 , IsSuccess : true});
        }
        else{
            res.status(200).json({ Message : "Title Not Found" , Data : 0 , IsSuccess : true});
        }
    }
    catch(err) {
        res.status(500).json({ IsSuccess: false , Message: err.message });
    }
});

function getCurrentDate(){
    var date = moment()
      .tz("Asia/Calcutta")
      .format("DD MM YYYY, h:mm:ss a")
      .split(",")[0];
    date = date.split(" ");
    date = date[0] + "/" + date[1] + "/" + date[2];

    return date;
}

function getCurrentTime(){
    var time = moment()
      .tz("Asia/Calcutta")
      .format("DD MM YYYY, h:mm:ss a")
      .split(",")[1];

    return time;
}

router.post('/addnews', uploadNewsImg.single('newsImage'), async function(req,res,next){
    const { newsType , content , newsDate, newsTime , headline , newsImage , trending , bookmark} = req.body;
    const file = req.file;
    //console.log(imageData);

    if(req.file){
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dckj2yfap',
          api_key: '693332219167892',
          api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });
        var path = req.file.path;
        var uniqueFilename = new Date().toISOString();
        
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/newsPictures/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
            
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }
    
    try {
        var newsData;
        if(req.file){
            newsData = await new newsModelSchema({
                newsType : newsType,
                content : content,
                newsDate : getCurrentDate(),
                newsTime : getCurrentTime(),
                headline : headline,
                newsImage : file == undefined ? null : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/newsPictures/'+uniqueFilename,
                trending : trending,
                bookmark : bookmark,
            });
        }else{
            newsData = await new newsModelSchema({
                newsType : newsType,
                content : content,
                newsDate : getCurrentDate(),
                newsTime : getCurrentTime(),
                headline : headline,
                bookmark : bookmark,
                trending : trending,
                bookmark : bookmark,
            });
        }
        
        let newsDataStore = await newsData.save();

        res.status(200).json({ Message: "News Added Successfully...!!!", Data: [newsDataStore], IsSuccess: true });
    } catch (error) {
        res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});

router.post('/updatenews', async function(req , res, next){
    console.log(req.body);
    const id = req.body.id;
    //const file = req.file;
    const { newsType , content , headline , trending } = req.body;
    try {
        if(req.file){
            var updateNewsData = {
                newsType : mongoose.Types.ObjectId(newsType),
                content : content,
                headline : headline,
                trending : trending,
            };
        }else{
            updateNewsData = {
                newsType : mongoose.Types.ObjectId(newsType),
                content : content,
                headline : headline,
                trending : trending,
            };
        }
        console.log(updateNewsData);
        let data = await newsModelSchema.findByIdAndUpdate(id,updateNewsData);
        res.status(200).json({ Message: "News Data Updated!", Data: data, IsSuccess: true });
    } catch (error) {
        res.status(500).json({ Message: error.message , IsSuccess: false });
    }
});

router.post('/deletenews', uploadCategoryImg.single() , async function(req,res,next){
    const {id} = req.body;
    console.log(req.body);
    try {
        let deleteNews = await newsModelSchema.findOneAndDelete({ _id : id });
        if(deleteNews != null){
            res.status(200).json({ IsSuccess : true , Data: 1 , Message : "Data Deleted...!!!" });
        }else{
            res.status(200).json({ IsSuccess : false , Data: 0 , Message : "Data Not Found...!!!" });
        }        
    } catch (error) {
        res.status(500).json({ IsSuccess : false , Data : 0 , Message : error.message });
    } 
});

router.post("/getAllNews" , async function(req,res,next){
    try {
        var record = await newsModelSchema.find().populate("newsType");
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "News Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No News Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getFeaturedNews" , async function(req,res,next){
    const { newsId } = req.body;
    try {
        var record = await newsModelSchema.find({ trending: true })
                                          .populate({
                                              path: "newsType",
                                          });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "News Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No News Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/updateToFeatured" , uploadCategoryImg.single() ,async function(req,res,next){
    const { newsId } = req.body;
    
    try {
        var record = await newsModelSchema.findByIdAndUpdate(newsId,{ trending: true },function(err,data){
            if(err){
                res.status(200).json({ IsSuccess: true , Message: err })
            }else{
                res.status(200).json({ IsSuccess: true , Message: "News is Featured" });
            }
        });
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/addBusinessCategory" , uploadBusinessCategory.single("categoryImage") , async function(req,res,next){
    const { categoryName , categoryImage , dateTime } = req.body;
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
       
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/businessCategory/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
          
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }
    try {
        var record = await new businessCategorySchema({
            categoryName: categoryName,
            categoryImage: file == undefined ? "" : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/businessCategory/'+uniqueFilename,
            dateTime: dateTime
        });
        if(record){
            await record.save();
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Business Category Added" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

//Get All Business Category
router.post("/businessCategory" , async function(req , res ,next){
    try {
        var record = await businessCategorySchema.find();
        
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Business Category Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Business Category Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/usersInBusinessCategory" , async function(req,res,next){
    const { businessCategory_id } = req.body;
    try {
        var record = await directoryData.find({ business_category: mongoose.Types.ObjectId(businessCategory_id) });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Business Category Users Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Empty UserList" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    } 
});

router.post("/getNewsOfCategory" , async function(req,res,next){
    const id = req.body.id;
    try {
        var record = await newsModelSchema.find({ newsType : {_id : id} })
                                          .populate({
                                            path: "newsType",
                                           });
        
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "News Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No News Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});


router.post("/addBanner" , uploadbanner.single("image"), async function(req,res,next){
    const { title, type } = req.body;

    if(req.file){
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dckj2yfap',
          api_key: '693332219167892',
          api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });
        var path = req.file.path;
        var uniqueFilename = new Date().toISOString();
       
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/banner/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
          
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }
    
    try {
        const file = req.file;
        let newbanner = new bannerSchema({
            title: title,
            type: type,
            image: file == undefined ? null : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/banner/'+uniqueFilename,
        });
        await newbanner.save();
        res
            .status(200)
            .json({ Message: "Banner Added!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.status(500).json({
            Message: err.message,
            Data: 0,
            IsSuccess: false,
        });
    }
});

router.post("/getAllBanner" , async function(req,res,next){
    try {
        var record = await bannerModel.find();
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Banner Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Banner Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/offer" , uploadOfferbanner.single("bannerImage") , async function(req,res,next){
    const { title , bannerImage , businessCategory , dateTime , type , details ,redeemBy , 
        offerExpire ,faceBook , instagram , linkedIn , twitter , whatsApp , youTube  } = req.body;
    var expire = moment(offerExpire);
    expire = expire.utc().format('MM/DD/YYYY');
    var expireBody = moment(offerExpire);
    expireBody = expireBody.utc().format('DD/MM/YYYY');

    var initialDate = moment(dateTime);
    initialDate = initialDate.utc().format('MM/DD/YYYY');

    var bodyInitialDate = moment(dateTime);
    bodyInitialDate = bodyInitialDate.utc().format('DD/MM/YYYY');

    let date1 = new Date(initialDate);
    let date2 = new Date(expire);

    var daysRemaining = Math.abs( date1.getDate() - date2.getDate() );
    // console.log(daysRemaining);

    if(req.file){
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dckj2yfap',
          api_key: '693332219167892',
          api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
        });
        var path = req.file.path;
        var uniqueFilename = new Date().toISOString();
       
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/offer/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
          
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }

    try {
        const file = req.file;
        var record = await new offerSchema({
            title: title,
            // type: type,
            details: details,
            redeemBy: redeemBy,
            bannerImage: file == undefined ? "" : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/offer/'+uniqueFilename,
            dateTime: bodyInitialDate,
            offerExpire: expireBody,
            businessCategory: businessCategory,
            daysRemain: daysRemaining,
            faceBook: faceBook,
            instagram: instagram,
            linkedIn: linkedIn,
            twitter: twitter,
            whatsApp: whatsApp,
            youTube: youTube,
        });
        await record.save();
        if(record){
            res.status(200)
               .json({ IsSuccess: true , Data: [record] , Message: "Offer Added" });
        }else{
            res.status(200)
               .json({ IsSuccess: true , Data: 0 , Message: "Offer not Added" });
        }
    } catch (error) {
        res.status(500)
           .json({
               IsSuccess: false,
               Data: 0,
               Message: error.message
           });
    }
});

router.post("/getOfferOfBusiness" , async function(req,res,next){
    const { businessCategory_id } = req.body;
    try {
        var record  = await offerSchema.find({ businessCategory: { _id: businessCategory_id } })
                                       .populate({
                                           path: "businessCategory",
                                       });
        // console.log(record);
        if(record){
            res.status(200)
               .json({ IsSuccess: true , Data: record , Message: "Offer Found" });
        }else{
            res.status(200)
               .json({ IsSuccess: true , Data: 0 , Message: "Offer not Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/updateOffer" , async function(req,res,next){
    var {  id, title , bannerImage , dateTime , type , details ,redeemBy } = req.body;
    console.log(req.body);
    try {
        //const file = req.file;dateTime
        // var existOffer = await offerSchema.find();
        //var record;
        var ExistData = await offerSchema.find({ _id: id });
        if(ExistData.length == 1){
            var record = await offerSchema.findByIdAndUpdate( id ,{
                title: title,
                type: type,
                details: details,
                redeemBy: redeemBy,
                //bannerImage: file == undefined ? null : file.path,
            });
        }
        
        // console.log(record);
        
        if(record){
            res.status(200)
               .json({ IsSuccess: true , Data: record , Message: "Offer Updated" });
        }else{
            res.status(200)
               .json({ IsSuccess: true , Data: 0 , Message: "Offer not Update" });
        }
    } catch (error) {
        res.status(500)
           .json({
               IsSuccess: false,
               Data: 0,
               Message: error.message
           });
    }
});

router.post("/deleteOffer" , async function(req,res,next){
    const id = req.body.id;
    try {
        //const file = req.file;dateTime
        // var existOffer = await offerSchema.find();
        //var record;
        var ExistData = await offerSchema.find({ _id: id });
        if(ExistData.length == 1){
            var record = await offerSchema.findByIdAndDelete(id);
        }
        
        if(record){
            res.status(200)
               .json({ IsSuccess: true , Data: record , Message: "Offer Deleted" });
        }else{
            res.status(200)
               .json({ IsSuccess: true , Data: 0 , Message: "Offer not Delete" });
        }
    } catch (error) {
        res.status(500)
           .json({
               IsSuccess: false,
               Data: 0,
               Message: error.message
           });
    }
});

router.post("/getOffer" , async function(req,res,next){
    try {
        var record = await offerSchema.find()
                                      .populate({
                                            path: "businessCategory",
                                        });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Offers Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Offer" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/addSuccessStory" , uploadSuccessStory.single("storyImage") , async function(req,res,next){
    const { headline , storyImage , storyContent , favorite , date, time,
        faceBook , instagram , linkedIn , twitter , whatsApp , youTube } = req.body; 
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
       
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/successStory/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
          
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }
    try {
        var record = await new successStorySchema({
            headline: headline,
            storyImage: file == undefined ? "" : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/successStory/'+uniqueFilename,
            storyContent: storyContent,
            favorite: favorite,
            date: getCurrentDate(),
            time: getCurrentTime(),
            faceBook: faceBook,
            instagram: instagram,
            linkedIn: linkedIn,
            twitter: twitter,
            whatsApp: whatsApp,
            youTube: youTube,
        });
        if(record){
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Success Story Added" });
            await record.save();
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Story Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getSuccessStory" , async function(req,res,next){
    try {
        var record = await successStorySchema.find();
        console.log(record);
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Success Story Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Story Not found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

// router.post("/addEvent" , uploadEvent.single("eventImage") , async function(req,res,next){
//     const { eventName , eventImage , eventOrganiseBy , startDate , endDate ,
//             startFromTime , startToTime, endFromTime , endToTime } = req.body; 

//     const file = req.file;
//     var initialDateTime = moment(startDate);
//     var endDateTime = moment(endDate);
//     var initialDate = initialDateTime.utc().format('DD/MM/YYYY');
//     var initialTime = initialDateTime.utc().format('h:mm a');
//     var end_Date = endDateTime.utc().format('DD/MM/YYYY');
//     var end_Time = endDateTime.utc().format('h:mm a');
    
//     try {
//         var record = await new eventSchema({
//             eventName: eventName,
//             eventImage: file == undefined ? null : file.path,
//             eventOrganiseBy: eventOrganiseBy,
//             startDate: [initialDate , initialTime],
//             endDate: [end_Date , end_Time],
//         });
//         //console.log(record);
//         if(record){
//             res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Event Added" });
//             await record.save();
//         }else{
//             res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Event Not Added" });
//         }
//     } catch (error) {
//         res.status(500).json({ IsSuccess: false , Message: error.message });
//     }
// });

router.post("/addEvent" , uploadEvent.single("eventImage") , async function(req,res,next){
    const { eventName , eventImage , eventOrganiseBy , startDate , endDate , description,
             startTime, endTime , faceBook , instagram , linkedIn , twitter , whatsApp , youTube } = req.body; 

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
       
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/events/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
          
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }
    // var initialDateTime = moment(startDate);
    // var endDateTime = moment(endDate);
    // var initialDate = initialDateTime.utc().format('DD/MM/YYYY');
    // var initialTime = initialDateTime.utc().format('h:mm a');
    // var end_Date = endDateTime.utc().format('DD/MM/YYYY');
    // var end_Time = endDateTime.utc().format('h:mm a');
    
    try {
        var record = await new eventSchema({
            eventName: eventName,
            eventImage: file == undefined ? "" : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/events/'+uniqueFilename,
            eventOrganiseBy: eventOrganiseBy,
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,
            description: description,
            faceBook: faceBook,
            instagram: instagram,
            linkedIn: linkedIn,
            twitter: twitter,
            whatsApp: whatsApp,
            youTube: youTube,
        });
        //console.log(record);
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Event Added" });
            await record.save();
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Event Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getEvents" , async function(req,res,next){
    try {
        var record = await eventSchema.find();
        console.log(record);
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Events Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Events Not found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/addToBookMark", async function(req,res,next){
    const { userId , newsId } = req.body;
    try {
        var record = await new bookMarkSchema({
            userId: userId,
            newsId: newsId,
            date: getCurrentDate(),
            time: getCurrentTime(),
        });
        if(record){
            record.save();
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "Added To BookMark" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Something Wrong" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getAllBookMarkNews" , async function(req,res,next){
    const { userId } = req.body;
    try {
        var record = await bookMarkSchema.find({ userId: userId })
                                         .populate({
                                             path: "userId",
                                             select: "name mobile email company_name business_category"
                                         })
                                         .populate({
                                            path: "newsId",
                                        });
        // console.log(record);
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "Bookmark News Found" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "No Bookmark News Available" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/addMemberShip", uploadMemberShip.single("logo") , async function(req,res,next){
    const { memberShipName } = req.body;
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
       
        cloudinary.uploader.upload(
          path,
          { public_id: `blog/memberShip/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
          
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            
          }
        )
      }

    try {
        var record = await new memberModelSchema({
            memberShipName: memberShipName,
            logo: file == undefined ? "" : 'https://res.cloudinary.com/dckj2yfap/image/upload/v1601267438/blog/memberShip/'+uniqueFilename, 
        });
        if(record){
            record.save();
            res.status(200).json({ IsSuccess: true , Data: [record] , Message: "MemberShip Added" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Not Added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post("/getAllMemberCategory" ,async function(req,res,next){
    try {
        var record = await memberModelSchema.find();
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "MemberShips Founds" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Not Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
});

router.post('/delbanner' ,async function(req,res,next) {
    var id =  req.body.id;
    try {
      let data = await bannerSchema.findByIdAndDelete(id);
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

router.post('/delbuscategory' ,async function(req,res,next) {
    var id =  req.body.id;
    try {
      let data = await businessCategorySchema.findByIdAndDelete(id);
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

router.post('/delcategory' ,async function(req,res,next) {
    var id =  req.body.id;
    try {
      let data = await newsCategorySchema.findByIdAndDelete(id);
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

router.post('/delevent' ,async function(req,res,next) {
    var id =  req.body.id;
    try {
      let data = await eventSchema.findByIdAndDelete(id);
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

router.post('/delmembership' ,async function(req,res,next) {
    var id =  req.body.id;
    try {
      let data = await memberModelSchema.findByIdAndDelete(id);
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

router.post('/delsuccess' ,async function(req,res,next) {
    var id =  req.body.id;
    try {
      let data = await successStorySchema.findByIdAndDelete(id);
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

module.exports = router;
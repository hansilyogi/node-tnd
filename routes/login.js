var express = require('express');
var router = express.Router();
var model = require('../model/test.model');
//Access-Control-Allow-Origin

router.post('/',async function(req,res,next){
    
    const mobile = req.body.mobile;
    // const fcmToken = req.body.fcmToken;

    try {
        var record = await model.find({ mobile: mobile})
                                .populate({
                                    path: "business_category",
                                })
                                .populate({
                                    path: "memberOf",
                                });
        if(record.length == 1){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "User LoggedIn" });
        }else{
            res.status(200).json({ IsSuccess: true , Data: [] , Message: "User Not Found. PLease Register" });
        }
        // console.log(record.length);    
    } catch (error) {
        res.status(500).json({ IsSuccess: false , Message: error.message });
    }
  });

module.exports = router;
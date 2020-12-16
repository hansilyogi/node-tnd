var express = require('express');
var router = express.Router();

var connectionRequestSchema = require('../model/connectionRequest');
var directoryData = require('../model/test.model');

router.post('/directorylisting', async function(req , res , next){
    try {
        let directoryList = await directoryData.find()
                                               .populate({
                                                   path: "business_category",
                                               })
                                               .populate({
                                                   path: "memberOf"
                                               });
        if(directoryList != null){
            res.status(200).json({ Message: "Data Found...!!!", Count : directoryList.length , Data: directoryList, IsSuccess: true });
        }else{
            res.status(200).json({ Message: "Data Not Found...!!!", IsSuccess: false });
        }
    } catch (error) {
        res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});

router.post('/profile', async function(req , res , next){
    const { id } = req.body;
    try {
        let directoryList = await directoryData.find({ _id: id });
        if(directoryList != null){
            res.status(200).json({ Message: "Data Found...!!!", Count : directoryList.length , Data: directoryList, IsSuccess: true });
        }else{
            res.status(200).json({ Message: "Data Not Found...!!!", IsSuccess: false });
        }
    } catch (error) {
        res.status(500).json({ Message: error.message, IsSuccess: false });
    }
});

module.exports = router;
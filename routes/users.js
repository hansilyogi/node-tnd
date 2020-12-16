var express = require('express');
var router = express.Router();
var networkSchema = require('../model/connectionRequest');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/networking" , async function(req,res,next){
  const { requestSender , requestReceiver , requestStatus } = req.body;
  try {
    var record = await new networkSchema({
      requestSender: requestSender,
      requestReceiver: requestReceiver,
      requestStatus: requestStatus,
    });
    await record.save();
    var usersData = await networkSchema.find()
                                       .populate({
                                         path: "requestSender",
                                         select: "name"
                                       })
                                       .populate({
                                        path: "requestReceiver",
                                        select: "name"
                                       });
    if(record){
      res.status(200).json({ IsSuccess: true , Data: usersData , Message: "Request Send Successfully" });
    }else{
      res.status(200).json({ IsSuccess: true , Data: 0 , Message: "Request Sending Failed" });
    }
  } catch (error) {
    res.status(500).json({ IsSuccess: false , Message: error.message });
  }
});

router.post("/updateReqStatus" , async function(req,res,next){
  const { requestId , requestStatus } = req.body;
  try {
    var record = await networkSchema.find({ _id: requestId });
    // console.log(record);
    if(record.length == 1){
      let updateIs = await networkSchema.findByIdAndUpdate(requestId,{ requestStatus: requestStatus });
      res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Request Updated" });
    }
  } catch (error) {
    res.status(500).json({ IsSuccess: false , Message: error.message });
  }
});



module.exports = router;

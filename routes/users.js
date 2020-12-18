const { name } = require('ejs');
var express = require('express');
var router = express.Router();
var networkSchema = require('../model/connectionRequest');
var directoryData = require('../model/test.model');
var request = require('request');


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

router.post("/networking_v2" , async function(req,res,next){
  const { requestSender , requestReceiver  } = req.body;
  try {
    var record = await new networkSchema({
      requestSender: requestSender,
      requestReceiver: requestReceiver,
    });
    await record.save();
    // console.log(record);
    var usersData = await networkSchema.find(record)
                                       .populate({
                                         path: "requestSender",
                                         select: "name"
                                       })
                                       .populate({
                                        path: "requestReceiver",
                                        select: "name"
                                       });
    console.log(usersData[0]);

    var sendermobile = await directoryData.find({ name : usersData[0].requestSender.name }).select('mobile -_id');
    // console.log("mobilee......" + sendermobile[0].mobile);

    var receievmobile = await directoryData.find({ name : usersData[0].requestReceiver.name}).select('mobile -_id');

    var sendfcmtoken = await directoryData.find({ mobile : sendermobile[0].mobile}).select('fcmToken -_id');

    var recevefcmtoken = await directoryData.find({ mobile : receievmobile[0].mobile}).select('fcmToken -_id');

    var sender_name = usersData[0].requestSender.name;
    var rece_name = usersData[0].requestReceiver.name;
    var req_id = usersData[0]._id;
    let objDate = new Date();
    let stringDate = objDate.toString();
    let dateList = stringDate.split(" ");
    console.log("----------------------");
    console.log("Sender name : " + sender_name);
    console.log("Receiver name : " + rece_name);
    console.log("Request ID : " + req_id);

    console.log("................Notification..............................");

    let newOrderNotification = `New Connection Request Received
    Sender name : ${sender_name}
    Receiver name : ${rece_name}
    Request-Id : ${req_id}
    Date-Time : ${dateList}`;

    var dataSendToAdmin = {
      "to":sendfcmtoken[0].fcmToken,
      "priority":"high",
      "content_available":true,
      "data": {
          "sound": "surprise.mp3",
          "click_action": "FLUTTER_NOTIFICATION_CLICK"
      },
      "notification":{
                  "body": newOrderNotification,
                  "title":"New Request Received",
                  "badge":1
              }
  };

  var options2 = {
      'method': 'POST',
      'url': 'https://fcm.googleapis.com/fcm/send',
      'headers': {
          'authorization': 'key=AAAA6iLVZks:APA91bGUpLM6fb7if-uzgCnl4i-xR6734jhkZ3C-u-7PKjFYu0SGsy_cRIDLWGqULXDTt4kR6-etX40Fv2yfrXDDa87V-fY7QsFDIn5lNT-rf3LDpIGmSkmA-Aeffz1OYix-NXMVxabz',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataSendToAdmin)
  };

  request(options2, function (error, response , body) {
    console.log("--------------------Sender--------------------");
    let myJsonBody = JSON.stringify(body);
    //console.log(myJsonBody);
    //myJsonBody[51] USED TO ACCESS RESPONSE DATA SUCCESS FIELD
    console.log(myJsonBody[51]);
    // if(myJsonBody[51]==0){
    //     console.log("Send Text notification of new order..........!!!");
    //     sendMessages(sendermobile[0].mobile,newOrderNotification);
    // }
    if (error) {
        console.log(error.message);
    } else {
        console.log("Sending Notification Testing....!!!");
        console.log("helloo........" + response.body);
        // if(response.body.success=="1"){
        //     console.log("Send Text notification of new order..........!!!");
        //     sendMessages(sendermobile[0].mobile,newOrderNotification);
        // }
    }
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

router.post("/updateReqStatus_v2" , async function(req,res,next){
  const { requestId } = req.body;
  try {
    var record = await networkSchema.find({ _id: requestId });
    console.log(record);
    if(record.length == 1){
      let updateIs = await networkSchema.findByIdAndUpdate(requestId,{ "requestStatus": true });
      res.status(200).json({ IsSuccess: true , Data: 1 , Message: "Request Updated" });
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

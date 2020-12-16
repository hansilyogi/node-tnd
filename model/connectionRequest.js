var mongoose = require('mongoose');

var ConnectionRequest = mongoose.Schema({
    requestSender : {
        type: mongoose.Types.ObjectId, ref: "UsersList", default: null 
    },       
    requestReceiver : {
        type: mongoose.Types.ObjectId, ref: "UsersList", default: null
    },
    requestStatus : {
        type : Boolean , default : 0
    }
});

module.exports = mongoose.model("connectionRequest",ConnectionRequest);
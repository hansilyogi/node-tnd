var mongoose = require('mongoose');

var ConnectionRequest = mongoose.Schema({
    requestSender : {
        type: mongoose.Types.ObjectId, ref: "UsersList", default: null 
    },       
    requestReceiver : {
        type: mongoose.Types.ObjectId, ref: "UsersList", default: null
    },
    requestStatus : {
        type : String
    }
});

module.exports = mongoose.model("connectionRequest",ConnectionRequest);
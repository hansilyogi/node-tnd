var mongoose = require('mongoose');

var memberModel = mongoose.Schema({
    memberShipName : {
        type: String 
    },       
    logo : {
        type: String
    },
    date : {
        type : String
    },
    time : {
        type: String
    }
});

module.exports = mongoose.model("MemberShip",memberModel);
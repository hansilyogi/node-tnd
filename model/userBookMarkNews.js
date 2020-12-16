var mongoose = require('mongoose');

var userBookMark = mongoose.Schema({
    userId : {
        type: mongoose.Types.ObjectId, ref: "UsersList", default: null 
    },       
    newsId : {
        type: mongoose.Types.ObjectId, ref: "NewsList", default: null
    },
    date : {
        type : String
    },
    time : {
        type: String
    }
});

module.exports = mongoose.model("BookMark",userBookMark);
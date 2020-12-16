var mongoose = require('mongoose');

var newsModelSchema = mongoose.Schema({
    newsType: {
        type: mongoose.Types.ObjectId, ref: "NewsCategory", require: true
    },
    content: {type:String},
    newsDate: {
        type:String,
    },
    newsTime: {
        type: String,
    },
    headline: {
        type:String,
        require: true
    },
    newsImage: {
        type:String
    },
    trending: {
        type: Boolean,
        default: false
    },
    bookmark: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("NewsList",newsModelSchema);
var mongoose = require('mongoose');

var newsCategorySchema = mongoose.Schema({
    newsType: {
        type:String,
        require: true
    },
    //content: {type:String},
    newsDate: {
        type:Date,
        default: Date.now
    },
    // headline: {
    //     type:String,
    //     require: true
    // },
    categoryImage: {
        type:String
    }
});

module.exports = mongoose.model("NewsCategory",newsCategorySchema);
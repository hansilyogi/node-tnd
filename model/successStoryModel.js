var mongoose = require('mongoose');

var successStorySchema = mongoose.Schema({
    headline: {
        type:String,
        require: true
    },
    storyImage: {
        type:String
    },
    storyContent: {
        type: String
    },
    favorite: {
        type: Boolean,
        default: false
    },
    date: {
        type: String,
        // default: Date.now()
    },
    time: {
        type: String
    },
    faceBook : {
        type: String,
        default : "https://www.facebook.com/"
    },
    instagram : {
        type: String,
        default : "https://www.instagram.com/"
    },
    linkedIn : {
        type: String,
        default: "https://www.linkedin.com/"
    },
    twitter : {
        type: String,
        default: "https://twitter.com/"
    },
    whatsApp : {
        type: String,
        default: "https://www.whatsapp.com/"
    },
    youTube : {
        type: String,
        default: "https://www.youtube.com/"
    },
});

module.exports = mongoose.model("SuccessStory",successStorySchema);
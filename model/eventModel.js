var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
    eventName: {
        type:String,
        require: true
    },
    eventImage: {
        type:String
    },
    eventOrganiseBy: {
        type: String,
    },
    startDate: [{
        type: String,
    }],
    endDate: [{
        type: String,
    }],
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    description: {
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

module.exports = mongoose.model("Events",eventSchema);
var mongoose = require('mongoose');
Schema = mongoose.Schema;

var newSchema = mongoose.Schema({
    name: { 
        type: String,
        require: true,
    },
    email: { 
        type: String,
        require: true,
    },
    mobile: { 
        type: String,
        unique: true,
        require: true, 
    },
    company_name: { 
        type: String,
        default: "",
    },
    referred_by: { 
        type: String,
        default: "", 
    },
    date_of_birth : { 
        type: String,
        default: "",
    },
    gender : { 
        type: String,
        default: "", 
    },
    address : { 
        type: String,
        default: "", 
    },
    spouse_name : { 
        type: String,
        default: "", 
    },
    spouse_birth_date : { 
        type: String,
        default: "",
    },
    number_of_child : { 
        type: Number,
        default: 0, 
    },
    img : { 
        type: String,
        default: "uploads/users/default-profile.png", 
    },
    memberOf : { 
        type: mongoose.Types.ObjectId,
        ref: "MemberShip", 
    },
    business_category : { 
        type: mongoose.Types.ObjectId,
        ref: "BusinessCategory",
    },
    experience : { 
        type:String,
        default: ""
    },
    about_business : { 
        type:String,
        default: ""
    },
    achievement : { 
        type:String,
        default: ""
    },
    status : { 
        type: Boolean,
        // default: true
    },
    fcmToken : { 
        type: String,
        default: ""
    },
    isVerified : {
        type: Boolean,
        default: false,
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

module.exports = mongoose.model("UsersList",newSchema);
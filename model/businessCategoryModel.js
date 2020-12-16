const mongoose = require("mongoose");

const businessCategorySchema = mongoose.Schema({
    categoryName: {
        type: String,
    },
    categoryImage: {
        type: String,
    },
    dateTime: {
        type: Date,
        default: Date.now()
    },
    Users: {
        type: mongoose.Types.ObjectId, 
        ref: "UsersList",
    },
});

module.exports = mongoose.model("BusinessCategory", businessCategorySchema);
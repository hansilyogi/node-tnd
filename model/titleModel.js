const mongoose = require("mongoose");

const titleSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("title", titleSchema);
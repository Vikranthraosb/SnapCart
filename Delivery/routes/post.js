const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    title: String,
    Description: String,
    image: String,
    price: String,
    discount: String
});

module.exports = mongoose.model("post", postSchema)
const mongoose = require('mongoose');

const chatschema = new mongoose.Schema({
    from:{
        type:String,
    },
    to:{
        type:String,
    },
    msg:{
        type:String,
    },
    Date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Chats", chatschema );
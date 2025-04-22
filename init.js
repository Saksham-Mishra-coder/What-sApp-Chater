const mongoose = require ("mongoose");
const Chat = require("./models/chat.js");


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Whatsapp");

    
}
main()
.then(()=>{console.log("connection successfully")});
let  allChat = [{
    from:"Sakshi",
    to: "Abhinav",
    msg: "con you tell me js callback",
    date: new Date()
},
{
    from:"ronit",
    to: "Abhinav",
    msg: "plz tell me concept of oops",
    date: new Date()
},
{
    from:"Saksham",
    to: "Abhinav",
    msg: "kha ho",
    date: new Date()
}];




Chat.insertMany(allChat);
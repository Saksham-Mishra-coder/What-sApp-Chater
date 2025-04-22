// Import necessary modules
const { log } = require("console"); // Import log from console (although it isn't used here)
const express = require("express"); // Import express module to handle HTTP requests
const mongoose = require("mongoose"); // Import mongoose module to interact with MongoDB
const path = require("path"); // Import path module for working with file paths
const Chat = require("./models/Chat"); // Import the Chat model (this should be a Mongoose model for chat documents)
const methodOverride = require('method-override'); // Import method-override for handling HTTP verbs like PUT and DELETE via forms
require('dotenv').config();

// Initialize express app
const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true })); // Middleware to parse incoming URL-encoded form data
app.use(methodOverride('_method')); // Middleware to allow override of HTTP method (e.g., for PATCH/DELETE via POST requests)

// Set up view engine and view directory
app.set("views", path.join(__dirname, "views")); // Set the "views" folder for the EJS templates
app.set("view engine", "ejs"); // Set the view engine to EJS for rendering views
app.use(express.static(path.join(__dirname, "public"))); // Serve static files (like CSS/JS) from the "public" folder

// MongoDB connection using Mongoose
async function main() {
    await mongoose.connect(process.env.URI); // Connect to MongoDB running locally
}

// Call main to establish the connection
main()
    .then(() => { 
        console.log("connection successfully"); // Log success message after successful connection
    });

// Index route - Display all chats
app.get("/chats", async (req, res) => {
    let chats = await Chat.find(); // Fetch all chat documents from the database
    res.render("index.ejs", { chats }); // Render "index.ejs" view and pass "chats" to it
});

// New chat route - Display form to add a new chat
app.get("/chats/new", (req, res) => {
    res.render("add.ejs"); // Render "add.ejs" view which contains the form for adding a new chat
});

// Post route - Handle submission of a new chat
app.post("/chats", (req, res) => {
    let { from, to, msg } = req.body; // Get the values from the form submission
    let newChat = new Chat({ // Create a new Chat document
        from: from,
        to: to,
        msg: msg,
        date: new Date() // Set the current date and time for the chat
    });

    newChat.save() // Save the new chat document to the database
        .then(() => {
            console.log("Saved"); // Log a message upon successful save
        });

    res.redirect("/chats"); // Redirect to the "/chats" route (to display all chats)
});

// Edit route - Display form to edit an existing chat
app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params; // Get the chat ID from the URL parameters
    let chat = await Chat.findById(id); // Find the chat by its ID
    res.render("edit.ejs", { chat }); // Render "edit.ejs" view with the existing chat data for editing
});

// Update (PATCH) route - Handle update of an existing chat
app.patch("/chats/:id", async (req, res) => {
    let { msg } = req.body; // Get the updated message from the form
    let { id } = req.params; // Get the chat ID from the URL parameters
    let newChat = await Chat.findByIdAndUpdate(id, { // Find the chat by ID and update its message
        msg: msg
    },
    {
        runValidators: true, // Ensure that any validation rules are run
        new: true // Return the updated chat document
    });

    res.redirect("/chats"); // Redirect to the "/chats" route (to show the updated list of chats)
});

// Delete route - Handle deletion of a chat
app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params; // Get the chat ID from the URL parameters
    let deletedChat = await Chat.findByIdAndDelete(id); // Delete the chat by ID from the database
    res.redirect("/chats"); // Redirect to the "/chats" route after deletion
});

// Root route (basic test route)
app.get("/", (req, res) => {
    res.send("working"); // Respond with "working" to confirm the app is running
});

// Start the server on port 8080
app.listen(process.env.PORT, () => {
    console.log("port is listening 8080"); // Log a message when the server starts successfully
});

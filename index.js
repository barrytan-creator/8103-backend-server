const express = require('express');

const app = express();

// ROUTES BEGIN ///////////////////////////////////////////////////////////////

// route: a pairing between an URL and a function
// when the server recieves a request for the URL, the function will execute
app.get('/live', function(req,res){
    res.send("Hello World");
})

app.get('/welcome', function(req,res){
    res.send("Welcome!");
});

app.get('/goodbye', function(req,res){
    res.send("Goodbye");
})

// NO ROUTES AFTER app.listen() ///////////////////////////////////////////////

// app.listen starts a new server 
// the first parameter is the PORT number
// the PORT number identifies the process (software) that is sending out 
// or recieving traffic
// A port number cannot be used by two process at the same time
app.listen(3001, function(){
    console.log("Server is running")
});

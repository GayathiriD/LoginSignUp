const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/LoginSignupAuth')
.then( () => {
    console.log("Connection Successful");
}) // Add a semicolon here
.catch(error => {
    console.log("Connection Unsuccessful")
});
//create Schema

const schema = new mongoose.Schema( {
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    token:
    {
        type: String,
        required: true
    }
})

const collection = new mongoose.model("AuthCollection", schema);
module.exports = collection;



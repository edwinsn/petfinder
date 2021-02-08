const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || "mongodb:localhost:databasetest"

mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology :true,
    useFindAndModify:false
})

const connection = mongoose.connection;

connection.once("open",
    ()=>{console.log("DB is conneted!")}
)
const express = require('express')
const cors = require('cors')

let app = express();
//settings
app.set("port",4000)

//middlewares
app.use(cors())
app.use(express.json())

//routes
app.use("/api/points", require('./routes/pointRoutes'))

module.exports = app;
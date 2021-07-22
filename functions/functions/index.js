/* eslint-disable */
const functions = require('firebase-functions')
require('dotenv').config()

const app = require('./src/app')
require('./src/database')


app.listen(4000, () => {
    console.log("Api listen on: " + app.get("port"))
})


exports.app = functions.https.onRequest(app)
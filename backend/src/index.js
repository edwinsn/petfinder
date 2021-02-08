require('dotenv').config()

const app = require('./app')
require('./database')

async function main(){

  await app.listen( process.env.PORT || app.get("port"));
  console.log("Api listen on: "+( process.env.PORT || app.get("port") ));
}

main();
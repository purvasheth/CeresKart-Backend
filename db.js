const mongoose = require('mongoose')

async function connectDB(){
  try{
    const con = await mongoose.connect(process.env['uri'],{useNewUrlParser: true})
    console.log("connected to db successfully")
  }
  catch(e){
    console.log(e)
    console.log("failed to connect to db")
  }
}

module.exports = {connectDB}

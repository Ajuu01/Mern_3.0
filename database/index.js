const mongoose=require('mongoose')

async function connectToDatabase(){
    // use await if code connects with database
    await mongoose.connect('mongodb+srv://raieajuna_db_user:helloworldmern@cluster0.gn6e99b.mongodb.net/?appName=Cluster0');
    console.log("Database connected successfully!!");
}

module.exports =connectToDatabase;
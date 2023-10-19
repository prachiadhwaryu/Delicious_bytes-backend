const mongoose = require('mongoose');

async function connectToDatabase() {
    //const uri = 'mongodb+srv://A11:CookDelicious@a11.z4oquin.mongodb.net/cook_delicious_db_dump?retryWrites=true&w=majority';
    const uri = 'mongodb://127.0.0.1:27017/cook_delicious_db';
    await mongoose.connect(
        uri, 
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        }
    ).then(()=>{
        console.log('Connected to MongoDB');
    }).catch((error)=>{
        console.log('Error connectiong to MongoDB : ', error);
    })
}

module.exports = connectToDatabase;
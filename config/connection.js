const mongoose = require('mongoose');
mongoose.connect(
    'mongodb://localhost:27017/delicious_bytes', 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }
).then(()=>{
    console.log('connection sucess')
}).catch((error)=>{
    console.log('error', error);
})
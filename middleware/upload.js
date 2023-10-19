const multer = require('multer');
const fs = require('fs');
const moment = require('moment');
let imageCounter = 1;

const recipeImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const recipeName = req.body.recipe_name;
        const chef_name = req.body.chef_name;
        const folderPath = `./uploads/images/${recipeName}_${chef_name}`;
  
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath);
          imageCounter=1;
        }
    
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const currentDate = moment().format('YYYY-MM-DD');
        const fileExtension = file.originalname.split('.').pop(); // Get the file extension
        const filename = `${req.body.recipe_name}-image${imageCounter}-${currentDate}.${fileExtension}`;

        imageCounter++;
        cb(null, filename);
    }
});  

const fileFilter = (req, file, cb) => {
    if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')){
        const error = new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'); // Create an error object
        error.status = 400; // Set the HTTP status code for a Bad Request
        cb(null, true);
    } else{
        cb(null, false);
    }
};

const uploadRecipeImage = multer({ storage: recipeImageStorage, fileFilter: fileFilter,});

module.exports = uploadRecipeImage;
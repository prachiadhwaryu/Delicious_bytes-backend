const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const moment = require('moment');
let imageCounter = 1;

// Create an S3 instance
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Configure Multer to upload directly to S3
const uploadToS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'cook-delicious-recipe',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read', // Set appropriate ACL permissions
    key: function (req, file, cb) {
      /*const currentDate = moment().format('YYYY-MM-DD');
      const fileExtension = file.originalname.split('.').pop();
      const filename = `${req.body.recipe_name}-image${imageCounter}-${currentDate}.${fileExtension}`;
      cb(null, filename);*/

      const recipeName = req.body.recipe_name;
      const chef_name = req.body.chef_name;
      const currentDate = moment().format('YYYY-MM-DD');
      const fileExtension = file.originalname.split('.').pop();
      const folderPath = `${recipeName}_${chef_name}`;

      const filename = `${folderPath}/${recipeName}-image${imageCounter}-${currentDate}.${fileExtension}`;
      cb(null, filename);
    },
  }),
});

module.exports = uploadToS3;

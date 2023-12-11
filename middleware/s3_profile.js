const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const moment = require('moment');

// Create an S3 instance
const s3_profile = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Configure Multer to upload directly to S3
const uploadToS3_profile = multer({
  storage: multerS3({
    s3: s3_profile,
    bucket: 'cook-delicious-profiles',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read', // Set appropriate ACL permissions
    key: function (req, file, cb) {

      const userId = req.userId;
      const fileExtension = file.originalname.split('.').pop();
      console.log('Id ::::::::::::::::::;; ', userId);
      const filename = `${userId}.${fileExtension}`;
      cb(null, filename);
    },
  }),
});

module.exports = uploadToS3_profile;

const AWS = require('aws-sdk');
const fs = require("fs");

// Initialize AWS S3 service object
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
});

function uploadFileToS3(fileName, folderPath, bucketName) {
  const filePath = `${folderPath}${fileName}`;
  const params = {
    Bucket: bucketName,
    Body: fs.createReadStream(filePath),
    Key: fileName,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(`Error uploading file ${fileName}:`, err);
        reject(err);
      } else {
        console.log(`File ${fileName} uploaded successfully. Location: ${data.Location}`);
        resolve(data);
      }
    });
  });
}

module.exports = uploadFileToS3;
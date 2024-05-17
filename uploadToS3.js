const AWS = require('aws-sdk');
const fs = require("fs");
const path = require("path");

// Validate environment variables
const accessKeyId = process.env.ACCESSKEYID;
const secretAccessKey = process.env.SECRETACCESSKEY;

if (!accessKeyId || !secretAccessKey) {
  console.error("Error: AWS credentials (ACCESSKEYID and SECRETACCESSKEY) are not set.");
  process.exit(1);
}

// Initialize AWS S3 service object
const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

/**
 * Uploads a file to S3
 * @param {string} fileName - The name of the file to upload
 * @param {string} folderPath - The path to the folder containing the file
 * @param {string} bucketName - The name of the S3 bucket
 * @returns {Promise} - A promise that resolves with the upload data or rejects with an error
 */
function uploadFileToS3(fileName, folderPath, bucketName) {
  const filePath = path.join(folderPath, fileName);

  // Validate if the file exists
  if (!fs.existsSync(filePath)) {
    const error = new Error(`File not found: ${filePath}`);
    console.error(error.message);
    return Promise.reject(error);
  }

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

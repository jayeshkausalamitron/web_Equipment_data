const fs = require("fs");
const AWS = require('aws-sdk');

// Validate environment variables
//this will help in validation
if (!process.env.ACCESSKEYID || !process.env.SECRETACCESSKEY || !process.env.BUCKETNAME) {
  throw new Error("Missing required environment variables: ACCESSKEYID, SECRETACCESSKEY, BUCKETNAME");
}

// Initialize AWS S3 service object
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
});

function getFileNamesFromFolder(folderPath) {
  try {
    if (!fs.existsSync(folderPath)) {
      throw new Error(`Folder not found: ${folderPath}`);
    }

    // Read the contents of the folder
    const files = fs.readdirSync(folderPath);

    if (files.length === 0) {
      console.warn(`No files found in folder: ${folderPath}`);
    }

    // Return the file names
    return files;
  } catch (error) {
    console.error("Error reading folder:", error);
    return [];
  }
}

async function getFileNamesNotInBucket(bucketName, fileNamesArray) {
  try {
    const nonMatchingFileNames = [];

    // List objects in the bucket
    const data = await s3.listObjectsV2({ Bucket: bucketName }).promise();

    // Extract file names from the list of objects
    const bucketFileNames = data.Contents.map((obj) => obj.Key);

    // Check if file names in the bucket do not match those in the array
    fileNamesArray.forEach((fileName) => {
      if (!bucketFileNames.includes(fileName)) {
        nonMatchingFileNames.push(fileName);
      }
    });

    return nonMatchingFileNames;
  } catch (error) {
    console.error("Error retrieving bucket contents:", error);
    throw error;
  }
}

module.exports = {
  getFileNamesFromFolder,
  getFileNamesNotInBucket,
};

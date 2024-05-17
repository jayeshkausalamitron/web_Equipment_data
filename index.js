require("dotenv").config();
const fs = require("fs");
const path = require("path");
const schedule = require("node-schedule");
const uploadFileToS3 = require("./utils/uploadToS3");
const { getFileNamesFromFolder, getFileNamesNotInBucket } = require("./utils/fileOperations");

// Schedule time for running the task every minute
const scheduletime = "*/1 * * * *";

// Define folder path and S3 bucket name from environment variables
const folderPath = "./data/";
const bucketName = process.env.BUCKETNAME;

// Validate environment variables
if (!bucketName) {
  console.error("Error: BUCKETNAME environment variable is not set.");
  process.exit(1);
}

// Validate folder path
if (!fs.existsSync(folderPath)) {
  console.error(`Error: Folder path "${folderPath}" does not exist.`);
  process.exit(1);
}

async function uploadFilesToS3() {
  console.log("Starting upload process...");

  const fileNames = getFileNamesFromFolder(folderPath);
  if (fileNames.length === 0) {
    console.log("No files found in the folder to upload.");
    return;
  }

  console.log("File names in the folder:", fileNames);

  try {
    const nonMatchingFileNames = await getFileNamesNotInBucket(bucketName, fileNames);
    console.log("Files not present in the bucket:", nonMatchingFileNames);

    if (nonMatchingFileNames.length === 0) {
      console.log("All files are already present in the S3 bucket.");
      return;
    }

    for (const fileName of nonMatchingFileNames) {
      await uploadFileToS3(fileName, folderPath, bucketName);
      console.log(`File "${fileName}" uploaded successfully.`);
    }
  } catch (error) {
    console.error("Error during the upload process:", error);
  }
}

// Schedule job to run the upload process every minute
const job = schedule.scheduleJob(scheduletime, function () {
  console.log("Upload job initiated.");
  uploadFilesToS3();
});

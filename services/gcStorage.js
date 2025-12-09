const { Storage } = require("@google-cloud/storage");
const { generateRandomString, getFileExtension } = require("../utils");

const storage = new Storage({
  projectId: process.env.GC_PROJECT_ID,
  credentials: {
    type: "service_account",
    project_id: "XXXXXXXXXXXXXXXXXX",
    private_key_id: "XXXXXXXXXXXXXXXXXX",
    private_key: "XXXXXXXXXXXXXXXXXX",
    client_email: "XXXXXXXXXXXXXXXXXX",
    client_id: "XXXXXXXXXXXXXXXXXX",
    auth_uri: "XXXXXXXXXXXXXXXXXX",
    token_uri: "XXXXXXXXXXXXXXXXXX",
    auth_provider_x509_cert_url: "XXXXXXXXXXXXXXXXXX",
    client_x509_cert_url: "XXXXXXXXXXXXXXXXXX",
    universe_domain: "XXXXXXXXXXXXXXXXXX",
  },
});
const bucket = storage.bucket(process.env.GC_BUCKET_NAME);

const uploadFile = ({ name, folderName, data }) =>
  new Promise((resolve, reject) => {
    const generatedFileName = generateRandomString(30);
    const blob = bucket.file(`${folderName}${folderName && "/"}${generatedFileName}.${getFileExtension(name)}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on("finish", () => {
        resolve(`${generatedFileName}.${getFileExtension(name)}`);
      })
      .on("error", (err) => {
        console.log(err);
        reject(`Unable to upload image, something went wrong!`);
      })
      .end(data);
  });

const getObjectSignedUrl = async (objectName) => {
  const [url] = await bucket.file(objectName).getSignedUrl({
    version: "v2", // defaults to 'v2' if missing.
    action: "read",
    expires: Date.now() + 1000 * 60 * 60, // one hour
  });
  return url;
};

const deleteFile = async (objectName) => {
  try {
    await bucket.file(objectName).delete();
    return true;
  } catch (e) {
    console.log("Google storage file deletion error:", e);
    return false;
  }
};

module.exports = {
  uploadFile,
  getObjectSignedUrl,
  deleteFile,
};

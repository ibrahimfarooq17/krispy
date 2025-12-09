const { Storage } = require("@google-cloud/storage");
const { generateRandomString, getFileExtension } = require("../utils");

const storage = new Storage({
  projectId: process.env.GC_PROJECT_ID,
  credentials: {
    type: "service_account",
    project_id: "krispy-388910",
    private_key_id: "49709b3ae2144f109a4fa1cf14e2c9a664c78d54",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC/qhja8H5I8Bf/\ny8D+xrPGdxo7Szg02u7HEiCXNodsZHWH1wVTj0epvq1OHJZI8J+hK06dv4LQucHc\nREgye4vLJ8t3nlt+uNQcffIvGNWuE712U2u+ZDt9meE1flD3a8uV/3YxshOrzarH\nuzMYIvdaX/iDhyr5Vs5V8qLkBknTRgdgRioaB4/5dt3fiFShaY2+jMHcA3uEXx95\n2HGMUKQ9pFP36J0lc2Zjd7mdnlWXwXdv3pE+GtR5koTojRlV6ikyyEWbYO37K4un\ntzOOfNN3saUbgG8rJZMg2Tg50CyuRAzGsEMy4J/tIiznOSjq+s5qxDlg6VMQBnJP\npZNSOKx1AgMBAAECggEAWDZeWC4FwWYXdZh+jARB658XiKC3DsSQzziNnWrwazfV\nTB7viaTRM9PZibDojkuI/LGk7j+dYpmMGuemXu2zyl3XbIeKzskcfryMwZZpikP1\nmEcOuMMDCmzPVUJ821NWkQPRj0/Jc/IlnuWOv5YgSA0RoN+OLNICB1a0F8S5J64u\nngqVjrzDK1AXch52uUjBVtYkPhxzQJOtZcOew3YcQTAIb3C1ttu9wwXamIJ28yGA\njSsIX4GBI/eYLkQydDoAPNntyELXpIU49Dq0PTM7AgdF1ORL9KtkBEBpEGer2Vm4\nQo4blRjL5zOsD4Qv91Qyyw8u2HJoVB6NAS4vEdQiBQKBgQD90k55tdBgEsSgcShn\nj28TcRt3NYwauWTfEq2lsc/5UKkwp0ETF92xR7nCmbm48l/fThzxULXVpMZG95vO\nW5RTGqe3CaRCD5tlRqKOlE0rvcmM1HekJfgB5N8V8R+1yd+YGqvtCcgcvP3s2zvV\nbgdoi8mheTDgI8X06vdenI9FHwKBgQDBTzhFjTbxGFgiGbuBJh1SK3+BzE4RVdZp\nBw7ItD5IdoOSvV/fM1UDOgtwgbUA0MxKMCMhObzzlOiFJm8tfVts6dP2fmF+gq3e\nPhUObF6FFESFl2psPmVZFfwTJx26CvhxNPJVgVnjtpUv+G7SVWylM1ELhW2IvTD5\nYHpLwsOn6wKBgQDW4AhRXwrVmm3dCY7UBQhapCFFTQ6bvSFY+54HrL1M6e0hZCZh\n/I1QPFFVHgCtQnrJN36nB9W31LOKdqnvC3ZI2ELtYHsu9blvBlota/zcr+GFmITk\ncMRBDjmRgLyAkDL6uHGdzO8c7R3mOz6vE2OwLM74JPmsdnxqN9RMwytCrwKBgBFU\nO7Qoc5trVkNAUUnDk+9QzO5i1UDClCT4KAAgAFFYpnTaGyUUIfPXGT1tsz8ueJHR\n/OQ2m9SuLaX6Cw9l5HNAButa6vx/VHzOze5sEpEVfwsGxtiLQ2SYDu/cmtKZtynW\n2D6ICPnb3UXenHiohcPNdN92h5oxc5l3Z58xB38fAoGAWxAgy2qihDdw/KQ5akEs\narTm7TxRUWa7FieuRnJVA/PlFftJ+T6rcBNRCxnYW5Ss9iH0QW4STfHvcEPfqURh\noeabyJN2+jMYffLyvY4nRUxDm2PoQigwAA4Ee1ZEw211gXpOZ3uU5RuR4NTm+DRV\n9V77WQ5Lw9UlvDzx0JfD1uE=\n-----END PRIVATE KEY-----\n",
    client_email: "krispy-388910@appspot.gserviceaccount.com",
    client_id: "103796899786023281918",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/krispy-388910%40appspot.gserviceaccount.com",
    universe_domain: "googleapis.com"
  }
});
const bucket = storage.bucket(process.env.GC_BUCKET_NAME);

const uploadFile = ({ name, folderName, data }) => new Promise((resolve, reject) => {
  const generatedFileName = generateRandomString(30);
  const blob = bucket.file(
    `${folderName}${folderName && '/'}${generatedFileName}.${getFileExtension(name)}`
  );
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream
    .on('finish', () => {
      resolve(`${generatedFileName}.${getFileExtension(name)}`)
    })
    .on('error', (err) => {
      console.log(err);
      reject(`Unable to upload image, something went wrong!`)
    })
    .end(data)
});

const getObjectSignedUrl = async (objectName) => {
  const [url] = await bucket.file(objectName).getSignedUrl(
    {
      version: 'v2', // defaults to 'v2' if missing.
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60, // one hour
    }
  )
  return url;
}

const deleteFile = async (objectName) => {
  try {
    await bucket.file(objectName).delete();
    return true;
  } catch (e) {
    console.log('Google storage file deletion error:', e)
    return false;
  }
}

module.exports = {
  uploadFile,
  getObjectSignedUrl,
  deleteFile,
};
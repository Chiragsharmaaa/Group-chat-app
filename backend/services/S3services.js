const AWS = require('aws-sdk');
require('dotenv').config();

exports.uploadtoS3 = (file, filename) => {

    const s3Bucket = new AWS.S3({
        accessKeyId: process.env.IAM_ACCESS_KEY,
        secretAccessKey: process.env.IAM_SECRET_KEY,
        region: process.env.AWS_REGION
    })
    console.log('file', file)
    var params = {
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
        Body: file,
        ACL: 'public-read'
    };
    console.log(params);
    return new Promise((resolve, reject) => {
        s3Bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('Something went wrong!', err);
                reject(err);
            } else {
                console.log(s3response)
                return resolve(s3response.Location);
            };
        });
    });
};

exports.listObjectsInBucket = () => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.IAM_ACCESS_KEY,
        secretAccessKey: process.env.IAM_SECRET_KEY,
        region: process.env.AWS_REGION
    });

    const params = {
        Bucket: process.env.BUCKET_NAME
    };

    return new Promise((resolve, reject) => {
        s3.listObjects(params, (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(data.Contents)
                resolve(data.Contents);
            }
        });
    });
};

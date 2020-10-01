const mongoose = require("mongoose");
const aws = require("ibm-cos-sdk");

const ImageSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


ImageSchema.pre("save", function () {
  if (!this.url) {
    this.url = process.env.PETS_URL + this.key;
  }
});


ImageSchema.pre("remove", function () {
  const IBM = {
    endpoint: process.env.ENDPOINT,
    accessKeyId: process.env.AWS_ACESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACESS_KEY,
    region: process.env.S3REGION
  }
  const s3 = new aws.S3(IBM);

  if (process.env.STORAGE_TYPE === "s3") {
    if (this.key != "InitialPetProfile.jpg" || this.key != "InitialProfile.png" || this.key != "NoPicturePost.jpg") {
      return s3
        .deleteObject({
          Bucket: process.env.BUCKET_NAME,
          Key: this.key
        })
        .promise()
        .then(response => {
          console.log(response.status);
        })
        .catch(response => {
          console.log(response.status);
        })
    }
  }
});

module.exports = mongoose.model("Image", ImageSchema);

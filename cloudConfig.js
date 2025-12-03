const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//this configuration code is not there in npmjs cloudinary docs, but there in actual cloudinary docs
//http://cloudinary.com/documentation/node_integration#configuration 
//the names cloud_name, api_key, api_secret are fixed, don't change them. So always set those as variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
    //cconfuring the details stored in the .env file
})


//DEFINE storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["jpeg", "png", "jpg"], // supports promises as well

    public_id: (req, file) => Date.now() + '-' + file.originalname
    //commenting this for now, public id is used to generate the name for the file in the cloudinary cloud
  },
});


module.exports = {storage, cloudinary}
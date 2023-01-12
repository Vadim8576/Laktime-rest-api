const multer = require('multer');
const path = require('path');

const directory = process.env.IMAGES_PATH;

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./${directory}`);
  },
  filename: (req, file, cb) => {
    let image_id1 = Date.now();
    let image_id2 = Date.now();
    while (image_id1 === image_id2) {
      image_id2 = Date.now();
    }
    const fileName = `image-${image_id2}${path.extname(file.originalname)}`;
    console.log('multer file = ', fileName)
    cb(null, fileName);
  }
});

const multerFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(png|jpg)$/)) {
    return cb(new Error('Можно загрузить изображения только в PNG и JPG формате'))
    // const  message = getReaponse('EXTENSION-ERROR')
    // return res.status(message.statusCode).json(message)
  }
  cb(null, true)
};

exports.multer = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

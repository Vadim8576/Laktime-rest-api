const fs = require('fs');
const path = require('path');

const directory = 'images'; // перенести в evn

exports.deleteAllImagesFiles = (files_path) => fs.readdir(directory, (err, _) => {

    // if (err) throw err;
    if (err) console.log(err);

    if (!files_path.length) return

    const files = files_path.map(file => file.image_name);

    for (const file of files) {
        fs.unlink(path.join(directory, file), err => {
            // if (err) throw err;
            if (err) console.log(err);
        });
    }
});
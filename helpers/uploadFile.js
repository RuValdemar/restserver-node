const path  = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (files, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {

    return new Promise( (resolve, reject ) => {

        const { file } = files;
        const shortedName = file.name.split('.');
        const extension = shortedName[shortedName.length - 1];
    
        // Validar extensión        
        if (!validExtensions.includes(extension)) {
            return reject(`La extensión ${ extension } no es permitida. Solo se admite ${validExtensions}`)
        }
    
        const tempName = uuidv4() + '.' + extension;
        const uploadPath = path.resolve(__dirname, '../uploads/', folder, tempName);
    
        file.mv(uploadPath, (err) => {
            if (err) {
               reject(err);
            }
    
           resolve(tempName);
    
        });

    })

}

module.exports = {
    uploadFile
}
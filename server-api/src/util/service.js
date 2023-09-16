const multer = require("multer")

const Config = {
    image_path : "C:/xampp/htdocs/image_path/",
}

const isEmptyOrNull=(value) => {
    if(value == "" || value == null || value== "null"){
        return true
    }
    return false
}

const upload = multer({
    storage : multer.diskStorage({
        destination : function (req,file,callback){
            callback(null,Config.image_path)
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now())
          }
    }),
    limits : {
        fileSize : 1024*1024*5
    }
})

module.exports = {
    Config,
    isEmptyOrNull,
    upload
}
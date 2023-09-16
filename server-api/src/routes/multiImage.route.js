const {upload} = require("../util/service")
const controller = require ('../controllers/multiImage.controller');

const multiImage = (app) =>{
    app.get("/api/multiImage/getList",controller.getList);
    app.post("/api/multiImage/create",upload.array("images"),controller.create);
    app.put("/api/multiImage/update",upload.array("images"),controller.update);
    app.delete("/api/multiImage/remove/:id",controller.remove);

    app.get("/api/multiImage/getListImage/:id",controller.getListImage);
    app.post("/api/multiImage/createImage",upload.single("images"),controller.createImage);
    app.put("/api/multiImage/updateImage",upload.single("images"),controller.updateImage);
    app.delete("/api/multiImage/removeImage/:id",controller.removeImage);
}
module.exports = multiImage;
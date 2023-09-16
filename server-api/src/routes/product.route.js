const {upload} = require("../util/service")
const controller = require ('../controllers/product.controller');

const product = (app) =>{
    app.get("/api/product/getListProduct",controller.getListProduct);
    app.get("/api/product/getListProductImage/:id",controller.getListProductImage);
    app.post("/api/product/create",upload.array("images"),controller.create);
    app.put("/api/product/update",upload.array("images"),controller.update);
    app.put("/api/product/UpdateProductImage",upload.single("images"),controller.UpdateProductImage);
    app.delete("/api/product/remove/:id",controller.remove);
    app.delete("/api/product/removeProductImage/:id",controller.removeProductImage);
}
module.exports = product;
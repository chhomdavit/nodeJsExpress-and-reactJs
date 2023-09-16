const {upload} = require("../util/service")
const { userGuard } = require("../controllers/auth.controller")
const controller = require ('../controllers/category.controller');

const category = (app) =>{
    app.get("/api/category/getList",userGuard("category.Read"),controller.getList);
    app.post("/api/category/create",userGuard("category.Create"),upload.single("category_img"),controller.create);
    app.put("/api/category/update",userGuard("category.Update"),upload.single("category_img"),controller.update);
    app.delete("/api/category/remove/:id",userGuard("category.Delete"),controller.remove);
}
module.exports = category;
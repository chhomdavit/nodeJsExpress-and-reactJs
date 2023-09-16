const {upload} = require("../util/service")
const controller = require ('../controllers/adminUser.controller');

const adminUser = (app) =>{
    app.get("/api/adminUser/getList",controller.getList);
    app.post("/api/adminUser/login",controller.login);
    app.post("/api/adminUser/create",upload.single("image_admin"),controller.create);
    app.put("/api/adminUser/update",upload.single("image_admin"),controller.update);
    app.put("/api/adminUser/updatePassword",upload.single("image_admin"),controller.updatePassword);
    app.delete("/api/adminUser/remove/:id",controller.remove);
}
module.exports = adminUser;
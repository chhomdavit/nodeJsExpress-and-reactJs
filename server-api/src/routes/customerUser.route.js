const {upload} = require("../util/service")
const controller = require ('../controllers/customerUser.controller');

const customerUser = (app) =>{
    app.get("/api/customerUser/getList",controller.getList);
    app.post("/api/customerUser/login",controller.login);
    app.post("/api/customerUser/create",upload.single("customerUserImg"),controller.create);
    app.put("/api/customerUser/update",upload.single("customerUserImg"),controller.update);
    app.put("/api/customerUser/updatePassword",upload.single("image_admin"),controller.updatePassword);
    app.delete("/api/customerUser/remove/:id",controller.remove);
}
module.exports = customerUser;
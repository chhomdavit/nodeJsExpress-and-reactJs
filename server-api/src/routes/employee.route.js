const {upload} = require("../util/service")
const controller = require ('../controllers/employee.contoller');

const employee = (app) =>{
    app.get("/api/employee/getAll",controller.getAll);
    app.get("/api/employee/getOne/:id",controller.getOne);
    app.post("/api/employee/login",controller.login);
    app.post("/api/employee/create",controller.create);
    app.put("/api/employee/update",controller.update);
    app.post("/api/employee/employee_setPassword",controller.setPassword);
    app.delete("/api/employee/remove/:id",controller.remove);
}
module.exports = employee;
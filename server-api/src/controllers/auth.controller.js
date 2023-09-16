const { TOKEN_KEY } = require("../util/service");
require ('dotenv').config();
const db = require('../config/db.config');
const jwt = require("jsonwebtoken")


exports.userGuard = (parameter) => {
    return (req, res, next) => {
        var authorization = req.headers.authorization; 
        var token_from_client = null
        if (authorization != null && authorization != "") {
            token_from_client = authorization.split(" ") 
            token_from_client = token_from_client[1]
        }
        if (token_from_client == null) {
            res.status(401).send({
                message: 'Unauthorized',
            });
        } else {
            jwt.verify(token_from_client, process.env.KEY_ACCESS_TOKEN, (error, result) => {
                
                if (error) {
                    res.status(401).send({
                        message: 'Unauthorized',
                        error: error
                    });
                } else {
                    var permission = result.data.permission 
                    req.user = result.data 
                    req.user_id = result.data.user.employee_id 
                    if(parameter == null){
                        next();
                    }else if(permission.includes(parameter)){
                        next();
                    }else{
                        res.status(401).send({
                            message: 'Unauthorized',
                        });
                    }
                   
                }
            })
        }
    }
}

exports.userGuardV1 = (req, res, next) => { 
    var authorization = req.headers.authorization; 
    var token_from_client = null
    if (authorization != null && authorization != "") {
        token_from_client = authorization.split(" ") 
        token_from_client = token_from_client[1]
    }
    if (token_from_client == null) {
        res.status(401).send({
            message: 'Unauthorized',
        });
    } else {
        jwt.verify(token_from_client, process.env.KEY_ACCESS_TOKEN, (error, result) => {
            if (error) {
                res.status(401).send({
                    message: 'Unauthorized',
                    error: error
                });
            } else {
                var permisson = result.data.permisson 
                req.user = result.data 
                req.user_id = result.data.user.employee_id 
                next();
            }
        })
    }
}

exports.getPermissionUser = async (id) => {
    var sql = "SELECT" +
        " p.code" +
        " FROM employee c" +
        " INNER JOIN role r ON c.role_id = r.role_id" +
        " INNER JOIN role_permission rp ON r.role_id = rp.role_id" +
        " INNER JOIN permission p ON rp.permission_id = p.permission_id" +
        " WHERE c.employee_id = ? ";
    var list = await db.query(sql, [id]);
    var tmpArr = [];
    list.map((item, index) => [
        tmpArr.push(item.code)
    ])
    return tmpArr;
}
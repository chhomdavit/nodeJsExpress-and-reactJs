const db = require('../config/db.config');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {isEmptyOrNull} = require("../util/service");
require ('dotenv').config();

const getList = (req, res) => {
    sqlSelect = "SELECT * FROM `admin_user`"
    db.query(sqlSelect, (error, result) => {
        if (error) {
            res.json({
                error: true,
                message: error
            })
        } else {
            res.json({
                list_adminUser: result
            })
        }
    })
}

const create = (req, res) => {
    var { firstname, lastname, gender, dob, telephone, user_email, password, image_admin, is_active, create_at } = req.body
    var image_admin = null 
    if(req.file){
        image_admin = req.file.filename
    }
    var message = {}
    if (isEmptyOrNull(firstname)) {
        message.firstname = "please fill in firstname!"
    }
    if (isEmptyOrNull(lastname)) {
        message.lastname = "please fill in lastname!"
    }
    if (isEmptyOrNull(user_email)) {
        message.user_email = "please fill in user_email!"
    }
    if (isEmptyOrNull(password)) {
        message.password = "please fill in user_email!"
    }
    if (Object.keys(message).length > 0) {
        res.json({
            error: true,
            message: message
        })
        return
    }
    var password = bcrypt.hashSync(password,10)
    var sqlInsert = 'INSERT INTO `admin_user`(`firstname`, `lastname`, `gender`, `dob`, `telephone`, `user_email`, `password`, `image_admin`, `is_active`, `create_at`) VALUES (?,?,?,?,?,?,?,?,?,?)'
    var sqlParam = [firstname, lastname, gender, dob, telephone, user_email, password, image_admin, is_active, create_at]
    db.query(sqlInsert,sqlParam,(error,result)=>{
        if(error){
            res.json({
                error: true,
                message: error
            })
        }else{
            res.json({
                message: 'admin user have been insert'
            })
        }
    })
}

const getListOne = (req,res) => {
    var dataCars = [
        {
          id :1,
          name: "a",
        },
        {
          id :2,
          name: "b"
        },
        {
          id :3,
          name: "c"
        }
      ]
    var authorization = req.headers.authorization;
    var token_from_client = null
    if(authorization != null && authorization != ""){
        token_from_client = authorization.split(" ")
        token_from_client = token_from_client[1]
    }

    if(token_from_client == null){
        res.json({
            error: true,
            message : "You have permission access this method!"
        })
    }else{
        jwt.verify(token_from_client,process.env.KEY_ACCESS_TOKEN,(err,data)=>{
            if(err){
                res.json({
                    error: true,
                    message : "Invalid token!"
                })
            }else{
                res.json({
                    cart : data,
                    dataCars : dataCars
                })
            }
        })
    }
  }

const login = (req,res) =>{
    var { user_email, password } = req.body;
    var message = {}

    if (isEmptyOrNull(user_email)) {
        message.user_email = "please fill in user_email !"
    }
    if (isEmptyOrNull(password)) {
        message.password = "please fill in password !"
    }
    db.query("SELECT * FROM `admin_user` WHERE user_email = ?",[user_email], (error, results) => {
        if (error) {
            res.json({
                error: true,
                message: error
            })
        } else {
            if (results.length == 0) {
                res.json({
                    error: true,
                    message: "User dose not exist. Please register!"
                })
            } else {
                var data = results[0]
                var passwordInDb = data.password
                var isCorrectPassword = bcrypt.compareSync(password, passwordInDb)
                if (isCorrectPassword) {
                    delete data.password;
                    var token = jwt.sign({profile:data},process.env.KEY_ACCESS_TOKEN)
                    res.json({
                        is_login : true,
                        message  : "Login success!",
                        profile  : data,
                        token    : token
                    })
                } else {
                    res.json({
                        error: true,
                        message: "Incorrect password"
                    })
                }
            }
        }
    })
}

const update = (req, res) => {
    var { firstname, lastname, gender, dob, telephone, user_email, image_admin, is_active, create_at, admin_user_id } = req.body
    var image_admin = null
    if (req.file) {
        image_admin = req.file.filename
    }
    var message = {}
    if (isEmptyOrNull(firstname)) {
        message.firstname = "please fill in firstname!"
    }
    if (isEmptyOrNull(lastname)) {
        message.lastname = "please fill in lastname!"
    }
    if (isEmptyOrNull(user_email)) {
        message.user_email = "please fill in user_email!"
    }

    if (Object.keys(message).length > 0) {
        res.json({
            error: true,
            message: message
        })
        return
    }

    // Get the password from the database by admin_user_id
    var sqlGetPassword = 'SELECT password FROM admin_user WHERE admin_user_id=?'
    var sqlParamGetPassword = [admin_user_id]
    db.query(sqlGetPassword, sqlParamGetPassword, (error, result) => {
        if (error) {
            res.json({
                error: true,
                message: error
            })
        } else {
            var passwordFromDB = result[0].password
            var passwordFromReq = req.body.password
            bcrypt.compare(passwordFromReq, passwordFromDB, (error, isMatch) => {
                if (error) {
                    res.json({
                        error: true,
                        message: error
                    })
                } else {
                    if (isMatch) {
                        var sqlUpdate = 'UPDATE admin_user SET firstname=?,lastname=?,gender=?,dob=?,telephone=?,user_email=?,image_admin=IFNULL(?,image_admin),is_active=?,create_at=? WHERE admin_user_id=?'
                        var sqlParamUpdate = [firstname, lastname, gender, dob, telephone, user_email, image_admin, is_active, create_at, admin_user_id]
                        db.query(sqlUpdate, sqlParamUpdate, (error, result) => {
                            if (error) {
                                res.json({
                                    error: true,
                                    message: error
                                })
                            } else {
                                res.json({
                                    message: 'admin user have been update'
                                })
                            }
                        })
                    } else {
                        res.json({
                            error: true,
                            message: 'password is incorrect'
                        })
                    }
                }
            })
        }
    })
}

const updatePassword = (req, res) => {
    var { user_email, old_password, new_password, create_at, admin_user_id } = req.body

    var message = {}
    if (isEmptyOrNull(user_email)) {
        message.user_email = "please fill in user_email!"
    }
    if (isEmptyOrNull(new_password)) {
        message.new_password = "please fill in new_password!"
    }
    if (Object.keys(message).length > 0) {
        res.json({
            error: true,
            message: message
        })
        return
    }

    const updatePassword = (req, res) => {
        var { firstname, lastname, gender, dob, telephone, user_email, old_password, new_password, image_admin, is_active, create_at, admin_user_id } = req.body
        var image_admin = null
        if (req.file) {
            image_admin = req.file.filename
        }
        var message = {}
        if (isEmptyOrNull(firstname)) {
            message.firstname = "please fill in firstname!"
        }
        if (isEmptyOrNull(lastname)) {
            message.lastname = "please fill in lastname!"
        }
        if (isEmptyOrNull(user_email)) {
            message.user_email = "please fill in user_email!"
        }
        if (isEmptyOrNull(new_password)) {
            message.new_password = "please fill in new_password!"
        }
        if (Object.keys(message).length > 0) {
            res.json({
                error: true,
                message: message
            })
            return
        }
    
        // retrieve current password hash from database
        var sqlSelect = 'SELECT password FROM admin_user WHERE admin_user_id=?'
        db.query(sqlSelect, [admin_user_id], (error, result) => {
            if (error) {
                res.json({
                    error: true,
                    message: error
                })
            } else {
                // compare old password with current password hash
                var current_password_hash = result[0].password
                var is_old_password_correct = bcrypt.compareSync(old_password, current_password_hash)
                if (is_old_password_correct) {
                    // update password with new one
                    var new_password_hash = bcrypt.hashSync(new_password, 10)
                    var sqlUpdate = 'UPDATE admin_user SET firstname=?,lastname=?,gender=?,dob=?,telephone=?,user_email=?,password=?,image_admin=IFNULL(?,image_admin),is_active=?,create_at=? WHERE admin_user_id=?'
                    var sqlParam = [firstname, lastname, gender, dob, telephone, user_email, new_password_hash, image_admin, is_active, create_at, admin_user_id]
                    db.query(sqlUpdate, sqlParam, (error, result) => {
                        if (error) {
                            res.json({
                                error: true,
                                message: error
                            })
                        } else {
                            res.json({
                                message: 'admin user have been updated'
                            })
                        }
                    })
                } else {
                    // return error message if old password is incorrect
                    res.json({
                        error: true,
                        message: 'old password is incorrect'
                    })
                }
            }
        })
    }
    var sqlSelect = 'SELECT password FROM admin_user WHERE admin_user_id=?'
    db.query(sqlSelect, [admin_user_id], (error, result) => {
        if (error) {
            res.json({
                error: true,
                message: error
            })
        } else {
            var current_password_hash = result[0].password
            var is_old_password_correct = bcrypt.compareSync(old_password, current_password_hash)
            if (is_old_password_correct) {
                var new_password_hash = bcrypt.hashSync(new_password, 10)
                var sqlUpdate = 'UPDATE admin_user SET user_email=?,password=?,create_at=? WHERE admin_user_id=?'
                var sqlParam = [ user_email, new_password_hash, create_at, admin_user_id]
                db.query(sqlUpdate, sqlParam, (error, result) => {
                    if (error) {
                        res.json({
                            error: true,
                            message: error
                        })
                    } else {
                        res.json({
                            message: 'admin user have been updated'
                        })
                    }
                })
            } else {
                res.json({
                    error: true,
                    message: 'old password is incorrect'
                })
            }
        }
    })
}

const remove = (req,res) =>{ 
    var sqlDelete = 'DELETE FROM `admin_user` WHERE admin_user_id ='
    db.query(sqlDelete +req.params.id,(error,result)=>{
        if(error){
            res.json({
               error:true,
               message:error
            })
        }else{
           if(result.affectedRows !=0){
            res.json({
                message: "Deleted",
                data: result
            })
           }else{
            res.json({
                message: "Delete not complete.Customer not found"
            })
           }
        }
    })
}

// const remove = (req, res) => {
//     let password = req.body.password;
//     password = db.escape(password);
//     let sqlDelete = `DELETE FROM admin_user WHERE password = ${password}`;
//     db.query(sqlDelete, (error, result) => {
//       if (error) {
//         res.json({
//           error: true,
//           message: error,
//         });
//       } else {
//         if (result.affectedRows != 0) {
//           res.json({
//             message: "Deleted",
//             data: result,
//           });
//         } else {
//           res.json({
//             message: "Delete not complete. No user with that password found",
//           });
//         }
//       }
//     });
//   };

module.exports = {
    getList,
    getListOne,
    create,
    login,
    update,
    updatePassword,
    remove,
}
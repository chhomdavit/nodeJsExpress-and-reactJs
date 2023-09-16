const db = require('../config/db.config');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {isEmptyOrNull} = require("../util/service");
require ('dotenv').config();

const getList = (req, res) => {
    sqlSelect = "SELECT * FROM `customer_user`"
    db.query(sqlSelect, (error, result) => {
        if (error) {
            res.json({
                error: true,
                message: error
            })
        } else {
            res.json({
                Data_CustomerUser: result
            })
        }
    })
}

const create = (req, res) => {
    var { username, password, dob, customerUserImg } = req.body
    var customerUserImg = null 
    if(req.file){
        customerUserImg = req.file.filename
    }

    var message = {}
    if (isEmptyOrNull(username)) {
        message.username = "please fill in username!"
    }
    if (isEmptyOrNull(password)) {
        message.password = "please fill in password!"
    }

    if (Object.keys(message).length > 0) {
        res.json({
            error: true,
            message: message
        })
        return
    }

    var password = bcrypt.hashSync(password,10)
    var sqlInsert = 'INSERT INTO `customer_user`( `username`, `password`, `dob`, `customerUserImg`) VALUES (?,?,?,?)'
    var sqlParam = [username, password, dob, customerUserImg]
    db.query(sqlInsert,sqlParam,(error,result)=>{
        if(error){
            res.json({
                error: true,
                message: error
            })
        }else{
            res.json({
                message: 'customer user have been insert'
            })
        }
    })
}

const login = async (req,res) =>{
    var { username, password } = req.body;
    var message = {}

    if (isEmptyOrNull(username)) {
        message.username = "please fill in username !"
    }
    if (isEmptyOrNull(password)) {
        message.password = "please fill in password !"
    }
    db.query("SELECT * FROM `customer_user` WHERE username = ?",[username], (error, results) => {
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
    var { username, password, dob, customerUserImg, customerUser_id } = req.body
    var customerUserImg = null 
    if(req.file){
        customerUserImg = req.file.filename
    }

    var message = {}
    if (isEmptyOrNull(username)) {
        message.username = "please fill in username!"
    }
    if (isEmptyOrNull(password)) {
        message.password = "please fill in password!"
    }

    if (Object.keys(message).length > 0) {
        res.json({
            error: true,
            message: message
        })
        return
    }

    var sqlUpdate = 'UPDATE `customer_user` SET `username`=?,`password`=?,`dob`=?,`customerUserImg`=? WHERE `customerUser_id`=?'
    var sqlParam = [username, password, dob, customerUserImg, customerUser_id]
    db.query(sqlUpdate,sqlParam,(error,result)=>{
        if(error){
            res.json({
                error: true,
                message: error
            })
        }else{
            res.json({
                message: 'customer user have been update'
            })
        }
    })
}

const updatePassword = (req, res) => {
  
}

const remove = (req,res) =>{ 
    var sqlDelete = 'DELETE FROM `customer_user` WHERE customerUser_id ='
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

module.exports = {
    getList,
    create,
    login,
    update,
    updatePassword,
    remove,
}
const db = require('../config/db.config');
const {isEmptyOrNull} = require("../util/service");


const getList = (req,res) =>{
   var sqlSelect = "SELECT * FROM `category`"
   db.query(sqlSelect,(error,result)=>{
    if(error){
        res.json({
            error: true,
            message : error
        })
    }else{
        res.json({
            list_category : result
        })
    }
   })
}

const create = (req,res)=>{
    var {category_name, category_desc, category_img, create_at, create_by
} = req.body
    var message = {}
    if(isEmptyOrNull(category_name)){
        message.category_name = "please fill in category_name!"
    }
    if(Object.keys(message).length > 0){
        res.json({
            error : true,
            message : message
        })
        return 
    }
    var category_img = null
    if(req.file){
        category_img = req.file.filename
    }
    var sqlInsert = "INSERT INTO `category`( `category_name`, `category_desc`, `category_img`, `create_at`, `create_by`) VALUES (?,?,?,?,?)"
    db.query(sqlInsert,[category_name, category_desc, category_img, create_at, create_by],(error,results)=>{
        if(error){
           res.json({
            error : true,
            message : error
           })
        }else{
            res.json({
                message : "Category Insert success!",
            })
        }
    })
};

const update = (req, res) => {
    var { category_name, category_desc, category_img, create_at, create_by, category_id } = req.body
    var message = {}
    if (isEmptyOrNull(category_name)) {
        message.category_name = "please fill in category_name!"
    }
    if (Object.keys(message).length > 0) {
        res.json({
            error: true,
            message: message
        })
        return
    }
    var category_img = null
    if (req.file) {
        category_img = req.file.filename
    }
    var sqlUpate = "UPDATE `category` SET `category_name`=?,`category_desc`=?,`category_img`=IFNULL(?,category_img),`create_at`=?,`create_by`=? WHERE `category_id`=?"
    db.query(sqlUpate, [category_name, category_desc, category_img, create_at, create_by, category_id], (error, results) => {
        if (error) {
            res.json({
                error: true,
                message: error
            })
        } else {
            res.json({
                message: "Categorty updated !",
            })
        }
    })
};

const remove = (req,res)=>{
    var id = req.params.id
    var sqlDelete = "DELETE FROM `category` WHERE category_id = "
    db.query(sqlDelete + id,(error,results)=>{
        if(error){
            res.json({
                error:true,
                message : error
            })
        }else{
            if(results.affectedRows !=0){
                res.json({
                    message : "Category Deleted!",
                    data_category : results
                })
            }else{
                res.json({
                    message : "Delete not complete",
                    data_category : results
                })
            }
        }
    })
};

module.exports = {
    getList,
    create,
    update,
    remove,
}
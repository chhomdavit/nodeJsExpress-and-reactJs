const db = require('../config/db.config');
const {isEmptyOrNull} = require("../util/service");

const getList = (req, res) => {
  var Select = "SELECT i.*, "+   
               "(SELECT images FROM multi_image mi WHERE i.image_id = mi.image_id LIMIT 1) as images , "+ 
               "c.category_name as category_name "+ 
               "FROM image i "+
               "LEFT JOIN category c ON i.category_id = c.category_id; " 
  db.query(Select, (error, result) => {
    if (error) {
      res.json({
        error: true,
        message: error
      })
    } else {
      db.query('SELECT * FROM `category`',(errorOne,resultOne)=>{
        if(errorOne){
          res.json({
            error: true,
            message: error
          })
        }else{
          res.json({
            list_images: result,
            list_category: resultOne
          })
        }
      })
    }
  })
}

const create = (req, res) => {
  var { image_name, dob, category_id, create_at } = req.body

  var images = null
  if (req.files) {
    images = req.files
  }

  var message = {}
  if (isEmptyOrNull(image_name)) {
    message.image_name = "please fill in image_name!"
  }
  if (isEmptyOrNull(category_id)) {
    message.category_id = "please fill in category_id!"
  }
  if (Object.keys(message).length > 0) {
    res.json({
      error: true,
      message: message
    })
    return
  }
  var mainSql = 'INSERT INTO `image`( `image_name`, `dob`, `category_id`, `create_at`) VALUES (?,?,?,?)'
  db.query(mainSql, [image_name, dob, category_id, create_at], (errorOne, resultOne) => {
    if (errorOne) {
      res.json({
        errorOne: true,
        message: errorOne
      })
    } else {
      if (images && images.length > 0) {
        var image_id = resultOne.insertId
        var param = []
        for (var i = 0; i < images.length; i++) {
          var item_param = [image_id, images[i].filename]
          param.push(item_param)
        }
        var subSpl = "INSERT INTO `multi_image`(`image_id`, `images`) VALUES ?"
        db.query(subSpl, [param], (error, resulTwo) => {
          if (error) {
            res.json({
              error: error
            })
          } else {
            res.json({
              message: 'Product have been inserted !'
            })
          }
        })
      } else {
        res.json({
          message: 'Product have been inserted !'
        })
      }
    }
  })
}

const update = (req, res) => {
  var { image_name, dob, category_id, create_at, image_id } = req.body
  var images = null
  if (req.files) {
    images = req.files
  }
  var message = {}
  if (isEmptyOrNull(image_name)) {
    message.image_name = "please fill in image_name!"
  }
  if (Object.keys(message).length > 0) {
    res.json({
      error: true,
      message: message
    })
    return
  }
  if (!images || images.length === 0) {
    var mainSql = 'UPDATE `image` SET `image_name`=?,`dob`=?,`category_id`=?,`create_at`=? WHERE `image_id`=?'
    db.query(mainSql, [image_name, dob, category_id, create_at, image_id], (errorOne, resultOne) => {
      if (errorOne) {
        res.json({
          errorOne: true,
          message: errorOne
        })
      } else {
        res.json({
          message: 'Product have been updated !'
        })
      }
    })
  } else {
    var mainSql = 'UPDATE `image` SET `image_name`=?,`dob`=?,`category_id`=?,`create_at` = ?   WHERE `image_id`=?'
    db.query(mainSql, [image_name, dob, category_id, create_at, image_id], (errorOne, resultOne) => {
      if (errorOne) {
        res.json({
          errorOne: true,
          message: errorOne
        })
      } else {
        var param = []
        for (var i = 0; i < images.length; i++) {
          var item_param = [image_id, images[i].filename]
          param.push(item_param)
        }
        var insertSql = "INSERT INTO `multi_image` (`image_id`, `images`) VALUES ?"
        db.query(insertSql, [param], (errorThree, resultThree) => {
          if (errorThree) {
            res.json({
              errorThree: errorThree
            })
          } else {
            res.json({
              message: 'Product have been updated !'
            })
          }
        })
      }
    })
  }
}

const remove = (req, res) => {
  db.query("DELETE FROM `image` WHERE image_id = " + req.params.id, (error, results) => {
    if (error) {
      res.json({
        error: true,
        message: error
      })
    } else {
      db.query("DELETE FROM `multi_image` WHERE image_id = " + req.params.id,(errorOne,resultsOne)=>{
        if (error) {
          res.json({
            errorOne: true,
            message: errorOne
          })
        }else{
          if (resultsOne.affectedRows != 0) {
            res.json({
              message: "Product have been deleted!",
              data: results
            })
          } else {
            res.json({
              message: "Delete not complete. Product not found"
            })
          }
        }
      })
    }
  })
}



const getListImage = (req, res) => {
  var {id} = req.params
  // var Select = "SELECT * FROM `multi_image` WHERE image_id = ?"
  var Select = 'SELECT mi.*, '+
  'i.image_name as name '+
  'FROM multi_image as mi '+
  'INNER JOIN image as i ON mi.image_id = i.image_id '+
  'WHERE mi.image_id = ?; '
  db.query(Select,[id],(error, result) => {
    if (error) {
      res.json({
        error: true,
        message: error
      })
    } else {
      res.json({
        data_Multi_Images: result
      })
    }
  })
}

const createImage = (req, res) => {
      var {images} = req.body
      var message = {}
      // if(isEmptyOrNull(images)){
      //     message.images = "please fill in images!"
      // }
      if(Object.keys(message).length > 0){
          res.json({
              error : true,
              message : message
          })
          return 
      }
      var images = null
      if(req.file){
        images = req.file.filename
      }
      var sqlInsert = "INSERT INTO `multi_image`(`images`) VALUES (?,?)"
      db.query(sqlInsert,[images],(error,results)=>{
          if(error){
             res.json({
              error : true,
              message : error
             })
          }else{
              res.json({
                  message : "images Insert success!",
              })
          }
      })
}

const updateImage = (req, res) => {
  var { images,multi_image_id } = req.body
  var message = {}
  // if (isEmptyOrNull(images)) {
  //     message.images = "please fill in images!"
  // }
  if (Object.keys(message).length > 0) {
      res.json({
          error: true,
          message: message
      })
      return
  }
  var images = null
  if (req.file) {
    images = req.file.filename
  }
  var sqlUpate = "UPDATE `multi_image` SET `images`=? WHERE `multi_image_id`=?"
  db.query(sqlUpate, [images ,multi_image_id], (error, results) => {
      if (error) {
          res.json({
              error: true,
              message: error
          })
      } else {
          res.json({
              message: "Images updated !",
          })
      }
  })
}

const removeImage = (req, res) => {
  var id = req.params.id
  var sqlDelete = "DELETE FROM `multi_image` WHERE multi_image_id = "
  db.query(sqlDelete + id,(error,results)=>{
      if(error){
          res.json({
              error:true,
              message : error
          })
      }else{
          if(results.affectedRows !=0){
              res.json({
                  message : "Images Deleted!",
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
}

module.exports = {
    getList,
    create,
    update,
    remove,
    getListImage,
    createImage,
    updateImage,
    removeImage,
}
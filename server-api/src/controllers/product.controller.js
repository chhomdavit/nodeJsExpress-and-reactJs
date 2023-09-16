const db = require('../config/db.config');
const {isEmptyOrNull} = require("../util/service");
const jwt = require('jsonwebtoken')


const getListProduct = (req, res) => {
  var Select = " SELECT "+
               " p.*, "+
               " (SELECT images FROM product_image pi WHERE p.product_id = pi.product_id LIMIT 1) as images , "+
               " c.category_name as category_name , "+
               " CONCAT(au.firstname, ' ', au.lastname) as admin_name "+
               " FROM product p "+
               " LEFT JOIN category c ON p.category_id = c.category_id "+
               " INNER JOIN admin_user au ON p.admin_user_id = au.admin_user_id;"
  db.query(Select,(error,result)=>{
    if(error){
      res.json({
        error: true,
        message: error
      })
    }else{
      db.query('SELECT * FROM `category`',(errorOne,resultOne)=>{
        if(errorOne){
          res.json({
            error: true,
            message: error
          })
        }else{
          res.json({
            list_product: result,
            list_category: resultOne
          })
        }
      })
    }
  })
}

const getListProductImage = (req, res) => {
  var {id} = req.params
  var Select = 'SELECT pi.*, p.product_name as product_name FROM product_image as pi INNER JOIN product as p ON pi.product_id = p.product_id WHERE pi.product_id = ?;'
  db.query(Select,[id],(error,result)=>{
    if(error){
      res.json({
        error: true,
        message: error
      })
    }else{
      res.json({
        list_productImage: result
      })
    }
  })
}

const create = (req, res) => {
  var authorization = req.headers.authorization;
  var token_from_client = null
  if (authorization != null && authorization != "") {
    token_from_client = authorization.split(" ")
    token_from_client = token_from_client[1]
  }

  if (token_from_client == null) {
    res.json({
      error: true,
      message: "You have permission access this method!"
    })
  } else {
    jwt.verify(token_from_client, process.env.KEY_ACCESS_TOKEN, (err, resutltFormToken) => {
      if (err) {
        res.json({
          error: true,
          message: "Invalid token!"
        })
      } else {
        var { product_name, category_id, product_barcode, product_price, product_quantity, product_desc, product_status, create_at, create_by} = req.body
        var admin_user_id = resutltFormToken.profile.admin_user_id
        var message = {}
        if (isEmptyOrNull(product_name)) {
          message.product_name = "please fill in product_name !"
        }
        if (Object.keys(message).length > 0) {
          res.json({
            error: true,
            message: message
          })
          return
        }
        var images = null
        if (req.files) {
          images = req.files
        }
        var mainSql = 'INSERT INTO product( product_name, category_id, admin_user_id, product_barcode, product_price, product_quantity, product_desc, product_status, create_at, create_by) VALUES (?,?,?,?,?,?,?,?,?,?)'
        var mainParam = [product_name, category_id, admin_user_id, product_barcode, product_price, product_quantity, product_desc, product_status, create_at, create_by]
        db.query(mainSql, mainParam, (errorOne, resultOne) => {
          if (errorOne) {
            res.json({
              errorOne: true,
              message: errorOne
            })
          } else {
            if (images && images.length > 0) {
              var product_id = resultOne.insertId
              var param = []
              for (var i = 0; i < images.length; i++) {
                var item_param = [images[i].filename, product_id]
                param.push(item_param)
              }
              var subSpl = "INSERT INTO `product_image`(`images`, `product_id`) VALUES ?"
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
    })
  }
}

const update = (req, res) => {
  var authorization = req.headers.authorization;
  var token_from_client = null
  if (authorization != null && authorization != "") {
    token_from_client = authorization.split(" ")
    token_from_client = token_from_client[1]
  }

  if (token_from_client == null) {
    res.json({
      error: true,
      message: "You have permission access this method!"
    })
  } else {
    jwt.verify(token_from_client, process.env.KEY_ACCESS_TOKEN, (err, resutltFormToken) => {
      if (err) {
        res.json({
          error: true,
          message: "Invalid token!"
        })
      } else {
        var { product_id, product_name, category_id, product_barcode, product_price, product_quantity, product_desc, product_status, create_at, create_by } = req.body
        var admin_user_id = resutltFormToken.profile.admin_user_id
        var images = null
        if (req.files) {
          images = req.files
        }
        var message = {}
        if (isEmptyOrNull(product_name)) {
          message.name = "please fill in product_name!"
        }
        if (Object.keys(message).length > 0) {
          res.json({
            error: true,
            message: message
          })
          return
        }
        if (!images || images.length === 0) {
          var mainSql = 'UPDATE `product` SET `product_name`=?,`category_id`=?,`admin_user_id`=?,`product_barcode`=?,`product_price`=?,`product_quantity`=?,`product_desc`=?,`product_status`=?,`create_at`=?,`create_by`=? WHERE `product_id`=?'
          var mainParam = [product_name, category_id,admin_user_id, product_barcode, product_price, product_quantity, product_desc, product_status, create_at, create_by, product_id]
          db.query(mainSql, mainParam, (errorOne, resultOne) => {
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
          var mainSql = 'UPDATE `product` SET `product_name`=?,`category_id`=?,`admin_user_id`=?,`product_barcode`=?,`product_price`=?,`product_quantity`=?,`product_desc`=?,`product_status`=?,`create_at`=?,`create_by`=? WHERE `product_id`=?'
          var mainParam = [product_name, category_id,admin_user_id, product_barcode, product_price, product_quantity, product_desc, product_status, create_at, create_by, product_id]
          db.query(mainSql, mainParam, (errorOne, resultOne) => {
            if (errorOne) {
              res.json({
                errorOne: true,
                message: errorOne
              })
            } else {
              var param = []
              for (var i = 0; i < images.length; i++) {
                var item_param = [images[i].filename, product_id]
                param.push(item_param)
              }
              var insertSql = "INSERT INTO product_image(images, product_id) VALUES ?"
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
    })
  }
}

// const update = (req, res) => {
//   var { product_id, product_name, category_id, product_barcode, product_price, product_quantity, product_desc, product_status, create_at, create_by} = req.body
//   var images = null
//   if (req.files) {
//     images = req.files
//   }
//   var message = {}
//   if (isEmptyOrNull(product_name)) {
//     message.name = "please fill in product_name!"
//   }
//   if (Object.keys(message).length > 0) {
//     res.json({
//       error: true,
//       message: message
//     })
//     return
//   }
//   if (!images || images.length === 0) {
//     var mainSql = 'UPDATE `product` SET `product_name`=?,`category_id`=?,`product_barcode`=?,`product_price`=?,`product_quantity`=?,`product_desc`=?,`product_status`=?,`create_at`=?,`create_by`=? WHERE product_id = ?'
//     var mainParam = [ product_name, category_id, product_barcode, product_price, product_quantity, product_desc, product_status, create_at, create_by, product_id]
//     db.query(mainSql, mainParam, (errorOne, resultOne) => {
//       if (errorOne) {
//         res.json({
//           errorOne: true,
//           message: errorOne
//         })
//       } else {
//         res.json({
//           message: 'Product have been updated !'
//         })
//       }
//     })
//   } else {
//     var mainSql = 'UPDATE `product` SET `product_name`=?,`category_id`=?,`product_barcode`=?,`product_price`=?,`product_quantity`=?,`product_desc`=?,`product_status`=?,`create_at`=?,`create_by`=? WHERE product_id = ?'
//     var mainParam = [ product_name, category_id, product_barcode, product_price, product_quantity, product_desc, product_status, create_at, create_by, product_id]
//     db.query(mainSql, mainParam, (errorOne, resultOne) => {
//       if (errorOne) {
//         res.json({
//           errorOne: true,
//           message: errorOne
//         })
//       } else {
//         var param = []
//         for (var i = 0; i < images.length; i++) {
//           var item_param = [images[i].filename, product_id]
//           param.push(item_param)
//         }
//         var insertSql = "INSERT INTO product_image(images, product_id) VALUES ?"
//         db.query(insertSql, [param], (errorThree, resultThree) => {
//           if (errorThree) {
//             res.json({
//               errorThree: errorThree
//             })
//           } else {
//             res.json({
//               message: 'Product have been updated !'
//             })
//           }
//         })
//       }
//     })
//   }
// }

const UpdateProductImage = (req, res) => {
  var { image_id, product_id } = req.body
  if (req.file.filename) {
    images = req.file.filename
  }
  var sqlUpdate = 'UPDATE `product_image` SET `images`= ?,`product_id`= ? WHERE image_id = ?'
  var paramSql = [images, product_id, image_id]
  db.query(sqlUpdate, paramSql, (error, results) => {
    if (error) {
      res.json({
        error: true,
        message: error
      })
    } else {
      res.json({
        message: 'Product images have been insert success'
      })
    }
  })
}

const removeProductImage = (req, res) => {
  db.query("DELETE FROM `product_image` WHERE image_id =" + req.params.id, (error, results) => {
    if (error) {
      res.json({
        error: true,
        message: error
      })
    } else {
      if (results.affectedRows != 0) {
        res.json({
          message: "Product Images deleted!",
          data: results
        })
      } else {
        res.json({
          message: "Delete not complete. Product Images not found"
        })
      }
    }
  })
}

const remove = (req, res) => {
  db.query("DELETE FROM `product` WHERE product_id = " + req.params.id, (error, results) => {
    if (error) {
      res.json({
        error: true,
        message: error
      })
    } else {
      db.query("DELETE FROM `product_image` WHERE product_id = " + req.params.id,(errorOne,resultsOne)=>{
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

module.exports = {
    getListProduct,
    getListProductImage,
    create,
    update,
    UpdateProductImage,
    remove,
    removeProductImage
}
const express = require('express');
const url = require('url')
const mongoose = require('mongoose')
const router = express.Router();

let Good = require('../models/goods.js')

// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumail', { useNewUrlParser: true })
mongoose.connection.on('connected', () => {
	console.log('MongoDB connected success')
})
mongoose.connection.on('error', () => {
	console.log('MongoDB connected failed')
})
mongoose.connection.on('disconnected', () => {
	console.log('MongoDB disconnected')
})

// 查询商品列表
router.get('/', function(req, res, next) {
  let pathname = url.parse(req.url).pathname
  let page = parseInt(req.query.page)
  let pageSize = parseInt(req.query.pageSize)
  let sort = req.query.sort
  let skip = (page-1)*pageSize
  let params = {}
  let priceLevel = req.query.priceLevel
  let priceGt = 0
  let priceLte = 100
  if (priceLevel !== 'all') {
  	switch (priceLevel) {
  		case '0': 
  			priceGt = 0
  			priceLte = 100
  			break
  		case '1': 
  			priceGt = 100
  			priceLte = 500
  			break
  		case '2': 
  			priceGt = 500
  			priceLte = 1000
  			break
  		case '3': 
  			priceGt = 1000
  			priceLte = 2000
  			break
  	}
  	params = {
  		salePrice: {
  			$gt: priceGt,
  			$lte: priceLte
  		}
  	}
  }
  let goodModel = Good.find(params).skip(skip).limit(pageSize)
  // 排序
  goodModel.sort({'salePrice': sort})
  goodModel.exec((err, doc) => {
  	if (err) {
  		return res.json({
  			status: '1',
  			msg: err.message,
  		})
  	}
  	res.json({
  		status: '0',
  		msg: '',
  		result: {
  			count: doc.length,
  			list: doc
  		}
  	})
  })
});

// 加入到购物车
router.post("/addCart", (req, res, next) => {
  let userId = "100000077"
  let productId = req.body.productId
  let User = require('../models/users.js')
  User.findOne({userId: userId}, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
     // console.log(userDoc)
     if (userDoc) {
      let goodsItem = ''
      userDoc.cartList.forEach((item => {
        if (item.productId === productId) {
          goodsItem = item
          item.productNum++
        }
      }))

      if (goodsItem) {
       userDoc.save((err1) => {
            if (err1) {
              res.json({
                status: '1',
                msg: err1.message
              })
            } else {
              res.json({
                status: '0',
                msg: '',
                result: 'success'
              })
            }
          })
     } else {
      Good.findOne({productId: productId}, (err, doc) => {
        if (err) {
          res.json({
            status: '1',
            msg: err.message
          })
        } else {
          if (doc) {
            // console.log(doc)
            cloneDoc = {
              "productId": doc.productId,
              "productName": doc.productName,
              "salePrice": doc.salePrice,
              "productImage": doc.productImage,
              "checked": '1',
              "productNum": 1
            }
            // console.log(cloneDoc)
            userDoc.cartList.push(cloneDoc)
            userDoc.save((err2) => {
              if (err2) {
                res.json({
                  status: '1',
                  msg: err2.message
                })
              } else {
                res.json({
                  status: '0',
                  msg: '',
                  result: 'success'
                })
              }
            })
          }
        }
      })
     }

     }
    }
  })
})
module.exports = router;
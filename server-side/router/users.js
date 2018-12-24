const express = require('express');
const router = express.Router();

let User = require('../models/users.js')

/**
 * 注册登陆模块
 */
 // 登陆接口 
router.post('/doLogin', function(req, res, next) {
  let params = req.body
  console.log(req.body)
  // 根据用户名和密码在数据库查询有没有用户
  User.findOne(params, (err, doc) => {
  	if (err) {
  		res.json({
  			status: '1',
  			msg: err.message
  		})
  	} else {
  		if (doc) {
  			// 如果有该用户,就将该用户的用户Id存储到cookie里面
  			res.cookie("userId", doc.userId, {
  				path: '/',
  				maxAge: 1000*60*60
  			})
  			res.json({
  				status: '0',
  				msg: '',
  				result: {
  					userName: doc.userName
  				}
  			})
  		}
  	}
  })
});

router.post('/doLogout', (req, res, next) => {
	res.cookie('userId', '', {
		path: '/',
		maxAge: -1
	})
	res.json({
		status: '0',
		msg: '',
		result: ''
	})
})

/**
 * 购物车模块
 */
// 查询当前用户的购物车数据
router.get('/cartList', (req, res, next) => {
  let userId = req.cookies.userId
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
})
// 删除购物车中的某个商品
router.post('/cart/del', (req, res, next) => {
  let userId = req.cookies.userId
  let productId = req.body.productId

  User.update({userId: userId}, {$pull: {
    'cartList': {
      'productId': productId
    }
  }}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
          status: '0',
          msg: '',
          result: 'success delete'
        })
    }
  })
})

// 购物车编辑
router.post('/cart/edit', (req, res, next) => {
  let userId = req.cookies.userId
  let productId = req.body.productId
  let productNum = req.body.productNum
  let checked = req.body.checked

  User.updateOne({userId: userId, 'cartList.productId': productId}, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'success edit'
      })
    }
  })
})
// 实现全选
router.post('/cart/editCheckAll', (req, res,next) => {
  let userId = req.cookies.userId
  let checkAll = req.body.checkAll
  // 批量更新
  User.findOne({userId: userId}, (err, user) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (user) {
        user.cartList.forEach(item => {
          item.checked = checkAll ? '1' : '-1'
        })
        user.save((err1, doc) => {
          if (err1) {
            res.json({
              status: '1',
              msg: err1.message
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: ''
            })
          }
        })
      }
    }
  })
})
module.exports = router;
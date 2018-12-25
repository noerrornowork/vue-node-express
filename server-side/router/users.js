const express = require('express');
const router = express.Router();

let User = require('../models/users.js')

// 工具函数
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

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

// 登陆退出接口
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

/**
 * 地址模块
 */

// 获取地址列表接口
router.get('/address/list', (req, res, next) => {
  let userId = req.cookies.userId
  // console.log(userId)
  User.findOne({userId: userId}, (err, user) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      // console.log('address:' + user)
      if (user) {
        res.json({
          status: '0',
          msg: '',
          result: user.addressList
        })
      }
    }
  })
})

// 设置默认地址接口
router.post('/setDefault', (req, res, next)=> {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  // 查找出当前用户下的地址列表
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        let addressList = doc.addressList
        console.log(addressList)
        // 遍历当前用户地址列表
        addressList.forEach(item => {
          // 根据从客户端传过来的addressId进行匹配
          if (addressId === item.addressId) {
            // 将该addressId对应的isDefault置为true
            item.isDefault = true
          } else {
            // 同时其他的isDefault置为false
            item.isDefault = false
          }
        })
         // 将当前用户的状态改变保存
        doc.save((err1, doc1) => {
          if (err1) {
            res.json({
              status: '1',
              msg: err1.message
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: '默认地址设置成功'
            })
          }
        })
      }
    }
  })
})

// 删除地址接口
router.post('/address/del', (req, res, next) => {
  let userId = req.cookies.userId
  let addressId = req.body.addressId

  User.updateOne({userId: userId}, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
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
        result: '删除地址成功'
      })
     }
  })
})

/**
 * 订单模块
 */

// 创建订单接口
router.post('/order/create', (req, res, next) => {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  let orderTotal = req.body.orderTotal

  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      // console.log(doc)
      let addressInfo = ''
      let goodList = []
      // 获取当前用户的地址信息
      doc.addressList.forEach(item => {
        if (item.addressId === addressId) {
          addressInfo = item
        }
      })
      // 获取当前用户购物车的已购买商品
      doc.cartList.forEach(item => {
        if (item.checked === '1') {
          goodList.push(item)
        }
      })

      // 生成orderId
      let platform = '622'
      let r1 = Math.floor(Math.random()*10)
      let r2 = Math.floor(Math.random()*10)
    
      let sysDate = new Date().format('yyyyMMddhhmmss')
      let createDate = new Date().format('yyyy-MM-dd hh:mm:ss')
      let orderId = platform + r1 + sysDate + r2

      let order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: addressInfo,
        goodList: goodList,
        orderStatus: '1',
        createDate: createDate
      }

      doc.orderList.push(order)

      doc.save((err1, doc1) => {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
          })
        }
      })

      res.json({
        status: '0',
        msg: '',
        result: {
          orderId: order.orderId,
          orderTotal: order.orderTotal
        }
      })
    }
  })
})

// 订单详情
router.get('/order/detail', (req, res, next) => {
  let userId = req.cookies.userId
  let orderId = req.query.orderId

  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      let orderList = doc.orderList
      let orderTotal = 0
      if (orderList.length > 0) {
        orderList.forEach(item => {
          if (item.orderId === orderId) {
            orderTotal = item.orderTotal
          }
        })

        res.json({
          status: '0',
          msg: '',
          result: {
            orderId: orderId,
            orderTotal: orderTotal
          }
        })
      } else {
        res.json({
          status: '120001',
          msg: '无此订单',
          result: ''
        })
      }
    }
  })
})
module.exports = router;
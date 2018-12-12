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

/* GET users listing. */
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

module.exports = router;
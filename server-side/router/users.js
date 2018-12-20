const express = require('express');
const router = express.Router();

let User = require('../models/users.js')

/* GET users listing. */
router.post('/doLogin', function(req, res, next) {
  let params = req.body
  console.log(req.body)
  User.findOne(params, (err, doc) => {
  	if (err) {
  		res.json({
  			status: '1',
  			msg: err.message
  		})
  	} else {
  		if (doc) {
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

module.exports = router;
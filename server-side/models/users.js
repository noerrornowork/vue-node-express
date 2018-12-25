const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
	"userId": String,
	"userName": String,
	"userPwd": String,
	"orderList": Array,
	"cartList": [
		{
			"productId": String,
			"productName": String,
			"salePrice": String,
			"productImage": String,
			"checked": String,
			"productNum": Number
		}
	],
	"addressList": [
		{
			"addressId": String,
			"userName": String,
			"streetName": String,
			"postCode": String,
			"tel": String,
			"isDefault": Boolean
		}
	]
}, {versionKey: false})

module.exports = mongoose.model('User', userSchema)
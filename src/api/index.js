import $axios from "axios";

$axios.defaults.baseURL = "http://localhost:3030";
// $axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
$axios.defaults.headers.post['Content-Type'] = 'application/json';

// 全局响应拦截
$axios.interceptors.response.use((res) => {
	console.log('******')

  console.log(res.status)
	if (res.status === '0') {
		console.log('登陆状态')
	}
	if (res.status === '1') {
		console.log('服务器异常')
		return
	}
	return res.data
})

/**
 * 商品模块
 */
export let getGoodsList = (page, pageSize, sort, priceLevel) => {
	return $axios.get(`/goods?page=${page}&pageSize=${pageSize}&sort=${sort}&priceLevel=${priceLevel}`)
}

export let getCartDataByUserId = (id) => {
	return $axios.post('/goods/addCart', {productId: id})
}

/**
 * 注册登陆模块
 */
export let doLogin = (userName, userPwd) => {
	return $axios.post('/users/doLogin', {
		userName: userName,
		userPwd: userPwd
	})
}

export let doLogout = () => {
	return $axios.post('/users/doLogout')
}

/**
 * 购物车模块
 */
export let getCartList = () => {
  return $axios.get('/users/cartList')
}

export let deleteCartByProductId = (productId) => {
  return $axios.post('/users/cart/del', {productId: productId})
}
// 修改商品数量
export let editCartCount = (productId, productNum, checked) => {
  return $axios.post('/users/cart/edit', {
    productId: productId,
    productNum: productNum,
    checked: checked
  })
}
// 全选实现
export let editChexkAll = (chekAll) => {
  return $axios.post('/users/cart/editCheckAll', {
    checkAll: checkAll
  })
}
/**
 * 地址模块
 */

// 获取地址列表
export let getAddressList = () => {
  return $axios.get('/users/address/list')
}

// 设置默认地址
export let setDefaulyByAddessId = (addressId) => {
  return $axios.post('/users/setDefault', {
    addressId: addressId
  })
}

// 删除地址接口
export let delAddessByAressId = (addressId) => {
  return $axios.post('/users/address/del', {
    addressId: addressId
  })
}

/**
 * 订单模块
 */

// 创建订单
export let createOrder = (addressId, orderTotal) => {
  return $axios.post('/users/order/create', {
    addressId: addressId,
    orderTotal: orderTotal
  })
}

// 订单详情
export let getOrderDetail = (orderId) => {
  return $axios.get('/users/order/detail', {
    params: {
      orderId: orderId
    }
  })
}
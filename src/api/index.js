import $axios from "axios";

$axios.defaults.baseURL = "http://localhost:3030";

// 全局响应拦截
$axios.interceptors.response.use((res) => {
	console.log('******')
	if (res.status === '0') {
		console.log('登陆状态')
	}
	if (res.status === '1') {
		console.log('服务器异常')
		return
	}
	return res.data
})

export let getGoodsList = (page, pageSize, sort, priceLevel) => {
	return $axios.get(`/goods?page=${page}&pageSize=${pageSize}&sort=${sort}&priceLevel=${priceLevel}`)
}

export let getCartDataByUserId = (id) => {
	return $axios.post('/goods/addCart', {productId: id})
}

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
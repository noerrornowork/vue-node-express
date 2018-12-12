import $axios from "axios";

$axios.defaults.baseURL = "http://localhost:3030";

// 全局响应拦截
$axios.interceptors.response.use((res) => {
	return res.data
})

export let getGoodsList = (page, pageSize, sort, priceLevel) => {
	return $axios.get(`/goods?page=${page}&pageSize=${pageSize}&sort=${sort}&priceLevel=${priceLevel}`)
}
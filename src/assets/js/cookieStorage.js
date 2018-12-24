function cookieStorage (maxAge, path) {
	let cookie = (function () {
		let cookie = {}
		// 获取所有存储在客户端的cookie
		let all = document.cookie
		// 如果客户端没有存储cookie,就返回一个空对象
		if (all === '') return cookie
		let list = all.split('; ')
		for(let i=0, len=list.length; i<len; i++) {
			let cookie = list[i]
			let p = cookie.indexOf('=')
			let name = cookie.substring(0, p)
			let value = cookie.substring(p+1)
			value = decodeURIComponent(value)
			cookie[name] = value
		}
		return cookie
	})()

	let keys = []
	keys = Object.keys(cookie)

	this.length = keys.length
	this.key = function (n) {
		if (n < 0 || n > keys.length) {
			return null
		}
		return keys[n]
	}
	this.getItem = function (name) {
		return cookie[name] || null
	}
	this.setItem = function (key, value) {
		if (!(key in cookie)) {
			keys.push(key)
			this.length++
		}
		cookie[key] = value

		let cookie = key + '=' + encodeURIComponent(value)
		if (maxAge) cookie += '; max-age=' + maxAge
		if (path) cookie += '; path=' + path

		document.cookie = cookie
	}
	this.removeItem = function (key) {
		if (!(key in cookie)) return
		delete cookie[key]
		for (let i = 0; i < keys.length; i++) {
			if (keys[i] = key) {
				keys.splice(i, 1)
				break
			}
		}
		this.length--
		document.cookie = key + '=; max-age=0'
	}
	this.clear = function () {
		for (let i = 0; i < keys.length; i++) {
			document.cookie = key[i] + '=; max-age=0'
		}
		cookie = {}
		keys = []
		this.length = 0
	}
}
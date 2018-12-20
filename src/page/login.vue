<template>
	<div class="login-wrap">
		<div>
			<h4>Login in </h4>
			<div class="errorTips" v-show="errorTips">
				用户名或密码输入错误
			</div>
			<div class="username">
					<i class="icon-username"></i>
					<input type="text" placeholder="User Name" v-model="userName">
			</div>
			<div class="pwd">
					<i class="icon-pwd"></i>
					<input type="password" placeholder="Password" v-model="userPwd">
			</div>
			<div class="login-btn">                           
				<button @click="login" @keyup.enter="login">登陆</button>
			</div>
		</div>
	</div>
</template>                                                                                                             
<script>
	import { doLogin } from '@/api'
	export default {
		data () {
			return {
				userName: '',
				userPwd: '',
				errorTips: false
			}
		},
		methods: {
			async login () {
				// console.log('*****************')
				if (!this.userName || !this.userPwd) {
					this.errorTips = true
					return
				}
				let userName = this.userName
				let userPwd = this.userPwd

				let res = await doLogin(userName, userPwd)
				console.log(res)

				if (res.status === '0') {
					this.errorTips = false
					this.$router.push({
						name: 'goodsList'
					})
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	.login-wrap	{
		display: block;
		width: 400px;
		height: 200px;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate3d(-50%, -50%, 0);
		background-color: #f8f8f8;
		padding: 5px 20px;
		border: 1px solid #cfcfcf;

		> h4 {
			margin: 0;
			width: 100%;
			height: 40px;
			line-height: 40px;
			/*text-align: center;*/
			/*color: #ffffff;*/
		}
		.errorTips {
			height: 20px;
			line-height: 20px;
			/*text-align: center;*/
			font-size: 12px;
		}
		.username {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 40px;
			border-bottom: 1px solid #000;
			i {
				width: 40px;
				height: 40px;
			}
			input {
				flex: 1;
				height: 38px;
				border: none;
				outline: none;
				background-color: #f8f8f8;
			}
		}
		.pwd {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 40px;
			border-bottom: 1px solid #000;
			i {
				width: 40px;
				height: 40px;
			}
			input {
				flex: 1;
				height: 38px;
				border: none;
				outline: none;
				background-color: #f8f8f8;
			}
		}
		.login-btn {
			margin-top: 30px;
			display: flex;
			justify-content: center;
			button {
				width: 100%;
				height: 30px;
				line-height: 30px;
				background-color: #259bec;
				color: #ffffff;
				border-radius: 6px;
				border: none;
				outline: none;
				letter-spacing: 5px;
			}
		}
	}
	.icon-username {
		display: inline-block;
    background: url("../assets/images/username.png") no-repeat center left;
    background-size: 50% 50%;
	}
	.icon-pwd {
		display: inline-block;
    background: url("../assets/images/pwd.png") no-repeat center left;
    background-size: 50% 50%;
	}
</style>
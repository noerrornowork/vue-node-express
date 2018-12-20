<template>
	<div class="login-wrap">
		<div>
			<i class="icon-username"></i>
			<input type="text" placeholder="User Name">
		</div>
		<div>
			<i class="icon-pwd"></i>
			<input type="password" placeholder="Password">
		</div>
		<div class="login-btn">
			<button>登陆</button>
		</div>
	</div>
</template>
<script>
	export default {
		data () {
			return {

			}
		}
	}
</script>
<style lang="less" scoped>
	.login-wrap	{
		width: 100%;
		margin: 0 auto;
	}
	.icon-username {
		width: 27px;
    height: 32px;
    background: url("../../static/username.png") no-repeat center center;
    background-size: cover;
	}
	.icon-pwd {
		width: 27px;
    height: 36px;
    background: url("../../static/pwd.png") no-repeat center center;
    background-size: cover;
	}
</style>
<script>
	export default {
		globalData: {
			token: '',//全局变量
			//后台有绑定信息用户
			binddata:{
			address: '',
			deletemark: '',
			deptId: '',
			deptName: '',
			email: '',
			expert: '',
			gender: '',
			id: '',
			idcard: '',
			jobClass: '',
			jobClassName: '',
			mobilePhone: '',
			qq: '',
			staffClass: '',
			staffClassName: '',
			staffCode: '',
			staffName: '',
			status: '',
			techLevel: '',
			techLevelName: '',
			telphone: '',
			userId: '',
			userStatus: '',
			weixin: '',
			weixinId: '',
			workPlace: '',
			roleIdList:{}	
			},
			//需要自己输入信息用户
			customdata:{
			address: '',
			company: '',
			customerId: '',
			customerName: '',
			email: '',
			gender: '',
			id: '',
			idcard: '',
			mobilePhone: '',
			qq: '',
			telphone: '',
			weixinId: '',
			}
		},
		onLaunch: function() {
			// console.log('App Launch')
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/uni.css';
</style>

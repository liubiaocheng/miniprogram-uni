<template>
	<view class="container">
		<view class="content-view">
			<view class="image-cell">
				<view style="flex:1; margin-left:30upx ; ">
					<text style="font-size: 34upx; color: #000000; margin-top: 20upx;">头像</text>
				</view>
				<view class="header-image">
					<open-data type="userAvatarUrl"></open-data>
				</view>
				<!-- <image class="rightbtn-image" style="margin-right: 20upx;" src="../../static/right.png"></image> -->
			</view>
			<view v-for="(item, index) in list" :key="item.id">
				<view class="line"></view>
				<picker mode="selector" v-if="item.id ==2" @change="sexChange" :range="sexList" :value="sexIndex">
					<view class="message-cell" @click="goChange(index)">
					<!-- <view class="message-cell"> -->
					<view style="flex:1; margin-left:30upx ; ">
						<text style="font-size: 34upx; color: #000000; margin-top: 20upx;">{{item.name}}</text>
					</view>
					<view style="margin-right:20upx;">
						<text style="font-size: 28upx; color: #666666; margin-top: 20upx;">{{sexIndex == -1 ? item.val: sexList[sexIndex]}}</text>
					</view>
					<image class="rightbtn-image" style="margin-right: 30upx;" src="../../static/right.png"></image>
					</view>
				</picker>
				
				<view class="message-cell" v-if="item.id !=2" @click="goChange(index)">
					<!-- <view class="message-cell" v-if="item.id !=2"> -->
					<view style="flex:1; margin-left:30upx ; ">
						<text style="font-size: 34upx; color: #000000; margin-top: 20upx;">{{item.name}}</text>
					</view>
					<view style="margin-right:20upx;">
						<text style="font-size: 28upx; color: #666666; margin-top: 20upx;">{{item.val}}</text>
					</view>
					<image class="rightbtn-image" v-if="item.id !=4" style="margin-right: 30upx;" src="../../static/right.png"></image>

				</view>
			</view>


		</view>
		<view class="submit-btn">
			<button style="background-color: #5296FD;" @click="submitdata">提交</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						id: 1,
						name: '姓名',
						val: '示例：云某某',
						pages: []
					}, {
						id: 2,
						name: '性别',
						val: '男',
						pages: []
					}, {
						id: 3,
						name: '电话',
						val: '示例：0755-8888888',
						pages: []
					}, {
						id: 4,
						name: '手机',
						val: '示例：138****8888',
						pages: []
					}, {
						id: 5,
						name: '邮箱',
						val: '示例：exanmple@xx.com',
						pages: []
					},
					{
						id: 6,
						name: 'QQ',
						val: '示例：1234567890',
						pages: []

					},
					{
						id: 7,
						name: '身份证号',
						val: '示例：441408199001011234',
						pages: []

					},
					{
						id: 8,
						name: '地区',
						val: '示例：广东，深圳',
						pages: []
					},
					{
						id: 9,
						name: '公司名称',
						val: '示例：示例科技有限公司',
						pages: []
					},
				],
				backVal:'',
				idex:0,
				sexIndex:-1,
				sexList:['男','女'],
				navigateFlag: false,
				logintype:'',
				userType:''
			}
		},
		onLoad(e) {
			var _this = this
			
			_this.list[0].val = ''
			_this.list[1].val = ''
			_this.list[2].val = ''
			_this.list[4].val = ''
			_this.list[5].val = ''
			_this.list[6].val = ''
			_this.list[7].val = ''
			_this.list[8].val = ''
			
			uni.getStorage({
				key:'userType',
				success: function(res) {
					_this.userType = res.data
					if(res.data =='customer'){
						_this.list[0].val = getApp().globalData.customdata.customerName
						_this.list[1].val = getApp().globalData.customdata.gender
						_this.list[2].val = getApp().globalData.customdata.telphone
						_this.list[3].val = getApp().globalData.customdata.mobilePhone
						_this.list[4].val = getApp().globalData.customdata.email
						_this.list[5].val = getApp().globalData.customdata.qq
						_this.list[6].val = getApp().globalData.customdata.idcard
						_this.list[7].val = getApp().globalData.customdata.address
						_this.list[8].val = getApp().globalData.customdata.company
					}else{
						_this.list[0].val = getApp().globalData.binddata.staffName
						_this.list[1].val = getApp().globalData.binddata.gender
						_this.list[2].val = getApp().globalData.binddata.telphone
						_this.list[3].val = getApp().globalData.binddata.mobilePhone
						_this.list[4].val = getApp().globalData.binddata.email
						_this.list[5].val = getApp().globalData.binddata.qq
						_this.list[6].val = getApp().globalData.binddata.idcard
						_this.list[7].val = getApp().globalData.binddata.address
						_this.list[8].val = getApp().globalData.binddata.workPlace
					}
				}
			})
           _this.logintype = e.logintype
		},
		onShow: function() {
			let me = this;
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			if(currPage.idex >0){
				me.list[currPage.idex - 1].val = currPage.backVal
			}
		},
		methods: {
			goChange(e) {
				if(this.list[e].id != 2 && this.list[e].id != 4){
					uni.navigateTo({
						url: "/pages/me/changeMes?name=" + this.list[e].name + "&id=" + this.list[e].id,
					})
				}
				
			},
			sexChange(e){
				this.sexIndex = e.detail.value;
			},
			submitdata(){
				if(this.logintype == 'nosub'){
					let serverUrl = this.serverUrl;
					uni.request({
						url: serverUrl + "/api/wxopcase/insertCustomer", //服务器端地址
						data: {
							customerName: this.list[0].val,
							gender: this.list[1].val,
							telphone: this.list[2].val,
							mobilePhone:getApp().globalData.customdata.mobilePhone,
							email: this.list[4].val,
							qq: this.list[5].val,
							idcard: this.list[6].val,
							address: this.list[7].val,
							company: this.list[8].val,
							token: getApp().globalData.token
						},
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						success: (res) => {
							console.log('data1', res.data);
							console.log('mobilePhone',getApp().globalData.customdata.mobilePhone)
							// let obj = JSON.parse(res.data.data.toString());
							if(res.data.code == 0){
								uni.showToast({
									title: '提交成功，请返回上一页面点击头像再次绑定手机号',
									icon: "none"
								});
							}else{
								uni.showToast({
									title: '提交失败',
									icon: "none"
								});
							}
						}
					});
				}else{
					let serverUrl = this.serverUrl;
					if(this.userType == 'customer'){
						uni.request({
							url: serverUrl + "/api/wxopcase/updateCustomer", //服务器端地址
							data: {
								id: getApp().globalData.customdata.id,
								customerName: this.list[0].val,
								gender: this.list[1].val,
								telphone: this.list[2].val,
								email: this.list[4].val,
								qq: this.list[5].val,
								idcard: this.list[6].val,
								address: this.list[7].val,
								company: this.list[8].val,
								token: getApp().globalData.token
							},
							method: 'POST',
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							success: (res) => {
								console.log('data1', res.data);
								if(res.data.code == 0){
									uni.showToast({
										title: '提交成功',
										icon: "none"
									});
								}else{
									uni.showToast({
										title: '提交失败',
										icon: "none"
									});
								}
							}
						});
					}else{
						uni.request({
							url: serverUrl + "/api/wxopcase/updateStaff", //服务器端地址
							data: {
								id: getApp().globalData.binddata.id,
								staffName: this.list[0].val,
								gender: this.list[1].val,
								telphone: this.list[2].val,
								email: this.list[4].val,
								qq: this.list[5].val,
								weixin: getApp().globalData.binddata.weixin,
								idcard: this.list[6].val,
								address: this.list[7].val,
								workPlace: this.list[8].val,
								status: getApp().globalData.binddata.status,
								token: getApp().globalData.token
							},
							method: 'POST',
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							success: (res) => {
								console.log('data1', res.data);
								if(res.data.code == 0){
									uni.showToast({
										title: '提交成功',
										icon: "none"
									});
								}else{
									uni.showToast({
										title: '提交失败',
										icon: "none"
									});
								}
							}
						});
					}
					
				}
				
			},
		}
	}
</script>

<style>
	.container {
		background-color: #F2F4F5;
	}

	.content-view {
		background-color: #FFFFFF;
	}

	.image-cell {
		justify-content: space-between;
		align-items: center;
		display: flex;
		background-color: #FFFFFF;
		width: 750upx;
		height: 134upx;
	}

	.header-image {
		margin-right: 20upx;
		width: 88upx;
		height: 88upx;
		border-radius: 50%;
		background-color: #C2C6C8;
		overflow: hidden;
	}

	.rightbtn-image {
		width: 15px;
		height: 15px;
		/* background-color: #C1FFC1; */

	}

	.line {
		margin-top: 0upx;
		margin-left: 30upx;
		margin-right: 30upx;
		height: 2upx;
		background-color: #F2F4F5;
	}

	.message-cell {
		justify-content: space-between;
		align-items: center;
		display: flex;
		background-color: #FFFFFF;
		width: 750upx;
		height: 114upx;
	}

	.submit-btn {
		margin-left: 100upx;
		margin-right: 100upx;
		margin-top: 38upx;
		padding-bottom: 160upx;
		height: 100upx;
	}
	
	.sexPicker {
		/* width: 100%;
		margin-top: 20upx;
		margin-bottom: 20upx;
		display: flex;
		justify-content: space-between; */
		justify-content: space-between;
		align-items: center;
		display: flex;
		background-color: #FFFFFF;
		width: 750upx;
		height: 114upx;
	}
	
	.input-style {
		height: 50upx;
		padding: 15upx 25upx;
		line-height: 50upx;
		font-size: 17px;
		flex: 1;
		border: 1upx solid #AAAAAA;
		box-shadow: 0 0 1upx #AAAAAA;
	}
</style>

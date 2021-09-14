<template>
	<view class="">
		<view class="container">
			<block v-if="showBind === false">
				<button class="bind-button" type="default" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
					<image class="header-image" :src="userInfo.avatarUrl"></image>
					<view style="margin-left: 30upx;flex: 1;">
						<view style="font-size: 34upx; color: #000000;">{{nickName}}</view>
						<text style="font-size: 28upx; color: #666666; margin-top: 20upx;">{{tishi}}</text>
					</view>
					<view style="margin-right: 30upx;">
						<image class="rightbtn-image" src="../../static/right.png"></image>
					</view>
				</button>
			</block>
			<block v-if="showBind === true">
				<view class="header-logo" open-type="getUserInfo" @click="goMessage">
					<view class="header-image">
						<open-data type="userAvatarUrl"></open-data>
					</view>
					<view style="margin-left: 30upx;flex: 1;">
						<view style="font-size: 34upx; color: #000000;">{{nickName}}</view>
						<text style="font-size: 28upx; color: #666666; margin-top: 20upx;">{{tishi}}</text>
					</view>
					<view style="margin-right: 30upx;">
						<image class="rightbtn-image" src="../../static/right.png"></image>
					</view>
				</view>
			</block>
			<view class="cell" @click="celltouch">
				<view style="flex:1; margin-left:30upx ; ">
					<text style="font-size: 34upx; color: #000000; margin-top: 20upx;">帮助中心</text>
				</view>
				<image class="rightbtn-image" style="margin-right: 30upx;" src="../../static/right.png"></image>
			</view>
			<button class="share-button" open-type="share" @click="sharetouch">
				<view style="flex:1; margin-left:0upx ; ">
					<text style="font-size: 34upx; color: #000000; margin-top: 20upx;">分享小程序</text>
				</view>
				<image class="rightbtn-image" style="margin-right: 0upx;" src="../../static/right.png"></image>
			</button>
			<!-- <view class="cell" @click="sharetouch">
				<view style="flex:1; margin-left:30upx ; ">
					<text style="font-size: 34upx; color: #000000; margin-top: 20upx;">分享小程序</text>
				</view>
				<image class="rightbtn-image" style="margin-right: 30upx;" src="../../static/right.png"></image>
			</view> -->
			<view class="cell" @click="celltouch">
				<view style="flex:1; margin-left:30upx ; ">
					<text style="font-size: 34upx; color: #000000; margin-top: 20upx;">通用设置</text>
				</view>
				<image class="rightbtn-image" style="margin-right: 30upx;" src="../../static/right.png"></image>
			</view>
			<view class="cell" @click="celltouch">
				<view style="flex:1; margin-left:30upx ; ">
					<text style="font-size: 34upx; color: #000000; margin-top: 20upx;">反馈建议</text>
				</view>
				<image class="rightbtn-image" style="margin-right: 30upx;" src="../../static/right.png"></image>
			</view>
		</view>
		<uni-popup ref="showtip" :mask-click="false">
			<view class="uni-tip">
				<text class="uni-tip-title">提示</text>
				<text class="uni-tip-content">授权小程序登录</text>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="login">确定</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import uniPopup from '../../components/uni-popup/uni-popupp.vue'
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				SessionKey: '',
				OpenId: '',
				phoneNumber: '',
				nickName: '用户名',
				tishi: '点击绑定手机号',
				showBind: false,
                showtip:''  //提示点击绑定手机号
			}
		},
		onShow() {
			var me = this;
			let serverUrl = me.serverUrl;
			uni.getStorage({
				key: 'openid',
				success: function(res) {
					me.OpenId = res.data;
					if (typeof me.OpenId == "undefined" || me.OpenId == null || me.OpenId == "") {
						me.$refs['show' + 'tip'].open()
					} else {
						uni.request({
							// url: "http://192.168.1.112:8062/atomops-service" + "/api/wxopcase/getByPhoneNumAndWeixinId",
							url: serverUrl + "/api/wxopcase/getByPhoneNumAndWeixinId",
							data: {
								weixinId: me.OpenId,
								token: getApp().globalData.token
							},
							method: 'GET',
							success: (res2) => {
								uni.setStorage({
									key: 'userType',
									data: res2.data.data.type,
									success: function() {
										console.log('setuserTypesuccess');
									}
								});

								//openId、或SessionKdy存储//隐藏loading
								if (res2.data.data.code == 0) {
									me.tishi = '已绑定手机号'
									me.showBind = true
									if (res2.data.data.type == 'customer') {
										me.nickName = res2.data.data.data.customerName
										getApp().globalData.customdata = res2.data.data.data;
										uni.setStorage({
											key: 'userid',
											data: res2.data.data.data.id,
											success: function() {
												console.log('setuseridsuccess');
											}
										});
									} else {
										me.nickName = res2.data.data.data.staffName
										getApp().globalData.binddata = res2.data.data.data;
										uni.setStorage({
											key: 'staffCode',
											data: res2.data.data.data.staffCode,
											success: function() {
												console.log('setstaffCodesuccess');
											}
										});
									}
								} else if (res2.data.data.code == 1) {
									getApp().globalData.binddata.mobilePhone = _this.phoneNumber
									uni.navigateTo({
										url: '/pages/me/PersonalMessage?logintype=' + 'nosub'
									})
								} else {
									uni.showToast({
										title: res2.data.data.msg,
										icon: "none"
									});
								}

							}
						});
					}
				},
				fail: function(error) {
					console.log('error', error)
					me.$refs['show' + 'tip'].open()
				}
			})
		},
		onLoad() {
            
		},
		methods: {
			//分享按钮点击
			sharetouch() {
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 1,
					summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
					success: function(res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function(err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
			},
			//点击
			celltouch() {
				uni.showToast({
					title: '该功能暂未开放',
					icon: "none"
				});
			},
			//
			cancel(type) {
				this.$refs['show' + type].close()
			},
			//个人中心
			goMessage: function() {
				uni.navigateTo({
					url: '/pages/me/PersonalMessage?logintype=' + 'havesub'
				})
			},
			//登录
			login() {
				this.$refs['show' + 'tip'].close()
				uni.showLoading({
					title: '登录中...'
				});
				var that = this;
				let serverUrl = that.serverUrl;
				var code;
				// 1.wx获取登录用户code
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						code = loginRes.code;
						uni.hideLoading();
						uni.request({
							url: serverUrl + "/api/wxopcase/login",
							data: {
								code: code,
							},
							method: 'GET',
							success: (res) => {
								//openId、或SessionKdy存储//隐藏loading
								uni.setStorage({
									key: 'openid',
									data: res.data.data.openid,
									success: function() {
										console.log('setopenidsuccess1');
									}
								});
								that.OpenId = res.data.data.openid;
								uni.setStorage({
									key: 'SessionKey',
									data: res.data.data.session_key,
									success: function() {
										console.log('setsession_keysuccess');
									}
								});
								uni.hideLoading();
							}
						});
					},
				});

			},

			// 获取绑定手机号
			getPhoneNumber(e) {
				let _this = this;
				uni.getStorage({
					key: 'SessionKey',
					success: function(res) {
						_this.SessionKey = res.data
						let serverUrl = _this.serverUrl;
						uni.request({
							url: serverUrl + "/api/wxopcase/getPhoneNumber", //服务器端地址
							data: {
								session_key: _this.SessionKey,
								encryptedData: e.detail.encryptedData,
								iv: e.detail.iv
							},
							method: 'POST',
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							success: (res) => {
								let obj = JSON.parse(res.data.data.toString());
								_this.phoneNumber = obj.phoneNumber;
								uni.request({
									url: serverUrl + "/api/wxopcase/getByPhoneNumAndWeixinId",
									data: {
										phoneNum: _this.phoneNumber,
										weixinId: _this.OpenId,
										token: getApp().globalData.token,
									},
									method: 'GET',
									success: (res2) => {
										console.log('enddata', res2)

										//openId、或SessionKdy存储//隐藏loading
										if (res2.data.data.code == 1) {
											console.log('daozhelile')
											getApp().globalData.customdata.mobilePhone = _this.phoneNumber
											uni.navigateTo({
												url: '/pages/me/PersonalMessage?logintype=' + 'nosub'
											})
										} else if (res2.data.data.code == 0) {
											_this.tishi = '已绑定手机号'
											_this.showBind = true
											getApp().globalData.binddata = res2.data.data.data;
											uni.setStorage({
												key: 'userType',
												data: res2.data.data.type,
												success: function() {
													console.log('setuserTypesuccess');
												}
											});
											if (res2.data.data.type == 'customer') {
												_this.nickName = res2.data.data.data.customerName
												getApp().globalData.customdata = res2.data.data.data;
												uni.setStorage({
													key: 'userid',
													data: res2.data.data.data.id,
													success: function() {
														console.log('setuseridsuccess');
													}
												});
											} else {
												_this.nickName = res2.data.data.data.staffName
												getApp().globalData.binddata = res2.data.data.data;
												uni.setStorage({
													key: 'staffCode',
													data: res2.data.data.data.staffCode,
													success: function() {
														console.log('setstaffCodesuccess');
													}
												});
											}
											
											
										} else {

											uni.showToast({
												title: res2.data.data.msg,
												icon: "none"
											});
										}
									}
								});
							}
						});
					},
					fail: function(error) {
						console.log('error', error)
					}
				})
				
			}
			// }
			// 获取用户信息 API 在小程序可直接使用，在 5+App 里面需要先登录才能调用
			// getUserInfo() {
			// 	uni.getUserInfo({
			// 		provider: this.loginProvider,
			// 		success: (result) => {
			// 			console.log('getUserInfo success', result);
			// 			this.hasUserInfo = true;
			// 			this.userInfo = result.userInfo;
			// 		},
			// 		fail: (error) => {
			// 			console.log('getUserInfo fail', error);
			// 			let content = error.errMsg;
			// 			if (~content.indexOf('uni.login')) {
			// 				content = '请在登录页面完成登录操作';
			// 			}
			// 			// #ifndef APP-PLUS
			// 			uni.getSetting({
			// 				success: (res) => {
			// 					let authStatus = res.authSetting['scope.userInfo'];
			// 					if (!authStatus) {
			// 						uni.showModal({
			// 							title: '授权失败',
			// 							content: 'ODS云管家需要获取您的用户信息，请在设置界面打开相关权限',
			// 							success: (res) => {
			// 								if (res.confirm) {
			// 									uni.openSetting()
			// 								}
			// 							}
			// 						})
			// 					} else {
			// 						uni.showModal({
			// 							title: '获取用户信息失败',
			// 							content: '错误原因' + content,
			// 							showCancel: false
			// 						});
			// 					}
			// 				}
			// 			})
			// 			// #endif
			// 			// #ifdef APP-PLUS
			// 			uni.showModal({
			// 				title: '获取用户信息失败',
			// 				content: '错误原因' + content,
			// 				showCancel: false
			// 			});
			// 			// #endif
			// 		}
			// 	});
			// },
		}
	}
</script>


<style>
	.container {
		background-color: #FFFFFF;
	}

	.bind-button {
		justify-content: baseline;
		text-align: left;
		align-items: center;
		display: flex;
		background-color: #FFFFFF;
		margin-top: 10upx;
		margin-left: 30upx;
		margin-right: 0px;
		width: 690upx;
		height: 214upx;
	}

	.header-logo {
		/* 同.bind-button 绑定后显示 */
		padding-bottom: 2upx;
		justify-content: space-between;
		align-items: center;
		display: flex;
		margin-top: 10upx;
		margin-left: 30upx;
		width: 690upx;
		height: 214upx;
		background-color: #F4F5F9;
		border-radius: 5%;
	}

	.header-image {
		/* 微信图像 */
		margin-left: 30upx;
		width: 116upx;
		height: 116upx;
		border-radius: 50%;
		background-color: #C2C6C8;
		overflow: hidden;
	}

	.rightbtn-image {
		width: 15px;
		height: 15px;
		/* background-color: #C1FFC1; */

	}

	.cell {
		justify-content: space-between;
		align-items: center;
		display: flex;
		background-color: #FFFFFF;
		margin-bottom: 1px;
		width: 750upx;
		height: 100upx;
	}

	.share-button {
		justify-content: space-between;
		text-align: left;
		align-items: center;
		display: flex;
		background-color: #FFFFFF;
		margin-bottom: 1px;
		width: 750upx;
		height: 100upx;
		border: none;
		border-width: 0;

	}

	.share-button:after {
		border: none;
	}

	/* 弹出框 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		padding: 15px;
		width: 300px;
		background-color: #fff;
		border-radius: 10px;
	}

	.uni-tip-title {
		margin-bottom: 10px;
		text-align: center;
		font-weight: bold;
		font-size: 16px;
		color: #333;
	}

	.uni-tip-content {
		text-align: center;
		font-size: 14px;
		color: #666;
	}

	.uni-tip-group-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		margin-top: 20px;
	}

	.uni-tip-button {
		flex: 1;
		text-align: center;
		font-size: 14px;
		color: #3b4144;
	}
</style>

<!-- 首页 -->
<template>
	<view class="container">
		<image src="../../static/home_top.png" class="img-top" />
		<view class="container-title">
			<view class="tv-title">待办工单</view>
			<text style="font-size: 12px; color: #919397;" @click="goOrder(-1)">查看全部 >></text>
		</view>
		<view class="box-container">
			<view class="box-todo" style="background-color: #F7A76F;" @click="goOrder(0)">
				<text class="box-tv">待处理</text>
				<text class="box-tv2">
					<!-- {{box_tv_todo}} --></text>
			</view>
			<view class="box-todo" style="background-color: #08D5AA;" @click="goOrder(1)">
				<text class="box-tv">办理中</text>
				<text class="box-tv2">
					<!-- {{box_tv_doing}} --></text>
			</view>
			<view class="box-todo" style="background-color: #6BBAF6;" @click="goOrder(4)">
				<text class="box-tv">已完成</text>
				<text class="box-tv2">
					<!-- {{box_tv_done}} --></text>
			</view>
		</view>
		<view class="tv-title">服务中心</view>
		<view class="service-container">
			<view class="box-service" style="background-color: #EAF7EE;" @click="goUpload">
				<text class="tv-service">故障上报</text>
				<text class="tv-service1">为您排忧解难</text>
			</view>
			<!-- <view class="box-service" style="background-color: #E7EFFC;">
				<text class="tv-service">售前咨询</text>
				<text class="tv-service1">技术故问在线解疑</text>
			</view>
			<view class="box-service" style="background-color: #F6F7FB;">
				<text class="tv-service">售后服务</text>
				<text class="tv-service1">等待您更好的建议</text>
			</view> -->
			<view class="box-service" style="background-color: #EAECF9;" @tap="goHelp">
				<text class="tv-service">反馈建议</text>
				<text class="tv-service1">有何疑问立即咨询</text>
			</view>
		</view>
		<view v-if="decumentHistoryCache" class="container-title">
			<view class="tv-title">最近阅读</view>
			<text style="font-size: 12px; color: #919397;" @tap="goFiles">查看更多 >></text>
		</view>
		<scroll-view v-if="decumentHistoryCache" scroll-x class="scroll-doc">
			<view class="scroll-view-item" v-for="(item, index) in decumentHistoryCache" :key="index" @click="doc_click(item)">
				<image src="../../static/btn-1.png" class="img-btn"></image>
				<view class="scroll-view-text">
					<text class="tv-scroll">{{item.name}}</text>
					<text class="tv-scroll1">{{item.desc}}</text>
				</view>
			</view>
		</scroll-view>
		<!-- <view class="box-center" hover-class="itemHover" style="margin-left: 40upx;" @click="goUpload">
			<image src="../../static/btn-1.png" class="img-btn"></image>
			<view style="margin-right: 40upx;">
				<view style="font-size: 18px; color: #000000;">故障上报</view>
				<text style="font-size: 12px; color: #666666; margin-top: 20upx;">提供快捷的故障上报，并可以实\n时查询处理进度，处理结果等。</text>
			</view>
		</view>
		<view class="box-center" hover-class="itemHover" style="margin-left: 40upx;" @click="goOrder">
			<image src="../../static/btn-2.png" class="img-btn"></image>
			<view style="margin-right: 40upx;">
				<view style="font-size: 18px; color: #000000;">故障查询</view>
				<text style="font-size: 12px; color: #666666; margin-top: 20upx;">可以实时查看自己提交的Case信\n息，输入Case号和查询码进行查询</text>
			</view>
		</view> -->
		
		<button class="btnAtom" @click="openAtomops">云管家考试培训系统</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				box_tv_todo: 0, // 待办理 Number
				box_tv_doing: 0, // 办理中 Number
				box_tv_done: 0, // 已办理 Number


				saveCase: "", //故障上报 保存
				upload: "", // 上传文件
				dictList: "", //类型列表
				getCase: "", //获取工单信息请求URL
				getInstImg: "", // 获取流程活动图请求URL
				getTaskInfo: "", // 获取流程处理详情请求URL

				decumentHistoryCache: null, // 是否有文档浏览记录
			}
		},
		onLoad() {
			let me = this;
			let serverUrl = me.serverUrl;
			uni.request({
				url: serverUrl + "/api/wxopcase/getApiURL",
				method: "GET",
				header: {
					'content-type': 'application/json;charset=UTF-8'
				},
				success: (res) => {
					// console.log(res.data);
					//getCaseById "https://www.ywglapp.com/api/atomops-service/api/wxopcase/getCaseById"
					//getInstImage "https://www.ywglapp.com/api/atomops-service/api/wxopcase/getInstImage"
					//getTaskHandleDetailInfo "https://www.ywglapp.com/api/atomops-service/api/wxopcase/getTaskHandleDetailInfo"
					if (res.data.code == 0) {
						me.saveCase = res.data.data.saveCase;
						me.upload = res.data.data.upload;
						// console.log(me.upload);//https://www.ywglapp.com/api/atomops-service/api/wxopcase/upload
						me.dictList = res.data.data.dictList;
						me.getCase = res.data.data.getCaseById;
						me.getInstImg = res.data.data.getInstImage;
						me.getTaskInfo = res.data.data.getTaskHandleDetailInfo;
						getApp().globalData.token = res.data.data.token;
						// console.log("token:"+res.data.data.token);//f37b3c8c4bfc60d58505bc8fde2c1c83
					} else {
						uni.showToast({
							title: '服务错误,请重启小程序',
							icon: "none"
						});
					}
				},
				fail: (res) => {
					uni.showToast({
						title: '访问服务失败,请重启',
						icon: "none"
					});
				}
			})
		},
		onShareAppMessage() {
			
		},
		onShow() {
			this.decumentHistoryCache = uni.getStorageSync("decumentHistoryCache");
		},
		methods: {
			goUpload() {
				let userType = uni.getStorageSync("userType");
				if (userType == 'customer' || userType == 'staff') {
					let staffCode = null;
					if (userType == 'customer') {
						staffCode = uni.getStorageSync("userid");
						userType = 5;
					} else if (userType == 'staff') {
						staffCode = uni.getStorageSync("staffCode");
						userType = 1;
					}
					uni.navigateTo({
						url: "../upInfo/upInfo?saveCase=" + this.saveCase + "&upload=" + this.upload + "&staff=" + staffCode + "&type=" +
							userType
					})
				} else {
					uni.showToast({
						title: '请登录后再操作',
						duration: 1000,
						icon: "none"
					});
					setTimeout(() => {
						uni.switchTab({
							url: "../me/me"
						});
					}, 1000);
				}
			},
			goOrder: function(i) {
				const userType = uni.getStorageSync("userType");
				if (userType == 'customer' || userType == 'staff') {
					let staffCode = null;
					if (userType == 'customer') { // 如果是customer
						staffCode = uni.getStorageSync("userid");
					} else if (userType == 'staff') {
						staffCode = uni.getStorageSync("staffCode");
					}
					uni.navigateTo({
						url: "../inquire/inquire?getCase=" + this.getCase + "&staff=" + staffCode + "&i=" + i
					})
				} else {
					uni.showToast({
						title: '请登录后再操作',
						duration: 1000,
						icon: "none"
					});
					setTimeout(() => {
						uni.switchTab({
							url: "../me/me"
						});
					}, 1000);
				}
			},
			goFiles: function() {
				uni.switchTab({
					url: "../documentIndex/documentIndex"
				})
			},
			goHelp: function() {
				uni.navigateTo({
					url: "feedback"
				})
			},
			doc_click: function(item) {
				uni.showLoading({
					title: '加载中...'
				});
				wx.downloadFile({
					url: item.path,
					success: function(res) {
						if (res.statusCode === 200) {
							const filePath = res.tempFilePath
							// console.log("filePath = " + filePath)
							wx.openDocument({
								filePath: filePath,
								fileType: item.type,
								success: function(res) {
									// console.log('打开文档成功')
									uni.hideLoading()
								},
								fail: function(err) {
									// console.log(err)
									uni.hideLoading()
									uni.showToast({
										title: '加载失败',
										icon: 'none'
									})
								}
							})
						} else {
							uni.hideLoading()
							uni.showToast({
								title: '加载失败',
								icon: 'none'
							})
						}
					},
					fail: function(err) {
						uni.hideLoading()
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						})
					}
				})
			},
			openAtomops(){
				uni.navigateTo({
					url:"AtomopsWebview"
				})
			}
		}
	}
</script>

<style>
	page {
		/* background-color: #F4F4F4; */
	}

	.img-top {
		width: 100%;
		height: 244upx;
		margin-top: 30upx;
	}

	.container {
		padding: 0 20upx 20upx 20upx;
	}

	.tv-title {
		color: #303030;
		font-weight: bold;
		font-size: 15px;
		margin: 50upx 0 30upx 0;
	}

	.box-container {
		width: 100%;
		height: 186upx;
		display: flex;
		justify-content: space-between;
	}

	.box-todo {
		border-radius: 20upx;
		width: 220upx;
		height: 186upx;
		display: flex;
		justify-content: space-between;
	}

	.box-tv {
		margin: 20upx 0 0 30upx;
		color: #FFFFFF;
		font-size: 15px;
	}

	.box-tv2 {
		margin: 0 30upx 20upx 0;
		color: #FFFFFF;
		font-size: 18px;
		align-self: flex-end;
	}

	.service-container {
		width: 100%;
		height: 160upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		align-items: space-between;
	}

	.box-service {
		display: flex;
		flex-direction: column;
		/* align-items: flex-start; */
		width: 332upx;
		height: 160upx;
		border-radius: 20upx;
	}

	.tv-service {
		font-size: 17px;
		color: #000000;
		font-weight: bold;
		margin-top: 15upx;
		margin-bottom: 9upx;
		margin-left: 30upx;
	}

	.tv-service1 {
		font-size: 14px;
		color: #000000;
		margin-left: 30upx;
	}

	.container-title {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* align-content: center; */
	}

	.box-recent {
		display: flex;
		width: 100%;
		background-color: #FFFFFF;
		align-items: center;
		height: 86upx;
		justify-content: space-evenly;
	}

	.tv-recent {
		border: #1C1C1C 1upx solid;
		border-radius: 30upx;
		padding: 4upx 8upx 4upx 8upx;
	}

	.scroll-doc {
		width: 710upx;
		/* height: 184upx; */
		white-space: nowrap;
		
	}

	.scroll-view-item {
		padding-right: 10upx;
		margin-right: 20upx;
		display: inline-flex;
		align-items: center;
		/* width: 420upx; */
		border-radius: 20upx;
		height: 100%;
		border: #DFE1E3 2upx solid;
		box-shadow: 0 0 10upx #DFE1E3;
	}

	.scroll-view-text {
		display: flex;
		flex-direction: column;
		font-size: 12px;
	}

	.tv-scroll {
		font-size: 12px;
		color: #000000;
	}

	.tv-scroll1 {
		font-size: 12px;
		color: #DFE1E3;
	}

	/* swiper image {
		width: 750upx;
	}
	.bg-top:after {
		box-shadow: -60rpx -30rpx 90rpx 30rpx #ffffff inset
	} */

	.box-center {
		margin-top: 60upx;
		background-color: #FFFFFF;
		width: 650upx;
		height: 220upx;
		display: flex;
		/* justify-content: center; */
		background: #FFFFFF;
		align-items: center;
		border-radius: 20upx;
		box-shadow: 0 0 15upx #AAAAAA;
	}

	.img-btn {
		margin: 30upx;
		height: 110upx;
		width: 110upx;
	}

	.itemHover {
		background: #F8F8F8;
	}
	
	.btnAtom{
		margin-top: 30upx;
	}

	/* ::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	} */
	/* 无效 */
</style>

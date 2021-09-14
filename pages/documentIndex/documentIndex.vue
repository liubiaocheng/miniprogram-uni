<template>
	<view>
		
		<view class="nav-bar">
			<view :class="{'nav-item': true, 'nav-item-selected':showMode == 0}" @click="switchNavContent(0)">产品介绍</view>
			<view :class="{'nav-item': true, 'nav-item-selected':showMode == 1}" @click="switchNavContent(1)">帮助文档</view>
			<view :class="{'nav-item': true, 'nav-item-selected':showMode == 2}" @click="switchNavContent(2)">教学视频</view>
		</view>
		
		<view style="padding-top: 70rpx;">
			
			<view v-show="showMode == 0">
				<view v-if="productListData == null || productListData.length == 0">
					<view style="text-align: center; margin-top: 350rpx;">列表为空</view>
				</view>
				<view v-else class="item-card" v-for="(item, index) in productListData" v-bind:key="index"
				@click="productClick(index)">
					<view class="item">
						<image src="../../static/btn-3.png" class="item-icon"></image>
						<view class="item-content">
							<view class="item-title">{{productListData[index].fileName == null ? "" : productListData[index].fileName}}</view>
							<view class="item-synopsis">{{productListData[index].fileDesc == null ? "" : productListData[index].fileDesc}}</view>
						</view>
					</view>
				</view>
			</view>
			
			<view v-show="showMode == 1">
				<view v-if="workbookListData == null || workbookListData.length == 0">
					<view style="text-align: center; margin-top: 350rpx;">列表为空</view>
				</view>
				<view v-else class="item-card" v-for="(item, index) in workbookListData" v-bind:key="index"
				@click="workbookClick(index)">
					<view class="item">
						<image src="../../static/btn-3.png" class="item-icon"></image>
						<view class="item-content">
							<view class="item-title">{{workbookListData[index].fileName == null ? "" : workbookListData[index].fileName}}</view>
							<view class="item-synopsis">{{workbookListData[index].fileDesc == null ? "" : workbookListData[index].fileDesc}}</view>
						</view>
					</view>
				</view>
			</view>
			
			<view v-show="showMode == 2">
				<view v-if="videoListData == null || videoListData.length == 0">
					<view style="text-align: center; margin-top: 350rpx;">列表为空</view>
				</view>
				<view v-else class="item-video" v-for="(item, index) in videoListData" :key="index">
					<view class="item-video-title">{{videoListData[index].fileName}}</view>
					<view class="item-video-content">
						<video class="item-video-player" :src="item.fileUrl"
						 @error="videoErrorCallback" controls show-fullscreen-btn direction="90"></video>
					</view>
				</view>
				
			</view>
			
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showMode: 0,
				productListData: [],
				workbookListData: [],
				videoListData: []
			}
		},
		methods: {
			switchNavContent: function(position) {
				this.$data.showMode=position
				if(position == 0) {
					this.loadProductList()
				} else if(position == 1) {
					this.loadWorkbookList()
				} else if(position == 2) {
					this.loadVideoList()
				}
			},
			/**
			 * 加载产品介绍列表
			 */
			loadProductList: function() {
				uni.showLoading({
					title: '加载中...'
				})
				let me = this
				uni.request({
					url: me.serverUrl + "/api/wxopcase/getFiles",
					method:"GET",
					header: {
						'content-type': 'application/json;charset=UTF-8'
					},
					data: {
						token: getApp().globalData.token,
						type: 2
					},
					success: (result) => {
						this.$data.productListData = result.data.data.data
					},
					fail: (err) => {
						uni.showToast({
							title: '请求异常',
							icon: 'none'
						})
					},
					complete: () => {
						uni.hideLoading()
					}
				})
			},
			/**
			 * 加载操作手册列表
			 */
			loadWorkbookList: function() {
				uni.showLoading({
					title: '加载中...'
				})
				let me = this
				uni.request({
					url: me.serverUrl + "/api/wxopcase/getFiles",
					method:"GET",
					header: {
						'content-type': 'application/json;charset=UTF-8'
					},
					data: {
						token: getApp().globalData.token,
						type: 0
					},
					success: (result) => {
						this.$data.workbookListData = result.data.data.data
					},
					fail: (err) => {
						uni.showToast({
							title: '请求异常',
							icon: 'none'
						})
					},
					complete: () => {
						uni.hideLoading()
					}
				})
			},
			/**
			 * 加载视频列表
			 */
			loadVideoList: function() {
				uni.showLoading({
					title: '加载中...'
				})
				let me = this
				uni.request({
					url: me.serverUrl + "/api/wxopcase/getFiles",
					method:"GET",
					header: {
						'content-type': 'application/json;charset=UTF-8'
					},
					data: {
						token: getApp().globalData.token,
						type: 1
					},
					success: (result) => {
						this.$data.videoListData = result.data.data.data
					},
					fail: (err) => {
						uni.showToast({
							title: '请求异常',
							icon: 'none'
						})
					},
					complete: () => {
						uni.hideLoading()
					}
				})
			},
			/**
			 * 产品介绍列表点击
			 * @param {Object} position
			 */
			productClick: function(position) {
				this.documentItemClick(this.$data.productListData[position])
			},
			/**
			 * 操作手册列表点击
			 * @param {Object} position
			 */
			workbookClick: function(position) {
				this.documentItemClick(this.$data.workbookListData[position])
			},
			/**
			 * 文件列表项点击处理
			 * @param {Object} documentItemData
			 */
			documentItemClick: function(documentItemData) {
				var path = documentItemData.fileUrl
				var type = documentItemData.fileType
				var name = documentItemData.fileName
				var desc = documentItemData.fileDesc
				uni.showLoading({
					title: '加载中...'
				})
				wx.downloadFile({
					url: path,
					success: (res) => {
						if (res.statusCode === 200) {
							this.saveLocalDecumentHistory(path, type, name, desc)
							this.openListDocument(res.tempFilePath, type)
						} else {
							uni.hideLoading()
							uni.showToast({
								title: '加载失败',
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						uni.hideLoading()
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						})
					}
				})
			},
			/**
			 * 打开列表项文档
			 * @param {Object} filePath
			 * @param {Object} type
			 */
			openListDocument: function(filePath, type) {
				wx.openDocument({
					filePath: filePath,
					fileType: type,
					success: function (res) {
						uni.hideLoading()
					},
					fail: function(err) {
						uni.hideLoading()
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						})
					},
					complete: function() {
						
					}
				})
			},
			/**
			 * 保存本地列表项文档打开记录
			 * @param {Object} path
			 * @param {Object} type
			 * @param {Object} name
			 * @param {Object} desc
			 */
			saveLocalDecumentHistory: function(path, type, name, desc) {
				var decumentHistoryCache
				wx.getStorage({
					key:"decumentHistoryCache",
					success: (res) => {
						decumentHistoryCache = res.data
						if(decumentHistoryCache == null) {
							decumentHistoryCache = []
						}
						if(decumentHistoryCache.length > 2) {
							decumentHistoryCache = []
						}
						if(decumentHistoryCache.length > 0) {
							if(decumentHistoryCache[decumentHistoryCache.length - 1].path != path) {
								if(decumentHistoryCache.length == 2) {
									decumentHistoryCache.splice(0, 1)
								}
								decumentHistoryCache.push({
									"path":path,
									"type":type,
									"name":name,
									"desc":desc
								})
								wx.setStorage({
									key:"decumentHistoryCache",
									data:decumentHistoryCache
								})
							}
						}
						
					},
					fail: (err) => {
						decumentHistoryCache = []
						decumentHistoryCache.push({
							"path":path,
							"type":type,
							"name":name,
							"desc":desc
						})
						wx.setStorage({
							key:"decumentHistoryCache",
							data:decumentHistoryCache
						})
					}
				});
			}
		},
		onLoad: function (options) {
		    this.switchNavContent(0)
		}
	}
</script>

<style>
	.nav-bar {
		position: fixed; 
		width: 100%;
		display: flex;
		justify-content: space-around;
		border-bottom: 2rpx solid rgba(0,0,0,0.2);
		background-color: #FFFFFF;
		z-index: 900;
	}
	
	.nav-item {
		width: auto;
		text-align: center;
		padding: 10rpx 0 5rpx 0;
	}
	
	.nav-item-selected {
		color: #5296FD;
		font-weight: bold;
		border-bottom: 2rpx solid #5296FD;
	}
	
	.nav-item-default {
		color: #666666;
		font-weight: normal;
	}
	
	.item {
		display: flex; 
		border: 2rpx solid rgba(0,0,0,0.1);
		border-radius: 20rpx;
		box-shadow: 0rpx 0rpx 10rpx 3rpx rgba(0,0,0,0.2);
		margin: 30rpx;
		padding: 30rpx;
	}
	
	.item:active {
		background-color: #DADADA;
	}
	
	.item-icon {
		width: 120rpx; 
		height: 120rpx;
		min-width: 120rpx;
		margin-right: 20rpx;
	}
	
	.item-content {
		flex: 1;
	}
	
	.item-title {
		font-weight: bold;
		font-size: larger;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 500rpx;
	}
	
	.item-synopsis {
		font-size: medium;
		color: rgba(0,0,0,0.6);
	}
	
	.item-video {
		
	}
	
	.item-video-title {
		padding: 20rpx 0 20rpx 50rpx;
		color: #000000;
		font-size: larger;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 650rpx;
	}
	
	.item-video-content {
		width: 100%;
		display: flex;
		justify-content: center;
	}
	
	.item-video-player {
		width: 650rpx;
		border-radius: 20rpx;
	}
	
</style>

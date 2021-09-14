<template>
	<view>
		<view>
			<video v-for="(item, index) in videoListData" :key="item.value"
			:src="item.fileUrl" class="video-cover" @error="videoErrorCallback" controls show-fullscreen-btn direction="90"></video>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				videoListData: [
					
				]
			}
		},
		onReady: function(result) {
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
						title: '请求异常'
					})
				},
				complete: () => {
					uni.hideLoading()
				}
			})
		},
		methods: {
			videoErrorCallback: function(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			}
		}
	}
</script>

<style>
	.video-cover {
		width: 100%;
	}
</style>

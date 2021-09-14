<template>
	<view>
			<!-- <uni-list-item :show-arrow="false" title="列表文字" note="列表描述信息" />
			<uni-list-item :disabled="true" :show-arrow="false" title="列表禁用状态" /> -->
		
		<uni-list>
			<uni-list-item :show-arrow="true" :title="bookListData[index].fileName" 
			v-for="(item, index) in bookListData" :key="item.value"
			@click="bookClick(bookListData[index].fileUrl, bookListData[index].fileType)"/>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bookListData: [
					
				]
			}
		},
		onReady: function(result) {
			console.log('onReady')
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
					token: getApp().globalData.token, //'2cfff27cb1f048bca2e19e7e24a1ae2d',
					type: 0
				},
				success: (result) => {
					console.log('result', result)
					this.$data.bookListData = result.data.data.data
				},
				fail: (err) => {
					console.log('err', err)
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
			bookClick: function(path, type) {
				// uni.navigateTo({
				//     url: '/pages/faultBook/faultResult'
				// })
				// console.log(e);
				
				uni.showLoading({
					title: '加载中...'
				})
				wx.downloadFile({
					url: path,
					success: function (res) {
						const filePath = res.tempFilePath
						wx.openDocument({
							filePath: filePath,
							fileType: type,
							success: function (res) {
								console.log('打开文档成功')
								uni.hideLoading()
							},
							fail: function(err) {
								console.log(err)
								uni.hideLoading()
								uni.showToast({
									title: '加载失败',
									icon: 'fail'
								})
							},
							complete: function() {
								console.log('complete')
							}
				    })
				  }
				})
			}
		},
		onLoad:function(){
			
		}
	}
</script>

<style>

</style>

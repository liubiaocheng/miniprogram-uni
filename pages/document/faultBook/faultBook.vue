<template>
	<view>
		<view>
			<view>
				<uni-search-bar @confirm="search" @input="input" @cancel="cancel" />
				<uni-list>
					<uni-list-item :show-arrow="true" :title="item" v-for="item in searchResult" :key="item.value" @click="itemClick"/>
					<!-- <uni-list-item :show-arrow="false" title="列表文字" note="列表描述信息" />
					<uni-list-item :disabled="true" :show-arrow="false" title="列表禁用状态" /> -->
				</uni-list>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchResult: []
			}
		},
		methods: {
			search(res) {
				this.searchResult.push(res.value)
			},
			input(res) {
				
			},
			cancel(res) {
				
			},
			itemClick(e) {
				uni.navigateTo({
				    url: '/pages/faultBook/faultResult'
				})
			}
		},
		onLoad:function(){
			uni.request({
				url: 'https://unidemo.dcloud.net.cn/ajax/echo/text?name=uni-app',
				dataType: 'text',
				data: {
					noncestr: Date.now()
				},
				success: (res) => {
					console.log('request success', res)
					uni.showToast({
						title: '请求成功',
						icon: 'success',
						mask: true,
						duration: 2000
					})
					this.res = '请求结果 : ' + JSON.stringify(res)
				},
				fail: (err) => {
					console.log('request fail', err)
					uni.showModal({
						content: err.errMsg,
						showCancel: false
					})
				},
				complete: () => {
					this.loading = false
				}
			});
		}
	}
</script>

<style>

</style>

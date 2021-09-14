<template>
	<view>
		<uni-search-bar :radius="40" placeholder="请输入故障工单" @confirm="search" cancelText="搜索" @cancel="search" />

		<view v-if="searchResult">
			<uni-segmented-control :current="currentItem" @clickItem="onClickItem" style-type="button" active-color="#007AFF"
			 :values="items" />
			<view v-if="currentItem == 0" style="margin-top: 30upx;">
				<view class="res-line">
					<text>工单:</text><text>{{searchResult.id}}</text>
				</view>
				<view class="res-line">
					<text>caseCode:</text><text>{{searchResult.caseCode}}</text>
				</view>
				<view class="res-line">
					<text>用户ID:</text><text>{{searchResult.customerId}}</text>
				</view>
				<view class="res-line">
					<text>用户名:</text><text>{{searchResult.customerName}}</text>
				</view>
				<view class="res-line">
					<text>applyTime:</text><text>{{searchResult.applyTime}}</text>
				</view>
				<view class="res-line">
					<text>audioUrl:</text><text>{{searchResult.audioUrl}}</text>
				</view>
				<view class="res-line">
					<text>businessKey:</text><text>{{searchResult.businessKey}}</text>
				</view>
				<view class="res-line">
					<text>caseState:</text><text>{{searchResult.caseState}}</text>
				</view>
				<view class="res-line">
					<text>categoryId:</text><text>{{searchResult.categoryId}}</text>
				</view>
				<view class="res-line">
					<text>categoryName:</text><text>{{searchResult.categoryName}}</text>
				</view>
				<view class="res-line">
					<text>companyName:</text><text>{{searchResult.companyName}}</text>
				</view>
				<view class="res-line">
					<text>content:</text><text>{{searchResult.content}}</text>
				</view>
				<view class="res-line">
					<text>disposeLevel:</text><text>{{searchResult.disposeLevel}}</text>
				</view>
				<view class="res-line">
					<text>email:</text><text>{{searchResult.email}}</text>
				</view>
				<view class="res-line">
					<text>grade:</text><text>{{searchResult.grade}}</text>
				</view>
				<view class="res-line">
					<text>gradeName:</text><text>{{searchResult.gradeName}}</text>
				</view>
				<view class="res-line">
					<text>imageUrl:</text><text>{{searchResult.imageUrl}}</text>
				</view>
				<view class="res-line">
					<text>instanceId:</text><text>{{searchResult.instanceId}}</text>
				</view>
				<view class="res-line">
					<text>phoneNum:</text><text>{{searchResult.phoneNum}}</text>
				</view>
				<view class="res-line">
					<text>productId:</text><text>{{searchResult.productId}}</text>
				</view>
				<view class="res-line">
					<text>queryCode:</text><text>{{searchResult.queryCode}}</text>
				</view>
				<view class="res-line">
					<text>responseTime:</text><text>{{searchResult.responseTime}}</text>
				</view>
				<view class="res-line">
					<text>solveTime:</text><text>{{searchResult.solveTime}}</text>
				</view>
				<view class="res-line">
					<text>sourceName:</text><text>{{searchResult.sourceName}}</text>
				</view>
				<view class="res-line">
					<text>startTime:</text><text>{{searchResult.startTime}}</text>
				</view>
				<view class="res-line">
					<text>taskId:</text><text>{{searchResult.taskId}}</text>
				</view>
				<view class="res-line">
					<text>taskName:</text><text>{{searchResult.taskName}}</text>
				</view>
				<view class="res-line">
					<text>title:</text><text>{{searchResult.title}}</text>
				</view>
				<view class="res-line">
					<text>type:</text><text>{{searchResult.type}}</text>
				</view>
				<view class="res-line">
					<text>videoUrl:</text><text>{{searchResult.videoUrl}}</text>
				</view>
			</view>
			<view v-if="currentItem == 1">
				<uni-steps :options="processDetail" active-color="#007AFF" :active="active" direction="column" />
			</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentItem: 0,
				items: ["列表", "处理细节"],
				processDetail: [], //处理细节
				searchingId: null, // 有效工单号
				searchResult: null,
				active: 0,
				caseUrl: ""
			}
		},
		onLoad: function(r) {
			this.caseUrl = r.case;
		},
		methods: {
			search(res) {
				if (res.value) {
					uni.showNavigationBarLoading();
					let me = this;
					uni.request({
						url: me.caseUrl,
						method: "GET",
						header: {
							'content-type': 'application/json;charset=UTF-8'
						},
						data: {
							token: getApp().globalData.token,
							caseId: res.value
						},
						success: (result) => {
							if (result.data.code == 0) {
								if (result.data.data.data) {
									me.searchingId = res.value;
									me.searchResult = result.data.data.data;
									// uni.setStorage({//todo 增加搜索记录，显示搜索记录，清空搜索记录
									// 	key:"searched",
									// 	data:res.value
									// });
								} else {
									uni.showToast({
										title: '工单错误',
										icon: "none"
									});
								}
							} else {
								uni.showToast({
									title: '服务端错误',
									icon: "none"
								});
							}
						},
						fail: (error) => {
							uni.showToast({
								title: '网络请求失败',
								icon: "none"
							});
						},
						complete: function() {
							uni.hideNavigationBarLoading();
						}
					})
				} else {
					uni.showToast({
						title: '请输入正确工单',
						icon: "none"
					});
				}
			},
			onClickItem(event) { //切换switch按钮
				if (this.currentItem !== event.currentIndex) {
					this.currentItem = event.currentIndex
				}
				if (this.currentItem == 1 && this.processDetail.length == 0) {
					uni.showNavigationBarLoading();
					let me = this;
					uni.request({
						url: me.serverUrl + "/api/wxopcase/getCaseTimeLine",
						method: "GET",
						header: {
							'content-type': 'application/json;charset=UTF-8'
						},
						data: {
							token: getApp().globalData.token,
							caseId: me.searchingId
						},
						success: (result) => {
							if (result.data.code == 0) {
								if (result.data.data.list) {
									let stepList = result.data.data.list;
									for (let item of stepList) {
										let temp = {
											"title": item.time,
											'desc': item.realName,
											"taskName": item.taskName,
											"treatmentMeasures": item.treatmentMeasures,
											"taskName": item.taskName
										};
										me.processDetail.unshift(temp);
									}
									if (me.processDetail.length == 0) {
										uni.showToast({
											title: '请求无数据',
											icon: "none"
										});
									}
								} else {
									uni.showToast({
										title: '工单错误',
										icon: "none"
									});
								}
							} else {
								uni.showToast({
									title: '服务端错误',
									icon: "none"
								});
							}
						},
						fail: (error) => {
							uni.showToast({
								title: '网络请求失败',
								icon: "none"
							});
						},
						complete: function() {
							uni.hideNavigationBarLoading();
						}
					})
				}
			}
		}
	}
</script>

<style>
	.res-line {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-bottom: 20upx;
		border-bottom: #E5E5E5 1upx solid;
	}
</style>

<template>
	<view class="container">
		<!-- <uni-segmented-control :current="currentItem" @clickItem="onClickItem" style-type="button" active-color="#007AFF" :values="items" />
		<text>(UI设计稿待完成，本页面样式待更新)</text> -->

		<!-- <view v-if="currentItem == 0" v-for="(item, index) in resList" :key="index" class="list-style">
			<view class="list-item">
				<text>activityName</text>
				<text>{{item.activityName}}</text>
			</view>
			<view class="list-item">
				<text>processInstanceId</text>
				<text>{{item.processInstanceId}}</text>
			</view>
			<view class="list-item">
				<text>activityType</text>
				<text>{{item.activityType}}</text>
			</view>
			<view class="list-item">
				<text>assignee</text>
				<text>{{item.assignee}}</text>
			</view>
			<view class="list-item">
				<text>assigneeNameassigneeName</text>
				<text>{{item.assigneeName}}</text>
			</view>
			<view class="list-item">
				<text>comment</text>
				<text>{{item.comment}}</text>
			</view>
			<view class="list-item">
				<text>durationInSeconds</text>
				<text>{{item.durationInSeconds}}</text>
			</view>
			<view class="list-item">
				<text>endTime</text>
				<text>{{item.endTime}}</text>
			</view>
			<view class="list-item">
				<text>executionId</text>
				<text>{{item.executionId}}</text>
			</view>
			<view class="list-item">
				<text>processDefinitionId</text>
				<text>{{item.processDefinitionId}}</text>
			</view>
			<view class="list-item">
				<text>startTime</text>
				<text>{{item.startTime}}</text>
			</view>
			<view class="list-item">
				<text>taskId</text>
				<text>{{item.taskId}}</text>
			</view>
		</view> -->
		<!-- <image :src="imgsrc" mode="aspectFill" v-else @click="imgClick"/> -->

		<view class="top-box">
			<view class="box-of-top">
				<text>工单编号</text>
				<text>{{id}}</text>
				<!-- <text class="tvcolor">待处理</text> -->
			</view>
			<view class="tv-flex-between"><text>故障描述: </text><text>{{toptitle}}</text></view>
			<view class="tv-flex-between"><text>处理进度: </text><text>{{caseState}}</text></view>
		</view>
		<uni-steps :options="processDetail" active-color="#007AFF" :active="active" direction="column" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: "", //工单ID
				instanceId: "",
				currentItem: 0,
				items: ["流转详情", "流程图"],
				resList: [],
				imgsrc: null,
				processDetail: [], //处理细节
				active: 0, // 步骤条第几个位置选中
				toptitle: "",
				caseState: "",
			}
		},
		onLoad: function(res) {
			if (res.instanceId) {
				this.instanceId = res.instanceId;
				this.toptitle = res.t;
				this.id = res.id;
				// switch (res.c) {
				// 	case -1: //
				// 		this.caseState = "全部工单";
				// 		break;
				// 	case 0: //
				// 		this.caseState = "待办理";
				// 		break;
				// 	case 1: //
				// 		this.caseState = "办理中";
				// 		break;
				// 	case 4: //
				// 		this.caseState = "已完成";
				// 		break;
				// }
				if (res.c == -1) {
					this.caseState = "全部工单";
				} else if (res.c == 0) {
					this.caseState = "待办理";
				} else if (res.c == 1) {
					this.caseState = "办理中";
				} else if (res.c == 4) {
					this.caseState = "已完成";
				} else {
					this.caseState = res.c;
				}
			} else {
				uni.showToast({
					icon: "none",
					title: "请重启小程序"
				});
				return;
			}
			uni.showNavigationBarLoading();
			let me = this;
			uni.request({
				url: this.serverUrl + "/api/wxopcase/getTaskHandleDetailInfo",
				method: "GET",
				data: {
					processInstanceId: me.instanceId,
					token: getApp().globalData.token
				},
				success: function(result) {
					uni.hideNavigationBarLoading();
					if (result.data.code == 0) {
						me.resList = result.data.data.list;
						// console.log(me.resList);
						for (let item of me.resList) {
							let temp = {
								"title": item.comment == null ? "" : item.comment,
								'desc': item.startTime + " - " + item.endTime,
								"taskName": item.assigneeName,
								"treatmentMeasures": item.activityName,
							};
							// me.processDetail.unshift(temp); //数组头部添加元素
							me.processDetail.push(temp); // 数组尾部添加元素
						}
						if (me.resList.length == 0) {
							uni.showToast({
								title: '请求无数据',
								icon: "none"
							});
						}
					} else {
						uni.showToast({
							icon: "none",
							title: "服务端错误"
						});
					}
				},
				fail: function() {
					uni.hideNavigationBarLoading();
					uni.showToast({
						icon: "none",
						title: "请求失败"
					});
				}
			})
		},
		methods: {
			onClickItem(event) {
				if (this.currentItem !== event.currentIndex) {
					this.currentItem = event.currentIndex
				}
				if (this.currentItem == 1 && this.imgsrc == null) {
					this.imgsrc = this.serverUrl + "/api/wxopcase/getInstImage?processInstanceId=" + this.instanceId + "&token=" +
						getApp().globalData.token;
				}
			},
			imgClick() {
				uni.previewImage({
					urls: this.imgsrc.split(" "), // 必须接收数组，不可以是字符串
					// current:this.imgsrc,
				})
			}
		}
	}
</script>

<style>
	.container {
		padding: 30upx 20upx 0 20upx;
	}

	.list-style {
		border: #DADADA 1upx solid;
		margin: 10upx;
	}

	.list-item {
		display: flex;
		justify-content: space-between;
		margin: 10upx;
	}

	.top-box {
		box-shadow: 0 0 10upx #EEEEEE;
		border: #EEEEEE 2upx solid;
		border-radius: 20upx;
		padding: 30upx;
	}

	.box-of-top {
		display: flex;
		justify-content: space-between;
		color: #919397;
		padding-bottom: 10upx;
		border-bottom: #919397 1px solid;
	}

	.tv-flex-between {
		display: flex;
		justify-content: space-between;
	}

	.tvcolor {
		color: #5296FD;
	}
</style>

<!-- 故障查询页面 -->
<template>
	<view class="container">
		<view class="search-box">
			<!-- <input disabled="true" @click="serchtap" placeholder="搜索工单..." class="input" /> -->
			<cl-tabs :tab-bars="tabs" :tab-index="tabCurrentIndex" @tabChange="tabChange" center type="hang" sliderColor="#D3E2F8"
			 textColor="#D3E2F8" selectColor="#FFFFFF" ref="tabs2" class="tabs" :scale="1.1" />
		</view>
		<!-- <swiper class="swiper-style" @transition="transition" @change="changeCurrent" :current="tabCurrentIndex" @animationfinish="animfinish">
			<swiper-item> -->
		<scroll-view scroll-y v-if="tabCurrentIndex == 0" class="height100">
			<!--  class="height100" -->
			<view v-for="(item, index) in caseList" :key="index" @click="itemClick(item.instanceId, item.title, item.caseState,item.id)">
				<view class="content-box">
					<view class="content-top">
						<text>{{item.applyTime}}</text>
						<text>></text>
					</view>
					<view>公司名称: {{item.companyName}}</view>
					<view>用户姓名: {{item.customerName}}</view>
					<view>故障描述: {{item.content}}</view>
					<view>处理进程: {{item.caseState}}</view><!-- 0待处理1处理中4已完成 -->
				</view>
			</view>
		</scroll-view>
		<scroll-view scroll-y v-if="tabCurrentIndex == 1" class="height100">
			<view v-for="(item, index) in caseListTodo" :key="index" @click="itemClick(item.instanceId, item.title,item.caseState,item.id)">
				<view class="content-box">
					<view class="content-top">
						<text>{{item.applyTime}}</text>
						<text>></text>
					</view>
					<view>公司名称: {{item.companyName}}</view>
					<view>用户姓名: {{item.customerName}}</view>
					<view>故障描述: {{item.content}}</view>
					<view>处理进程: 待处理</view><!-- 0待处理1处理中4已完成 -->
				</view>
			</view>
		</scroll-view>
		<scroll-view scroll-y v-if="tabCurrentIndex == 2" class="height100">
			<view v-for="(item, index) in caseListDoing" :key="index" @click="itemClick(item.instanceId, item.title,item.caseState,item.id)">
				<view class="content-box">
					<view class="content-top">
						<text>{{item.applyTime}}</text>
						<text>></text>
					</view>
					<view>公司名称: {{item.companyName}}</view>
					<view>用户姓名: {{item.customerName}}</view>
					<view>故障描述: {{item.content}}</view>
					<view>处理进程: 处理中</view><!-- 0待处理1处理中4已完成 -->
				</view>
			</view>
		</scroll-view>
		<scroll-view scroll-y v-if="tabCurrentIndex == 3" class="height100">
			<view v-for="(item, index) in caseListDone" :key="index" @click="itemClick(item.instanceId, item.title, item.caseState,item.id)">
				<view class="content-box">
					<view class="content-top">
						<text>{{item.applyTime}}</text>
						<text>></text>
					</view>
					<view>公司名称: {{item.companyName}}</view>
					<view>用户姓名: {{item.customerName}}</view>
					<view>故障描述: {{item.content}}</view>
					<view>处理进程: 已完成</view><!-- 0待处理1处理中4已完成 -->
				</view>
			</view>
		</scroll-view>

		<!-- </swiper-item>
		</swiper> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: ['全部工单', '待处理', '办理中', '已完成'],
				tabCurrentIndex: -1,
				sysWidth: 0,
				source: 'touch',
				fristTouch: false,

				getCase: "", //getCaseById
				staffCodeOrId: "", //员工staffCode或者用户customId
				i: 100, //从哪个入口进入工单页面，包括 0待办理、1办理中、4已完成、-1全部
				caseList: [], // 打开页面请求case列表 全部工单 -1
				caseListTodo: [], //待处理 0
				caseListDoing: [], //办理中 1
				caseListDone: [], //已完成 4
			}
		},
		onLoad: function(result) {
			if (result.getCase) {
				this.getCase = result.getCase; // url地址
				this.staffCodeOrId = result.staff;
				this.i = result.i;
				this.requestServer(this.i);
			} else {
				uni.showToast({
					title: '请重启小程序',
					icon: "none"
				});
			}
			this.sysWidth = uni.getSystemInfoSync().screenWidth
			//#ifndef H5
			this.fristTouch = true
			//#endif
		},
		mounted() {
			// this.tabCurrentIndex = 0 //起始页面index
			// console.log(this.i);
			// switch (this.i) {
			// 	case -1:
			// 		this.tabCurrentIndex = 0; //全部
			// 		break;
			// 	case 0:
			// 		this.tabCurrentIndex = 1;// 待处理
			// 		break;
			// 	case 1:
			// 		this.tabCurrentIndex = 2;// 办理中
			// 		break;
			// 	case 4:
			// 		this.tabCurrentIndex = 3;//已完成
			// 		break;
			// }
		},
		methods: {
			tabChange(e) { // 点击标题切换页面时调用
				this.tabCurrentIndex = e // 0 1 2
				if (this.tabCurrentIndex == 0 && this.caseList.length == 0) {
					this.requestServer(-1); // 全部
				} else if (this.tabCurrentIndex == 1 && this.caseListTodo.length == 0) {
					this.requestServer(0); //待处理
				} else if (this.tabCurrentIndex == 2 && this.caseListDoing.length == 0) {
					this.requestServer(1); //处理中
				} else if (this.tabCurrentIndex == 3 && this.caseListDone.length == 0) {
					this.requestServer(4); // 已完成
				}
			},
			changeCurrent(e) { //翻页才调用
				this.source = e.detail.source;
			},
			transition(e) { //滑动过程不停调用
				if (this.source == '') {

				} else {
					if (this.fristTouch) {
						this.$refs.tabs2.move(e.detail.dx - this.tabCurrentIndex * this.sysWidth)
					} else {
						this.$refs.tabs2.move(e.detail.dx)
					}
				}
			},
			animfinish(e) { //动画结束调用一次，未翻页也调用
				this.fristTouch = false
				this.source = 'touch'
				this.tabCurrentIndex = e.detail.current
			},



			serchtap() {
				uni.navigateTo({
					url: "./search/search?case=" + this.getCase
				})
			},
			itemClick(i,t,c,id) { //CaseList item 点击
				uni.navigateTo({
					url: "./inst-detail/inst-detail?instanceId=" + i + "&t=" + t + "&c=" + c + "&id="+ id
				});
			},
			requestServer(caseState) {
				let me = this;
				uni.request({
					url: me.serverUrl + "/api/wxopcase/getCaseList",
					method: "GET",
					data: {
						token: getApp().globalData.token,
						staffCode: this.staffCodeOrId,
						caseState: caseState // -1全部 0待处理 1 处理中 4已完成
					},
					success: function(result) {
						if (result.data.code == 0) {
							if (caseState == -1) { // 全部
								me.caseList = result.data.data.data;
								for(let item of me.caseList){
									if(item.caseState == 0){
										item.caseState = "待处理";
									}else if(item.caseState == 1){
										item.caseState = "处理中";
									}else if(item.caseState == 4){
										item.caseState = "已完成";
									}
								}
								me.tabCurrentIndex = 0;
								// console.log(me.caseList);
								if (me.caseList.length == 0) {
									uni.showToast({
										title: '请求无数据',
										icon: "none"
									});
								}
							} else if (caseState == 0) { // 待处理
								me.caseListTodo = result.data.data.data;
								// for(item in me.caseListTodo){
								// 	item.caseState = "待处理";
								// }
								me.tabCurrentIndex = 1;
								// console.log(me.caseListTodo);
								if (me.caseListTodo.length == 0) {
									uni.showToast({
										title: '请求无数据',
										icon: "none"
									});
								}
							} else if (caseState == 1) { // 处理中
								me.caseListDoing = result.data.data.data;
								// for(item in me.caseListDoing){
								// 	item.caseState = "处理中";
								// }
								me.tabCurrentIndex = 2;
								// console.log(me.caseListDoing);
								if (me.caseListDoing.length == 0) {
									uni.showToast({
										title: '请求无数据',
										icon: "none"
									});
								}
							} else if (caseState == 4) { // 处理完成
								me.caseListDone = result.data.data.data;
								// for(item of me.caseListDone){
								// 	item.caseState = "已处理";
								// }
								me.tabCurrentIndex = 3;
								// console.log(me.caseListDone);
								if (me.caseListDone.length == 0) {
									uni.showToast({
										title: '请求无数据',
										icon: "none"
									});
								}
							}
						}
					},
					fail: function() {
						uni.showToast({
							title: '请重启小程序',
							icon: "none"
						});
					}
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F1F1F1;
	}

	.container {
		height: 100%;
	}

	.search-box {
		background-color: #5296FD;
		/* height: 138upx; */
	}

	.tabs {
		/* background-color: #5296FD; */
	}

	.input {
		/* border: #EEEEEE 1upx solid; */
		border-radius: 30upx;
		background-color: #F8F8F8;
		padding: 6upx 0 6upx 20upx;
		margin: 0 30upx;
	}

	.swiper-style {
		/* height: calc(100% - 138upx); */
		height: 1200upx;
		/* height: 100%; */
	}

	.content-box {
		/* border: #EEEEEE 2upx solid; */
		/* box-shadow: 0 0 5upx #EEEEEE; */
		border-radius: 20upx;
		margin: 30upx;
		padding: 30upx;
		background-color: #FFFFFF;
	}

	.content-top {
		display: flex;
		justify-content: space-between;
		color: #919397;
		padding-bottom: 10upx;
		border-bottom: #919397 1px solid;
	}

	.height100 {
		/* height: 100%; */
		/* height: calc(100% - 88upx); */
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	/* .content-line {
		background-color: #919397;
		width: 100%;
		height: 1px;
	} */
</style>
<!-- https://ext.dcloud.net.cn/plugin?id=34 -->
<!-- https://ext.dcloud.net.cn/plugin?id=54 -->

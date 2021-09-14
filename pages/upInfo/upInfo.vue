<!-- 故障上报 -->
<template>
	<view class="content">
		<form @submit="formSubmit">
			<view class="tv-title"><span>*</span>用户姓名:</view>
			<input name="userName" placeholder="请输入您的姓名" maxlength=5 confirm-type="next" confirm-hold="true" class="input-style" />
			<view class="tv-title"><span>*</span>公司名称:</view>
			<input name="companyName" placeholder="您的公司名称" confirm-type="next" confirm-hold="true" class="input-style" />
			<view class="tv-title"><span>*</span>产品编号:</view>
			<input name="productId" placeholder="您的产品编号" confirm-type="next" confirm-hold="true" class="input-style" />
			<view class="tv-title"><span>*</span>产品类型: </view>
			<picker mode="selector" @change="chplxChange" :range="chplxList" :value="chplxIndex" @click="chplxClick" range-key="dictName">
				<view class="tvPicker">
					<text class="input-style">{{chplxIndex == -1 ? "请选择": chplxList[chplxIndex].dictName}}</text>
				</view>
			</picker>
			<view class="tv-title"><span>*</span>紧急程度: </view>
			<picker mode="selector" @change="jjchdChange" :range="jjchdList" :value="jjchdIndex" @click="jjchdClick" range-key="dictName">
				<view class="tvPicker">
					<text style="width: 100%;" class="input-style"> {{jjchdIndex == -1 ?"请选择": jjchdList[jjchdIndex].dictName}} </text>
				</view>
			</picker>
			<view class="tv-title"><span>*</span>标题:</view>
			<input name="title" placeholder="请简述故障" confirm-type="next" confirm-hold="true" class="input-style" />
			<view class="tv-title"><span>*</span>故障描述:</view>
			<textarea name="descript" placeholder="请详述故障" confirm-type="next" confirm-hold="true" class="input-style" style="width: 93%; height: 150upx;" />
			<view class="tv-title">邮箱地址</view>
			<input name="email" placeholder="电子邮箱地址:" confirm-type="next" confirm-hold="true" class="input-style" />
			<view class="tv-title"><span>*</span>手机号码:</view>
			<input :disabled="phoneDisable" name="phoneNum" @input="getPhone" placeholder="请输入手机号码" confirm-type="next" type="number"
			 maxlength=11 confirm-hold="true" class="input-style" />
			<view class="tv-title"><span>*</span>短信验证码:</view>
			<view style="width: 100%; display: flex; align-items: center;">
				<input type="number" @input="verifyInput" :disabled="veriDisable" name="veriCode" placeholder="请输入手机短信验证码" style="font-size: 14px;" confirm-type="send" class="input-style" />
				<button :disabled="msnCodeBtn" @tap="getVeri" size="mini" style="margin-left: 20upx;">{{btnMsn}}</button>
			</view>
			<view class="tv-title">截图上传(可选):</view>
			<image @click="imgLoad" class="uploadImg" mode="aspectFill" :src="tempImgSrc"></image>
			<view class="tv-title">视频上传(可选):</view>
			<image @click="videoLoad" class="uploadImg" v-if="!tempVideoSrc" src="../../static/plus.png"></image>
			<video class="uploadImg" v-else :show-fullscreen-btn="false" :show-progress="false" :show-play-btn="false" :enable-progress-gesture="false" :src="tempVideoSrc"></video>
			<view class="tv-title">语音上传(可选):</view>
			<jsfun-record voicePath="" @okClick="saveRecord" maxTime=60 minTime=10>
				<button :loading="btnLoading" :disabled="btnDisable" type="default" size="default">{{btnReco}}</button>
			</jsfun-record>
			<button type="primary" form-type="submit" style="width: 590upx; margin: 70upx 50upx 0upx 50upx;">提交</button>
		</form>
		<uni-popup :show="verifyshow" :type="'center'" :maskClick="false" :custom="true" ><!-- style="width: 100%; height: 100%;" -->
			<view class="uni-image-close" @click="verifyclose"><!-- 关闭按钮 -->
				<icon type="clear" color="#fff" size="20" />
			</view>
			<wyj-text-code  :backgroundImageArray='backgroundImageArray' :checkNum='checkNum' :defaultNum='defaultNum'
			 :imgSize="imgSize" @success='verifysuccess' @ready='verifyready' @error='verifyerror' /><!-- ref='text-code' -->
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isRecording: false,
				phoneNum: 0, //电话号码
				veriDisable: true,//短信验证码输入框是否禁用
				phoneDisable: false,//手机号码输入框是否禁用
				saveCase:"",// 上报URL
				fileUploadUrl:"",//文件上传URL
				staffCodeOrId:"",
				type:0,// 用户类型，上级页面传入 用户customer 5; 员工 staff 1
				recordPath:"",// 录音地址
				imgPath:"",// 图片上传之后返回的服务端地址
				tempImgSrc:"/static/plus.png",//图片本地地址，预览
				tempVideoSrc:"",//视频本地地址 预览
				videoPath:"",// 视频地址
				email:"",// 邮箱
				chplxList:[],//["云管家","云备份","云监控"],//产品类型
				jjchdList:[],//["非常紧急","紧急","普通","常规"],//紧急程度
				chplxIndex:-1,
				jjchdIndex:-1,
				btnLoading:false,
				btnDisable:false,
				btnReco:"🎙 录制语音",//🎙️ 🎤
				// 手机短信验证码 ↓
				msnCode:0,// 手机短信验证码
				msnCodeBtn:false,//是否禁用请求验证码的按钮
				timeoutId:0,//短信验证码60秒后允许重新发送
				btnMsn:"获取验证码",// 验证码按钮文字
				returnPhone:0,// 发送验证码时后台返回的手机号码
				// 手机短信验证码 ↑
				// ↓↓↓↓↓↓↓↓↓ 上传文件图形验证码 ↓↓↓↓↓↓↓↓↓↓
				verifyshow: false,// 弹出验证码对话框是否显示
				imgSize: {// 弹出验证码对话框背景图
					width: '600upx', //背景图宽度,为兼容小程序采用rpx
					height: '400upx'
				},
				defaultNum: 4, //显示文字数量
				checkNum: 2, //校验文字数量
				backgroundImageArray: ['/static/verify/bg-verificode1.jpg','/static/verify/bg-verificode2.jpg'] ,//背景图片
				// hasverifyshow: 0,//弹出验证码对话框是否已验证通过 0:未通过 1:已通过打开截图 2：已通过打开视频 3：已通过打开语音
				// ↑↑↑↑↑↑↑↑ 上传文件图形验证码 ↑↑↑↑↑↑↑↑↑↑
			}
		},
		onLoad: function(res) {
			if(res.saveCase && res.upload){
				this.saveCase = res.saveCase;
				this.fileUploadUrl = res.upload;
				this.staffCodeOrId = res.staff;
				this.type = res.type;
				// console.log(this.saveCase);//https://www.ywglapp.com/api/atomops-service/api/wxopcase/saveCase
			}else{
				uni.showToast({
					title: '请重启小程序',
					icon: "none"
				});
			}
			let me = this;
			uni.request({
				url: me.serverUrl + "/api/wxopcase/dictList?dict_key=CASE_CATEGORY",
				method:"GET",
				header: {
					'content-type': 'application/json;charset=UTF-8'
				},
				success: (result) => {
					if(result.data.code == 0){
						me.chplxList = result.data.data;
					}
				}
			});
			uni.request({
				url: me.serverUrl + "/api/wxopcase/dictList?dict_key=CASE_LEVEL",
				method:"GET",
				header: {
					'content-type': 'application/json;charset=UTF-8'
				},
				success: (result) => {
					if(result.data.code == 0){
						me.jjchdList = result.data.data;
					}
				}
			});
		},
		methods: {
			verifyclose: function() {//点击关闭图形验证码按钮
				this.verifyshow = false;
				// this.hasverifyshow = 0;
			},
			verifysuccess: function() {
				this.verifyshow = false;
				// switch(this.hasverifyshow){
				// 	case 1:
				// 		this.imgLoad();
				// 		break;
				// 	case 2:
				// 		this.videoLoad();
				// 		break;
				// 	case 3:
				// 		this.saveRecord(this.recordPath);
				// 		break;
				// }
				let me = this;
				this.phoneDisable = true;//禁用手机号码输入框
				this.msnCodeBtn = true;// 禁用请求验证码按钮
				uni.request({
					url: me.serverUrl + "/api/wxopcase/getSmsCode",
					method:"GET",
					data: {
						token: getApp().globalData.token,
						phone: me.phoneNum
					},
					success:function(result){
						if(result.data.code == 0){
							me.msnCode = result.data.data.code;
							// console.log(me.msnCode);
							me.returnPhone = result.data.data.phone;// 后台返回的电话号码，用于校验
							me.veriDisable = false;//取消禁用验证码输入框
							// me.hasverifyshow = 4;// 使之不等于0，已短信验证则不再图形验证码验证。
							uni.showToast({
								title: '验证码已发送',
								icon: "loading"
							});
							let times = 60;
							me.timeoutId = setInterval(function(){
								times--;
								me.btnMsn = `重新获取(${times})`;
								if(times < 0){
									me.btnMsn = "重新获取";
									me.msnCodeBtn = false;// 取消禁用请求验证码按钮
									me.phoneDisable = false;//取消禁用手机号码输入框
									clearInterval(me.timeoutId);
								}
							}, 1000);
						}else{//服务器端返回数据错误
							me.msnCodeBtn = false;// 取消禁用请求验证码按钮
							me.phoneDisable = false;//取消禁用手机号码输入框
							uni.showToast({
								title: '服务失败,请重试',
								icon: "none"
							});
						}
					},
					fail:function(res){
						me.msnCodeBtn = false;// 取消禁用请求验证码按钮
						me.phoneDisable = false;//取消禁用手机号码输入框
						uni.showToast({
							title: '请求失败,请重试',
							icon: "none"
						});
					}
				})
			},
			verifyready: function() {
			},
			verifyerror: function() {
			},
			imgLoad: function(){//图片选择、上传
				// if(!this.hasverifyshow){
				// 	this.verifyshow = true;
				// 	this.hasverifyshow = 1;
				// 	return;
				// }
				if(this.imgPath){
					uni.showToast({
						title: '不可重复上传',
						icon: "none"
					});
					return;
				}
				var me = this;
				uni.chooseImage({
					count: 1,
					sizeType: ["compressed"],
					sourceType: ["album"],
					success(res) {
						uni.showNavigationBarLoading();
						me.tempImgSrc = res.tempFilePaths[0];
						uni.uploadFile({
							url: me.fileUploadUrl, 
							filePath: me.tempImgSrc,
							name: "file",
							formData:{
								token:getApp().globalData.token
							},
							success:(res) =>{
								uni.hideNavigationBarLoading();
								if(res && res.data){
									let obj = JSON.parse(res.data.toString());
									if(obj.code == 0){
										uni.showToast({
											title: '图片上传成功',
											icon: "success"
										});
										me.imgPath = obj.data.src;
									}else{
										uni.showToast({
											title: '图片保存失败',
											icon: "none"
										});
									}
								}else{
									uni.showToast({
										title: '图片上传失败',
										icon: "none"
									});
								}
							},
							fail:(res) =>{
								uni.hideNavigationBarLoading();
								uni.showToast({
									title: '上传失败,网络错误',
									icon: "none"
								});
							}
						});
					}
				})
			},
			videoLoad: function(){//视频选择、上传
				// if(!this.hasverifyshow){
				// 	this.verifyshow = true;
				// 	this.hasverifyshow = 2;
				// 	return;
				// }
				if(this.videoPath){
					uni.showToast({
						title: '不可重复上传',
						icon: "none"
					});
					return;
				}
				var me = this;
				uni.chooseVideo({
					count: 1,
					compressed: true,
					sizeType: ["compressed"],
					sourceType: ["album", 'camera'],
					success(res) {
						uni.showNavigationBarLoading();
						me.tempVideoSrc = res.tempFilePath;
						uni.uploadFile({
							url: me.fileUploadUrl, 
							filePath: me.tempVideoSrc,
							name: "file",
							formData:{
								token:getApp().globalData.token
							},
							success:(res) =>{
								uni.hideNavigationBarLoading();
								if(res && res.data){
									let obj = JSON.parse(res.data.toString());
									if(obj.code == 0){
										me.videoPath = obj.data.src;
										uni.showToast({
											title: '视频上传成功',
											icon: "success"
										});
									}else{
										uni.showToast({
											title: '视频保存失败',
											icon: "none"
										});
									}
								}else{
									uni.showToast({
										title: '视频上传失败',
										icon: "none"
									});
								}
							},
							fail:(res) =>{
								uni.hideNavigationBarLoading();
								uni.showToast({
									title: '上传失败,网络错误',
									icon: "none"
								});
							}
						});
					}
				})
			},
			saveRecord: function(recordPath) {//录音上传
				this.recordPath = recordPath;
				// if(!this.hasverifyshow){
				// 	this.verifyshow = true;
				// 	this.hasverifyshow = 3;
				// 	return;
				// }
				let me = this;
				if(this.recordPath){// 录音
					uni.showNavigationBarLoading();
					me.btnLoading = true;
					uni.uploadFile({
						url:this.fileUploadUrl,
						filePath: this.recordPath,
						name:"file",
						formData:{
							token:getApp().globalData.token
						},
						success: (res) => {
							me.btnLoading = false;
							me.btnDisable = true;
							uni.hideNavigationBarLoading();
							if(res && res.data){
								let obj = JSON.parse(res.data.toString());
								if(obj.code == 0){
									uni.showToast({
										title: '录音上传成功',
										icon: "success"
									});
									me.recordPath = obj.data.src;
									me.btnReco = "录音已上传"
								}else{
									uni.showToast({
										title: '录音保存失败',
										icon: "none"
									});
								}
							}else{
								uni.showToast({
									title: '录音保存失败',
									icon: "none"
								});
							}
						},
						fail:(e)=>{
							me.btnLoading = false;
							me.btnDisable = true;
							uni.hideNavigationBarLoading();
							uni.showToast({
								title: '上传失败,网络错误',
								icon: "none"
							});
						}
					});
				}
			},
			chplxClick: function(){
				if(this.chplxList.length == 0){
					uni.showNavigationBarLoading();
					let me = this;
					uni.request({
						url: me.serverUrl + "/api/wxopcase/dictList?dict_key=CASE_CATEGORY",
						method:"GET",
						header: {
							'content-type': 'application/json;charset=UTF-8'
						},
						success: (result) => {
							uni.hideNavigationBarLoading();
							if(result.data.code == 0){
								me.chplxList = result.data.data;
							}else{
								uni.showToast({
									title: '服务端错误',
									icon: "none"
								});
							}
						},
						fail: (error) => {
							uni.hideNavigationBarLoading();
							uni.showToast({
								title: '网络请求失败',
								icon: "none"
							});
						}
					})
				}
			},
			jjchdClick: function(){
				if(this.jjchdList.length == 0){
					uni.showNavigationBarLoading();
					let me = this;
					uni.request({
						url: me.serverUrl + "/api/wxopcase/dictList?dict_key=CASE_LEVEL",
						method:"GET",
						header: {
							'content-type': 'application/json;charset=UTF-8'
						},
						success: (result) => {
							uni.hideNavigationBarLoading();
							if(result.data.code == 0){
								me.jjchdList = result.data.data;
							}else{
								uni.showToast({
									title: '服务端错误',
									icon: "none"
								});
							}
						},
						fail: (error) => {
							uni.hideNavigationBarLoading();
							uni.showToast({
								title: '网络请求失败',
								icon: "none"
							});
						}
					})
				}
			},
			getPhone: function(e) {
				let num = e.target.value;
				if (num && num.length === 11) {
					this.phoneNum = num;
				}
			},
			getVeri: function(e) {
				if (this.phoneNum != 0) {
					this.verifyshow = true;
				} else {
					uni.showToast({
						title: '手机号码不正确',
						icon: "none"
					});
				}
			},
			verifyInput:function(result){
				// console.log(result.detail.value);
				// console.log(result.target.value);
				if(this.msnCode == result.target.value){
					clearInterval(this.timeoutId);// 取消重新获取验证码计时器
					uni.showToast({
						title: '验证码正确',
						icon: "success"
					});
					// this.phoneDisable = true;//禁用手机号码输入框
					// this.msnCodeBtn = true;// 禁用请求验证码按钮
					this.veriDisable = true;//禁用验证码输入框
				}
			},
			chplxChange: function(e){
				this.chplxIndex = e.detail.value;
			},
			jjchdChange: function(e){
				this.jjchdIndex = e.detail.value;
			},
			formSubmit: function(e) {
				let me = this;
				let userName = e.detail.value.userName;
				if (userName == "") {
					uni.showToast({
						title: '未输入用户名',
						icon: "none"
					});
					return;
				}
				let companyName = e.detail.value.companyName;
				if (companyName == "") {
					uni.showToast({
						title: '未输入公司名',
						icon: "none"
					});
					return;
				}
				let productId = e.detail.value.productId;
				if (productId == "") {
					uni.showToast({
						title: '未输入产品编号',
						icon: "none"
					});
					return;
				}
				let title = e.detail.value.title;
				if (title == "") {
					uni.showToast({
						title: '未输入产品编号',
						icon: "none"
					});
					return;
				}
				this.email = e.detail.value.email;
				let descript = e.detail.value.descript;
				if (descript == "") {
					uni.showToast({
						title: '未输入问题描述',
						icon: "none"
					});
					return;
				}
				if(this.chplxIndex == -1){
					uni.showToast({
						title: '未选择产品类型',
						icon: "none"
					});
					return;
				}
				if(this.jjchdIndex == -1){
					uni.showToast({
						title: '未选择紧急程度',
						icon: "none"
					});
					return;
				}
				let phoneNum = e.detail.value.phoneNum;
				if (!phoneNum) {
					uni.showToast({
						title: '未输入手机号',
						icon: "none"
					});
					return;
				}
				if(phoneNum != this.returnPhone){
					uni.showToast({
						title: '手机号不匹配',
						icon: "none"
					});
					return;
				}
				let veriCode = e.detail.value.veriCode;
				if (!veriCode) {
					uni.showToast({
						title: '未输入验证码',
						icon: "none"
					});
					return;
				}
				if(veriCode != this.msnCode){
					uni.showToast({
						title: '验证码错误',
						icon: "none"
					});
					return;
				}
				// clearInterval(this.timeoutId);// 取消重新获取验证码计时器
				uni.showToast({
					title: '填写完成,提交中',
					icon: "loading"
				});
				// const userType = uni.getStorageSync("userType");
				// let userid = null;
				// if(userType == 'customer'){
				// 	userid = uni.getStorageSync("userid");
				// }
				uni.request({//提交所有键值对
					url: this.saveCase,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						"customerName":userName,
						"categoryId": this.chplxList[this.chplxIndex].dictId,
						"categoryName": this.chplxList[this.chplxIndex].dictName,
						"grade": this.jjchdList[this.jjchdIndex].dictId,
						"title": title,
						"content":descript,
						"productId":productId,
						"companyName":companyName,
						"imageUrl":this.imgPath,
						"videoUrl":this.videoPath,
						"audioUrl":this.recordPath,
						"phoneNum":phoneNum,
						"type":  this.type, //客户5，员工1
						"email":this.email,
						"token":getApp().globalData.token,
						"staffCode": this.staffCodeOrId
					},
					success:(res) =>{
						if(res.data.code == 0){
							uni.showModal({
								cancelText:"复制工单",//最多4个汉字，否则不显示弹窗
								content:'数据提交成功！工单:'+res.data.data.businessKey,
								success(r) {
									if(r.cancel){
										uni.setClipboardData({
											data: res.data.data.businessKey,
											success: function () {
												uni.showToast({
													title: '已复制',
													duration:1000,
													icon: "none"
												});
												setTimeout(()=>{
													uni.navigateBack({
														delta: 1
													})
												},1000);
											}
										});
									}else{
										uni.navigateBack({
											delta: 1
										})
									}
								}
							})
						}else{
							uni.showToast({
								title: '保存失败',
								icon: "none"
							});
						}
					},
					fail: (res) => {
						uni.showToast({
							title: '网络未连接',
							icon: "none"
						});
					}
				})
			}
		}
	}
</script>

<style>
	.content {
		margin-left: 30upx;
		margin-right: 30upx;
		padding-bottom: 80upx;
	}

	.tv-title {
		font-size: 15px;
		color: #262626;
		margin-top: 40upx;
		margin-bottom: 15upx;
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
	
	span {
		color: #d84636;
		margin-right: 3px;
	}
	.tvPicker {
		width: 100%;
		margin-top: 20upx;
		margin-bottom: 20upx;
		display: flex;
		justify-content: space-between;
	}
	.uploadImg{
		width: 160upx;
		height: 160upx;
		background-color: #ffffff;
		border: 1upx  #F7F7F7 solid; 
		box-shadow:0 0 5upx #AAAAAA;
		border-radius: 5upx;
		display: flex; 
		justify-content: center;
	}
	
	.uni-image-close {/* 图形验证码关闭按钮 */
		position: absolute;
		right: 50upx;
		top: -64upx;
	}
	/* wx9464c2ca5ebaa44a */
</style>

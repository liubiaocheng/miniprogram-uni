<template>
	<view>
		<view class="content">
			<view class="verify-img-panel" :style="{width: imgSize.width,height: imgSize.height}">
				<canvas canvas-id="point-code" @touchstart="createPoint($event)" :style="{width:imgSize.width,height:imgSize.height}" />
				<cover-view v-for="(item,index) in checkPosArr" :key='index' v-if="index < num" class="point-on" :style="{top:item.y + 'px',left:item.x + 'px'}">{{index+1}}</cover-view>
				<!-- <cover-image v-if="!refreshButtonHide" @click="refresh" class="verify-refresh" src="/static/verify/refresh.png" /> --> <!-- 刷新按钮 -->
				<image v-if="!refreshButtonHide" @click="refresh" class="verify-refresh" src="/static/verify/fresh.png" />
			</view>
			<view class="verify-bar-area" :style="{width: imgSize.width}">
				<text v-show="checkStatus==-1" class="verify-msg">请顺序点击【{{checkCharString}}】</text>
				<text v-show="checkStatus==0" class="verify-msg-fault">验证失败</text>
				<text v-show="checkStatus==1" class="verify-msg-success">验证成功</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'wyj-text-code',
		props: {
			defaultNum: {
				default: 4, //默认的文字数量 
				type: Number
			},
			checkNum: {
				default: 2,
				type: Number
			},
			backgroundImageArray: {
				default: () => {
					return ['/static/verify/bg-verificode1.jpg']
				},
				type: Array
			},
			imgSize: {
				default: () => {
					return {
						width: '600upx',
						height: '400upx',
					}
				}, 
				type: Object
			}
		},
		data() {
			return {
				ctx: {},
				fontPos: [], //选中的坐标信息
				checkStatus: -1,
				checkCharString: '',
				checkPosArr: [], //用户点击的坐标
				num: 0, //点击的记数
				pointShow: false,
				refreshButtonHide: false,
				checkFault: false,
				fontSizeArr: [
					'italic small-caps bold 16px microsoft yahei',
					'small-caps normal 18px arial',
					'16px microsoft yahei'
				],
				fontStr: '年大业不会个出行作生家成到来部对进多全他公开们时理方实学报用于法高长现本定化加关机分力外区能后就下社过前面也得与说之员务电事可三各好第从平代当天水提商管内小所立入量子度北保心科委术明增基名向由记计强表办条最达革收二并如际及导东比决交南安此结义车然放世间因共步物持无城相村取原处信四军队级联少手权江近认果格几没职服台式样只亿志给难观五协变风批支查张林划争构具百或才必李参引思包极知反么采色打它料率列兴马则节拉直光较线克历占功负财类约纪史示客闻央限米失检九防钱断双让切须儿空你注承铁乐边药爱称届继紧字困刘友显且春居红半充陈阳六太七亲审卫良曾站龙罗习普轻扩仍景止离降训菜眼宁早夫换顾介画综阿遇丰害官听另针洋庆久找晚互汉吸录诉秀顺邓订帮角灾妇杨虽煤笔尼左细右烟玉厅旧艰呼吉男绿季杂皮贡罚曲叶累孙邮偿答怀驻胡守朱械纺灵拓衣析骨档秘宾哪归休肥珠叫寻攻秋昌估册宽末轨涨载杰雪戏辽夺凡冰避珍渐折朋敢弱怕伙餐肯阵婚抽胆灯扣牙宫煌呈伯卢粉妻欠迪昆凤胶慢芳妈谊允淡虎迷贩吧炎刀昨', //不重复的汉字
				img_rand: 0 ,//随机的背景图片
				compareXY: 20,//比较坐标点误差值
				// canvas_show: false,
			};
		},
		mounted() {
			this.init();
			// setTimeout(() => {
			// 	this.canvas_show = true;
			// },1000);
		},
		methods: {
			init() {
				//加载页面
				this.refresh();
				this.$emit('ready');
			},
			color16() { //十六进制颜色随机
				var r = Math.floor(Math.random() * 256).toString(16);
				var g = Math.floor(Math.random() * 256).toString(16);
				var b = Math.floor(Math.random() * 256).toString(16);
				r = r.length == 2 ? r : '0' + r;
				g = g.length == 2 ? g : '0' + g;
				b = b.length == 2 ? b : '0' + b;
				var color = '#' + r + g + b;
				return color;
			},
			pointInit() {
				for (var i = 0; i < this.checkNum; i++) {
					this.checkPosArr.push({ x: 0, y: 0 });
				}
			},
			drawImg(img) {//绘制合成的图片
				this.ctx = uni.createCanvasContext('point-code', this);//准备canvas环境 
				this.ctx.drawImage(img, 0, 0, 300, 200);// 绘制图片
				var fontChars = [];// 绘制水印
				var tmp_index = '';
				for (var i = 1; i <= this.defaultNum; i++) {
					fontChars[i - 1] = this.getChars(this.fontStr, fontChars);//取得文字
					tmp_index = Math.floor(Math.random() * this.fontSizeArr.length);//当前字体样式
					this.ctx.font = this.fontSizeArr[tmp_index];
					this.ctx.fillStyle = this.color16();//当前字体填充色
					var avg = parseInt(parseInt(this.imgSize.width) / 2 / (this.defaultNum + 1));//生成文字坐标
					if (Math.floor(Math.random() * 2) == 1) {
						var tmp_y = Math.floor(parseInt(this.imgSize.height) / 2 / 2) + tmp_index * parseInt(this.imgSize.height) / 2 / 2 / this.defaultNum;
					} else {
						var tmp_y = Math.floor(parseInt(this.imgSize.height) / 2 / 2) - tmp_index * parseInt(this.imgSize.height) / 2 / 2 / this.defaultNum;
					}
					this.ctx.fillText(fontChars[i - 1], avg * i, tmp_y);
					this.fontPos[i - 1] = {
						'char': fontChars[i - 1],
						'x': avg * i,
						'y': tmp_y
					};
					// console.log(this.fontPos[i - 1]);
				}
				this.ctx.draw(true);
				for (var i = 0; i < (this.defaultNum - this.checkNum); i++) {//从生成的文字中取出比对文字
					this.shuffle(this.fontPos).pop();
				}
				var msgStr = '';
				for (var i = 0; i < this.fontPos.length; i++) {
					msgStr += this.fontPos[i].char + ',';
				}
				this.checkCharString = msgStr.slice(0, -1);
				return this.fontPos;
			},
			getChars(fontStr, fontChars) {//递归去重
				var tmp_rand = parseInt(Math.floor(Math.random() * fontStr.length));
				if (tmp_rand > 0) {
					tmp_rand = tmp_rand - 1;
				}
				let tmp_char = fontStr.charAt(tmp_rand);
				if (fontChars.indexOf(tmp_char) == -1) {
					return tmp_char;
				} else {
					return this.getChars(fontStr, fontChars);
				}
			},
			shuffle(arr) {//洗牌数组
				var m = arr.length, i;
				while (m) {
					i = (Math.random() * m--) >>> 0;
					[arr[m], arr[i]] = [arr[i], arr[m]];
				}
				return arr;
			},
			createPoint(e) {//创建坐标点并进行对比
				if (this.checkStatus == 1) {
					return;
				}
				if (this.num >= this.checkNum) {
					return;
				}
				this.checkPosArr[this.num] = e.touches[0];
				this.num += 1;
				if (this.num == this.checkNum) {
					setTimeout(() => {
						var flag = this.comparePos(this.fontPos, this.checkPosArr);
						if (flag == false) { //验证失败
							this.checkStatus = 0;
							this.$emit('error');//调用用户定义的失败方法
							this.refresh();
							setTimeout(() => {
								this.checkStatus = -1;
							}, 1000);
						} else { //验证成功
							this.checkStatus = 1;
							this.refreshButtonHide = true;
							setTimeout(() => this.$emit('success'), 1500);
						}
					}, 400);
				}
			},
			comparePos(fontPos, checkPosArr) {//比对坐标点 所有验证项目对比完成
				var flag = true;
				for (var i = 0; i < fontPos.length; i++) {
					if (!(parseInt(checkPosArr[i].x) + this.compareXY > fontPos[i].x && parseInt(checkPosArr[i].x) - this.compareXY < fontPos[i].x && parseInt(checkPosArr[i].y) + this.compareXY > fontPos[i].y && parseInt(checkPosArr[i].y) - this.compareXY < fontPos[i].y)) {
						flag = false;
						break;
					}
				}
				return flag;
			},
			refresh() {//刷新
				this.fontPos = []; //文字的坐标信息
				this.num = 0; //点击的记数
				this.pointInit();
				this.img_rand = Math.floor(Math.random() * this.backgroundImageArray.length); //随机的背景图片
				var img = this.backgroundImageArray[this.img_rand];
				this.fontPos = this.drawImg(img);
			},
		}
	}
</script>
<style>
	.content {
		width: 750upx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.verify-bar-area {/* 底部文字提示 */
		margin: 10upx 0 0 0;
		background: linear-gradient(180deg, #fff 0, #ebedf0 87%);
		padding: 0 20upx 0 20upx;
		display: flex;
		justify-content: center;
		height: 60upx;
		border-radius: 20upx;
		font-size: 16px;
	}

	.verify-bar-area .verify-move-block {
		position: absolute;
		top: 0px;
		left: 0;
		background: #fff;
		cursor: pointer;
		-webkit-box-sizing: content-box;
		-moz-box-sizing: content-box;
		box-sizing: content-box;
		box-shadow: 0 0 2px #888888;
		-webkit-border-radius: 1px;
	}

	.verify-bar-area .verify-move-block:hover {
		background-color: #337ab7;
		color: #FFFFFF;
	}

	.verify-bar-area .verify-left-bar {
		position: absolute;
		top: -1px;
		left: -1px;
		background: #f0fff0;
		cursor: pointer;
		-webkit-box-sizing: content-box;
		-moz-box-sizing: content-box;
		box-sizing: content-box;
		border: 1px solid #ddd;
	}

	.verify-img-panel {
		-webkit-box-sizing: content-box;
		-moz-box-sizing: content-box;
		box-sizing: content-box;
		border-radius: 20upx;
		position: relative;
	}
	
	/* .canvas-style{
		background-color: #007AFF;
		border-radius: 30upx;
	} */

	.verify-img-panel .verify-refresh {
		width: 50upx;
		height: 50upx;
		text-align: center;
		padding: 20upx;
		cursor: pointer;
		position: absolute;
		top: -90upx;
		right: 30upx;
		/* background-color: #007AFF; */
	}

	.verify-img-panel .icon-refresh {
		font-size: 20px;
		color: #fff;
	}

	.verify-img-panel .verify-gap {
		background-color: #fff;
		position: relative;
		border: 1px solid #fff;
	}

	.verify-bar-area .verify-move-block .verify-sub-block {
		position: absolute;
		text-align: center;
		border: 1px solid #fff;
	}

	.verify-bar-area .verify-move-block .verify-icon {
		font-size: 18px;
	}

	.verify-bar-area .verify-msg {
	}

	.verify-bar-area .verify-msg-fault {
		color: #f0ad4e;
	}

	.verify-bar-area .verify-msg-success {
		color: #4cd964;
	}

	.point-on {
		background-color: #00EE00; /* #1abd6c; */
		color: #fff;
		width: 30upx;
		height: 30upx;
		padding: 5upx;
		text-align: center;
		line-height: 30upx;
		border-radius: 50%;
		position: absolute;
		display: flex;
		justify-content: center;
	}
</style>

<template>
	<view>
		<jyf-parser :html="contenData"></jyf-parser>
	</view>
</template>

<script>
	// import parser from "@/components/jyf-parser/jyf-parser"
	export default {
		// components: {
		// 	"jyf-parser": parser
		// },
		data() {
			return {
				contenData: '<p><span style="font-size: 24px;">天翼云管理平台上如何新增端口？</span></p><p style="text-indent: 2em; margin-top: 15px;">答：依次点击【控制中心】【访问控制】【安全组】，点击对应的安全组，在【入方向规则】中点击【添加规则】，在【端口】中输入22或3000，点击【确定】即可。若没有关联云服务器，可在【关联实例】中【添加】相应的云服务器。如下图所示：</p><p style="text-indent: 2em; margin-top: 15px;"><br/></p><p style="text-align:center"><img src="http://img95.699pic.com/photo/50029/5648.jpg_wh300.jpg" width="450" height="300" title="" alt=""/></p><p style="text-align: center;">图1.2.1访问安全组</p><p><br/></p><p style="text-align:center"><img src="http://img95.699pic.com/photo/50029/5648.jpg_wh300.jpg" width="450" height="300" title="" alt=""/></p><p style="text-align: center;">图1.2.2添加入方向规则</p><p><br/></p><p style="text-align:center"><img src="http://img95.699pic.com/photo/50029/5648.jpg_wh300.jpg" width="450" height="300" title="" alt=""/></p><p style="text-align: center;">图1.2.3添加端口</p><p><br/></p><p>注意: 云管家需要添加 TCP 22 和 TCP 3000两个端口</p><p><br/></p>'
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>

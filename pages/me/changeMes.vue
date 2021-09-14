<template>
	<view class="content">
		<form @submit="formSubmit">
			<view class="tv-title">{{name}}:</view>
			<input v-if="id ==6" name="val" type="number" placeholder="请输入" @input="onKeyValInput" maxlength=11 confirm-type="next" confirm-hold="true" class="input-style" />
			<input v-if="id ==7" name="val" type="number" placeholder="请输入" @input="onKeyValInput" maxlength=18 confirm-type="next" confirm-hold="true" class="input-style" />
			<input name="val" v-if="id !=6 && id !=7" placeholder="请输入" @input="onKeyValInput" maxlength=25 confirm-type="next" confirm-hold="true" class="input-style" />
		</form>
	</view>


</template>

<script>
	export default {
		data() {
			return {
				name: "",
				id: 0,
				val: ""
			}
		},

		onLoad(e) {
			this.name = e.name
			this.id = e.id
			
		},
		methods: {
			onKeyValInput: function(event) {
				let me = this;
				this.val = event.target.value
				var pages = getCurrentPages()
				var prevPage = pages[pages.length - 2]
				prevPage.backVal = me.val
				prevPage.idex = me.id
			},
			
		}
	}
</script>

<style>
	.content {
		margin-left: 30upx;
		margin-right: 30upx;
		padding-bottom: 80upx;
	}

	.title-view {
		font-size: 38upx;
		color: #262626;
		margin-top: 40upx;
		margin-bottom: 15upx;
	}

	.input-style {
		height: 50upx;
		padding: 15upx 25upx;
		line-height: 50upx;
		font-size: 30upx;
		flex: 1;
		border: 1upx solid #AAAAAA;
		box-shadow: 0 0 1upx #AAAAAA;
	}
</style>

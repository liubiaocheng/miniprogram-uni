import Vue from 'vue'
import App from './App'
// API文档： http://59.36.147.90:8888/api/atomops-service/swagger-ui.html#!/235673124324207case2354525509
Vue.config.productionTip = false
Vue.prototype.serverUrl = "https://www.ywglapp.com/api/atomops-service";	
// Vue.prototype.serverUrl = "http://192.168.1.112:8062/atomops-service";	
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

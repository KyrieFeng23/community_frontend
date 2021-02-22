import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//Buefy
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

//ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/app.css'
//之前忘记加/format了
import format  from 'date-fns/format'
import '@/permission'
import relativeTime from 'dayjs/plugin/relativeTime';
//国际化
import 'dayjs/locale/zh-cn'
const dayjs = require('dayjs');

//相对时间插件
dayjs.extend(relativeTime)

dayjs.locale('zh-cn') //use local globally
dayjs().locale('zh-cn').format()   //use local in a specific instance

Vue.prototype.dayjs = dayjs //可以全局使用dayjs

//定义一个名字为date的过滤器，可以把传进来的date数据进行格式化
Vue.filter('date', (date) => {
  return format(new Date(date), 'yyyy-MM-dd')
})

Vue.use(Buefy);
Vue.use(ElementUI);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

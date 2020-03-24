import Vue from 'vue';
import App from './App.vue';
import './plugins/echarts';

new Vue({
  render: (h) => h(App),
}).$mount('#root');

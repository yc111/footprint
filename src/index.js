import Vue from 'vue';
import store from './store';
import App from './App.vue';
import './plugins/echarts';

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#root');

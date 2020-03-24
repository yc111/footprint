import Vue from 'vue';
import store from './store';
import App from './App.vue';
import './plugins/echarts';
import './plugins/basic';

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#root');

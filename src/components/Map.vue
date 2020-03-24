<template>
    <div>
      <div class='chartsWrapper' :style='style' id='map'></div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import FillAreaLayer from './mapLayer/fillAreaLayer';
import rawData from '../config/place.config';
import handleData from '../utils/handleData';
import util from '../utils/util';
import getMapSourceName from '../utils/getMapSourceName';

const cache = [];

export default {
  name: 'Map',
  data() {
    return {
      layerInstance: {},
      areaName: 'World',
      mapName: 'world',
      names: [],
      style: '',
    };
  },
  computed: {
    ...mapState(['geoData']),
    chartInstance() {
      return this.$echarts.init(document.getElementById('map'));
    },
  },
  watch: {
    // geoData(newData) {
    //   console.log(newData);
    // },
  },
  methods: {
    resize() {
      this.style = `height: ${window.innerHeight - 40}px`;
      this.chartInstance.resize();
    },
    async initChart() {
      const { userData, countList } = handleData(rawData);

      if (!cache['assets/world.json']) {
        this.chartInstance.showLoading();
        cache['assets/world.json'] = await util.get('assets/world.json');
        this.chartInstance.hideLoading();
      }
      this.names.push(this.mapName);
      this.layerInstance.fillAreaLayer = new FillAreaLayer(
        this.chartInstance,
        this.areaName,
        this.names,
        cache['assets/world.json'],
        countList,
        userData,
      );
    },
    async updateChart(args) {
      // 世界地图，特殊处理
      if (args[0].name.toLowerCase() === 'world') {
        this.names = this.names.slice(0, 1);
      } else {
        const mapSource = getMapSourceName(args[0].name);

        // 没有地图资源，提示一下地名
        if (!mapSource) {
          this.$toast({
            type: 'warning',
            msg: args[0].name,
            position: 'bottom-left',
          });
          return;
        }

        // 区域已经加载过，删掉区域的所有下级
        if (this.names.includes(mapSource.sourceName)) {
          this.names = this.names.slice(0, mapSource.level + 1);
        } else {
          // 否则添加/替换该区域
          this.areaName = args[0].name;
          this.mapName = mapSource.sourceName;
          this.names[mapSource.level] = mapSource.sourceName;
        }
      }
      const path = `assets/${this.names.join('/')}.json`;

      // 缓存，优化性能
      if (!cache[path]) {
        this.chartInstance.showLoading();
        cache[path] = await util.get(path);
        this.chartInstance.hideLoading();
      }
      this.layerInstance.fillAreaLayer.updateMap(
        this.chartInstance, this.areaName, this.names, cache[path],
      );
    },
  },
  mounted() {
    this.initChart();
    this.chartInstance.on('click', (...args) => {
      if (this.layerInstance.fillAreaLayer) {
        this.updateChart(args);
      }
    });
    window.addEventListener('resize', this.resize);
  },
  destroyed() {
    window.removeEventListener('resize', this.resize);
  },
};
</script>

<style scoped lang='scss'>
.chartsWrapper {
    width: 80%;
    min-width: 800px;
    min-height: 680px;
    margin: 0 auto;
    margin-top: 30px;
}
</style>

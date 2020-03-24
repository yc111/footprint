<template>
    <div>
      <div class='chartsWrapper' id='map'></div>
    </div>
</template>

<script>
import FillAreaLayer from './mapLayer/fillAreaLayer';
import rawData from '../config/place.config';
import handleData from '../utils/handleData';
import util from '../utils/util';
import getMapSourceName from '../utils/getMapSourceName';

export default {
  name: 'Map',
  data() {
    return {
      layerInstance: {},
      mapName: 'world',
      names: [],
    };
  },
  computed: {
    chartInstance() {
      return this.$echarts.init(document.getElementById('map'));
    },
  },
  methods: {
    initChart() {
      const { userData, countList } = handleData(rawData);

      this.chartInstance.showLoading();
      util.get('assets/world.json').then((geoData) => {
        this.chartInstance.hideLoading();

        this.names.push(this.mapName);
        this.layerInstance.fillAreaLayer = new FillAreaLayer(
          this.chartInstance,
          this.mapName,
          geoData,
          countList,
          userData,
        );
      });
    },
    updateChart(args) {
      const mapSource = getMapSourceName(args[0].name);

      if (!mapSource) {
        return;
      }
      if (this.names.includes(mapSource.sourceName)) {
        return;
      }

      this.mapName = mapSource.sourceName;
      this.names[mapSource.level] = mapSource.sourceName;
      const path = `assets/${this.names.join('/')}.json`;

      this.chartInstance.showLoading();
      util.get(path).then((geoData) => {
        this.chartInstance.hideLoading();
        this.layerInstance.fillAreaLayer.updateMap(this.chartInstance, this.mapName, geoData);
      });
    },
  },
  mounted() {
    this.initChart();
    this.chartInstance.on('click', (...args) => {
      if (this.layerInstance.fillAreaLayer) {
        this.updateChart(args);
      }
    });
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

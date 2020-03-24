import * as echarts from 'echarts/lib/echarts';
import worldGeo from '../../assets/world.json';

class FillAreaLayer {
  constructor(chart, mapName, geoData, pieData, mapData) {
    this.chart = chart;
    this.mapName = mapName;
    this.geoData = geoData;
    this.pieData = pieData;
    this.mapData = mapData;
    const color = ['#79b685', '#a7c69d', '#fee090', '#eee']; // '#305f3e',

    const title = {
      text: "PLACES I'V BEEN TO.",
      subtext: '环游世界',
      sublink: '',
      left: 'left',
      textStyle: {
        fontWeight: 'bolder',
        fontSize: 24,
      },
    };

    const tooltip = {
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2,
      formatter: (params) => {
        if (params.data) {
          const seriesName = params.data.tag;
          return `${params.name}<br />${seriesName}`;
        }
        return '';
      },
    };

    const legend = {
      data: ['经常去', '去过几次', '去过一次', '没去过'],
      align: 'left',
      left: 0,
      top: 60,
      icon: 'pin',
    };

    const visualMap = {
      left: 'right',
      min: 0,
      max: 100,
      seriesIndex: '1',
      inRange: {
        color: ['#ebedf0', '#fee090', '#3eaf7c'],
      },
      text: ['High', 'Low'],
      calculable: true,
    };

    const toolbox = {
      show: true,
      left: 300,
      top: 'top',
      itemGap: '30',
      feature: {
        saveAsImage: {},
      },
    };

    const pieSeries = {
      type: 'pie',
      zLevel: 1,
      center: [60, 200],
      radius: ['10%', '15%'],
      tooltip: {
        formatter: (params) => `${params.percent}%`,
      },
      label: {
        normal: {
          show: false,
          position: 'center',
        },
        emphasis: {
          show: true,
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { name: '经常去', value: pieData.uCount },
        { name: '去过几次', value: pieData.aCount },
        { name: '去过一次', value: pieData.oCount },
        { name: '没去过', value: pieData.nCount },
      ],
    };

    const mapSeries = {
      type: 'map',
      name: mapName,
      map: mapName,
      color: ['transparent'],
      tooltip,
      roam: true,
      scaleLimit: {
        max: 4,
        min: 1,
      },
      itemStyle: {
        emphasis: { label: { show: true } },
        areaColor: '#fff',
      },
      data: this.mapData,
    };

    this.option = {
      color,
      title,
      legend,
      tooltip: {},
      visualMap,
      toolbox,
      series: [pieSeries, mapSeries],
      // series: {
      //     name: 'china',
      //     type: 'map',
      //     map: 'china'
      // },
    };

    echarts.registerMap(this.mapName, worldGeo);
    this.render(this.chart, this.option);

    this.chart.on('legendselectchanged', (params) => {
      const o = this.option;
      o.series[1].data = this.filterMap(this.mapData, params);
      this.chart.setOption(o);
    });
  }

  filterMap(userData, param) {
    const temp = param.selected;
    const selects = [];
    for (const key in temp) {
      if (temp[key]) {
        selects.push(key);
      }
    }
    return userData.filter((item) => selects.includes(item.tag));
  }

  render(chart, option) {
    console.log('render');
    chart.setOption(option);
  }

  updatePie(chart, pieData) {
    this.option.series[0].data = [
      { name: '经常去', value: pieData.uCount },
      { name: '去过几次', value: pieData.aCount },
      { name: '去过一次', value: pieData.oCount },
      { name: '没去过', value: pieData.nCount },
    ];
    chart.setOption(this.option);
  }

  updateMap(chart, areaName, geoData) {
    echarts.registerMap(areaName, geoData);
    chart.clear();
    this.option.title.subtext = areaName;
    this.option.series[1].name = areaName;
    this.option.series[1].map = areaName;
    chart.setOption(this.option);
  }
}

export default FillAreaLayer;

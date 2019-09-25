// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/map');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/visualMap');
require('echarts/lib/component/legend');

const NEVER = 0;
const ONECE = 40;
const AFEWTIMES = 75;
const USUALLY = 90;
const LEBEL_COLOR = '#305f3e';

const legendData = ['经常去', '去过几次', '去过一次', '没去过'];

let allprovinceData = [
    { name: "黑龙江", value: NEVER },
    { name: "吉林", value: NEVER },
    { name: "辽宁", value: NEVER },
    { name: "上海", value: AFEWTIMES },
    { name: "江苏", value: USUALLY },
    { name: "浙江", value: USUALLY },
    { name: "安徽", value: AFEWTIMES },
    { name: "福建", value: NEVER },
    { name: "江西", value: AFEWTIMES },
    { name: "山东", value: AFEWTIMES },
    { name: "台湾", value: ONECE },
    { name: "北京", value: AFEWTIMES },
    { name: "天津", value: ONECE },
    { name: "山西", value: NEVER },
    { name: "河北", value: NEVER },
    { name: "内蒙古", value: NEVER },
    { name: "河南", value: USUALLY },
    { name: "湖北", value: AFEWTIMES },
    { name: "湖南", value: USUALLY },
    { name: "广东", value: USUALLY },
    { name: "广西", value: NEVER },
    { name: "海南", value: ONECE },
    { name: "香港", value: AFEWTIMES },
    { name: "澳门", value: ONECE },
    { name: "重庆", value: ONECE },
    { name: "四川", value: AFEWTIMES },
    { name: "贵州", value: NEVER },
    { name: "云南", value: ONECE },
    { name: "西藏", value: NEVER },
    { name: "陕西", value: ONECE },
    { name: "甘肃", value: AFEWTIMES },
    { name: "青海", value: AFEWTIMES },
    { name: "宁夏", value: NEVER },
    { name: "新疆", value: NEVER },
    { name: "南海诸岛", value: NEVER }
];

let series = [];
let never = [];
let onece = [];
let afewtimes = [];
let usually = [];

let handleData = function (rowData) {
    rowData.forEach(item => {
        if (item.value !== NEVER) {
            item.label = { show: true, color: LEBEL_COLOR }
        }
        if (item.value === NEVER) {
            never.push(item);
        } else if (item.value === ONECE) {
            onece.push(item);
        } else if (item.value === AFEWTIMES) {
            afewtimes.push(item);
        } else {
            usually.push(item);
        }
    });
    series = [usually, afewtimes, onece, never].map((item, index) => {
        let temp = {
            type: 'map',
            map: 'china',
            roam: true,
            itemStyle: {
                emphasis: { label: { show: true } },
                areaColor: '#fff'
            },
            // markPoint: {
            //     symbol: 'pin',
            //     symbolSize: 10,
            //     data: []
            // }
        };
        temp.name = legendData[index];
        temp.data = item;
        return temp;
    })
    // console.log(series);
}

handleData(allprovinceData);

export default function App () {
    let myChart = echarts.init(document.getElementById('root'));
    myChart.showLoading();
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let chinaJson = xhr.responseText;
    
                myChart.hideLoading();
                echarts.registerMap('china', chinaJson, {})
    
                // 指定图表的配置项和数据
                let option = {
                    color: ['#79b685', '#a7c69d', '#fee090', '#eee'],
                    title: {
                        text: "PLACES I'V BEEN TO.",
                        subtext: "",
                        sublink: "",
                        left: "middle",
                        textStyle: {
                            fontWeight: 'bolder',
                            fontSize: 24
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        showDelay: 0,
                        transitionDuration: 0.2,
                        // formatter: function(params) {
                        //     // console.log(params); 
                        //     return params.name + '<br />' + params.seriesName
                        // }
                    },
                    legend: {
                        data: legendData,
                        align: 'left',
                        left: 10,
                        icon: 'pin'
                    },
                    visualMap: {
                        left: 'right',
                        min: 0,
                        max: 100,
                        // inRange: {
                        //     color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                        // }, 
                        // inRange: {
                        //     color: ['#eee', '#ebedf0', '#fee090','#cce295', '#ade9ac', '#5fac80','#3eaf7c']//, '#305f3e'
                        // }, 
                        inRange: {
                            color: ['#ebedf0', '#fee090', '#3eaf7c']//, '#305f3e'
                        },
                        text: ['High', 'Low'],
                        calculable: true
                    },
                    toolBox: {
                        show: true,
                        left: 'left',
                        top: 'top',
                        feature: {
                            dataView: { readOnly: false },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    series: series
    
                    // series: {
                    //     name: '中国',
                    //     type: 'map',
                    //     map: 'china',
                    //     roam: true,
                    //     itemStyle: {
                    //         emphasis: { label: { show: true } }
                    //     },
                    //     data: allprovinceData,
                    // }
                };
    
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
    
                // myChart.setOption({
                //     series: {
                //         name: 'china',
                //         type: 'map',
                //         map: 'china'
                //     }
                // })
            }
        }
    }
    xhr.open('GET', 'assets/china.json', false);
    xhr.send(null);

}
// 按需引入 ECharts 模块
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/map';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import Util from './Util';
import kingdomData from '../config/kingdoms';
import chinaProviceData from '../config/china.province';
import areaNamePinyins from '../config/china.cityies';
import userData from '../config/place.config';

const util = new Util();
let mapName = 'world';
let names = [];
const legendData = ['经常去', '去过几次', '去过一次', '没去过'];

const NEVER = 0;
const ONECE = 40;
const AFEWTIMES = 75;
const USUALLY = 90;
const FREQUENCY = [NEVER, ONECE, AFEWTIMES, USUALLY];
const LEBEL_COLOR = '#305f3e';
let nCount = 0;
let oCount = 0;
let aCount = 0;
let uCount = 0;

// 处理用户数据
let handleData = function (rowData) {
    rowData.forEach(item => {
        item.value = FREQUENCY[item.degree]
        if (item.value !== NEVER) {
            item.label = { show: true, color: LEBEL_COLOR }
        }
        if(item.value === NEVER) {
            item.tag = legendData[3];
            nCount ++;
        }else if(item.value === ONECE) {
            item.tag = legendData[2];
            oCount ++;
        }else if(item.value === AFEWTIMES) {
            item.tag = legendData[1];
            aCount ++;
        }else {
            item.tag = legendData[0];
            uCount ++;
        }
    });
}

handleData(userData);

// 获取地图名称
let getMapName = (areaName, source) => {
    try{
        let {name, map: mapName} = source.find(item => {
            return item.name === areaName
        })
        return mapName;
    }catch{
        console.log(`Could'nt find "${areaName}".`); 
        return undefined;
    }
}

/**
 * 获取各map请求路径
 * @param {String} kName : 国家
 * @param {String} pName : 省
 * @param {String} cName : 市
 */
let getMapPath = function(world, kName, pName, cName) {
    try{
        if(cName) {
            return `assets/${world}/${kName}/${pName}/${cName}.json`;
        }
        if(pName) {
            return `assets/${world}/${kName}/${pName}.json`;
        }
        return `assets/${world}/${kName}.json`;
    }catch{
        throw new Error(`没有相应数据："${kName}/${pName}/${cName}"`);
    }
}

let _color = ['#79b685', '#a7c69d', '#fee090', '#eee']; //'#305f3e', 
let _title = {
    text: "PLACES I'V BEEN TO.",
    subtext: "环游世界",
    sublink: "",
    left: "left",
    textStyle: {
        fontWeight: 'bolder',
        fontSize: 24
    }
};
let _tooltip = {
    trigger: 'item',
    showDelay: 0,
    transitionDuration: 0.2,
    formatter: (params) => {
        let seriesName = params.data.tag;
        return params.name + '<br />' + seriesName
    }
};
let _legend = {
    data: legendData,
    align: 'left',
    left: 0,
    top: 60,
    icon: 'pin'
};
let _visualMap = {
    left: 'right',
    min: 0,
    max: 100,
    seriesIndex:'1',
    inRange: {
        color: ['#ebedf0', '#fee090', '#3eaf7c']
    }, 
    text: ['High', 'Low'],
    calculable: true
};
let _toolbox = {
    show: true,
    left: 'left',
    left: 300,
    top: 'top',
    itemGap: '30',
    feature: {
        saveAsImage: {}
    }
};
let options = {
    color: _color,
    title: _title,
    legend: _legend,
    tooltip: {},
    visualMap: _visualMap,
    toolbox: _toolbox,
    series: [
        {
            type: 'pie',
            zLevel: 1,
            center: [60, 200],
            radius: ['10%', '15%'],
            tooltip: {
                formatter: (params) => {
                    return params.percent + '%'
                }
            },
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                }
            },
            labelLine: {
                show: false
            },
            data: [
                {name: '经常去', value: uCount},
                {name: '去过几次', value: aCount},
                {name: '去过一次', value: oCount},
                {name: '没去过', value: nCount}
            ]
        }, 
        {
            type: 'map',
            name: mapName,
            map: mapName,
            color: ['transparent'],
            // tooltip: _tooltip,
            roam: true,
            scaleLimit: {
                max: 4,
                min: 1
            },
            itemStyle: {
                emphasis: { label: { show: true } },
                areaColor: '#fff'
            },
            data: userData
        }
    ],
    // series: {
    //     name: 'china',
    //     type: 'map',
    //     map: 'china'
    // },
};

const initOptions = () => {
    return options;
}

const filterMap = (param) => {
   let temp = param.selected;
   let selects = [];
    for(let key in temp) {
        if(temp[key]) {
            selects.push(key)
        }
    }
    return userData.filter((item) => {
        return selects.includes(item.tag); 
    })
}

export default function App() {
    let myChart = echarts.init(document.getElementById('root'));
    myChart.showLoading();

    util.get(`assets/${mapName}.json`).then(data => {
        let mapJson = data;
        names.push(mapName);
        myChart.hideLoading();
        echarts.registerMap(mapName, mapJson, {})

        // option.series[1][data] = userData;
        let o = initOptions();
        myChart.setOption(o);

    }).catch(e => {
        console.log('error:' + e);
    })

    myChart.on('click', function () {
        // console.log(arguments)
        const areaName = arguments[0].name;
        // console.log(areaName);

        const kName = getMapName(areaName, kingdomData);
        const pNamePinyin = getMapName(areaName, chinaProviceData);
        const cNamePinyin = areaNamePinyins[areaName];

        if (kName) {
            if(!names.includes(kName)) {
                names.push(kName);
            }
        } else if (pNamePinyin) {
            if(!names.includes(pNamePinyin)) {
                names.push(pNamePinyin);
            }
        } else {
            if (cNamePinyin) {
                if(!names.includes(pNamePinyin)) {
                    names.push(cNamePinyin);
                }
            } else {
                return;
            }
        } 

        const path = getMapPath(...names);
        // console.log(names);
        // console.log(path)

        util.get(path).then(data => {
            myChart.hideLoading();

            let mapJson = data;
            echarts.registerMap(areaName, mapJson, {})

            // 刷新图表
            myChart.clear();
            let o = initOptions();
            o.title.subtext = areaName;
            o.series[1].name = areaName;
            o.series[1].map = areaName;
            myChart.setOption(o);
        })
    })

    myChart.on('legendselectchanged', function(params) {
        let o = initOptions();
        o.series[1].data = filterMap(params);
        myChart.setOption(o);
    })
}
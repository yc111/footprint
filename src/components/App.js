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
import chinaProviceData from '../config/china.province';
import areaNamePinyins from '../config/china.cityies';
import userData from '../config/place.config';

const util = new Util();
let mapName = 'china';
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

let getPName = (pName) => {
    try{
        let {name, map : pMap} = chinaProviceData.find(item => {
            return item.name === pName
        })
        return pMap;
    }catch{
        console.log(`"${pName}"`); //不是省
        return undefined;
    }
}

/**
 * 获取各map请求路径
 * @param {String} kName : 国家
 * @param {String} pName : 省
 * @param {String} cName : 市
 */
let getMapPath = function(kName, pName, cName) {
    try{
        if(cName) {
            return `assets/${kName}/${pName}/${cName}.json`;
        }
        return `assets/${kName}/${pName}.json`;
    }catch{
        throw new Error(`没有相应数据："${kName}/${pName}/${cName}"`);
    }
}

let _color = ['#79b685', '#a7c69d', '#fee090', '#eee']; //'#305f3e', 
let _title = {
    text: "PLACES I'V BEEN TO.",
    subtext: "走遍中国",
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

// 初始化配置
let option = {
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
            center: [80, 200],
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
            tooltip: _tooltip,
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

    util.get(`assets/china.json`).then(data => {
        let chinaJson = data;
        names.push(mapName);
        myChart.hideLoading();
        echarts.registerMap(mapName, chinaJson, {})

        // option.series[1][data] = userData;

        myChart.setOption(option);

    }).catch(e => {
        console.log('error:' + e);
    })

    myChart.on('click', function () {
        // console.log(arguments)
        const areaName = arguments[0].name;
        // console.log(areaName);

        const pNamePinyin = getPName(areaName);
        if (pNamePinyin) {
            names.push(pNamePinyin);
        } else {
            const cNamePinyin = areaNamePinyins[areaName];
            if(cNamePinyin) {
                names.push(cNamePinyin);
            }
        }

        const path = getMapPath(...names);
        // console.log(names);
        // console.log(path)

        util.get(path).then(data => {
            myChart.hideLoading();

            let chinaJson = data;
            echarts.registerMap(areaName, chinaJson, {})

            // 指定图表的配置项和数据
            let option = {
                series: {
                    name: areaName,
                    type: 'map',
                    map: areaName
                }
            };

            // 刷新图表
            myChart.clear();
            myChart.setOption(option);
        })
    })

    myChart.on('legendselectchanged', function(params) {
        option.series[1].data = filterMap(params);
        myChart.setOption(option);
    })
}
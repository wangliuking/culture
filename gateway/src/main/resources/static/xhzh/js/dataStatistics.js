
if (!("xh" in window)) {
    window.xh = {};
};

toastr.options = {
    "debug" : false,
    "newestOnTop" : false,
    "positionClass" : "toast-top-center",
    "closeButton" : true,
    /* 动态效果 */
    "toastClass" : "animated fadeInRight",
    "showDuration" : "300",
    "hideDuration" : "1000",
    /* 消失时间 */
    "timeOut" : "1000",
    "extendedTimeOut" : "1000",
    "showMethod" : "fadeIn",
    "hideMethod" : "fadeOut",
    "progressBar" : true,
};

var frist = 0;
var appElement = document.querySelector('[ng-controller=xhcontroller]');
var structure;
xh.load = function() {
    var app = angular.module("app", []);

    app.filter('upp', function() { //可以注入依赖
        return function(text) {
            if(text=="" || text==null)
                return "";
            else
                return parseFloat(text);
        };
    });

    var pageSize = $("#page-limit").val();
    app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);
    app.controller("xhcontroller", function($scope,$http,$location) {
        var pageSize = "";
        $scope.count = "15";//每页数据显示默认值
        $scope.businessMenu=true; //菜单变色

        //判断是否登录start
        $.ajax({
            type: 'GET',
            url: "../../getLoginUser",
            async: false,
            dataType: 'json',
            success: function(response){
                structure = response.structure;
                deviceForMonth();
                $http.get("../../total/selectSiteAllInfo?structure="+structure).
                success(function(data){
                    console.log(data);
                    var a = data.rtuNum-data.rtuOffNum-data.rtuWarningNum;
                    var b = data.rtuWarningNum;
                    var c = data.rtuOffNum;
                    var x = data.spdNum+data.etcrNum+data.lightningNum+data.staticNum+data.rswsNum+data.svtNum+data.hcNum+data.strayNum+data.catNum-data.deviceWarningCount-data.deviceOffCount;
                    var y = data.deviceWarningCount;
                    var z = data.deviceOffCount;
                    rtuForBar(a,b,c);
                    deviceForBar(x,y,z);
                    deviceForType(data);
                });

                $http.get("../../connect/selectAllSite?structure="+structure).
                success(function(param){
                    console.log(param.items);
                    var arr = param.items;
                    var a = 0;
                    var b = 0;
                    var c = 0;
                    for(var i = 0; i < arr.length; i++){
                        if(arr[i].status == 0){
                            a++;
                        }else if(arr[i].status == 2){
                            b++;
                        }else if(arr[i].status == 1){
                            c++;
                        }
                    }
                    siteForBar(a,b,c);
                });

                $http.get("../../total/deviceTotalByProvince?structure="+structure).
                success(function(data){
                    deviceForNum(data);
                });
            } ,
            error: function () {
                alert("登录已失效，请重新登录！");
                window.location.href = "../login.html";
                window.parent.location.href = "../login.html";
            }
        });
        //判断是否登录end


        /* 刷新数据 */
        $scope.refresh = function() {
            $scope.search(1);
        };


    });

};

// 刷新数据
xh.refresh = function() {
    var $scope = angular.element(appElement).scope();
    // 调用$scope中的方法
    $scope.refresh();
};

//站点统计图
function siteForBar(a,b,c) {
    // 基于准备好的dom，初始化echarts实例 macarons
    var myChart = echarts.init(document.getElementById('siteForBar'));
    myChart.showLoading();

    var total = parseInt(a)+parseInt(b)+parseInt(c);
    // 指定图表的配置项和数据
    var option = {
        color:['#00CD66', '#EEAD0E','#DCDCDC'],
        title : {
            text: '站点统计情况 \n 总数：'+total,
            textStyle: {
                color : 'black'
            },
            //subtext: '总数：'+total,
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            textStyle : {
                color : 'black'
            },
            orient: 'vertical',
            left: 'left',
            data: ['站点正常','站点异常','站点离线']
        },
        series : [
            {
                textStyle : {
                    color : 'black'
                },
                name: '统计数量',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:a, name:'站点正常'},
                    {value:b, name:'站点异常'},
                    {value:c, name:'站点离线'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    myChart.hideLoading();

}

//rtu统计图
function rtuForBar(a,b,c) {
    // 基于准备好的dom，初始化echarts实例
    $("#rtuForBar").width($("#siteStatus").width());
    var myChart = echarts.init(document.getElementById('rtuForBar'));

    var total = parseInt(a)+parseInt(b)+parseInt(c);
    // 指定图表的配置项和数据
    var option = {
        color:['#00CD66', '#EEAD0E','#DCDCDC'],
        title : {
            text: 'RTU统计情况 \n 总数：'+total,
            textStyle: {
                color : 'black'
            },
            //subtext: '纯属虚构',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            textStyle : {
                color : 'black'
            },
            orient: 'vertical',
            left: 'left',
            data: ['RTU正常','RTU异常','RTU离线']
        },
        series : [
            {
                name: '统计数量',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:a, name:'RTU正常'},
                    {value:b, name:'RTU异常'},
                    {value:c, name:'RTU离线'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//设备统计图
function deviceForBar(x,y,z) {
    // 基于准备好的dom，初始化echarts实例
    $("#deviceForBar").width($("#siteStatus").width());
    var myChart = echarts.init(document.getElementById('deviceForBar'));

    var total = parseInt(x)+parseInt(y)+parseInt(z);
    // 指定图表的配置项和数据
    var option = {
        color:['#00CD66', '#EEAD0E','#DCDCDC'],
        title : {
            text: '设备统计情况 \n 总数：'+total,
            textStyle: {
                color : 'black'
            },
            //subtext: '纯属虚构',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            textStyle : {
                color : 'black'
            },
            orient: 'vertical',
            left: 'left',
            data: ['设备正常','设备异常','设备离线']
        },
        series : [
            {
                name: '统计数量',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:x, name:'设备正常'},
                    {value:y, name:'设备异常'},
                    {value:z, name:'设备离线'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//设备分类统计图
function deviceForType(data) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('deviceForType'));
    // 指定图表的配置项和数据
    var option = {
        title : {
            text: '设备分类统计图',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            x : 'center',
            y : 'bottom',
            data:['SPD','接地电阻','雷电流','静电','温湿度','倾斜度','电气安全','杂散电流','阴极保护']
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {
                    show: true,
                    type: ['pie', 'funnel']
                },
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        series : [
            {
                name:'统计数量',
                type:'pie',
                radius : [30, 110],
                center : ['50%', '50%'],
                roseType : 'area',
                data:[
                    {value:data.spdNum, name:'SPD'},
                    {value:data.etcrNum, name:'接地电阻'},
                    {value:data.lightningNum, name:'雷电流'},
                    {value:data.staticNum, name:'静电'},
                    {value:data.rswsNum, name:'温湿度'},
                    {value:data.svtNum, name:'倾斜度'},
                    {value:data.hcNum, name:'电气安全'},
                    {value:data.strayNum, name:'杂散电流'},
                    {value:data.catNum, name:'阴极保护'}
                ]
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//设备分类调用
var xAxisData = ["北京", "广东", "上海", "天津", "重庆", "辽宁", "江苏", "湖北", "四川", "陕西", "河北", "山西", "河南", "吉林", "黑龙江", "内蒙古", "山东", "安徽", "浙江", "福建", "湖南", "广西", "江西", "贵州", "云南", "西藏", "海南", "甘肃", "宁夏", "青海", "新疆", "香港", "澳门", "台湾"];
var customData = [];
var legendData = ["SPD","接地电阻","雷电流","静电","温湿度","倾斜度","电气安全","杂散电流","阴极保护"];
var dataList = [];
var tempData = ["spdNum","etcrNum","lightningNum","staticNum","rswsNum","svtNum","hcNum","strayNum","catNum"];
var encodeY = [];

//设备数量统计图(根据省份)
function deviceForNum(data) {
    console.log("+++++++++++++++++++++++");
    console.log(data);
    console.log("+++++++++++++++++++++++");
    for (var i = 0; i < legendData.length; i++) {
        dataList.push([]);
        encodeY.push(i);
    }
    for (var i = 0; i < xAxisData.length; i++) {
        var customVal = [];
        customData.push(customVal);

        for (var j = 0; j < dataList.length; j++) {
            var value = 0;
            for(var d = 0; d < data.length; d++){
                if(xAxisData[i] == data[d]["province"]){
                    var tempName = tempData[j];
                    value = data[d][tempName];
                    dataList[j].push(value);
                    customVal.push(value);
                }
            }

        }
    }

    console.log("========");
    console.log(customData);
    console.log(dataList);
    console.log("========");
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('deviceForNum'));
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '省份统计：',
            left: 'left'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: legendData
        },
        dataZoom: [{
            type: 'slider',
            start: 50,
            end: 70
        }, {
            type: 'inside',
            start: 50,
            end: 70
        }],
        xAxis: {
            data: xAxisData
        },
        yAxis: {},
        series: [{
            type: 'custom',
            name: 'SPD',
            encode: {
                x: 0,
                y: encodeY
            },
            data: customData,
            z: 100
        }].concat(echarts.util.map(dataList, function (data, index) {
            return {
                type: 'bar',
                animation: false,
                name: legendData[index],
                itemStyle: {
                    normal: {
                        opacity: 0.5
                    }
                },
                data: data
            };
        }))
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//设备一月状态统计
function deviceForMonth() {
    // 基于准备好的dom，初始化echarts实例 macarons
    var myChart = echarts.init(document.getElementById('deviceForMonth'));
    myChart.showLoading();

    $.ajax({
        type: 'GET',
        url: "../../total/selectAlarmByMonth?structure="+structure,
        async: false,
        dataType: 'json',
        success: function(data){
            console.log(data);
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: '最近一月告警变化'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['设备异常','设备离线','RTU离线']
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: {readOnly: false},
                        magicType: {type: ['line', 'bar']},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    data: data.list
                },
                yAxis: {
                    type: 'value'
                    /*axisLabel: {
                        formatter: '{value} °C'
                    }*/
                },
                series: [
                    {
                        name:'设备异常',
                        type:'line',
                        data:data.deviceWarningList
                        /*markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        }*/
                    },
                    {
                        name:'设备离线',
                        type:'line',
                        data:data.deviceOffList
                        /*markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'},
                                [{
                                    symbol: 'none',
                                    x: '90%',
                                    yAxis: 'max'
                                }, {
                                    symbol: 'circle',
                                    label: {
                                        normal: {
                                            position: 'start',
                                            formatter: '最大值'
                                        }
                                    },
                                    type: 'max',
                                    name: '最高点'
                                }]
                            ]
                        }*/
                    },
                    {
                        name:'RTU离线',
                        type:'line',
                        data:data.rtuOffList
                        /*markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'},
                                [{
                                    symbol: 'none',
                                    x: '90%',
                                    yAxis: 'max'
                                }, {
                                    symbol: 'circle',
                                    label: {
                                        normal: {
                                            position: 'start',
                                            formatter: '最大值'
                                        }
                                    },
                                    type: 'max',
                                    name: '最高点'
                                }]
                            ]
                        }*/
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);

            myChart.hideLoading();
        }
    });

}
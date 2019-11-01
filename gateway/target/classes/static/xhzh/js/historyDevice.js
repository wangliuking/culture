
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

    app.filter('changeValueTwo', function() { //可以注入依赖
        return function(text) {
            var i = parseFloat(text);
            var a = Math.round(i*100);
            return a/100;
        };
    });

    app.filter('changeValueThree', function() { //可以注入依赖
        return function(text) {
            var i = parseFloat(text);
            var a = Math.round(i*1000);
            return a/1000;
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
        /*xh.maskShow();*/
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
            } ,
            error: function () {
                alert("登录已失效，请重新登录！");
                window.location.href = "../login.html";
                window.parent.location.href = "../login.html";
            }
        });
        //判断是否登录end

        //获取查询时间间隔
        var a = new Date();
        var endTime = getNowFormatDate(a)+" 23:59:59";
        console.log("endTime:"+endTime);
        var b =new Date(new Date()-24*60*60*1000*30);
        var startTime = getNowFormatDate(b)+" 00:00:00";
        console.log("startTime:"+startTime);

        $http.get("../../connect/selectAllSite?structure="+structure).
        success(function(response){
            var data = response.items;
            var siteNames = [];
            for(var i=0;i<data.length;i++){
                siteNames.push({"site_id":data[i].site_id,"site_name":data[i].site_name});
            }
            //console.log(siteNames);
            $scope.siteNames = siteNames;

            //添加页面的site-id
            $scope.siteNamesAdd = siteNames;
            //修改页面的site-id
            $scope.siteNamesEdit = siteNames;
        });

        $http.get("../../connect/selectAllRTU?structure="+structure).
        success(function(response){
            var data = response.items;
            var rtuNames = [];
            for(var i=0;i<data.length;i++){
                rtuNames.push({"rtu_id":data[i].rtu_id,"rtu_name":data[i].rtu_id});
            }
            $scope.rtuNames = rtuNames;

            //添加页面的rtu-id
            $scope.rtuNamesAdd = rtuNames;
            //修改页面的rtu-id
            $scope.rtuNamesEdit = rtuNames;

            var deviceNames = [{"id":"1","name":"SPD在线监测仪"},{"id":"2","name":"接地电阻在线监测仪"},{"id":"3","name":"雷电流在线监测仪"},{"id":"4","name":"静电在线监测仪"},{"id":"5","name":"温湿度在线监测仪"},{"id":"6","name":"倾斜度在线监测仪"},{"id":"7","name":"电气安全在线监测仪"},{"id":"8","name":"杂散电流在线监测仪"},{"id":"9","name":"阴极保护在线监测仪"}]
            $scope.deviceNames = deviceNames;
        });

        $scope.goSiteId = $location.search().id;
        var goSiteId = $location.search().id;
        if(typeof(goSiteId) == "undefined" ){
            goSiteId = "";
        }

        //多级联动start
        $scope.changeSiteName = function(x){
            console.log(x);
            $http.get("../../connect/selectAllRTU?site_id="+x+"&structure="+structure).
            success(function(response){
                var data = response.items;
                var rtuNames = [];
                for(var i=0;i<data.length;i++){
                    rtuNames.push({"rtu_id":data[i].rtu_id,"rtu_name":data[i].rtu_id});
                }
                $scope.rtuNames = rtuNames;
            });
        }

        $scope.changeDeviceName = function(x){
            var deviceName = $("#deviceName").val();
            var rtu_id = $("#rtuName").val();
            if(deviceName == 1){
                $http.get("../../spd/selectAllSPD?rtu_id="+rtu_id+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    var tempArr = response.items;
                    var deviceIdArr = [];
                    for(var i=0;i<tempArr.length;i++){
                        deviceIdArr.push({"id":tempArr[i].spd_number});
                    }
                    $scope.deviceIds = deviceIdArr;
                });
            }else if(deviceName == 2){
                $http.get("../../etcr/selectAllETCR?rtu_id="+rtu_id+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    var tempArr = response.items;
                    var deviceIdArr = [];
                    for(var i=0;i<tempArr.length;i++){
                        deviceIdArr.push({"id":tempArr[i].rst_id});
                    }
                    $scope.deviceIds = deviceIdArr;
                });
            }else if(deviceName == 3){
                $http.get("../../lightning/selectAllLightning?rtu_id="+rtu_id+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    var tempArr = response.items;
                    var deviceIdArr = [];
                    for(var i=0;i<tempArr.length;i++){
                        deviceIdArr.push({"id":tempArr[i].ltn_id});
                    }
                    $scope.deviceIds = deviceIdArr;
                });
            }else if(deviceName == 4){
                $http.get("../../static/selectAllStatic?rtu_id="+rtu_id+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    var tempArr = response.items;
                    var deviceIdArr = [];
                    for(var i=0;i<tempArr.length;i++){
                        deviceIdArr.push({"id":tempArr[i].staet_id});
                    }
                    $scope.deviceIds = deviceIdArr;
                });
            }else if(deviceName == 5){
                $http.get("../../rsws/selectAllRsws?rtu_id="+rtu_id+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    var tempArr = response.items;
                    var deviceIdArr = [];
                    for(var i=0;i<tempArr.length;i++){
                        deviceIdArr.push({"id":tempArr[i].hmt_id});
                    }
                    $scope.deviceIds = deviceIdArr;
                });
            }else if(deviceName == 6){
                $http.get("../../svt/selectAllSvt?rtu_id="+rtu_id+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    var tempArr = response.items;
                    var deviceIdArr = [];
                    for(var i=0;i<tempArr.length;i++){
                        deviceIdArr.push({"id":tempArr[i].tilt_id});
                    }
                    $scope.deviceIds = deviceIdArr;
                });
            }else if(deviceName == 7){
                $http.get("../../hc/selectAllHc?rtu_id="+rtu_id+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    var tempArr = response.items;
                    var deviceIdArr = [];
                    for(var i=0;i<tempArr.length;i++){
                        deviceIdArr.push({"id":tempArr[i].es_id});
                    }
                    $scope.deviceIds = deviceIdArr;
                });
            }else if(deviceName == 8){
                $http.get("../../stray/selectAllStray?rtu_id="+rtu_id+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    var tempArr = response.items;
                    var deviceIdArr = [];
                    for(var i=0;i<tempArr.length;i++){
                        deviceIdArr.push({"id":tempArr[i].stret_id});
                    }
                    $scope.deviceIds = deviceIdArr;
                });
            }else if(deviceName == 9){
                $http.get("../../cat/selectAllCat?rtu_id="+rtu_id+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    var tempArr = response.items;
                    var deviceIdArr = [];
                    for(var i=0;i<tempArr.length;i++){
                        deviceIdArr.push({"id":tempArr[i].cathode_id});
                    }
                    $scope.deviceIds = deviceIdArr;
                });
            }
        }
		
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
		};

		/* 查询数据 */
		$scope.search = function(page) {
		    var deviceName = $("#deviceName").val();
            $scope.changeDeviceTypeShow = deviceName;

            var site_id = $("#siteName").val();
            var rtu_id = $("#rtuName").val();
            var deviceId = $("#deviceId").val();

            if(site_id == null || site_id == ''){
                alert("请选择站点！");
                return false;
            }else if(rtu_id == null || rtu_id == ''){
                alert("请选择RTU！");
                return false;
            }else if(deviceId == null || deviceId == ''){
                alert("请输入设备ID！");
                return false;
            }
            console.log(deviceName+" "+site_id+" "+rtu_id+" "+location+" "+deviceId);


            // 基于准备好的dom，初始化echarts实例 macarons
            myChart = echarts.init(document.getElementById('deviceHistory'));
            myChart.showLoading();

            $http.get("../../total/selectHistoryValue?site_id="+site_id+"&rtu_id="+rtu_id+"&deviceId="+deviceId+"&deviceType="+deviceName+"&startTime="+startTime+"&endTime="+endTime).
            success(function(response){
                var data = response.items;
                console.log(data);
                deviceHistory(data);
            });
			

		};


	});
};

// 刷新数据
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();
};

var myChart;
//站点统计图
function deviceHistory(data) {
    //遍历时间
    var timeList = [];
    for(var i=0;i<data.length;i++){
        var d = data[i].write_time;
        var temp = timestampToTime(d);
        timeList.push(temp);
    }
    //console.log(timeList);
    var header = [];
    var unit = [];
    var dataListOne = [];
    var dataListTwo = [];
    var dataListThree = [];
    var dataListFour = [];
    var dataListFive = [];
    var deviceName = $("#deviceName").val();
    if(deviceName == 1){
        header.push("SPD状态");
        header.push("");
        unit.push("");
        unit.push("");
        for(var i=0;i<data.length;i++){
            var temp = data[i].spd_state;
            dataListOne.push(temp);
        }
    }else if(deviceName == 2){
        if(data[0].rst_type == 1){//接触式

            header.push("接地电阻1");
            header.push("接地电阻2");
            header.push("接地电阻3");
            header.push("接地电阻4");
            unit.push("Ω");
            unit.push("Ω");
            unit.push("Ω");
            unit.push("Ω");

            for(var i=0;i<data.length;i++){
                if(data[i].relayno == 1){
                    var temp = data[i].rst_value;
                    var time = timestampToTime(data[i].write_time);
                    dataListOne.push([time,temp]);
                }else if(data[i].relayno == 2){
                    var temp = data[i].rst_value;
                    var time = timestampToTime(data[i].write_time);
                    dataListTwo.push([time,temp]);
                }else if(data[i].relayno == 3){
                    var temp = data[i].rst_value;
                    var time = timestampToTime(data[i].write_time);
                    dataListThree.push([time,temp]);
                }else if(data[i].relayno == 4){
                    var temp = data[i].rst_value;
                    var time = timestampToTime(data[i].write_time);
                    dataListFour.push([time,temp]);
                }

            }
            /*console.log(dataListOne);
            console.log(dataListTwo);
            console.log(dataListThree);
            console.log(dataListFour);*/
        }else if(data[0].rst_type == 2){//非接触式
            header.push("接地电阻");
            header.push("");
            unit.push("Ω");
            unit.push("");
            for(var i=0;i<data.length;i++){
                var temp = data[i].rst_value;
                var time = timestampToTime(data[i].write_time);
                dataListOne.push([time,temp]);
            }
        }
    }else if(deviceName == 3){
        header.push("雷电流");
        header.push("");
        unit.push("kA");
        unit.push("");
        for(var i=0;i<data.length;i++){
            var temp = data[i].ltn_value;
            dataListOne.push(temp);
        }
    }else if(deviceName == 4){
        header.push("静电");
        header.push("");
        unit.push("kV");
        unit.push("");
        for(var i=0;i<data.length;i++){
            var temp = data[i].staet_value;
            var a = Math.round(temp/100);
            dataListOne.push(a/10);
        }
    }else if(deviceName == 5){
        header.push("温度");
        header.push("");
        header.push("湿度");
        unit.push("℃");
        unit.push("%");
        unit.push("%");
        for(var i=0;i<data.length;i++){
            var temp1 = data[i].hmt_temp;
            dataListOne.push(temp1);
            var temp2 = data[i].hmt_hm;
            dataListThree.push(temp2);
        }
    }else if(deviceName == 6){
        header.push("顺线倾斜角");
        header.push("横向倾斜角");
        header.push("顺线倾斜度");
        header.push("横向倾斜度");
        header.push("综合倾斜度");
        unit.push("°");
        unit.push("°");
        unit.push("");
        unit.push("");
        unit.push("");
        for(var i=0;i<data.length;i++){
            var temp1 = data[i].tilt_value1;
            var time = timestampToTime(data[i].write_time);
            dataListOne.push([time,temp1]);
            var temp2 = data[i].tilt_value2;
            var time = timestampToTime(data[i].write_time);
            dataListTwo.push([time,temp2]);
            var temp3 = data[i].tilt_gx;
            var time = timestampToTime(data[i].write_time);
            dataListThree.push([time,temp3]);
            var temp4 = data[i].tilt_gy;
            var time = timestampToTime(data[i].write_time);
            dataListFour.push([time,temp4]);
            var temp5 = data[i].tilt_gs;
            var time = timestampToTime(data[i].write_time);
            dataListFive.push([time,temp5]);
        }
    }else if(deviceName == 7){
        header.push("零地电压");
        header.push("零线电流");
        header.push("剩余电流");
        header.push("线缆温度");
        unit.push("V");
        unit.push("A");
        unit.push("mA");
        unit.push("℃");
        for(var i=0;i<data.length;i++){
            var temp1 = data[i].es_cur_value;
            dataListOne.push(temp1);
            var temp2 = data[i].es_vol_value;
            dataListTwo.push(temp2);
            var temp3 = data[i].es_i_value;
            dataListThree.push(temp3);
            var temp4 = data[i].es_temp_value;
            dataListFour.push(temp4);
        }
    }else if(deviceName == 8){
        header.push("杂散直流电压");
        header.push("杂散交流电压");
        header.push("杂散直流电流");
        header.push("杂散交流电流");
        unit.push("V");
        unit.push("A");
        for(var i=0;i<data.length;i++){
            var temp = data[i].stret_value;
            var portId = data[i].portId;
            if(portId == 1){
                var time = timestampToTime(data[i].write_time);
                dataListOne.push([time,temp]);
            }else if(portId == 2){
                var time = timestampToTime(data[i].write_time);
                dataListTwo.push([time,temp]);
            }else if(portId == 3){
                var time = timestampToTime(data[i].write_time);
                dataListThree.push([time,temp]);
            }else if(portId == 4){
                var time = timestampToTime(data[i].write_time);
                dataListFour.push([time,temp]);
            }
        }
    }else if(deviceName == 9){
        header.push("阴极保护");
        header.push("");
        unit.push("V");
        unit.push("");
        for(var i=0;i<data.length;i++){
            var temp1 = data[i].cathode_value;
            dataListOne.push(temp1);
        }
    }



    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '当前设备一月内数值变化',
            subtext: ''
        },
        tooltip: [{
            trigger: 'axis',
            formatter:function (params, ticket, callback) {
                console.log(params);
                if(deviceName == 2 || deviceName == 8){
                    var value = params[0].value;
                    var index = params[0].componentIndex;
                    return params[0].axisValue+'<br />'+header[index]+":"+value[1]+unit[index];
                }else if(deviceName == 5){
                    var index0 = params[0].seriesIndex;
                    var value0 = params[0].value;
                    var index1 = params[1].seriesIndex;
                    var value1 = params[1].value;
                    return params[0].axisValue+'<br />'+header[index0]+":"+value0+unit[index0]+'<br />'+header[index1]+":"+value1+unit[index1];
                }else if(deviceName == 6){
                    var index0 = params[0].seriesIndex;
                    var value0 = params[0].value;
                    var index1 = params[1].seriesIndex;
                    var value1 = params[1].value;
                    var index2 = params[2].seriesIndex;
                    var value2 = params[2].value;
                    var index3 = params[3].seriesIndex;
                    var value3 = params[3].value;
                    var index4 = params[4].seriesIndex;
                    var value4 = params[4].value;
                    return params[0].axisValue+'<br />'+header[index0]+":"+value0[1]+unit[index0]+'<br />'+header[index1]+":"+value1[1]+unit[index1]+'<br />'+header[index2]+":"+value2[1]+unit[index2]+'<br />'+header[index3]+":"+value3[1]+unit[index3]+'<br />'+header[index4]+":"+value4[1]+unit[index4];
                }else if(deviceName == 7){
                    var index0 = params[0].seriesIndex;
                    var value0 = params[0].value;
                    var index1 = params[1].seriesIndex;
                    var value1 = params[1].value;
                    var index2 = params[2].seriesIndex;
                    var value2 = params[2].value;
                    var index3 = params[3].seriesIndex;
                    var value3 = params[3].value;
                    return params[0].axisValue+'<br />'+header[index0]+":"+value0+unit[index0]+'<br />'+header[index1]+":"+value1+unit[index1]+'<br />'+header[index2]+":"+value2+unit[index2]+'<br />'+header[index3]+":"+value3+unit[index3];
                }else if(deviceName == 1){
                    var index = params[0].seriesIndex;
                    var value = params[0].value;
                    var status = parseInt(value)==0?"正常":"异常";
                    return params[0].axisValue+'<br />'+header[index]+":"+status+unit[index];
                }else{
                    var index = params[0].seriesIndex;
                    var value = params[0].value;
                    return params[0].axisValue+'<br />'+header[index]+":"+value+unit[index];
                }
            }
        }],
        legend: {
            data:header
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
        xAxis:  [{
            type: 'category',
            boundaryGap: false,
            data: timeList
        }],
        dataZoom: [{
            type: 'slider',
            start: 50,
            end: 70
        }, {
            type: 'inside',
            start: 50,
            end: 70
        }],
        yAxis: [{
            type: 'value',
            axisLabel: {
                formatter: '{value} '+unit[0]
            }
        },{
            type: 'value',
            axisLabel: {
                formatter: '{value} '+unit[1]
            }
        }],
        series: [
            {
                name: header[0],
                type:'line',
                yAxisIndex: 0,
                data:dataListOne
            },
            {
                name: header[1],
                type:'line',
                yAxisIndex: 0,
                data:dataListTwo
            },
            {
                name: header[2],
                type:'line',
                yAxisIndex: 1,
                data:dataListThree
            },
            {
                name: header[3],
                type:'line',
                yAxisIndex: 1,
                data:dataListFour
            },
            {
                name: header[4],
                type:'line',
                yAxisIndex: 1,
                data:dataListFive
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    myChart.hideLoading();

}

function getNowFormatDate(date) {
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

function timestampToTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
}

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
    var pageSize = $("#page-limit").val();
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

        $scope.addContent = function(x) {
            window.location.href = '/xhzh/deviceMaintainList.html?site_id='+x.site_id+"&rtu_id="+x.rtu_id+"&deviceType="+x.deviceType;
        };

        $http.get("../../connect/selectAllSite?structure="+structure).
        success(function(response){
            var data = response.items;
            var siteNames = [];
            for(var i=0;i<data.length;i++){
                siteNames.push({"site_id":data[i].site_id,"site_name":data[i].site_name});
            }
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

            var description = [{"id":"1","name":"设备离线"},{"id":"2","name":"RTU离线"},{"id":"3","name":"设备异常"}]
            $scope.description = description;

            var allStatus = [{"id":"1","name":"告警中"},{"id":"0","name":"告警结束"}]
            $scope.allStatus = allStatus;
        });

        $http.get("../../mq/selectAllAlarmInfo?start=0&limit="+pageSize+"&structure="+structure).
        success(function(response){
            $scope.data = response.items;
            $scope.totals = response.totals;
            xh.pagging(1, parseInt($scope.totals), $scope);
        });

		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
		};

        /* 查询数据 */
        $scope.search = function(page) {

            var site_id = $("#siteName").val();
            var rtu_id = $("#rtuName").val();
            var description = $("#description").val();
            var status = $("#allStatus").val();
            var startTime = $("#startTime").val();
            var endTime = $("#endTime").val();

            console.log(site_id + " " + rtu_id + " " + description + " " + status + " " + startTime+" "+endTime);

            var pageSize = $("#page-limit").val();
            var start = 1, limit = pageSize;
            frist = 0;
            page = parseInt(page);
            if (page <= 1) {
                start = 0;
            } else {
                start = (page - 1) * pageSize;
            }
            $http.get("../../mq/selectAllAlarmInfo?start=0&limit="+limit+"&site_id="+site_id+"&rtuId="+rtu_id+"&type="+description+"&alarmStatus="+status+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
            success(function(response){
                console.log(response);
                $scope.data = response.items;
                $scope.totals = response.totals;
                xh.pagging(page, parseInt($scope.totals), $scope);
            });
        }

        //分页点击
        $scope.pageClick = function(page, totals, totalPages) {
            var site_id = $("#siteName").val();
            var rtu_id = $("#rtuName").val();
            var description = $("#description").val();
            var status = $("#allStatus").val();
            var startTime = $("#startTime").val();
            var endTime = $("#endTime").val();

            var pageSize = $("#page-limit").val();
            var start = 1, limit = pageSize;
            page = parseInt(page);
            if (page <= 1) {
                start = 0;
            } else {
                start = (page - 1) * pageSize;
            }

            $http.get("../../mq/selectAllAlarmInfo?start="+start+"&limit="+limit+"&site_id="+site_id+"&rtuId="+rtu_id+"&type="+description+"&alarmStatus="+status+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
            success(function(response){
                /*xh.maskHide();*/
                $scope.start = (page - 1) * pageSize + 1;
                $scope.lastIndex = page * pageSize;
                if (page == totalPages) {
                    if (totals > 0) {
                        $scope.lastIndex = totals;
                    } else {
                        $scope.start = 0;
                        $scope.lastIndex = 0;
                    }
                }
                $scope.data = response.items;
                $scope.totals = response.totals;
            });
        };

        deviceForMonth();
	});


};

// 刷新数据
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();
};

//设备一月状态统计
function deviceForMonth() {
    // 基于准备好的dom，初始化echarts实例 macarons
    var myChart = echarts.init(document.getElementById('alarmForMonth'));
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
    /*var d = new Date();
    var xAxisData = [];
    for (var i = 0; i < 30; i++) {
        var year = d.getFullYear();
        var month = d.getMonth()+1;
        if(month < 10){
            month = "0"+month;
        }
        var day = d.getDate();
        if(day < 10){
            day = "0"+day;
        }
        xAxisData.push(month+"-"+day);
        d = new Date(d-24*60*60*1000);
    }*/
}

// 刷新数据
xh.refresh = function() {
    var $scope = angular.element(appElement).scope();
    // 调用$scope中的方法
    $scope.refresh();
};

/* 数据分页 */
xh.pagging = function(currentPage, totals, $scope) {
    var pageSize = $("#page-limit").val();
    var totalPages = (parseInt(totals, 10) / pageSize) < 1 ? 1 : Math
        .ceil(parseInt(totals, 10) / pageSize);
    var start = (currentPage - 1) * pageSize + 1;
    var end = currentPage * pageSize;
    if (currentPage == totalPages) {
        if (totals > 0) {
            end = totals;
        } else {
            start = 0;
            end = 0;
        }
    }
    $scope.start = start;
    $scope.lastIndex = end;
    $scope.totals = totals;
    if (totals > 0) {
        $(".page-paging").html('<ul class="pagination"></ul>');
        $('.pagination').twbsPagination({
            totalPages : totalPages,
            visiblePages : 10,
            version : '1.1',
            startPage : currentPage,
            onPageClick : function(event, page) {
                if (frist == 1) {
                    $scope.pageClick(page, totals, totalPages);
                }
                frist = 1;

            }
        });
    }
};
/**
 * 基站配置
 */
if (!("xh" in window)) {
	window.xh = {};
};

require.config({
    paths : {
        echarts : '../../lib/echarts'
    }
});

var frist = 0;
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
xh.load = function() {
	var app = angular.module("app", []);
	var bsId = $("#bsId").val();
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	var pageSize = $("#page-limit").val();

	//获取EPS输入相电压，电池组电压和电表电压
	var startUps1 = $("#startUps1").val();
	var endUps1 = $("#endUps1").val();
    var startUps4 = $("#startUps4").val();
    var endUps4 = $("#endUps4").val();
    var startE1 = $("#startE1").val();
    var endE1 = $("#endE1").val();
	
	app.filter('upp', function() { //可以注入依赖
		return function(text) {
			if(text=="" || text==null)
			return "";
			else
			return parseFloat(text);
		};
	});

	app.controller("emhHistory", function($scope, $http) {
		// xh.maskShow();
		$scope.count = "15";//每页数据显示默认值
		$scope.systemMenu=true; //菜单变色
		$http.get("../../gonsuncn/emhHistory?bsId="+bsId+"&startTime="+startTime+"&endTime="+endTime+"&start=0&limit="+pageSize+
			"&startUps1="+startUps1+"&endUps1="+endUps1+"&startUps4="+startUps4+"&endUps4="+endUps4+"&startE1="+startE1+"&endE1="+endE1).
		success(function(response){
			xh.maskHide();
			$scope.data = response.items;
			$scope.totals = response.totals;
			xh.pagging(1, parseInt($scope.totals), $scope);
		});
		/* 刷新数据 */
		$scope.refresh = function() {
			$("#bsId").val("");
			$("#startTime").val("");
			$("#endTime").val("");
            $("#startUps1").val("");
            $("#endUps1").val("");
            $("#startUps4").val("");
            $("#endUps4").val("");
            $("#startE1").val("");
            $("#endE1").val("");
			$scope.search(1);
		};
		
		/* 显示model */
		$scope.showAddModel = function(id) {
            var bsId = $("#bsId").val();
            var startTime = $("#startTime").val();
            var endTime = $("#endTime").val();
            //获取EPS输入相电压，电池组电压和电表电压
            var startUps1 = $("#startUps1").val();
            var endUps1 = $("#endUps1").val();
            var startUps4 = $("#startUps4").val();
            var endUps4 = $("#endUps4").val();
            var startE1 = $("#startE1").val();
            var endE1 = $("#endE1").val();

            window.location="../../gonsuncn/export4History?bsId="+bsId+"&startTime="+startTime+"&endTime="+endTime+
                "&startUps1="+startUps1+"&endUps1="+endUps1+"&startUps4="+startUps4+"&endUps4="+endUps4+"&startE1="+startE1+"&endE1="+endE1;
		};
		
		/* 查询数据 */
		$scope.search = function(page) {
			var pageSize = $("#page-limit").val();
			var bsId = $("#bsId").val();
			var startTime = $("#startTime").val();
			var endTime = $("#endTime").val();
            //获取EPS输入相电压，电池组电压和电表电压
            var startUps1 = $("#startUps1").val();
            var endUps1 = $("#endUps1").val();
            var startUps4 = $("#startUps4").val();
            var endUps4 = $("#endUps4").val();
            var startE1 = $("#startE1").val();
            var endE1 = $("#endE1").val();
			//时间比对
			var d1 = new Date(startTime.replace(/\-/g, "\/"));  
			var d2 = new Date(endTime.replace(/\-/g, "\/"));  
			if(startTime!=""&&endTime!=""&&d1 >=d2){  
				toastr.error("结束时间需要大于起始时间", '提示');
				return false;  
			}
			
			var start = 1, limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;

			} else {
				start = (page - 1) * pageSize;
			}
			console.log("limit=" + limit);
			xh.maskShow();
			$http.get("../../gonsuncn/emhHistory?bsId="+bsId+"&startTime="+startTime+"&endTime="+endTime+"&start="+start+"&limit="+limit+
                "&startUps1="+startUps1+"&endUps1="+endUps1+"&startUps4="+startUps4+"&endUps4="+endUps4+"&startE1="+startE1+"&endE1="+endE1).
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				xh.pagging(page, parseInt($scope.totals), $scope);
			});

			//生成曲线图
            //时间比对
            var d1 = new Date(startTime.replace(/\-/g, "\/"));
            var d2 = new Date(endTime.replace(/\-/g, "\/"));
            var tempTime = (d2-d1)/1000/3600/24;
            //
			if(bsId!="" && tempTime<3){
                $http.get("../../gonsuncn/emhHistoryForBsId?bsId="+bsId+"&startTime="+startTime+"&endTime="+endTime).
                success(function(response){
                    var dataEcharts = response.items;
                    // 开启echarts加载
                    dataEchartsView(dataEcharts);
                });
			}
		};
		//分页点击
		$scope.pageClick = function(page, totals, totalPages) {
			var pageSize = $("#page-limit").val();
			var bsId = $("#bsId").val();
			var startTime = $("#startTime").val();
			var endTime = $("#endTime").val();
            //获取EPS输入相电压，电池组电压和电表电压
            var startUps1 = $("#startUps1").val();
            var endUps1 = $("#endUps1").val();
            var startUps4 = $("#startUps4").val();
            var endUps4 = $("#endUps4").val();
            var startE1 = $("#startE1").val();
            var endE1 = $("#endE1").val();

			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			xh.maskShow();
			$http.get("../../gonsuncn/emhHistory?bsId="+bsId+"&startTime="+startTime+"&endTime="+endTime+"&start="+start+"&limit="+pageSize+
                "&startUps1="+startUps1+"&endUps1="+endUps1+"&startUps4="+startUps4+"&endUps4="+endUps4+"&startE1="+startE1+"&endE1="+endE1).
			success(function(response){
				xh.maskHide();
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
	});
};

// 刷新数据
xh.refresh = function() {
	var appElement = document.querySelector('[ng-controller=emhHistory]');
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

/* 传感器统计图 */
function dataEchartsView(dataEcharts) {
	var ups1=[];
	var ups4=[];
	var e1=[];
	var createTime=[];
	for(var i=0;i<dataEcharts.length;i++){
        var tempUps1 = parseInt(dataEcharts[i]["ups1"]);
        var tempUps4 = parseInt(dataEcharts[i]["ups4"]);
        var tempE1 = parseInt(dataEcharts[i]["e1"]);
        var tempCreateTime = dataEcharts[i]["createTime"];
        ups1.push(tempUps1);
        ups4.push(tempUps4);
        e1.push(tempE1);
        createTime.push(tempCreateTime);
	}
    // 设置容器宽高
    var resizeBarContainer = function() {
        $("#alarmPie").width(parseInt($("#alarmPie").parent().width()));
        // $("#alarmPie").height(parseInt($("#leftChoose").height()));
        // $("#alarmPie").width(800);
        $("#alarmPie").height(300);
    };
    resizeBarContainer();

    // 基于准备好的dom，初始化echarts实例
    var chart = null;
    if (chart != null) {
        chart.clear();
        chart.dispose();
    }
    require([ 'echarts', 'echarts/chart/line', 'echarts/chart/bar' ], function(ec) {
        chart = ec.init(document.getElementById('alarmPie'));
        chart.showLoading({
            text : '正在努力的读取数据中...'
        });
        var option = {
            title : {
                text: 'EPS电压变化情况图',
                subtext: '历史数据'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['EPS输入相电压','电池组电压','电表电压']
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : createTime
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value} V'
                    }
                }
            ],
            series : [
                {
                    name:'EPS输入相电压',
                    type:'line',
                    data:ups1,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    }/*,
                    markLine : {
                        data : [
                            {type : 'average', name: '平均值'}
                        ]
                    }*/
                },
                {
                    name:'电池组电压',
                    type:'line',
                    data:ups4,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    }/*,
                    markLine : {
                        data : [
                            {type : 'average', name : '平均值'}
                        ]
                    }*/
                },
                {
                    name:'电表电压',
                    type:'line',
                    data:e1,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    }/*,
                    markLine : {
                        data : [
                            {type : 'average', name : '平均值'}
                        ]
                    }*/
                }
            ]
        };
        chart.hideLoading();
        chart.setOption(option);
    });
    // 用于使chart自适应高度和宽度
    window.onresize = function() {
        // 重置容器高宽
        chart.resize();
    };
};
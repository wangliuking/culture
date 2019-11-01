/**
 * 终端状态
 */
if (!("xh" in window)) {
	window.xh = {};
};
require.config({
	paths : {
		echarts : '../../lib/echarts'
	}
});
var background="#fff";
var frist = 0;
var appElement = document.querySelector('[ng-controller=gonsuncn]');
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
	var pageSize = $("#page-limit").val();
	app.controller("gonsuncn", function($scope, $http) {
		//xh.maskShow();
		//34环控通断情况
		$scope.selectForEMH = function() {
			$http.get("../../gonsuncn/selectForEMH").
			success(function(response){
				xh.maskHide();
				var emhData4 = response.items4;
				var emhData3 = response.items3;
				for(var i=0;i<emhData4.length;i++){
					for(var j=0;j<emhData3.length;j++){
						if(emhData4[i].bsId==parseInt(emhData3[j].JFNode)){
							var tempState = emhData3[j].State.toLocaleLowerCase();
							if("true"==tempState){
								emhData4[i].siteId=emhData4[i].bsId;
							}
						}				
					}
				}
				$scope.emhData4 = emhData4;

				$scope.emhData4Num = emhData4.length;
			});
		}
		//查询环控通断情况
		$scope.selectForStatus = function(id) {
			$http.get("../../gonsuncn/selectForEMH").
			success(function(response){
				xh.maskHide();
				var emhData4 = response.items4;
				var emhData3 = response.items3;
				for(var i=0;i<emhData4.length;i++){
					for(var j=0;j<emhData3.length;j++){
						if(emhData4[i].bsId==parseInt(emhData3[j].JFNode)){
							var tempState = emhData3[j].State.toLocaleLowerCase();
							if("true"==tempState){
								emhData4[i].siteId=emhData4[i].bsId;
							}
						}				
					}
				}
				if(id==1){
					var tempData = [];
					for(var i=0;i<emhData4.length;i++){
						if(emhData4[i].siteId==emhData4[i].bsId && emhData4[i].envMonitor!=2){
							tempData.push(emhData4[i]);
						}
					}
					$scope.emhData4 = tempData;
					$scope.emhData4Num = tempData.length;
				}else if(id==2){
					var tempData = [];
					for(var i=0;i<emhData4.length;i++){
						if(emhData4[i].siteId!=emhData4[i].bsId && emhData4[i].envMonitor!=2){
							tempData.push(emhData4[i]);
						}
					}
					$scope.emhData4 = tempData;
					$scope.emhData4Num = tempData.length;
				}else{
					$scope.emhData4 = emhData4;
					$scope.emhData4Num = emhData4.length;
				}

			});
		}
		
		
		/*//4期环控通断情况
		$http.get("../../gonsuncn/selectFor4EMH").
		success(function(response){
			xh.maskHide();
			$scope.emhData4 = response.items;

		});
		//3期环控通断情况
		$http.get("../../gonsuncn/selectFor3EMH").
		success(function(response){
			xh.maskHide();
			$scope.emhData3 = response.items;

		});*/
		
		//三期告警
		$scope.alarmModel=function(){
			var type=[];
			$('input[name="type"]:checked').each(function(){ 
				type.push($(this).val()); 
			}); 
			$http.get("../../monitor/bsoffline?emhstart=0&emhlimit=500&type="+type.join(",")).success(function(response) {
				$scope.bs = response.bsList;
				$scope.bsTotals = response.bsListCount;
				
				$scope.msc=response.mscList;
				$scope.mscTotals=response.mscCount;
				
				$scope.emh=response.emhList;
				$scope.emhTotals=response.emhListCount;
				
			});
		}
		
		
		$('input[name="type"]').on('click',function(){ 
			$scope.alarmModel();
			
		});
		
		//显示当前鼠标移入的基站名称
		$scope.showMouseChoosedBsName = function(bsName) {
			$scope.choosedBsNameTitle = "当前基站名称："
			$scope.choosedBsName = bsName;
		}
		//隐藏鼠标移出时的基站显示
		$scope.hideMouseChoosedBsName = function() {
			$scope.choosedBsNameTitle = ""
			$scope.choosedBsName = "";
		}
		//点击跳转环控数据页面
		$scope.emhView=function(index){
			var bsId=$scope.emhData4[index].bsId;
			var period=$scope.emhData4[index].period;
			var bsName=$scope.emhData4[index].name;
			window.location.href = "emhData.html?bsId=" + bsId+"&period="+period+"&bsName="+bsName;
		};
		
		$scope.alarmlist = function() {
			$scope.count = "10";//每页数据显示默认值
			$scope.operationMenu=true; //菜单变色
			var deviceIds=[];
			$(".form-inline input:checked").each(function(i){
				deviceIds.push($(this).val());
			});
			var alarmLevel = $("#alarmLv  option:selected").val();
			var alarmFlag = "1";//$("#alarmFlags option:selected").val()
			var bsLevel = $("#bsLevel  option:selected").val();
			var bsArea = "全部区域";
			$http.get("../../gonsuncn/alarmlist?start=0&limit="+pageSize+"&deviceIds="+deviceIds+"&alarmLevel="+alarmLevel+"&alarmFlag="+alarmFlag+"&bsLevel="+bsLevel+"&bsArea="+bsArea).
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				xh.pagging(1, parseInt($scope.totals),$scope);
			});
		}
		/*通断筛选*/
		$scope.selectAlarmStatus = [{"id":"0","name":"全部"},{"id":"1","name":"连接中"},{"id":"2","name":"已断开"}];
		
		
		/*告警筛选*/
		$scope.provs = [{"id":"0","name":"告警级别"},{"id":"1","name":"一级告警"},{"id":"2","name":"二级告警"},{"id":"3","name":"三级告警"}];
		
		$scope.alarmStatus = [{"id":"0","name":"告警状态"},{"id":"1","name":"告警中"},{"id":"2","name":"告警结束"}];
		
		$scope.bsLevel = [{"id":"0","name":"基站级别"},{"id":"1","name":"一级基站"},{"id":"2","name":"二级基站"},{"id":"3","name":"三级基站"}];
		
		$scope.bsArea = [{"id":"0","name":"全部区域"},{"id":"1","name":"简阳"},{"id":"2","name":"双流"},{"id":"e","name":"都江堰"},
		                 {"id":"4","name":"天府新区"},{"id":"5","name":"温江"},{"id":"6","name":"龙泉驿"},{"id":"7","name":"金堂"},
		                 {"id":"8","name":"青白江"},{"id":"9","name":"新都"},{"id":"10","name":"彭州"},{"id":"11","name":"郫都区"},
		                 {"id":"12","name":"崇州"},{"id":"13","name":"大邑"},{"id":"14","name":"邛崃"},{"id":"15","name":"蒲江"},
		                 {"id":"16","name":"新津"},{"id":"17","name":"高新区"},{"id":"18","name":"成华区"},{"id":"19","name":"武侯区"},
		                 {"id":"20","name":"金牛区"},{"id":"21","name":"锦江区"},{"id":"22","name":"青羊区"},{"id":"23","name":"金牛区"}];
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
		};
		/* 导出查询的告警 */
		$scope.exportAlarm = function(id) {
			xh.maskShow();
			/*获取选中的checkbox和告警等级*/
			var deviceIds=[];
			$(".form-inline input:checked").each(function(i){
				deviceIds.push($(this).val());
			});
			var alarmLevel = $("#alarmLv  option:selected").val();
			var alarmFlag = $("#alarmFlags option:selected").val();
			var bsLevel = $("#bsLevel  option:selected").val();
			var bsArea = $("#bsArea  option:selected").val();
			
			var bsId = $("#bsId").val();
			var bsName = $("#bsName").val();
			
			var startTime = $("#startTime").val();
			var endTime = $("#endTime").val();
			
			window.location="../../gonsuncn/export4Alarm?&deviceIds="+deviceIds+"&alarmLevel="+alarmLevel+"&alarmFlag="+alarmFlag+"&bsLevel="+bsLevel+"&bsArea="+bsArea+"&bsId="+bsId+"&bsName="+bsName+"&startTime="+startTime+"&endTime="+endTime;
			xh.maskHide();
		};
		/* 显示按钮修改model */
		$scope.showEditModel = function() {
			var checkVal = [];
			$("[name='tb-check']:checkbox").each(function() {
				if ($(this).is(':checked')) {
					checkVal.push($(this).attr("index"));
				}
			});
			if (checkVal.length != 1) {
				swal({
					title : "提示",
					text : "只能选择一条数据",
					type : "error"
				});
				return;
			}
			$("#edit").modal('show');
			$scope.editData = $scope.data[parseInt(checkVal[0])];
			$scope.roleId=$scope.editData.roleId.toString();
			
		};
		
		/*下拉框改变时触发函数*/
		$scope.change = function(x){

		};
		
		/* 查询数据 */
		$scope.search = function(page) {
			var $scope = angular.element(appElement).scope();
			/*获取选中的checkbox和告警等级*/
			var deviceIds=[];
			$(".form-inline input:checked").each(function(i){
				deviceIds.push($(this).val());
			});
			var alarmLevel = $("#alarmLv  option:selected").val();
			var alarmFlag = $("#alarmFlags option:selected").val();
			var bsLevel = $("#bsLevel  option:selected").val();
			var bsArea = $("#bsArea  option:selected").val();
			
			var bsId = $("#bsId").val();
			var bsName = $("#bsName").val();
			
			var startTime = $("#startTime").val();
			var endTime = $("#endTime").val();
			
			var pageSize = $("#page-limit").val();
			var start = 1, limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;

			} else {
				start = (page - 1) * pageSize;
			}
			xh.maskShow();
			$http.get("../../gonsuncn/alarmlist?start="+start+"&limit="+pageSize+"&deviceIds="+deviceIds+"&alarmLevel="+alarmLevel+"&alarmFlag="+alarmFlag+"&bsLevel="+bsLevel+"&bsArea="+bsArea+"&bsId="+bsId+"&bsName="+bsName+"&startTime="+startTime+"&endTime="+endTime).
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				xh.pagging(page, parseInt($scope.totals),$scope);
			});
		};
		//分页点击
		$scope.pageClick = function(page,totals, totalPages) {
			var $scope = angular.element(appElement).scope();
			/*获取选中的checkbox和告警等级*/
			var deviceIds=[];
			$(".form-inline input:checked").each(function(i){
				deviceIds.push($(this).val());
			});
			var alarmLevel = $("#alarmLv  option:selected").val();
			var alarmFlag = $("#alarmFlags option:selected").val();
			var bsLevel = $("#bsLevel  option:selected").val();
			var bsArea = $("#bsArea  option:selected").val();
			
			var bsId = $("#bsId").val();
			var bsName = $("#bsName").val();
			
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
			xh.maskShow();
			$http.get("../../gonsuncn/alarmlist?start="+start+"&limit="+pageSize+"&deviceIds="+deviceIds+"&alarmLevel="+alarmLevel+"&alarmFlag="+alarmFlag+"&bsLevel="+bsLevel+"&bsArea="+bsArea+"&bsId="+bsId+"&bsName="+bsName+"&startTime="+startTime+"&endTime="+endTime).
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
		
		$scope.selectForEMH();
		$scope.alarmlist();
		$scope.alarmModel();
		
		xh.loadPieDev();
		xh.loadPieLv();
		//定时刷新
		/*setInterval(function() {
			$scope.refresh();
			var selectAlarmStatus = $("#selectAlarmStatus  option:selected").val();
			$scope.selectForStatus(selectAlarmStatus);
			$scope.alarmModel();
		}, 60000);*/
		
	});
	
	
};

var deviceName = {"760300000000001":"FSU","080200000000001":"EPS","170100000000001":"温度","170200000000001":"湿度","170300000000001":"水浸",
"170400000000001":"烟感","170500000000001":"红外","170700000000001":"门磁","920100000000001":"电表"}

/* 传感器统计图 */
xh.loadPieDev = function() {
	// 设置容器宽高
	 var resizeBarContainer = function() {
	  $("#alarmPie").width(parseInt($("#alarmPie").parent().width()));
	  $("#alarmPie").height(parseInt($("#leftChoose").height()));
	  };
	  resizeBarContainer();
	 
	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	require([ 'echarts', 'echarts/chart/pie' ], function(ec) {
		chart = ec.init(document.getElementById('alarmPie'));
		chart.showLoading({
			text : '正在努力的读取数据中...'
		});
		var option = {
			    /*title : {
			        text: '基站环控告警统计',
			        subtext: '传感器分类',
			        x:'center'
			    },*/
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient : 'vertical',
			        x : 'left',
			        data:[]
			    },
			    toolbox: {
			        show : true,
			        feature : {
			            /*mark : {show: true},
			            dataView : {show: true, readOnly: false},
			            magicType : {
			                show: true, 
			                type: ['pie', 'funnel'],
			                option: {
			                    funnel: {
			                        x: '25%',
			                        width: '50%',
			                        funnelAlign: 'left',
			                        max: 1548
			                    }
			                }
			            },*/
			            restore : {show: true}
			            /*saveAsImage : {show: true}*/
			        }
			    },
			    calculable : true,
			    series : [
			        {
			            name:'告警传感器',
			            type:'pie',
			            radius : '55%',
			            center: ['55%', '55%'],
			            data:[
			                {value:752, name:'温度'},
			                {value:899, name:'湿度'},
			                {value:567, name:'EPS'},
			                {value:118, name:'电表'},
			                {value:442, name:'水浸'},
			                {value:335, name:'烟雾'},
			                {value:310, name:'红外'},
			                {value:234, name:'门磁'},
			                {value:1548, name:'FSU'}
			            ]
			        }
			    ]
			};
		$.ajax({
			type : "GET",
			url : "../../gonsuncn/alarmForDev",
			dataType : "json",
			success : function(dataMap) {
				var tempData = dataMap.alarmDevice;
				var legendData = [];
				var seriesData = [];
				for(var i=0;i<tempData.length;i++){
					var deviceId = tempData[i].deviceId;
					legendData.push(deviceName[''+deviceId+'']);
					var tempMap = {value:tempData[i].alarmNum, name:deviceName[''+deviceId+'']};
					seriesData.push(tempMap);
				};
				
				option.legend.data=legendData;
				option.series[0].data=seriesData;
				
				chart.hideLoading();
				chart.setOption(option);
			}
		});
		

	});
	// 用于使chart自适应高度和宽度
	window.onresize = function() {
		// 重置容器高宽
		chart.resize();
	};
};
/* 级别统计图 */
xh.loadPieLv = function() {
	// 设置容器宽高
	 var resizeBarContainer = function() {
	  $("#alarmLevs").width(parseInt($("#alarmLevs").parent().width()));
	  $("#alarmLevs").height(parseInt($("#leftChoose").height()));
	  };
	  resizeBarContainer();
	 
	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	require([ 'echarts', 'echarts/chart/pie' ], function(ec) {
		chart = ec.init(document.getElementById('alarmLevs'));
		chart.showLoading({
			text : '正在努力的读取数据中...'
		});
		var option = {
				/*title : {
			        text: '基站环控告警统计',
			        subtext: '级别分类',
			        x:'center'
			    },*/
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient : 'vertical',
			        x : 'left',
			        data:[]
			    },
			    toolbox: {
			        show : true,
			        feature : {
			            /*mark : {show: true},
			            dataView : {show: true, readOnly: false},
			            magicType : {
			                show: true, 
			                type: ['pie', 'funnel'],
			                option: {
			                    funnel: {
			                        x: '25%',
			                        width: '50%',
			                        funnelAlign: 'center',
			                        max: 1548
			                    }
			                }
			            },*/
			            restore : {show: true}
			            /*saveAsImage : {show: true}*/
			        }
			    },
			    calculable : true,
			    series : [
			        {
			            name:'告警级别',
			            type:'pie',
			            radius : ['55%', '60%'],
			            center: ['50%', '55%'],
			            itemStyle : {
			                normal : {
			                    label : {
			                        show : false
			                    },
			                    labelLine : {
			                        show : false
			                    }
			                },
			                emphasis : {
			                    label : {
			                        show : true,
			                        position : 'center',
			                        textStyle : {
			                            fontSize : '18',
			                            fontWeight : 'bold'
			                        }
			                    }
			                }
			            },
			            data:[]
			        }
			    ]
			};
		
		$.ajax({
			type : "GET",
			url : "../../gonsuncn/alarmForLevel",
			dataType : "json",
			success : function(dataMap) {
				var tempData = dataMap.alarmLevel;
				var legendData = [];
				var seriesData = [];
				for(var i=0;i<tempData.length;i++){
					legendData.push(tempData[i].alarmlevel+"级告警");	
					var tempMap = {value:tempData[i].alarmNum, name:tempData[i].alarmlevel+"级告警"};
					seriesData.push(tempMap);
				}
				option.legend.data=legendData;
				option.series[0].data=seriesData;
				
				chart.hideLoading();
				chart.setOption(option);
			}
		});

	});
	// 用于使chart自适应高度和宽度
	window.onresize = function() {
		// 重置容器高宽
		chart.resize();
	};
};

/* 数据分页 */
xh.pagging = function(currentPage,totals, $scope) {
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
			visiblePages : 7,
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
xh.add = function() {
	/*获取选中的checkbox和告警等级*/
	var deviceIds=[];
	$(".form-inline input:checked").each(function(i){
		deviceIds.push($(this).val());
	});
	var alarmLevel = $("#alarmLv  option:selected").val();
	var alarmFlag = $("#alarmFlags option:selected").val();
	var bsLevel = $("#bsLevel  option:selected").val();
	var bsArea = $("#bsArea  option:selected").val();
	
	var bsId = $("#bsId").val();
	var bsName = $("#bsName").val();
	
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	
	window.location="../../gonsuncn/export4Alarm?&deviceIds="+deviceIds+"&alarmLevel="+alarmLevel+"&alarmFlag="+alarmFlag+"&bsLevel="+bsLevel+"&bsArea="+bsArea+"&bsId="+bsId+"&bsName="+bsName+"&startTime="+startTime+"&endTime="+endTime;
	/*$.ajax({
		url : '../../gonsuncn/export4Alarm',
		type : 'POST',
		dataType : "json",
		async : false,
		data : $("#addForm").serializeArray(),
		success : function(data) {
			$('#add').modal('hide');
			xh.load();
			toastr.success("导出成功", '提示');	
		},
		error : function() {
		}
	});*/
};


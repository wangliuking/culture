if (!("xh" in window)) {
	window.xh = {};
};
require.config({
	paths : {
		echarts : '../../lib/echarts'
	}
});
var frist = 0;
var appElement = document.querySelector('[ng-controller=bsForGis]');
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
	var pageSize = 1000;
	app.controller("bsForGis", function($scope, $http) {
		
		$http.get("../../amap/map/selectForAllVisableStatus").success(
				function(response) {
					$scope.selectForAllVisableStatus=response.items;
					$scope.mapInitStr=response.mapInitStr;
					console.log("selectForAllVisableStatus : "+$scope.selectForAllVisableStatus);
					console.log("mapInitStr : "+$scope.mapInitStr);
				});
		
		$scope.selectForArea = function (zone){
			/* 获取信息 */
			$http.get("../../amap/map/gisViewByUserIdAndZoneForShow?zone="+zone).success(
					function(response) {
						console.log(response.items);
						$scope.bs_search_data = response.items;
						$scope.selectedArea = zone;
					});
		}		
		//保存
		$scope.save=function(){
			var checkbox=$(".bsList").find("[type='checkbox']");			
			var listMap=[];
			for(var i=0;i<checkbox.length;i++){
				if(checkbox[i].checked==true){
					var tempMap = {"bsId":checkbox[i].value,"showStatus":"1"};
					listMap.push(tempMap);
				}else{
					var tempMap = {"bsId":checkbox[i].value,"showStatus":"0"};
					listMap.push(tempMap);
				}
			}	
			console.log(listMap);
			$.ajax({
				url : '../../amap/map/gisViewSave',
				type : 'post',
				dataType : "json",
				contentType: "application/json",
				data : JSON.stringify(listMap),
				success : function(data) {
					$('#myModal').modal('hide');
					toastr.success("配置成功", '提示');
					
				},
				error : function() {
					toastr.error("配置失败", '提示');
				}
			});
		}
		
		//保存参数配置
		$scope.saveParam=function(){
			var mapInit=$('.radioTemp input:radio:checked').val();
			var checkbox=$(".radioList").find("[type='checkbox']");			
			var listMap=[];
			for(var i=0;i<checkbox.length;i++){
				if(checkbox[i].checked==true){
					var tempMap = {"radioId":checkbox[i].value,"visable":"1"};
					listMap.push(tempMap);
				}else{
					var tempMap = {"radioId":checkbox[i].value,"visable":"0"};
					listMap.push(tempMap);
				}
			}	
			console.log("mapInit : "+mapInit);
			$.ajax({
				url : '../../amap/map/saveForAllVisable?mapInit='+mapInit,
				type : 'post',
				dataType : "json",
				contentType: "application/json",
				data : JSON.stringify(listMap),
				success : function(data) {
					toastr.success("配置成功", '提示');					
				},
				error : function() {
					toastr.error("配置失败", '提示');
				}
			});
		}
		
	});
	
	// 使用ajax获取后台所有基站数据
	$.ajax({
		type : "GET",
		url : "../../bs/map/data",
		dataType : "json",
		success : function(dataMap) {
			var data = dataMap.items;
			xh.loadMap(data);
		}
	});
	
};

/* 地图拓扑测试  */
xh.loadMap = function(data) {
	var objConnect = [];
	for (k = 0; k < data.length; k++) {
		var y = {
				name : data[k].name,
				geoCoord : [data[k].lng, data[k].lat]
				};
			objConnect.push(y);		
	}
	
	// 设置容器宽高
	 var resizeBarContainer = function() {
	  $("#mapTest").width(parseInt($("#mapTest").parent().width()));
	  $("#mapTest").height(600);
	  };
	  resizeBarContainer();
	 
	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	require([ 'echarts', 'echarts/chart/map' ], function(ec) {
		chart = ec.init(document.getElementById('mapTest'));
		chart.showLoading({
			text : '正在努力的读取数据中...'
		});
		var cityMap = {			    
			    "成都市": "510100"
			};
			var curIndx = 0;
			var mapType = [];
			var mapGeoData = require('echarts/util/mapData/params');
			for (var city in cityMap) {
			    mapType.push(city);
			    // 自定义扩展图表类型
			    mapGeoData.params[city] = {
			        getGeoJson: (function (c) {
			            var geoJsonName = cityMap[c];
			            return function (callback) {
			                $.getJSON('../../Controllers/operations/510100.json', callback);
			            }
			        })(city)
			    }
			}

			var ecConfig = require('echarts/config');
			var zrEvent = require('zrender/tool/event');
			
			chart.on('click', function(params) {
				var appElement = document.querySelector('[ng-controller=bsForGis]');
				var $scope = angular.element(appElement).scope();
				var zone = params.name;
				$scope.selectForArea(zone);
				$('#myModal').modal();
			});
			
			var option = {
			    title: {
			        text : '成都市区域图',
			        link : '',
			        subtext : '成都市'
			    },
			    /*tooltip : {
			        trigger: 'item',
			        formatter: '{b}'
			    },*/
			    series : [
			        {
			            name: '成都市地图',
			            type: 'map',
			            mapType: '成都市',
			            selectedMode : 'single',
			            clickable : true ,
			            itemStyle:{
			                normal:{label:{show:true}},
			                emphasis:{label:{show:true}}
			            },
			            data:[],
			            markPoint : {
			            	clickable : false ,
							symbol : 'circle',
							symbolSize: function(v){
								return 2;
							},  
							effect : {
							    "show": false,
							    "type": "scale",
							    "loop": true,
							    "period": 15,
							    "scaleSize": 2,
							    "bounceDistance": 10,
							    "color": 'green',
							    "shadowColor": 'green',
							    "shadowBlur": 0
							},
							itemStyle : {
								normal : {
									color : 'yellow'
								},
								emphasis : {
									color : 'yellow'
								}
							},
			                data:[]//objConnect
						}
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
$("#selectAll").bind("click", function() {
	if($(".bsList").find("[type='checkbox']").prop("checked")){
		$(".bsList").find("[type='checkbox']").prop("checked", false);
	}else{
		$(".bsList").find("[type='checkbox']").prop("checked", true);
	}
	// 全选
});

$("#selectOther").bind("click", function() {
	var checkbox=$(".bsList").find("[type='checkbox']");
	
	for(var i=0;i<checkbox.length;i++){
		if(checkbox[i].checked==true){
			checkbox[i].checked=false;
		}else{
			checkbox[i].checked=true;
		}
	}
	
	/*if($("#form").find("[type='checkbox']").is(':checked')){
		$("#form").find("[type='checkbox']").prop("checked", false);
	}else{
		$("#form").find("[type='checkbox']").prop("checked", true);
	}*/
});




/**
 * 用户管理
 */
if (!("xh" in window)) {
	window.xh = {};
};

require.config({
	paths : {
		echarts : '../../lib/echarts'
	}
});
var appElement = document.querySelector('[ng-controller=monitor]');
xh.load = function() {
	var app = angular.module("app", []);
	app.controller("monitor", function($scope, $http) {

		$(window).resize(function () {          //当浏览器大小变化时
			xh.bsBar();
		});
		$scope.hideMenu = function() {
			$("body").toggleClass("hide-menu");
		};
	
	   //系统告警模块
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
				
				$scope.tera=$scope.mscTotals+$scope.bsTotals;
				
			});
		}

		
		
		$scope.bsMapCount = function() {
			$http.get("../../bsstatus/bsMapCount").success(function(data) {
				$scope.countData=data;
				$scope.bsOffline=data.bsOffline;
				
				/*$("#bs").html(data.bsOffline);
				$("#msc").html(data.mscOffline);
				$("#emh").html(data.emhAlarm);*/
				
			});
			
		};

	
		
		$scope.bsMapCount();
		$scope.alarmModel();
		xh.bsBar();
		$('input[name="type"]').on('click',function(){ 
			$scope.alarmModel();
			
		});
		setInterval(function(){
			$scope.bsMapCount();
			}, 200000);
		setInterval(function(){
			$scope.alarmModel();
			}, 240000);
		setInterval(function(){
			xh.bsBar();
			}, 280000);

	});
};

xh.bsBar = function() {
	// 设置容器宽高
	var resizeBarContainer = function() {
		$("#bs-bar").width(parseInt($("#bs-bar").parent().width())+70);
		$("#bs-bar").height(503);
	};
	resizeBarContainer();

	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	require([ 'echarts', 'echarts/chart/bar' ], function(ec) {
		chart = ec.init(document.getElementById('bs-bar'));
		/*chart.showLoading({
			text : '正在努力的读取数据中...'
		});*/
		var option = {
			    title : {
			        text: '各区域设备工作状态异常的基站数量',
			        textStyle:{  
                        /*fontWeight:"bolder", */ 
                        color:"#000"  
                    }
			    },
			    tooltip : {
			        trigger: 'axis'
			    },
			    legend: {
			        data:['三期','四期'],
			        textStyle:{  
                        /*fontWeight:"bolder", */ 
                        color:"#000"  
                    }
			    },
			    
			    calculable : true,
			    xAxis : [
			        {
			            type : 'category',
			            
			            data : [],
			          //设置字体倾斜  
	                    axisLabel:{  
	                        interval:0,  
	                        rotate:45,//倾斜度 -90 至 90 默认为0  
	                        margin:2,  
	                        textStyle:{  
	                            /*fontWeight:"bolder", */ 
	                            color:"#000"  
	                        }  
	                    }
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:'三期',
			            type:'bar',
			            /*barWidth: 20,*///固定柱子宽度
			            data:[],
			            /*barGap:'10%',*/
			            barCategoryGap:'40%',
			            itemStyle:{
			            	normal:{
			            		color:'green',
			            		cursor:'pointer',
			            		label: {  
		                                show: true,//是否展示  
		                                textStyle: {  
		                                    fontWeight:'bolder',  
		                                    fontSize : '12',  
		                                    fontFamily : '微软雅黑',  
		                                }  
		                            }
			            	}}/*,
			            
			            markPoint : {
			                data : [
			                    {type : 'max', name: '最大值'},
			                    {type : 'min', name: '最小值'}
			                ]
			            }*/
			        },
			        {
			            name:'四期',
			            type:'bar',
			           /* barWidth: 20,*///固定柱子宽度
			            data:[],
			            /*barGap:'10%',*/
			           /* barCategoryGap:50,*/
			            itemStyle:{
			            	normal:{
			            		color:'#FF00FF',
			            		cursor:'pointer',
			            		label: {  
		                                show: true,//是否展示  
		                                textStyle: {  
		                                    fontWeight:'bolder',  
		                                    fontSize : '12',  
		                                    fontFamily : '微软雅黑',  
		                                }  
		                            }
			            	}}
			        }/*,
			        {
			            name:'三四期',
			            type:'bar',
			            barWidth: 17,//固定柱子宽度
			            data:[],
			            barGap:2,
			            barCategoryGap:2,
			            itemStyle:{
			            	normal:{
			            		color:'#D2691E',
			            		cursor:'pointer',
			            		
			            		label: {  
		                                show: true,//是否展示 ,
		                             
		                                textStyle: {  
		                                    fontWeight:'bolder',  
		                                    fontSize : '12',  
		                                    fontFamily : '微软雅黑',  
		                                }  
		                            }
			            	}}
			        }*/
			    ]
			};
		
		$.ajax({
			url : '../../bsstatus/bsZoneAlarm',
			type : 'GET',
			dataType : "json",
			async : true,
			data:{
				//period:type.join(",")
			},
			success : function(response) {

				/*var data = response.items;
				option.series[0].data = data;*/
				/*var data = response.items;
				var y=[],x=[];
				
				for(var i=0;i<data.length;i++){
					y.push(data[i].name);
					x.push(data[i].value);
					
				}*/
				option.xAxis[0].data=response.name;
				option.series[0].data=response.list3;
				option.series[1].data=response.list4;
				//option.series[2].data=response.list;
				chart.setOption(option);
				chart.on('click',function(params){
					var name=params.name;
					window.location.href="bsstatus.html?zone="+name;
				})
			},
			error : function() {
			}
		});

	});
	

};

xh.bsChart = function() {
	// 设置容器宽高
	var resizeBsContainer = function() {
		$("#bs-chart").width(parseInt($("#bs-chart").parent().width()));
		$("#bs-chart").height(300);
	};
	resizeBsContainer();

	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	require([ 'echarts', 'echarts/chart/pie' ], function(ec) {
		chart = ec.init(document.getElementById('bs-chart'));
		chart.showLoading({
			text : '正在努力的读取数据中...'
		});
		var labelTop = {
			normal : {
				color : function(params) {
					// build a color map as your need.
					var colorList = [ 'green', 'red', 'green', 'green' ];
					return colorList[params.dataIndex];
				},
				label : {
					show : true,
					position : 'center',
					formatter : "{b} : {c}",
					textStyle : {
						baseline : 'bottom'
					}
				},
				labelLine : {
					show : false
				}
			}
		};
		var labelFromatter = {
			normal : {
				color : function(params) {
					// build a color map as your need.
					var colorList = [ 'green', 'red', 'green', 'green' ];
					return colorList[params.dataIndex];
				},
				label : {
					formatter : function(params) {
						return params.value
					},
					textStyle : {
						baseline : 'top'
					}
				}
			},
		};
		var labelBottom = {
			normal : {
				color : '#ccc',
				label : {
					show : true,
					position : 'center'
				},
				labelLine : {
					show : false
				}
			},
			emphasis : {
				color : 'green'
			}
		};
		var radius = [ 40, 55 ];
		option = {
			legend : {
				x : 'center',
				y : 'center',
				style : 'margin-top:50px;',
				data : [ '基站', '交换中心', '调度台', '系统故障' ]
			},
			title : {
				text : '系统实时监测',
				subtext : '',
				x : 'center'
			},
			color : [ 'red', 'red', 'red', 'red' ],
			series : [ {
				type : 'pie',
				center : [ '10%', '30%' ],
				radius : radius,
				x : '0%', // for funnel
				itemStyle : labelFromatter,
				data : [ {
					name : 'other',
					value : 46,
					itemStyle : labelBottom
				}, {
					name : '基站',
					value : 54,
					itemStyle : labelTop
				} ]
			}, {
				type : 'pie',
				center : [ '40%', '30%' ],
				radius : radius,
				x : '20%', // for funnel
				itemStyle : labelFromatter,
				data : [ {
					name : 'other',
					value : 56,
					itemStyle : labelBottom
				}, {
					name : '交换中心',
					value : 44,
					itemStyle : labelTop
				} ]
			}, {
				type : 'pie',
				center : [ '60%', '30%' ],
				radius : radius,
				x : '40%', // for funnel
				itemStyle : labelFromatter,
				data : [ {
					name : 'other',
					value : 65,
					itemStyle : labelBottom
				}, {
					name : '调度台',
					value : 35,
					itemStyle : labelTop
				} ]
			}, {
				type : 'pie',
				center : [ '90%', '30%' ],
				radius : radius,
				x : '60%', // for funnel
				itemStyle : labelFromatter,
				data : [ {
					name : '系统故障',
					value : 30,
					itemStyle : labelTop
				} ]
			} ]
		};
		chart.hideLoading();
		chart.setOption(option);

	});

};

/**
 * Tetra告警显示
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
var appElement = document.querySelector('[ng-controller=bsAlarm]');
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
	app.filter('alarmLocation', function() { //可以注入依赖
	    return function(text) {
	    	
	    	if(text.indexOf("交换中心")==0){
	    		return text.split(".")[4]+"."+text.split(".")[5];
	    	}else{
	    		return text;
	    	}
	        
	    };
	});
	/*var bsId = $("#bsId").val();
	var bsName = $("#name").val();*/
	var pageSize = $("#page-limit").val();
	app.controller("bsAlarm", function($scope, $http) {
		$scope.count = "15";// 每页数据显示默认值
		$scope.page=1;
		//加载故障等级统计图
		xh.loadbsAlarmTypePie();
		xh.bsBar();
		xh.maskShow();
		var startTime=$("input[name='startTime']").val();
		var endTime=$("input[name='endTime']").val();
		var level_value =[],type_value=[],category_value=[],status_value=[]; 
		$('input[name="level"]:checked').each(function(){ 
		level_value.push($(this).val()); 
		}); 
		$('input[name="type"]:checked').each(function(){ 
			type_value.push($(this).val()); 
		});
		$('input[name="category"]:checked').each(function(){ 
			category_value.push($(this).val()); 
		});
		$('input[name="status"]:checked').each(function(){ 
			status_value.push($(this).val()); 
		});
		$http.get("../../bsAlarm/list?start=0&limit=" + pageSize+"&type="+type_value.join(",")+
				"&level="+level_value.join(",")+"&category="+category_value.join(",")+"&status="+status_value.join(",")+"&startTime="+startTime+"&endTime="+endTime).success(
				function(response) {
					xh.maskHide();
					$scope.data = response.data;
					$scope.totals = response.totals;
					xh.pagging(1, parseInt($scope.totals), $scope);
				});
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
		};
		$scope.detail=function(){
			
		}
		/*用户列表*/
		$scope.userList=function(){
			$http.get("../../order/userlist").success(
					function(response) {
						$scope.userData = response.items;
						console.log("11")
					});
		}
		/* 显示警告详情 */
		$scope.showDetails = function(id){
			$("#bsAlarmDetails").modal('show');
			$scope.bsAlarmData=$scope.data[id];
		};
		//派单
		$scope.showOrderWin = function(){
			
			$scope.nowDate=xh.nowDate();
			$scope.userList();
			$("#order").modal('show');
		};
		
		/*$scope.alarmType=function(){
			$http.get("../../bsAlarm/data/bsAlarmLevelChart").success(
					function(response) {
					
						$scope.alarmTypeData = response.items;
					});
		}*/
		/* 查询历史告警数据 */
		$scope.search = function(page) {
			xh.maskShow();
			var pageSize = $("#page-limit").val();
			var startTime=$("input[name='startTime']").val();
			var endTime=$("input[name='endTime']").val();
			var level_value =[],type_value=[],category_value=[],status_value=[]; 
			$('input[name="level"]:checked').each(function(){ 
			level_value.push($(this).val()); 
			}); 
			$('input[name="type"]:checked').each(function(){ 
				type_value.push($(this).val()); 
			});
			$('input[name="category"]:checked').each(function(){ 
				category_value.push($(this).val()); 
			});
			$('input[name="status"]:checked').each(function(){ 
				status_value.push($(this).val()); 
			});
			$scope.page=page;
			var start = 1, limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;

			} else {
				start = (page - 1) * pageSize;
			}
		
			$http.get("../../bsAlarm/list?start="+start+"&limit=" + pageSize+"&type="+type_value.join(",")+
					"&level="+level_value.join(",")+"&category="+category_value.join(",")+"&status="+status_value.join(",")+"&startTime="+startTime+"&endTime="+endTime).success(
					function(response) {
						xh.maskHide();
						$scope.data = response.data;
						$scope.totals = response.totals;
						xh.pagging(page, parseInt($scope.totals), $scope);
					});
		};
		/* 确认故障 */
		$scope.identifyBsAlarm = function(id){
			swal({
				title : "确认告警",
				text : "确认该告警吗？",
				type : "info",
				showCancelButton : true,
				confirmButtonColor : "#82AF6F",
				confirmButtonText : "确认",
				cancelButtonText : "取消"
			/*
			 * closeOnConfirm : false, closeOnCancel : false
			 */
			}, function(isConfirm) {
				if (isConfirm) {
					$.ajax({
						url : '../../bsAlarm/identifyBsA',
						type : 'post',
						dataType : "json",
						data : {
							bsId : id
						},
						async : false,
						success : function(data) {
							if (data.success) {
								toastr.success("已确认", '提示');
								$scope.refresh();
							} else {
								swal({
									title : "提示",
									text : "告警确认失败",
									type : "error"
								});
							}
						},
						error : function() {
							$scope.refresh();
						}
					});
				}
			});
		};
		// 分页点击
		$scope.pageClick = function(page, totals, totalPages) {
			xh.maskShow();
			var pageSize = $("#page-limit").val();
			var startTime=$("input[name='startTime']").val();
			var endTime=$("input[name='endTime']").val();
			var level_value =[],type_value=[],category_value=[],status_value=[]; 
			$('input[name="level"]:checked').each(function(){ 
			level_value.push($(this).val()); 
			}); 
			$('input[name="type"]:checked').each(function(){ 
				type_value.push($(this).val()); 
			});
			$('input[name="category"]:checked').each(function(){ 
				category_value.push($(this).val()); 
			});
			$('input[name="status"]:checked').each(function(){ 
				status_value.push($(this).val()); 
			});
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			$scope.page=page;
			
			$http.get("../../bsAlarm/list?start="+start+"&limit=" + pageSize+"&type="+type_value.join(",")+
					"&level="+level_value.join(",")+"&category="+category_value.join(",")+"&status="+status_value.join(",")+"&startTime="+startTime+"&endTime="+endTime).success(function(response) {
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
						$scope.data = response.data;
						$scope.totals = response.totals;
					});

		};
		//显示查询框
		$scope.showSearchWin=function(){
			$("#search").modal('toggle');
			//$(".modal-backdrop").remove();//删除class值为modal-backdrop的标签，可去除阴影
		}
		//xh.search_time();
		/*$scope.alarmType();*/
		$scope.ss=function(){
			$scope.search(1);
			xh.bsBar();
			xh.loadbsAlarmTypePie();
			$("#search").modal("hide");
		}
		/*$('input[name="level"]').on('click',function(){ 
			
		});*/
	/*	$('input[name="type"]').on('click',function(){ 
			$scope.search(1);
			xh.bsBar();
			xh.loadbsAlarmTypePie();
		}); 
		$('input[name="category"]').on('click',function(){ 
			$scope.search(1);
			xh.bsBar();
			xh.loadbsAlarmTypePie();
		}); 
		$('input[name="status"]').on('click',function(){ 
			$scope.search(1);
			xh.bsBar();
			xh.loadbsAlarmTypePie();
		}); 
		$('input[name="startTime"]').blur(function(){ 
			$scope.search(1);
			xh.bsBar();
			xh.loadbsAlarmTypePie();
		});
		$('input[name="endTime"]').blur(function(){ 
			$scope.search(1);
			xh.bsBar();
			xh.loadbsAlarmTypePie();
		});*/
		
		/*setInterval(function(){
			$scope.search($scope.page);
			xh.bsBar();
			xh.loadbsAlarmTypePie();
		}, 30000)*/
	});
};

xh.search_time=function(){
	var t1=xh.nowDate();
	var t2=xh.nowDateStart();
	$('input[name="startTime"]').val();
	$('input[name="endTime"]').val();
	
}
// 刷新数据
xh.refresh = function() {
	var appElement = document.querySelector('[ng-controller=bsAlarm]');
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();

};
/**
 * 故障等级统计图 
 */
xh.bsBar = function() {
	// 设置容器宽高
	var resizeBarContainer = function() {
		$("#bs-bar").width(parseInt($("#bs-bar").parent().width())+70);
		$("#bs-bar").height(200);
	};
	resizeBarContainer();
	var startTime=$("input[name='startTime']").val();
	var endTime=$("input[name='endTime']").val();
	var level_value =[],type_value=[]; 
	$('input[name="level"]:checked').each(function(){ 
	level_value.push($(this).val()); 
	}); 
	$('input[name="type"]:checked').each(function(){ 
		type_value.push($(this).val()); 
	});

	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	require([ 'echarts', 'echarts/chart/bar' ], function(ec) {
		chart = ec.init(document.getElementById('bs-bar'));
		var option = {
			    title : {
			        /*text: 'Tera系统[基站，交换中心，网管，调度台]告警统计'*/
			    },
			    tooltip : {
			        trigger: 'axis'
			    },
			    legend: {
			        data:['Tera系统[基站，交换中心，网管，调度台]告警统计'],
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
			            axisLabel:{  
	                        interval:0,   
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
			            type : 'value',
			            axisLabel:{  
	                        textStyle:{  
	                            /*fontWeight:"bolder", */ 
	                            color:"#000"  
	                        }  
	                    }
			            
			        }
			    ],
			    series : [
			        {
			            name:'Tera系统[基站，交换中心，网管，调度台]告警统计',
			            type:'bar',
			            barWidth: 30,//固定柱子宽度
			            data:[],
			            itemStyle:{
			            	normal:{
			            		color:'blue',
			            		cursor:'pointer'
			            	}},
			            
			            markPoint : {
			                data : [
			                    {type : 'max', name: '最大值'},
			                    {type : 'min', name: '最小值'}
			                ]
			            }
			        }
			    ]
			};
		
		$.ajax({
			url : '../../bsAlarm/data/bsAlarmTypeChart',
			type : 'GET',
			dataType : "json",
			async : true,
			data:{
				startTime:startTime,
				endTime:endTime,
				level:level_value.join(","),
				type:type_value.join(",")
			},
			success : function(response) {

				/*var data = response.items;
				option.series[0].data = data;*/
			
				
				var data = response.items;
				var y=[],x=[];
				
				for(var i=0;i<data.length;i++){
					y.push(data[i].name);
					x.push(data[i].value);
					
				}
				
			
				option.xAxis[0].data=y;
				option.series[0].data=x;
				chart.setOption(option);
				
				/*chart.on('click',function(params){
					var name=params.name;
					window.location.href="bsstatus.html?zone="+name;
				})*/
			},
			error : function() {
			}
		});

	});
	

};
/**
 * 故障类型统计
 */
xh.loadbsAlarmTypePie = function(){
	// 设置容器宽高
	var resizeBarContainer = function(){
		$("#bs-pie").width(parseInt($("#bs-pie").parent().width()));
		$("#bs-pie").height(200);
	}
	resizeBarContainer();
	var startTime=$("input[name='startTime']").val();
	var endTime=$("input[name='endTime']").val();
	var level_value =[],type_value=[]; 
	$('input[name="level"]:checked').each(function(){ 
	level_value.push($(this).val()); 
	}); 
	$('input[name="type"]:checked').each(function(){ 
		type_value.push($(this).val()); 
	});
	
	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if(chart != null){
		chart.clear();
		chart.dispose();
	}
	require([ 'echarts', 'echarts/chart/pie' ], function(ec) {
		chart = ec.init(document.getElementById('bs-pie'));
		chart.showLoading({
			text : '正在努力的读取数据中...'
		});
		var option = {
			title : {
				x : 'center',
				/*text : '故障类型统计图 ',*/
				subtext : '',
				textStyle : {
					color : '#000'
				}
			},
			tooltip : {
				trigger : 'item',
				formatter : "{a} <br/>{b} : {c} ({d}%)"
			},
			legend : {
				orient : 'vertical',
				x : 'left',
				data : [ '紧急告警', '主要告警', '次要告警', '一般告警' ]
			},
		
			calculable : true,
			/*backgroundColor : 'rgba(0,0,0,0.5)',*/
			series : [ {
				name : '类型',
				type : 'pie',
				radius : '50%',
				center : [ '60%', '50%' ],
				itemStyle : {
					normal : {
						color : function(params) {
							// build a color map as your need.
							var colorList = [ 'red', '#B22222', '#FF8C00','#EEEE00' ];
							return colorList[params.dataIndex];
						},
						label : {
							show : true,
							position : 'top',
							formatter : '{b}\n{c}'
						}
					}
				},
				data : []
			} ]
		};

		$.ajax({
			url : '../../bsAlarm/data/bsAlarmLevelChart',
			data : {
				startTime:startTime,
				endTime:endTime,
				level:level_value.join(","),
				type:type_value.join(",")
			},
			type : 'get',
			dataType : "json",
			async : false,
			success : function(response) {
				var data = response.items;
				var y=[],x=[];	
				for(var i=0;i<data.length;i++){
					y.push(data[i].name);
					x.push(data[i].value);
					
				}
				/*option.xAxis[0].data = y;*/
				option.series[0].data = data;
				chart.hideLoading();
				chart.setOption(option);

			},
			failure : function(response) {
			}
		});

	});
	/*// 用于使chart自适应高度和宽度
	window.onresize = function() {
		// 重置容器高宽
		chart.resize();
	};*/
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
xh.order=function(){
	var userid=$("span[name='userid']").text()
	if(userid==""){
		toastr.error("接单人不能为空", '提示');
		return;
	}
	var formData={
		bsid:1,
		bsname:'政府三办',
		userid:userid,
		dispatchtime:$("div[name='dispatchtime']").text(),
		dispatchman:$("div[name='dispatchman']").text(),
		errtype:$("div[name='errtype']").text(),
		errlevel:$("div[name='errlevel']").text(),
		errfoundtime:$("div[name='errfoundtime']").text(),
		errslovetime:$("div[name='errslovetime']").text(),
		progress:$("div[name='progress']").text(),
		proresult:$("div[name='proresult']").text(),
		workman:$("div[name='workman']").text(),
		auditor:$("div[name='auditor']").text(),
	}
	$.ajax({
		url : '../../order/writeOrder',
		data : {
			formData:JSON.stringify(formData)
			
		},
		type : 'post',
		dataType : "json",
		async : false,
		success : function(response) {
			var data = response;
			if(data.success){
				toastr.success("派单成功", '提示');
			}else{
				toastr.error("派单失败", '提示');
			}
			

		},
		failure : function(response) {
			toastr.error("派单失败", '提示');
		}
	});
}
xh.nowDate=function()   
{   
    var   today=new Date();      
    var   yesterday_milliseconds=today.getTime();    //-1000*60*60*24

    var   yesterday=new   Date();      
    yesterday.setTime(yesterday_milliseconds);      
        
    var strYear=yesterday.getFullYear(); 

    var strDay=yesterday.getDate();   
    var strMonth=yesterday.getMonth()+1; 
    
    var h=yesterday.getHours();
    var m=yesterday.getMinutes();
    var s=yesterday.getSeconds();

    if(strMonth<10)   
    {   
        strMonth="0"+strMonth;   
    } 
    if(strDay<10){
    	strDay="0"+strDay;
    }
    
    if(h<10){
    	h="0"+h;
    }
    if(m<10){
    	m="0"+m;
    }
    if(s<10){
    	s="0"+s;
    }
    var strYesterday=strYear+"-"+strMonth+"-"+strDay+" "+h+":"+m+":"+s;   
    return  strYesterday;
}
xh.nowDateStart=function()   
{   
    var   today=new Date();      
    var   yesterday_milliseconds=today.getTime();    //-1000*60*60*24

    var   yesterday=new   Date();      
    yesterday.setTime(yesterday_milliseconds);      
        
    var strYear=yesterday.getFullYear(); 

    var strDay=yesterday.getDate();   
    var strMonth=yesterday.getMonth()+1; 
    
    var h=yesterday.getHours();
    var m=yesterday.getMinutes();
    var s=yesterday.getSeconds();

    if(strMonth<10)   
    {   
        strMonth="0"+strMonth;   
    } 
    if(strDay<10){
    	strDay="0"+strDay;
    }
    
    if(h<10){
    	h="0"+h;
    }
    if(m<10){
    	m="0"+m;
    }
    if(s<10){
    	s="0"+s;
    }
    var strYesterday=strYear+"-"+strMonth+"-"+strDay+" 00:00:00";   
    return  strYesterday;
}
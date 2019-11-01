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
		/*xh.loadbsAlarmTypePie();
		xh.bsBar();*/
		$scope.nowDate=xh.nowDate();
		$scope.oneDate=xh.oneDate();
		var startTime=xh.oneDate();
		var endTime=xh.nowDate();
		var bsId=$("input[name='bsId']").val();
		$http.get("../../bsstatus/bsflash?start=0&limit=" + pageSize+"&bsId="+bsId+
				"&startTime="+startTime+"&endTime="+endTime).success(
				function(response) {
					$scope.data = response.items;
					$scope.totals = response.totals;
					xh.pagging(1, parseInt($scope.totals), $scope);
				});
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
		};
		/*用户列表*/
	/*	$scope.userList=function(){
			$http.get("../../order/userlist").success(
					function(response) {
						$scope.userData = response.items;
						console.log("11")
					});
		}*/
		/* 显示警告详情 */
		$scope.showDetails = function(id){
			$("#bsAlarmDetails").modal('show');
			$scope.bsAlarmData=$scope.data[id];
		};
		/* 查询历史告警数据 */
		$scope.search = function(page) {
			var pageSize = $("#page-limit").val();
			var startTime=$("input[name='startTime']").val();
			var endTime=$("input[name='endTime']").val();
			var bsId=$("input[name='bsId']").val();
			$scope.page=page;
			var start = 1, limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;

			} else {
				start = (page - 1) * pageSize;
			}
		
			$http.get("../../bsstatus/bsflash?start="+start+"&limit=" + pageSize+"&bsId="+bsId+
					"&startTime="+startTime+"&endTime="+endTime).success(
					function(response) {
						$scope.data = response.items;
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
			var pageSize = $("#page-limit").val();
			var startTime=$("input[name='startTime']").val();
			var endTime=$("input[name='endTime']").val();
			var bsId=$("input[name='bsId']").val();
			
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			$scope.page=page;
			
			$http.get("../../bsstatus/bsflash?start="+start+"&limit=" + pageSize+"&bsId="+bsId+
					"&startTime="+startTime+"&endTime="+endTime).success(function(response) {
						
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
		//显示查询框
		$scope.showSearchWin=function(){
			$("#search").modal('toggle');
			//$(".modal-backdrop").remove();//删除class值为modal-backdrop的标签，可去除阴影
		}
		/*$scope.alarmType();*/
		$('input[name="level"]').on('click',function(){ 
			$scope.search(1);
			/*xh.bsBar();
			xh.loadbsAlarmTypePie();*/
		});
		$('input[name="type"]').on('click',function(){ 
			$scope.search(1);
			/*xh.bsBar();
			xh.loadbsAlarmTypePie();*/
		}); 
		$('input[name="startTime"]').blur(function(){ 
			$scope.search(1);
			/*xh.bsBar();
			xh.loadbsAlarmTypePie();*/
		});
		$('input[name="endTime"]').blur(function(){ 
			$scope.search(1);
			/*xh.bsBar();
			xh.loadbsAlarmTypePie();*/
		});
		setInterval(function(){
			$scope.search($scope.page);
		}, 5000)
	});
};
// 刷新数据
xh.refresh = function() {
	var appElement = document.querySelector('[ng-controller=bsAlarm]');
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();

};
//基站运行记录
xh.excel=function(){
	xh.maskShow();
	var startTime=$("input[name='startTime']").val();
	var endTime=$("input[name='endTime']").val();
	$("#btn-run").button('loading');
	$.ajax({
		url : '../../bsstatus/ExcelToBsFlash',
		type : 'get',
		dataType : "json",
		data : {
			startTime:startTime,
			endTime:endTime
		},
		async : false,
		success : function(data) {
		
			$("#btn-run").button('reset');
			xh.maskHide();
			if (data.success) {
				window.location.href="../../bsstatus/downExcel?filePath="+data.pathName;
				
			} else {
				toastr.error("导出失败", '提示');
			}
		},
		error : function() {
			$("#btn-run").button('reset');
			toastr.error("导出失败", '提示');
			xh.maskHide();
		}
	});
	
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
xh.oneDate=function()   
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
xh.timeStamp=function(start,end){ 
	
	var time1=new Date(start);
	var time2=new Date(end);
	var second_time=(time2.getTime()-time1.getTime())/1000;
	
	var time = parseInt(second_time) + "秒";  
	if( parseInt(second_time )> 60){  	  
	    var second = parseInt(second_time) % 60;  
	    var min = parseInt(second_time / 60);  
	    time = min + "分" + second + "秒";  
	      
	    if( min > 60 ){  
	        min = parseInt(second_time / 60) % 60;  
	        var hour = parseInt( parseInt(second_time / 60) /60 );  
	        time = hour + "小时" + min + "分" + second + "秒";  
	  
	        if( hour > 24 ){  
	            hour = parseInt( parseInt(second_time / 60) /60 ) % 24;  
	            var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );  
	            time = day + "天" + hour + "小时" + min + "分" + second + "秒";  
	        }  
	    }        
	  
	}    
	return time;          
} 
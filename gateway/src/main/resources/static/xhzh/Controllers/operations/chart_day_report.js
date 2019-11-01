/**
 * 用户管理
 */
if (!("xh" in window)) {
	window.xh = {};
};
var frist = 0;
var appElement = document.querySelector('[ng-controller=user]');
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
	
	app.filter('timeFormat', function() { //可以注入依赖
	    return function(text) {
	    	
	    	var time=xh.getTime(text);
	        return time;
	    };
	});
	

	app.controller("user", function($scope, $http) {
		
		$scope.count = "15";//每页数据显示默认值
		$scope.securityMenu=true; //菜单变色
		$scope.starttime=xh.getYMD(0);
		$scope.chart_day_report_dispatch=function(){
			xh.maskShow();
			//var time=$("#starttime").val()==""?xh.getYMD(0):$("#starttime").val();
			$http.get("../../report/chart_dispatch").
			success(function(response){
				xh.maskHide();
				$scope.dispatch_data = response.items;
				$scope.dispatch_totals = response.totals;			
				
			});
			
		}
		$scope.chart_server=function(){
			xh.maskShow();
			//var time=$("#starttime").val()==""?xh.getYMD(0):$("#starttime").val();
			$http.get("../../report/chart_server").
			success(function(response){
				xh.maskHide();
				$scope.server_one_data = response.one;
				$scope.server_one_totals = response.one_size;	
				$scope.server_two_data = response.two;
				$scope.server_two_totals = response.two_size;	
				
			});
			
		}
		$scope.chart_msc=function(){
			xh.maskShow();
			var time=$("#starttime").val()==""?xh.getYMD(0):$("#starttime").val();
			$http.get("../../report/chart_msc_call?time="+time).
			success(function(response){
				xh.maskHide();
				$scope.msc_data = response.items;
				$scope.msc_totals = response.totals;			
				
			});
			
		}
		$scope.chart_alarm=function(){
			xh.maskShow();
			var time=$("#starttime").val()==""?xh.getYMD(0):$("#starttime").val();
			$http.get("../../report/chart_eastcom_alarm?time="+time).
			success(function(response){
				xh.maskHide();
				$scope.alarm_now_data = response.now;	
				$scope.alarm_his_data = response.his;	
				
			});
			
		}
		
		/* 刷新数据 */
		$scope.refresh = function() {
			
			$('#xh-tabs a:first').tab('show');
			$scope.chart_bs_call();
		
		};
		$scope.chart_server();
		
		
		
	});
};

xh.excel=function(){
	var time=$("#starttime").val()==""?xh.getYMD(0):$("#starttime").val();
	xh.maskShow();
	//$("#btn-excel").button('loading');
	$.ajax({
		url : '../../report/excel_report',
		type : 'get',
		dataType : "json",
		data : {
			time:time
		},
		async : false,
		success : function(data) {
		
			/*$("#btn-run").button('reset');*/
			xh.maskHide();
			if (data.success) {
				window.location.href="../../bsstatus/downExcel?filePath="+data.pathName;
				
			} else {
				toastr.error("导出失败", '提示');
			}
		},
		error : function() {
			/*$("#btn-run").button('reset');*/
			toastr.error("导出失败", '提示');
			xh.maskHide();
		}
	});
	
};



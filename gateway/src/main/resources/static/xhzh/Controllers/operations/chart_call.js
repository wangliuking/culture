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
		$scope.starttime=xh.getPreMonth();
		$scope.a=0;
		$scope.b=0;
		$scope.c=0;
		$scope.d=0;
		$scope.e=0;
		$scope.f=0;
		$scope.g=0;
		$scope.h=0;
		$scope.x=0;
		$scope.y=0;
		var i=0,len=0;
		$scope.chart_msc_call=function(){
			xh.maskShow();
			var time=$("#starttime").val()==""?xh.getPreMonth():$("#starttime").val();
			$http.get("../../call/chart_msc_call?time="+time).
			success(function(response){
				xh.maskHide();
				$scope.msc_data = response.items;
				$scope.msc_totals = response.totals;
				
			});
			
		}
		$scope.chart_bs_call=function(){
			xh.maskShow();
			var time=$("#starttime").val()==""?xh.getPreMonth():$("#starttime").val();
			$http.get("../../call/chart_bs_call?time="+time).
			success(function(response){
				xh.maskHide();
				$scope.bs_call_data = response.items;
				$scope.bs_totals = response.totals;
				$scope.a=0;
				$scope.b=0;
				$scope.c=0;
				$scope.d=0;
				$scope.e=0;
				$scope.f=0;
				$scope.g=0;
				$scope.h=0;
				
				for(i=0,len=$scope.bs_call_data.length;i<len;i++){
					$scope.a+=parseInt($scope.bs_call_data[i].totalActiveCalls);
					$scope.b+=parseInt($scope.bs_call_data[i].totalActiveCallDuration);
					$scope.c+=parseInt($scope.bs_call_data[i].averageCallDuration);
					$scope.d+=parseInt($scope.bs_call_data[i].PTTCount);
					$scope.e+=parseInt($scope.bs_call_data[i].queueCount);
					$scope.f+=parseInt($scope.bs_call_data[i].queueDuration);
					
					if(parseInt(response.items[i].maxUserRegCount)>$scope.g){
						$scope.g=parseInt(response.items[i].maxUserRegCount);
					}
					if(parseInt(response.items[i].maxGroupRegCount)>$scope.h){
						$scope.h=parseInt(response.items[i].maxGroupRegCount);
					}
					
					
					
				}
				
			});
			
		}
		$scope.chart_vpn_call=function(){
			xh.maskShow();
			var time=$("#starttime").val()==""?xh.getPreMonth():$("#starttime").val();
			$http.get("../../call/chart_vpn_call?time="+time).
			success(function(response){
				xh.maskHide();
				$scope.vpn_call_data = response.items;
				$scope.vpn_totals = response.totals;
				$scope.a=0;
				$scope.b=0;
				$scope.c=0;
				$scope.d=0;
				$scope.e=0;
				$scope.f=0;
				$scope.g=0;
				$scope.h=0;
				for(i=0,len=response.items.length;i<len;i++){
					$scope.a+=parseInt(response.items[i].totalActiveCalls);
					$scope.b+=parseInt(response.items[i].totalActiveCallDuration);
					$scope.c+=parseInt(response.items[i].averageCallDuration);
					$scope.d+=parseInt(response.items[i].dexTotalCalls);
					$scope.e+=parseInt(response.items[i].totalFailedCalls);
					$scope.f+=parseInt(response.items[i].failedPercentage);
					$scope.g+=parseInt(response.items[i].noEffectCalls);
				}
			});
		}
		$scope.chart_bs_level_area_call=function(){
			xh.maskShow();
			var time=$("#starttime").val()==""?xh.getPreMonth():$("#starttime").val();
			$http.get("../../call//chart_bs_level_area_call?time="+time).
			success(function(response){
				xh.maskHide();
				$scope.area_call_data = response.areaitems;
				$scope.level_call_data = response.levelitems;
				$scope.area_totals = response.totals;
				
				$scope.a=0;
				$scope.b=0;
				$scope.c=0;
				$scope.d=0;
				$scope.e=0;
				$scope.f=0;
				$scope.g=0;
				$scope.h=0;
				$scope.x=0;
				$scope.y=0;
				
				$scope.a1=0;
				$scope.b1=0;
				$scope.c1=0;
				$scope.d1=0;
				$scope.e1=0;
				$scope.f1=0;
				$scope.g1=0;
				$scope.h1=0;
				$scope.x1=0;
				$scope.y1=0;			
				for(i=0,len=response.areaitems.length;i<len;i++){
					$scope.x+=parseInt(response.areaitems[i].bsTotals);
					$scope.a+=parseInt(response.areaitems[i].totalActiveCalls);
					$scope.b+=parseInt(response.areaitems[i].totalActiveCallDuration);
					$scope.c+=parseInt(response.areaitems[i].averageCallDuration);
					$scope.d+=parseInt(response.areaitems[i].PTTCount);
					$scope.e+=parseInt(response.areaitems[i].queueCount);
					$scope.f+=parseInt(response.areaitems[i].queueDuration);					
					if(parseInt(response.areaitems[i].maxUserRegCount)>$scope.g){
						$scope.g=parseInt(response.areaitems[i].maxUserRegCount);
					}
					if(parseInt(response.areaitems[i].maxGroupRegCount)>$scope.h){
						$scope.h=parseInt(response.areaitems[i].maxGroupRegCount);
					}										
					$scope.y+=parseInt(response.areaitems[i].percent);
				}
				for(i=0,len=response.levelitems.length;i<len;i++){
					$scope.x1+=parseInt(response.levelitems[i].bsTotals);
					$scope.a1+=parseInt(response.levelitems[i].totalActiveCalls);
					$scope.b1+=parseInt(response.levelitems[i].totalActiveCallDuration);
					$scope.c1+=parseInt(response.levelitems[i].averageCallDuration);
					$scope.d1+=parseInt(response.levelitems[i].PTTCount);
					$scope.e1+=parseInt(response.levelitems[i].queueCount);
					$scope.f1+=parseInt(response.levelitems[i].queueDuration);					
					if(parseInt(response.levelitems[i].maxUserRegCount)>$scope.g1){
						$scope.g1=parseInt(response.levelitems[i].maxUserRegCount);
					}
					if(parseInt(response.levelitems[i].maxGroupRegCount)>$scope.h1){
						$scope.h1=parseInt(response.levelitems[i].maxGroupRegCount);
					}										
					$scope.y1+=parseInt(response.levelitems[i].percent);
				}
				
				
				
			});
		}
		$scope.chart_bs_zone_call=function(){
			xh.maskShow();
			var time=$("#starttime").val()==""?xh.getPreMonth():$("#starttime").val();
			$http.get("../../call/chart_bs_zone_call?time="+time).
			success(function(response){
				xh.maskHide();
				$scope.zone_call_data = response.items;
				$scope.zone_totals = response.totals;
				$scope.a=0;
				$scope.b=0;
				$scope.c=0;
				$scope.d=0;
				$scope.e=0;
				$scope.f=0;
				$scope.g=0;
				$scope.h=0;
				$scope.x=0;
				for(i=0,len=response.items.length;i<len;i++){
					$scope.x+=parseInt(response.items[i].bsTotals);
					$scope.a+=parseInt(response.items[i].totalActiveCalls);
					$scope.b+=parseInt(response.items[i].totalActiveCallDuration);
					$scope.c+=parseInt(response.items[i].averageCallDuration);
					$scope.d+=parseInt(response.items[i].PTTCount);
					$scope.e+=parseInt(response.items[i].queueCount);
					$scope.f+=parseInt(response.items[i].queueDuration);
					
					if(parseInt(response.items[i].maxUserRegCount)>$scope.g){
						$scope.g=parseInt(response.items[i].maxUserRegCount);
					}
					if(parseInt(response.items[i].maxGroupRegCount)>$scope.h){
						$scope.h=parseInt(response.items[i].maxGroupRegCount);
					}
				}
			});
		}
		$scope.chart_bs_zone_top10_call=function(){
			xh.maskShow();
			var time=$("#starttime").val()==""?xh.getPreMonth():$("#starttime").val();
			$http.get("../../call/chart_bs_zone_top10_call?time="+time).
			success(function(response){
				xh.maskHide();
				$scope.zone_top10_call_data = response.items;
				$scope.zone_top10_totals = response.totals;
				$scope.a=0;
				$scope.b=0;
				$scope.c=0;
				$scope.d=0;
				$scope.e=0;
				$scope.f=0;
				$scope.g=0;
				$scope.h=0;
				$scope.x=0;
				$scope.y=0;
				for(i=0,len=response.items.length;i<len;i++){
					$scope.x+=parseInt(response.items[i].bsTotals);
					$scope.a+=parseInt(response.items[i].totalActiveCalls);
					$scope.b+=parseInt(response.items[i].totalActiveCallDuration);
					$scope.c+=parseInt(response.items[i].averageCallDuration);
					$scope.d+=parseInt(response.items[i].PTTCount);
					$scope.e+=parseInt(response.items[i].queueCount);
					$scope.f+=parseInt(response.items[i].queueDuration);
					
					if(parseInt(response.items[i].maxUserRegCount)>$scope.g){
						$scope.g=parseInt(response.items[i].maxUserRegCount);
					}
					if(parseInt(response.items[i].maxGroupRegCount)>$scope.h){
						$scope.h=parseInt(response.items[i].maxGroupRegCount);
					}
					
					
					$scope.y+=parseInt(response.items[i].percent);
				}
			});
		}
		
		
		$scope.chart_bs_call_top10=function(){
			xh.maskShow();
			var time=$("#starttime").val()==""?xh.getPreMonth():$("#starttime").val();
			$http.get("../../call/chart_bs_call_top10?time="+time).
			success(function(response){
				xh.maskHide();
				$scope.bs_top10_call_data = response.items;
				$scope.bs_top10_totals = response.totals;
				$scope.a=0;
				$scope.b=0;
				$scope.c=0;
				$scope.d=0;
				$scope.e=0;
				$scope.f=0;
				$scope.g=0;
				$scope.h=0;
				$scope.x=0;
				$scope.y=0;
			
				for(i=0,len=response.items.length;i<len;i++){
					$scope.x+=parseInt(response.items[i].bsTotals);
					$scope.a+=parseInt(response.items[i].totalActiveCalls);
					$scope.b+=parseInt(response.items[i].totalActiveCallDuration);
					$scope.c+=parseInt(response.items[i].averageCallDuration);
					$scope.d+=parseInt(response.items[i].PTTCount);
					$scope.e+=parseInt(response.items[i].queueCount);
					$scope.f+=parseInt(response.items[i].queueDuration);
					
					if(parseInt(response.items[i].maxUserRegCount)>$scope.g){
						$scope.g=parseInt(response.items[i].maxUserRegCount);
					}
					if(parseInt(response.items[i].maxGroupRegCount)>$scope.h){
						$scope.h=parseInt(response.items[i].maxGroupRegCount);
					}
					
					
					$scope.y+=parseInt(response.items[i].percent);
				}
			});
		}
		$scope.chart_bs_userreg_top10=function(){
			xh.maskShow();
			var time=$("#starttime").val()==""?xh.getPreMonth():$("#starttime").val();
			$http.get("../../call/chart_bs_userreg_top10?time="+time).
			success(function(response){
				xh.maskHide();
				$scope.bs_userreg_top10_data = response.items;
				$scope.bs_userreg_top10_totals = response.totals;
			});
		}
		$scope.chart_bs_queue_top10=function(){
			xh.maskShow();
			var time=$("#starttime").val()==""?xh.getPreMonth():$("#starttime").val();
			$http.get("../../call/chart_bs_queue_top10?time="+time).
			success(function(response){
				xh.maskHide();
				$scope.bs_queue_top10_data = response.items;
				$scope.bs_queue_top10_totals = response.totals;
				$scope.a1=0;
				$scope.b1=0;
				$scope.c1=0;
				$scope.d1=0;
				$scope.e1=0;
				$scope.f1=0;
				$scope.g1=0;
				$scope.h1=0;
				$scope.x1=0;
				$scope.y1=0;
				for(i=0,len=response.items.length;i<len;i++){
					$scope.a1+=parseInt(response.items[i].totalActiveCalls);
					$scope.b1+=parseInt(response.items[i].totalActiveCallDuration);
					$scope.c1+=parseInt(response.items[i].averageCallDuration);
					$scope.d1+=parseInt(response.items[i].PTTCount);
					$scope.e1+=parseInt(response.items[i].queueCount);
					$scope.f1+=parseInt(response.items[i].queueDuration);
					
					if(parseInt(response.items[i].maxUserRegCount)>$scope.g1){
						$scope.g1=parseInt(response.items[i].maxUserRegCount);
					}
					if(parseInt(response.items[i].maxGroupRegCount)>$scope.h1){
						$scope.h1=parseInt(response.items[i].maxGroupRegCount);
					}				
					$scope.y1+=parseInt(response.items[i].percent);
				}
			});
		}
        $scope.call_top10=function(){
        	$scope.chart_bs_call_top10();
        	$scope.chart_bs_userreg_top10();
        	$scope.chart_bs_queue_top10();
		}
    	$scope.chart_vpn_call_top10=function(){
			xh.maskShow();
			var time=$("#starttime").val()==""?xh.getPreMonth():$("#starttime").val();
			$http.get("../../call/chart_vpn_call_top10?time="+time).
			success(function(response){
				xh.maskHide();
				$scope.vpn_call_top10_data = response.items;
				$scope.vpn_call_top10_totals = response.totals;
				$scope.a=0;
				$scope.b=0;
				$scope.c=0;
				$scope.d=0;
				$scope.e=0;
				$scope.f=0;
				$scope.g=0;
				$scope.h=0;
				for(i=0,len=response.items.length;i<len;i++){
					$scope.a+=parseInt(response.items[i].totalActiveCalls);
					$scope.b+=parseInt(response.items[i].totalActiveCallDuration);
					$scope.c+=parseInt(response.items[i].averageCallDuration);
					$scope.d+=parseInt(response.items[i].dexTotalCalls);
					$scope.e+=parseInt(response.items[i].totalFailedCalls);
					$scope.f+=parseInt(response.items[i].failedPercentage);
					$scope.g+=parseInt(response.items[i].noEffectCalls);
					$scope.h+=parseInt(response.items[i].percent);
				}
			});
		}
		
		/* 刷新数据 */
		$scope.refresh = function() {
			
			$('#xh-tabs a:first').tab('show');
			$scope.chart_msc_call();
		
		};
		$scope.chart_msc_call();
		
		
		
	});
};

xh.excel=function(){
	var time=$("#starttime").val()==""?xh.getPreMonth():$("#starttime").val();
	xh.maskShow();
	//$("#btn-excel").button('loading');
	$.ajax({
		url : '../../call/excel_call',
		type : 'get',
		dataType : "json",
		data : {
			time:time
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



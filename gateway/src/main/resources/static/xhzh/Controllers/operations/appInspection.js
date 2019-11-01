/**
 * 用户管理
 */
if (!("xh" in window)) {
	window.xh = {};
};
var frist = 0;
var appElement = document.querySelector('[ng-controller=xhcontroller]');
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
	app.controller("xhcontroller", function($scope, $http) {
		/*xh.maskShow();*/
		$scope.count = "15";//每页数据显示默认值
		$scope.starttime=xh.getBeforeDay(7);
		$scope.endtime=xh.getOneDay();
		
		/*获取移动基站巡检表信息*/
		$scope.mbs=function(){	
			var pageSize = $("#page-limit").val();
			$http.get("../../app/mbsinfo?start=0&limit="+pageSize).
			success(function(response){
				$scope.mbsData = response.items;
				$scope.mbsTotals = response.totals;
				xh.mbs_pagging(1, parseInt($scope.mbsTotals),$scope,pageSize);
			});
		}
		/*获取自建基站巡检表信息*/
		$scope.sbs=function(){	
			var pageSize = $("#page-limit-sbs").val();
			$http.get("../../app/sbsinfo?start=0&limit="+pageSize).
			success(function(response){
				$scope.sbsData = response.items;
				$scope.sbsTotals = response.totals;
				xh.sbs_pagging(1, parseInt($scope.sbsTotals),$scope,pageSize);
			});
		}
		/* 刷新数据 */
		$scope.mbs_refresh = function() {
			$scope.mbs_search(1);
		};
		$scope.sbs_refresh = function() {
			$scope.sbs_search(1);
		};
		$scope.net_refresh = function() {
			$scope.net_search(1);
		};
		$scope.dispatch_refresh = function() {
			$scope.dispatch_search(1);
		};
		/* 显示mbsWin */
		$scope.showMbsWin = function(id) {
			$scope.mbsOneData = $scope.mbsData[id];
			$("#mbsWin").modal('show');
		};
		/* 显示sbsWin */
		$scope.showSbsWin = function(id) {
			$scope.sbsOneData = $scope.sbsData[id];
			$("#sbsWin").modal('show');
		};
		/* 显示netWin */
		$scope.showNetWin = function(id) {
			$scope.netOneData = $scope.netData[id];
			$("#netWin").modal('show');
		};
		/* 显示dispatchWin */
		$scope.showDispatchWin = function(id) {
			$scope.dispatchOneData = $scope.dispatchData[id];
			$("#dispatchWin").modal('show');
		};
		/* 查询数据 */
		$scope.mbs_search = function(page) {
			var pageSize = $("#page-limit").val();
			var start = 1, limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;

			} else {
				start = (page - 1) * pageSize;
			}
			$http.get("../../app/mbsinfo?start=0&limit="+limit).
			success(function(response){
				xh.maskHide();
				$scope.mbsData = response.items;
				$scope.mbsTotals = response.totals;
				xh.mbs_pagging(page, parseInt($scope.mbsTotals),$scope,pageSize);
			});
		};
		$scope.sbs_search = function(page) {
			var pageSize = $("#page-limit-sbs").val();
			var start = 1, limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;

			} else {
				start = (page - 1) * pageSize;
			}
			$http.get("../../app/sbsinfo?start=0&limit="+limit).
			success(function(response){
				xh.maskHide();
				$scope.sbsData = response.items;
				$scope.sbsTotals = response.totals;
				xh.sbs_pagging(page, parseInt($scope.sbsTotals),$scope,pageSize);
			});
		};
		$scope.net_search = function(page) {
			var pageSize = $("#page-limit-net").val();
			var start = 1, limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;

			} else {
				start = (page - 1) * pageSize;
			}
			$http.get("../../app/netinfo?start=0&limit="+limit).
			success(function(response){
				xh.maskHide();
				$scope.netData = response.items;
				$scope.netTotals = response.totals;
				xh.net_pagging(page, parseInt($scope.netTotals),$scope,pageSize);
			});
		};
		$scope.dispatch_search = function(page) {
			var pageSize = $("#page-limit-dispatch").val();
			var start = 1, limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;

			} else {
				start = (page - 1) * pageSize;
			}
			$http.get("../../app/dispatchinfo?start=0&limit="+limit).
			success(function(response){
				xh.maskHide();
				$scope.dispatchData = response.items;
				$scope.dispatchTotals = response.totals;
				xh.dispatch_pagging(page, parseInt($scope.dispatchTotals),$scope,pageSize);
			});
		};
		//分页点击
		$scope.mbs_pageClick = function(page,totals, totalPages) {
			var pageSize = $("#page-limit").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			$http.get("../../app/mbsinfo?start=0&limit="+limit).
			success(function(response){
				$scope.mbs_start = (page - 1) * pageSize + 1;
				$scope.mbs_lastIndex = page * pageSize;
				if (page == totalPages) {
					if (totals > 0) {
						$scope.mbs_lastIndex = totals;
					} else {
						$scope.mbs_start = 0;
						$scope.mbs_lastIndex = 0;
					}
				}
				$scope.mbsData = response.items;
				$scope.mbsTotals = response.totals;
			});
			
		};
		$scope.sbs_pageClick = function(page,totals, totalPages) {
			var pageSize = $("#page-limit-sbs").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			$http.get("../../app/sbsinfo?start=0&limit="+limit).
			success(function(response){
				$scope.sbs_start = (page - 1) * pageSize + 1;
				$scope.sbs_lastIndex = page * pageSize;
				if (page == totalPages) {
					if (totals > 0) {
						$scope.sbs_lastIndex = totals;
					} else {
						$scope.sbs_start = 0;
						$scope.sbs_lastIndex = 0;
					}
				}
				$scope.sbsData = response.items;
				$scope.sbsTotals = response.totals;
			});
			
		};
		$scope.net_pageClick = function(page,totals, totalPages) {
			var pageSize = $("#page-limit-net").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			$http.get("../../app/netinfo?start=0&limit="+limit).
			success(function(response){
				$scope.net_start = (page - 1) * pageSize + 1;
				$scope.net_lastIndex = page * pageSize;
				if (page == totalPages) {
					if (totals > 0) {
						$scope.net_lastIndex = totals;
					} else {
						$scope.net_start = 0;
						$scope.net_lastIndex = 0;
					}
				}
				$scope.netData = response.items;
				$scope.netTotals = response.totals;
			});
			
		};
		$scope.dispatch_pageClick = function(page,totals, totalPages) {
			var pageSize = $("#page-limit-dispatch").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			$http.get("../../app/dispatchinfo?start=0&limit="+limit).
			success(function(response){
				$scope.dispatch_start = (page - 1) * pageSize + 1;
				$scope.dispatch_lastIndex = page * pageSize;
				if (page == totalPages) {
					if (totals > 0) {
						$scope.dispatch_lastIndex = totals;
					} else {
						$scope.dispatch_start = 0;
						$scope.dispatch_lastIndex = 0;
					}
				}
				$scope.dispatchData = response.items;
				$scope.dispatchTotals = response.totals;
			});
			
		};
	});
};
$(document).ready(function(){ 
	var $scope = angular.element(appElement).scope();
	$scope.mbs();
	}); 

// 刷新数据
/*xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();

};*/
/* 数据分页 */
xh.mbs_pagging = function(currentPage,totals, $scope,pageSize) {
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
	$scope.mbs_start = start;
	$scope.mbs_lastIndex = end;
	$scope.mbsTotals = totals;
	if (totals > 0) {
		$(".mbs-page-paging").html('<ul class="pagination mbs-pagination"></ul>');
		$('.mbs-pagination').twbsPagination({
			totalPages : totalPages,
			visiblePages : 10,
			version : '1.1',
			startPage : currentPage,
			onPageClick : function(event, page) {
				if (frist == 1) {
					$scope.mbs_pageClick(page, totals, totalPages);
				}
				frist = 1;

			}
		});
	}
};
xh.sbs_pagging = function(currentPage,totals, $scope,pageSize) {
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
	$scope.sbs_start = start;
	$scope.sbs_lastIndex = end;
	$scope.sbsTotals = totals;
	if (totals > 0) {
		$(".sbs-page-paging").html('<ul class="pagination sbs-pagination"></ul>');
		$('.sbs-pagination').twbsPagination({
			totalPages : totalPages,
			visiblePages : 10,
			version : '1.1',
			startPage : currentPage,
			onPageClick : function(event, page) {
				if (frist == 1) {
					$scope.sbs_pageClick(page, totals, totalPages);
				}
				frist = 1;

			}
		});
	}
};
xh.net_pagging = function(currentPage,totals, $scope,pageSize) {
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
	$scope.net_start = start;
	$scope.net_lastIndex = end;
	$scope.netTotals = totals;
	if (totals > 0) {
		$(".net-page-paging").html('<ul class="pagination net-pagination"></ul>');
		$('.net-pagination').twbsPagination({
			totalPages : totalPages,
			visiblePages : 10,
			version : '1.1',
			startPage : currentPage,
			onPageClick : function(event, page) {
				if (frist == 1) {
					$scope.net_pageClick(page, totals, totalPages);
				}
				frist = 1;

			}
		});
	}
};
//移动基站巡检表
xh.excelToMbs=function(){
	var $scope = angular.element(appElement).scope();
	xh.maskShow();
	//$("#btn-mbs").button('loading')
	$.ajax({
		url : '../../app/excel_mbs',
		type : 'post',
		dataType : "json",
		data : {
			excelData:JSON.stringify($scope.mbsOneData)
		},
		
		async : false,
		success : function(data) {
			xh.maskHide();
			//$("#btn-mbs").button('reset');
			if (data.success) {
				
				window.location.href="../../bsstatus/downExcel?filePath="+data.pathName;
			} else {
				toastr.error("导出失败", '提示');
			}
		},
		error : function() {
			//$("#btn-mbs").button('reset');
			xh.maskHide();
			toastr.error("导出失败", '提示');
		}
	});
};
//导出自建基站巡检表
xh.excelToSbs=function(){
	var $scope = angular.element(appElement).scope();
	xh.maskShow();
	//$("#btn-mbs").button('loading')
	$.ajax({
		url : '../../app/excel_sbs',
		type : 'post',
		dataType : "json",
		data : {
			excelData:JSON.stringify($scope.sbsOneData)
		},
		
		async : false,
		success : function(data) {
			xh.maskHide();
			//$("#btn-mbs").button('reset');
			if (data.success) {
				
				window.location.href="../../bsstatus/downExcel?filePath="+data.pathName;
			} else {
				toastr.error("导出失败", '提示');
			}
		},
		error : function() {
			xh.maskHide();
			toastr.error("导出失败", '提示');
		}
	});
};
//导出网管巡检
xh.excelToNet=function(){
	var $scope = angular.element(appElement).scope();
	xh.maskShow();
	//$("#btn-mbs").button('loading')
	$.ajax({
		url : '../../app/excel_net',
		type : 'post',
		dataType : "json",
		data : {
			excelData:JSON.stringify($scope.netOneData)
		},
		
		async : false,
		success : function(data) {
			xh.maskHide();
			//$("#btn-mbs").button('reset');
			if (data.success) {
				
				window.location.href="../../bsstatus/downExcel?filePath="+data.pathName;
			} else {
				toastr.error("导出失败", '提示');
			}
		},
		error : function() {
			xh.maskHide();
			toastr.error("导出失败", '提示');
		}
	});
};
//导出调度台巡检
xh.excelToDispatch=function(){
	var $scope = angular.element(appElement).scope();
	xh.maskShow();
	//$("#btn-mbs").button('loading')
	$.ajax({
		url : '../../app/excel_dispatch',
		type : 'post',
		dataType : "json",
		data : {
			excelData:JSON.stringify($scope.dispatchOneData)
		},
		
		async : false,
		success : function(data) {
			xh.maskHide();
			//$("#btn-mbs").button('reset');
			if (data.success) {
				
				window.location.href="../../bsstatus/downExcel?filePath="+data.pathName;
			} else {
				toastr.error("导出失败", '提示');
			}
		},
		error : function() {
			xh.maskHide();
			toastr.error("导出失败", '提示');
		}
	});
};
xh.dispatch_pagging = function(currentPage,totals, $scope,pageSize) {
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
	$scope.dispatch_start = start;
	$scope.dispatch_lastIndex = end;
	$scope.dispatchTotals = totals;
	if (totals > 0) {
		$(".dispatch-page-paging").html('<ul class="pagination dispatch-pagination"></ul>');
		$('.dispatch-pagination').twbsPagination({
			totalPages : totalPages,
			visiblePages : 10,
			version : '1.1',
			startPage : currentPage,
			onPageClick : function(event, page) {
				if (frist == 1) {
					$scope.dispatch_pageClick(page, totals, totalPages);
				}
				frist = 1;

			}
		});
	}
};
var WebPrinter; //声明为全局变量 
xh.printExists=function() {
	
	try{ 
	    var LODOP=getLodop(document.getElementById('LODOP_OB'),document.getElementById('LODOP_EM')); 
		if ((LODOP!=null)&&(typeof(LODOP.VERSION)!="undefined")) alert("本机已成功安装过Lodop控件!\n  版本号:"+LODOP.VERSION); 
	 }catch(err){ 
		//alert("Error:本机未安装或需要升级!"); 
	 } 
	
    
};
xh.print_mbs=function() {
	var LODOP = getLodop();
	LODOP.PRINT_INIT("移动基站巡检");
	LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
	LODOP.ADD_PRINT_TABLE("1%", "2%", "96%", "96%", document.getElementById("print_mbs").innerHTML);
	 LODOP.PREVIEW();  	
};
xh.print_sbs=function() {
	var LODOP = getLodop();
	LODOP.PRINT_INIT("自建基站巡检");
	LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
	LODOP.ADD_PRINT_TABLE("1%", "2%", "96%", "96%", document.getElementById("print_sbs").innerHTML);
	 LODOP.PREVIEW();  	
};
xh.print_net=function() {
	var LODOP = getLodop();
	LODOP.PRINT_INIT("网管巡检");
	LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
	LODOP.ADD_PRINT_TABLE("1%", "2%", "96%", "96%", document.getElementById("print_net").innerHTML);
	 LODOP.PREVIEW();  	
};
xh.print_dispatch=function() {
	var LODOP = getLodop();
	LODOP.PRINT_INIT("网管巡检");
	LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
	LODOP.ADD_PRINT_TABLE("1%", "2%", "96%", "96%", document.getElementById("print_dispatch").innerHTML);
	 LODOP.PREVIEW();  	
};


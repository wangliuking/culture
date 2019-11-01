/**
 * 基站配置
 */
if (!("xh" in window)) {
	window.xh = {};
};
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
	
	app.filter('upp', function() { //可以注入依赖
		return function(text) {
			if(text=="" || text==null)
			return "";
			else
			return parseFloat(text);
		};
	});

	app.controller("emhHistory", function($scope, $http) {
		xh.maskShow();
		$scope.count = "15";//每页数据显示默认值
		$scope.systemMenu=true; //菜单变色
		$http.get("../../gonsuncn/emhHistory?bsId="+bsId+"&startTime="+startTime+"&endTime="+endTime+"&start=0&limit="+pageSize).
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
			$scope.search(1);
		};
		
		/* 查询数据 */
		$scope.search = function(page) {
			var pageSize = $("#page-limit").val();
			var bsId = $("#bsId").val();
			var startTime = $("#startTime").val();
			var endTime = $("#endTime").val();
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
			$http.get("../../gonsuncn/emhHistory?bsId="+bsId+"&startTime="+startTime+"&endTime="+endTime+"&start="+start+"&limit="+limit).
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				xh.pagging(page, parseInt($scope.totals), $scope);
			});
		};
		//分页点击
		$scope.pageClick = function(page, totals, totalPages) {
			var pageSize = $("#page-limit").val();
			var bsId = $("#bsId").val();
			var startTime = $("#startTime").val();
			var endTime = $("#endTime").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			xh.maskShow();
			$http.get("../../gonsuncn/emhHistory?bsId="+bsId+"&startTime="+startTime+"&endTime="+endTime+"&start="+start+"&limit="+pageSize).
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

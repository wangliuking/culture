/**
 * 终端状态
 */
if (!("xh" in window)) {
	window.xh = {};
};
var background = "#fff";
var frist = 0;
var appElement = document.querySelector('[ng-controller=userstatus]');
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
	/*
	 * app.filter('upp', function() { //可以注入依赖 return function(text) { return
	 * text+"$$"; }; });
	 */

	app.config([ '$locationProvider', function($locationProvider) {
		$locationProvider.html5Mode({
			enabled : true,
			requireBase : false
		});
	} ]);

	app.controller("userstatus", function($scope, $http, $location) {
		/* xh.maskShow(); */
		$scope.count = "10";// 每页数据显示默认值
		$scope.bsId = $location.search().bsId;

		// 基站下的注册终端
		$scope.radioUser = function() {
			var bsId = $scope.bsId;
			frist = 0;
			var pageSize =  $("#page-limit").val();
			$http.get(
					"../../radio/status/oneBsRadio?bsId=" + bsId
							+ "&start=0&limit=" + pageSize).success(
					function(response) {
						$scope.radioData = response.items;
						$scope.radioTotals = response.totals;
						xh.pagging(1, parseInt($scope.radioTotals), $scope);
					});
		};
		// 基站下的注册组
		$scope.bsGroup = function() {
			var bsId = $scope.bsId;
			frist = 0;
			var pageSize = $("#page-limit-group").val();
			$http.get(
					"../../radio/status/oneBsGroup?bsId=" + bsId
							+ "&start=0&limit=" + pageSize).success(
					function(response) {
						$scope.groupData = response.items;
						$scope.groupTotals = response.totals;
						xh.groupPagging(1, parseInt($scope.groupTotals), $scope);
					});
		};
	
		
		// 分页点击
		$scope.pageClick = function(page, totals, totalPages) {
			var pageSize = $("#page-limit").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
		
			$http.get(
					"../../radio/status/oneBsRadio?bsId=" + $scope.bsId
							+ "&start=" + start + "&limit=" + pageSize)
					.success(function(response) {
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
						$scope.radioData = response.items;
						$scope.radioTotals = response.totals;
					});

		};
		// 注册组分页点击
		$scope.groupPageClick = function(page, totals, totalPages) {
			var pageSize = $("#page-limit-group").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			
			$http.get(
					"../../radio/status/oneBsGroup?bsId=" + $scope.bsId
							+ "&start=" + start + "&limit=" + pageSize)
					.success(function(response) {
						xh.maskHide();

						$scope.groupStart = (page - 1) * pageSize + 1;
						$scope.groupLastIndex = page * pageSize;
						if (page == totalPages) {
							if (totals > 0) {
								$scope.groupLastIndex = totals;
							} else {
								$scope.groupStart = 0;
								$scope.lastIndex = 0;
							}
						}
						$scope.groupData = response.items;
						$scope.groupTotals = response.totals;
					});

		};
		$scope.business = function() {
			$scope.radioUser();
			$scope.bsGroup();
		};
		$scope.business();
		setInterval(function() {
			$scope.business();
		}, 5000);

	});
};

// 刷新数据
xh.refresh = function() {
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
			visiblePages : 3,
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
xh.groupPagging = function(currentPage, totals, $scope) {
	var pageSize = $("#page-limit-group").val();
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
	$scope.groupStart = start;
	$scope.groupLastIndex = end;
	$scope.groupTotals = totals;
	if (totals > 0) {
		$(".page-paging-group").html('<ul class="pagination"></ul>');
		$('.pagination').twbsPagination({
			totalPages : totalPages,
			visiblePages : 3,
			version : '1.1',
			startPage : currentPage,
			onPageClick : function(event, page) {
				if (frist == 1) {
					$scope.groupPageClick(page, totals, totalPages);
				}
				frist = 1;

			}
		});
	}
};
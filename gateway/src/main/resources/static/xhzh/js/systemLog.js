
if (!("xh" in window)) {
	window.xh = {};
};

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

var frist = 0;
var appElement = document.querySelector('[ng-controller=xhcontroller]');
var structure;
xh.load = function() {
	var app = angular.module("app", []);
	
	var pageSize = $("#page-limit").val();
    app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);
	app.controller("xhcontroller", function($scope,$http,$location) {
	    $scope.count = "15";//每页数据显示默认值
		$scope.businessMenu=true; //菜单变色

        //判断是否登录start
        $.ajax({
            type: 'GET',
            url: "../../getLoginUser",
            async: false,
            dataType: 'json',
            success: function(response){
                structure = response.structure;
            } ,
            error: function () {
                alert("登录已失效，请重新登录！");
                window.location.href = "../login.html";
                window.parent.location.href = "../login.html";
            }
        });
        //判断是否登录end

        $http.get("../../selectLogList?start=0&limit="+pageSize).
        success(function(response){
            $scope.data = response.items;
            $scope.totals = response.totals;
            console.log($scope.data);
            xh.pagging(1, parseInt($scope.totals), $scope);
        });
		
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
		};

		/* 查询数据 */
		$scope.search = function(page) {

            var userId = $("#userId").val();
            var type = $("#type").val();
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
            $http.get("../../selectLogList?start=0&limit="+limit+"&userId="+userId+"&type="+type+"&startTime="+startTime+"&endTime="+endTime).
            success(function(response){
                console.log(response);
                $scope.data = response.items;
                $scope.totals = response.totals;
                xh.pagging(page, parseInt($scope.totals), $scope);
            });

		};

		//分页点击
		$scope.pageClick = function(page, totals, totalPages) {

            var userId = $("#userId").val();
            var type = $("#type").val();
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

            $http.get("../../selectLogList?start="+start+"&limit=" + limit+"&userId="+userId+"&type="+type+"&startTime="+startTime+"&endTime="+endTime).
            success(function(response){
                //xh.maskHide();
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
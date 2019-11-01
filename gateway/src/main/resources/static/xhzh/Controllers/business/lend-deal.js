/**
 * 资产管理
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
	var type = $("#type").val();
	var name = $("#name").val();
	var model = $("#model").val();
	var serialNumber = $("#serialNumber").val();
	var pageSize = $("#page-limit").val();
    app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);

	app.controller("xhcontroller", function($scope, $http,$location) {
		xh.maskShow();
		$scope.showDiv=false;
		$scope.count = "15";//每页数据显示默认值
		$scope.businessMenu=true; //菜单变色
		//获取登录用户
		$http.get("../../web/loginUserInfo").
		success(function(response){
			xh.maskHide();
			$scope.loginUser = response.user;
			$scope.loginUserRoleId = response.roleId;	
		});
		$scope.data_id=$location.search().data_id;
		$scope.leaderUser=$location.search().leaderUser;
		$http.get("../../business/assetList?type="+type+"&name="+name+"" +
				"&model="+model+"&serialNumber="+serialNumber+"&from=0" + "&status=4"+
				"&status=0&start=0&limit="+pageSize).
		success(function(response){
			xh.maskHide();
			$scope.data = response.items;
			$scope.totals = response.totals;
			xh.pagging(1, parseInt($scope.totals), $scope);
		});
		//设备清单列表
		$http.get("../../business/lend/lendInfoList?lendId="+$scope.data_id).
		success(function(response){
			xh.maskHide();
			$scope.dataLend = response.items;
			$scope.lendTotals = response.totals;
		});
		//控制筛选框
		$scope.showSearchDiv=function(){
			if($scope.showDiv==false){
				$scope.showDiv=true;
			}else{
				$scope.showDiv=false;
			}
		};
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
			$("#table-checkbox").prop("checked", false);
		};
		/*刷新order记录*/
		$scope.refreshOrder = function() {
			$http.get("../../business/lend/lendInfoList?lendId="+$scope.data_id).
			success(function(response){
				xh.maskHide();
				$scope.dataLend = response.items;
				$scope.lendTotals = response.totals;
				xh.pagging(page, parseInt($scope.totals), $scope);
			});
			$http.get("../../business/assetList?type="+type+"&name="+name+"" +
					"&model="+model+"&serialNumber="+serialNumber+"&from=0" + "&status=4"+
					"&status=0&start=0&limit="+pageSize).
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
			});
		};

		/* 删除清单中的设备 */
		$scope.del = function(id) {
			$scope.delData=$scope.dataLend[id];
			$.ajax({
				url : '../../business/lend/deleteLendOrderE',
				type : 'POST',
				dataType : "json",
				async : false,
				data:{
					 lendId:$scope.delData.lendId,
					 serialNumber:$scope.delData.serialNumber,
				},
				success : function(data) {
					if (data.result === 1) {
						toastr.success(data.message, '提示');
						xh.refreshOrder();

					} else {
						toastr.error(data.message, '提示');
					}
				},
				error : function(){
				}
			});
		};
		/* 查询数据 */
		$scope.search = function(page) {
			var pageSize = $("#page-limit").val();
			var type = $("#type").val();
			var name = $("#name").val();
			var model = $("#model").val();
			var serialNumber = $("#serialNumber").val();
			var pageSize = $("#page-limit").val();
			var limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;

			} else {
				start = (page - 1) * pageSize;
			}
			console.log("limit=" + limit);
			xh.maskShow();
			$http.get("../../business/assetList?type="+type+"&name="+name+"" +
					"&model="+model+"&serialNumber="+serialNumber+"&from=0" +
					"&status=0&start=0&limit="+pageSize).
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				xh.pagging(page, parseInt($scope.totals), $scope);
			});
		};
		//分页点击
		$scope.pageClick = function(page, totals, totalPages) {
			var type = $("#type").val();
			var name = $("#name").val();
			var model = $("#model").val();
			var serialNumber = $("#serialNumber").val();
			var pageSize = $("#page-limit").val();
			var start = 1;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			xh.maskShow();
			$http.get("../../business/assetList?type="+type+"&name="+name+"" +
					"&model="+model+"&serialNumber="+serialNumber+"&from=0" +
					"&status=0&start="+start+"&limit="+pageSize).
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

/* 添加租借清单 */
xh.addOrder= function() {
	var checkVal = [],toData=[];
	var $scope = angular.element(appElement).scope();
	$("[name='tb-check']:checkbox").each(function() {
		if ($(this).is(':checked')) {
			$scope.tableData = $scope.data[$(this).attr("index")];
			toData.push($scope.tableData);
		}
	});
	if (toData.length < 1) {
		toastr.error("请至少选择一条数据", '提示');
		return;
	}
	$.ajax({
		url : '../../business/lend/addOrder',
		type : 'post',
		dataType : "json",
		data : {
			id:$scope.data_id,
			toData : angular.toJson(toData)
		},
		async : false,
		success : function(data) {
			if (data.success) {
				toastr.success(data.message, '提示');
				xh.refreshOrder();
			} else {
				toastr.error(data.message, '提示');
			}
		},
		error : function() {
		}
	});
};

/*将设备清单通知用户办理租借*/
xh.checkSend = function() {
	var $scope = angular.element(appElement).scope();
	if($scope.lendTotals<1){
		toastr.error("清单中还没有数据 ，请添加后再提交", '提示');
		return;
	}
	$.ajax({
		url : '../../business/lend/checkedSend',
		type : 'POST',
		dataType : "json",
		async : true,
		data:{
			lendId:$scope.data_id,
			loginUser:$scope.loginUser,
			leaderUser:$scope.leaderUser
		},
		success : function(data) {

			if (data.result ==1) {
				toastr.success(data.message, '提示');
				window.location.href="lend.html";

			} else {
				toastr.error(data.message, '提示');
			}
		},
		error : function() {
		}
	});
};

// 刷新数据
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();

};
xh.refreshOrder = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refreshOrder();

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
			visiblePages : 6,
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


if (!("xh" in window)) {
	window.xh = {};
};
/*
 * test
 */
$(function(){
	
});
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
	var talkgroupid = $("#talkgroupid").val();
	var eName = $("#eName").val();
	var pageSize = $("#page-limit").val();

	app.controller("talkgroup", function($scope, $http) {
		xh.maskShow();
		$scope.count = "20";// 每页数据显示默认值
		$scope.systemMenu = true; // 菜单变色
		/* 获取用户权限 */
		$http.get("../../web/loginUserPower").success(
				function(response) {
					$scope.up = response;
		});
		
		$http.get(
				"../../talkgroup/list?talkgroupid=" + talkgroupid + "&eName=" + eName
						+ "&start=0&limit=" + pageSize).success(
				function(response) {
					xh.maskHide();
					$scope.data = response.items;
					$scope.totals = response.totals;
					xh.pagging(1, parseInt($scope.totals), $scope);
				});
		
		// 获取无线用户业务属性
		$http.get("../../radiouserbusiness/list?start=0&limit="+ pageSize)
				.success(function(response) {
					$scope.userbusinessData = response.items;
					$scope.userbusinessTotals = response.totals;
					if ($scope.userbusinessTotals > 0) {
						$scope.userbusinessName = $scope.userbusinessData[0].id;
					}
				});
		// 获取无线用户互联属性
		$http.get("../../radiouserseria/list?start=0&limit="+ pageSize)
				.success(function(response) {
						$scope.userseriaData = response.items;
						$scope.userseriaTotals = response.totals;
						if ($scope.userseriaTotals > 0) {
							$scope.userseriaName = $scope.userseriaData[0].name;
						}
					});
		// 获取msclist
		$http.get("../../talkgroup/mscList").success(function(response) {
			$scope.msc = response.items;
			$scope.mscNum = response.totals;
			if ($scope.mscNum > 0) {
				$scope.mscName = $scope.msc[0].name;
			}
		});
		// 获取vpnList
		$http.get("../../talkgroup/vpnList").success(function(response) {
			$scope.vpn = response.items;
			$scope.vpnNum = response.totals;
			if ($scope.vpnNum > 0) {
				$scope.vpnName = $scope.vpn[0].name;
			}
		});
		// 获取虚拟专网属性
		$http.get("../../talkgroup/vaList").success(function(response) {
			$scope.va = response.items;
			$scope.vaNum = response.totals;
			if ($scope.vaNum > 0) {
				$scope.vaName = $scope.va[0].name;
			}
		});
		/* 刷新数据 */
		$scope.refresh = function() {
			$("#talkgroupid").val("");
			$("#eName").val("");
			$scope.search(1);
		};
		
		/* 显示model */
		$scope.editModel = function(id) {
			$('#edit').modal('show');
			$scope.editData = $scope.data[id];
			console.log($scope.editData);
		};
		
		/* 删除单个通话组 */
		$scope.delBs = function(id) {
			swal({
				title : "提示",
				text : "确定要删除该通话组吗？",
				type : "info",
				showCancelButton : true,
				confirmButtonColor : "#DD6B55",
				confirmButtonText : "确定",
				cancelButtonText : "取消"
			/*
			 * closeOnConfirm : false, closeOnCancel : false
			 */
			}, function(isConfirm) {
				if (isConfirm) {
					$.ajax({
						url : '../../talkgroup/del',
						type : 'post',
						dataType : "json",
						data : {
							id : id
						},
						async : false,
						success : function(data) {
							if (data.success) {
								toastr.success("删除通话组成功", '提示');
								$scope.refresh();
							} else {
								toastr.error(data.message, '提示');
							}
						},
						error : function() {
							toastr.error("删除通话组失败", '提示');
						}
					});
				}
			});
		};
		
		/* 查询数据 */
		$scope.search = function(page) {
			var pageSize = $("#page-limit").val();
			var talkgroupid = $("#talkgroupid").val();
			var eName = $("#eName").val();
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
			$http.get(
					"../../talkgroup/list?talkgroupid=" + talkgroupid + "&eName=" + eName + "&start="
							+ start + "&limit=" + limit).success(
					function(response) {
						xh.maskHide();
						$scope.data = response.items;
						$scope.totals = response.totals;
						xh.pagging(page, parseInt($scope.totals), $scope);
					});
		};
		// 分页点击
		$scope.pageClick = function(page, totals, totalPages) {
			var pageSize = $("#page-limit").val();
			var talkgroupid = $("#talkgroupid").val();
			var eName = $("#eName").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			xh.maskShow();
			$http.get(
					"../../talkgroup/list?talkgroupid=" + talkgroupid + "&eName=" + eName + "&start="
							+ start + "&limit=" + pageSize).success(
					function(response) {
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

/* 修改 */
xh.update = function() {
	$.ajax({
		url : '../../talkgroup/update',
		type : 'POST',
		dataType : "json",
		async : false,
		data : $("#updateTalkGroupForm").serializeArray(),
		success : function(data) {
			if (data.success) {
				$('#edit').modal('hide');
				toastr.success("更新通话组成功", '提示');
				xh.refresh();
			} else {
				toastr.error("更新通话组失败", '提示');
			}
		},
		error : function() {
		}
	});
};

/* 批量删除 */
xh.delMore = function() {
	swal({
		title : "提示",
		text : "确定要删除该通话组信息吗？",
		type : "info",
		showCancelButton : true,
		confirmButtonColor : "#DD6B55",
		confirmButtonText : "确定",
		cancelButtonText : "取消"
	/*
	 * closeOnConfirm : false, closeOnCancel : false
	 */
	}, function(isConfirm) {
		if (isConfirm) {
			var checkVal = [];
			$("[name='tb-check']:checkbox").each(function() {
				if ($(this).is(':checked')) {
					checkVal.push($(this).attr("value"));
				}
			});
			if (checkVal.length < 1) {
				toastr.error("批量删除通话组失败", '提示');
				return;
			}
			$.ajax({
				url : '../../talkgroup/del',
				type : 'post',
				dataType : "json",
				data : {
					id : checkVal.join(",")
				},
				async : false,
				success : function(data) {
					if (data.success) {
						toastr.success("删除通话组成功", '提示');
						xh.refresh();
					} else {
						toastr.error(data.message, '提示');
					}
				},
				error : function() {
					toastr.error("删除通话组失败", '提示');
				}
			});
		}
	});

};

// 刷新数据
xh.refresh = function() {
	var appElement = document.querySelector('[ng-controller=talkgroup]');
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


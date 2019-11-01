/**
 * 无线用户配置
 */
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
	var C_ID = $("#C_ID").val();
	var E_name = $("#E_name").val();
	var pageSize = $("#page-limit").val();

	app.controller("radiouser", function($scope, $http) {
		xh.maskShow();
		$scope.count = "20";// 每页数据显示默认值
		$scope.systemMenu = true; // 菜单变色
		
		/* 获取用户权限 */
		$http.get("../../web/loginUserPower").success(
				function(response) {
					$scope.up = response;
		});
		
		$http.get(
				"../../radiouser/list?C_ID=" + C_ID + "&E_name=" + E_name
						+ "&start=0&limit=" + pageSize).success(
				function(response) {
					xh.maskHide();
					$scope.data = response.items;
					$scope.totals = response.totals;
					xh.pagging(1, parseInt($scope.totals), $scope);
				});
		// 获取无线用户业务属性
		$http.get("../../radiouserbusiness/list?start=0&limit="+ pageSize).success(
			function(response) {
				$scope.userbusinessData = response.items;
				$scope.userbusinessTotals = response.totals;
				if ($scope.userbusinessTotals > 0) {
					$scope.userbusinessName = $scope.userbusinessData[0].id;
				}
			});
		// 获取无线用户互联属性
		$http.get("../../radiouserseria/list?start=0&limit="+ pageSize).success(function(response) {
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
		// 获取虚拟专网属性
		$http.get("../../talkgroup/vaList").success(function(response) {
			$scope.va = response.items;
			$scope.vaNum = response.totals;
			if ($scope.vaNum > 0) {
				$scope.vaName = $scope.va[0].name;
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
		
		
		/* 刷新数据 */
		$scope.refresh = function() {
			$("#C_ID").val("");
			$("#E_name").val("");
			$scope.search(1);
		};
		/*显示添加基站model*/
		$scope.addModel = function(){
			/*清除添加框之前的数据*/
			$('#add input[type!="radio"]').val('');
			/*进入模态框默认选中第一步*/
			$('#add a[href="#step1"]').tab('show');
			$('#add').modal('show');
		};
		/* 显示修改基站model */
		$scope.editModel = function(id) {
			/*进入模态框默认选中第一步*/
			$('#edit a[href="#step_1"]').tab('show');
			$('#edit').modal('show');
			$scope.editData = $scope.data[id];
			$scope.editData.E_saId=$scope.data[id].E_saId.toString();
			$scope.editData.E_iaId=$scope.data[id].E_iaId.toString();
			$scope.editData.E_vaId=$scope.data[id].toString();
		};
		/* 显示修改基站model */
		$scope.showEditModel = function() {
			var checkVal = [];
			$("[name='tb-check']:checkbox").each(function() {
				if ($(this).is(':checked')) {
					checkVal.push($(this).attr("index"));
				}
			});
			if (checkVal.length != 1) {
				toastr.error("只能选择一条数据", '提示');
				return;
			}
			console.log("edit=" + checkVal[0]);
			/* $scope.edit(parseInt(checkVal[0])); */
			/*进入模态框默认选中第一步*/
			$('#edit a[href="#step_1"]').tab('show');
			$("#edit").modal('show');
			$scope.editData = $scope.data[parseInt(checkVal[0])];
		};
		/* 删除基站 */
		$scope.delBs = function(id) {
			swal({
				title : "提示",
				text : "确定要删除该无线用户信息吗？",
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
						url : '../../radiouser/del',
						type : 'post',
						dataType : "json",
						data : {
							id : id
						},
						async : false,
						success : function(data) {
							if (data.success) {
								toastr.success("删除无线用户成功", '提示');
								$scope.refresh();
							} else {
								swal({
									title : "提示",
									text : "删除无线用户失败",
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
		/* 查询数据 */
		$scope.search = function(page) {
			var pageSize = $("#page-limit").val();
			var C_ID = $("#C_ID").val();
			var E_name = $("#E_name").val();
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
					"../../radiouser/list?C_ID=" + C_ID + "&E_name=" + E_name + "&start="
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
			var C_ID = $("#C_ID").val();
			var E_name = $("#E_name").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			xh.maskShow();
			$http.get(
					"../../radiouser/list?C_ID=" + C_ID + "&E_name=" + E_name + "&start="
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
/* 添加基站信息 */
xh.add = function() {
	$.ajax({
		url : '../../radiouser/add',
		type : 'POST',
		dataType : "json",
		async : false,
		data : $("#addForm").serializeArray(),
		success : function(data) {

			if (data.result == 0) {
				$('#add').modal('hide');

				for (var i = 1; i < 10; i++) {
					console.log(1);
				}			
				toastr.success("添加无线用户成功", '提示');
				xh.refresh();
			} else {
				toastr.error("添加无线用户失败", '提示');
			}
		},
		error : function() {
		}
	});
};
/* 修改基站信息 */
xh.update = function() {
	$.ajax({
		url : '../../radiouser/update',
		type : 'POST',
		dataType : "json",
		async : false,
		data : $("#updateForm").serializeArray(),
		success : function(data) {
			if (data.success) {
				$('#edit').modal('hide');
				toastr.success("更新无线用户成功", '提示');
				xh.refresh();
			} else {
				toastr.error("修改无线用户失败", '提示');
			}
		},
		error : function() {
		}
	});
};
/* 批量删除基站 */
xh.delMore = function() {
	swal({
		title : "提示",
		text : "确定要删除该无线用户信息吗？",
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
				toastr.error("批量删除无线用户失败", '提示');
				return;
			}
			$.ajax({
				url : '../../radiouser/del',
				type : 'post',
				dataType : "json",
				data : {
					id : checkVal.join(",")
				},
				async : false,
				success : function(data) {
					if (data.success) {
						toastr.success("删除无线用户成功", '提示');
						xh.refresh();
					} else {
						toastr.error("删除无线用户失败", '提示');
					}
				},
				error : function() {
				}
			});
		}
	});

};

// 刷新数据
xh.refresh = function() {
	var appElement = document.querySelector('[ng-controller=radiouser]');
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
/*
 * $http({ method : "POST", url : "../../bs/list", data : { bsId : bsId, name :
 * name, start : start, limit : pageSize }, headers : { 'Content-Type' :
 * 'application/x-www-form-urlencoded' }, transformRequest : function(obj) { var
 * str = []; for ( var p in obj) { str.push(encodeURIComponent(p) + "=" +
 * encodeURIComponent(obj[p])); } return str.join("&"); }
 * }).success(function(response) { xh.maskHide(); $scope.data = response.items;
 * $scope.totals = response.totals; });
 */

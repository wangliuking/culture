
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
	var pageSize = $("#page-limit").val();

	app.controller("talkgroupia", function($scope, $http) {
		xh.maskShow();
		$scope.count = "20";// 每页数据显示默认值
		$scope.systemMenu = true; // 菜单变色
		
		/* 获取用户权限 */
		$http.get("../../web/loginUserPower").success(
				function(response) {
					$scope.up = response;
		});
		
		$http.get(
				"../../talkgroupia/list?start=0&limit=" + pageSize).success(
				function(response) {
					xh.maskHide();
					$scope.data = response.items;
					$scope.totals = response.totals;
					xh.pagging(1, parseInt($scope.totals), $scope);
				});
		/* 刷新数据 */
		$scope.refresh = function() {
			$("#id").val("");
			$("#name").val("");
			$scope.search(1);
		};
		
		/* 显示model */
		$scope.showAddModel = function(id) {
			$('#add').modal('show');
		};
		
		$scope.editModel = function(id) {
			$('#edit').modal('show');
			$scope.editData = $scope.data[id];
		};
		
		/* 显示修改model */
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
			$("#edit").modal('show');
			$scope.editData = $scope.data[parseInt(checkVal[0])];
		};
		/* 删除 */
		$scope.delBs = function(id) {
			swal({
				title : "提示",
				text : "确定要删除该信息吗？",
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
						url : '../../talkgroupia/del',
						type : 'post',
						dataType : "json",
						data : {
							id : id
						},
						async : false,
						success : function(data) {
							if (data.success) {
								toastr.success("删除成功", '提示');
								$scope.refresh();
							} else {
								swal({
									title : "提示",
									text : "删除失败",
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
			var id = $("#id").val();
			var name = $("#name").val();
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
					"../../talkgroupia/list?id=" + id + "&name=" + name + "&start="
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
			var id = $("#id").val();
			var name = $("#name").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			xh.maskShow();
			$http.get(
					"../../radiouserbusiness/list?id=" + id + "&name=" + name + "&start="
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

/* 添加 */
xh.add = function() {
	$.ajax({
		url : '../../talkgroupia/add',
		type : 'POST',
		dataType : "json",
		async : false,
		data : $("#addForm").serializeArray(),
		success : function(data) {
			if (data.result ==1) {
				$('#addForm')[0].reset();
				$('#add').modal('hide');			
				toastr.success("添加成功！", '提示');
				xh.refresh();
			} else {
				toastr.error("添加失败！", '提示');
			}
		},
		error : function() {
		}
	});
};
/* 修改 */
xh.update = function() {
	$.ajax({
		url : '../../talkgroupia/update',
		type : 'POST',
		dataType : "json",
		async : false,
		data : $("#updateForm").serializeArray(),
		success : function(data) {
			if (data.result === 1) {
				$('#edit').modal('hide');
				toastr.success("修改成功！", '提示');
				xh.refresh();
			} else {
				toastr.error("修改失败！", '提示');
			}
		},
		error : function(){
		}
	});
};
/* 批量删除基站 */
xh.delMore = function() {
	var checkVal = [];
	$("[name='tb-check']:checkbox").each(function() {
		if ($(this).is(':checked')) {
			checkVal.push($(this).attr("value"));
		}
	});
	if (checkVal.length < 1) {
		toastr.error("批量删除失败", '提示');
		return;
	}
	$.ajax({
		url : '../../talkgroupia/del',
		type : 'post',
		dataType : "json",
		data : {
			id : checkVal.join(",")
		},
		async : false,
		success : function(data) {
			if (data.success) {
				toastr.success("删除成功", '提示');
				xh.refresh();
			} else {
				toastr.error("删除失败", '提示');
			}
		},
		error : function() {
		}
	});
};

// 刷新数据
xh.refresh = function() {
	var appElement = document.querySelector('[ng-controller=talkgroupia]');
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

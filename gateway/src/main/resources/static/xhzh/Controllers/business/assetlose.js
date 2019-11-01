/**
 * 资产管理
 */
if (!("xh" in window)) {
	window.xh = {};
};

var frist = 0;
var appElement = document.querySelector('[ng-controller=businesslose]');
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

	app.controller("businesslose", function($scope, $http) {
		xh.maskShow();
		$scope.count = "15";// 每页数据显示默认值
		$scope.businessMenu = true; // 菜单变色
		$http.get(
				"../../businesslose/assetList?type=" + type + "&name=" + name
						+ "" + "&model=" + model + "&serialNumber="
						+ serialNumber + "&start=0&limit=" + pageSize).success(
				function(response) {
					xh.maskHide();
					$scope.data = response.items;
					$scope.totals = response.totals;
					xh.pagging(1, parseInt($scope.totals), $scope);
				});
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
			$("#table-checkbox").prop("checked", false);
		};
		/* 显示修改model */
		$scope.editModel = function(id) {
			$scope.editDataLose = $scope.data[id];
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
				/*
				 * swal({ title : "提示", text : "只能选择一条数据", type : "error" });
				 */
				toastr.error("只能选择一条数据", '提示');
				return;
			}
			$("#edit").modal('show');
			$scope.editDataLose = $scope.data[parseInt(checkVal[0])];
		};
		/* 删除 */
		$scope.delBs = function(id) {
			swal({
				title : "提示",
				text : "确定要删除该记录吗？",
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
						url : '../../businesslose/deleteAsset',
						type : 'post',
						dataType : "json",
						data : {
							deleteIds : id
						},
						async : false,
						success : function(data) {
							if (data.success) {
								toastr.success(data.message, '提示');
								$scope.refresh();
							} else {
								toastr.error(data.message, '提示');
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
			$http.get(
					"../../businesslose/assetList?type=" + type + "&name="
							+ name + "" + "&model=" + model + "&serialNumber="
							+ serialNumber + "&start=0&limit=" + pageSize)
					.success(function(response) {
						xh.maskHide();
						$scope.data = response.items;
						$scope.totals = response.totals;
						xh.pagging(page, parseInt($scope.totals), $scope);
					});
		};
		/* add页面查询数据 */
		$scope.searchlose = function() {
			var serialNumber = $("#serialNumberlose").val();
			$http.post("../../business/selectbynum?serialNumber="+serialNumber).success(function(response) {
						$scope.datatolose = response.items;
					});
		};
		// 分页点击
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
			$http.get(
					"../../businesslose/assetList?type=" + type + "&name="
							+ name + "" + "&model=" + model + "&serialNumber="
							+ serialNumber + "&start=" + start + "&limit="
							+ pageSize).success(function(response) {
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
/* 添加设备 */
xh.add = function(page) {
	var serialNumber = $("#serialNumberlose").val();
	var note = $("#note").val();
	$.ajax({
		url : '../../businesslose/insertAsset',
		type : 'POST',
		dataType : "json",
		async : true,
		data : {
			serialNumber : serialNumber,note:note
		},
		success : function(data) {

			if (data.result == 1) {
				$('#add').modal('hide');
				xh.refresh();
				toastr.success("添加成功", '提示');

			}else if(data.result==0){
				toastr.error("不存在或者序列号不唯一", '提示');
			} else if(data.result==2){
				toastr.error("存在相同信息", '提示');
			}
		},
		error : function() {
		}
	});
};
/* 修改 */
xh.update = function() {
	var notelose=$('#notelose').val();
	var serialNumbertemp=$('#serialNumbertemp').val();
	$.ajax({
		url : '../../businesslose/updateAsset',
		type : 'POST',
		dataType : "json",
		async : false,
		data : {
			notelose : notelose,serialNumbertemp:serialNumbertemp
		},
		success : function(data) {
			if (data.result === 1) {
				$('#edit').modal('hide');
				toastr.success(data.message, '提示');
				xh.refresh();

			} else {
				toastr.error(data.message, '提示');
			}
		},
		error : function() {
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
		swal({
			title : "提示",
			text : "请至少选择一条数据",
			type : "error"
		});
		return;
	}
	$.ajax({
		url : '../../businesslose/deleteAsset',
		type : 'post',
		dataType : "json",
		data : {
			deleteIds : checkVal.join(",")
		},
		async : false,
		success : function(data) {
			if (data.success) {
				toastr.success(data.message, '提示');
				xh.refresh();
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
// add页面搜索数据
xh.refreshlose = function() {
	var $scope = angular.element(appElement).scope();
	// 检查是否输入了搜索信息
	if ($('#serialNumberlose').val() == "") {
		return false;
	}
	// 调用$scope中的方法
	$scope.searchlose();

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

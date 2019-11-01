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
	var pageSize = $("#page-limit").val();
	app.controller("user", function($scope, $http) {
		xh.maskShow();
		$scope.count = "15";//每页数据显示默认值
		$scope.page=1;
		var user=$("input[name='user']").val();
		var roleId=$("select[name='roleId']").val();
		/* 获取用户权限 */
		$http.get("../../web/loginUserPower").success(
				function(response) {
					$scope.up = response;
		});
		// 获取登录用户
		$http.get("../../web/loginUserInfo").success(function(response) {
			$scope.loginUser = response.user;
			$scope.loginUserVpnId = response.vpnId;
			$scope.roleId = response.roleId ;
			console.log("vpnid="+$scope.loginUserVpnId)
			console.log("roleId="+$scope.roleId)
		});
		
		/* 获取用户信息 */
		$http.get("../../web/user/userList?user="+user+"&roleId="+roleId+"&start=0&limit=" + pageSize).success(
				function(response) {
					xh.maskHide();
					$scope.data = response.items;
					$scope.totals = response.totals;
					xh.pagging(1, parseInt($scope.totals), $scope);
				});
		/* 获取角色 */
		$http.get("../../web/role/allRoleList").success(function(response) {
			$scope.role = response.items;
		});
		/* vpn菜单 */
		$scope.showVpnMenu=function(){
		
			$("#vpnMenuWin").modal('show');
			$http.get("../../web/vpnMenu").success(
					function(response) {
						var zNodes = response.items;
						var t = $("#treeDemo");
						t = $.fn.zTree.init(t, setting, zNodes);
			});
			
		}
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search($scope.page);
		};
		/*跳转到权限分配页面*/
		$scope.power = function(id) {
			$scope.editData = $scope.data[id];
			window.location.href="user-power.html?user_id="+$scope.editData.userId+"&user="+$scope.editData.user;
	    };
	   
		/* 显示链接修改model */
		$scope.editModel = function(id) {
			$scope.editData = $scope.data[id];
			$scope.editData.roleId = $scope.editData.roleId.toString();
		};
		/* 显示按钮修改model */
		$scope.showEditModel = function() {
			var checkVal = [];
			$("[name='tb-check']:checkbox").each(function() {
				if ($(this).is(':checked')) {
					checkVal.push($(this).attr("index"));
				}
			});
			if (checkVal.length != 1) {
				swal({
					title : "提示",
					text : "只能选择一条数据",
					type : "error"
				});
				return;
			}
			$("#edit").modal('show');
			$scope.editData = $scope.data[parseInt(checkVal[0])];
			$scope.editData.roleId = $scope.editData.roleId.toString();

		};
		 /*启用账号*/
	    $scope.unLockUser = function(id) {
			$scope.editData = $scope.data[id];
			$.ajax({
				url : '../../web/user/lock',
				type : 'post',
				dataType : "json",
				data : {
					userId :id,
					lock:1
				},
				async : false,
				success : function(data) {
					if (data.result) {
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
		};
		 /*禁用账号*/
	    $scope.lockUser = function(id) {
			$.ajax({
				url : '../../web/user/lock',
				type : 'post',
				dataType : "json",
				data : {
					userId :id,
					lock:0
				},
				async : false,
				success : function(data) {
					if (data.result) {
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
		};
		/* 删除用户 */
		$scope.del = function(id) {
			swal({
				title : "提示",
				text : "确定要删除该用户吗？",
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
						url : '../../web/user/del',
						type : 'post',
						dataType : "json",
						data : {
							userId : id
						},
						async : false,
						success : function(data) {
							if (data.success) {
								toastr.success("删除用户成功", '提示');
								$scope.refresh();

							} else {
								swal({
									title : "提示",
									text : "删除用户失败",
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
			var $scope = angular.element(appElement).scope();
			var pageSize = $("#page-limit").val();
			var user=$("input[name='user']").val();
			var roleId=$("select[name='roleId']").val();
			var start = 1, limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;

			} else {
				start = (page - 1) * pageSize;
			}
			$scope.page=page;
			xh.maskShow();
			$http.get("../../web/user/userList?user="+user+"&roleId="+roleId+"&start=0&limit=" + limit)
					.success(function(response) {
						xh.maskHide();
						$scope.data = response.items;
						$scope.totals = response.totals;
						xh.pagging(page, parseInt($scope.totals), $scope);
					});
		};
		// 分页点击
		$scope.pageClick = function(page, totals, totalPages) {
			var pageSize = $("#page-limit").val();
			var user=$("input[name='user']").val();
			var roleId=$("select[name='roleId']").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			$scope.page=page;

			xh.maskShow();
			$http.get(
					"../../web/user/userList?user="+user+"&roleId="+roleId+"&start=" + start + "&limit="
							+ limit).success(function(response) {
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
/* 添加用户 */
xh.add = function() {
	var $scope = angular.element(appElement).scope();
	if($scope.loginUserVpnId!=null && $scope.loginUserVpnId!=''){
		if( $("#addForm").find("input[name='vpn']").val()==''){
			toastr.error("用户VPN虚拟专网名不能为空", '提示');
			return ;
		}
	}
	$.ajax({
		url : '../../web/user/add',
		type : 'POST',
		dataType : "json",
		async : true,
		data : $("#addForm").serializeArray(),
		success : function(data) {

			if (data.success) {
				$('#add').modal('hide');
				xh.refresh();
				toastr.success(data.message, '提示');

			} else {
				swal({
					title : "提示",
					text : data.message,
					type : "error"
				});
			}
		},
		error : function() {
		}
	});
};
/* 修改信息 */
xh.update = function() {
	var $scope = angular.element(appElement).scope();
	if($scope.loginUserVpnId!=null && $scope.loginUserVpnId!=''){
		if( $("#editForm").find("input[name='vpn']").val()==''){
			toastr.error("用户VPN虚拟专网名不能为空", '提示');
			return ;
		}
	}
	$.ajax({
		url : '../../web/user/update',
		type : 'POST',
		dataType : "json",
		async : false,
		data : $("#editForm").serializeArray(),
		success : function(data) {
			if (data.success) {
				$('#edit').modal('hide');
				toastr.success(data.message, '提示');
				xh.refresh();

			} else {
				swal({
					title : "提示",
					text : data.message,
					type : "error"
				});
			}
		},
		error : function() {
		}
	});
};
/* 批量删除用户 */
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
		url : '../../web/user/del',
		type : 'post',
		dataType : "json",
		data : {
			userId : checkVal.join(",")
		},
		async : false,
		success : function(data) {
			if (data.success) {
				toastr.success("删除用户成功", '提示');
				xh.refresh();
			} else {
				swal({
					title : "提示",
					text : "失败",
					type : "error"
				});
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
xh.onClick=function(e, treeId, treeNode) {

	$("input[name='vpn']").val(treeNode.name);
	$("input[name='vpnId']").val(treeNode.vpnId);
		
};

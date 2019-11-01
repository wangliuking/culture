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
		"timeOut" : "500",
		"extendedTimeOut" : "1000",
		"showMethod" : "fadeIn",
		"hideMethod" : "fadeOut",
		"progressBar" : true,
	};

xh.load = function() {
	var app = angular.module("app", []);
	app.controller("user", function($scope, $http) {
		xh.maskShow();
		$scope.count = "15";//每页数据显示默认值
		/* 获取用户权限 */
		$http.get("../../web/loginUserPower").success(
				function(response) {
					$scope.up = response;
				});
		// 获取登录用户
		$http.get("../../web/loginUserInfo").success(function(response) {
			xh.maskHide();
			$scope.loginUser = response.user;
			$scope.roleType = response.roleType.toString();
			$scope.type = response.roleType;
			$scope.loginUserRoleId = response.roleId;
		});
		/*获取信息*/
		$http.get("../../web/role/allRoleList").
		success(function(response){
			xh.maskHide();
			$scope.data = response.items;
			$scope.totals=$scope.data.length;
		});
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
		};
		/* 显示链接修改model */
		$scope.editModel = function(id) {
			$scope.editData = $scope.data[id];
			$scope.editData.roleType = $scope.editData.roleType.toString();
		};
		/*跳转到权限分配页面*/
		$scope.power = function(id) {
			$scope.editData = $scope.data[id];
			window.location.href="group-power.html?roleId="+$scope.editData.roleId;
	    };
		/*跳转到菜单分配页面*/
		$scope.menu = function(id) {
			$scope.editData = $scope.data[id];
			//+$scope.editData.roleId+"&role="+$scope.editData.role
			//window.location.href="role-menu.html?roleId=";
			$("#menuWin").modal('show');
		
			$.get("../../web/menu?roleId="+$scope.editData.roleId).success(function(response) {
				var zNodes = response.items;
				var t = $("#treeDemo");
				t = $.fn.zTree.init(t, setting, zNodes);
			});
			
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
			$scope.editData.roleType = $scope.editData.roleType.toString();
			
		};
		/* 删除用户 */
		$scope.del = function(id) {
			swal({
				title : "提示",
				text : "确定要删除该角色吗？",
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
						url : '../../web/role/del',
						type : 'post',
						dataType : "json",
						data : {
							roleId : id
						},
						async : false,
						success : function(data) {
							if (data.success) {
								toastr.success("删除角色成功", '提示');
								$scope.refresh();
					    	
							} else {
								swal({
									title : "提示",
									text : "删除角色失败",
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
			xh.maskShow();
			$http.get("../../web/role/allRoleList").
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals =$scope.totals=$scope.data.length;
			});
		};
	});
};
/* 添加角色*/
xh.add = function() {
	$.ajax({
		url : '../../web/role/add',
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
				toastr.error(data.message, '提示');
				/*swal({
					title : "提示",
					text : data.message,
					type : "error"
				});*/
			}
		},
		error : function() {
		}
	});
};
/* 修改角色信息 */
xh.update = function() {
	$.ajax({
		url : '../../web/role/update',
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
/* 批量删除角色*/
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
		url : '../../web/role/del',
		type : 'post',
		dataType : "json",
		data : {
			roleId : checkVal.join(",")
		},
		async : false,
		success : function(data) {
			if (data.success) {
				toastr.success("删除角色成功", '提示');
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
xh.onCheck=function(e, treeId, treeNode) {
	xh.maskShow();
	
	var $scope = angular.element(appElement).scope();
	var roleId=$scope.editData.roleId;
	var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
	checkCount = zTree.getCheckedNodes(true).length,
	nocheckCount = zTree.getCheckedNodes(false).length,
	change = zTree.getChangeCheckedNodes();
	
	var checkVal = [];
	var nocheckVal = [];
	
		
	for(var i=0;i<zTree.getCheckedNodes(true).length;i++){
		var node={};
		node.id=zTree.getCheckedNodes(true)[i].id;
		node.checked=zTree.getCheckedNodes(true)[i].checked;
		node.roleId=zTree.getCheckedNodes(true)[i].roleId;
		checkVal.push(node.id);
	}
	for(var i=0;i<zTree.getCheckedNodes(false).length;i++){
		var node={};
		node.id=zTree.getCheckedNodes(false)[i].id;
		node.checked=zTree.getCheckedNodes(false)[i].checked;
		node.roleId=zTree.getCheckedNodes(false)[i].roleId;
		nocheckVal.push(node.id);
	}
	
	if(checkVal.length>0){
		
		$.ajax({
			url : '../../web/updateMenu',
			type : 'post',
			dataType : "json",
			data:{
				checks:checkVal.join(","),
				nochecks:nocheckVal.join(","),
				roleId:roleId
				/*formData:JSON.stringify(checkVal) //将表单序列化为JSON对象
*/				
			},
			async : false,
			success : function(data) {
				toastr.success("已更新", '提示');
				
			},
			error : function() {
				xh.maskHide();
			}
		});
	}
	xh.maskHide();
	
		
};


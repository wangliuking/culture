/**
 * 邮件
 */
if (!("xh" in window)) {
	window.xh = {};
};
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
	app.controller("user", function($scope, $http) {
		xh.maskShow();
		/* 获取角色 */
		$http.get("../../web/role/allRoleList").success(function(response) {
			$scope.role = response.items;
		});
		/*获取登录用户信息*/
		$http.get("../../center/user/LoginUserInfo").
		success(function(response){
			xh.maskHide();
			$scope.editData = response.items;
			$scope.roleId = $scope.editData.roleId.toString();
		});
	});
};
/* 修改 */
xh.update = function() {
	$.ajax({
		url : '../../web/user/update',
		type : 'POST',
		dataType : "json",
		async : false,
		data : $("#editForm").serializeArray(),
		success : function(data) {
			if (data.success) {
				toastr.success("个人资料修改成功", '提示');

			} else {
				toastr.error("失败", '提示');
			}
		},
		error : function() {
		}
	});
};


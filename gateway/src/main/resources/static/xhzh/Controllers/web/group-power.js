/**
 * 用户管理
 */
if (!("xh" in window)) {
	window.xh = {};
};
var frist = 0;
var appElement = document.querySelector('[ng-controller=power]');
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
	app.config([ '$locationProvider', function($locationProvider) {
		$locationProvider.html5Mode({
			enabled : true,
			requireBase : false
		});
	} ]);
	app.controller("power", function($scope, $http, $location) {
		$scope.roleId = $location.search().roleId;
		
		/* 获取角色权限 */
		$scope.role_power=function(){
			
			$http.get("../../web/role/role_power?roleId="+$scope.roleId).success(function(response) {
				$scope.data = response.items;
			});
		}
		$scope.save=function(){
			$.ajax({
				url : '../../web/role/setgrouppower',
				type : 'POST',
				dataType : "json",
				async : false,
				data:{
					formData:xh.serializeJson($("#form").serializeArray()) //将表单序列化为JSON对象
				},
				success : function(data) {
					if (data.result === 1) {
						toastr.success(data.message, '提示');
						xh.refresh();

					} else {
						toastr.error(data.message, '提示');
					}
				},
				error : function(){
					toastr.error("参数错误", '提示');
				}
			});
		};
		
		$scope.role_power();
		

	});
};
$("#selectAll").bind("click", function() {
	$("#form").find("[type='checkbox']").prop("checked", true);// 全选
});
$("#selectNo").bind("click", function() {
	$("#form").find("[type='checkbox']").prop("checked", false);// 反选
});
$("#selectOther").bind("click", function() {
	var checkbox=$("#form").find("[type='checkbox']");
	
	for(var i=0;i<checkbox.length;i++){
		if(checkbox[i].checked==true){
			checkbox[i].checked=false;
		}else{
			checkbox[i].checked=true;
		}
	}
});
//刷新数据
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();

};

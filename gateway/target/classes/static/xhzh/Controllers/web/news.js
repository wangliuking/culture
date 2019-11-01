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
	var user=$("#user").val();
	var type=$("#type").val();
	var pageSize = $("#page-limit").val();
	app.controller("news", function($scope, $http) {
		$http.get("../../web/user/news").
		success(function(response){
			$scope.data = response.news;
		});
		
	});
};

/* 添加用户*/
xh.news = function() {
	$.ajax({
		url : '../../web/user/up_news',
		type : 'POST',
		dataType : "json",
		async : true,
		data : {
			news:$("textarea[name='news']").val()
		},
		success : function(data) {

			toastr.success("发布成功", '提示');
		},
		error : function() {
			toastr.error("发布失败", '提示');
		}
	});
};
/* 修改基站信息 */
xh.update = function() {
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

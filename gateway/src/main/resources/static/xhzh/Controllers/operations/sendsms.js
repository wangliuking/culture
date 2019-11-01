if (!("xh" in window)) {
	window.xh = {};
};
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
	app.controller("xhcontroller", function($scope, $http) {
		
		
		
		

	});
};
xh.sendsms=function(){
	
	$.ajax({
		url : '../../sms-send/writesms',
		type : 'POST',
		dataType : "json",
		async :false,
		data:{
			formData:xh.serializeJson($("#smsform").serializeArray()) //将表单序列化为JSON对象
		},
		success : function(data) {

			if (data.success) {
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
			swal({
				title : "提示",
				text : "响应服务器失败",
				type : "error"
			});
		}
	});
};



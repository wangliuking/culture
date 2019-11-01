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
	app.filter('dateFormat', function() { //可以注入依赖
	    return function(text) {
	    	
	    	
	        return text.split(" ")[0];
	    };
	});
	app.controller("user", function($scope, $http) {
		xh.maskShow();
		/* 获取用户权限 */
		$http.get("../../web/loginUserPower").success(
				function(response) {
					$scope.up = response;
		});
		$http.get("../../contacts/phone_list").
		success(function(response){
			xh.maskHide();
			$scope.data = response.items;
			$scope.totals = response.totals;
		});

		$scope.upBtn=function(){
			$scope.btnDisabled=false;
		}
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search();
		};
		$scope.edit=function(id){
			$("#updateWin").modal('show');
			$scope.editData=$scope.data[id];
		}
		$scope.showUpWin=function(id){
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
			$("#updateWin").modal('show');
			$scope.editData = $scope.data[parseInt(checkVal[0])];
		}
		$scope.del= function(id) {
			swal({
				title : "提示",
				text : "确定要删除联系人吗？",
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
						url : '../../contacts/phone_del',
						type : 'post',
						dataType : "json",
						data : {
							ids : $scope.data[id].id
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
				}
			});
			
		};
		
		/* 查询数据 */
		$scope.search = function() {
			xh.maskShow();
			$http.get("../../contacts/phone_list").
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
			});
		};
		
	});
};

xh.add = function() {
	$.ajax({
		url : '../../contacts/phone_write',
		type : 'POST',
		dataType : "json",
		async : false,
		data : {
			formData:xh.serializeJson($("#addForm").serializeArray())
		},
		success : function(data) {
			if (data.success) {
				$('#addWin').modal('hide');
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
xh.update= function() {
	$.ajax({
		url : '../../contacts/phone_update',
		type : 'POST',
		dataType : "json",
		async : false,
		data : {
			formData:xh.serializeJson($("#updateForm").serializeArray())
		},
		success : function(data) {
			if (data.success) {
				$('#updateWin').modal('hide');
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
	
	
	swal({
		title : "提示",
		text : "确定要删除这些联系人吗？",
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
				url : '../../contacts/phone_del',
				type : 'post',
				dataType : "json",
				data : {
					ids : checkVal.join(",")
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
		}
	});
	
	
	
	
	
	
};
// 刷新数据
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();

};

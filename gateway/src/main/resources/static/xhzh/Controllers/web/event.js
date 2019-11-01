/**
 * 计划任务
 */
if (!("xh" in window)) {
	window.xh = {};
};
var frist = 0;
var appElement = document.querySelector('[ng-controller=web]');
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
	app.controller("web", function($scope, $http) {
		xh.maskShow();
		/* 获取用户权限 */
		$http.get("../../web/loginUserPower").success(
				function(response) {
					$scope.up = response;
				});
		/*获取计划任务信息*/
		$http.get("../../web/event").
		success(function(response){
			xh.maskHide();
			$scope.data = response.items;
			$scope.totals = response.totals;
		});
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
		};
		/* 删除事件 */
		$scope.del = function(name) {
			swal({
				title : "提示",
				text : "确定要删除该任务吗",
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
						url : '../../web/delevent',
						type : 'post',
						dataType : "json",
						data : {
							name : name
						},
						async : false,
						success : function(data) {
							if (data.result) {
								toastr.success("删除任务成功", '提示');
								$scope.refresh();
					    	
							} else {
								toastr.error("删除任务失败", '提示');
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
		$scope.a = function(page) {
			$.ajax({
				url : '../../test/a',
				type : 'POST',
				dataType : "json",
				async : false,
				success : function(data) {
					
				},
				error : function() {
				}
			});
		};
		$scope.b = function(page) {
			$.ajax({
				url : '../../test/b',
				type : 'POST',
				dataType : "json",
				async : false,
				success : function(data) {
					
				},
				error : function() {
				}
			});
		};
		$scope.c = function(page) {
			$.ajax({
				url : '../../test/c',
				type : 'POST',
				dataType : "json",
				async : false,
				success : function(data) {
					
				},
				error : function() {
				}
			});
		};
		$scope.d = function(page) {
			$.ajax({
				url : '../../test/d',
				type : 'POST',
				dataType : "json",
				async : false,
				success : function(data) {
					
				},
				error : function() {
				}
			});
		};
		$scope.e = function(page) {
			$.ajax({
				url : '../../test/e',
				type : 'POST',
				dataType : "json",
				async : false,
				success : function(data) {
					
				},
				error : function() {
				}
			});
		};
		$scope.f = function(page) {
			$.ajax({
				url : '../../test/f',
				type : 'POST',
				dataType : "json",
				async : false,
				success : function(data) {
					
				},
				error : function() {
				}
			});
		};
		$scope.g = function(page) {
			$.ajax({
				url : '../../test/g',
				type : 'POST',
				dataType : "json",
				async : false,
				success : function(data) {
					
				},
				error : function() {
				}
			});
		};
		$scope.h = function(page) {
			$.ajax({
				url : '../../test/h',
				type : 'POST',
				dataType : "json",
				async : false,
				success : function(data) {
					
				},
				error : function() {
				}
			});
		};
		$scope.i = function(page) {
			$.ajax({
				url : '../../test/i',
				type : 'POST',
				dataType : "json",
				async : false,
				success : function(data) {
					
				},
				error : function() {
				}
			});
		};
		$scope.j = function(page) {
			$.ajax({
				url : '../../test/j',
				type : 'POST',
				dataType : "json",
				async : false,
				success : function(data) {
					
				},
				error : function() {
				}
			});
		};
	
		
		/* 查询数据 */
		$scope.search = function(page) {
			var $scope = angular.element(appElement).scope();
			xh.maskShow();
			$http.get("../../web/event").
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
			});
		};
		
	});
};
/* 添加*/
xh.add = function() {
	$.ajax({
		url : '../../web/addvent',
		type : 'POST',
		dataType : "json",
		async : true,
		data : $("#addForm").serializeArray(),
		success : function(data) {

			if (data.result) {
				$('#add').modal('hide');
				xh.refresh();
				toastr.success("添加事件成功", '提示');

			} else {
				toastr.error("添加事件失败", '提示');
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


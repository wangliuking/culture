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
		$scope.count = "15";//每页数据显示默认值
		$scope.securityMenu=true; //菜单变色
		$scope.starttime=xh.getYMD(7);
		$scope.btnDisabled=true;
		/*获取日志信息*/
		$http.get("../../onduty/list?&starttime="+$scope.starttime +
				"&start=0&limit="+pageSize).
		success(function(response){
			xh.maskHide();
			$scope.data = response.items;
			$scope.totals = response.totals;
			xh.pagging(1, parseInt($scope.totals),$scope);
		});
		$http.get("../../onduty/dutyinfo").
		success(function(response){
			$scope.leader= response.leader;
			$scope.tel= response.tel;
		});
		$scope.upBtn=function(){
			$scope.btnDisabled=false;
		}
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
		};
		$scope.updateInfo=function(){
			$.ajax({
				url : '../../onduty/updutyinfo',
				type : 'post',
				dataType : "json",
				data : $("#info").serializeArray(),
				async : false,
				success : function(data) {
					toastr.success("修改成功", '提示');
					$scope.btnDisabled=true;
			    	
				},
				error : function() {
					toastr.error("错误", '提示');
				}
			});
		}
		
		/* 查询数据 */
		$scope.search = function(page) {
			var $scope = angular.element(appElement).scope();
			var pageSize = $("#page-limit").val();
			var starttime=$("#starttime").val();
			var start = 1, limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;

			} else {
				start = (page - 1) * pageSize;
			}
			xh.maskShow();
			$http.get("../../onduty/list?&starttime="+starttime+
					"&start="+start+"&limit="+pageSize).
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				xh.pagging(page, parseInt($scope.totals),$scope);
			});
		};
		//分页点击
		$scope.pageClick = function(page,totals, totalPages) {
			var pageSize = $("#page-limit").val();
			var starttime=$("#starttime").val();
			var endtime=$("#endtime").val();
			var user=$("#user").val();
			var type=$("#type").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			xh.maskShow();
			$http.get("../../onduty/list?&starttime="+starttime+
					"&start="+start+"&limit="+pageSize).
			success(function(response){
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


/* 导入数据*/
xh.excel = function() {
	var p=$('#pathName').val();
	var b=p.substring(p.indexOf(".")+1,p.lenght);
	if (p== "") {
		alert("请选择需要上传的文件！");
		return true;
	}
	if (b!="xls") {
		alert("只能导入[.xls]格式的excel文档！");
		return true;
	}
	$("input[name='result']").val(2);
	/*$("#uploadfile").attr("disabled", true);*/
	xh.maskShow("正在上传文件，请耐心等待");
	$.ajaxFileUpload({
		url : '../../onduty/excel', //用于文件上传的服务器端请求地址
		secureuri : false, //是否需要安全协议，一般设置为false
		fileElementId : 'pathName', //文件上传域的ID
		dataType : 'json', // 返回值类型 一般设置为json
		type : 'POST',
		success : function(data, status) //服务器成功响应处理函数
		{
			//$("#uploadfile").attr("disabled", false);
			xh.maskHide();
			if (data.success) {
				
				toastr.success("导入成功", '提示');
				xh.refresh()
				
			} else {
				toastr.error("导入数据失败", '提示');
				xh.refresh();
			}

		},
		error : function(data, status, e)//服务器响应失败处理函数
		{
			alert(e);
			//$("#uploadfile").attr("disabled", false);
			xh.maskHide();
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
/* 批量删除用户*/
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
xh.pagging = function(currentPage,totals, $scope) {
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


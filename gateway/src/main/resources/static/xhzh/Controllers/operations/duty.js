if (!("xh" in window)) {
	window.xh = {};
};
var frist = 0;
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
var appElement = document.querySelector('[ng-controller=xhcontroller]');
xh.load = function() {
	var app = angular.module("app", []);
	var filename = $("#filename").val();
	var contact = $("#contact").val();
	var status = $("#status").val();
	var pageSize = $("#page-limit").val();

	app.filter('qualitystatus', function() { // 可以注入依赖
		return function(text) {
			if (text == 0) {
				return "未签收";
			} else if (text == 1) {
				return "签收";
			}
		};
	});

	app.controller("xhcontroller", function($scope, $http) {
		xh.maskShow();
		$scope.count = "20";// 每页数据显示默认值
		/* 获取用户权限 */
		$http.get("../../web/loginUserPower").success(
				function(response) {
					$scope.up = response;
				});
		// 获取登录用户
		$http.get("../../web/loginUserInfo").success(function(response) {
			xh.maskHide();
			$scope.loginUser = response.user;
			console.log("loginuser="+$scope.loginUser);
			$scope.loginUserRoleId = response.roleId;
		});
		$http.get(
				"../../duty/list?filename=" + filename + "" + "&contact="
						+ contact + "&status=" + status + ""
						+ "&start=0&limit=" + pageSize).success(
				function(response) {
					xh.maskHide();
					$scope.data = response.items;
					$scope.totals = response.totals;
					xh.pagging(1, parseInt($scope.totals), $scope);
				});
		/* 获取主管单位用户列表 */
		$http.get("../../web/user/getUserList?roleId=10002").success(
				function(response) {
					$scope.user = response.items;

				});
		/* 刷新数据 */
		$scope.refresh = function() {
			$("#filename").val("");
			$("#contact").val("");
			$scope.search(1);
		};

		/*显示详细信息*/
		$scope.editModel = function(id) {
			$("#detail").modal('show');
			$scope.editData = $scope.data[id];
		};
		/*下载工作记录*/
		$scope.download = function(path) {
			var index=path.lastIndexOf("/");
			var name=path.substring(index+1,path.length);	
			var downUrl = "../../uploadFile/downfile?filePath="+path+"&fileName=" + name;
			if(xh.isfile(path)){
				window.open(downUrl, '_self',
				'width=1,height=1,toolbar=no,menubar=no,location=no');
			}else{
				toastr.error("文件不存在", '提示');
			}
		};
		/*显示审核*/
		$scope.checkWin=function(index){
			$scope.checkData=$scope.data[index];
			var roleType=3;
			/* 获取主管单位用户列表 */
			$http.get("../../web/role/roleTypeByList?roleType="+roleType).success(
					function(response) {
						$scope.roleData = response.items;
						$scope.roleTotals=response.totals
					});
			
			$("#checkWin1").modal('show');
			
			
			/**/
			
		};
		$scope.check=function(){
			var checkVal = [];
			$("[name='roleType']:checkbox").each(function() {
				if ($(this).is(':checked')) {
					checkVal.push($(this).attr("id"));
				}
			});
			if (checkVal.length <1) {
				swal({
					title : "提示",
					text : "必须至少选择一个组发送通知",
					type : "error"
				});
				return;
			}
			$.ajax({
				url : '../../duty/sign',
				type : 'POST',
				dataType : "json",
				async : true,
				data:{
					id:$("#checkForm1").find('input[name="id"]').val(),
					check:$("#checkForm1").find('select[name="checked1"]').val(),
					note:$("#checkForm1").find('textarea[name="note1"]').val(),
					roleType:checkVal.join(","),
					recvUser:$scope.checkData.uploadUser
				},
				success : function(data) {

					if (data.result ==1) {
						xh.refresh();
						toastr.success(data.message, '提示');
						$("#checkWin1").modal('hide');
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

		/* 查询数据 */
		$scope.search = function(page) {
			var pageSize = $("#page-limit").val();
			var filename = $("#filename").val();
			var contact = $("#contact").val();
			var status = $("#status").val();
			var start = 1, limit = pageSize;
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
					"../../duty/list?filename=" + filename + "" + "&contact="
							+ contact + "&status=" + status + ""
							+ "&start=0&limit=" + pageSize).success(function(response) {
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				xh.pagging(page, parseInt($scope.totals), $scope);
			});
		};
		// 分页点击
		$scope.pageClick = function(page, totals, totalPages) {
			var pageSize = $("#page-limit").val();
			var filename = $("#filename").val();
			var contact = $("#contact").val();
			var status = $("#status").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			xh.maskShow();
			$http.get(
					"../../duty/list?filename=" + filename + "" + "&contact="
							+ contact + "&status=" + status + ""
							+ "&start="+start+"&limit=" + pageSize).success(function(response) {
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
//刷新数据
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();
};
/* 添加 */
xh.add = function() {
	var $scope = angular.element(appElement).scope();
	$.ajax({
		url : '../../duty/add',
		type : 'POST',
		dataType : "json",
		async : true,
		data:{
			formData:xh.serializeJson($("#addForm").serializeArray()) //将表单序列化为JSON对象
		},
		success : function(data) {

			if (data.result ==1) {
				$('#add').modal('hide');
				xh.refresh();
				toastr.success(data.message, '提示');
				$("input[name='result']").val("");
            	$("input[name='fileName']").val("");
            	$("input[name='filePath']").val("");
            	$("#uploadResult").html("");
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

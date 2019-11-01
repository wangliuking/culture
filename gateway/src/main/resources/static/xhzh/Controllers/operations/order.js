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
	var app = angular.module("app", [])
	

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
		var pageSize = $("#page-limit").val();
		/* 获取用户权限 */
		/*$http.get("../../web/loginUserPower").success(
				function(response) {
					$scope.up = response;
				});*/
		// 获取登录用户
		/*$http.get("../../web/loginUserInfo").success(function(response) {
			xh.maskHide();
			$scope.loginUser = response.user;
			console.log("loginuser="+$scope.loginUser);
			$scope.loginUserRoleId = response.roleId;
		});*/
		//获取派单列表
		$http.get("../../order/orderlist?start=0&limit=" + pageSize).success(
				function(response) {
					xh.maskHide();
					$scope.data = response.items;
					$scope.totals = response.totals;
					xh.pagging(1, parseInt($scope.totals), $scope);
				});
		
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
		};
	
		$scope.resend=function(index){
			
			var formData=$scope.data[index];
			$.ajax({
				url : '../../order/rewriteOrder',
				data : {
					formData:JSON.stringify(formData)
					
				},
				type : 'post',
				dataType : "json",
				async : false,
				success : function(response) {
					var data = response;
					if(data.success){
						toastr.success("派单成功", '提示');
					}else{
						toastr.error("派单失败", '提示');
					}
					

				},
				failure : function(response) {
					toastr.error("派单失败", '提示');
				}
			});
		}

		/*显示详细信息*/
		$scope.editModel = function(id) {
			$("#orderWin").modal('show');
			
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
		//确认派单完成
		$scope.check=function(id){
			$.ajax({
				url : '../../order/updateOrder',
				type : 'POST',
				dataType : "json",
				async : true,
				data:{
					id:$scope.data[id].id,
					bsId:$scope.data[id].bsid,
					zbdldm:$scope.data[id].zbdldm,
					from:$scope.data[id].from,
					serialnumber:$scope.data[id].serialnumber,
					userid:$scope.data[id].userid
				},
				success : function(data) {

					if (data.success) {
						$scope.refresh();
						toastr.success("已确认改派单中的故障处理意见", '提示');
					} else {
						toastr.success("确认失败", '提示');
					}
				},
				error : function() {
				}
			});
		};

		/* 查询数据 */
		$scope.search = function(page) {
			var pageSize = $("#page-limit").val();
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
					"../../order/orderlist?start=0&limit=" + pageSize).success(function(response) {
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				xh.pagging(page, parseInt($scope.totals), $scope);
			});
		};
		// 分页点击
		$scope.pageClick = function(page, totals, totalPages) {
			var pageSize = $("#page-limit").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			xh.maskShow();
			$http.get(
					"../../order/orderlist?start="+start+"&limit=" + pageSize).success(function(response) {
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
xh.print_order=function() {
	var LODOP = getLodop();
	LODOP.PRINT_INIT("故障处理任务单");
	LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
	LODOP.ADD_PRINT_TABLE("1%", "2%", "96%", "96%", document.getElementById("print_order").innerHTML);
	 LODOP.PREVIEW();  	
};

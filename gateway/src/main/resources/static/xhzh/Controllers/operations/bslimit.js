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
	var pageSize = 1000;
	app.controller("user", function($scope, $http) {
		xh.maskShow();
		$scope.count = "15";//每页数据显示默认值
		
		/* 获取信息 */
		$http.get("../../bs/bslimitList?start=0&limit=" + pageSize).success(
				function(response) {
					xh.maskHide();
					$scope.data = response.items;
					$scope.totals = response.totals;
					xh.pagging(1, parseInt($scope.totals), $scope);
				});
		$http.get("../../bs/bsInfolimit").
		success(function(response){
			xh.maskHide();
			$scope.bs_search_data = response.items;
			$scope.bs_search_totals = $scope.data.length;
		});
		/* 获取用户权限 */
		$http.get("../../web/loginUserPower").success(
				function(response) {
					$scope.up = response;
		});
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
		};
		$scope.showBsModal=function(){
			$http.get("../../bs/bsInfolimit").
			success(function(response){
				xh.maskHide();
				$scope.bs_search_data = response.items;
				$scope.bs_search_totals = $scope.data.length;
			});
			
			/*$("#aside-right").fadeToggle("fast");*/
			$("#add").modal('show');
		}
		$scope.save=function(){
			var checkbox=$(".bsList").find("[type='checkbox']");
			
			
			var bsIds=[];
			for(var i=0;i<checkbox.length;i++){
				if(checkbox[i].checked==true){
					bsIds.push(checkbox[i].value)
				}
			}
			if(bsIds.length>0){
				
			}else{
				$scope.bsIds="";
			}
			
			$.ajax({
				url : '../../bs/addBsLimit',
				type : 'post',
				dataType : "json",
				data : {
					bsIds:bsIds.join(",")
				},
				async : false,
				success : function(data) {
					toastr.success("配置成功", '提示');
					$scope.refresh();
					/*if (data.success) {
						toastr.success(data.message, '提示');
						$scope.refresh();
					} else {
						//toastr.error(data.message, '提示');
					}*/
				},
				error : function() {
					$scope.refresh();
				}
			});
			
			
			
			
			
		}
	   
		
		
		/* 删除 */
		$scope.del = function(id) {
			$.ajax({
				url : '../../bs/deleteBsLimit',
				type : 'post',
				dataType : "json",
				data : {
					bsIds : id
				},
				async : false,
				success : function(data) {
					if (data.success) {
						toastr.success(data.message, '提示');
						$scope.refresh();

					} else {
						toastr.error(data.message, '提示');
					}
				},
				error : function() {
					toastr.error("失败", '提示');
					$scope.refresh();
				}
			});
		};
		/* 查询数据 */
		$scope.search = function(page) {
			var $scope = angular.element(appElement).scope();
			var pageSize = 1000;
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
			$http.get("../../bs/bslimitList?start=0&limit=" + pageSize)
					.success(function(response) {
						xh.maskHide();
						$scope.data = response.items;
						$scope.totals = response.totals;
						xh.pagging(page, parseInt($scope.totals), $scope);
					});
		};
		// 分页点击
		$scope.pageClick = function(page, totals, totalPages) {
			var pageSize = 1000;
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}

			xh.maskShow();
			$http.get("../../bs/bslimitList?start="+start+"&limit=" + limit).success(function(response) {
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
$("#selectAll").bind("click", function() {
	$(".bsList").find("[type='checkbox']").prop("checked", true);// 全选
});
$("#selectNo").bind("click", function() {
	$(".bsList").find("[type='checkbox']").prop("checked", false);// 反选
});
$("#selectOther").bind("click", function() {
	var checkbox=$(".bsList").find("[type='checkbox']");
	
	for(var i=0;i<checkbox.length;i++){
		if(checkbox[i].checked==true){
			checkbox[i].checked=false;
		}else{
			checkbox[i].checked=true;
		}
	}
	
	/*if($("#form").find("[type='checkbox']").is(':checked')){
		$("#form").find("[type='checkbox']").prop("checked", false);
	}else{
		$("#form").find("[type='checkbox']").prop("checked", true);
	}*/
});

/* 批量删除 */
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
		url : '../../bs/deleteBsLimit',
		type : 'post',
		dataType : "json",
		data : {
			bsIds : checkVal.join(",")
		},
		async : false,
		success : function(data) {
			if (data.success) {
				toastr.success(data.message, '提示');
				xh.refresh();
			} else {
				toastr.error(data.message, '提示');
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

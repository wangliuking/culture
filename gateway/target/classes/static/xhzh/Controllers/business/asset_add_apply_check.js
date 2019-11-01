/**
 * 资产管理
 */
if (!("xh" in window)) {
	window.xh = {};
};

var frist = 0;
var delay = 3;
var appElement = document.querySelector('[ng-controller=xhcontroller]');
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
	
	var pageSize = $("#page-limit").val();
	app.controller("xhcontroller", function($scope,$http,$location) {
		$scope.page_id=$location.search().id;
		$scope.page_user=$location.search().user;
		$scope.page_fileName=$location.search().fileName;
		$scope.page_comment=$location.search().comment;
		$scope.page_applyTag=$location.search().applyTag;
		xh.maskShow();
		$scope.count = "15";//每页数据显示默认值
		
		// 获取登录用户
		$http.get("../../web/loginUserInfo").success(function(response) {
			xh.maskHide();
			$scope.loginUser = response.user;
			$scope.loginUserRoleId = response.roleId;
			$scope.loginUserRoleType = response.roleType;
		});
		/* 获取用户权限 */
		$http.get("../../web/loginUserPower").success(
				function(response) {
					$scope.up = response;
		});
		$scope.isLockAsset=function(){
			$http.get("../../business/assetList?isLock=1&tag=0&type=0&name=" +
					"&applyTag="+$scope.page_applyTag+"&model=&serialNumber=&from=0&user="+$scope.page_user+"&status=0&start=0&limit=500").
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				//xh.pagging(1, parseInt($scope.totals), $scope);
			});
		}
		$scope.goBack = function() {
			window.location.href="asset_add_apply.html";
			//$("#table-checkbox").prop("checked", false);
		};
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
			//$("#table-checkbox").prop("checked", false);
		};
		/* 审核信息 */
		$scope.checkInfo = function(tag) {
			var title="";
			if(tag==0){
				title="确定要拒绝该申请吗？";
			}else{
				title="确认同意该申请吗？";
			}
			swal({
				title : "提示",
				text : title,
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
						url : '../../business/asset/add_apply_check1',
						type : 'post',
						dataType : "json",
						data : {
							id : $scope.page_id,
							checked:tag,
							user:$scope.page_user,
							comment:$("textarea[name='comment']").val()
						},
						async : false,
						success : function(data) {
							if (data.success) {
								toastr.success(data.message, '提示');
								xh.delayURL();

							} else {
								toastr.error(data.message, '提示');
							}
						},
						error : function() {
							toastr.error("系统错误", '提示');
						}
					});
				}
			});
		};
	    
		$scope.download = function(name) {
			/*var index=path.lastIndexOf("/");
			var name=path.substring(index+1,path.length);	*/
			var filename=name
			var filepath = "/Resources/upload/asset/" + filename;
			var downUrl = "../../uploadFile/download?fileName=" + filename + "&filePath=" + filepath;
			if(xh.isfile(filepath)){
				window.open(downUrl, '_self','width=1,height=1,toolbar=no,menubar=no,location=no');
			}else{
				toastr.error("文件不存在", '提示');
			}
		};
	    /* 查询数据 */
		$scope.search = function(page) {
			var pageSize = 500;
			var type = 0;
			var name ="";
			var model = "";
			var serialNumber = "";
			var from =0;
			var status = 0;
			var limit = pageSize;
			var start=0;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;

			} else {
				start = (page - 1) * pageSize;
			}
			xh.maskShow();
			$http.get("../../business/assetList?isLock=1&tag=1&type="+type+"&name="+name+"" +
					"&model="+model+"&serialNumber="+serialNumber+"&from="+from+"" +
					"&status="+status+"&start=0&limit="+pageSize).
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				//xh.pagging(page, parseInt($scope.totals), $scope);
			});
		};
		//分页点击
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
			$http.get("../../asset/assetCheckList?start="+start+"&limit=" + pageSize).
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
		$scope.isLockAsset();
	});
	
	
};

//刷新数据
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();

};
xh.delayURL=function() { 
	var url="asset_add_apply.html";
    var t = setTimeout("xh.delayURL()", 1000);
    xh.delayShow();
    if (delay > 0) {
        delay--;
        var html="审核完成 页面 "+delay+" 秒后开始跳转";
        $(".delayText").html(html);
    } else {
        clearTimeout(t); 
        window.location.href =url;
    }        
} 
/* 添加设备 */
xh.add = function() {
	
	$.ajax({
		url : '../../business/asset_applay_create',
		type : 'POST',
		dataType : "json",
		async : true,
		data:{
			formData:xh.serializeJson($("#addForm").serializeArray()) //将表单序列化为JSON对象
		},
		success : function(data) {
			if (data.success) {
				//$('#addForm')[0].reset();
				$('#add').modal('hide');
				xh.refresh();
				toastr.success(data.message, '提示');
				
			} else {
				toastr.error(data.message, '提示');
			}
			$("#add_btn").button('reset');
		},
		error : function() {
			$("#add_btn").button('reset');
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
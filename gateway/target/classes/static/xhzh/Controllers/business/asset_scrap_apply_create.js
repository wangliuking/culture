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
	
	var pageSize = $("#page-limit").val();
	app.controller("xhcontroller", function($scope,$http) {
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
		$scope.isLockScrapAsset=function(){
			$http.get("../../business/asset_scrap_info?applyTag=").
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
			});
		}
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.isLockScrapAsset();
			//$("#table-checkbox").prop("checked", false);
		};
		/* 删除 */
		$scope.del_asset = function(id) {
			$.ajax({
				url : '../../business/deleteScrapAsset',
				type : 'post',
				dataType : "json",
				data : {
					deleteIds : id
				},
				async : false,
				success : function(data) {
					if (data.result==1) {
						toastr.success(data.message, '提示');
						$scope.refresh();
					} else {
						toastr.error(data.message, '提示');
					}
				},
				error : function() {
					$scope.refresh();
				}
			});
		};
		/*跳转到申请进度页面*/
		$scope.toProgress = function (id) {
			$scope.progressData = $scope.data[id];
			$("#progress").modal('show');
	    };
	    $scope.toback = function () {
	    	window.location.href="asset_scrap_apply.html";
	    };
	    
		/*下载工作记录*/
		$scope.download = function(name) {
			/*var index=path.lastIndexOf("/");
			var name=path.substring(index+1,path.length);	*/
			var filename=name
			var filepath = "/Resources/upload/assetCheck/" + filename;
			var downUrl = "../../uploadFile/download?fileName=" + filename + "&filePath=" + filepath;
			if(xh.isfile(filepath)){
				window.open(downUrl, '_self','width=1,height=1,toolbar=no,menubar=no,location=no');
			}else{
				toastr.error("文件不存在", '提示');
			}
		};
		$scope.isLockScrapAsset();
	});
	
	
};

//刷新数据
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();

};
/* 添加设备 */
xh.add = function() {
	
	$.ajax({
		url : '../../business/insertScrapAsset',
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

xh.applay = function() {
	var $scope = angular.element(appElement).scope();
	if($scope.totals<1){
		toastr.error("资产清单不能为空", '提示');
		return;
	}
	if ($('#filePath').val()!= "" && $("input[name='result']").val()!=1) {
		toastr.error("请先上传你的附件", '提示');
		return;
	}
	$.ajax({
		url : '../../business/asset/scrap_apply',
		type : 'POST',
		dataType : "json",
		async : false,
		data:{
			comment:$("textarea[name='comment']").val(),
			fileName:$("input[name='fileName']").val(),
			filePath:$("input[name='path']").val()
		},
		success : function(data) {

			if (data.success) {
				toastr.success(data.message, '提示');
				$("#add-apply-btn").prop('disabled', true);
				xh.delayURL();

			} else {
				toastr.error(data.message, '提示');
			}
		},
		error : function() {
			toastr.error("参数错误", '提示');
		}
	});
};
xh.delayURL=function() { 
	var url="asset_scrap_apply.html";
    var t = setTimeout("xh.delayURL()", 1000);
    xh.delayShow();
    if (delay > 0) {
        delay--;
        var html="申请已经发送成功 页面 "+delay+" 秒后开始跳转";
        $(".delayText").html(html);
    } else {
        clearTimeout(t); 
        window.location.href =url;
    }        
} 

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
	$("#to-excel").button('loading');
	xh.maskShow("正在上传文件，请耐心等待");
	$.ajaxFileUpload({
		url : '../../business/asset/excel/scrap', //用于文件上传的服务器端请求地址
		secureuri : false, //是否需要安全协议，一般设置为false
		fileElementId : 'pathName', //文件上传域的ID
		dataType : 'json', // 返回值类型 一般设置为json
		type : 'POST',
		success : function(data, status) //服务器成功响应处理函数
		{
			//$("#uploadfile").attr("disabled", false);
			xh.maskHide();
			$("#to-excel").button('reset');
			if (data.success) {
				
				swal({
					title : "提示",
					text : "导入成功!  总数："+data.totals+"条  成功导入："+data.successCount+"条 失败："+(data.totals-data.successCount),
					type : "success"
				});
				$("#excelWin").modal('hide');
				xh.refresh()
				
			} else {
				toastr.error("导入数据失败", '提示');
				xh.refresh();
			}

		},
		error : function(data, status, e)//服务器响应失败处理函数
		{
			$("#to-excel").button('reset');
			toastr.error("失败");
			//$("#uploadfile").attr("disabled", false);
			xh.maskHide();
		}
	});
};


/*上传文件*/
xh.upload = function() {
	if($("input[type='file']").val()==""){
		toastr.error("你还没选择文件", '提示');
		return;
	}
	xh.maskShow();
	$.ajaxFileUpload({
		url : '../../asset/upload', //用于文件上传的服务器端请求地址
		secureuri : false, //是否需要安全协议，一般设置为false
		fileElementId : 'filePath', //文件上传域的ID
		dataType : 'json', //返回值类型 一般设置为json
		type:'POST',
		success : function(data, status) //服务器成功响应处理函数
		{
			xh.maskHide();
			if(data.success){
				$("#uploadResult").html(data.message);
				$("input[name='result']").val(1);
				$("input[name='fileName']").val(data.fileName);
				$("input[name='path']").val(data.filePath);
			}else{
				$("#uploadResult").html(data.message);
			}
			
		},
		error : function(data, status, e)//服务器响应失败处理函数
		{
			alert(e);
		}
	});
};
xh.download=function(){
	var $scope = angular.element(appElement).scope();
	var filename=$scope.checkData.fileName;
	var filepath = "/Resources/upload/assetCheck/" + filename;
	var downUrl = "../../uploadFile/download?fileName=" + filename + "&filePath=" + filepath;
	if(xh.isfile(filepath)){
		window.open(downUrl, '_self','width=1,height=1,toolbar=no,menubar=no,location=no');
	}else{
		toastr.error("文件不存在", '提示');
	}
	
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
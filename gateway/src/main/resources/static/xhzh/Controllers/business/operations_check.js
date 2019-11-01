/**
 * 资产管理
 */
if (!("xh" in window)) {
	window.xh = {};
};

var frist = 0;
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
		/*跳转到申请进度页面*/
	
		

		
		/*获取记录表*/
		$http.get("../../check/data?start=0&limit=" + pageSize).
		success(function(response){
			xh.maskHide();
			$scope.data = response.items;
			$scope.totals = response.totals;
			
			
			xh.pagging(1, parseInt($scope.totals), $scope);
		});
	    
	    $scope.toCheck2 = function (index) {
	    $scope.check_data=$scope.data[index]
	    $("#checkWin2").modal('show');
	    };
		
		
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
			$("#table-checkbox").prop("checked", false);
		};
		/*跳转到处理页面*/
		$scope.toDeal = function (id) {
			$scope.editData = $scope.data[id];
			window.location.href="operations_check_create.html?user=" +$scope.editData.user+
					"&id="+$scope.editData.id+"" +
					"&checkMonth="+$scope.editData.checkMonth+"&applyId="+$scope.editData.applyId;
	    };
		/*跳转到申请进度页面*/
		$scope.toProgress = function (id) {
			$scope.progressData = $scope.data[id];
			$scope.searchDetail($scope.progressData.checkMonth)
			//$scope.asset_apply_list(id);
			$("#progress").modal('show');
	    };
	    
	    
		/*下载工作记录*/
		$scope.download = function(name) {
			/*var index=path.lastIndexOf("/");
			var name=path.substring(index+1,path.length);	*/
			var filename=name
			var filepath = "/Resources/upload/business/" + filename;
			var downUrl = "../../uploadFile/download?fileName=" + filename + "&filePath=" + filepath;
			if(xh.isfile(filepath)){
				window.open(downUrl, '_self','width=1,height=1,toolbar=no,menubar=no,location=no');
			}else{
				toastr.error("文件不存在", '提示');
			}
		};
		$scope.preview = function(filename) {
			xh.maskShow();
			var path="../../Resources/upload/asset/"
			
			var filepath = "/Resources/upload/asset/" + filename;
			
			var url="../web/doc-preview.html?fileName="+filename+"&filePath="+path;
			$.ajax({
	    		url : '../../web/preview',
	    		type : 'POST',
	    		dataType : "json",
	    		async : false,
	    		data:{
	    			filePath:filepath
	    		},
	    		success : function(data) {
	    			xh.maskHide();
	    			if (data.success) {
	    				window.open(url);

	    			} else {
	    				toastr.error("文档转换失败，只能预览office，txt文档", '提示');
	    			}
	    		},
	    		error : function() {
	    			toastr.error("系统错误", '提示');
	    			xh.maskHide();
	    			
	    		}
	    	});
			
		};
		$scope.searchDetail=function(time){
			$http.get("../../check/searchDetail?time="+time).
			success(function(response){
				xh.maskHide();
				$scope.detailData = response.items;
				$scope.sum=response.sum;
				
				
			});
		}
		/*显示审核窗口*/
		$scope.checkWin = function (id) {
			$scope.checkData=$scope.data[id];			
				$("#checkWin1").modal('show');	
	    };
	    $scope.checkWin2 = function (id) {
			$scope.checkData=$scope.data[id];			
				$("#checkWin2").modal('show');	
	    };
	    $scope.check2 =function(tag){
	    	var title="";
			if(tag==-1){
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
						url : '../../check/check2',
						type : 'post',
						dataType : "json",
						data : {
							id : $scope.checkData.id,
							check:tag,
							user:$scope.checkData.user,
							comment:$("textarea[name='workNote']").val()
						},
						async : false,
						success : function(data) {
							if (data.success) {
								toastr.success(data.message, '提示');
								$scope.refresh();
								$("#checkWin2").modal('hide')

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
		$scope.check4=function(index){
			var data=$scope.data[index];
			$.ajax({
				url : '../../check/check4',
				type : 'post',
				dataType : "json",
				data : {
					id : data.id,
					user:data.checkUser
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
					toastr.error("系统错误", '提示');
				}
			});
		}
	   
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
			xh.maskShow();
			$http.get("../../check/data?start="+start+"&limit=" + pageSize).
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				xh.pagging(1, parseInt($scope.totals), $scope);
			});
			/*$http.get("../../business/lend/list?start="+start+"&limit=" + pageSize).
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				xh.pagging(page, parseInt($scope.totals), $scope);
			});*/
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
			$http.get("../../check/data?start="+start+"&limit=" + pageSize).
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
xh.add = function() {
	var fileName=$("#addWin").find("input[name='fileName']").val();
	var month=$("#addWin").find("input[name='month']").val();
	if(fileName==""){
		toastr.error("还没有上传文件", '提示');
		return ;
	}
	if(month==""){
		toastr.error("考核月份不能为空", '提示');
		return ;
	}
	
	$.ajax({
		url : '../../check/add',
		type : 'POST',
		dataType : "json",
		async : true,
		data:{
			//data:xh.serializeJson($("#addForm").serializeArray()) //将表单序列化为JSON对象
			month:$("#addWin").find("input[name='month']").val(),
			comment:$("#addWin").find("textarea[name='comment']").val(),
			fileName:$("#addWin").find("input[name='fileName']").val(),
			filePath:$("#addWin").find("input[name='path']").val()
		},
		success : function(data) {
			if (data.success) {
				toastr.success(data.message, '提示');
				$("#addWin").modal('hide');
				xh.refresh();
				
			} else {
				toastr.error(data.message, '提示');
			}
		},
		error : function() {
			toastr.error("系统错误", '提示');
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
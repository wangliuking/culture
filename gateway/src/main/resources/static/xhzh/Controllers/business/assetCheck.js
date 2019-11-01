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
					console.log("up->"+$scope.up.o_check_change)
		});

		
		/*获取申请记录表*/
		$http.get("../../asset/assetCheckList?start=0&limit=" + pageSize).
		success(function(response){
			xh.maskHide();
			$scope.data = response.items;
			$scope.totals = response.totals;
			xh.pagging(1, parseInt($scope.totals), $scope);
		});
		
		
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
			$("#table-checkbox").prop("checked", false);
		};
		/*跳转到处理页面*/
		$scope.toDeal = function (id) {
			$scope.editData = $scope.data[id];
			window.location.href="lend-deal.html?data_id="+$scope.editData.id;
	    };
		/*跳转到申请进度页面*/
		$scope.toProgress = function (id) {
			$scope.progressData = $scope.data[id];
			$("#progress").modal('show');
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
	    
	    $scope.checkedChange=function(issure){
	    	$scope.issure=issure==1?true:false;
	    	console.log($scope.issure);
	    };
	  
		/*显示审核窗口*/
		$scope.checkWin = function (id) {
			$scope.checkData=$scope.data[id];			
				$("#checkWin1").modal('show');	
	    };
	    $scope.checkWin2 = function (id) {
			$scope.checkData=$scope.data[id];			
				$("#checkWin2").modal('show');	
	    };
	    $scope.checkWin3 = function (id) {
			$scope.checkData=$scope.data[id];			
				$("#checkWin3").modal('show');	
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
			xh.maskShow();
			$http.get("../../asset/assetCheckList?start="+start+"&limit=" + pageSize).
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
	});
	
};
xh.checkedChange=function(){
	var $scope = angular.element(appElement).scope();
    $scope.checkedChange($("#checkForm1").find("select[name='checked']").val());
};
/*申请核查资产*/
xh.add = function() {
	$.ajax({
		url : '../../asset/apply',
		type : 'POST',
		dataType : "json",
		async : true,
		data:{
			formData:xh.serializeJson($("#addForm").serializeArray()) //将表单序列化为JSON对象
		},
		success : function(data) {

			if (data.result ==1) {
				$('#apply').modal('hide');
				xh.refresh();
				toastr.success(data.message, '提示');

			} else {
				toastr.error(data.message, '提示');
			}
		},
		error : function() {
		}
	});
};
/*主管部门审核*/
xh.check1 = function() {
	var $scope = angular.element(appElement).scope();
	$.ajax({
		url : '../../asset/checkOne',
		type : 'POST',
		dataType : "json",
		async : true,
		data:{
			id:$("#checkForm1").find("input[name='id']").val(),
			note1:$("#checkForm1").find("textarea[name='note1']").val(),
			checked:$("#checkForm1").find("select[name='checked1']").val(),
			account:$scope.checkData.account
		},
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin1').modal('hide');
				xh.refresh();
				toastr.success(data.message, '提示');

			} else {
				toastr.error(data.message, '提示');
			}
		},
		error : function() {
		}
	});
};


xh.check2 = function(checked) {
	var $scope = angular.element(appElement).scope();
	$.ajax({
		url : '../../asset/checkTwo',
		type : 'POST',
		dataType : "json",
		async : true,
		data:{
			id:$("#checkForm2").find("input[name='id']").val(),
			note:$("#checkForm2").find("textarea[name='note2']").val(),
			fileName:$("#checkForm2").find("input[name='fileName']").val(),
			filePath:$("#checkForm2").find("input[name='filePath']").val(),
			user1:$scope.checkData.user1
		},
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin2').modal('hide');
				xh.refresh();
				toastr.success(data.message, '提示');

			} else {
				toastr.error(data.message, '提示');
			}
		},
		error : function() {
		}
	});
};
xh.check3 = function(tag) {
	var $scope = angular.element(appElement).scope();
	$.ajax({
		url : '../../asset/check3',
		type : 'POST',
		dataType : "json",
		async : true,
		data:{
			id:$("#checkForm3").find("input[name='id']").val(),
			note3:$("#checkForm3").find("textarea[name='note3']").val(),
			checked:tag==0?-3:3,
			account:$scope.checkData.account
		},
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin3').modal('hide');
				xh.refresh();
				toastr.success(data.message, '提示');

			} else {
				toastr.error(data.message, '提示');
			}
		},
		error : function() {
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
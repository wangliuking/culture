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
/*	var type = $("#type").val();
	var name = $("#name").val();
	var model = $("#model").val();
	var serialNumber = $("#serialNumber").val();
	var from = $("#from").val();
	var status = $("#status").val();
	var pageSize = $("#page-limit").val();*/
	
	var pageSize = $("#page-limit").val();
    app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);
	app.controller("xhcontroller", function($scope,$http,$location) {
		xh.maskShow();
		$scope.count = "15";//每页数据显示默认值
		$scope.businessMenu=true; //菜单变色
		
		//获取登录用户
		$http.get("../../web/loginUserInfo").
		success(function(response){
			xh.maskHide();
			$scope.loginUser = response.user;
			$scope.loginUserRoleId = response.roleId;	
		});
		/* 获取用户权限 */
		$http.get("../../web/loginUserPower").success(
				function(response) {
					$scope.up = response;
		});
		
		/*获取申请记录表*/
		$http.get("../../support/selectAll?start=0&limit=" + pageSize).
		success(function(response){
			xh.maskHide();
			$scope.data = response.items;
			$scope.totals = response.totals;
			xh.pagging(1, parseInt($scope.totals), $scope);
		});
		
		/*获取管理房人员列表*/
		$http.get("../../web/user/getUserList?roleId=10001").
		success(function(response){
			$scope.userData_MainManager = response.items;
			$scope.userTotals_MainManager = response.totals;
			if($scope.userTotals_MainManager > 0){
				$scope.user_M=$scope.userData_MainManager[0].user;
			}
		});
		
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
			/*$("#table-checkbox").prop("checked", false);*/
		};

		$scope.download = function() {
			xh.download();
		}

		/*跳转到进度页面*/
		$scope.toProgress = function (id) {
			$scope.editData = $scope.data[id];
			$scope.checkData=$scope.editData;
			/*$http.get("../../net/applyProgress?id="+$scope.editData.id).
			success(function(response){
				$scope.progressData = response.items;
				
			});*/
			$scope.progressData=$scope.editData;
			$("#progress").modal('show');
			$('#xh-tabs a:first').tab('show');
	    };
	    /*跳转到进度页面*/
		$scope.toPrint = function (id) {
			$scope.editData = $scope.data[id];
			$scope.checkData=$scope.editData;
			$scope.progressData=$scope.editData;
			if($scope.checkData.checked==17){
				$("#download").modal('show');
			}
	    };
		/*显示审核窗口*/
		$scope.checkWin = function (id) {
			$scope.checkData = $scope.data[id];
			//$http.get("../../web/user/userlist10002").
			$http.get("../../web/user/getUserList?roleId=10001").
			success(function(response){
				$scope.userData = response.items;
				$scope.userTotals = response.totals;
				if($scope.userTotals>0){
					$scope.user=$scope.userData[0].user;
				}
			});
			if($scope.loginUserRoleId==10001 && $scope.checkData.checked==0){
				$("#checkWin1").modal('show');
			}
			if($scope.loginUserRoleId==10002 && $scope.checkData.checked==1){				
				$http.get("../../web/user/getUserList?roleId=10002&user="+$scope.loginUser)
				.success(function(response) {
					$scope.userData = response.items;
					$scope.userTotals = response.totals;
					if ($scope.userTotals > 0) {
						$scope.user = $scope.userData[0].user;
					}
				});
			
				$("#checkWin17").modal('show');
			}
			if($scope.loginUserRoleId==10002 && $scope.checkData.checked==2){
				$("#checkWin2").modal('show');
			}
			if($scope.loginUserRoleId==1000 && $scope.checkData.checked==3){
				$("#checkWin3").modal('show');
			}
			if($scope.loginUserRoleId==10002 && $scope.checkData.checked==4){
				$("#checkWin4").modal('show');
			}
			if($scope.loginUserRoleId==10003 && $scope.checkData.checked==5){
				$("#checkWin5").modal('show');
			}
			if($scope.loginUserRoleId==10003 && $scope.checkData.checked==6){
				$("#checkWin6").modal('show');
			}
			if($scope.loginUserRoleId==10002 && $scope.checkData.checked==7){
				$("#checkWin7").modal('show');
			}
			if($scope.loginUserRoleId==10002 && $scope.checkData.checked==8){
				$("#checkWin8").modal('show');
			}
			if($scope.loginUserRoleId==1000 && $scope.checkData.checked==9){
				$("#checkWin9").modal('show');
			}
			if($scope.loginUserRoleId==10003 && $scope.checkData.checked==10){
				$("#checkWin10").modal('show');
			}
			if($scope.loginUserRoleId==10002 && $scope.checkData.checked==11){
				$("#checkWin11").modal('show');
			}
			if($scope.loginUserRoleId==10002 && $scope.checkData.checked==12){
				$("#checkWin12").modal('show');
			}
			if($scope.loginUserRoleId==1000 && $scope.checkData.checked==13){
				$("#checkWin13").modal('show');
			}
			if($scope.loginUserRoleId==10003 && $scope.checkData.checked==14){
				$("#checkWin14").modal('show');
			}
			if($scope.loginUserRoleId==10002 && $scope.checkData.checked==15){
				$("#checkWin15").modal('show');
			}
			if($scope.loginUserRoleId==1000 && $scope.checkData.checked==16){
				$("#checkWin16").modal('show');
			}
	    };
		/* 显示修改model */
		$scope.editModel = function(id) {
			$scope.editData = $scope.data[id];
			$scope.type = $scope.editData.type.toString();
			$scope.from = $scope.editData.from.toString();
		};
		/* 显示修改model */
		$scope.showEditModel = function() {
			var checkVal = [];
			$("[name='tb-check']:checkbox").each(function() {
				if ($(this).is(':checked')) {
					checkVal.push($(this).attr("index"));
				}
			});
			if (checkVal.length != 1) {
				/*swal({
					title : "提示",
					text : "只能选择一条数据",
					type : "error"
				});*/
				toastr.error("只能选择一条数据", '提示');
				return;
			}
			$("#edit").modal('show');
			$scope.editData = $scope.data[parseInt(checkVal[0])];
			
			$scope.type = $scope.editData.type.toString();
			$scope.from = $scope.editData.from.toString();
		};
		/* 删除 */
		$scope.delBs = function(id) {
			swal({
				title : "提示",
				text : "确定要删除该记录吗？",
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
						url : '../../business/deleteAsset',
						type : 'post',
						dataType : "json",
						data : {
							deleteIds : id
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
							$scope.refresh();
						}
					});
				}
			});
		};
		/* 查询数据 */
		$scope.search = function(page) {
			var pageSize = $("#page-limit").val();
			var start = 1, limit = pageSize;
			/*var type = $("#type").val();
			var name = $("#name").val();
			var model = $("#model").val();
			var serialNumber = $("#serialNumber").val();
			var from = $("#from").val();
			var status = $("#status").val();
			var pageSize = $("#page-limit").val();*/
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			xh.maskShow();
			$http.get("../../support/selectAll?start=0&limit=" + limit).
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				xh.pagging(page, parseInt($scope.totals), $scope);
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
			$http.get("../../support/selectAll?start="+start+"&limit=" + limit).
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
/*保障申请*/

xh.add = function() {
	$.ajax({
		url : '../../support/insertSupport',
		type : 'POST',
		dataType : "json",
		async : false,
		data:{
			formData:xh.serializeJson($("#addForm").serializeArray()) //将表单序列化为JSON对象
		},
		success:function(data) {
			if (data.result ==1) {
				$('#add').modal('hide');
				xh.refresh();
				toastr.success(data.message, '提示');
			} else {
				toastr.error(data.message, '提示');
			}
			$("#add_btn").button('reset');
		},
		error:function() {
			$("#add_btn").button('reset');
		}
	});
};
/*管理方审核*/
xh.check1 = function() {
	$.ajax({
		url : '../../support/checkedOne',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm1").serializeArray(),
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

/*等待用户评价*/
xh.check17 = function() {
	$.ajax({
		url : '../../support/checkedSeventeen',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm17").serializeArray(),
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin17').modal('hide');
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

/*管理方向用户单位发送通信保障需求确认消息（该请求消息可包含上传附件的功能）*/
xh.check2 = function() {
	$.ajax({
		url : '../../support/checkedTwo',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm2").serializeArray(),
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin2').modal('hide');
				$("input[name='result']").val(1);
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

/*用户单位核准该消息*/
xh.check3 = function() {
	$.ajax({
		url : '../../support/checkedThree',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm3").serializeArray(),
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

/*管理方根据通信保障类型发送消息通知服务提供方(该请求消息可包含上传附件的功能) */
xh.check4 = function() {
	$.ajax({
		url : '../../support/checkedFour',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm4").serializeArray(),
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin4').modal('hide');
				$("input[name='result']").val(1);
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

/*服务提供方审核信息*/
xh.check5 = function() {
	$.ajax({
		url : '../../support/checkedFive',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm5").serializeArray(),
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin5').modal('hide');
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

/*服务提供方发送审核请求消息给管理方(该请求消息可包含上传附件的功能) */
xh.check6 = function() {
	$.ajax({
		url : '../../support/checkedSix',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm6").serializeArray(),
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin6').modal('hide');
				$("input[name='result']").val(1);
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

/*管理方对消息内容进行审核：
  	   不通过则返回服务提供方；
       通过则发送消息通知服务提供方，同时发送消息（该消息可包含上传附件的功能）通知用户单位 */
xh.check7 = function() {
	$.ajax({
		url : '../../support/checkedSeven',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm7").serializeArray(),
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin7').modal('hide');
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

/*管理方发送消息*/
xh.check8 = function() {
	$.ajax({
		url : '../../support/checkedEight',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm8").serializeArray(),
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin8').modal('hide');
				$("input[name='result']").val(1);
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

/*用户单位确认*/
xh.check9 = function() {
	$.ajax({
		url : '../../support/checkedNine',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm9").serializeArray(),
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin9').modal('hide');
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

/*服务提供方发送通信保障准备情况消息给管理方(该请求消息可包含上传附件的功能) */
xh.check10 = function() {
	$.ajax({
		url : '../../support/checkedTen',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm10").serializeArray(),
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin10').modal('hide');
				$("input[name='result']").val(1);
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

/*管理方接受消息*/
xh.check11 = function() {
	$.ajax({
		url : '../../support/checkedEleven',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm11").serializeArray(),
		success : function(data) {
			if (data.result ==1) {
				$('#checkWin11').modal('hide');
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

/*管理方发送通信保障准备情况消息给用户单位(该请求消息可包含上传附件的功能)*/
xh.check12 = function() {
	$.ajax({
		url : '../../support/checkedTwelve',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm12").serializeArray(),
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin12').modal('hide');
				$("input[name='result']").val(1);
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

/*用户单位确认*/
xh.check13 = function() {
	$.ajax({
		url : '../../support/checkedThirteen',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm13").serializeArray(),
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin13').modal('hide');
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

/*服务提供方发送通信保障完成消息给管理方(该请求消息可包含上传附件的功能)*/
xh.check14 = function() {
	$.ajax({
		url : '../../support/checkedFourteen',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm14").serializeArray(),
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin14').modal('hide');
				$("input[name='result']").val(1);
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

/*管理方确认*/
xh.check15 = function() {
	$.ajax({
		url : '../../support/checkedFifteen',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm15").serializeArray(),
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin15').modal('hide');
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

/*等待用户评价*/
xh.check16 = function() {
	$.ajax({
		url : '../../support/sureFile',
		type : 'POST',
		dataType : "json",
		async : true,
		data:$("#checkForm16").serializeArray(),
		success : function(data) {

			if (data.result ==1) {
				$('#checkWin16').modal('hide');
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

/* 上传文件 */
xh.upload = function(index) {
	if (index == 1) {
		path = 'filePath1';
		note = 'uploadResult1';
	}
	if (index == 2) {
		path = 'filePath2';
		note = 'uploadResult2';
	}
	if (index == 3) {
		path = 'filePath3';
		note = 'uploadResult3';
	}
	if (index == 4) {
		path = 'filePath4';
		note = 'uploadResult4';
	}
	if (index == 5) {
		path = 'filePath5';
		note = 'uploadResult5';
	}
	if (index == 6) {
		path = 'filePath6';
		note = 'uploadResult6';
	}
	if (index == 7) {
		path = 'filePath7';
		note = 'uploadResult7';
	}
	if ($("#" + path).val() == "") {
		toastr.error("你还没选择文件", '提示');
		return;
	}

	xh.maskShow();
	$.ajaxFileUpload({
		url : '../../support/upload', // 用于文件上传的服务器端请求地址
		secureuri : false, // 是否需要安全协议，一般设置为false
		fileElementId : path, // 文件上传域的ID
		dataType : 'json', // 返回值类型 一般设置为json
		type : 'POST',
		success : function(data, status) // 服务器成功响应处理函数
		{
			// var result=jQuery.parseJSON(data);
			console.log(data.filePath)
			xh.maskHide();
			if (data.success) {
				$("#"+note).html(data.message);
				$("input[name='result']").val(1);
				$("input[name='fileName']").val(data.fileName);
				$("input[name='path']").val(data.filePath);
			}	else {
				$("#"+note).html(data.message);
			}

		},
		error : function(data, status, e)// 服务器响应失败处理函数
		{
			alert(e);
		}
	});
};

xh.download = function() {
	var $scope = angular.element(appElement).scope();
	var filename = null;
	var checked = $scope.checkData.checked;
	//如果type为1 那么表示下载公函。
		if(checked == 3 && $scope.checkData.fileName1 != null && $scope.checkData.fileName1 != ''){
			filename = $scope.checkData.fileName1;
		}
		//如果type为2 那么表示下载通知函。
		else if(checked == 5 && $scope.checkData.fileName2!= null && $scope.checkData.fileName2!= ''){
			filename = $scope.checkData.fileName2;
		}
		//如果type为3 那么表示下载签署协议。
		else if(checked == 7 && $scope.checkData.fileName3 != null && $scope.checkData.fileName3 != ''){
			filename = $scope.checkData.fileName3;
		}
		//如果type为4 那么表示下载合同。
		else if(checked == 9 && $scope.checkData.fileName4 != null && $scope.checkData.fileName4 != ''){
			filename = $scope.checkData.fileName4;
		}
		//如果type为5 那么表示下载合同。
		else if(checked == 11 && $scope.checkData.fileName5 != null && $scope.checkData.fileName5 != ''){
			filename = $scope.checkData.fileName5;
		}
		//如果type为5 那么表示下载合同。
		else if(checked == 13 && $scope.checkData.fileName6 != null && $scope.checkData.fileName6 != ''){
			filename = $scope.checkData.fileName5;
		}
		//如果type为5 那么表示下载合同。
		else if(checked == 15 && $scope.checkData.fileName7 != null && $scope.checkData.fileName7 != ''){
			filename = $scope.checkData.fileName7;
		}
	var filepath = "/Resources/upload/communicationsupport/" + filename;
	var downUrl = "../../uploadFile/download?fileName=" + filename + "&filePath=" + filepath;
	if(xh.isfile(filepath)){
		window.open(downUrl, '_self','width=1,height=1,toolbar=no,menubar=no,location=no');
	}else{
		toastr.error("文件不存在", '提示');
	}
};

var WebPrinter; //声明为全局变量 
xh.CreatePrintPage=function() {

	javascript:PreviewMytable();
	
	/*try{ 
	    var LODOP=getLodop(document.getElementById('LODOP_OB'),document.getElementById('LODOP_EM')); 
		if ((LODOP!=null)&&(typeof(LODOP.VERSION)!="undefined")) alert("本机已成功安装过Lodop控件!\n  版本号:"+LODOP.VERSION); 
	 }catch(err){ 
		//alert("Error:本机未安装或需要升级!"); 
	 } */
	
    
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

/*$http({
method : "POST",
url : "../../bs/list",
data : {
	bsId : bsId,
	name : name,
	start : start,
	limit : pageSize
},
headers : {
	'Content-Type' : 'application/x-www-form-urlencoded'
},
transformRequest : function(obj) {
	var str = [];
	for ( var p in obj) {
		str.push(encodeURIComponent(p) + "="
				+ encodeURIComponent(obj[p]));
	}
	return str.join("&");
}
}).success(function(response) {
xh.maskHide();
$scope.data = response.items;
$scope.totals = response.totals;
});*/

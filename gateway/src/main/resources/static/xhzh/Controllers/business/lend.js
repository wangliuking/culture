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
		
		//获取登录用户
		$http.get("../../web/loginUserInfo").
		success(function(response){
			xh.maskHide();
			$scope.loginUser = response.user;
			$scope.loginUserRoleId = response.roleId;	
			/*if($scope.loginUserRoleId>=1000 && $scope.loginUserRoleId<10000){
				获取申请记录表
				$http.get("../../business/lend/list?start=0&limit=" + pageSize + "&user=" + $scope.loginUser).
				success(function(response){
					xh.maskHide();
					$scope.data = response.items;
					$scope.totals = response.totals;
					xh.pagging(1, parseInt($scope.totals), $scope);
				});
				
			}else{
				获取申请记录表
				$http.get("../../business/lend/list?start=0&limit=" + pageSize + "&user=all").
				success(function(response){
					xh.maskHide();
					$scope.data = response.items;
					$scope.totals = response.totals;
					xh.pagging(1, parseInt($scope.totals), $scope);
				});
			}*/
		});
		/*获取申请记录表*/
		$http.get("../../business/lend/list?start=0&limit=" + pageSize ).
		success(function(response){
			xh.maskHide();
			$scope.data = response.items;
			$scope.totals = response.totals;
			xh.pagging(1, parseInt($scope.totals), $scope);
		});
		/* 获取用户权限 */
		$http.get("../../web/loginUserPower").success(
				function(response) {
					$scope.up = response;
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
			$scope.checkData = $scope.progressData;
			$http.get("../../business/lend/lendInfoList?lendId="+$scope.progressData.id).
			success(function(response){
				xh.maskHide();
				$scope.dataLend = response.items;
				$scope.lendTotals = response.totals;
			});
			$("#progress").modal('show');
			$('#xh-tabs a:first').tab('show');
	    };
	    
	    $scope.checkedChange=function(issure){
	    	$scope.issure=issure==1?true:false;
	    	console.log($scope.issure);
	    };
	    /* 审核/归还/验收 */
		$scope.checkSuccess = function (id,status) {
			$scope.checkedSerialNumber = $scope.dataLend[id].serialNumber;
			/* 验收 */
			$.ajax({
				url : '../../business/lend/operation',
				type : 'POST',
				dataType : "json",
				async : true,
				data:{
					lendId:$scope.dataLend[id].lendId,
					checkId:$scope.checkedSerialNumber,
					status:status
				},
				success : function(data) {
					if (data.result) {
						//$("#checkWin3").modal('hide');
						xh.refresh();
						//$scope.checkWin($scope.ch)
						//设备清单列表
						$http.get("../../business/lend/lendInfoList?lendId="+$scope.checkData.id).
						success(function(response){
							xh.maskHide();
							$scope.dataLend = response.items;
							$scope.lendTotals = response.totals;
						});
						
						toastr.success(data.message, '提示');

					} else {
						toastr.error(data.message, '提示');
					}
				},
				error : function() {
				}
			});
			/*$.ajax({
				url : '../../business/lend/returnEquipment',
				type : 'POST',
				dataType : "json",
				async : true,
				data:{
					lendId:$scope.dataLend[id].lendId,
					checkId:$scope.checkedSerialNumber,
					status:0
				},
				success : function(data) {

					if (data.result ==1) {
						$('#progress').modal('hide');
						xh.refresh();
						toastr.success(data.message, '提示');

					} else {
						toastr.error(data.message, '提示');
					}
				},
				error : function() {
				}
			});*/
		}
		/*显示审核窗口*/
		$scope.checkWin = function (id,type) {
			if(id >= 0){
				$scope.checkData = $scope.data[id];
				$scope.ch=id;
			}
			if(id == -1){
				$http.get("../../web/user/getUserList?roleId=10002&user="+$scope.loginUser).
				success(function(response){
					$scope.userData = response.items;
					$scope.userTotals = response.totals;
					if($scope.userTotals>0){
						$scope.user=$scope.userData[0].user;
					}
				});
				$("#add").modal('show');
			}
			if(type == -2){
				$scope.checkData = $scope.data[id];
				$scope.ch=id;
				//设备清单列表
				$http.get("../../business/lend/lendInfoList?lendId="+$scope.checkData.id).
				success(function(response){
					xh.maskHide();
					$scope.dataLend = response.items;
					$scope.lendTotals = response.totals;
				});
				$scope.selectAll=false;  
			    $scope.all= function (m) {  
			        for(var i=0;i<$scope.dataLend.length;i++){  
			          if(m===true){  
			              $scope.dataItem[i].state=true;  
			          }else {  
			              $scope.dataItem[i].state=false;  
			          }  
			        }  
			    };  
				$("#checkWin3").modal('show');
			}
			if(type==3){
				swal({
					title : "提示",
					text : "确认清单无误吗？",
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
						xh.check4();
					}
				});
			}
			
			//领导审核并指定经办人
			else if($scope.loginUserRoleId==10002 && $scope.checkData.checked==0){
				$http.get("../../web/user/getUserList?roleId=10002&user="+$scope.loginUser).
				success(function(response){
					$scope.userData = response.items;
					$scope.userTotals = response.totals;
					if($scope.userTotals>0){
						$scope.user=$scope.userData[0].user;
					}
				});
				$("#checkWin2").modal('show');
			}
			//领导审核经办人办理的租借清单
			else if($scope.loginUser==$scope.checkData.user1 && $scope.checkData.checked==2){
				$("#checkWin5").modal('show');
			}
			else if(($scope.checkData.checked==1 || $scope.checkData.checked==-10) && $scope.checkData.user2 == $scope.loginUser){
				$http.get("../../web/user/getUserList?roleId=10002&user="+$scope.loginUser).
				success(function(response){
					$scope.userData = response.items;
					$scope.userTotals = response.totals;
					if($scope.userTotals>0){
						$scope.user=$scope.userData[0].user;
					}
				});
				 xh.check1($scope.checkData.id);
				//$("#checkWin1").modal('show');
			}
			//if($scope.loginUserRoleId==10002 && $scope.loginUser==$scope.checkData.user1 && $scope.checkData.checked==2){
			else if($scope.loginUser==$scope.checkData.user || $scope.loginUser==$scope.checkData.user2 && $scope.checkData.checked==1){
				//设备清单列表
				$http.get("../../business/lend/lendInfoList?lendId="+$scope.checkData.id).
				success(function(response){
					xh.maskHide();
					$scope.dataLend = response.items;
					$scope.lendTotals = response.totals;
				});
				$scope.selectAll=false;  
			    $scope.all= function (m) {  
			        for(var i=0;i<$scope.dataLend.length;i++){  
			          if(m===true){  
			              $scope.dataItem[i].state=true;  
			          }else {  
			              $scope.dataItem[i].state=false;  
			          }  
			        }  
			    }; 
			   
				$("#checkWin3").modal('show');
			}
			

			
	    };
	    /* 用户确认编组方案 
	    $scope.sureFile = function(id) {
	    	$.ajax({
	    		url : '../../net/sureFile',
	    		type : 'POST',
	    		dataType : "json",
	    		async : false,
	    		data:{id:id},
	    		success : function(data) {
	    			if (data.result === 1) {
	    				toastr.success(data.message, '提示');
	    				xh.refresh();

	    			} else {
	    				toastr.error(data.message, '提示');
	    			}
	    		},
	    		error : function(){
	    		}
	    	});
	    };*/
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
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;

			} else {
				start = (page - 1) * pageSize;
			}
			xh.maskShow();
			/*if($scope.loginUserRoleId>=1000 && $scope.loginUserRoleId<10000){
				获取申请记录表
				$http.get("../../business/lend/list?start=0&limit=" + pageSize + "&user=" + $scope.loginUser).
				success(function(response){
					xh.maskHide();
					$scope.data = response.items;
					$scope.totals = response.totals;
					xh.pagging(1, parseInt($scope.totals), $scope);
				});
				
			}else{
				获取申请记录表
				$http.get("../../business/lend/list?start=0&limit=" + pageSize + "&user=all").
				success(function(response){
					xh.maskHide();
					$scope.data = response.items;
					$scope.totals = response.totals;
					xh.pagging(1, parseInt($scope.totals), $scope);
				});
			}*/
			$http.get("../../business/lend/list?start="+start+"&limit=" + pageSize).
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
			$http.get("../../business/lend/list?start="+start+"&limit=" + pageSize).
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
//刷新数据
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();
};
xh.checkedChange=function(){
	var $scope = angular.element(appElement).scope();
    $scope.checkedChange($("#checkForm1").find("select[name='checked']").val());
};
/*申请租借设备*/
xh.add = function() {
	$.ajax({
		url : '../../business/lend/add',
		type : 'POST',
		dataType : "json",
		async : true,
		data:{
			formData:xh.serializeJson($("#addForm").serializeArray()) //将表单序列化为JSON对象
		},
		success : function(data) {
			$("#add_btn").button('reset');
			if (data.result ==1) {
				$('#add').modal('hide');
				xh.refresh();
				toastr.success(data.message, '提示');

			} else {
				toastr.error(data.message, '提示');
			}
		},
		error : function() {
			$("#add_btn").button('reset');
		}
	});
};
/*指定经办人*/
xh.check2 = function() {
	$.ajax({
		url : '../../business/lend/checkedOne',
		type : 'POST',
		dataType : "json",
		async : true,
		data:{
			formData:xh.serializeJson($("#checkForm2").serializeArray()) //将表单序列化为JSON对象
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

xh.check1 = function(id) {
	var $scope = angular.element(appElement).scope();
	window.location.href="lend-deal.html?data_id="+id+"&leaderUser="+$scope.checkData.user1;
};


/*管理部门领导审核租借清单*/
xh.check6 = function() {
	var $scope = angular.element(appElement).scope();
	var checked=$("#checkForm5").find('select[name="checked3"]').val();
	$.ajax({
		url : '../../business/lend/checkedOrder',
		type : 'POST',
		dataType : "json",
		async : true,
		data:{
			lendId:$scope.checkData.id,
			user:$scope.checkData.user,
			user2:$scope.checkData.user2,
			checked:checked,
			note2:$("#checkForm5").find("textarea[name='note2']").val()
		},
		success : function(data) {

			if (data.result >=1) {
				$('#checkWin5').modal('hide');
				xh.refresh();
				toastr.success(data.message, '提示');

			} else {
				xh.refresh();
				toastr.error(data.message, '提示');
			}
		},
		error : function() {
		}
	});
};
/*用户确认租借清单*/
xh.check4 = function() {
	var $scope = angular.element(appElement).scope();
	$.ajax({
		url : '../../business/lend/sureOrder',
		type : 'POST',
		dataType : "json",
		async : true,
		data:{
			lendId:$scope.checkData.id,
			user1:$scope.checkData.user1,
			user2:$scope.checkData.user2
		},
		success : function(data) {

			if (data.result ==1) {
				xh.refresh();
				toastr.success(data.message, '提示');

			} else {
				xh.refresh();
				toastr.error(data.message, '提示');
			}
		},
		error : function() {
		}
	});
};
/*用户归还设备*/
xh.check5 = function(checkIds,status) {
	var $scope = angular.element(appElement).scope();
	$.ajax({
		url : '../../business/lend/operation',
		type : 'POST',
		dataType : "json",
		async : true,
		data:{
			lendId:$scope.checkData.id,
			checkId:checkIds,
			//manager:$scope.checkData.user1,
			status:status
		},
		success : function(data) {
			if (data.result) {
				$('#checkWin3').modal('hide');
				xh.refresh();
				toastr.success(data.message, '提示');
			} else {
				xh.refresh();
				toastr.error(data.message, '提示');
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
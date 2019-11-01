/**

 * 资产管理
 */
if (!("xh" in window)) {
	window.xh = {};
};
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

	app.controller("xhcontroller", function($scope, $http) {
		$scope.businessMenu=true; //菜单变色
		
		$scope.data=[];
		$scope.totals=0;
		
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
			$("#table-checkbox").prop("checked", false);
		};
		//添加一个用户
		$scope.addOneUser=function(){
			var userId=$("#userId").val();
			var record={userId:'',status:"等待发送"};
			
			if(userId==""){
				toastr.error("用户ID不能为空", '提示');
				return;
			}
			i
			record.userId=userId;
			var flag=0;
			for(var i=0;i<$scope.data.length;i++){
				if($scope.data[0].userId==userId){
					flag=1;
				}
			}
			if(flag==0){
				$scope.data.push(record);
			}
			
			$scope.totals=$scope.data.length;
		};
		/* 添加多用户 */
		$scope.addMore = function() {
			var user1=parseInt($("#user1").val());
			var user2=parseInt($("#user2").val());
			if(user2-user1<0){
				toastr.error("用户ID区间不正确", '提示');
				return;
			}
			for(var i=0;i<=user2-user1;i++){
				var record={userId:'',status:"等待发送"};
				record.userId=user1+i;	
				var flag=0;
				for(var j=0;j<$scope.data.length;j++){
					if($scope.data[j].userId==record.userId){
						flag=1;
					}
				}
				if(flag==0){
					$scope.data.push(record);
					
				}
				
			}
			$scope.totals=$scope.data.length;
			
			
		};
		
		/* 删除用户 */
		$scope.delBs = function(id) {
			$scope.data.splice(id,1);
			$scope.totals=$scope.data.length;
			
		};
		/* 清空用户 */
		$scope.clear = function() {
			$scope.data.splice(0,$scope.data.length);
			$scope.totals=$scope.data.length;	
		};
		
		var i=0;  var flag=0;var successTag=false;
		$scope.startBtn=false;
		$scope.task=function(i,tag){
			if($scope.start(i,tag)){
				//$scope.data[i].status="数据发送成功";	
				flag=0;
				
			}else{
				//$scope.data[i].status="失败！";
				flag=0;
			}
			
		}
		//设置
		$scope.start=function(i,tag){
			var data=[];
			if($scope.data.length<1){
				toastr.error("还没有操作数据", '提示');
				$('button').prop('disabled', true);
				return;
			}
			var url='../../ucm/radioOpen';
			if(tag==1){
				url='../../ucm/radioOpen';
			}else{
				url='../../ucm/kill';
			}
			data.push($scope.data[i].userId);
			$http({
				method:'post',
				url : url,
				headers:{'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: function (data) {
				    　　return $.param(data);
				},
				data:{
					data:data.join(",")
				}	
			}).success(function(data){ 
				if (data.success) {
					successTag=true;
					$scope.data[i].status=data.message;
				} else {
					successTag=false;
					$scope.data[i].status=data.message;
				}
			}).error(function(e){
				successTag=false;
				$scope.data[i].status="服务器响应超时";
			})
			return successTag;
		};
		$scope.run=function(tag){
			swal({
				title : "提示",
				text : "确定要做该操作吗？",
				type : "info",
				showCancelButton : true,
				confirmButtonColor : "#DD6B55",
				confirmButtonText : "确定",
				cancelButtonText : "取消"
			}, function(isConfirm) {
			if (isConfirm) {
			for(var j=0;j<$scope.totals;j++){
				$scope.data[j].status="等待执行";
			}
			$scope.startBtn=true;
			$('button').prop('disabled', true);
			
			$scope.data[i].status="处理中，请稍等!";
			var timeout=setInterval(function(){
				if(flag==0){
					flag=1;
					if(i<$scope.totals){					
						$scope.task(i,tag);
						i++;
					}else{
						clearInterval(timeout);
						$scope.startBtn=false;
						$('button').prop('disabled', false);
						toastr.success("数据发送完成", '提示');
						
						i=0;flag=0;successTag=false;
						
					}
				}
			},1000);
			}})
		}
		
		
	});
};
/* 添加设备 */
xh.add = function() {
	$.ajax({
		url : '../../business/insertAsset',
		type : 'POST',
		dataType : "json",
		async : true,
		data:{
			formData:xh.serializeJson($("#addForm").serializeArray()) //将表单序列化为JSON对象
		},
		success : function(data) {

			if (data.result ==1) {
				$('#addForm')[0].reset();
				$('#add').modal('hide');
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
/* 修改 */
xh.update = function() {
	$.ajax({
		url : '../../business/updateAsset',
		type : 'POST',
		dataType : "json",
		async : false,
		data:{
			formData:xh.serializeJson($("#updateForm").serializeArray()) //将表单序列化为JSON对象
		},
		success : function(data) {
			if (data.result === 1) {
				$('#updateForm')[0].reset();
				$('#edit').modal('hide');
				toastr.success(data.message, '提示');
				xh.refresh();
				

			} else {
				toastr.error(data.message, '提示');
			}
		},
		error : function(){
		}
	});
};
/* 批量删除基站 */
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
		url : '../../business/deleteAsset',
		type : 'post',
		dataType : "json",
		data : {
			deleteIds : checkVal.join(",")
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

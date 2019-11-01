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
		/*添加单个用户*/
		$scope.addone=function(){
			var groupId=$("#groupId").val();
			var userId=$("#userId").val();
			var store={
					groupId:'',
					userId:'',
					status:0					
			};
			var record=[];
			store.userId=userId;
			store.groupId=groupId;
			record.push(store);
			$dgnaData=record;
			
		};
		//添加一个用户
		$scope.addOneUser=function(){
			var userId=$("#userId").val();
			var groupId=$("#groupId").val();
			var record={userId:'',groupId:'',status:"等待发送"};
			
			if(userId==""){
				toastr.error("用户ID不能为空", '提示');
				return;
			}
			if(groupId==""){
				toastr.error("组ID不能为空", '提示');
				return;
			}
			
			record.userId=userId;
			record.groupId=groupId;
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
			var groupId=$("#groupId").val();
			
			
			if(groupId==""){
				toastr.error("组ID不能为空", '提示');
				return;
			}
			if(user2-user1<0){
				toastr.error("用户ID区间不正确", '提示');
				return;
			}
			for(var i=0;i<=user2-user1;i++){
				var record={userId:'',groupId:groupId,status:"等待发送"};
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
		$scope.refreshData=function(id,str){
			$scope.data[id].status=str;
		}
		/* 清空用户 */
		$scope.clear = function() {
			$scope.data.splice(0,$scope.data.length);
			$scope.totals=$scope.data.length;	
		};
			
		var i=0;  var flag=0;var successTag=false;
		$scope.startBtn=false;
		$scope.task=function(i){
			if($scope.start(i)){
				//$scope.data[i].status="数据发送成功";	
				flag=0;
				
			}else{
				//$scope.data[i].status="失败！";
				flag=0;
			}
			
		}
		//设置
		$scope.start=function(i){
			var opreation=$("input[name='operation']:checked").val();
			var cou=$("input[name='cou']:checked").val();
			var attached=$("input[name='attached']:checked").val();
			var groupId=$("#groupId").val();
			var data=[];
			data.push($scope.data[i].userId);
			if($scope.data.length<1){
				toastr.error("还没有操作数据", '提示');
				$('button').prop('disabled', false);
				return;
			}
			
			$http({
				method:'post',
				url : '../../ucm/dgna',
				headers:{'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: function (data) {
				    　　return $.param(data);
				},
				data:{
					operation:opreation,
					groupId:$scope.data[i].groupId,
					cou:cou,
					attached:attached,
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
		$scope.run=function(){
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
						$scope.task(i);
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

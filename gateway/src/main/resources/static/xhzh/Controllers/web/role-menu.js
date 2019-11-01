/**
 * 用户管理
 */
if (!("xh" in window)) {
	window.xh = {};
};
var frist = 0;
var appElement = document.querySelector('[ng-controller=power]');
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
var zTree;
/*var setting = {
		view : {
			dblClickExpand : false,
			showLine : true,
			selectedMulti : false
		},
		data : {
			simpleData : {
				enable : true,
				idKey : "id",
				pIdKey : "pId"
								 * rootPId : ""
								 
			}
		},
		callback : {
			beforeClick : function(treeId, treeNode) {
				var zTree = $.fn.zTree.getZTreeObj("tree");
				if (treeNode.isParent) {
					zTree.expandNode(treeNode);
					return false;
				} else {
					// demoIframe.attr("src", treeNode.file + ".html");
					return true;
				}
			}
			onClick : TreeOnClick
		}
	};*/

xh.load = function() {
	var app = angular.module("app", []);
	app.config([ '$locationProvider', function($locationProvider) {
		$locationProvider.html5Mode({
			enabled : true,
			requireBase : false
		});
	} ]);
	app.controller("power", function($scope, $http, $location) {
		$scope.userId = $location.search().roleId;
		
		
		var zTreeObj;
		// zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
		var setting = {};
		// zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
		var zNodes = [
		{name:"test1", open:true, children:[
		   {name:"test1_1"}, {name:"test1_2"}]},
		{name:"test2", open:true, children:[
		   {name:"test2_1"}, {name:"test2_2"}]}
		];
		 zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
		
		
		/* 获取用户权限 
		$http.get("../../web/user/getuserpower?userId="+$scope.userId).success(function(response) {
			$scope.data = response.items;
		});*/
		/* 获取用户菜单权限 */
		/*$http.get("../../web/menu").success(function(response) {
			var zNodes = response.items;
			console.log(zNodes);
			var t = $("#tree");
			t = $.fn.zTree.init(t, setting, zNodes);
		});*/
	
		
		

	});
};
/*$("#selectAll").bind("click", function() {
	$("#form").find("[type='checkbox']").prop("checked", true);// 全选
});
$("#selectNo").bind("click", function() {
	$("#form").find("[type='checkbox']").prop("checked", false);// 反选
});
$("#selectOther").bind("click", function() {
	var checkbox=$("#form").find("[type='checkbox']");
	
	for(var i=0;i<checkbox.length;i++){
		if(checkbox[i].checked==true){
			checkbox[i].checked=false;
		}else{
			checkbox[i].checked=true;
		}
	}
});
//刷新数据
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();

};
*/
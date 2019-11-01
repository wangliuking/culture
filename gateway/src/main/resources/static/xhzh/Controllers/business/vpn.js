if (!("xh" in window)) {
	window.xh = {};
};
/*
 * test
 */
$(function() {

});
var frist = 0;
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
var app = angular.module("app", []);
xh.load = function() {
	var dataForTree;
	app.controller("vpn", function($scope, $http) {
		$scope.count = "20";// 每页数据显示默认值
		$scope.systemMenu = true; // 菜单变色
		/* 获取用户权限 */
		$http.get("../../web/loginUserPower").success(
				function(response) {
					$scope.up = response;
		});
		
		$http.get("../../vpn/list").success(function(response) {
			dataForTree = response.items;
			console.log(response.items);
			start(dataForTree);
		});
		
		/* 显示model */
		$scope.showAddModel = function(id) {
			$http.get("../../vpn/list").success(function(response) {
				$scope.ParentVpnId = response.ParentVpnId;
				console.log(response.ParentVpnId);
			});
			$('#add').modal('show');
		};

		xh.select = function(vpnId) {
			var C_ID = $("#C_ID").val();
			var E_name = $("#E_name").val();
			var pageSize = $("#page-limit").val();
			xh.maskShow();
			$http.get(
					"../../radiouser/vpnid?C_ID=" + C_ID + "&E_name=" + E_name
							+ "&vpnId=" + vpnId + "&start=0&limit=" + pageSize)
					.success(function(response) {
						xh.maskHide();
						$scope.data = response.items;
						$scope.totals = response.totals;
						xh.pagging(1, parseInt($scope.totals), $scope);
					});
			/* 刷新数据 */
			$scope.refresh = function() {
				$("#C_ID").val("");
				$("#E_name").val("");
				$scope.search(1);
			};

			/* 查询数据 */
			$scope.search = function(page) {
				var pageSize = $("#page-limit").val();
				var C_ID = $("#C_ID").val();
				var E_name = $("#E_name").val();
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
				$http.get(
						"../../radiouser/vpnid?C_ID=" + C_ID + "&E_name="
								+ E_name + "&vpnId=" + vpnId + "&start="
								+ start + "&limit=" + limit).success(
						function(response) {
							xh.maskHide();
							$scope.data = response.items;
							$scope.totals = response.totals;
							xh.pagging(page, parseInt($scope.totals), $scope);
						});
			};
			// 分页点击
			$scope.pageClick = function(page, totals, totalPages) {
				var pageSize = $("#page-limit").val();
				var C_ID = $("#C_ID").val();
				var E_name = $("#E_name").val();
				var start = 1, limit = pageSize;
				page = parseInt(page);
				if (page <= 1) {
					start = 0;
				} else {
					start = (page - 1) * pageSize;
				}
				xh.maskShow();
				$http.get(
						"../../radiouser/vpnid?C_ID=" + C_ID + "&E_name="
								+ E_name + "&vpnId=" + vpnId + "&start="
								+ start + "&limit=" + pageSize).success(
						function(response) {
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

		};

	});

};

var start = function(dataForTree) {
	// zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
	var setting = {
		view : {

		},
		edit : {
			enable : true
		// 单独设置为true时，可加载修改、删除图标
		},
		data : {
			simpleData : {
				enable : true
			}
		},
		callback : {
			onClick : zTreeOnClick,// 单击事件
			beforeDrag: beforeDrag,
			beforeRemove: beforeRemove,
			beforeRename: beforeRename,
			onRemove: onRemove,
			onRename: onRename
		}
	};
	// zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
	/*var zNodes = [ {
		name : "组织名称",
		open : true,
		"checked" : "true",
		children : dataForTree
	} ];*/
	var zNodes = [];
	for(var i=0;i<dataForTree.length;i++){
		var tempMap = {"id":dataForTree[i].vpnId,"pId":dataForTree[i].pId,"name":dataForTree[i].name};
		zNodes.push(tempMap);
	}

	var log,className = "dark";
	function beforeDrag(treeId, treeNodes) {
		return false;
	}
	function beforeRemove(treeId, treeNode) {
		className = (className === "dark" ? "" : "dark");
		showLog("[ " + getTime() + " beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; "
				+ treeNode.name);
		var zTree = $.fn.zTree.getZTreeObj("treeDemo");
		zTree.selectNode(treeNode);
		return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
	}
	function onRemove(e, treeId, treeNode) {
		showLog("[ " + getTime() + " onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; "
				+ treeNode.name);
		$.ajax({
            type: "POST",
            url: "../../vpn/deleteByVpnId?vpnId="+treeNode.id,
            data: {},
            dataType: "json",
            success: function(data){
                       
                     }
        });
	}
	var tempnewName;
	function beforeRename(treeId, treeNode, newName) {
		console.log(treeNode+"==="+treeNode.name+"==="+treeNode.id);
		tempnewName=newName;
		className = (className === "dark" ? "" : "dark");
		showLog("[ " + getTime() + " beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; "
				+ treeNode.name);
		if (newName.length == 0) {
			alert("节点名称不能为空.");
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			setTimeout(function() {
				zTree.editName(treeNode);
			}, 10);
			return false;
		}
		return true;
	}
	function onRename(e, treeId, treeNode) {
		showLog("[ " + getTime() + " onRename ]&nbsp;&nbsp;&nbsp;&nbsp; "
				+ treeNode.name);
		$.ajax({
            type: "POST",
            url: "../../vpn/updateByVpnId?vpnId="+treeNode.id+"&name="+tempnewName,
            data: {},
            dataType: "json",
            success: function(data){
                       
                     }
        });
	}
	function showLog(str) {
		if (!log)
			log = $("#log");
		log.append("<li class='" + className + "'>" + str + "</li>");
		if (log.children("li").length > 8) {
			log.get(0).removeChild(log.children("li")[0]);
		}
	}
	function getTime() {
		var now = new Date(), h = now.getHours(), m = now.getMinutes(), s = now
				.getSeconds(), ms = now.getMilliseconds();
		return (h + ":" + m + ":" + s + " " + ms);
	}

	$(document).ready(function() {
		// 页面加载成功后,开始加载树形结构
		$.fn.zTree.init($("#treeDemo"), setting, zNodes);
	});
	// 为每个节点添加点击事件
	function zTreeOnClick(event, treeId, treeNode) {
		xh.select(treeNode.id);
	}
	;
};

function removeHoverDom(treeId, treeNode) {
	$("#addBtn_" + treeNode.tId).unbind().remove();
};

// 刷新数据
xh.refresh = function() {
	var appElement = document.querySelector('[ng-controller=vpn]');
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

xh.add = function() {
	$.ajax({
		url : '../../vpn/add',
		type : 'POST',
		dataType : "json",
		async : false,
		data : $("#addForm").serializeArray(),
		success : function(data) {
			if (data.items != 0) {
				$('#add').modal('hide');
				xh.load();
				toastr.success("添加成功", '提示');			
			} else {
				toastr.error("添加失败,已存在相同vpnId", '提示');
			}
		},
		error : function() {
		}
	});
};
/*
 * $http({ method : "POST", url : "../../bs/list", data : { bsId : bsId, name :
 * name, start : start, limit : pageSize }, headers : { 'Content-Type' :
 * 'application/x-www-form-urlencoded' }, transformRequest : function(obj) { var
 * str = []; for ( var p in obj) { str.push(encodeURIComponent(p) + "=" +
 * encodeURIComponent(obj[p])); } return str.join("&"); }
 * }).success(function(response) { xh.maskHide(); $scope.data = response.items;
 * $scope.totals = response.totals; });
 */

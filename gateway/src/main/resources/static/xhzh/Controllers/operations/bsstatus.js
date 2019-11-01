/**
 * 终端状态
 */
if (!("xh" in window)) {
	window.xh = {};
};
var background = "#fff";
var frist = 0;
var appElement = document.querySelector('[ng-controller=bsstatus]');
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
	/*
	 * app.filter('upp', function() { //可以注入依赖 return function(text) { return
	 * text+"$$"; }; });
	 */

	app.controller("bsstatus", function($scope, $http) {
		xh.maskShow();
		$scope.count = "10";// 每页数据显示默认值
		$scope.bs_count = "20";// 每页数据显示默认值
		$scope.showFlag = 1;
		$scope.btnText = "按基站ID显示";
		$scope.nowDate = xh.getOneDay();
		$scope.zone="全部";
		$scope.sort_type="desc";
		$scope.sort_field="";
		
		

		$scope.byBsIdBtn = function() {
			if ($scope.showFlag == 1) {
				$scope.showFlag = 0;
				$scope.btnText = "按区域显示";
			} else {
				$scope.showFlag = 1;
				$scope.btnText = "按基站ID显示";
			}
		}
		$scope.bs_business= function(){
			var start=0;
			frist=0;
			var bsIds=[];
			
			$("#select_bs").find("li").each(function(){
				bsIds.push($(this).attr("value"))
			})
			
			var pageSize = $("#page-limit-bs").val();
			var limit = pageSize ;
			var zone = $("select[name='zone']").val() == null ? "全部" : $("select[name='zone']").val();
			$http.get("../../bs/bs_business_info?zone=" + zone + "&bsId="+bsIds.join(",")+
					"&sort_type="+$scope.sort_type+"&sort_field="+$scope.sort_field+"&start=0&limit="+limit).success(
			function(response) {
				$scope.bs_business_info = response.items;
				$scope.bs_business_info_count = response.totals;
				xh.bsPagging(1, parseInt($scope.bs_business_info_count), $scope);
			});
			
		}
	
		

		$http.get("../../bs/map/area").success(function(response) {
			$scope.zoneData = response.items;
		});
		$(".search_bs_div").on('click','li',function(){
			var bsId=$(this).attr("value");
			var bsName=$(this).attr("li-name");
			
			$("#select_bs").append("<li  value='"+bsId+"' select-name='"+bsName+"'>"+"["+bsId+"]"+bsName+"</li>")
			 $(this).remove();
		});
		$("#select_bs").on('click','li',function(){
			var bsId=$(this).attr("value");
			var bsName=$(this).attr("select-name");
			$(".search_bs_div").append("<li id='search-"+bsId+"' value='"+bsId+"' li-name='"+bsName+"'>"+"["+bsId+"]"+bsName+"</li>");
			 $(this).remove();
		});
		/*$("table").find("thead").on('click','tr',function(){
			console.log(2)
			alert(12);
		})
		*/
		$scope.sort=function(type,field){
			
		}
		//获取组信息
		$scope.talkGroup=function(){
			xh.maskShow();
			var talkgroupid=$("#talkgroupid").val();
			var eName=$("#eName").val();
			$http.get(
					"../../talkgroup/list?talkgroupid=" + talkgroupid + "&eName=" + eName
							+ "&start=0&limit=10").success(
					function(response) {
						xh.maskHide();
						$scope.talkGroupData = response.items;
					});
		}
		
		$scope.showGroupViewer=function(){
			$scope.talkGroup();
		}
		$scope.showUserViewer=function(){
			//$scope.userstatus();
		}
		$scope.userstatus=function(){
			var userId=$("#userId").val();
			$http.get("../../operations/data/userstatus?userId="+userId+"&regStatus=-1" +
					"&start=0&limit=20").
			success(function(response){
				$scope.userstatus_data = response.items;
				$scope.userstatus_totals = response.totals;
			});
		}
		$scope.search_more_bs=function(){
			var name=$("input[name='name']").val();
			$http.get("../../bs/search_more_bs?zone="+$scope.zone+"&name="+name).success(function(response) {
				$scope.search_more_bs_data = response.items;
				$(".search_bs_div").find("li").remove();
				if($scope.search_more_bs_data.length>0){
					$(".search_bs_div").addClass('show');
				}else{
					$(".search_bs_div").removeClass('show');
				}
				
				
				for(var i=0,j=$scope.search_more_bs_data.length;i<j;i++){
					var bsId=$scope.search_more_bs_data[i].bsId;
					var bsName=$scope.search_more_bs_data[i].name;
					
					$(".search_bs_div").append("<li id='search-"+bsId+"' value='"+bsId+"' li-name='"+bsName+"'>"+"["+bsId+"]"+bsName+"</li>");
				}
				
				
				
			});
		}
		$scope.search_bs_by_regGroup=function(groupId){
			$http.get("../../bsstatus/search_bs_by_regGroup?groupId="+groupId).success(function(response) {
				$scope.search_bs_by_regGroup_data = response.items;
				$scope.search_bs_by_regGroup_totals = response.totals;
			});
		}
		$scope.search_regUser_by_regGroup=function(groupId){
			$http.get("../../bsstatus/search_regUser_by_regGroup?groupId="+groupId).success(function(response) {
				$scope.search_regUser_by_regGroup_data = response.items;
				$scope.search_regUser_by_regGroup_totals = response.totals;
			});
		}
		$scope.regGroup_tr_click = function(groupId,name) {
			$scope.panel_name=name;
			$scope.panel_id=groupId
			$scope.search_bs_by_regGroup(groupId);
			$scope.search_regUser_by_regGroup(groupId);
			
		};
		/* 获取信息 */
		
		$scope.allBsInfo=function(){
			var type = $("select[name='type']").val();
			var zone = $scope.zone == null ? "全部" : $scope.zone;
			var link = $("select[name='link']").val();
			var status = $("select[name='status']").val();
			var usergroup = $("input[name='usergroup']").val();
			var bsId = $("input[name='bsId']").val();
			$http.get("../../bs/allBsInfo?type=" + type + "&zone=" + zone + "&link="
					+ link + "&status=" + status + "&usergroup="
					+ usergroup + "&bsId=" + bsId).success(
			function(response) {
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = $scope.data.length;
				$scope.bs_search_data = response.items;
				$scope.bs_search_totals = $scope.data.length;
				var data = [];

				for (var i = 0; i < $scope.totals; i++) {
					var dd = $scope.data[i].item;

					for (var j = 0; j < dd.length; j++) {
						data.push(dd[j]);
					}
				}
				data.sort(xh.compare);
				$scope.byBsIdData = data;
				$scope.bsBsIdTotals = data.length;

			});
		}

		
		// 基站下的注册终端
		$scope.radioUser = function(bsIdstr,groupId) {
			frist = 0;
			$scope.bsId=bsIdstr;
			var pageSize = $("#page-limit-user").val();
			$http.get(
					"../../radio/status/oneBsRadio?bsId=" + bsIdstr
							+ "&groupId="+groupId+"&start=0&limit=" + pageSize).success(
					function(response) {
						$scope.radioData = response.items;
						$scope.radioTotals = response.totals;
						xh.userPagging(1, parseInt($scope.radioTotals), $scope);
					});
		};
		$scope.refresh_user = function() {
			$scope.radioUser($scope.bsId)
		};
		
		// 基站下的注册组
		$scope.bsGroup = function(bsIdstr) {
			$scope.bsId=bsIdstr;
			frist = 0;
			var pageSize = $("#page-limit-group").val();
			$http.get(
					"../../radio/status/oneBsGroup?bsId=" + bsIdstr
							+ "&start=0&limit=" + pageSize).success(
					function(response) {
						$scope.groupData = response.items;
						$scope.groupTotals = response.totals;
						xh.groupPagging(1, parseInt($scope.groupTotals),$scope);
					});
		};
		$scope.refresh_group = function() {
			$scope.bsGroup ($scope.bsId)
		};
		//基站列表行点击
		$scope.bs_tr_click = function(bsIdstr,name) {
			$scope.panel_group_name="";
			$scope.panel_name=name;
			$scope.panel_bsId=bsIdstr;
			$scope.radioUser(bsIdstr,0);
			$scope.bsGroup(bsIdstr);
			
		};
		//组列表行点击
		$scope.group_tr_click = function(groupId,name) {
			$scope.panel_group_name=name;
			$scope.radioUser($scope.panel_bsId,groupId);
			
		};
		/*$scope.sortBsId = function(a, b) {
			return a.bsId - b.bsId
		}*/

		$scope.bsView = function(bsId, bsName, period) {

			window.location.href = "bsstatus-view.html?bsId=" + bsId
					+ "&period=" + period + "&bsName=" + bsName;
		};
	/*	$scope.bsHover = function(link, status, bsId, name, groupSum, userSum) {
			// $("#aside-right-bottom").fadeToggle("fast");

			if (status == 1 && link == 0) {
				$(".bs-name").html(bsId + "-" + name);
				$(".bs-group").html(groupSum);
				$(".bs-user").html(userSum);
			} else {
				$(".bs-name").html(bsId + "-" + name);
				$(".bs-group").html("--");
				$(".bs-user").html("--");
			}
		}*/
	/*	$scope.showGroupUser = function(index) {
			var dd = $scope.data[index];

			var html = {
				type : 2,
				title : dd.bsId + "-" + dd.name + ":注册组/注册终端",
				area : [ '500px', '400px' ],
				shade : 0,
				maxmin : true,

				 skin: 'layui-layer-rim', //加上边框 
				content : [
						"../../Views/operations/bsstatus-group-user-box.html?bsId="
								+ dd.bsId, 'no' ]
			};
			layer.open(html);
		}*/

		/*$scope.showBsModal = function() {
			$("#aside-right").fadeToggle("fast");
		}*/

	/*	$scope.bssearch = function() {
			var checkbox = $("#aside-right").find("[type='checkbox']");
			var bsIds = [];
			for (var i = 0; i < checkbox.length; i++) {
				if (checkbox[i].checked == true) {
					bsIds.push(checkbox[i].value)
				}
			}
			if (bsIds.length > 0) {
				console.log("bsIds===>" + bsIds.join(","));
				$scope.bsIds = bsIds.join(",");
				$scope.search(1);
			} else {
				$scope.bsIds = "";
				$scope.search(1);
			}

		}*/

		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.bs_business();
			$("#bs_search").modal('hide');
			/*$(".search_bs_div").find("li").remove();
			$("#select_bs").find("li").remove();*/
		};
		/* 查询数据 
		$scope.search = function(page) {
			var type = $("select[name='type']").val();
			var zone = $("select[name='zone']").val();
			var zone = $scope.zone == null ? $("select[name='zone']").val()
					: $scope.zone;
			var link = $("select[name='link']").val();
			var status = $("select[name='status']").val();
			var pageSize = $("#page-limit").val();
			var usergroup = $("input[name='usergroup']").val();
			var bsId = $("input[name='bsId']").val();
			var start = 1, limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;

			} else {
				start = (page - 1) * pageSize;
			}
			 xh.maskShow(); 
			$http.get(
					"../../bs/allBsInfo?type=" + type + "&zone=" + zone
							+ "&link=" + link + "&status=" + status
							+ "&usergroup=" + usergroup + "&bsId=" + bsId)
					.success(function(response) {
						 xh.maskHide(); 
						$scope.data = response.items;
						$scope.totals = response.totals;
						var data = [];

						for (var i = 0; i < $scope.totals; i++) {
							var dd = $scope.data[i].item;

							for (var j = 0; j < dd.length; j++) {
								data.push(dd[j]);
							}
						}
						data.sort($scope.sortBsId);
						$scope.byBsIdData = data;
						$scope.bsBsIdTotals = data.length;
					});
		};*/
		// 分页点击
		$scope.bsPageClick = function(page, totals, totalPages) {
			var pageSize = $("#page-limit-bs").val();
			var bsIds=[];
			$("#select_bs").find("li").each(function(){
				bsIds.push($(this).attr("value"))
			})
			var zone = $("select[name='zone']").val() == null ? "全部" : $("select[name='zone']").val();
			var start = 1, limit = pageSize;
			var bs_id=bsIds.join(",");
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}

			$http.get("../../bs/bs_business_info?zone=" + zone + "&bsId=" + bs_id+"&sort_type="+$scope.sort_type+"&sort_field="+$scope.sort_field+"&start="+start+"&limit="+pageSize)
					.success(function(response) {
						xh.maskHide();
						

						$scope.bs_business_start = (page - 1) * pageSize + 1;
						$scope.bs_business_lastIndex = page * pageSize;
						if (page == totalPages) {
							if (totals > 0) {
								$scope.bs_business_lastIndex = totals;
							} else {
								$scope.bs_business_start = 0;
								$scope.bs_business_lastIndex = 0;
							}
						}
						$scope.bs_business_info = response.items;
						$scope.bs_business_info_count = response.totals;
					});

		};
		// 分页点击
		$scope.userPageClick = function(page, totals, totalPages) {
			var pageSize = $("#page-limit-user").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}

			$http.get(
					"../../radio/status/oneBsRadio?bsId=" + $scope.bsId
							+ "&start=" + start + "&limit=" + pageSize)
					.success(function(response) {
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
						$scope.radioData = response.items;
						$scope.radioTotals = response.totals;
					});

		};
		// 注册组分页点击
		$scope.groupPageClick = function(page, totals, totalPages) {
			var pageSize = $("#page-limit-group").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}

			$http.get("../../radio/status/oneBsGroup?bsId=" + $scope.bsId
							+ "&start=" + start + "&limit=" + pageSize)
					.success(function(response) {
						xh.maskHide();

						$scope.groupStart = (page - 1) * pageSize + 1;
						$scope.groupLastIndex = page * pageSize;
						if (page == totalPages) {
							if (totals > 0) {
								$scope.groupLastIndex = totals;
							} else {
								$scope.groupStart = 0;
								$scope.lastIndex = 0;
							}
						}
						$scope.groupData = response.items;
						$scope.groupTotals = response.totals;
					});

		};
		$scope.allBsInfo();
		

		/*setInterval(function() {
			$scope.search(1);
		}, 10000);*/

	});
};

// 刷新数据
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();
	$scope.bs_business

};
xh.sort = function(type,field) {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.sort_type=type;
	$scope.sort_field=field
	$scope.bs_business();

};
xh.refresh_bs = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh_bs();

};
xh.search_more_bs=function(){
	var $scope = angular.element(appElement).scope();
	$scope.search_more_bs()
}

// 基站状态检查表
xh.excelToBsstatus = function() {
	xh.maskShow();
	$("#btn-status").button('loading')
	$.ajax({
		url : '../../bsstatus/ExcelToBsStatus',
		type : 'get',
		dataType : "json",
		data : {},
		async : false,
		success : function(data) {
			xh.maskHide();
			$("#btn-status").button('reset');
			if (data.success) {

				window.location.href = "../../bsstatus/downExcel?filePath="
						+ data.pathName;
			} else {
				toastr.error("导出失败", '提示');
			}
		},
		error : function() {
			$("#btn-status").button('reset');
			xh.maskHide();
			toastr.error("导出失败", '提示');
		}
	});
};
xh.getOneDay = function() {
	var today = new Date();
	var yesterday_milliseconds = today.getTime(); // -1000*60*60*24

	var yesterday = new Date();
	yesterday.setTime(yesterday_milliseconds);

	var strYear = yesterday.getFullYear();

	var strDay = yesterday.getDate();
	var strMonth = yesterday.getMonth() + 1;

	if (strMonth < 10) {
		strMonth = "0" + strMonth;
	}
	if (strDay < 10) {
		strDay = "0" + strDay;
	}
	var strYesterday = strYear + "-" + strMonth + "-" + strDay + " "
			+ "23:59:59";
	return strYesterday;
}

xh.bsPagging = function(currentPage, totals, $scope) {
	var pageSize = $("#page-limit-bs").val();
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
	$scope.bs_business_start = start;
	$scope.bs_business_lastIndex = end;
	$scope.bs_business_totals = totals;
	if (totals > 0) {
		$(".page-paging-bs").html('<ul class="pagination"></ul>');
		$('.pagination').twbsPagination({
			totalPages : totalPages,
			visiblePages : 6,
			version : '1.1',
			startPage : currentPage,
			onPageClick : function(event, page) {
				if (frist == 1) {
					$scope.bsPageClick(page, totals, totalPages);
				}
				frist = 1;

			}
		});
	}
};

xh.userPagging = function(currentPage, totals, $scope) {
	var pageSize = $("#page-limit-user").val();
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
		$(".page-paging-user").html('<ul class="pagination"></ul>');
		$('.pagination').twbsPagination({
			totalPages : totalPages,
			visiblePages : 3,
			version : '1.1',
			startPage : currentPage,
			onPageClick : function(event, page) {
				if (frist == 1) {
					$scope.userPageClick(page, totals, totalPages);
				}
				frist = 1;

			}
		});
	}
};
xh.groupPagging = function(currentPage, totals, $scope) {
	var pageSize = $("#page-limit-group").val();
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
	$scope.groupStart = start;
	$scope.groupLastIndex = end;
	$scope.groupTotals = totals;
	if (totals > 0) {
		$(".page-paging-group").html('<ul class="pagination"></ul>');
		$('.pagination').twbsPagination({
			totalPages : totalPages,
			visiblePages : 3,
			version : '1.1',
			startPage : currentPage,
			onPageClick : function(event, page) {
				if (frist == 1) {
					$scope.groupPageClick(page, totals, totalPages);
				}
				frist = 1;

			}
		});
	}
};
xh.compare = function (obj1, obj2) {
    var val1 = obj1.bsId;
    var val2 = obj2.bsId;
    if (val1 < val2) {
        return -1;
    } else if (val1 > val2) {
        return 1;
    } else {
        return 0;
    }            
} 
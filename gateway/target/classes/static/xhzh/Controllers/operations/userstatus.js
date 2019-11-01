/**
 * 终端状态
 */
if (!("xh" in window)) {
	window.xh = {};
};
require.config({
	paths : {
		echarts : '../../lib/echarts'
	}
});
var background="#fff";
var frist = 0;
var appElement = document.querySelector('[ng-controller=userstatus]');
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
	var userId=$("#userId").val();
	var regStatus=$("#regStatus").val();
	var pageSize = $("#page-limit").val();
	app.controller("userstatus", function($scope, $http) {
		$scope.count = "20";//每页数据显示默认值
		/* 终端状态统计图 */
		xh.loadUserStatusPie();
		
	
		/*获取终端状态*/
		$scope.userstatus=function(){
			$http.get("../../operations/data/userstatus?userId="+userId+"&regStatus="+regStatus+"" +
					"&start=0&limit="+pageSize).
			success(function(response){
				$scope.data = response.items;
				$scope.totals = response.totals;
				$scope.currentPage=1;
				xh.pagging($scope.currentPage, parseInt($scope.totals),$scope);
			});
		}
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.currentPage=1;
			$scope.search(1);
		};
		
		/* 显示链接修改model */
		$scope.editModel = function(id) {
			$scope.editData = $scope.data[id];
			$scope.roleId=$scope.editData.roleId.toString();
		};
		/* 显示按钮修改model */
		$scope.showEditModel = function() {
			var checkVal = [];
			$("[name='tb-check']:checkbox").each(function() {
				if ($(this).is(':checked')) {
					checkVal.push($(this).attr("index"));
				}
			});
			if (checkVal.length != 1) {
				swal({
					title : "提示",
					text : "只能选择一条数据",
					type : "error"
				});
				return;
			}
			$("#edit").modal('show');
			$scope.editData = $scope.data[parseInt(checkVal[0])];
			$scope.roleId=$scope.editData.roleId.toString();
			
		};
		/* 删除用户 */
		$scope.del = function(id) {
			swal({
				title : "提示",
				text : "确定要删除该用户吗？",
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
						url : '../../web/user/del',
						type : 'post',
						dataType : "json",
						data : {
							userId : id
						},
						async : false,
						success : function(data) {
							if (data.success) {
								toastr.success("删除用户成功", '提示');
								$scope.refresh();
					    	
							} else {
								swal({
									title : "提示",
									text : "删除用户失败",
									type : "error"
								});
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
			var userId=$("#userId").val();
			var regStatus=$("#regStatus").val();
			var pageSize = $("#page-limit").val();
			var start = 1, limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;

			} else {
				start = (page - 1) * pageSize;
			}
			$http.get("../../operations/data/userstatus?userId="+userId+"&regStatus="+regStatus+"" +
					"&start="+start+"&limit="+pageSize).
			success(function(response){
				$scope.data = response.items;
				$scope.totals = response.totals;
				xh.pagging(page, parseInt($scope.totals),$scope);
			});
		};
		//分页点击
		$scope.pageClick = function(page,totals, totalPages) {
			var userId=$("#userId").val();
			var regStatus=$("#regStatus").val();
			var pageSize = $("#page-limit").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			$http.get("../../operations/data/userstatus?userId="+userId+"&regStatus="+regStatus+"" +
					"&start="+start+"&limit="+pageSize).
			success(function(response){
				
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
		$scope.userstatus();
		setInterval(function(){
			$scope.search($scope.currentPage);
			xh.loadUserStatusPie();
		},10000);
	});
};


// 刷新数据
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();

};
/* 终端状态统计图 */
xh.loadUserStatusPie = function() {
	// 设置容器宽高
	 var resizeBarContainer = function() {
	  $("#userStatus-pie").width(parseInt($("#userStatus-pie").parent().width()));
	  $("#userStatus-pie").height(300);
	  };
	  resizeBarContainer();
	 
	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	require([ 'echarts', 'echarts/chart/pie' ], function(ec) {
		chart = ec.init(document.getElementById('userStatus-pie'));
		chart.showLoading({
			text : '正在努力的读取数据中...'
		});
		var option = {
			/*title : {
				x : 'center',
				text : '终端状态统计图',
				subtext : '',
				textStyle : {
					color : '#fff'
				}
			},*/
			tooltip : {
				trigger : 'item',
				formatter : "{a} <br/>{b} : {c} ({d}%)"
			},
			legend : {
				orient : 'vertical',
				x : 'left',
				textStyle : {
					color : '#ccc'
				},
				data : [ '离线', '在线' ]
			},
			/*
			 * toolbox : { show : true, feature : { dataView : { show : true,
			 * readOnly : false }, restore : { show : true }, saveAsImage : {
			 * show : true } } },
			 */
			calculable : false,
			backgroundColor : background,
			series : [ {
				name : '数量',
				type : 'pie',
				radius : '55%',
				center : [ '50%', '60%' ],
				itemStyle : {
					normal : {
						color : function(params) {
							// build a color map as your need.
							var colorList = [ '#C1232B', 'green', '#FCCE10' ];
							return colorList[params.dataIndex];
						},
						label : {
							show : true,
							position : 'top',
							formatter : '{b}\n{c}'
						}
					}
				},
				data : []
			} ]
		};

		$.ajax({
			url : '../../operations/data/userstatusChart',
			data : {},
			type : 'get',
			dataType : "json",
			async : false,
			success : function(response) {
				var data = response.items;
				// option.xAxis[0].data = xAxisData;
				option.series[0].data = data;
				/* option.title.subtext="当前基站总数:"+response.totals; */
				chart.hideLoading();
				chart.setOption(option);

			},
			failure : function(response) {
			}
		});

	});
	// 用于使chart自适应高度和宽度
	window.onresize = function() {
		// 重置容器高宽
		chart.resize();
	};
};
/* 数据分页 */
xh.pagging = function(currentPage,totals, $scope) {
	var $scope = angular.element(appElement).scope();
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
			visiblePages : 7,
			version : '1.1',
			startPage : currentPage,
			onPageClick : function(event, page) {
				if (frist == 1) {
					$scope.pageClick(page, totals, totalPages);
					$scope.currentPage=page;
				}
				frist = 1;

			}
		});
	}
};



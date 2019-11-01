/**
 * 资产管理
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
		/*xh.maskShow();*/
		$scope.count = "15";//每页数据显示默认值
		$scope.businessMenu=true; //菜单变色
		
		/*资产状态统计
		$http.get("../../business/allAssetStatus").
		success(function(response){
			xh.maskHide();
			$scope.data = response.items;
		});*/
		/*资产类型统计*/
		$http.get("../../business/allAssetType").
		success(function(response){
			xh.maskHide();
			$scope.typeData = response.items;
		});
		/*资产名称统计*/
		/*$http.get("../../business/allAssetNameCount").
		success(function(response){
			xh.maskHide();
			$scope.nameData = response.items;
		});*/
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
			$("#table-checkbox").prop("checked", false);
		};
		//xh.statusPie();
		xh.chart();
		/* 查询数据 */
		$scope.search = function(page) {
			var pageSize = $("#page-limit").val();
			var type = $("#type").val();
			var name = $("#name").val();
			var model = $("#model").val();
			var serialNumber = $("#serialNumber").val();
			var from = $("#from").val();
			var status = $("#status").val();
			var pageSize = $("#page-limit").val();
			var limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;

			} else {
				start = (page - 1) * pageSize;
			}
			console.log("limit=" + limit);
			xh.maskShow();
			$http.get("../../business/assetList?type="+type+"&name="+name+"" +
					"&model="+model+"&serialNumber="+serialNumber+"&from="+from+"" +
					"&status="+status+"&start=0&limit="+pageSize).
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				xh.pagging(page, parseInt($scope.totals), $scope);
			});
		};
		//分页点击
		$scope.pageClick = function(page, totals, totalPages) {
			var type = $("#type").val();
			var name = $("#name").val();
			var model = $("#model").val();
			var serialNumber = $("#serialNumber").val();
			var from = $("#from").val();
			var status = $("#status").val();
			var pageSize = $("#page-limit").val();
			var start = 1;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			xh.maskShow();
			$http.get("../../business/assetList?type="+type+"&name="+name+"" +
					"&model="+model+"&serialNumber="+serialNumber+"&from="+from+"" +
					"&status="+status+"&start="+start+"&limit="+pageSize).
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
/* 资产状态统计图 */
xh.statusPie = function() {
	// 设置容器宽高
	 var resizeBarContainer = function() {
	  $("#pie").width(parseInt($("#pie").parent().width()));
	  $("#pie").height(300);
	  };
	  resizeBarContainer();
	 
	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	require([ 'echarts', 'echarts/chart/pie' ], function(ec) {
		chart = ec.init(document.getElementById('pie'));
		chart.showLoading({
			text : '正在努力的读取数据中...'
		});
		var option = {
			title : {
				x : 'center',
				text : '',
				subtext : '',
				textStyle : {
					color : '#000'
				}
			},
			tooltip : {
				trigger : 'item',
				formatter : "{a} <br/>{b} : {c} ({d}%)"
			},
		/*	legend : {
				orient : 'vertical',
				x : 'left',
				textStyle : {
					color : '#ccc'
				},
				data : [ '1', '2', '3', '4', '5', '6' ]
			},*/
			/*
			 * toolbox : { show : true, feature : { dataView : { show : true,
			 * readOnly : false }, restore : { show : true }, saveAsImage : {
			 * show : true } } },
			 */
			calculable : false,
			/*backgroundColor : background,*/
			series : [ {
				name : '数量',
				type : 'pie',
				radius : '55%',
				center : [ '50%', '50%' ],
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
			url : '../../business/allAssetStatus',
			data : {},
			type : 'get',
			dataType : "json",
			async : false,
			success : function(response) {
				var data = response.items;
				// option.xAxis[0].data = xAxisData;
				var total=0;
				$.each(data,function(i,v){
					total+=v.value;
				});
				
				option.series[0].data = data;
				option.title.text="设备总数量:"+total;
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

xh.chart = function() {
	
	xh.maskShow();
	// 设置容器宽高
	 var resizeBarContainer = function() {
	  $("#chart").width(parseInt($("#chart").parent().width()));
	  $("#chart").height(document.documentElement.clientHeight/2);
	  };
	  resizeBarContainer();
	 
	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	require([ 'echarts', 'echarts/chart/bar'], function(ec) {
		chart = ec.init(document.getElementById('chart'));
		chart.showLoading({
			text : '正在努力的读取数据中...'
		});
		var option = {
			    title : {
			        text: ''/*,
			        subtext: '纯属虚构'*/
			    },
			    /*tooltip : {
			        trigger: 'axis'
			    },*/
			    tooltip : {
					trigger : 'item'/*,
					formatter: function (params, ticket, callback) {  
						
						
			            //x轴名称  
			            var name = params.name; 
			            //图表title名称  
			            var seriesName = params.seriesName;  
			            //值  
			            var value = params.data;  
			            var valueFliter = xh.formatTime(parseInt(value)); 
			            return name + '<br />' + seriesName + '<br />' + valueFliter; 
			           
			        }*/
				},
			   /* legend: {
			        data:['遗失']
			    },*/
			    toolbox: {
			        show : true,
			        feature : {
			            mark : {show: true},
			            dataView : {show: true, readOnly: false},
			            magicType : {show: true, type: ['bar']},
			            restore : {show: true},
			            saveAsImage : {show: true}
			        }
			    },
			    calculable : true,
			    xAxis : [
			        {
			            type : 'category',
			            data : []
			        }
			    ],
			    yAxis : [
			      {
                    type: 'value',
                    name: '设备数量',
                    min: 0,
                    
                    position: 'left',
                    axisLabel: {
                        formatter: '{value}'
                    }
                    }
			    ],
			    series : [
			        {
			            name:'资产状态',
			            type:'bar',
			            data:[],
			            itemStyle:{normal:{color:'green'}},
			            barWidth: 30,
			            yAxisIndex:0,
			            markPoint : {
			                data : [
			                    {type : 'max', name: '最大值'},
			                    {type : 'min', name: '最小值'}
			                ]
			            }
			        }
			    ]
			};

		$.ajax({
			url : '../../business/allAssetStatus',
			data : {},
			type : 'get',
			dataType : "json",
			async : false,
			success : function(response) {
				var data = response.items;
				var Y=[],X=[];
				var total=0;
				$.each(data,function(i,v){
					Y.push(v.value);
					X.push(v.name);
					total+=v.value;
				});
				option.series[0].data = Y;
				option.xAxis[0].data = X;
				chart.hideLoading();
				chart.setOption(option);
				option.title.text="资产状态分布柱状图统计  设备数量总计："+total; 
				xh.maskHide();

			},
			failure : function(response) {
				xh.maskHide();
			}
		});
		
		chart.hideLoading();
		chart.setOption(option);

	});
	
	// 用于使chart自适应高度和宽度
	window.onresize = function() {
		// 重置容器高宽
		 resizeBarContainer();
	};
};

xh.excelName=function(){
	xh.maskShow();
	$.ajax({
		url : '../../business/excelName',
		data : {},
		type : 'post',
		dataType : "json",
		async : false,
		success : function(response) {
			xh.maskHide();
			if(response.success){
				toastr.success(response.message, '提示');
				var downUrl="../../business/download?fileName=资产状况.xls";
				window.open(downUrl,'_self','width=1,height=1,toolbar=no,menubar=no,location=no');
			}else{
				toastr.error(response.message, '提示');
			}
			

		},
		failure : function(response) {
		}
	}); 
}

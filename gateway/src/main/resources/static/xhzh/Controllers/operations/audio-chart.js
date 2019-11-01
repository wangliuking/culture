if (!("xh" in window)) {
	window.xh = {};
};
require.config({
	paths : {
		echarts : '../../lib/echarts'
	}
});
var background="#fff";
var appElement = document.querySelector('[ng-controller=audio]');
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
	var bsId="";
	var name="";

	app.controller("audio", function($scope, $http) {
		
		$http.get("../../bs/list?bsId="+bsId+"&name="+name+"&start=0&limit=1000").
		success(function(response){
			$scope.bslistData = response.items;
			
			
		});
		
	});
};

/*xh.chart=function(){
	$.ajax({
		url : '../../call/chart',
		type : 'POST',
		dataType : "json",
		async :false,
		data:$("#chartForm").serializeArray(),
		success : function(data) {
			
		},
		error : function() {
		}
	});
	
};*/
xh.chart = function() {
	
	xh.maskShow();
	// 设置容器宽高
	 var resizeBarContainer = function() {
	  $("#chart").width(parseInt($("#chart").parent().width()));
	  $("#chart").height(document.documentElement.clientHeight-100);
	  };
	  resizeBarContainer();
	 
	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	require([ 'echarts', 'echarts/chart/bar','echarts/chart/line' ], function(ec) {
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
			    legend: {
			        data:['呼叫时长','呼叫次数']
			    },
			    toolbox: {
			        show : true,
			        feature : {
			            mark : {show: true},
			            dataView : {show: true, readOnly: false},
			            magicType : {show: true, type: ['line', 'bar']},
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
                    name: '呼叫时长',
                    min: 0,
                    
                    position: 'left',
                    axisLabel: {
                        formatter: '{value} （分钟）'
                    }
                    },{
	                    type: 'value',
	                    name: '呼叫次数',
	                    min: 0,
	                  
	                    position: 'right',
	                    axisLabel: {
	                        formatter: '{value} （次）'
	                    }
	                }
			    ],
			    series : [
			        {
			            name:'呼叫时长',
			            type:'bar',
			            data:[],
			            itemStyle:{normal:{color:'green'}},
			            yAxisIndex:0,
			            markPoint : {
			                data : [
			                    {type : 'max', name: '最大值'},
			                    {type : 'min', name: '最小值'}
			                ]
			            }
			        },{
			            name:'呼叫次数',
			            type:'line',
			            yAxisIndex:1,
			            itemStyle:{normal:{color:'#d14a61'}},
			            data:[],
			            markPoint : {
			                data : [
			                    {type : 'max', name: '最大值'},
			                    {type : 'min', name: '最小值'}
			                ]
			            }/*,
			            markLine : {
			                data : [
			                    {type : 'average', name: '平均值'}
			                ]
			            }*/
			        }
			    ]
			};

		$.ajax({
			url : '../../call/chart',
			data:$("#chartForm").serializeArray(),
			type : 'POST',
			dataType : "json",
			async : false,
			success : function(response) {
				var data = response.time;
				var num = response.num;
				var xData=[],yData=[],yData2=[];
				
				for(var i=0;i<data.length;i++){
					xData.push(data[i].label);
					yData.push(data[i].time);
					yData2.push(num[i].num);
				}
				var bsId=parseInt($("select[name='bsId']").val());
				var text="";
				if(bsId==0){
					text="所有基站在该段时间内的通话时长统计";
				}else{
					text="["+bsId+"]号基站在该段时间内的通话时长统计";
				}
				
				
				
				option.series[0].data = yData;
				option.series[1].data = yData2;
				option.xAxis[0].data = xData;
				chart.hideLoading();
				chart.setOption(option);
				option.title.text=text; 
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
xh.formatTime=function(second) {
    return [parseInt(second / 60 / 60), parseInt(second / 60 % 60), parseInt(second % 60)].join(":")
        .replace(/\b(\d)\b/g, "0$1");
}
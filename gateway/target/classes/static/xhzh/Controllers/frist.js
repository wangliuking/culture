/**
 * 用户管理
 */
if (!("xh" in window)) {
	window.xh = {};
};
require.config({
	paths : {
		echarts : 'lib/echarts'
	}
});
var alarmbs=true;
var alarmji=true;
var appElement = document.querySelector('[ng-controller=frist]');
xh.load = function() {
	var app = angular.module("app", []);
	app.filter('formatNum', function() { // 可以注入依赖
		return function(text) {
			var str="";
			var a=text.toString();
			for(var i=0;i<a.length;i++){
				str+="<span>"+a.charAt(i)+"</span>";
			}
			return str;
			
			
		};
	});
	app.filter('alarmContent', function() { // 可以注入依赖
		return function(text) {
			
			if(text.indexOf("，")>0){
				return text.split("，")[2];
			}else{
				return text;
			}
			
		};
	});
	app.filter('alarmLocation', function() { //可以注入依赖
	    return function(text) {
	    	
	    	if(text.indexOf("交换中心")==0){
	    		return text.split(".")[4]+"."+text.split(".")[5];
	    	}else{
	    		return text;
	    	}
	        
	    };
	});
	app.controller("frist", function($scope, $http) {
		$http.get("onduty/onduty").success(
				function(response) {
					$scope.dataOne = response.one;
					$scope.dataTwo = response.two;
					$scope.dataThree = response.three;
				});
		// 获取登录用户
		$http.get("web/loginUserInfo").success(function(response) {
			xh.maskHide();
			$scope.roleType  = response.roleType;
		});
	
       $scope.duty=function(){
	   $http.get("onduty/onduty").success(
			function(response) {
				$scope.dataOne = response.one;
				$scope.dataTwo = response.two;
				$scope.dataThree = response.three;
			});
}
       $scope.water=function(){
    	   $http.get("access/list").
   		success(function(response){
   			var data = response.items;
   			var totals = response.totals;
   			var app=response.app;
   			var a=0,b=0;
   			for(var i=0;i<totals;i++){
   				if(data[i].status==1){
   					a++;
   				}else{
   					b++;
   				}
   			}
   			xh.waterstatus(1,app);
   			xh.waterstatus(2,a);	
   			xh.waterstatus(3,b);	
   		});
       }
		
		
		$scope.updateDuty=function(){
			$.ajax({
				url : 'bsstatus/updateDuty',
				type : 'POST',
				dataType : "json",
				data : {
					duty1:$("input[name='duty1']").val(),
					duty2:$("input[name='duty2']").val(),
					duty3:$("input[name='duty3']").val()
				},
				async : false,
				success : function(data) {
				},
				error : function() {
				}
			});
		}
		
		$scope.info=function(){
			$http.get("dataView/show").
			success(function(response){
				xh.maskHide();
				$scope.useOnlineCount=response.useOnlineCount;
				$scope.userCount=response.userCount;
				$scope.bsCount=response.bsCount;
				$scope.bsOffline=response.bsOffline;
				$scope.group=response.group;
				$scope.radio=response.radio;
				$scope.emh=response.emh;
				$scope.mscCount=response.mscCount;
				$scope.geoCoord=response.geoCoord;
				$scope.bsNames=response.bsNames;
				$scope.tera=response.tera;
				$scope.channelQueueTop5=response.channelQueueTop5;

				
				$("#userOnline").html(xh.formatNum($scope.useOnlineCount));
				$("#userCount").html(xh.formatNum($scope.userCount));
				$("#bsCount").html(xh.formatNum($scope.bsCount));
				$("#bsOffline").html(xh.formatNum($scope.bsOffline));
				$("#emh").html($scope.emh);
				$("#msc").html($scope.mscCount);
				xh.groupTop5($scope.group);
				xh.userTop5($scope.radio);
				xh.callTop5($scope.channelQueueTop5);
				xh.map($scope.geoCoord,$scope.bsNames);
				
			});
		}
		
		
	/*	xh.call();*/
		 $scope.water();
		xh.callInfo();
		$scope.info();
		
		setInterval(function(){
			xh.callInfo();
			$scope.info();
			$scope.duty();
			 $scope.water();
			//$scope.updateDuty();
		}, 20000)

	});
};

xh.formatNum=function(text){
	var str="";
	var a=text.toString();
	for(var i=0;i<a.length;i++){
		str+="<span>"+a.charAt(i)+"</span>";
	}
	return str;
	
}
xh.map=function(data,name){
	// 设置容器宽高
	var height=document.documentElement.clientHeight;
	var width=document.documentElement.clientWidth;
	var resizeBarContainer = function() {
		$("#map").width((width/12)*5);
		$("#map").height(height-115);
	};
	resizeBarContainer();

	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	
	
	
	require([ 'echarts', 'echarts/chart/map' ], function(ec) {
		chart = ec.init(document.getElementById('map'));
		require('echarts/util/mapData/params').params.CD = {
		    getGeoJson: function (callback) {
		        $.getJSON('lib/echarts/util/mapData/params/510100.json',callback);
		    }
		}
		var option = {
			    backgroundColor: '',
			    color: ['gold','aqua','lime'],
			  
			 
			    textStyle:{
                	color:'#fff'
                },
			    tooltip : {
			        trigger: 'item',
			        formatter: '{b}'
			    },
			   /* legend: {
			        orient: 'vertical',
			        x:'left',
			        data:['北京 Top10', '上海 Top10', '广州 Top10'],
			        selectedMode: 'single',
			        selected:{
			            '上海 Top10' : false,
			            '广州 Top10' : false
			        },
			        textStyle : {
			            color: '#fff'
			        }
			    },*/
			  
			 /*  dataRange: {
			        min : 0,
			        max : 1,
			        calculable : true,
			        color: ['red', 'red'],
			        textStyle:{
			            color:'#fff'
			        }
			    },*/
			    series : [
			        {
			            name: '全国',
			            type: 'map',
			            roam: true,
			            hoverable: false,
			            mapType: 'CD',
			            itemStyle:{
			                normal:{
			                	label:{
			                		show:true,
			                		textStyle:{
			    			            color:'#fff',
			    			            fontSize:11
			    			        }
			                		} ,
			                    borderColor:'green',
			                    borderWidth:1,
			                    areaStyle:{
			                        /*color: '#1b1b1b',*/
			                        color:'',
			                        visibility: 'off'
			                    },
			                    
			                    emphasis:{label:{show:true}} 
			                }
			            },
			            geoCoord: {
			                
			                
			            },
			        
		                
			            data:[],
			            /*markLine : {
			                smooth:true,
			                symbol: ['none', 'circle'],  
			                symbolSize : 1,
			                itemStyle : {
			                    normal: {
			                        color:'#fff',
			                        borderWidth:1,
			                        borderColor:'rgba(30,144,255,0.5)'
			                    }
			                },
			                data : [
			                        [{name:'锦江区'}, {name:'测试基站',value:0}],
			                ]
			            },*/
			            markPoint:{
			            	symbol:'emptyCircle',
			               /* symbolSize : function (v){
			                    return 10 + v/10
			                },*/
			                effect : {
			                    show: true,
			                    shadowBlur : 20,
			                    
			                    color:'red'
			                },
			                itemStyle:{
			                    normal:{
			                        label:{show:true}
			                    },
			                    emphasis: {
			                        label:{position:'bottom'}
			                    }
			                },
			                data : name
			            }
			            
			        }
			    ]
			};
		 for (var i in data) {
             option.series[0].geoCoord[data[i].bsId+"-"+data[i].name] = [parseFloat(data[i].lng), parseFloat(data[i].lat)];
         }
		
		chart.setOption(option);

	});
	/*window.onresize = function() {
		// 重置容器高宽
		chart.resize();
	};*/
	
}
xh.call = function() {
	// 设置容器宽高
	var height=document.documentElement.clientHeight;
	var width=document.documentElement.clientWidth;
	var resizeBarContainer = function() {
		$("#call-bar").width((width/12)*4);
		$("#call-bar").height(height-430);
	};
	  resizeBarContainer();
	 
	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	require([ 'echarts', 'echarts/chart/bar','echarts/chart/line' ], function(ec) {
		chart = ec.init(document.getElementById('call-bar'));
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
			    calculable : true,
			    xAxis : [
			        {
			            type : 'category',
			            data : [],
			          //设置字体倾斜  
	                    axisLabel:{  
	                        interval:0,  
	                        rotate:45,//倾斜度 -90 至 90 默认为0  
	                        margin:2,  
	                        textStyle:{  
	                            fontWeight:"bolder",  
	                            color:"#fff"  
	                        }  
	                    }
			        }
			    ],
			    yAxis : [
			      {
                    type: 'value',
                    name: '呼叫时长',
                    min: 0,
                    
                    position: 'left',
                    axisLabel: {
                        formatter: '{value} （分钟）',
                        textStyle:{
                        	color:'#fff'
                        }
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
			            itemStyle:{normal:{color:'green'}}
			        },{
			            name:'呼叫次数',
			            type:'line',
			            yAxisIndex:1,
			            itemStyle:{normal:{color:'#d14a61'}},
			            data:[]
			        }
			    ]
			};

		$.ajax({
			url : 'call/chart',
			type : 'POST',
			dataType : "json",
			async : false,
			data:{
				bsId:0,
				time:'2017-11-21',
				type:'hour'
			},
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
				
				option.series[0].data = yData;
				option.series[1].data = yData2;
				option.xAxis[0].data = xData;
				chart.setOption(option);
				xh.maskHide();

			},
			failure : function(response) {
				xh.maskHide();
			}
		});
		
		chart.setOption(option);

	});
	
	// 用于使chart自适应高度和宽度
	window.onresize = function() {
		// 重置容器高宽
		 resizeBarContainer();
	};
};
xh.callTop5=function(data){
	// 设置容器宽高
	var height=document.documentElement.clientHeight;
	var width=document.documentElement.clientWidth;
	var resizeBarContainer = function() {
		$("#call-top5").width((width/12)*3);
		$("#call-top5").height((height-200)/3);
	};
	resizeBarContainer();

	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	if(data.length<1){
		$("#call-top5").html("数据还没生成!!! 请等几分钟再关注");
		return;
	}
	
	
	
	require([ 'echarts', 'echarts/chart/pie' ], function(ec) {
		chart = ec.init(document.getElementById('call-top5'));
		var leglend=[]
		for(var i=0;i<data.length;i++){
			leglend.push(data[i].name);
		}
		var option = {
			    tooltip : {
			        trigger: 'item',
			        formatter: "{b}<br/> 呼叫总数 {c}"
			    },
			    legend: {
			        orient : 'vertical',
			        x : 'left',
			        textStyle:{
			        	color:'#fff',
			        },
			        data:leglend
			    },
			  
			    calculable : false,
			    series : [
			        {
			            name:'基站呼叫TOP5',
			            type:'pie',
			            radius : ['50%', '70%'],
			            center : ['60%', '40%'],
			            itemStyle : {
			                normal : {
			                    label : {
			                        show : false
			                    },
			                    labelLine : {
			                        show : false
			                    }
			                },
			                emphasis : {
			                    label : {
			                        show : true,
			                        position : 'center',
			                        textStyle : {
			                            fontSize : '15',
			                            fontWeight : 'bold'
			                        }
			                    }
			                }
			            },
			            data:data
			        }
			    ]
			};
		chart.setOption(option);

	});
	/*window.onresize = function() {
		// 重置容器高宽
		chart.resize();
	};*/
	
}
xh.groupTop5=function(data){
	// 设置容器宽高
	var height=document.documentElement.clientHeight;
	var width=document.documentElement.clientWidth;
	var resizeBarContainer = function() {
		$("#group-top5").width((width/12)*3);
		$("#group-top5").height((height-200)/3);
	};
	resizeBarContainer();

	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	
	
	
	require([ 'echarts', 'echarts/chart/funnel' ], function(ec) {
		chart = ec.init(document.getElementById('group-top5'));
		var leglend=[]
		for(var i=0;i<data.length;i++){
			leglend.push(data[i].name+"-"+data[i].value);
			data[i].name=data[i].name+"    ["+data[i].value+"]"
		}
		
		var option = {
			    
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c}"
			    },
			   
			   /* legend: {
			    	 orient : 'vertical',
				        x : 'left',
				        textStyle:{
				        	color:'#fff',
				        },
			        data : leglend
			    },*/
			    calculable : false,
			    series : [
			              {
					            name:'基站注册组',
					            type:'funnel',
					            width: 60,
					            height:'80%',
					            maxSize: '30%',
					            sort: 'descending', //数据排序，如果是：ascending，则是金字塔状 
					            gap: 1, //数据图像间距 
					            itemStyle: {//图像样式 
					                normal: { 
					                    borderColor: '#fff', //描边颜色 
					                    borderWidth: 1  //描边宽度 
					                    
					                } 
					            },
					  
					            
					            x:'10%',
					            y:10,
					            data:data
					        }
			    ]
			};
		chart.setOption(option);

	});
	/*window.onresize = function() {
		// 重置容器高宽
		chart.resize();
	};*/
	
}
xh.userTop5=function(data){
	// 设置容器宽高
	var height=document.documentElement.clientHeight;
	var width=document.documentElement.clientWidth;
	var resizeBarContainer = function() {
		$("#user-top5").width((width/12)*3);
		$("#user-top5").height((height-200)/3);
	};
	resizeBarContainer();

	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	
	
	
	require([ 'echarts', 'echarts/chart/funnel' ], function(ec) {
		chart = ec.init(document.getElementById('user-top5'));
		var leglend=[]
		for(var i=0;i<data.length;i++){
			leglend.push(data[i].name);
			data[i].name=data[i].name+"    ["+data[i].value+"]"
		}
		var option = {
			    
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c}"
			    },
			   
			   /* legend: {
			    	 orient : 'vertical',
				        x : 'left',
				        textStyle:{
				        	color:'#fff',
				        },
			        data :leglend
			    },*/
			    calculable : false,
			    series : [
			        {
			            name:'基站注册终端',
			            type:'funnel',
			            width: 60,
			            height:'80%',
			            maxSize: '30%',
			            sort: 'descending', //数据排序，如果是：ascending，则是金字塔状 
			            gap: 1, //数据图像间距 
			            itemStyle: {//图像样式 
			                normal: { 
			                    borderColor: '#fff', //描边颜色 
			                    borderWidth: 1  //描边宽度 
			                } 
			            },
			  
			            
			            x:'10%',
			            y:10,
			            data:data
			        }
			    ]
			};
		chart.setOption(option);
		
		

	});
	/*window.onresize = function() {
		// 重置容器高宽
		chart.resize();
	};*/
	
}
xh.callInfo=function(){
	// 设置容器宽高
	var height=document.documentElement.clientHeight;
	var width=document.documentElement.clientWidth;
	var resizeBarContainer = function() {
		$("#call-bar").width((width/12)*4-40);
		$("#call-bar").height(height-450);
	};
	resizeBarContainer();

	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	
	
	
	require([ 'echarts', 'echarts/chart/bar','echarts/chart/line' ], function(ec) {
		chart = ec.init(document.getElementById('call-bar'));
		
		var option = {
			    tooltip : {
			        trigger: 'axis'
			    },
			    legend: {
			    	data:['呼叫时长','呼叫次数'],
			    	textStyle:{
			    		color:'#fff'
			    	}
			    },
			    
			    calculable : true,
			    xAxis : [
			        {
			            type : 'category',
			            axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        splitLine:{show: false},//去除网格线
                        splitArea : {show : false},//去除网格区域
			            data : ["00","01","02","03","04","05",
			                    "06","07","08","09","10","11",
			                    "12","13","14","15","16","17",
			                    "18","19","20","21","22","23"]
			        }
			    ],
			    yAxis : [ {
                    type: 'value',
                    name: '呼叫时长',
                    min: 0,
                    
                    position: 'left',
                    axisLabel: {
                        formatter: '{value} （分钟）',
                        textStyle:{
                        	color:'#fff'
                        }
                    }
                    },{
	                    type: 'value',
	                    name: '呼叫次数',
	                    min: 0,
	                  
	                    position: 'right',
	                    axisLabel: {
	                        formatter: '{value} （次）',
	                        textStyle:{
	                        	color:'#fff'
	                        }
	                    }
	                }],
			    series : [{
		            name:'呼叫时长',
		            type:'bar',
		            data:[],
		            itemStyle:{normal:{color:'#FF00FF'}}
		        },{
		            name:'呼叫次数',
		            type:'line',
		            yAxisIndex:1,
		            itemStyle:{normal:{color:'yellow'}},
		            data:[]
		        }
			    ]
			};
		
		$.ajax({
			url : 'call/chart_call_hour_now',
			type : 'POST',
			dataType : "json",
			async : false,
			timeout:2000,
			data:{
				bsId:0,
				time:xh.getOneDay(),
				type:'hour'
			},
			success : function(response) {
				var data = response.time;
				var num = response.num;
				var xData=[],yData=[],yData2=[];
				
				for(var i=0;i<data.length;i++){
					xData.push(data[i].label);
					yData.push(data[i].time);
					yData2.push(num[i].num);
				}
				option.series[0].data = yData;
				option.series[1].data = yData2;
				option.xAxis[0].data = xData;
				chart.setOption(option);
				xh.maskHide();

			},
			failure : function(response) {
				xh.maskHide();
			}
		});
		
		

	});
		
	/*window.onresize = function() {
		// 重置容器高宽
		chart.resize();
	};*/
	
}
xh.waterstatus=function(id,totals){
	var vaterColor="blue";
	if(id==1){
		vaterColor="#808000";
	}else if(id==2){
		vaterColor="#00FF00";
	}else if(id==3){
		vaterColor="red";
	}
	$('#access'+id).waterbubble({
		radius : 40,
		lineWidth : 2,
		data : 0.7,
		waterColor : vaterColor,
		textColor : '#fff',
		txt : totals.toString(),
		font : 'bold 20px "Microsoft YaHei"',
		wave : true,
		animation : true
	});
}
xh.getOneDay=function()   
{   
    var   today=new Date();      
    var   yesterday_milliseconds=today.getTime();    //-1000*60*60*24

    var   yesterday=new   Date();      
    yesterday.setTime(yesterday_milliseconds);      
        
    var strYear=yesterday.getFullYear(); 

    var strDay=yesterday.getDate();   
    var strMonth=yesterday.getMonth()+1; 

    if(strMonth<10)   
    {   
        strMonth="0"+strMonth;   
    } 
    if(strDay<10){
    	strDay="0"+strDay;
    }
    var strYesterday=strYear+"-"+strMonth+"-"+strDay;   
    return  strYesterday;
}
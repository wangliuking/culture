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
var appElement = document.querySelector('[ng-controller=screen]');
var structure;
xh.load = function() {
	var app = angular.module("app", []);
	app.controller("screen", function($scope, $http) {
        //判断是否登录start
        $.ajax({
            type: 'GET',
            url: "../../getLoginUser",
            async: false,
            dataType: 'json',
            success: function(response){
                structure = response.structure;
            } ,
            error: function () {
                alert("登录已失效，请重新登录！");
                window.location.href = "../login.html";
                window.parent.location.href = "../login.html";
            }
        });
        //判断是否登录end
        xh.initTotal();
        //setInterval(xh.initTotal, 30000);

	});
};

xh.initTotal = function(){
    console.log(structure);
    $.ajax({
        url : '../../total/selectIndexData?structure='+structure,
        type : 'GET',
        dataType : "json",
        async : false,
        success : function(response) {
            var siteNum = response.siteNum;
            var rtuNum = response.rtuNum;
            var deviceTotalNum = response.deviceTotalNum;
            var rtuWarningNum = response.rtuWarningNum;
            var siteWarningTop5 = response.siteWarningTop5;
            var siteDeviceOffTop5 = response.siteDeviceOffTop5;
            var siteOff = response.siteOff;
            var data = response.num;

            $("#siteNum").html(xh.formatNum(siteNum));
            $("#rtuNum").html(xh.formatNum(rtuNum));
            $("#deviceNum").html(xh.formatNum(deviceTotalNum));
            $("#rtuOffNum").html(xh.formatNum(rtuWarningNum));

            xh.map(siteOff);
            xh.deviceWarningTop5(siteWarningTop5);
            xh.deviceOffTop5(siteDeviceOffTop5);
            xh.call(data);
            xh.waterstatus(1,0);
            xh.waterstatus(2,0);
            xh.waterstatus(3,0);
        }
    });
}

xh.map=function(data){
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
		        $.getJSON('lib/echarts/util/mapData/params/65.json',callback);
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
			                data : []
			            }
			            
			        }
			    ]
			};
		 for (var i in data) {
             option.series[0].geoCoord[data[i].site_name] = [parseFloat(data[i].site_lng), parseFloat(data[i].site_lat)];
             option.series[0].markPoint.data.push({"name":data[i].site_name});
		 }
        //option.series[0].geoCoord["1-乌鲁木齐"] = [87.68333, 43.76667];
		chart.setOption(option);
	});
	
}
xh.deviceWarningTop5=function(data){
	// 设置容器宽高
	var height=document.documentElement.clientHeight;
	var width=document.documentElement.clientWidth;
	var resizeBarContainer = function() {
		$("#deviceWarning-top5").width((width/12)*3);
		$("#deviceWarning-top5").height((height-200)/2);
	};
	resizeBarContainer();

	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	
	
	
	require([ 'echarts', 'echarts/chart/funnel' ], function(ec) {
		chart = ec.init(document.getElementById('deviceWarning-top5'));
		var leglend=[]
		/*for(var i=0;i<data.length;i++){
			leglend.push(data[i].name+"-"+data[i].value);
			data[i].name=data[i].name+"    ["+data[i].value+"]"
		}*/
		
		var option = {
			    
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c}"
			    },
			    calculable : false,
			    series : [
			              {
					            name:'设备异常',
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
xh.deviceOffTop5=function(data){
	// 设置容器宽高
	var height=document.documentElement.clientHeight;
	var width=document.documentElement.clientWidth;
	var resizeBarContainer = function() {
		$("#deviceOff-top5").width((width/12)*3);
		$("#deviceOff-top5").height((height-200)/2);
	};
	resizeBarContainer();

	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	
	
	
	require([ 'echarts', 'echarts/chart/funnel' ], function(ec) {
		chart = ec.init(document.getElementById('deviceOff-top5'));
		var leglend=[]
		/*for(var i=0;i<data.length;i++){
			leglend.push(data[i].name);
			data[i].name=data[i].name+"    ["+data[i].value+"]"
		}*/
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
			            name:'设备离线',
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
xh.call = function(data) {
    // 设置容器宽高
    var height=document.documentElement.clientHeight;
    var width=document.documentElement.clientWidth;
    var resizeBarContainer = function() {
        $("#call-bar").width((width/12)*4);
        $("#call-bar").height(height-410);
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
                data:['上报数据'],
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
            yAxis : [{
                type: 'value',
                name: '上报数据',
                min: 0,

                position: 'left',
                axisLabel: {
                    formatter: '{value} （条）',
                    textStyle:{
                        color:'#fff'
                    }
                }
            }],
            series : [{
                name:'上报数据',
                type:'line',
                yAxisIndex:0,
                itemStyle:{normal:{color:'yellow'}},
                data:[]
            }]
        };

        //start
		//var response = {"num":[{"num":1246,"label":"00"},{"num":1003,"label":"01"},{"num":453,"label":"02"},{"num":277,"label":"03"},{"num":287,"label":"04"},{"num":352,"label":"05"},{"num":542,"label":"06"},{"num":5538,"label":"07"},{"num":11388,"label":"08"},{"num":8998,"label":"09"},{"num":8441,"label":"10"},{"num":480,"label":"11"},{"num":0,"label":"12"},{"num":0,"label":"13"},{"num":0,"label":"14"},{"num":0,"label":"15"},{"num":0,"label":"16"},{"num":0,"label":"17"},{"num":0,"label":"18"},{"num":0,"label":"19"},{"num":0,"label":"20"},{"num":0,"label":"21"},{"num":0,"label":"22"},{"num":0,"label":"23"}]};
        var num = data;
        var xData=[],yData=[];

        for(var i=0;i<num.length;i++){
            xData.push(num[i].label);
            yData.push(num[i].num);
        }
        option.series[0].data = yData;
        option.xAxis[0].data = xData;
        chart.setOption(option);
		//end
        /*$.ajax({
            url : 'call/chart',
            type : 'POST',
            dataType : "json",
            async : false,
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
        });*/

        chart.setOption(option);

    });

    // 用于使chart自适应高度和宽度
    window.onresize = function() {
        // 重置容器高宽
        resizeBarContainer();
    };
};
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
xh.getOneDay=function() {
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

xh.formatNum=function(text){
    var str="";
    var a=text.toString();
    for(var i=0;i<a.length;i++){
        str+="<span>"+a.charAt(i)+"</span>";
    }
    return str;

}
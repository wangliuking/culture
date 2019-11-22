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
var loginUser;
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
                console.log("======");
                console.log(response);
                console.log("======");
                $scope.power = response;
                structure = response.structure;
                loginUser = response.username;
                connectWebSocket();
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
            var rtuList = response.rtuList;
            var siteNum = response.siteNum;
            var rtuNum = response.rtuNum;
            var deviceTotalNum = response.deviceTotalNum;
            var rtuWarningNum = response.rtuWarningNum;
            var siteWarningTop5 = response.siteWarningTop5;
            var siteDeviceOffTop5 = response.siteDeviceOffTop5;
            var siteOff = response.siteOff;
            var data = response.num;

            $("#siteNum").html(siteNum);
            $("#rtuNum").html(rtuNum);
            $("#deviceNum").html(deviceTotalNum);
            $("#rtuOffNum").html(rtuWarningNum);

            xh.deviceWarningTop5(siteWarningTop5);
            xh.deviceOffTop5(siteDeviceOffTop5);
            xh.call(data);
            xh.wechat();

            $.ajax({
                url : '../../connect/selectAllRTU?start=&limit=&structure='+structure,
                type : 'GET',
                dataType : "json",
                async : false,
                success : function(response) {
                    xh.map(response.items);
                }
            });


        }
    });
}

var provinceJson = {"北京市":11,"天津市":12,"河北省":13,"山西省":14,"内蒙古自治区":15,"辽宁省":21,"吉林省":22,"黑龙江省":23,"上海市":31,"江苏省":32,"浙江省":33,"安徽省":34,"福建省":35,"江西省":36,"山东省":37,"河南省":41,"湖北省":42,"湖南省":43,"广东省":44,"广西壮族自治区":45,"海南省":46,"重庆市":50,"四川省":51,"贵州省":52,"云南省":53,"西藏自治区":54,"陕西省":61,"甘肃省":62,"青海省":63,"宁夏回族自治区":64,"新疆维吾尔自治区":65,"台湾省":71,"香港特别行政区":81,"澳门特别行政区":82,"甘孜藏族自治州":513300,"阿坝藏族羌族自治州":513200,"绵阳市":510700,"广元市":510800,"巴中市":511900,"达州市":511700,"南充市":511300,"德阳市":510600,"遂宁市":510900,"广安市":511600,"成都市":510100,"雅安市":511800,"眉山市":511400,"资阳市":512000,"乐山市":511100,"内江市":511000,"自贡市":510300,"宜宾市":511500,"泸州市":510500,"凉山彝族自治州":513400,"攀枝花市":510400};
var cityPosition = {"北京市":["116.405289","39.904987"],"天津市":["117.190186","39.125595"],"河北省":["114.502464","38.045475"],"山西省":["112.549248","37.857014"],"内蒙古自治区":["111.751990","40.841490"],"辽宁省":["123.429092","41.796768"],"吉林省":["125.324501","43.886841"],"黑龙江省":["126.642464","45.756966"],"上海市":["121.472641","31.231707"],"江苏省":["118.76741","32.041546"],"浙江省":["120.15358","30.287458"],"安徽省":["117.283043","31.861191"],"福建省":["119.306236","26.075302"],"江西省":["115.892151","28.676493"],"山东省":["117.000923","36.675808"],"河南省":["113.665413","34.757977"],"湖北省":["114.298569","30.584354"],"湖南省":["112.982277","28.19409"],"广东省":["113.28064","23.125177"],"广西壮族自治区":["108.320007","22.82402"],"海南省":["110.199890","20.044220"],"重庆市":["106.504959","29.533155"],"四川省":["104.065735","30.659462"],"贵州省":["106.713478","26.578342"],"云南省":["102.71225","25.040609"],"西藏自治区":["91.11450","29.644150"],"陕西省":["108.948021","34.263161"],"甘肃省":["103.834170","36.061380"],"青海省":["101.777820","36.617290"],"宁夏回族自治区":["106.232480","38.486440"],"新疆维吾尔自治区":["87.616880","43.826630"],"台湾省":["121.50","25.03"],"香港特别行政区":["114.165460","22.275340"],"澳门特别行政区":["113.549130","22.198750"]};
xh.map=function(data){
	// 设置容器宽高
	var height=document.documentElement.clientHeight;
	var width=document.documentElement.clientWidth;
	var resizeBarContainer = function() {
		$("#map").width((width/12)*7);
		$("#map").height(height-200);
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
		require('echarts/util/mapData/params').params.CN = {
		    getGeoJson: function (callback) {
		        $.getJSON('lib/echarts/util/mapData/params/510500.json',callback);
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
			        formatter: function (params, ticket, callback) {
			            if(isNaN(params.name)){
                            return params.name+'<br />'+"监测点数量:"+params.value;
                        }else{
                            return params.name;
                        }
                    },
					textStyle:{
			        	color:"#fff",
						fontSize:18,
						fontWeight:"bold"
					}
			    },
			    series : [
			        {
			            name: '全国',
			            type: 'map',
			            roam: false,
			            hoverable: true,
			            mapType: 'CN',
			            itemStyle:{
			                normal:{
								borderColor:"#fff",
			                	label:{
			                		show:true,
			                		textStyle:{
			    			            color:'#fff',
			    			            fontSize:11
			    			        }
			                		} ,
			                    borderWidth:1,
			                    areaStyle:{
			                        /*color: '#1b1b1b',*/
			                        color:'#072631',
			                        visibility: 'off'
			                    },
			                    
			                    emphasis:{label:{show:true}}
			                }
			            },
			            geoCoord: {
			                
			            },
			            data:[],
			            markPoint:{
                            clickable: false,
			            	symbol:'pin',//'image://images/标注_l.png',
			               	symbolSize : function (v){
			                    return 3
			                },
			                effect : {
			                    show: false,
			                    type: "bounce"
			                },
			                itemStyle:{
			                    normal:{
                                    color:"#25deff",
									areaStyle:{
										color:"#fff",
										type:"default"
									},
			                        label:{
                                    	show:true,
										textStyle:{
                                    		color:"#fff",
											baseline:"bottom",
											fontSize:16,
											fontWeight:"bold"
										}
                                    }
			                    },
			                    emphasis: {
                                    color:"#25deff",
                                    areaStyle:{
                                        color:"#fff",
                                        type:"default"
                                    },
                                    label:{
                                        show:true,
                                        textStyle:{
                                            color:"#fff",
                                            baseline:"bottom",
                                            fontSize:16,
                                            fontWeight:"bold"
                                        }
                                    }
			                    }
			                },
			                data : []
			            }
			            
			        }
			    ]
			};
		 /*for (var i in data) {
             option.series[0].geoCoord[data[i].site_name] = [parseFloat(data[i].site_lng), parseFloat(data[i].site_lat)];
             option.series[0].markPoint.data.push({"name":data[i].site_name});
		 }*/
        /*for (var j in cityPosition) {
            option.series[0].geoCoord[j] = [cityPosition[j][0], cityPosition[j][1]];
            option.series[0].data.push({name:j,value:0});
            //option.series[0].markPoint.data.push({name:j,value:100});
        }*/
        /*option.series[0].data.push({name:"四川省",value:5});
        option.series[0].data.push({name:"成都市",value:4});
        option.series[0].data.push({name:"阿坝藏族羌族自治州",value:1});*/
        for(var i in data){
            console.log(data[i]);
            option.series[0].geoCoord[data[i].rtu_id] = [data[i].lng, data[i].lat];
            option.series[0].markPoint.data.push({name:data[i].rtu_id});
        }
		chart.setOption(option);

        //点击事件,根据点击某个省份计算出这个省份的数据
        chart.on('dblclick', function (params) {
            //console.log(params);
            var area = provinceJson[params.data.name];
            var chooseArea;

            option.series[0].data = [];
            option.series[0].data.push({name:"四川省",value:5});
            option.series[0].data.push({name:"成都市",value:4});
            option.series[0].data.push({name:"阿坝藏族羌族自治州",value:1});

            if(!area){
                chooseArea = "51";
                for(var i in data){
                    console.log(data[i]);
                    option.series[0].geoCoord[data[i].rtu_id] = [data[i].lng, data[i].lat];
                    option.series[0].markPoint.data.push({name:data[i].rtu_id});
                }
			}else{
                chooseArea = area;
                for(var i in data){
                    console.log(data[i]);
                    option.series[0].geoCoord[data[i].rtu_id] = [data[i].lng, data[i].lat];
                    option.series[0].markPoint.data.push({name:data[i].rtu_id});
                }
			}
            //逻辑控制
            chart.clear();
            require('echarts/util/mapData/params').params.CN = {
                getGeoJson: function (callback) {
                    $.getJSON('lib/echarts/util/mapData/params/'+chooseArea+'.json',callback);
                }
            }
            chart.setOption(option);
        });

	});
	
}
xh.deviceWarningTop5=function(data){

	// 设置容器宽高
	var height=document.documentElement.clientHeight;
	var width=document.documentElement.clientWidth;
	var resizeBarContainer = function() {
		$("#deviceWarning-top5").width((width/12)*2);
		$("#deviceWarning-top5").height((height-240)/2);
	};
	resizeBarContainer();

	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}
	
	require([ 'echarts', 'echarts/chart/pie' ], function(ec) {
		chart = ec.init(document.getElementById('deviceWarning-top5'));
		var leglend=[]
        if(data.length > 0){
            for(var i=0;i<data.length;i++){
                leglend.push(data[i].name);
            }
        }
		
		var option = {
            tooltip : {
                trigger: 'item',
                padding: 10,
                backgroundColor: 'rgba(9, 131, 195, 0.83)',
				position: function(a){
                	console.log(a);
                	return [a[0]*0.5,a[1]*0.5];
				},
                /*formatter: function (a) {
                    console.log(a);
                    var tempUnit = a.seriesIndex == 0?"mV":"A/m²";
                    return a.data[0] + '</br>' + a.seriesName + ':' + a.data[1] + tempUnit;
                }*/
                formatter: "{a} <br/>{b} : {c} ({d}%)",
				textStyle: {
                	color: "#fff",
					fontSize: 14,
					fontWeight: "bold"
				}
            },
            legend: {
                x: 'center',
				y: height*0.05,
				itemWidth: 20,
				itemHeight: 20,
				textStyle: {
                	color: "#fff",
					fontSize: 14,
					fontWeight: "bold"
				},
                data:leglend
            },
            calculable : true,
            series : [
                {
                    name:'异常数量',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:data,
					itemStyle: {
                    	normal: {
                    		label: {
                    			textStyle: {
                    				color: "#fff",
                    				fontSize: 14,
									fontWeight: "bold"
								}
							}
						}
					}
                }
            ]
        };
		if(data.length > 0){
            chart.setOption(option);
		}

	});
	/*window.onresize = function() {
		// 重置容器高宽
		chart.resize();
	};*/
	
}
xh.deviceOffTop5=function(data){
    //data = [{name:"管线1",value:100},{name:"管线2",value:150},{name:"管线3",value:180}]
	// 设置容器宽高
	var height=document.documentElement.clientHeight;
	var width=document.documentElement.clientWidth;
	var resizeBarContainer = function() {
		$("#deviceOff-top5").width((width/12)*2);
		$("#deviceOff-top5").height((height-200)/2);
	};
	resizeBarContainer();

	// 基于准备好的dom，初始化echarts实例
	var chart = null;
	if (chart != null) {
		chart.clear();
		chart.dispose();
	}

	require([ 'echarts', 'echarts/chart/pie' ], function(ec) {
		chart = ec.init(document.getElementById('deviceOff-top5'));
		var leglend=[]
        if(data.length > 0){
            for(var i=0;i<data.length;i++){
                leglend.push(data[i].name);
            }
        }
        var option = {
            tooltip : {
                trigger: 'item',
                padding: 10,
                backgroundColor: 'rgba(9, 131, 195, 0.83)',
                position: function(a){
                    console.log(a);
                    return [a[0]*0.5,a[1]*0.5];
                },
                formatter: "{a} <br/>{b} : {c} ({d}%)",
                textStyle: {
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: "bold"
                }
            },
            legend: {
                x: 'center',
                y: height*0.05,
                itemWidth: 20,
                itemHeight: 20,
                textStyle: {
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: "bold"
                },
                data:leglend
            },
            calculable : true,
            series : [
                {
                    name:'离线数量',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:data,
                    itemStyle: {
                        normal: {
                            label: {
                                textStyle: {
                                    color: "#fff",
                                    fontSize: 14,
                                    fontWeight: "bold"
                                }
                            }
                        }
                    }
                }
            ]
        };
        if(data.length > 0){
            chart.setOption(option);
        }

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
        $("#call-bar").width((width/12)*2.6);
        $("#call-bar").height(height-320);
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
            /*legend: {
                data:['上报数据'],
                textStyle:{
                    color:'#fff'
                }
            },*/

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
	var tColor;
	if(id==1){
		vaterColor="#28beff";
		tColor="yellow";
	}else if(id==2){
		vaterColor="#28beff";
        tColor="yellow";
	}else if(id==3){
		vaterColor="#28beff";
        tColor="yellow";
	}
	$('#access'+id).waterbubble({
		radius : 40,
		lineWidth : 2,
		data : 0.7,
		waterColor : vaterColor,
		textColor : tColor,
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
xh.wechat=function(){
    $.ajax({
        url : '../../total/getWeChatInfo',
        type : 'GET',
        dataType : "json",
        async : false,
        success : function(response) {
            console.log(response)
            xh.waterstatus(1,response.click);
            xh.waterstatus(2,response.user);
        }
    });
}

xh.formatNum=function(text){
    var str="";
    var a=text.toString();
    for(var i=0;i<a.length;i++){
        str+="<span>"+a.charAt(i)+"</span>";
    }
    return str;

}

function connectWebSocket(){
    var sid = loginUser;
    var socket;
    if (typeof(WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
    } else {
        console.log("您的浏览器支持WebSocket");
        var domain = window.location.host;
        console.log("当前域名 ： "+domain.split(":",1));
        console.log("当前sid : "+sid);
        //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
        // 等同于socket = new WebSocket("ws://localhost:8083/checkcentersys/websocket/20");
        socket = new WebSocket("ws://"+domain.split(":",1)+":8082/websocket/"+sid);
        //打开事件
        socket.onopen = function () {
            console.log("Socket 已打开");
            //socket.send("这是来自客户端的消息" + location.href + new Date());  };
            // 获得消息事件
            socket.onmessage = function (msg) {
                console.log(msg);
                if(msg.data == "existUser"){
                    alert("已有其他人登录，返回登录界面");
                    window.location.href = "login.html";
                    window.parent.location.href = "login.html";
                } else if(msg.data == "refresh"){
                    console.log("收到广播，准备刷新")
                    xh.wechat();
                }
            };
            //关闭事件
            socket.onclose = function () {
                console.log("Socket已关闭");e
            };
            //发生了错误事件
            socket.onerror = function () {
                alert("Socket发生了错误");
                //此时可以尝试刷新页面
            }
        }
    }
}
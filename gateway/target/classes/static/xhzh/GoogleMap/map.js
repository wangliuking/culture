var arr;
var map;
var initStatus=true;
var markers=[];
var count=0;
$(function(){
    initMap();
    setInterval(function() {
        initMap();
        count++;
    }, 60000);
});
function initMap(){
    var params = "init";
    var url = "../../connect/selectAllSite";
    $.ajax({
        type: 'GET',
        url: url ,
        async: false,
        data: params ,
        success: function(data){
        	console.log(data.items);
            arr=data.items;
            if(!initStatus){
                clearMarkers();
                showMarkers();
            }
            if(initStatus){
                start();
                initStatus=false;
            }
            siteForBar();
            rtuForBar();
            deviceForBar();
        } ,
        dataType: 'json'
    });
}

function start(){
	function Demo() { }  
	 Demo.prototype.tileSize = new google.maps.Size(256, 256);//瓦片大小  
	 Demo.prototype.maxZoom = 10;//允许最大缩放层级
	 Demo.prototype.minZoom = 5;//允许最小缩放层级
	 Demo.prototype.name = "地图";  
	 Demo.prototype.getTile = function (coord, zoom, ownerDocument) {  
	   var img = ownerDocument.createElement("img");  
	   img.style.width = this.tileSize.width + "px";  
	   img.style.height = this.tileSize.height + "px";  
	   //定义瓦片的相对路径  
	   var strURL = 'expotile/';
	   //其中zoom为层级，x可以理解为该瓦片在整个地图中的列数，y为行数，图片格式下载的时候选择png或者jpg，我这里是png格式  
	   strURL += zoom + "/" + coord.x + "/" + coord.y + '.png';  
	   img.src = strURL;  
	   CheckImgExists(strURL);
	   return img;  
	 };  
	 var localMap = new Demo();  

	//初始化参数
	 var myOptions = {  
	   center: new google.maps.LatLng(30.660545,104.075493), //地图中心坐标
	   zoom: 5,    //地图层级
	   mapTypeControl: true,  //默认右上角显示地图名称  
	   mapTypeControlOptions: {  
	   mapTypeIds: ['localMap'] //'satel'
	  }  
	 };  
	 //创建一个map对象，以下代码使用参数(myOptions)在<div> 元素 (id为map_canvas) 创建了一个新的地图，并默认在地图右上角显示 卫星影像和电子地图切换  
	 map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);  
	 map.mapTypes.set('localMap', localMap);  
	 map.setMapTypeId('localMap'); //设置默认显示的地图
	 
	 google.maps.event.addListener(map, 'click', function(event) {
		  console.log(event.latLng);
		 });
	 
	 //显示marker函数
	 showMarkers();
}

function showMarkers(){

    for(var i=0;i<arr.length;i++){
        var wgloc={};
        //wgloc.lat=arr[i].site_lat;//纬度
        //wgloc.lng=arr[i].site_lng;//经度
        //var lat=transformFromWGSToGCJ(wgloc).lat;
        //var lng=transformFromWGSToGCJ(wgloc).lng;

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(arr[i].site_lat,arr[i].site_lng),
            map: map,
            title:arr[i].site_name,
            icon: '../iconfont/marker_connect.png',
            text: arr[i].site_name
            //animation:google.maps.Animation.DROP
        });
        markers.push(marker);
        attachSecretMessage(marker, i);
    }
}

function attachSecretMessage(marker, i) {
    //定义显示内容，可以使用html标签显示内容效果
    var infowindow = new google.maps.InfoWindow({
        content: '<div>'+'<p>当前用户：'+arr[i].site_name+'</p>'+'<p>纬度：'+arr[i].site_lat+'</p>'+'<p>经度：'+arr[i].site_lng+'</p>'+'</div>', //显示内容
        maxWidth:50, //定义最大宽度
        maxHeight:60
    });

    //点击Maker标注显示InfoWindow
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
    });
}

function clearMarkers(){
    for(var i=0;i<markers.length;i++){
        markers[i].setMap(null);
    }
    markers=[];
}

function CheckImgExists(imgurl) {
    $('img').error(function(){
        $(this).attr('src', "mapfiles/maperror.png");
    });

}

//偏移算法
var pi = 3.14159265358979324;

//
// Krasovsky 1940
//
// a = 6378245.0, 1/f = 298.3
// b = a * (1 - f)
// ee = (a^2 - b^2) / a^2;
var a = 6378245.0;
var ee = 0.00669342162296594323;

function outOfChina(lat, lon){
    if (lon < 72.004 || lon > 137.8347)
        return 1;
    if (lat < 0.8293 || lat > 55.8271)
        return 1;
    return 0;
}
function transformLat(x,y){
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(x > 0 ? x:-x);
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 *Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}
function transformLon(x,y){
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(x > 0 ? x:-x);
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}
function transformFromWGSToGCJ(wgLoc)
{
    var mgLoc ={};
    mgLoc.lat = 0;
    mgLoc.lng = 0;
    if (outOfChina(wgLoc.lat, wgLoc.lng))
    {
        mgLoc = wgLoc;
        return mgLoc;
    }
    var dLat = transformLat(wgLoc.lng - 105.0, wgLoc.lat - 35.0);
    var dLon = transformLon(wgLoc.lng - 105.0, wgLoc.lat - 35.0);

    var radLat = wgLoc.lat / 180.0 * pi;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    mgLoc.lat = wgLoc.lat + dLat;
    mgLoc.lng = wgLoc.lng + dLon;

    return mgLoc;
}

//使用方法
/*var wgloc={};
wgloc.lat=data[i].lat;//纬度
wgloc.lng=data[i].lon;//经度
var lat=transformFromWGSToGCJ(wgloc).lat;
var lng=transformFromWGSToGCJ(wgloc).lng;*/

//站点统计图
function siteForBar() {
    // 基于准备好的dom，初始化echarts实例 macarons
    var myChart = echarts.init(document.getElementById('leftsideOne'));
    myChart.showLoading();

    // 指定图表的配置项和数据
    var option = {
        color:['#00CD66', '#FFD700','#DCDCDC'],
        title : {
            text: '站点统计情况',
            textStyle: {
                color : 'white'
            },
            //subtext: '纯属虚构',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            textStyle : {
                color : 'white'
            },
            orient: 'vertical',
            left: 'left',
            data: ['站点正常','站点异常','站点离线']
        },
        series : [
            {
                textStyle : {
                    color : 'white'
                },
                name: '统计数量',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'站点正常'},
                    {value:310, name:'站点异常'},
                    {value:234, name:'站点离线'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    myChart.hideLoading();
}

//rtu统计图
function rtuForBar() {
    // 基于准备好的dom，初始化echarts实例
    $("#rtuForBar").width($("#siteStatus").width());
    var myChart = echarts.init(document.getElementById('leftsideTwo'));

    // 指定图表的配置项和数据
    var option = {
        color:['#00CD66', '#FFD700','#DCDCDC'],
        title : {
            text: 'RTU统计情况',
            textStyle: {
                color : 'white'
            },
            //subtext: '纯属虚构',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            textStyle : {
                color : 'white'
            },
            orient: 'vertical',
            left: 'left',
            data: ['RTU正常','RTU异常','RTU离线']
        },
        series : [
            {
                name: '统计数量',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:390, name:'RTU正常'},
                    {value:288, name:'RTU异常'},
                    {value:330, name:'RTU离线'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//设备统计图
function deviceForBar() {
    // 基于准备好的dom，初始化echarts实例
    $("#deviceForBar").width($("#siteStatus").width());
    var myChart = echarts.init(document.getElementById('leftsideThree'));

    // 指定图表的配置项和数据
    var option = {
        color:['#00CD66', '#FFD700','#DCDCDC'],
        title : {
            text: '设备统计情况',
            textStyle: {
                color : 'white'
            },
            //subtext: '纯属虚构',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            textStyle : {
                color : 'white'
            },
            orient: 'vertical',
            left: 'left',
            data: ['设备正常','设备异常','设备离线']
        },
        series : [
            {
                name: '统计数量',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:209, name:'设备正常'},
                    {value:220, name:'设备异常'},
                    {value:234, name:'设备离线'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
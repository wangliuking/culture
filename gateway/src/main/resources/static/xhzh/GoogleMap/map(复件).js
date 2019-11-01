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
	}, 20000);
});
function initMap(){
	var params = "init";
	var url = "../talk/toJSON";
	$.ajax({
	    type: 'POST',
	     url: url ,
	   async: false,
	    data: params ,
	 success: function(data){
	    	arr=data;
	    	if(!initStatus){
	    		 clearMarkers();
	    		 showMarkers();
	    	}	
	    	if(initStatus){
	    		start();
	    		initStatus=false;
	    	}	    	    	    	
	    } ,
	    dataType: 'json'
	});
}

function start(){
	function Demo() { }  
	 Demo.prototype.tileSize = new google.maps.Size(256, 256);//瓦片大小  
	 Demo.prototype.maxZoom = 18;//允许最大缩放层级  
	 Demo.prototype.minZoom = 10;//允许最小缩放层级  
	 Demo.prototype.name = "地图";  
	 Demo.prototype.getTile = function (coord, zoom, ownerDocument) {  
	   var img = ownerDocument.createElement("img");  
	   img.style.width = this.tileSize.width + "px";  
	   img.style.height = this.tileSize.height + "px";  
	   //定义瓦片的相对路径  
	   var strURL = 'http://localhost:8080/expotile/GOOGLE/';  
	   //其中zoom为层级，x可以理解为该瓦片在整个地图中的列数，y为行数，图片格式下载的时候选择png或者jpg，我这里是png格式  
	   strURL += zoom + "/" + coord.x + "/" + coord.y + '.png';  
	   img.src = strURL;  
	   CheckImgExists(strURL);
	   return img;  
	 };  
	 var localMap = new Demo();  

	//初始化参数
	 var myOptions = {  
	   center: new google.maps.LatLng(28.662604,87.13192), //地图中心坐标  
	   zoom: 10,    //地图层级  
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
		wgloc.lat=arr[i].latitude;//纬度
		wgloc.lng=arr[i].longitude;//经度
		var lat=transformFromWGSToGCJ(wgloc).lat;
		var lng=transformFromWGSToGCJ(wgloc).lng;
		
		 var marker = new google.maps.Marker({  
		     position: new google.maps.LatLng(lat,lng-0.0064),
		     map: map,  
		     title:arr[i].userName,
		     animation:google.maps.Animation.DROP
		 });
		 markers.push(marker);
		 attachSecretMessage(marker, i);
	 }	
}

function attachSecretMessage(marker, i) {
	//定义显示内容，可以使用html标签显示内容效果   
	 var infowindow = new google.maps.InfoWindow({  
	     content: '<div>'+'<p>当前用户：'+arr[i].userName+'</p>'+'<p>纬度：'+arr[i].latitude+'</p>'+'<p>经度：'+arr[i].longitude+'</p>'+'</div>', //显示内容  
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
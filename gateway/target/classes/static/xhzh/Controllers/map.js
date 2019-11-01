/**
 * 系统首页地图模式
 */
if (!("xh" in window)) {
	window.xh = {};
};
var map = null;
var img = null;
var markers = [];
function LocalMapType() {
}
LocalMapType.prototype.tileSize = new google.maps.Size(256, 256);
LocalMapType.prototype.maxZoom = 15; // 地图显示最大级别
LocalMapType.prototype.minZoom = 9; // 地图显示最小级别
LocalMapType.prototype.name = "本地地图";
LocalMapType.prototype.alt = "显示本地地图数据";
LocalMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
	img = ownerDocument.createElement("img");
	img.style.width = this.tileSize.width + "px";
	img.style.height = this.tileSize.height + "px";
	img.style.border = 0;
	// 地图存放路径
	// 谷歌矢量图 maptile/googlemaps/roadmap
	// 谷歌影像图 maptile/googlemaps/roadmap
	// MapABC地图 maptile/mapabc/
	// strURL = "maptile/googlemaps/roadmap/";

	mapPicDir = "maptile/googlemaps/roadmap/";
	var curSize = Math.pow(2, zoom);
	strURL = mapPicDir + zoom + "/" + (coord.x % curSize) + "/"
			+ (coord.y % curSize) + ".png";
	// strURL = "E:/地图文件/谷歌地图中国0-12级googlemaps/googlemaps/roadmap/" + zoom +
	// "/" + (coord.x % curSize )+ "/" + (coord.y % curSize)+ ".PNG";

	img.src = strURL;
	img.alt = "" + "没有地图数据";
	CheckImgExists(strURL);
	img.onerror = "this.src='Resources/images/img/maperror.png'";
	return img;
};
// 检查图片是否存在

function CheckImgExists(imgurl) {
	$('img').error(function() {
		$(this).attr('src', "Resources/images/img/maperror.png");
	});
}

//为右侧选择定位基站绑定点击事件
function aClick(a){
	$.ajax({
		type : "GET",
		url : "bs/map/dataById?bsId=" +a,
		dataType : "json",
		success : function(dataById) {
			var datatemp = dataById.items;
			var data = datatemp[0];
			var lat = data.lat;
			var lng = data.lng;
			var bsId = data.bsId;
			xh.loadMap(lat,lng,bsId);
		}
	});
}

//地图加载
xh.loadMap = function(lat,lng,bsId) {
	var temp =[lat,lng];
	$.ajax({
		type : "GET",
		url : "bs/map/data",
		dataType : "json",
		success : function(dataMap) {
			var data = dataMap.items;		
			xh.initialize(data,temp,bsId);
		}
	});
	var app = angular.module("app", []);
	app.controller("map", function($scope, $http) {
	});
};
var temp_c=9;
xh.initialize = function(data,temp,bsId) {
	var a=0;
	var b=0;
	var c=0;
	if(temp!=","){
		a=temp[0];
		b=temp[1];
		c=15;
	}else if(temp==","){
		a=data[0].lat;
		b=data[0].lng;
		c=temp_c;
	}
		var myLatlng = new google.maps.LatLng(a, b);
		var localMapType = new LocalMapType();
		var mapOptions = {
			zoom : c,
			center : myLatlng,
			disableDefaultUI : true,
			mapTypeControl : true,
			mapTypeControlOptions : {
				style : google.maps.MapTypeControlStyle.DEFAULT,
				mapTypeIds : [
				/* google.maps.MapTypeId.ROADMAP, */
				/*
				 * google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.SATELLITE,
				 */
				/* google.maps.MapTypeId.TERRAIN, */'localMap' ]
			// 定义地图类型
			},
			panControl : true,
			zoomControl : true, // 缩放控件
			mapTypeControl : true,
			scaleControl : false,// 尺寸
			streetViewControl : false, // 小人
			rotateControl : false,
			overviewMapControl : false,
			zoomControlOptions : {
				style : google.maps.ZoomControlStyle.SMALL
			},
		};	
	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
	map.mapTypes.set('localMap', localMapType); // 绑定本地地图类型
	map.setMapTypeId('localMap'); // 指定显示本地地图
	map.setOptions({
		draggable : true
	});
	// 地图层级变动时显示或隐藏部分基站：
	google.maps.event.addListener(map, 'zoom_changed', function(event) {
		/*
		 * document.getElementById("showZoom").innerHTML = " 缩放级别：" +
		 * map.getZoom();
		 */
		if(map.getZoom()==10){
			temp_c=map.getZoom();
			xh.loadMap();			
		}else if(map.getZoom()==9){
			temp_c=map.getZoom();
			xh.loadMap();
		}
	});
	/*
	 * 显示所有基站数据
	 */
	var marker, i;
	var markers = [];
	for (i = 0; i < data.length; i++) {
		var temp = 0;
		//判断三期还是四期基站
		if(data[i].bsId<200){
			//三期基站
			//判断基站是连接还是断开
			if(data[i].status==0){
				temp = "bluesky/3_break.gif";
			}else if(data[i].status==1){
				//判断基站告警的级别
				if(typeof(data[i].alarmLevel)==="undefined"){
					temp = "bluesky/3_contact.png";
				}else if(data[i].alarmLevel==1){
					temp = "bluesky/3_normal.gif";
				}else if(data[i].alarmLevel==2){
					temp = "bluesky/3_warning.gif";
				}else if(data[i].alarmLevel==3){
					temp = "bluesky/3_urgent.gif";
				}
			}else if(data[i].status==2){
				temp = "bluesky/3_unuse.gif";
			}
		}else if(data[i].bsId>=200 && data[i].bsId<400){
			//根据地图层级显示或隐藏部分基站
			if(map.getZoom()>9){
				//四期基站
				//判断基站是连接还是断开
				if(typeof(data[i].status)==="undefined"){
					temp = "bluesky/4_break.gif";
				}else if(data[i].status==1){
					//判断基站告警的级别
					if(typeof(data[i].alarmLevel)==="undefined"){
						temp = "bluesky/4_contact.png";
					}else if(data[i].alarmLevel==1){
						temp = "bluesky/4_normal.gif";
					}else if(data[i].alarmLevel==2){
						temp = "bluesky/4_warning.gif";
					}else if(data[i].alarmLevel==3){
						temp = "bluesky/4_urgent.gif";
					}
				}else if(data[i].status==2){
					temp = "bluesky/4_unuse.gif";
				}
			}else if(map.getZoom()<=9){
				temp='';
			}
			
		}
		
		if(typeof(bsId)==="undefined"){
			marker = new google.maps.Marker({
				position : new google.maps.LatLng(data[i].lat, data[i].lng),
				map : map,
				icon : temp
			});
			markers[i] = marker;
			attachSecretMessage(marker, i, data, bsId);
		}else{
			if(data[i].bsId==bsId){
				marker = new google.maps.Marker({
					position : new google.maps.LatLng(data[i].lat, data[i].lng),
					map : map,
					icon : temp,
					draggable:true
				});
				markers[i] = marker;
				attachSecretMessage(marker, i, data, bsId);
			}else{
				marker = new google.maps.Marker({
					position : new google.maps.LatLng(data[i].lat, data[i].lng),
					map : map,
					icon : temp
				});
				markers[i] = marker;
				attachSecretMessage(marker, i, data, bsId);
			}
			
		}
	}
	
	function attachSecretMessage(marker, i, data, bsId) {
		// 定义显示内容，可以使用html标签显示内容效果
		var message = '<p>基站id：' + data[i].bsId + '</p>' + '<p>' + data[i].name + '</p>' + '<p>纬度：'
				+ data[i].lat + '</p>' + '<p>经度：' + data[i].lng + '</p>';
		var infowindow = new google.maps.InfoWindow({
			content : message,
			maxWidth : 110,
			maxHeight : 70
		});
		google.maps.event.addListener(marker, 'click', function() {
			/* 基站图标设置模态框并获取显示数据 */
			$('#myModal').modal();
			$.ajax({
				type : "GET",
				url : "bs/map/dataById?bsId=" + data[i].bsId,
				dataType : "json",
				success : function(dataById) {
					var dataTemp = dataById.items;
					var data = dataTemp[0];
					$('#bsId').val(data.bsId);
					$('#bsName').val(data.name);
					$('#lat').val(data.lat);
					$('#lng').val(data.lng);
					$('#address').val(data.address);
					$('#ip').val(data.ip);
					if (data.contact == '') {
						$('#contact').val("暂无相关信息");
					} else if (data.tel == 0) {
						$('#contact').val(data.contact + " 暂无电话");
					} else {
						$('#contact').val(data.contact + " " + data.tel);
					}
					$('#chnumber').val(data.chnumber);
					$('#gpsLineNum').val(data.gpsLineNum);
					$('#power').val(data.power);
					$('#carrier').val(data.carrier);
					$('#height').val(data.height);
					$('#lineHeight').val(data.lineHeight);
					if(data.status == ''){
						$('#status').val("暂无相关信息");
					}else if(data.status == 0){
						$('#status').val("断开");
					}else if(data.status == 1){
						$('#status').val("正常");
					}else if(data.status == 2){
						$('#status').val("未启用");
					}
					//动环数据展示
					var move = dataById.moveController;
					var j;
					var tempData=[];
					for(j=0;j<move.length;j++){
						if(j>3 && j<6){
							tempCharts(j,move[j]);
						}else if(j>5 && j<8){
							tempData[j-6]=move[j];
						}else if(j==8){
							tempData[2]=move[j];
							tempCharts(j,tempData);
						}else if(j<4){
							$('#temp_'+j).val(move[j].sig_value);
						}						
					}

				}
			});
		});
		google.maps.event.addListener(marker, 'mouseover', function() {
			infowindow.open(map, marker);
		});
		google.maps.event.addListener(marker, 'mouseout', function() {
			infowindow.close(map, marker);
		});
		if(data[i].bsId==bsId){
			infowindow.open(map, marker);
		}	
	}
	
	// 每次隐藏时，清除数据。确保点击时，重新加载
	$(function() {
		$("#myModal").on("hidden.bs.modal", function() {
			$(this).removeData("bs.modal");
		});
	});

	/*
	 * marker.setMap(map);//将定义的标注显示在地图上
	 * 
	 */
	/* marker.addListener('click', toggleBounce); */
	/*
	 * map.addListener('click', function(event) { addMarker(event.latLng); });
	 */
	// 鼠标移动获取经纬度坐标
	google.maps.event.addListener(map, 'mousemove', function(event) {
		
		 document.getElementById("showLatlng").innerHTML = "经度：" +
		 event.latLng.lng() + ',纬度：' + event.latLng.lat();
		 
	});

	/*
	 * google.maps.event.addListener(marker, 'click', function() { alert(1) });
	 */

}
function toggleBounce() {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}
// Adds a marker to the map and push to the array.
function addMarker(location) {
	var marker = new google.maps.Marker({
		position : location,
		map : map
	});
	markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
	setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
	setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
	clearMarkers();
	markers = [];
}

function drop() {
	for (var i = 0; i < markerArray.length; i++) {
		setTimeout(function() {
			addMarkerMethod();
		}, i * 200);
	}
}
var pi = 3.14159265358979324;

//
// Krasovsky 1940
//
// a = 6378245.0, 1/f = 298.3
// b = a * (1 - f)
// ee = (a^2 - b^2) / a^2;
var a = 6378245.0;
var ee = 0.00669342162296594323;

function outOfChina(lat, lon) {
	if (lon < 72.004 || lon > 137.8347)
		return 1;
	if (lat < 0.8293 || lat > 55.8271)
		return 1;
	return 0;
}
function transformLat(x, y) {
	var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2
			* Math.sqrt(x > 0 ? x : -x);
	ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
	ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
	return ret;
}
function transformLon(x, y) {
	var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1
			* Math.sqrt(x > 0 ? x : -x);
	ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
	ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
	return ret;
}
function transformFromWGSToGCJ(wgLoc) {
	var mgLoc = {};
	mgLoc.lat = 0;
	mgLoc.lng = 0;
	if (outOfChina(wgLoc.lat, wgLoc.lng)) {
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

/*
 * //定义一个点坐标数组变量，将所有点从头到尾连成一条线 var flightPlanCoordinates = [ new
 * google.maps.LatLng(37.772323, -122.214897), new google.maps.LatLng(21.291982,
 * -157.821856), new google.maps.LatLng(-18.142599, 178.431), new
 * google.maps.LatLng(-27.46758, 153.027892) ]; var flightPath = new
 * google.maps.Polyline({ path: flightPlanCoordinates,//相应点坐标 strokeColor:
 * "#FF0000",//定义线条颜色 strokeOpacity: 1.0, //线条透明的 取值0~1.0之间，由完全透明到不透明
 * strokeWeight: 2 //线条粗细，单位为px }); flightPath.setMap(map);//将线条显示在地图上
 */
// 绘制多边形
// 定义一个点坐标数组变量，将所有点从头到尾连成一条线
/*
 * var flightPlanCoordinates = [ new google.maps.LatLng(37.772323, -122.214897),
 * new google.maps.LatLng(21.291982, -157.821856), new
 * google.maps.LatLng(-18.142599, 178.431), new google.maps.LatLng(-27.46758,
 * 153.027892) ]; var flightPath = new google.maps.Polyline({ path:
 * flightPlanCoordinates,//相应点坐标 strokeColor: "#FF0000",//定义线条颜色 strokeOpacity:
 * 1.0, //线条透明的 取值0~1.0之间，由完全透明到不透明 strokeWeight: 2 //线条粗细，单位为px });
 * flightPath.setMap(map);//将线条显示在地图上
 */

/*
 * var infowindow = new google.maps.InfoWindow({ content: contentString, //显示内容
 * maxWidth:400 //定义最大宽度 }); var marker = new google.maps.Marker({ position: new
 * google.maps.LatLng(27.56,104.252), map: map, title:"重庆解放碑" });
 * //点击Maker标注显示InfoWindow google.maps.event.addListener(marker, 'click',
 * function() { infowindow.open(map,marker); });
 */

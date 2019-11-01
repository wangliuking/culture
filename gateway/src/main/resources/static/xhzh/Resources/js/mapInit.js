
var app = angular.module("app", []);
var appElement = document.querySelector('[ng-controller=map]');
app.filter('power', function() { // 可以注入依赖
	return function(text) {
		return text - 15;
	};
});
app.filter('timeFormate', function() { // 可以注入依赖
	return function(text) {
		return xh.secondsFormatDay(text);
	};
});
app.filter('freqFormat', function() { // 可以注入依赖
	return function(text) {
		/*console.log("频点："+parseInt(text))*/
		
		if(parseInt(text)>0){
			var fr=(parseInt(text)/1000000).toFixed(6)+"MHz";
			return fr
		}else{
			return "";
		}
	};
});
app.filter('retLoss',function(){
	return function(text){
		if(text>0){
			return text+'db';
		}else{
			return "";
		}
	}
})
app.filter('fwdPa',function(){
	return function(text){
		if(text>0){
			return text+'db';
		}else{
			return "";
		}
	}
})
app.config([ '$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode({
		enabled : true,
		requireBase : false
	});
} ]);
app.controller("map", function($scope, $http) {
	/**
	 * 首页弹出模态框数据获取和设置start
	 */
	$scope.count = "10";
	$scope.bsInformation = function() {
		var bsId = $scope.bsId;
		$http.get("bs/map/dataById?bsId=" + bsId).success(
				function(response) {
					$scope.bsinfoData = response.items[0];
				});
	};
	
	// 基站下的bsc状态
	$scope.bsc = function() {
		var bsId = $scope.bsId;
		$http.get("bsstatus/bsc?bsId=" + bsId).success(
				function(response) {
					$scope.bscData = response.items;
					$scope.bscTotals = response.totals;
					
					var record=0;
					for(var i=0;i<$scope.bscTotals;i++){
						if($scope.bscData[i].Id<=2 && $scope.bscData[i].online!=2){
							record++;
						}
					}
				
				   $scope.bscExists=record;
					
					
					
				});
	};
	// 基站下的bsr状态
	$scope.bsr = function() {
		var bsId = $scope.bsId;
		$http.get("bsstatus/bsr?bsId=" + bsId).success(
				function(response) {
					$scope.bsrData = response.items;
					$scope.bsrTotals = response.totals;
				});
	};
	// 基站下的dpx状态
	$scope.dpx = function() {
		var bsId = $scope.bsId;
		$http.get("bsstatus/dpx?bsId=" + bsId).success(
				function(response) {
					$scope.dpxData = response.items;
					$scope.dpxTotals = response.totals;
				});
	};
	// 基站下的psm状态
	$scope.psm = function() {
		var bsId = $scope.bsId;
		$http.get("bsstatus/psm?bsId=" + bsId).success(
				function(response) {
					$scope.psmData = response.items;
					$scope.psmTotals = response.totals;
				});
	};
	// 根据基站ID查找基站相邻小区
	$scope.neighborByBsId = function() {
		var bsId = $scope.bsId;
		$http.get("bs/neighborByBsId?bsId=" + bsId).success(
				function(response) {
					$scope.neighborData = response.items;
					$scope.neighborTotals = response.totals;
				});
	};
	// 根据基站ID查找基站切换参数
	$scope.handoverByBsId = function() {
		var bsId = $scope.bsId;
		$http.get("bs/handoverByBsId?bsId=" + bsId).success(
				function(response) {
					$scope.handoverData = response.items;
					$scope.handoverTotals = response.totals;
				});
	};
	// 根据基站ID查找基站BSR配置信息
	$scope.bsrconfigByBsId= function() {
		var bsId = $scope.bsId;
		$http.get("bs/bsrconfigByBsId?bsId=" + bsId).success(
				function(response) {
					$scope.bsrconfigData = response.items;
					$scope.bsrconfigTotals = response.totals;
				});
	};
	// 根据基站ID查找基站传输配置信息
	$scope.linkconfigByBsId = function() {
		var bsId = $scope.bsId;
		$http.get("bs/linkconfigByBsId?bsId=" + bsId).success(
				function(response) {
					$scope.linkconfigData = response.items;
					$scope.linkconfigTotals = response.totals;
				});
	};

	$scope.equip = function() {
		$scope.bsc();
		$scope.bsr();
		$scope.dpx();
		$scope.psm();
	};
	//基站配置参数
	$scope.config = function() {
		$scope.neighborByBsId();
		$scope.handoverByBsId();
		$scope.bsrconfigByBsId();
		$scope.linkconfigByBsId();
	};
	// 基站下的注册终端
	$scope.radioUser = function() {
		var bsId = $scope.bsId;
		frist = 0;
		var pageSize =  $("#page-limit").val();
		$http.get(
				"radio/status/oneBsRadio?bsId=" + bsId
						+ "&start=0&limit=" + pageSize).success(
				function(response) {
					$scope.radioData = response.items;
					$scope.radioTotals = response.totals;
					xh.pagging(1, parseInt($scope.radioTotals), $scope);
				});
	};
	// 基站下的注册组
	$scope.bsGroup = function() {
		var bsId = $scope.bsId;
		frist = 0;
		var pageSize = $("#page-limit-group").val();
		$http.get(
				"radio/status/oneBsGroup?bsId=" + bsId
						+ "&start=0&limit=" + pageSize).success(
				function(response) {
					$scope.groupData = response.items;
					$scope.groupTotals = response.totals;
					xh.groupPagging(1, parseInt($scope.groupTotals), $scope);
				});
	};
	$scope.business=function(){
		$scope.radioUser();
		$scope.bsGroup();
	};
	
	/**
	 * 首页弹出模态框数据获取和设置end
	 */
	$scope.countChoose = "10";
	$http.get("bs/map/area").success(
			function(response) {
				$scope.data = response.items;
			});
	$http.get("bs/map/level").success(
			function(response) {
				$scope.levelData = response.items;
			});
	$http.get("amap/map/road").success(
			function(response) {			
				$scope.roadData = response.items;
			});
	/* 级别和区域选择 */
	var level={
			"1":{"lat":"30.6670418358257","lng":"104.07508986582853","zoom":"3"},
			"2":{"lat":"30.69982302288963","lng":"104.06099782211035","zoom":"3"},
			"3":{"lat":"30.694667397139078","lng":"104.04991322674667","zoom":"2"}
	}
	var area={
			"简阳":{"lat":"30.41963624512105","lng":"104.54442366332056","zoom":"3"},
			"双流":{"lat":"30.537055621589893","lng":"103.93902430956187","zoom":"3"},
			"都江堰":{"lat":"31.041683973699183","lng":"103.62070738301315","zoom":"3"},
			"天府新区":{"lat":"30.406854589614476","lng":"104.08540111732965","zoom":"3"},
			"温江":{"lat":"30.71928551009797","lng":"103.82968208010224","zoom":"3"},
			"龙泉驿":{"lat":"30.603112076518848","lng":"104.29987514855263","zoom":"3"},
			"金堂":{"lat":"30.73097159513254","lng":"104.59133985765051","zoom":"3"},
			"青白江":{"lat":"30.789402020305467","lng":"104.34112015455703","zoom":"3"},
			"新都":{"lat":"30.833396693376862","lng":"104.13489512453494","zoom":"3"},
			"彭州":{"lat":"31.13998457134305","lng":"103.89636150647604","zoom":"3"},
			"郫都区":{"lat":"30.839583444277523","lng":"103.88433171305809","zoom":"3"},
			"崇州":{"lat":"30.644357082523264","lng":"103.64957888721625","zoom":"3"},
			"大邑":{"lat":"30.60998624418625","lng":"103.36705059608597","zoom":"3"},
			"邛崃":{"lat":"30.39070029559608","lng":"103.38079893142077","zoom":"3"},
			"蒲江":{"lat":"30.23775006499635","lng":"103.48941078056576","zoom":"3"},
			"新津":{"lat":"30.427820801000056","lng":"103.81799599506768","zoom":"3"},
			"高新区":{"lat":"30.56369302130108","lng":"104.06275932757514","zoom":"4"},
			"成华区":{"lat":"30.692648110386774","lng":"104.14297227154415","zoom":"4"},
			"武侯区":{"lat":"30.62682795497139","lng":"104.0120193774801","zoom":"4"},
			"金牛区":{"lat":"30.739048742141744","lng":"104.05481107120971","zoom":"4"},
			"锦江区":{"lat":"30.606052640069976","lng":"104.11650672602464","zoom":"4"},
			"青羊区":{"lat":"30.680736466725598","lng":"103.98889424781146","zoom":"4"},
			"金牛区":{"lat":"30.73784576279995","lng":"104.05910742600184","zoom":"4"}		
	};
	$scope.bothChoose=function(params){
		if ($(".levelChoose input[value="+params+"]").prop("checked") == true || $(".areaChoose input[value="+params+"]").prop("checked") == true) {
			console.log("param1为： "+params);
			var t=[];
			$(".levelChoose input:checked").each(function(i){
				t.push($(this).val());
			});
			var z=[];
			$(".areaChoose input:checked").each(function(i){
				z.push($(this).val());
			});
			$http.get("amap/map/bsByBoth?level="+t+"&zone="+z).success(
					function(response) {
						//判断是级别还是区域
						if(!isNaN(params)){
							var tempD = response.items;	
							console.log(response);
							var tempData = dataWithoutZero(tempD);
							
							//首页下方数据展示start
							var a = z.join(",");
							var b = t.join(",");
							$scope.areaDataZone = a;
							$scope.areaDataNum = tempData.length;
							$scope.areaDataLevel = b;
							$('#areaTable').show();
							//首页下方数据展示end
							var point = new esri.geometry.Point(level[params].lng*1, level[params].lat*1,new esri.SpatialReference({wkid:parseInt(4490)}));
							myMap.centerAndZoom(point,level[params].zoom*1);
							option.series[0].markPoint.data=baseMark(tempData)[0];
							option.series[1].markPoint.data=baseMark(tempData)[1];
							option.series[2].markPoint.data=baseMark(tempData)[2];
							option.series[3].markPoint.data=baseMark(tempData)[3];
							option.series[4].markPoint.data=baseMark(tempData)[4];
							option.series[5].markPoint.data=baseMark(tempData)[5];
							option.series[6].markPoint.data=flashMark(tempData);//闪烁效果
							overlay.setOption(option);
						}else{
							var tempD = response.items;	
							var tempData = dataWithoutZero(tempD);
							var tempArr = [];
							for(var i=0;i<tempData.length;i++){
								var temp = tempData[i].lng+","+tempData[i].lat;
								tempArr.push(temp);
							}
							console.log(tempArr);
							//首页下方数据展示start
							var a = z.join(",");
							var b = t.join(",");
							$scope.areaDataZone = a;
							$scope.areaDataNum = tempData.length;
							$scope.areaDataLevel = b;
							$('#areaTable').show();
							//首页下方数据展示end
							var point = new esri.geometry.Point(area[params].lng*1, area[params].lat*1,new esri.SpatialReference({wkid:parseInt(4490)}));
							myMap.centerAndZoom(point,area[params].zoom*1);
							option.series[0].markPoint.data=baseMark(tempData)[0];
							option.series[1].markPoint.data=baseMark(tempData)[1];
							option.series[2].markPoint.data=baseMark(tempData)[2];
							option.series[3].markPoint.data=baseMark(tempData)[3];
							option.series[4].markPoint.data=baseMark(tempData)[4];
							option.series[5].markPoint.data=baseMark(tempData)[5];
							option.series[6].markPoint.data=flashMark(tempData);//闪烁效果
							overlay.setOption(option);
							areaRingsData(params);
						}					
					});
		} else {
			console.log("param2为： "+params);
			var t=[];
			$(".levelChoose input:checked").each(function(i){
				t.push($(this).val());
			});
			var z=[];
			$(".areaChoose input:checked").each(function(i){
				z.push($(this).val());
			});
			if(t.length==0 && z.length==0){
				$http.get("amap/map/gisViewByUserIdForShow").success(
						function(response) {
							var tempD = response.items;	
							var tempData = dataWithoutZero(tempD);
							option.series[0].markPoint.data=baseMark(tempData)[0];
							option.series[1].markPoint.data=baseMark(tempData)[1];
							option.series[2].markPoint.data=baseMark(tempData)[2];
							option.series[3].markPoint.data=baseMark(tempData)[3];
							option.series[4].markPoint.data=baseMark(tempData)[4];
							option.series[5].markPoint.data=baseMark(tempData)[5];
							option.series[6].markPoint.data=flashMark(tempData);//闪烁效果
							overlay.setOption(option);
							if(isNaN(params)){
								areaRingsClear(params);
							}
							$('#areaTable').hide();
						});
			}else{
				$http.get("amap/map/bsByBoth?level="+t+"&zone="+z).success(
						function(response) {
							//判断是级别还是区域
							if(!isNaN(params)){
								var tempD = response.items;	
								var tempData = dataWithoutZero(tempD);
								//首页下方数据展示start
								var a = z.join(",");
								var b = t.join(",");
								$scope.areaDataZone = a;
								$scope.areaDataNum = tempData.length;
								$scope.areaDataLevel = b;
								$('#areaTable').show();
								//首页下方数据展示end
								var point = new esri.geometry.Point(level[params].lng*1, level[params].lat*1,new esri.SpatialReference({wkid:parseInt(4490)}));
								myMap.centerAndZoom(point,level[params].zoom*1);
								option.series[0].markPoint.data=baseMark(tempData)[0];
								option.series[1].markPoint.data=baseMark(tempData)[1];
								option.series[2].markPoint.data=baseMark(tempData)[2];
								option.series[3].markPoint.data=baseMark(tempData)[3];
								option.series[4].markPoint.data=baseMark(tempData)[4];
								option.series[5].markPoint.data=baseMark(tempData)[5];
								option.series[6].markPoint.data=flashMark(tempData);//闪烁效果
								overlay.setOption(option);
							}else{
								var tempD = response.items;	
								var tempData = dataWithoutZero(tempD);
								//首页下方数据展示start
								var a = z.join(",");
								var b = t.join(",");
								$scope.areaDataZone = a;
								$scope.areaDataNum = tempData.length;
								$scope.areaDataLevel = b;
								$('#areaTable').show();
								//首页下方数据展示end
								option.series[0].markPoint.data=baseMark(tempData)[0];
								option.series[1].markPoint.data=baseMark(tempData)[1];
								option.series[2].markPoint.data=baseMark(tempData)[2];
								option.series[3].markPoint.data=baseMark(tempData)[3];
								option.series[4].markPoint.data=baseMark(tempData)[4];
								option.series[5].markPoint.data=baseMark(tempData)[5];
								option.series[6].markPoint.data=flashMark(tempData);//闪烁效果
								overlay.setOption(option);
								areaRingsClear(params);
							}							
						});
			}
		}
	} 
	
	//路测选择
	$scope.roadChoose=function(params){
		if ($(".roadChoose input[value="+params+"]").prop("checked") == true) {
			var t=[];
			$(".roadChoose input:checked").each(function(i){
				t.push($(this).val());
			});
			$http.get("amap/map/roadById?bsId="+t).success(
					function(response) {
						var roadData = response.items;
						roadtestCreate(roadData);
					});
		} else {
			var t=[];
			$(".roadChoose input:checked").each(function(i){
				t.push($(this).val());
			});
			roadtest.clear();
			if(t.length!=0 || z.length!=0){
				$http.get("amap/map/roadById?bsId="+t).success(
						function(response) {
							var roadData = response.items;
							roadtestCreate(roadData);
						});
			}
		}
	} 

	//检索
	$scope.chooseLayerType=function(param){	
		var display =$('.navform').css('display');
		if(display == 'none'){
			$('.navform').css({display:'block'});
		}else{
			$('.navform').css({display:'none'});
		}	
	}
	
	//右上角临时显示
	$scope.chooseTypes=function(param){	
		var display =$('.info_right').css('display');
		if(display == 'none'){
			$('.info_right').css({display:'block'});
			$('.info_right_temp').css({display:'none'});
		}else{
			$('.info_right').css({display:'none'});
			$('.info_right_temp').css({display:'block'});
		}	
	}
	
	//点击搜索定位
	$scope.changePositionForSearch=function(){
		var temp = $("#search_kw").val();
		//判断temp是否包含:，如果包含则为基站类数据
		if(temp.indexOf(":")>=0){
			$.ajax({
				type : "GET",
				url : "bs/map/data",
				dataType : "json",
				success : function(dataMap) {
					var tempData = dataMap.items;
					var data = dataWithoutZero(tempData);
					var idAndName = temp.split(":")
					var lat,lng
					for(var i=0;i<data.length;i++){
						if(data[i].bsId == idAndName[0]){
							lng = data[i].lng;
							lat = data[i].lat;
							break;
						}
					}
					var point = new esri.geometry.Point(lng*1, lat*1,new esri.SpatialReference({wkid:parseInt(4490)}));
					myMap.centerAndZoom(point,6);
					$('#search_kw').val('');
					//$('.navform').hide();
				}
			});
		}else if(temp.indexOf("[")>=0){
			var str = temp.split("[");
			var tempStr = str[1].split("]");
			var finalStr = tempStr[0];
			var areaUrl = "mapLayer/" + finalStr + ".json"
			$.getJSON(areaUrl, function(dataMap) {
				var data = dataMap.features;	
				var lat,lng;
				for (var i=0;i<data.length;i++) {
					if(data[i].attributes.Name == str[0]){
						lng = data[i].geometry.x;
						lat = data[i].geometry.y;
						break;
					}
				}
				
				//加载所选图层，并让checkbox选中
				var param = finalStr;
				switch (param)
				{
				case "道路卡口":
					$("#daolukakou").attr("checked",true);
					myMap.addLayer(daolukakou);
					break;
				case "工业园":
					$("#gongyeyuan").attr("checked",true);
					myMap.addLayer(gongyeyuan);
					break;
				case "公园广场":
					$("#gongyuanguangchang").attr("checked",true);
					myMap.addLayer(gongyuanguangchang);
					break;
				case "国家级景点":
					$("#guojiajijingdian").attr("checked",true);
					myMap.addLayer(guojiajijingdian);
					break;
				case "会议中心":
					$("#huiyizhongxin").attr("checked",true);
					myMap.addLayer(huiyizhongxin);
					break;
				case "交管机构":
					$("#jiaoguanjigou").attr("checked",true);
					myMap.addLayer(jiaoguanjigou);
					break;
				case "交通枢纽":
					$("#jiaotongshuniu").attr("checked",true);
					myMap.addLayer(jiaotongshuniu);
					break;
				case "街道办":
					$("#jiedaoban").attr("checked",true);
					myMap.addLayer(jiedaoban);
					break;
				case "四星级以上酒店":
					$("#jiudian").attr("checked",true);
					myMap.addLayer(jiudian);
					break;
				case "三甲急救":
					$("#sanjiajijiu").attr("checked",true);
					myMap.addLayer(sanjiajijiu);
					break;
				case "物资仓库":
					$("#wuzicangku").attr("checked",true);
					myMap.addLayer(wuzicangku);
					break;
				case "乡镇政府":
					$("#xiangzhenzhengfu").attr("checked",true);
					myMap.addLayer(xiangzhenzhengfu);
					break;
				case "消防":
					$("#xiaofang").attr("checked",true);
					myMap.addLayer(xiaofang);
					break;
				case "灾害易发点":
					$("#zaihaiyifadian").attr("checked",true);
					myMap.addLayer(zaihaiyifadian);
					break;
				case "重点高校":
					$("#zhongdiangaoxiao").attr("checked",true);
					myMap.addLayer(zhongdiangaoxiao);
					break;
				case "公安局":
					$("#gonganju").attr("checked",true);
					myMap.addLayer(gonganju);
					break;		
				}
				
				var point = new esri.geometry.Point(lng*1, lat*1,new esri.SpatialReference({wkid:parseInt(4490)}));
				myMap.centerAndZoom(point,10);
				$('#search_kw').val('');
				//$('.navform').hide();
			});
		}else{
			alert("未找到搜索结果");
		}
		
		
	}
	

	/* 刷新数据  业务*/
	$scope.refresh = function() {
		$scope.search(1);
	};
	/* 查询数据  业务*/
	$scope.search = function(page) {
		var $scope = angular.element(appElement).scope();
		var pageSize = $("#page-limit").val();
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
				"radio/status/oneBsRadio?bsId=" + $scope.bsId
						+ "&start=" + start + "&limit=" + pageSize)
				.success(function(response) {
					xh.maskHide();
					$scope.radioData = response.items;
					$scope.radioTotals = response.totals;
					xh.pagging(page, parseInt($scope.radioTotals), $scope);
				});
	};
	
	
	/* 查询数据  不规则圈选*/
	$scope.searchChoose = function(page) {
		var params = $scope.groupData;
		var pageSize = $("#page-limitChoose").val();
		var start = 1, limit = pageSize;
		frist = 0;
		page = parseInt(page);
		if (page <= 1) {
			start = 0;

		} else {
			start = (page - 1) * pageSize;
		}
		
		$http.get("amap/polyline?params="+params+"&start="+start+"&limit="+limit).
		success(function(response){
			var tempData=response.items;
			$scope.dataRectangle = tempData;		
			$scope.totalsChoose = response.totals;
			xh.paggingChoose(page, parseInt($scope.totalsChoose), $scope,params);
		});
	};
	
	/* 查询数据  矩形圈选*/
	$scope.searchChooseRec = function(page,params) {
		var pageSize = $("#page-limitChoose").val();
		var start = 1, limit = pageSize;
		frist = 0;
		page = parseInt(page);
		if (page <= 1) {
			start = 0;

		} else {
			start = (page - 1) * pageSize;
		}
		$http.get("amap/rectangle?params="+params+"&start="+start+"&limit="+limit).
		success(function(response){
			var tempData=response.items;	
			//添加模拟数据 start
			/*for(var i=0;i<tempData.length;i++){
				tempData[i].testnum1=parseInt(Math.random()*(99-5+1) + 5);
				tempData[i].testnum2=parseInt(Math.random()*(99-5+1) + 5);
				tempData[i].testnum3=parseInt(Math.random()*(65-16+1) + 11)+"%";
			}*/
			//添加模拟数据 end
			$scope.dataRectangle = tempData;		
			$scope.totalsChoose = response.totals;
			xh.paggingChooseRec(page, parseInt($scope.totalsChoose), $scope,params);
		});
	};
	
	//分页点击，业务
	$scope.pageClick = function(page, totals, totalPages) {
		var pageSize = $("#page-limit").val();
		var start = 1, limit = pageSize;
		page = parseInt(page);
		if (page <= 1) {
			start = 0;
		} else {
			start = (page - 1) * pageSize;
		}
	
		$http.get(
				"radio/status/oneBsRadio?bsId=" + $scope.bsId
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
		
		$http.get(
				"radio/status/oneBsGroup?bsId=" + $scope.bsId
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
	
	//分页点击,不规则圈选
	$scope.pageClickChoose = function(page, totals, totalPages, params) {		
		var pageSize = $("#page-limitChoose").val();
		var start = 1, limit = pageSize;
		page = parseInt(page);
		if (page <= 1) {
			start = 0;
		} else {
			start = (page - 1) * pageSize;
		}
		$http.get("amap/polyline?params="+params+"&start="+start+"&limit="+pageSize).
		success(function(response){
			$scope.startChoose = (page - 1) * pageSize + 1;
			$scope.lastIndexChoose = page * pageSize;
			if (page == totalPages) {
				if (totals > 0) {
					$scope.lastIndexChoose = totals;
				} else {
					$scope.startChoose = 0;
					$scope.lastIndexChoose = 0;
				}
			}
			var tempData=response.items;
			//添加模拟数据 start			
			for(var i=0;i<tempData.length;i++){
				tempData[i].testnum1=parseInt(Math.random()*(99-5+1) + 5);
				tempData[i].testnum2=parseInt(Math.random()*(99-5+1) + 5);
				tempData[i].testnum3=parseInt(Math.random()*(65-16+1) + 11)+"%";
			}
			//添加模拟数据 end
			$scope.dataRectangle = tempData;
			$scope.totalsChoose = response.totals;
		});
		
	};
	
	//分页点击,矩形圈选
	$scope.pageClickChooseRec = function(page, totals, totalPages, params) {		
		var pageSize = $("#page-limitChoose").val();
		var start = 1, limit = pageSize;
		page = parseInt(page);
		if (page <= 1) {
			start = 0;
		} else {
			start = (page - 1) * pageSize;
		}
		$http.get("amap/rectangle?params="+params+"&start="+start+"&limit="+pageSize).
		success(function(response){
			$scope.startChoose = (page - 1) * pageSize + 1;
			$scope.lastIndexChoose = page * pageSize;
			if (page == totalPages) {
				if (totals > 0) {
					$scope.lastIndexChoose = totals;
				} else {
					$scope.startChoose = 0;
					$scope.lastIndexChoose = 0;
				}
			}
			var tempData=response.items;
			//添加模拟数据 start			
			for(var i=0;i<tempData.length;i++){
				tempData[i].testnum1=parseInt(Math.random()*(99-5+1) + 5);
				tempData[i].testnum2=parseInt(Math.random()*(99-5+1) + 5);
				tempData[i].testnum3=parseInt(Math.random()*(65-16+1) + 11)+"%";
			}
			//添加模拟数据 end
			$scope.dataRectangle = tempData;
			$scope.totalsChoose = response.totals;
		});
		
	};
	
});

//刷新数据 业务
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();

};

/* 数据分页 业务 */
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
			visiblePages : 3,
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

/* 数据分页 不规则圈选 */
xh.paggingChoose = function(currentPage, totals, $scope, params) {
	var pageSize = $("#page-limitChoose").val();
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
	$scope.startChoose = start;
	$scope.lastIndexChoose = end;
	$scope.totalsChoose = totals;
	if (totals > 0) {
		$(".page-pagingChoose").html('<ul class="paginationChoose"></ul>');
		$('.paginationChoose').twbsPagination({
			totalPages : totalPages,
			visiblePages : 10,
			version : '1.1',
			startPage : currentPage,
			onPageClick : function(event, page) {
				if (frist == 1) {
					$scope.pageClickChoose(page, totals, totalPages, params);
				}
				frist = 1;

			}
		});
	}

};

/* 数据分页 矩形圈选 */
xh.paggingChooseRec = function(currentPage, totals, $scope, params) {
	var pageSize = $("#page-limitChoose").val();
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
	$scope.startChoose = start;
	$scope.lastIndexChoose = end;
	$scope.totalsChoose = totals;
	if (totals > 0) {
		$(".page-pagingChoose").html('<ul class="paginationChoose"></ul>');
		$('.paginationChoose').twbsPagination({
			totalPages : totalPages,
			visiblePages : 10,
			version : '1.1',
			startPage : currentPage,
			onPageClick : function(event, page) {
				if (frist == 1) {
					$scope.pageClickChooseRec(page, totals, totalPages, params);
				}
				frist = 1;

			}
		});
	}

};

/**
 * 本示例使用arcgis api for javascript 技术显示地图。 相关官方API文档地址为:
 * https://developers.arcgis.com/javascript/jsapi/ 所有示例代码访问地址为：
 * https://developers.arcgis.com/javascript/jssamples/
 */
dojo.require("esri.map");
var myTiledMapServiceLayer;
var myMap;
var scalebar;
var draw;
var levelLayer,areaLayer
var roadtest;
var areaRings;
var rectangle;
var test;
var testDemo;
//定时器
var timerForGpsDst;

//gps定位
var gpsDst;

var chooseLayer=0;

var daolukakou,gongyeyuan,gongyuanguangchang,guojiajijingdian,huiyizhongxin,jiaoguanjigou,jiaotongshuniu,jiedaoban,jiudian,sanjiajijiu,wuzicangku,xiangzhenzhengfu,xiaofang,zaihaiyifadian,zhongdiangaoxiao,gonganju;
function floor(data) {
	var options = {
		maxZoom:11,//最大空间等级  
		minZoom:1,//最小空间等级  
		slider:false,//隐藏比例尺控件  
		logo:false,//隐藏logo
	};
	esri.symbols = esri.symbol;
	myMap = new esri.Map("mapDiv", options);// 在mapDiv中创建map地图对象
	// 创建底图图层对象,http://10.190.230.165/arcgisditu/rest/services/NEWMAP/MapServer为政务外网底图服务地址,
	if(chooseLayer==0){
		myTiledMapServiceLayer = new
		esri.layers.ArcGISTiledMapServiceLayer(
				"http://125.70.9.194:6080/arcgis/rest/services/800M/MAP20170920/MapServer");// 底图切片服务 http://125.70.9.194:801/services/MapServer/map2d http://125.70.9.194:6080/arcgis/rest/services/800M/MAP20170920/MapServer
		myMap.addLayer(myTiledMapServiceLayer);// 将底图图层对象添加到地图中
	}else if(chooseLayer==1){
		testDemo = new
		esri.layers.ArcGISTiledMapServiceLayer(
				"http://125.70.9.194:801/arcgis/rest/services/800M20180428/MapServer");// 仿真图切片服务 http://125.70.9.194:6080/arcgis/rest/services/800M/800M_20160823/MapServer
		myMap.addLayer(testDemo);// 将图层对象添加到地图中
	}
	daolukakou = new esri.layers.ArcGISTiledMapServiceLayer("http://125.70.9.194:6080/common/rest/services/800M/daolukakou/MapServer");//道路卡口	
	gongyeyuan = new esri.layers.ArcGISTiledMapServiceLayer("http://125.70.9.194:6080/common/rest/services/800M/gongyeyuan/MapServer");//工业园
	gongyuanguangchang = new esri.layers.ArcGISTiledMapServiceLayer("http://125.70.9.194:6080/common/rest/services/800M/gongyuanguangchang/MapServer");//公园广场
	guojiajijingdian = new esri.layers.ArcGISTiledMapServiceLayer("http://125.70.9.194:6080/common/rest/services/800M/guojiajijingdian/MapServer");//国家级景点
	huiyizhongxin = new esri.layers.ArcGISTiledMapServiceLayer("http://125.70.9.194:6080/common/rest/services/800M/huiyizhongxin/MapServer");//会议中心
	jiaoguanjigou = new esri.layers.ArcGISTiledMapServiceLayer("http://125.70.9.194:6080/common/rest/services/800M/jiaoguanjigou/MapServer");//交管机构
	jiaotongshuniu = new esri.layers.ArcGISTiledMapServiceLayer("http://125.70.9.194:6080/common/rest/services/800M/jiaotongshuniu/MapServer");//交通枢纽
	jiedaoban = new esri.layers.ArcGISTiledMapServiceLayer("http://125.70.9.194:6080/common/rest/services/800M/jiedaoban/MapServer");//街道办
	jiudian = new esri.layers.ArcGISTiledMapServiceLayer("http://125.70.9.194:6080/common/rest/services/800M/jiudian/MapServer");//四星级以上酒店
	sanjiajijiu = new esri.layers.ArcGISTiledMapServiceLayer("http://125.70.9.194:6080/common/rest/services/800M/sanjiajijiu/MapServer");//三甲急救
	wuzicangku = new esri.layers.ArcGISTiledMapServiceLayer("http://125.70.9.194:6080/common/rest/services/800M/wuzicangku/MapServer");//物资仓库
	xiangzhenzhengfu = new esri.layers.ArcGISTiledMapServiceLayer("http://125.70.9.194:6080/common/rest/services/800M/xiangzhenzhengfu/MapServer");//乡镇政府
	xiaofang = new esri.layers.ArcGISTiledMapServiceLayer("http://125.70.9.194:6080/common/rest/services/800M/xiaofang/MapServer");//消防
	zaihaiyifadian = new esri.layers.ArcGISTiledMapServiceLayer("http://125.70.9.194:6080/common/rest/services/800M/zaihaiyifadian/MapServer");//灾害易发点
	zhongdiangaoxiao = new esri.layers.ArcGISTiledMapServiceLayer("http://125.70.9.194:6080/common/rest/services/800M/zhongdiangaoxiao/MapServer");//重点高校
	gonganju = new esri.layers.ArcGISTiledMapServiceLayer("http://125.70.9.194:6080/common/rest/services/800M/gonganju/MapServer");//公安局

	levelLayer = new esri.layers.GraphicsLayer({id:"基站级别"});
	areaLayer = new esri.layers.GraphicsLayer({id:"基站区域"});
	roadtest = new esri.layers.GraphicsLayer({id:"路测数据"});
	areaRings = new esri.layers.GraphicsLayer({id:"区域边界"});
	rectangle = new esri.layers.GraphicsLayer({id:"圈选功能"});
	
	gpsDst = new esri.layers.GraphicsLayer({id:"GPS定位"});
	//var point = new esri.geometry.Point(104.04800077323965, 30.675192748658024,new esri.SpatialReference({wkid:parseInt(4490)}));正常基站图
	var point = new esri.geometry.Point(103.96660774751845, 30.70529237458872,new esri.SpatialReference({wkid:parseInt(4490)}));//覆盖仿真图
	myMap.centerAndZoom(point, 0);// 地图首次加载显示的位置和放大级别
	//myMap.addLayer(gLayer);// 将图形显示图层添加到地图中
	myMap.setInfoWindowOnClick(true);
	myMap.addLayer(areaRings);
	myMap.addLayer(rectangle);
	myMap.addLayer(roadtest);
	myMap.addLayer(gpsDst);
	// 创建点的显示样式对象
	/*
	 * var pSymbol = new esri.symbols.SimpleMarkerSymbol(); pSymbol.style =
	 * esri.symbols.SimpleMarkerSymbol.STYLE_CIRCLE; //设置点的类型为圆形
	 * pSymbol.setSize(12); //设置点的大小为12像素 pSymbol.setColor(new
	 * dojo.Color("#FFFFCC"));
	 */
	
	// 添加控件
	// 比例尺
	require([ "esri/dijit/Scalebar" ], function(Scalebar) {
		scalebar = new esri.dijit.Scalebar({
			map : myMap,
			// "dual" displays both miles and kilmometers
			// "english" is the default, which displays miles
			// use "metric" for kilometers
			scalebarUnit : "metric"
		});
	});
	//区域圈选
	var toolbar, symbol, geomTask,chooseType;
    require([
      "esri/map", 
      "esri/toolbars/draw",
      "esri/graphic",
      "esri/symbols/SimpleMarkerSymbol",
      "esri/symbols/SimpleLineSymbol",
      "esri/symbols/SimpleFillSymbol",
      "dojo/parser", "dijit/registry",
      "dijit/layout/BorderContainer", "dijit/layout/ContentPane", 
      "dijit/form/Button", "dijit/WidgetSet", "dojo/domReady!"
    ], function(
      Map, Draw, Graphic,
      SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
      parser, registry
    ) {  
    	
      // loop through all dijits, connect onClick event
      // listeners for buttons to activate drawing tools
      registry.forEach(function(d) {
          // d is a reference to a dijit
          // could be a layout container or a button
          if ( d.declaredClass === "dijit.form.Button" ) {
            d.on("click", activateTool);
          }
        });
      var params;      
      function activateTool() {
    	  var d = this.label.toUpperCase();    	  
    	  
    	  createToolbar();
    	  if(d == "不规则圈选"){  	
    		  $("#testpro").css({display:'block'});
    		  $("#mapDiv").attr("title","单击鼠标左键开始圈选，双击结束圈选");
    		  chooseType=1;
              var temp = "POLYGON";//RECTANGLE
        	  var tool = temp.replace(/ /g, "_");
              toolbar.activate(Draw[tool]);
    	  }else if(d == "矩形圈选"){
    		  $("#testpro").css({display:'block'});
    		  $("#mapDiv").attr("title","按住鼠标左键开始圈选，松开结束圈选");
        	  //开启鼠标监听
    		  chooseType=2;
        	  params = mouseEvents();
              var temp = "RECTANGLE";
        	  var tool = temp.replace(/ /g, "_");
              toolbar.activate(Draw[tool]);
    	  }	  
      }
      
      $('#testpro').mouseover(function(){
    	 $("#testpro").css({display:'none'});
    	 $("#mapDiv").removeAttr("title");
    	 toolbar.deactivate(); 
      });

      function createToolbar(themap) {
          toolbar = new Draw(myMap);
          toolbar.on("draw-end", addToMap);
      }

      function addToMap(evt) {
    	  if(chooseType==1){
    		  var geometry = evt.geometry;
        	  var symbol;
              toolbar.deactivate();
              switch (evt.geometry.type) {
                case "point":
                case "multipoint":
                  symbol = new SimpleMarkerSymbol();
                  break;
                case "polyline":
                  symbol = new SimpleLineSymbol();
                  break;
                default:
                  symbol = new SimpleFillSymbol();
                  break;
              }
              var graphic = new Graphic(evt.geometry, symbol);

              if (graphic.geometry.type === "polygon") {  
                  var polygon = new esri.geometry.Polygon({"rings":geometry.rings,"spatialReference":geometry.spatialReference});  
              }
              var groupData=[];
              //循环data找出包含的基站
              for(var i=0;i<data.length;i++){
            	  var tempPoint = new esri.geometry.Point(data[i].lng, data[i].lat,new esri.SpatialReference({wkid:parseInt(4490)}));
                  var result = contain(tempPoint,polygon);
                  if(result == "yes"){
                	  groupData.push(data[i].bsId);
                  }
              }  
              rectangle.add(graphic);
              $('#rectangle').modal();
              var appElement = document.querySelector('[ng-controller=map]');
          	  var $scope = angular.element(appElement).scope();
          	  //把圈选包含基站的id放入groupData
          	  $scope.groupData=groupData;
          	  $scope.searchChoose(1);
    	  }else if(chooseType==2){
    		  var symbol;
              toolbar.deactivate();
              switch (evt.geometry.type) {
                case "point":
                case "multipoint":
                  symbol = new SimpleMarkerSymbol();
                  break;
                case "polyline":
                  symbol = new SimpleLineSymbol();
                  break;
                default:
                  symbol = new SimpleFillSymbol();
                  break;
              }
              var graphic = new Graphic(evt.geometry, symbol);
              graphic.attributes=params;
              rectangle.add(graphic);
              $('#rectangle').modal();
              var appElement = document.querySelector('[ng-controller=map]');
          	  var $scope = angular.element(appElement).scope();
          	  $scope.searchChooseRec(1,params);
    	  }
      }

      
    });
}


//验证包含的方法，注意传入参数的类型是Point和Polygon，不是geometry。  
function contain(point,polygon) {  
    if (polygon.contains(point)) {  
        return "yes";  
    } else {  
        return "no";  
    }  
}

//圈选模态框消失后清除图层
$("#rectangle").on("hide.bs.modal",function(){
	$("#testpro").css({display:'none'});
	$("#mapDiv").removeAttr("title");
	rectangle.clear();
});

function mouseEvents(){
	var params=[];
	// 鼠标获取经纬度
    var mouseDown = myMap.on("mouse-down", function(e){
    	params.push(e.mapPoint.x);
    	params.push(e.mapPoint.y);
    	console.log(e.mapPoint.x ,e.mapPoint.y);
    	mouseDown.remove();
  	  });
    var mouseUp = myMap.on("mouse-up", function(e){
    	params.push(e.mapPoint.x);
    	params.push(e.mapPoint.y);
    	console.log(e.mapPoint.x ,e.mapPoint.y);
    	mouseUp.remove();
  	  }); 
    return params;
}

var areaRef={	
		"简阳":{name:"简阳",color:"#000000"},
		"双流":{name:"双流",color:"#000000"},
		"都江堰":{name:"都江堰",color:"#191970"},
		"天府新区":{name:"天府新区",color:"#0000FF"},
		"温江":{name:"温江",color:"#458B00"},
		"龙泉驿":{name:"龙泉驿",color:"#006400"},
		"金堂":{name:"金堂",color:"#228B22"},
		"青白江":{name:"青白江",color:"#8B7500"},
		"新都":{name:"新都",color:"#8B658B"},
		"彭州":{name:"彭州",color:"#A52A2A"},
		"郫都区":{name:"郫都区",color:"#FF0000"},
		"崇州":{name:"崇州",color:"#008B8B"},
		"大邑":{name:"大邑",color:"#8B008B"},
		"邛崃":{name:"邛崃",color:"#8B0000"},
		"蒲江":{name:"蒲江",color:"#F4A460"},
		"新津":{name:"新津",color:"#FF1493"},
		"高新区":{name:"高新区",color:"#191970"},
		"成华区":{name:"成华区",color:"#0000FF"},
		"武侯区":{name:"武侯区",color:"#000000"},
		"金牛区":{name:"金牛区",color:"#191970"},
		"锦江区":{name:"锦江区",color:"#8B658B"},
		"青羊区":{name:"青羊区",color:"#FF0000"}
}
//区域边界图层数据 
function areaRingsData(param){
	var areaInfo=areaRef[param].name;
	var color=areaRef[param].color;
	/*var areaSearch="http://125.70.9.194:6080/common/rest/services/YingJiBan/Region/MapServer/find?searchText="+areaInfo+"&contains=true&searchFields=&sr=&layers=0&layerDefs=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&dynamicLayers=&returnZ=false&returnM=false&gdbVersion=&f=pjson";*/
	/*$.ajax({
		type : "GET",
		url : areaSearch,
		dataType : "json",
		success : function(dataMap) {
			var data = dataMap.results[0].geometry.rings[0];
			var temp=[];
			var tempData=[];
			var i;
			for(i=0;i<data.length;i+=10){
				temp.push(data[i]);
			}
			tempData.push(temp);
			var params=[param,color];
			areaRingsCreate(tempData,params);
		}
	});*/
	var areaUrl = "mapArea/" + param +".json"
	$.getJSON(areaUrl, function (dataMap){
		var data = dataMap.results[0].geometry.rings[0];
		var temp=[];
		var tempData=[];
		var i;
		for(i=0;i<data.length;i+=10){
			temp.push(data[i]);
		}
		tempData.push(temp);
		var params=[param,color];
		areaRingsCreate(tempData,params);
	});
}

//区域边界图层创建
function areaRingsCreate(data,params){
	require(["esri/Color"], function(Color) {	
		var line = new esri.geometry.Polyline({
			   "paths": data,
			   "spatialReference": { "wkid": 4490 }
			});
		var lineSymbol = new esri.symbol.CartographicLineSymbol(
			  esri.symbol.CartographicLineSymbol.STYLE_SOLID,
			  new dojo.Color(params[1]), 3,
			  esri.symbol.CartographicLineSymbol.CAP_ROUND,
			  esri.symbol.CartographicLineSymbol.JOIN_MITER, 1
			);
		var polyline = new esri.Graphic(line, lineSymbol);
		polyline.attributes=params[0];
		areaRings.add(polyline);
	});
}

// 区域边界图层删除
function areaRingsClear(param){
	var i;
	for(i=0;i<areaRings.graphics.length;i++){
		if(areaRings.graphics[i].attributes==param){
			areaRings.remove(areaRings.graphics[i]);
		}
	}
}
//路测图层创建
function roadtestCreate(data){
	require(["esri/Color"], function(Color) {
		var i;
		for(i=0;i<data.length;i++){
			var temp=[];
			if(data[i].db>=-103 && data[i].db<-100){
				temp=[255,0,0]//红色
			}else if(data[i].db>=-100 && data[i].db<-95){
				temp=[255,255,0]//黄色
			}else if(data[i].db>=-95 && data[i].db<-85){
				temp=[0,0,255]//蓝色
			}else if(data[i].db>=-85 && data[i].db<-39){
				temp=[0,255,0]//绿色
			}
			var symbol = new esri.symbol.SimpleMarkerSymbol({
				"color": temp,
				"size": 8,
				"type": "simplemarkersymbol"
			});
			var pt = new esri.geometry.Point(data[i].lng*1, data[i].lat*1,new esri.SpatialReference({wkid:parseInt(4490)}));// 创建点对象
			var attr = {
				"db" : data[i].db,
				"lng" : data[i].lng,
				"lat" : data[i].lat,
				"nPositionArea" : data[i].nPositionArea,
				"ndb" : data[i].ndb,	
				"positionArea" : data[i].positionArea
			};// 设置相关的属性信息对象
			var infoTemplate = new esri.InfoTemplate("弹出窗口的标题",
					"纬度属性: ${lat} <br/>经度属性: ${lng} <br/>场强:${db}");// 创建弹出窗口内容显示模板
			var graphic = new esri.Graphic(pt, symbol, attr, infoTemplate);// 创建图形对象
			roadtest.add(graphic);// 将图形对象添加到图形显示图层
		}
	});
	
}

//gps定位
function gpsDstCreate(data){
	require(["esri/symbols/PictureMarkerSymbol","esri/symbols/TextSymbol","esri/symbols/Font","esri/Color"], function(PictureMarkerSymbol,TextSymbol,Font,Color) {
		var i;
		for(i=0;i<data.length;i++){
			if(data[i].srcId != "2017027" && data[i].srcId != "2017034" && data[i].srcId != "2017037"){
				var symbol = new PictureMarkerSymbol('gpsDst/user50.png', 18, 45);
			}else{
				var symbol = new PictureMarkerSymbol('gpsDst/car48.png', 51, 51);
			}
			
			var pt = new esri.geometry.Point(data[i].longitude*1, data[i].latitude*1,new esri.SpatialReference({wkid:parseInt(4490)}));// 创建点对象
			var attr = {};// 设置相关的属性信息对象
			var infoTemplate;// 创建弹出窗口内容显示模板
			var graphic = new esri.Graphic(pt, symbol, attr, infoTemplate);// 创建图形对象
			
			
			var symbol1 = new TextSymbol(data[i].srcId);
			var font  = new Font();
			font.setSize("12pt");
			font.setWeight(Font.WEIGHT_BOLD);
			symbol1.setFont(font);
			
			var color = new Color("#0000FF");
			symbol1.setColor(color);
			
			symbol.setOffset(0,32);
			
			var pt1 = new esri.geometry.Point(data[i].longitude*1, data[i].latitude*1,new esri.SpatialReference({wkid:parseInt(4490)}));// 创建点对象
			var attr1 = {};// 设置相关的属性信息对象
			var infoTemplate1;// 创建弹出窗口内容显示模板
			var graphic1 = new esri.Graphic(pt1, symbol1, attr1, infoTemplate1);// 创建图形对象
			
			gpsDst.add(graphic);// 将图形对象添加到图形显示图层
			gpsDst.add(graphic1);// 将图形对象添加到图形显示图层
		}
	});
	
}

var overlay,option,myChart
function init(data,markData) {
	require([ "esri/map", "src/EchartsLayer", "dojo/domReady!" ], function(Map,
			EchartsLayer) {
		//加载arcgis
		floor(data);
		
		// 处理data数据
		var i;
		var obj = {};
		for (i = 0; i < data.length; i++) {
			var t = [];
			t[0] = data[i].lng;
			t[1] = data[i].lat;
			var key = data[i].name;
			obj[key] = t;
		}
		// 闪烁提示基站显示数据	
		var j;
		var objTemp = [];	
		for (j = 0; j < data.length; j++) {
			if(data[j].bsStatus!=0 && data[j].zone!="简阳" && data[j].status!=0){
				var x = {
						name : data[j].name,
						id : data[j].bsId
					};
					objTemp.push(x);
			}							
		}
		// 所有基站显示数据
		var k;
		var objConnect = [];
		var objBreak = [];
		var objTypeOneConnect = [];
		var objTypeOneBreak = [];
		var objTypeTwoConnect = [];
		var objTypeTwoBreak = [];
		for (k = 0; k < data.length; k++) {
			if(data[k].bsStatus==0 && data[k].type==0){
				var y = {
					name : data[k].name,
					id : data[k].bsId,
					bsStatus : data[k].bsStatus
					};
				objConnect.push(y);
			}else if(data[k].bsStatus==1 && data[k].type==0){
				var y = {
						name : data[k].name,
						id : data[k].bsId,
						bsStatus : data[k].bsStatus
						};
				objBreak.push(y);
			}else if(data[k].bsStatus==0 && data[k].type==1){
				var y = {
						name : data[k].name,
						id : data[k].bsId,
						bsStatus : data[k].bsStatus
						};
				objTypeOneConnect.push(y);
			}else if(data[k].bsStatus==1 && data[k].type==1){
				var y = {
						name : data[k].name,
						id : data[k].bsId,
						bsStatus : data[k].bsStatus
						};
				objTypeOneBreak.push(y);
			}else if(data[k].bsStatus==0 && data[k].type==2){
				var y = {
						name : data[k].name,
						id : data[k].bsId,
						bsStatus : data[k].bsStatus
						};
				objTypeTwoConnect.push(y);
			}else if(data[k].bsStatus==1 && data[k].type==2){
				var y = {
						name : data[k].name,
						id : data[k].bsId,
						bsStatus : data[k].bsStatus
						};
				objTypeTwoBreak.push(y);
			}else{
				//未标示基站bsStatuss
				var y = {
						name : data[k].name,
						id : data[k].bsId,
						bsStatus : data[k].bsStatus
						};
				objBreak.push(y);
			}			
		}
		console.log(data);
		/*console.log("objConnect : "+objConnect);
		console.log("objBreak : "+objBreak);
		console.log("objTypeOneConnect : "+objTypeOneConnect);
		console.log("objTypeOneBreak : "+objTypeOneBreak);
		console.log("objTypeTwoConnect : "+objTypeTwoConnect);
		console.log("objTypeTwoBreak : "+objTypeTwoBreak);*/
		
		overlay = new EchartsLayer(myMap, echarts);
		var chartsContainer = overlay.getEchartsContainer();
		myChart = overlay.initECharts(chartsContainer);
		window.onresize = myChart.onresize;
		// 为echarts绑定事件
		myChart.on('click', function(params) {
			/* 基站图标设置模态框并获取显示数据 */
			$('#myModal').modal();
			var appElement = document.querySelector('[ng-controller=map]');
			var $scope = angular.element(appElement).scope();
			//默认选中第一个
			$("#xh-tabs li").siblings().removeClass('active');
			$("#xh-tabs li:first").addClass('active');
			$("#info").removeClass();
			$("#info").addClass('tab-pane fade in active');
			$("#config").removeClass();
			$("#config").addClass('tab-pane fade');
			$("#equip").removeClass();
			$("#equip").addClass('tab-pane fade');			
			$scope.bsId=params.data.id;
			$scope.bsInformation();
		});
		//地图加载时执行
		option = {
				color : [ 'gold', 'aqua', 'lime' ],
				tooltip: {
					formatter: function (params) {
						var res;
						var radioTotals;
						var groupTotals;
						var numtotals;
						$.ajax({
							type : "GET",
							url : "amap/map/numtotals?bsId=" + params["5"].id,
							dataType : "json",
							async : false,
							success : function(response) {	
								var dataTemp = response.items;
								console.log("dataTemp: "+dataTemp);
								if(dataTemp[0]!=null && dataTemp[0]!=""){
									if(dataTemp[0].hasOwnProperty("numtotals") ){
										numtotals = dataTemp[0].numtotals;
									}else{
										numtotals="暂无";
									}	
								}	
								if(response.hasOwnProperty("radioTotals")){
									radioTotals = response.radioTotals;
								}else{
									radioTotals="暂无";
								}
								if(response.hasOwnProperty("groupTotals")){
									groupTotals = response.groupTotals;
								}else{
									groupTotals="暂无"
								}
								
							}
						});
						for(var a=0;a<data.length;a++){
							if(data[a].bsId == params[5].id && data[a].bsStatus != 0){
		                        var radioTotals = "";
		                        var groupTotals = "";
		                        var numtotals = "";
							}
						}
						
                        res = '基站ID：'+params["5"].id+
                        '<br/>'+'基站名称：'+params["1"]+
                        '<br/>'+'注册组数：'+ groupTotals +
                        '<br/>'+'注册用户数：'+ radioTotals +
                        '<br/>'+'排队数：' + numtotals;
						return res;
                    },
                    show: true,
                    trigger: 'item',
                    //show: true,   //default true
                    showDelay: 600,//显示延时，添加显示延时可以避免频繁切换
                    hideDelay: 50,//隐藏延时
                    transitionDuration: 0,//动画变换时长
                    backgroundColor: 'rgba(0,0,0,0.7)',//背景颜色（此时为默认色）
                    borderRadius: 8,//边框圆角
                    padding: 10,    // [5, 10, 15, 20] 内边距
                    position: function (p) {
                        // 位置回调
                        return [p[0] + 10, p[1] - 10];
                    }  
                },
				series : [ {
					name : '四川正常固定基站',
					type : 'map',
					mapType : 'none',			
					data : [],
					geoCoord : obj,
					markPoint : {
						symbol : 'pin',
						symbolSize: function(v){
							return 4;
						},	      
						itemStyle : {
							normal : {
								color : 'green'
							},
							emphasis : {
								
							}
						},               
		                data:objConnect
					}
				},{
					name : '四川断开固定基站',
					type : 'map',
					mapType : 'none',			
					data : [],
					geoCoord : obj,
					markPoint : {
						symbol : 'pin',
						symbolSize: function(v){
							return 4;
						},	      
						itemStyle : {
							normal : {
								color : 'red'
							},
							emphasis : {
								
							}
						},
		                data:objBreak
					}
				}, {
					name : '四川正常信源基站',
					type : 'map',
					mapType : 'none',			
					data : [],
					geoCoord : obj,
					markPoint : {
						symbol : 'diamond',
						symbolSize: function(v){
							return 4;
						},	      
						itemStyle : {
							normal : {
								color : 'green'
							},
							emphasis : {
								
							}
						},
		                data:objTypeOneConnect
					}
				},{
					name : '四川断开信源基站',
					type : 'map',
					mapType : 'none',			
					data : [],
					geoCoord : obj,
					markPoint : {
						symbol : 'diamond',
						symbolSize: function(v){
							return 4;
						},	      
						itemStyle : {
							normal : {
								color : 'red'
							},
							emphasis : {
								
							}
						},
		                data:objTypeOneBreak
					}
				},{
					name : '四川正常移动站',
					type : 'map',
					mapType : 'none',			
					data : [],
					geoCoord : obj,
					markPoint : {
						symbol : 'image://bluesky/unuse_big.png',
						symbolSize: function(v){
							return 4;
						},	      
						itemStyle : {
							normal : {
								color : 'green'
							},
							emphasis : {
								
							}
						},
		                data:objTypeTwoConnect
					}
				},{
					name : '四川断开移动站',
					type : 'map',
					mapType : 'none',			
					data : [],
					geoCoord : obj,
					markPoint : {
						symbol : 'image://bluesky/contact_big.png',
						symbolSize: function(v){
							return 4;
						},	      
						itemStyle : {
							normal : {
								color : 'red'
							},
							emphasis : {
								
							}
						},
		                data:objTypeTwoBreak
					}
				},{
					name : '闪烁效果基站',
					type : 'map',
					mapType : 'none',
					data : [],
					markPoint : {
						symbol : 'emptyCircle',//'emptyCircle'
						
						symbolSize : function(v) {
							return 12;
						},
						effect : {
							show : true,
							shadowBlur : 0,
							color : 'red'
						},
						itemStyle : {
							normal : {
								label : {
									show : false
								}
							},
							emphasis : {
								label : {
									position : 'top'
								}
							}
						},
						data : objTemp
					}
				} ]
			};
		console.log("objTemp: "+objTemp);
		myMap.on('load', function() {
			overlay.setOption(option);
		});
		/*addTest*/
		myMap.on("mouse-down", function(e){
	    	console.log(e.mapPoint.x ,e.mapPoint.y);
	  	  });
		myMap.on('zoom-end', function() {
			console.log(myMap.getZoom());
			if ($("#bsInfo").prop("checked") == true){
				if(myMap.getZoom()<=4){
					option.series[0].markPoint.symbolSize=myMap.getZoom()*2;
					option.series[0].markPoint.symbol="pin";
					option.series[1].markPoint.symbolSize=myMap.getZoom()*2;
					option.series[1].markPoint.symbol="pin"
					option.series[2].markPoint.symbolSize=myMap.getZoom()*2;
					option.series[2].markPoint.symbol="diamond"
					option.series[3].markPoint.symbolSize=myMap.getZoom()*2;
					option.series[3].markPoint.symbol="diamond"
					option.series[4].markPoint.symbolSize=myMap.getZoom()*2;
					option.series[4].markPoint.symbol="image://bluesky/contact_big.png"
					option.series[5].markPoint.symbolSize=myMap.getZoom()*2;
					option.series[5].markPoint.symbol="image://bluesky/unuse_big.png"
					overlay.setOption(option);
				}else{
					option.series[0].markPoint.symbolSize=8;
					option.series[0].markPoint.symbol="pin";
					option.series[1].markPoint.symbolSize=8;
					option.series[1].markPoint.symbol="pin"
					option.series[2].markPoint.symbolSize=8;
					option.series[2].markPoint.symbol="diamond"
					option.series[3].markPoint.symbolSize=8;
					option.series[3].markPoint.symbol="diamond"
					option.series[4].markPoint.symbolSize=8;
					option.series[4].markPoint.symbol="image://bluesky/contact_big.png"
					option.series[5].markPoint.symbolSize=8;
					option.series[5].markPoint.symbol="image://bluesky/unuse_big.png"
					overlay.setOption(option);
				}				
			}			
		});
		
		//图层选择事件
		$(function() {
			$("#bsInfo").click(function() {
				if ($(this).prop("checked") == true) {
					option.series[0].markPoint.data=objConnect;
					option.series[1].markPoint.data=baseMark(tempData)[1];
					option.series[2].markPoint.data=baseMark(tempData)[2];
					option.series[3].markPoint.data=baseMark(tempData)[3];
					option.series[4].markPoint.data=baseMark(tempData)[4];
					option.series[5].markPoint.data=baseMark(tempData)[5];
					option.series[6].markPoint.data=flashMark(tempData);//闪烁效果
					option.series[0].markPoint.symbolSize=myMap.getZoom()*2;
					option.series[1].markPoint.symbolSize=myMap.getZoom()*2;
					option.series[2].markPoint.symbolSize=myMap.getZoom()*2;
					option.series[3].markPoint.symbolSize=myMap.getZoom()*2;
					option.series[4].markPoint.symbolSize=myMap.getZoom()*2;
					option.series[5].markPoint.symbolSize=myMap.getZoom()*2;
					overlay.setOption(option);
				} else {
					var point = new esri.geometry.Point(104.04800077323965, 30.675192748658024,new esri.SpatialReference({wkid:parseInt(4490)}));
					myMap.centerAndZoom(point, 2);// 地图首次加载显示的位置和放大级别
					option.series[0].markPoint.data=[];
					option.series[1].markPoint.data=[];
					option.series[2].markPoint.data=[];
					option.series[3].markPoint.data=[];
					option.series[4].markPoint.data=[];
					option.series[5].markPoint.data=[];
					option.series[6].markPoint.data=[];//闪烁效果
					overlay.setOption(option);
				}
			});
			
			$("#testDemo").click(function() {
				var $scope = angular.element(appElement).scope();
				if ($(this).prop("checked") == true) {	
					if(chooseLayer==1){
						window.location.href="map.html"; 
					}else{
						myMap.destroy();
						chooseLayer=1;
						$scope.chooseLayer=1;
						changeData();
						clearTimeout(timerForGpsDst);
						timerForGpsDst = setInterval(function(){
							//使用ajax获取后台gps定位
							$.ajax({
								type : "GET",
								url : "amap/map/dstData",
								dataType : "json",
								success : function(dataMap) {
									var tempData = dataMap.items;
									console.log("tempData为: "+tempData);
									gpsDst.clear();
									gpsDstCreate(tempData);
								}
							});
						},30000);
					}					
				} else {		
					if(chooseLayer==0){
						window.location.href="map.html"; 
					}else{
						myMap.destroy();
						chooseLayer=0;
						$scope.chooseLayer=0;
						changeData();
						clearTimeout(timerForGpsDst);
						timerForGpsDst = setInterval(function(){
							//使用ajax获取后台gps定位
							$.ajax({
								type : "GET",
								url : "amap/map/dstData",
								dataType : "json",
								success : function(dataMap) {
									var tempData = dataMap.items;
									console.log("tempData为: "+tempData);
									gpsDst.clear();
									gpsDstCreate(tempData);
								}
							});
						},30000);
					}									
				}
			});
			
			$("#daolukakou").click(function() {
				if ($(this).prop("checked") == true) {
					myMap.addLayer(daolukakou);				 
				} else {
					myMap.removeLayer(daolukakou);
				}
			});
			
			$("#gongyeyuan").click(function() {
				if ($(this).prop("checked") == true) {
					myMap.addLayer(gongyeyuan);				 
				} else {
					myMap.removeLayer(gongyeyuan);
				}
			});
			
			$("#gongyuanguangchang").click(function() {
				if ($(this).prop("checked") == true) {
					myMap.addLayer(gongyuanguangchang);				 
				} else {
					myMap.removeLayer(gongyuanguangchang);
				}
			});
			
			$("#guojiajijingdian").click(function() {
				if ($(this).prop("checked") == true) {
					myMap.addLayer(guojiajijingdian);				 
				} else {
					myMap.removeLayer(guojiajijingdian);
				}
			});
			
			$("#huiyizhongxin").click(function() {
				if ($(this).prop("checked") == true) {
					myMap.addLayer(huiyizhongxin);					 
				} else {
					myMap.removeLayer(huiyizhongxin);
				}
			});
			
			$("#jiaoguanjigou").click(function() {
				if ($(this).prop("checked") == true) {
					myMap.addLayer(jiaoguanjigou);				 
				} else {
					myMap.removeLayer(jiaoguanjigou);
				}
			});
			
			$("#jiaotongshuniu").click(function() {
				if ($(this).prop("checked") == true) {
					myMap.addLayer(jiaotongshuniu);				 
				} else {
					myMap.removeLayer(jiaotongshuniu);
				}
			});
			
			$("#jiedaoban").click(function() {
				if ($(this).prop("checked") == true) {
					myMap.addLayer(jiedaoban);				 
				} else {
					myMap.removeLayer(jiedaoban);
				}
			});
			
			$("#jiudian").click(function() {
				if ($(this).prop("checked") == true) {
					myMap.addLayer(jiudian);				 
				} else {
					myMap.removeLayer(jiudian);
				}
			});
			
			$("#sanjiajijiu").click(function() {
				if ($(this).prop("checked") == true) {
					myMap.addLayer(sanjiajijiu);				 
				} else {
					myMap.removeLayer(sanjiajijiu);
				}
			});
			
			$("#wuzicangku").click(function() {
				if ($(this).prop("checked") == true) {
					myMap.addLayer(wuzicangku);				 
				} else {
					myMap.removeLayer(wuzicangku);
				}
			});
			
			$("#xiangzhenzhengfu").click(function() {
				if ($(this).prop("checked") == true) {
					myMap.addLayer(xiangzhenzhengfu);				 
				} else {
					myMap.removeLayer(xiangzhenzhengfu);
				}
			});
			
			$("#xiaofang").click(function() {
				if ($(this).prop("checked") == true) {
					myMap.addLayer(xiaofang);				 
				} else {
					myMap.removeLayer(xiaofang);
				}
			});
			
			$("#zaihaiyifadian").click(function() {
				if ($(this).prop("checked") == true) {
					myMap.addLayer(zaihaiyifadian);				 
				} else {
					myMap.removeLayer(zaihaiyifadian);
				}
			});
			
			$("#zhongdiangaoxiao").click(function() {
				if ($(this).prop("checked") == true) {
					myMap.addLayer(zhongdiangaoxiao);				 
				} else {
					myMap.removeLayer(zhongdiangaoxiao);
				}
			});
			
			$("#gonganju").click(function() {
				if ($(this).prop("checked") == true) {
					myMap.addLayer(gonganju);				 
				} else {
					myMap.removeLayer(gonganju);
				}
			});
			
		});
		
	});
}

function tempCenterAndZoom(){
	var point = new esri.geometry.Point(103.99742132710227, 30.62468990456136,new esri.SpatialReference({wkid:parseInt(4490)}));
	myMap.centerAndZoom(point,1);//定位地图位置
}

function changeData() {
	// 使用ajax获取后台所有基站数据
	$.ajax({
		type : "GET",
		url : "amap/map/gisViewByUserIdForShow",
		dataType : "json",
		success : function(dataMap) {
			var tempData = dataMap.items;
			var data = dataWithoutZero(tempData);
			var markData=[];
			init(data,markData);
		}
	});
}

function getData() {
	var $scope = angular.element(appElement).scope();
	// 使用ajax获取后台所有基站数据
	$.ajax({
		type : "GET",
		url : "amap/map/gisViewByUserIdForShow",
		dataType : "json",
		success : function(dataMap) {
			var tempData = dataMap.items;
			//该用户的地图初始化参数start
			var mapInit = dataMap.mapInit;
			$scope.chooseLayer = mapInit;
			chooseLayer = mapInit;
			//end
			var data = dataWithoutZero(tempData);
			var markData=[];
			init(data,markData);
			timerForGpsDst = setInterval(function(){
				//使用ajax获取后台gps定位
				$.ajax({
					type : "GET",
					url : "amap/map/dstData",
					dataType : "json",
					success : function(dataMap) {
						var tempData = dataMap.items;
						console.log("tempData为: "+tempData);
						gpsDst.clear();
						gpsDstCreate(tempData);
					}
				});
			},30000);
		}
	});
}

dojo.addOnLoad(getData);// 页面加载完毕后自动调用getData方法

/* 拖拽模态框 */
var mouseStartPoint = {
	"left" : 0,
	"top" : 0
};
var mouseEndPoint = {
	"left" : 0,
	"top" : 0
};
var mouseDragDown = false;
var oldP = {
	"left" : 0,
	"top" : 0
};
var moveTartet;
//文档加载完执行
$(document).ready(
		function() {
			//检索数据源
			var area = ["道路卡口",
			            "工业园",
			            "公安局",
			            "公园广场",
			            "国家级景点",
			            "会议中心",
			            "交管机构",
			            "交通枢纽",
			            "街道办",
			            "三甲急救",
			            "四星级以上酒店",
			            "物资仓库",
			            "乡镇政府",
			            "消防",
			            "重点高校"
			               ]
			
			var temp = [];
			//设置ajax同步
			$.ajaxSettings.async = false;
			for(var i=0;i<area.length;i++){
				var areaUrl = "mapLayer/" + area[i] + ".json";
				$.getJSON(areaUrl, function(dataMap) {
					var data = dataMap.features;				
					for (var j=0;j<data.length;j++) {
						temp.push(data[j].attributes.Name+"["+area[i]+"]");
					}
				});
			}
			//恢复ajax异步
			$.ajaxSettings.async = true;
			// 使用ajax获取后台所有基站数据
			$.ajax({
				type : "GET",
				url : "bs/map/data",
				dataType : "json",
				success : function(dataMap) {
					var tempData = dataMap.items;
					var data = dataWithoutZero(tempData);
					for(var i=0;i<data.length;i++){
						temp.push(data[i].bsId+":"+data[i].name);
					}
				}
			});
			
			$("#search_kw").autocomplete({
				source : temp
			});
			
			$(document).on("mousedown", ".modal-header", function(e) {
				if ($(e.target).hasClass("close"))// 点关闭按钮不能移动对话框
					return;
				mouseDragDown = true;
				moveTartet = $(this).parent();
				mouseStartPoint = {
					"left" : e.clientX,
					"top" : e.clientY
				};
				oldP = moveTartet.offset();
			});
			$(document).on("mouseup", function(e) {
				mouseDragDown = false;
				moveTartet = undefined;
				mouseStartPoint = {
					"left" : 0,
					"top" : 0
				};
				oldP = {
					"left" : 0,
					"top" : 0
				};
			});
			$(document).on(
					"mousemove",
					function(e) {
						if (!mouseDragDown || moveTartet == undefined)
							return;
						var mousX = e.clientX;
						var mousY = e.clientY;
						if (mousX < 0)
							mousX = 0;
						if (mousY < 0)
							mousY = 25;
						mouseEndPoint = {
							"left" : mousX,
							"top" : mousY
						};
						var width = moveTartet.width();
						var height = moveTartet.height();
						mouseEndPoint.left = mouseEndPoint.left
								- (mouseStartPoint.left - oldP.left);// 移动修正，更平滑
						mouseEndPoint.top = mouseEndPoint.top
								- (mouseStartPoint.top - oldP.top);
						moveTartet.offset(mouseEndPoint);
					});
		});

//基本效果数据处理调用的函数
function baseMark(data){
	var objBoth = [];
	var k;
	var objConnect = [];
	var objBreak = [];
	var objTypeOneConnect = [];
	var objTypeOneBreak = [];
	var objTypeTwoConnect = [];
	var objTypeTwoBreak = [];
	for (k = 0; k < data.length; k++) {
		if(data[k].bsStatus==0 && data[k].type==0){
			var y = {
				name : data[k].name,
				id : data[k].bsId,
				bsStatus : data[k].bsStatus
				};
			objConnect.push(y);
		}else if(data[k].bsStatus==1 && data[k].type==0){
			var y = {
					name : data[k].name,
					id : data[k].bsId,
					bsStatus : data[k].bsStatus
					};
			objBreak.push(y);
		}else if(data[k].bsStatus==0 && data[k].type==1){
			var y = {
					name : data[k].name,
					id : data[k].bsId,
					bsStatus : data[k].bsStatus
					};
			objTypeOneConnect.push(y);
		}else if(data[k].bsStatus==1 && data[k].type==1){
			var y = {
					name : data[k].name,
					id : data[k].bsId,
					bsStatus : data[k].bsStatus
					};
			objTypeOneBreak.push(y);
		}else if(data[k].bsStatus==0 && data[k].type==2){
			var y = {
					name : data[k].name,
					id : data[k].bsId,
					bsStatus : data[k].bsStatus
					};
			objTypeTwoConnect.push(y);
		}else if(data[k].bsStatus==1 && data[k].type==2){
			var y = {
					name : data[k].name,
					id : data[k].bsId,
					bsStatus : data[k].bsStatus
					};
			objTypeTwoBreak.push(y);
		}else{
			//未标示基站bsStatuss
			var y = {
					name : data[k].name,
					id : data[k].bsId,
					bsStatus : data[k].bsStatus
					};
			objBreak.push(y);
		}			
	}
	objBoth.push(objConnect);
	objBoth.push(objBreak);
	objBoth.push(objTypeOneConnect);
	objBoth.push(objTypeOneBreak);
	objBoth.push(objTypeTwoConnect);
	objBoth.push(objTypeTwoBreak);
	return objBoth;
}

//闪烁效果需求数据处理调用的函数
function flashMark(data){
	// 闪烁提示基站显示数据	
	var j;
	var objTemp = [];	
	for (j = 0; j < data.length; j++) {
		if(data[j].bsStatus!=0 && data[j].zone!="简阳" && data[j].status!=0){
			var x = {
					name : data[j].name,
					id : data[j].bsId
				};
				objTemp.push(x);
		}							
	}
	return objTemp;
}
//去除经纬度为0以及基站未启用的数据
function dataWithoutZero(data){
	var newData = [];
	for(var i=0;i<data.length;i++){
		if(data[i].lat!=0 && data[i].lng!=0){
			/*if(data[i].status!=0){*/
				newData.push(data[i]);
			/*}*/		
		}
	}
	return newData;
}

function displayProp(obj){      
    var names="";         
    for(var name in obj){         
       names+=name+": "+obj[name]+", ";    
    }    
    console.log(names);    
}

xh.secondsFormatDay = function( second_time ){  
	  
	var time = parseInt(second_time) + "秒";  
	if( parseInt(second_time )> 60){  
	  
	    var second = parseInt(second_time) % 60;  
	    var min = parseInt(second_time / 60);  
	    time = min + "分" + second + "秒";  
	      
	    if( min > 60 ){  
	        min = parseInt(second_time / 60) % 60;  
	        var hour = parseInt( parseInt(second_time / 60) /60 );  
	        time = hour + "小时" + min + "分" + second + "秒";  
	  
	        if( hour > 24 ){  
	            hour = parseInt( parseInt(second_time / 60) /60 ) % 24;  
	            var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );  
	            time = day + "天" + hour + "小时" + min + "分" + second + "秒";  
	        }  
	    }  
	      
	  
	}  
	  
	return time;          
	}  
//取消右键事件
window.onload = function(){
    //去掉默认的contextmenu事件，否则会和右键事件同时出现。
    document.oncontextmenu = function(e){
        e.preventDefault();
    };
    /*document.getElementById("test").onmousedown = function(e){
        if(e.button ==2){
            alert("你点了右键");
        }else if(e.button ==0){
            alert("你点了左键");
        }else if(e.button ==1){
            alert("你点了滚轮");
        }
    }*/
}

//全局定时刷新
function refreshForGis(){
	var appElement = document.querySelector('[ng-controller=map]');
	var $scope = angular.element(appElement).scope();
	//判断是否执行了级别和区域操作
	var operation=0;
	$(".levelChoose input").each(function(i){
		if($(this).prop("checked") == true){
			operation++;
		}
	});
	if(operation==0){
		//未执行任何操作
		console.log("未执行任何操作!!!")
		$scope.bothChoose("简阳");
	}else{
		//执行了级别或者区域
		console.log("执行了级别或区域操作!!!");
		$scope.bothChoose();
	}
}



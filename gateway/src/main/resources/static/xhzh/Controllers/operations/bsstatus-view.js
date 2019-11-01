/**
 * 终端状态
 */
if (!("xh" in window)) {
	window.xh = {};
};
/*require.config({
	paths : {
		echarts : '../../lib/echarts'
	}
});*/
var background = "#fff";
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
				//var fr=(parseInt(text)/1000000).toFixed(6)+"MHz";
			    
				return text+"Hz"
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

	app.controller("userstatus", function($scope, $http, $location) {
		$scope.count = "5";// 每页数据显示默认值
		$scope.bsId = $location.search().bsId;
		$scope.bsName = $location.search().bsName;
		$scope.title="";
		$scope.show=1;
		//发起请求开启当前基站视频流
		/*$.ajax({
			type : "GET",
			url : "../../camera/startById?bsId=" + $scope.bsId + "&window=" + $(window).width()/2*0.9,
			dataType : "json",
			success : function(result) {
				
			}
		});*/
		//end
		
		$scope.period = $location.search().period;
		var bsId = $scope.bsId;
		var pageSize = $("#page-limit").val();
		// 摄像头编号
		$scope.cameraId = function() {
			var bsId = $scope.bsId;
			return bsId;
		};
		$scope.serverCanvas=function(){
	    }
		/*$scope.serverCanvas();*/
		/*获取故障信息*/
		$scope.oneBsFault=function(){
			
			$http.get("../../bsstatus/oneBsFaultList?bsId="+$scope.bsId+"&start=0&limit=5").
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				xh.pagging(1, parseInt($scope.totals),$scope);
			});
		}

		// 基站下的bsc状态
		$scope.bsc = function(id) {
			var bsId = $scope.bsId;
			$scope.title="BSC";
			$scope.Id=id;
			$http.get("../../bsstatus/bsc?bsId=" + bsId+"&id="+id).success(
					function(response) {
						$scope.bscData = response.items;
						$scope.bscTotals = response.totals;
						$scope.time=response.items[0].updateTime;
						var record=0;
						for(var i=0;i<$scope.bscTotals;i++){
							if($scope.bscData[i].bscIsEnable>0){
								record++;
							}
						}
					
					   $scope.bscExists=record;
						
						
						
					});
		};
		//设备
		$scope.e=function(){
			var bsId = $scope.bsId;
			var id="";
			$http.get("../../bsstatus/bsr?bsId=" + bsId+"&id="+id).success(
					function(response) {
						$scope.bsrD = response.items;
			});
			$http.get("../../bsstatus/bsc?bsId=" + bsId+"&id="+id).success(
					function(response) {
						$scope.bscD = response.items;
			});
			$http.get("../../bsstatus/dpx?bsId=" + bsId+"&id="+id).success(
					function(response) {
						$scope.dpxD= response.items;
			});
			$http.get("../../bsstatus/psm?bsId=" + bsId+"&id="+id).success(
					function(response) {
						$scope.psmD = response.items;
			});
		}
		// 基站下的bsr状态
		$scope.bsr = function(id) {
			var bsId = $scope.bsId;
			$scope.title="BSR";
			$scope.Id=id;
			$http.get("../../bsstatus/bsr?bsId=" + bsId+"&id="+id).success(
					function(response) {
						$scope.bsrData = response.items;
						$scope.bsrTotals = response.totals;
						$scope.time=response.items[0].updateTime;
						var record=0;
						for(var i=0;i<$scope.bsrTotals;i++){
							if($scope.bsrData[i].bsrIsEnable>0){
								record++;
							}
						}
					
					   $scope.bsrExists=record;
					});
		};
		// 基站下的dpx状态
		$scope.dpx = function(id) {
			var bsId = $scope.bsId;
			$scope.title="DPX";
			$scope.Id=id;
			$http.get("../../bsstatus/dpx?bsId=" + bsId+"&id="+id).success(
					function(response) {
						$scope.dpxData = response.items;
						$scope.dpxTotals = response.totals;
						$scope.time=response.items[0].updateTime;
						
						var record=0;
						for(var i=0;i<$scope.dpxTotals;i++){
							if($scope.dpxData[i].retLoss>0 && $scope.dpxData[i].fwdPa>0){
								record++;
							}
						}
					
					   $scope.dpxExists=record;
					});
		};
		// 基站下的psm状态
		$scope.psm = function(id) {
			var bsId = $scope.bsId;
			$scope.title="PSM";
			$scope.Id=id;
			$http.get("../../bsstatus/psm?bsId=" + bsId+"&id="+id).success(
					function(response) {
						$scope.psmData = response.items;
						$scope.psmTotals = response.totals;
						$scope.time=response.items[0].updateTime;
						var record=0;
						for(var i=0;i<$scope.psmTotals;i++){
							if($scope.psmData[i].bdTmp1>0 || $scope.psmData[i].bdTmp2>0 || $scope.psmData[i].bdTmp3>0){
								record++;
							}
						}
					
					   $scope.psmExists=record;
					   console.log("psm->"+ $scope.psmExists)
					});
		};
		
		// 根据基站ID查找基站BSR配置信息
		$scope.bsrconfigByBsId = function() {
			var bsId = $scope.bsId;
			$http.get("../../bs/bsrconfigByBsId?bsId=" + bsId).success(
					function(response) {
						$scope.bsrconfigData = response.items;
						$scope.bsrconfigTotals = response.totals;
					});
		};

		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
		};
		$scope.loadTemp = function(temp) {
			if(temp==null){
				$("#temp-div").html("<span style='color:red;font-weight:700;'>温度数据获取失败</span>");
				return;
			}else{
				$("#temp-div").html("");
			}
			// 基于准备好的dom，初始化echarts实例
			var chart = null;
			if (chart != null) {
				chart.clear();
				chart.dispose();
			}
			require([ 'echarts', 'echarts/chart/gauge' ], function(ec) {
				chart = ec.init(document.getElementById('temp-div'));
				/*
				 * chart.showLoading({ text : '正在努力的读取数据中...' });
				 */
				var option = {
						/*backgroundColor : '#fff',*/
						tooltip : {
							formatter : "{a} <br/>{b} : {c}℃"
						},
						series : [ {
							name : '温度',
							type : 'gauge',
							min : 0,
							max : 90,
							splitNumber : 10, // 分割段数，默认为5

							axisLine : { // 坐标轴线橙红色
								lineStyle : { // 属性lineStyle控制线条样式
									/*color : [ [ 0.2, 'lime' ], [ 0.8, '#1e90ff' ],
											[ 1, '#ff4500' ] ],*/
									color:'#FF00FF',
									width : 3,
									/*shadowColor : '#FF00FF', // 默认透明
	*/								shadowBlur : 10
								}
							},
							axisTick : { // 坐标轴小标记
								length : 10, // 属性length控制线长
								lineStyle : { // 属性lineStyle控制线条样式
									color : 'auto',
									shadowColor : '#FF00FF', // 默认透明
									shadowBlur : 10
								}
							},
							axisLabel : { // 坐标轴小标记
								textStyle : { // 属性lineStyle控制线条样式
									fontWeight : 'bolder',
									color : '#000',
									shadowColor : '#FF00FF', // 默认透明
									shadowBlur : 10
								}
							},
							splitLine : { // 分隔线
								length : 15, // 属性length控制线长
								lineStyle : { // 属性lineStyle（详见lineStyle）控制线条样式
									width : 2,
									color : '#FF00FF',
									shadowColor : '#FF00FF', // 默认透明
									shadowBlur : 10
								}
							},
							pointer : { // 分隔线
								shadowColor : '#000', // 默认透明
								shadowBlur : 2,
								width:4
							},
							title : {
								textStyle : { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
									fontWeight : 'bolder',
									fontSize : 20,
									fontStyle : 'italic',
									color : '#000',
									shadowColor : '#fff', // 默认透明
									shadowBlur : 10
								}
							},
							detail : {
								backgroundColor : 'rgba(30,144,255,0.8)',
								borderWidth : 1,
								borderColor : '#fff',
								shadowColor : '#fff', // 默认透明
								shadowBlur : 5,
								offsetCenter : [ 0, '50%' ], // x, y，单位px
								textStyle : { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
									/* fontWeight: 'bolder', */
									color : '#000'
								}
							},
							data : [ {
								value : $scope.emhData.temp,
								name : '温度'
							} ]
						} ]
					};

				chart.setOption(option);

			});
		};
		/* 湿度 */
		$scope.loadDamp = function(damp) {
			if(damp==null){
				$("#damp-div").html("<span style='color:red;font-weight:700;'>湿度数据获取失败</span>");
				return;
			}else{
				$("#damp-div").html("");
			}
			
			var chart = null;
			if (chart != null) {
				chart.clear();
				chart.dispose();
			}
			require([ 'echarts', 'echarts/chart/gauge' ], function(ec) {
				chart = ec.init(document.getElementById('damp-div'));
				/*
				 * chart.showLoading({ text : '正在努力的读取数据中...' });
				 */
				var option = {
					/*backgroundColor : '#fff',*/
					tooltip : {
						formatter : "{a} <br/>{b} : {c}"
					},
					series : [ {
						name : '湿度',
						type : 'gauge',
						min : 0,
						max : 90,
						splitNumber : 10, // 分割段数，默认为5

						axisLine : { // 坐标轴线橙红色
							lineStyle : { // 属性lineStyle控制线条样式
								/*color : [ [ 0.2, 'lime' ], [ 0.8, '#1e90ff' ],
										[ 1, '#ff4500' ] ],*/
								color:'#FF4500',
								width : 3,
								/*shadowColor : '#FF4500', // 默认透明
*/								shadowBlur : 10
							}
						},
						axisTick : { // 坐标轴小标记
							length : 10, // 属性length控制线长
							lineStyle : { // 属性lineStyle控制线条样式
								color : 'auto',
								shadowColor : '#FF4500', // 默认透明
								shadowBlur : 10
							}
						},
						axisLabel : { // 坐标轴小标记
							textStyle : { // 属性lineStyle控制线条样式
								fontWeight : 'bolder',
								color : '#000',
								shadowColor : '#FF4500', // 默认透明
								shadowBlur : 10
							}
						},
						splitLine : { // 分隔线
							length : 15, // 属性length控制线长
							lineStyle : { // 属性lineStyle（详见lineStyle）控制线条样式
								width : 2,
								color : '#FF4500',
								shadowColor : '#FF4500', // 默认透明
								shadowBlur : 10
							}
						},
						pointer : { // 分隔线
							shadowColor : '#000', // 默认透明
	
							shadowBlur : 5,
							width:4
						},
						title : {
							textStyle : { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
								fontWeight : 'bolder',
								fontSize : 20,
								fontStyle : 'italic',
								color : '#000',
								shadowColor : '#fff', // 默认透明
								shadowBlur : 10
							}
						},
						detail : {
							backgroundColor : 'rgba(30,144,255,0.8)',
							borderWidth : 1,
							borderColor : '#fff',
							shadowColor : '#fff', // 默认透明
							shadowBlur : 5,
							offsetCenter : [ 0, '50%' ], // x, y，单位px
							textStyle : { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
								/* fontWeight: 'bolder', */
								color : '#000'
							}
						},
						data : [ {
							value : $scope.emhData.damp,
							name : '湿度'
						} ]
					} ]
				};

				chart.setOption(option);

			});
		};

		/* 查询数据 */
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
			$http.get("../../bsstatus/oneBsFaultList?bsId="+$scope.bsId+"&start="+start+"&limit="+pageSize)
					.success(function(response) {
						xh.maskHide();
						$scope.data = response.items;
						$scope.totals = response.totals;
						xh.pagging(page, parseInt($scope.totals), $scope);
					});
		};
		// 分页点击
		$scope.pageClick = function(page, totals, totalPages) {
			var pageSize = $("#page-limit").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}

			$http.get("../../bsstatus/oneBsFaultList?bsId="+$scope.bsId+"&start="+start+"&limit="+pageSize)
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
						$scope.data = response.items;
						$scope.totals = response.totals;
					});

		};
		
		// 获取环控设备状态

		$scope.emh = function() {
			$scope.title="环控";
			$scope.Id="";
			$http.get(
					"../../bsstatus/bsEmh?siteId=" + $scope.bsId + "&period="
							+ $scope.period).success(function(response) {
				$scope.emhData = response;
				$scope.emhAlarm = response.alarmItems;

				/*$scope.loadTemp($scope.emhData.temp);
				$scope.loadDamp($scope.emhData.damp);*/
				

			});

		}
		$scope.e();

		//$scope.equip();
		//$scope.emh();
		$scope.search(1);
		/*setInterval(function() {

			$scope.equip();
			$scope.emh();
		}, 20000);*/

	});
};
//创建结点
xh.createNewNode=function(x, y, w, h, text,type,icon,dir){
    var node = new JTopo.Node(text);
    node.setLocation(x, y);
    //node.setLocation(scene.width * Math.random(), scene.height * Math.random());
    node.setSize(w, h);
    node.setImage(icon,true);
    node.dragable=true;
    node.shadow =true;
    if(type=="circle"){
    	node.layout = {type: 'circle',radius: 150};
    }else{
    	node.layout = {type: 'tree', direction: dir, width: 50, height: 70};
    }
    
    scene.add(node);
    return node;
}
xh.createRootNode=function(x, y, w, h, text,type){
    var node = new JTopo.Node(text);
    node.setLocation(x, y);
    node.setSize(w, h);
    node.shadow =true;
    node.setImage("../../Resources/images/top/switch.png",true);
    scene.add(node);
    return node;
}
//简单连线
xh.createNewLink=function(nodeA, nodeZ, text,lineType){
    var link = new JTopo.Link(nodeA, nodeZ, text);        
    link.lineWidth = 1; // 线宽
    link.bundleOffset = 60; // 折线拐角处的长度
    link.bundleGap = 20; // 线条之间的间隔
    link.textOffsetY = 3; // 文本偏移量（向下3个像素）
    link.strokeColor = '248,248,255';
   
    
    scene.add(link);
    return link;
}
// 时间格式化
xh.getTime = function(time) {
	var datetime = "";
	var tt = parseInt(time);
	var datah = Math.floor(tt * 3600);
	var datem = Math.floor(tt * 3600);
	var dates = tt % 60;
	if (datem < 10) {
		datem = "0" + datem
	}
	if (dates < 10) {
		dates = "0" + dates
	}
	datetime = datem + ":" + dates;
	return datetime;
}
xh.formatSeconds = function(value) {
	var theTime = parseInt(value);// 秒
	var theTime1 = 0;// 分
	var theTime2 = 0;// 小时
	// alert(theTime);
	if (theTime > 60) {
		theTime1 = parseInt(theTime / 60);
		theTime = parseInt(theTime % 60);
		// alert(theTime1+"-"+theTime);
		if (theTime1 > 60) {
			theTime2 = parseInt(theTime1 / 60);
			theTime1 = parseInt(theTime1 % 60);
		}
	}
	var result = "" + parseInt(theTime) + "秒";
	if (theTime1 > 0) {
		result = "" + parseInt(theTime1) + "分" + result;
	}
	if (theTime2 > 0) {
		result = "" + parseInt(theTime2) + "小时" + result;
	}
	return result;
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
/* 基站属性 */
xh.bsNature = function(bsId) {
	var $scope = angular.element(appElement).scope();
	$scope.radioUser(bsId);

};
// 刷新数据
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();

};
xh.excelToBsstatus = function() {
	window.location.href = "../../bsstatus/ExcelToStationStatus";
};

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
/**
 * 摄像头相关配置
 */
var g_iWndIndex = 0;
function cameraConfig(cameraInfo){
	console.log(cameraInfo.deviceIP+"==="+cameraInfo.devicePort+"==="+cameraInfo.loginName+"==="+cameraInfo.password)
	// 检查插件是否已经安装过
	var iRet = WebVideoCtrl.I_CheckPluginInstall();
	if (-2 == iRet) {
		alert("您的浏览器不支持NPAPI插件！");
		return;
	} else if (-1 == iRet) {
		alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
		return;
	}

	var oPlugin = {
		iWidth : 800, // plugin width
		iHeight : 420
	// plugin height
	};

	// 初始化插件参数及插入插件
	WebVideoCtrl.I_InitPlugin(oPlugin.iWidth, oPlugin.iHeight, {
		bWndFull : true,// 是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
		iWndowType : 1,
		cbSelWnd : function(xmlDoc) {
			g_iWndIndex = $(xmlDoc).find("SelectWnd").eq(0).text();
		}
	});
	WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");

	// 检查插件是否最新
	if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
		alert("检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！");
		return;
	}

	var oLiveView = {
		iProtocol: 1,			// protocol 1：http, 2:https
		szIP: cameraInfo.deviceIP,	// protocol ip
		szPort: cameraInfo.devicePort,			// protocol port
		szUsername: cameraInfo.loginName,	// device username
		szPassword: cameraInfo.password,	// device password
		iStreamType: 1,			// stream 1：main stream  2：sub-stream  3：third stream  4：transcode stream
		iChannelID: 1,			// channel no
		bZeroChannel: false		// zero channel
	};

	// 登录设备
	WebVideoCtrl.I_Login(oLiveView.szIP, oLiveView.iProtocol, oLiveView.szPort,
			oLiveView.szUsername, oLiveView.szPassword, {
				success : function(xmlDoc) {
					// 开始预览
					WebVideoCtrl.I_StartRealPlay(oLiveView.szIP, {
						iStreamType : oLiveView.iStreamType,
						iChannelID : oLiveView.iChannelID,
						bZeroChannel : oLiveView.bZeroChannel
					});
				}
			});

	// 关闭浏览器
	$(window).unload(function() {
		WebVideoCtrl.I_Stop();
	});
}

// 停止预览
function clickStopRealPlay() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex), szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Stop();
		if (0 == iRet) {
			szInfo = "停止预览成功！";
		} else {
			szInfo = "停止预览失败！";
		}
	}
}

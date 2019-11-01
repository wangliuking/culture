if (!("xh" in window)) {
	window.xh = {};
};
var frist = 0;
xh.load = function() {
	var app = angular.module("app", []);
	var caller = $("#caller").val();
	var called = $("#called").val();
	var bsId=$("#Call_TS_Id").val();
	var pageSize = $("#page-limit").val();
	$("#starttime").val(xh.getDay());
	$("#endtime").val(xh.getOneDay());
	app.filter('bsIdFormat', function() { // 可以注入依赖
		return function(text) {
			if(parseInt(text)>1200 && parseInt(text)<2000){
				return parseInt(text)%1000
			}else{
				return text;
			}
		};
	});
	app.controller("audio", function($scope, $http) {
		xh.maskShow();
		$scope.count = "20";// 每页数据显示默认值
		
		$http.get(
				"../../call/list?bsId="+bsId+"&caller=" + caller + "&called=" + called + ""
						+ "&starttime="+xh.getDay()+"&endtime=" + xh.getOneDay()
						+ "&start=0&limit=" + pageSize).success(
				function(response) {
					xh.maskHide();
					$scope.data = response.items;
					$scope.totals = response.totals;
					$scope.starttime = xh.getDay();
					$scope.endtime = xh.getOneDay();
					xh.pagging(1, parseInt($scope.totals));
				});
		// 刷新数据
		$scope.refresh = function() {
			var starttime = $("#starttime").val();
			var endtime = $("#endtime").val();
			var date1=new Date(starttime).getTime();
			var date2=new Date(endtime).getTime();
			var date=date2-date1;
			if(date2<date1){
				alert("时间区间错误");
				return;
			}
			//计算出相差天数  
		    var days=Math.floor(date/(24*3600*1000)); 
		    if(days>7){
				alert("时间区间错误,只提供时间段7天以内的数据");
				return;
			}
			$scope.search(1);

		};
		// 查询数据
		$scope.search_1 = function(page) {
			$scope.search(1);

		};
		//播放语音文件
		$scope.play=function(index){
			layer.closeAll();
			var path=$scope.data[index].Call_Path;
			path=path.substring(1);
	
			
			var html={
					  type: 2,
					  title:'语音播放器',
					  area: ['340px', '200px'],
					  shade: 0,
					  /*skin: 'layui-layer-rim', //加上边框*/					  
					  content: ["../../Views/operations/play.jsp?playerID="+path, 'no']
					};
			layer.open(html);
			
		};
		/* 下载文件 */
		$scope.download = function(index) {
			var path="/"+$scope.data[index].Call_Path;
			var index=path.lastIndexOf("/");
			var name=path.substring(index+1,path.length);	
			var downUrl = "../../call/download?filePath="+path+"&fileName=" + name;
			window.open(downUrl, '_self',
					'width=1,height=1,toolbar=no,menubar=no,location=no');
		};
		/* 播放录音 */
		$scope.play_click = function(sef, audioName, index) {
			//这里因为本地数据录音路径名为ModelTest*.mp3 ，因此设置默认值为ModelTest1.mp3,
			//正常使用是audioName传入录音文件名。（即数据库中call_Path字段）
			//audioName = "ModelTest1.mp3"
			//测试默认值
			var url = "../../Resources/audio/" + audioName;
				
			$scope.audioName=audioName;	
			$scope.playUrl=url;
			$("#audioPlay").modal('show');	
			
			
			/*var div = document.getElementById('div' + index);
			div.innerHTML = '<embed src="' + url
					+ '" loop="0" autostart="true" height="60"></embed>';
			var emb = document.getElementsByTagName('EMBED')[0];
			if (emb) { 这里可以写成一个判断 wav 文件是否已加载完毕，以下采用setTimeout模拟一下 
				div = document.getElementById('div2');
				div.innerHTML = 'loading: ' + emb.src;
				sef.disabled = true;
				setTimeout(function() {
					div.innerHTML = '';
				}, 5000);
			}*/
		};
		/* 查询数据 */
		$scope.search = function(page) {
			var pageSize = $("#page-limit").val();
			var caller = $("#caller").val();
			var called = $("#called").val();
			var bsId=$("#Call_TS_Id").val();
			var starttime = $("#starttime").val();
			var endtime = $("#endtime").val();
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
					"../../call/list?bsId="+bsId+"&caller=" + caller + "&called=" + called + ""
					+ "&starttime="+starttime+"&endtime=" + endtime
					+ "&start=0&limit=" + pageSize).success(function(response) {
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				xh.pagging(page, parseInt($scope.totals), $scope);
			});
		};

		// 分页点击
		$scope.pageClick = function(page) {
			var pageSize = $("#page-limit").val();
			var caller = $("#caller").val();
			var called = $("#called").val();
			var bsId=$("#Call_TS_Id").val();
			var starttime = $("#starttime").val();
			var endtime = $("#endtime").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			xh.maskShow();
			$http.get(
					"../../call/list?bsId"+bsId+"&caller=" + caller + "&called=" + called
							+ "" + "&starttime=" + starttime + "&endtime="
							+ endtime + "&start=" + start + "&limit="
							+ pageSize).success(function(response) {
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
			});

		};

	});
};

xh.download = function() {
	var $scope = angular.element(appElement).scope();
	var filename = $scope.checkData.fileName;
	console.log("filename=>" + filename);
	var downUrl = "../../call/download?fileName=" + filename;
	window.open(downUrl, '_self',
			'width=1,height=1,toolbar=no,menubar=no,location=no');
};

/* 查询数据 */
xh.search = function(page) {
	var appElement = document.querySelector('[ng-controller=audio]');
	var $scope = angular.element(appElement).scope();
	var pageSize = $("#page-limit").val();
	var caller = $("#caller").val();
	var called = $("#called").val();
	var bsId=$("#Call_TS_Id").val();
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	var start = 1, limit = pageSize;
	page = parseInt(page);
	if (page <= 1) {
		start = 0;
		limit = pageSize;
	} else {
		start = (page - 1) * pageSize;
		limit = page * pageSize;
	}
	xh.maskShow();
	$.ajax({
		url : '../../call/list',
		data : {
			bsId:bsId,
			caller : caller,
			called : called,
			starttime : starttime,
			endtime : endtime,
			start : start,
			limit : limit
		},
		type : 'GET',
		dataType : "json",
		async : false,
		success : function(response) {
			xh.maskHide();
			$scope.data = response.items;
			$scope.totals = response.totals;
			xh.pagging(page, parseInt($scope.totals));
		},
		failure : function(response) {
			xh.maskHide();
		}
	});
};
/* 数据分页 */
xh.pagging = function(currentPage, totals) {
	var appElement = document.querySelector('[ng-controller=audio]');
	var $scope = angular.element(appElement).scope();
	var pageSize = $("#page-limit").val();
	var totalPages = (parseInt(totals, 10) / pageSize) < 1 ? 1 : Math
			.ceil(parseInt(totals, 10) / pageSize);
	var start = 1;
	var end = pageSize;
	if (totalPages > 1) {
		start = currentPage + 1 * pageSize;
		end = (currentPage + 1) * pageSize;
	} else {
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
				// xh.search(page);
				if (frist == 1) {
					$scope.pageClick(page);
				}
				frist = 1;

			}
		});
	}

};
xh.getDay=function()   
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
    var strYesterday=strYear+"-"+strMonth+"-"+strDay+" "+"00:00:00";   
    return  strYesterday;
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
    var strYesterday=strYear+"-"+strMonth+"-"+strDay+" "+"23:59:59";   
    return  strYesterday;
}
xh.dateMin=function(time1,time2){

  
   /* //计算出小时数  
  
    var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数  
    var hours=Math.floor(leave1/(3600*1000))  
    //计算相差分钟数  
    var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数  
    var minutes=Math.floor(leave2/(60*1000))  
    //计算相差秒数  
    var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数  
    var seconds=Math.round(leave3/1000)  
     */
	
}
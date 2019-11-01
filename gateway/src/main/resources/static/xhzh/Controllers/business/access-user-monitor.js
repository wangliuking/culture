/**
 * 资产管理
 */
if (!("xh" in window)) {
	window.xh = {};
};

var appElement = document.querySelector('[ng-controller=xhcontroller]');
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
	app.filter('timetemp', function() { //可以注入依赖
	    return function(text) {
	        return xh.timeStamp(text,new Date());
	    };
	});

	app.controller("xhcontroller", function($scope, $http) {
		$scope.count = "15";//每页数据显示默认值
		/* 获取用户权限 */
		$http.get("../../web/loginUserPower").success(
				function(response) {
					$scope.up = response;
				});
		$http.get("../../access/list").
		success(function(response){
			$scope.data = response.items;
			$scope.totals = response.totals;
			$scope.water();
		});
		
		
		/* 查询数据 */
		$scope.refresh = function() {
		
			$http.get("../../access/list").
			success(function(response){
				xh.maskHide();
				$scope.data = response.items;
				$scope.totals = response.totals;
				
			});
		};
		$scope.water=function(){
			for(var i=0;i<$scope.totals;i++){
				xh.waterstatus($scope.data[i].id,$scope.data[i].status);	
				
			}
		}
		setInterval(function(){
			$scope.water();
		}, 300);
		
		
	});
	
};
window.onload=function(){
	var $scope = angular.element(appElement).scope();
	$scope.water();
	
};

xh.showWater=function(){
	window.onload=function(){
		var $scope = angular.element(appElement).scope();
		$scope.water();
	};
}

xh.waterstatus=function(id,status){
	var waterColor='red';
	var txt='断开';
	if(parseInt(status)==1){
		waterColor="green";
		txt="正常";
	}else{
		waterColor="red"
	    txt='断开'
	}
	$('#water'+id).waterbubble({
		radius : 40,
		lineWidth : 2,
		data : 0.7,
		waterColor : waterColor,
		textColor : '#fff',
		txt : txt,
		font : 'bold 20px "Microsoft YaHei"',
		wave : true,
		animation : true
	});
}
xh.timeStamp=function(start,end){ 
	
	var time1=new Date(start);
	var time2=new Date(end);
	var second_time=(time2.getTime()-time1.getTime())/1000;
	
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

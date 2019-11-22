
if (!("xh" in window)) {
	window.xh = {};
};
var appElement = document.querySelector('[ng-controller=index]');
var loginUser;
var structure;
xh.load = function() {
	var app = angular.module("app", []);
	app.controller("index", function($scope, $http) {
		$scope.totals=0;
		$scope.mshow=0;
		$scope.voiceTag=0;
		if(xh.getcookie("skin")!=null){
			$('body').attr('id', xh.getcookie("skin"));
		}else{
			$('body').attr('id', "skin-blur-ocean");
		}

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

        //查询公告信息
        $scope.getMarquee = function () {
            $http.get("../../selectMarquee").
            success(function(response){
                console.log(response);
                $("#marqueeInfo").val(response.data)
                $("#marqueeShow").text(response.data);
            });
        }
        $scope.getMarquee();

        //修改公告信息
        $scope.updateMarquee = function () {
            var marquee = $("#marqueeInfo").val();
            $http.get("../../updateMarquee?marquee="+marquee).
            success(function(response){
                $("#marqueeShow").text(marquee);
                $("#marqueeInfo").css("display","none");
                $("#marqueeShow").css("display","block");
            });
        }

	});
};
/* 获取cookie */
xh.getcookie = function(name) {
	var strcookie = document.cookie;
	var arrcookie = strcookie.split(";");
	for (var i = 0; i < arrcookie.length; i++) {
		var arr = arrcookie[i].split("=");
		if (arr[0].match(name) == name)
			return arr[1];
	}
	return "";
};

xh.showMarqueeEdit = function () {
    $("#marqueeInfo").css("display","block");
    $("#marqueeShow").css("display","none");
}


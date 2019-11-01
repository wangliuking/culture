if (!("xh" in window)) {
	window.xh = {};
};

var app = angular.module("app", []);
xh.load = function() {
	app.controller("nvrex", function($scope, $http) {
		
		var windowHeight = $(window).height()-80;
		$("#objectctrl").css("height",windowHeight);
		
		$http.get("../../gonsuncn/selectNVRChannels").success(function(response) {
			$scope.channelsData = response.items;
		});
		
		$scope.click2GetChannel=function(){
			$scope.currentChannel = $scope.sn;
		}
	});
};
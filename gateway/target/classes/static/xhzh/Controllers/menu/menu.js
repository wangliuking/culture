/**
 * 用户管理
 */
if (!("xh" in window)) {
	window.xh = {};
};
var appElement = document.querySelector('[ng-controller=menu]');
xh.load = function() {
	var app = angular.module("app", []);
	app.controller("menu", function($scope, $http) {
        $http.get("../../../getLoginUser").success(function(response) {
            $scope.power = response;
            console.log($scope.power);
        });

	});
};

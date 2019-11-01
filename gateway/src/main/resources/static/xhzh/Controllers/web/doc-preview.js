/**
 * 用户管理
 */
if (!("xh" in window)) {
	window.xh = {};
};
var frist = 0;
var appElement = document.querySelector('[ng-controller=user]');
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
	app.config([ '$locationProvider', function($locationProvider) {
		$locationProvider.html5Mode({
			enabled : true,
			requireBase : false
		});
	} ]);
	app.controller("doc", function($scope, $http,$location) {
		var fileName=$location.search().fileName;
		var path=$location.search().filePath;
		/*var fileName="7577c34699cc02b412c7f71504765bae-廖力慧.doc";
		var path="../../Resources/upload/asset/";*/
		xh.showView(fileName,path);
	});
};
xh.showView=function(name,path){
	var width = $("#c").width();
	var height = $(document).height()-4;
	$("#viewer").css("width", width+"px");
	$("#viewer").css("height", height + "px");
	$("#viewer").css("padding-left","5px");
	$("#viewer").css("display", "block");
	name = name.substring(0, name.lastIndexOf(".")) + ".swf";
	var fp = new FlexPaperViewer('../../lib/FlexPaper_1.4.5_flash/js/FlexPaperViewer',
			'viewer', {
				config : {
					SwfFile : escape(path + name),
					Scale : 1.0,
					ZoomTransition : 'easeOut',
					ZoomTime : 0.5,
					ZoomInterval : 0.2,
					FitPageOnLoad : false,
					FitWidthOnLoad : false,
					FullScreenAsMaxWindow : false,
					ProgressiveLoading : false,
					MinZoomSize : 0.2,
					MaxZoomSize : 5,
					SearchMatchAll : false,
					/* InitViewMode : 'SinglePage', */

					ViewModeToolsVisible : true,
					ZoomToolsVisible : true,
					NavToolsVisible : true,
					CursorToolsVisible : true,
					SearchToolsVisible : true,

					localeChain : 'zh_CN'
				}
			});
}

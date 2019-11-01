
if (!("xh" in window)) {
	window.xh = {};
};

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

var frist = 0;
var appElement = document.querySelector('[ng-controller=xhcontroller]');
var structure;
xh.load = function() {
	var app = angular.module("app", []);

    app.filter('upp', function() { //可以注入依赖
        return function(text) {
            if(text=="" || text==null)
                return "";
            else
                return parseFloat(text);
        };
    });

    app.filter('changeValueTwo', function() { //可以注入依赖
        return function(text) {
            var i = parseFloat(text);
            var a = Math.round(i*100);
            return a/100;
        };
    });

    app.filter('changeValueThree', function() { //可以注入依赖
        return function(text) {
            var i = parseFloat(text);
            var a = Math.round(i*1000);
            return a/1000;
        };
    });
	
	var pageSize = $("#page-limit").val();
    app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);
	app.controller("xhcontroller", function($scope,$http,$location) {
        xh.maskShow();
	    $scope.count = "15";//每页数据显示默认值
		$scope.businessMenu=true; //菜单变色

        //判断是否登录start
        $.ajax({
            type: 'GET',
            url: "../../getLoginUser",
            async: false,
            dataType: 'json',
            success: function(response){
                structure = response.structure;
            } ,
            error: function () {
                alert("登录已失效，请重新登录！");
                window.location.href = "../login.html";
                window.parent.location.href = "../login.html";
            }
        });
        //判断是否登录end

        $http.get("../../connect/selectAllSite?structure="+structure).
        success(function(response){
            var data = response.items;
            var siteNames = [];
            siteNames.push({"site_id":"","site_name":"全部站点"});
            for(var i=0;i<data.length;i++){
                siteNames.push({"site_id":data[i].site_id,"site_name":data[i].site_name});
            }
            console.log(siteNames);
            $scope.siteNames = siteNames;

            //添加页面的site-id
            $scope.siteNamesAdd = siteNames;
            //修改页面的site-id
            $scope.siteNamesEdit = siteNames;
        });

        $http.get("../../connect/selectAllRTU?structure="+structure).
        success(function(response){
            var data = response.items;
            var rtuNames = [];
            for(var i=0;i<data.length;i++){
                rtuNames.push({"rtu_id":data[i].rtu_id,"rtu_name":data[i].rtu_id});
            }
            $scope.rtuNames = rtuNames;

            //添加页面的rtu-id
            $scope.rtuNamesAdd = rtuNames;
            //修改页面的rtu-id
            $scope.rtuNamesEdit = rtuNames;

            var deviceNames = [{"id":"1","name":"SPD在线监测仪"},{"id":"2","name":"接地电阻在线监测仪"},{"id":"3","name":"雷电流在线监测仪"},{"id":"4","name":"静电在线监测仪"},{"id":"5","name":"温湿度在线监测仪"},{"id":"6","name":"倾斜度在线监测仪"},{"id":"7","name":"电气安全在线监测仪"},{"id":"8","name":"杂散电流在线监测仪"},{"id":"9","name":"阴极保护在线监测仪"}]
            $scope.deviceNames = deviceNames;
        });

        $scope.goSiteId = $location.search().id;
        var goSiteId = $location.search().id;
        if(typeof(goSiteId) == "undefined" ){
            goSiteId = "";
        }

        $http.get("../../spd/selectAllSPDHistory?start=0&limit="+pageSize+"&site_id="+goSiteId+"&structure="+structure).
        success(function(response){
            $scope.changeDeviceTypeShow = 1;
            $scope.data = response.items;
            $scope.totals = response.totals;
            console.log($scope.data);
            xh.pagging(1, parseInt($scope.totals), $scope);
            xh.maskHide();
        });

        /*导出测试*/
        $scope.test = function(){
            var deviceName = $("#deviceName").val();
            $scope.changeDeviceTypeShow = deviceName;

            var site_id = $("#siteName").val();
            var rtu_id = $("#rtuName").val();
            var location = $("#location").val();
            var deviceId = $("#deviceId").val();
            var startTime = $("#startTime").val();
            var endTime = $("#endTime").val();

            console.log(deviceName+" "+site_id+" "+rtu_id+" "+location+" "+deviceId);
            if(deviceName == 1){
                $.ajax({
                    type: 'GET',
                    url: "../../spd/selectAllSPDHistory?start=0&limit="+15+"&site_id="+site_id+"&rtu_id="+rtu_id+"&spd_number="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure,
                    async: false,
                    dataType: 'json',
                    success: function(response){
                        var dataCount = response.totals;
                        if(dataCount > 50000){
                            alert("查询数据量过多，请调整查询条件");
                        }else{
                            window.location.href = "../../spd/exportAllSPDHistory?site_id="+site_id+"&rtu_id="+rtu_id+"&rst_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure;
                        }
                    }
                });
            }else if(deviceName == 2){
                $.ajax({
                    type: 'GET',
                    url: "../../etcr/selectAllETCRHistory?start=0&limit="+15+"&site_id="+site_id+"&rtu_id="+rtu_id+"&rst_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure,
                    async: false,
                    dataType: 'json',
                    success: function(response){
                        var dataCount = response.totals;
                        if(dataCount > 50000){
                            alert("查询数据量过多，请调整查询条件");
                        }else{
                            window.location.href = "../../etcr/exportAllETCRHistoryExcel?site_id="+site_id+"&rtu_id="+rtu_id+"&rst_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure;
                        }
                    }
                });
            }else if(deviceName == 3){
                $.ajax({
                    type: 'GET',
                    url: "../../lightning/selectAllLightningHistory?start=0&limit="+15+"&site_id="+site_id+"&rtu_id="+rtu_id+"&ltn_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure,
                    async: false,
                    dataType: 'json',
                    success: function(response){
                        var dataCount = response.totals;
                        if(dataCount > 50000){
                            alert("查询数据量过多，请调整查询条件");
                        }else{
                            window.location.href = "../../lightning/exportAllLightningHistory?site_id="+site_id+"&rtu_id="+rtu_id+"&ltn_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure;
                        }
                    }
                });
            }else if(deviceName == 4){
                $.ajax({
                    type: 'GET',
                    url: "../../static/selectAllStaticHistory?start=0&limit="+15+"&site_id="+site_id+"&rtu_id="+rtu_id+"&staet_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure,
                    async: false,
                    dataType: 'json',
                    success: function(response){
                        var dataCount = response.totals;
                        if(dataCount > 50000){
                            alert("查询数据量过多，请调整查询条件");
                        }else{
                            window.location.href = "../../static/exportAllStaticHistory?site_id="+site_id+"&rtu_id="+rtu_id+"&staet_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure;
                        }
                    }
                });
            }else if(deviceName == 5){
                $.ajax({
                    type: 'GET',
                    url: "../../rsws/selectAllRswsHistory?start=0&limit="+15+"&site_id="+site_id+"&rtu_id="+rtu_id+"&hmt_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure,
                    async: false,
                    dataType: 'json',
                    success: function(response){
                        var dataCount = response.totals;
                        if(dataCount > 50000){
                            alert("查询数据量过多，请调整查询条件");
                        }else{
                            window.location.href = "../../rsws/exportAllRswsHistory?site_id="+site_id+"&rtu_id="+rtu_id+"&hmt_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure;
                        }
                    }
                });
            }else if(deviceName == 6){
                $.ajax({
                    type: 'GET',
                    url: "../../svt/selectAllSvtHistory?start=0&limit="+15+"&site_id="+site_id+"&rtu_id="+rtu_id+"&tilt_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure,
                    async: false,
                    dataType: 'json',
                    success: function(response){
                        var dataCount = response.totals;
                        if(dataCount > 50000){
                            alert("查询数据量过多，请调整查询条件");
                        }else{
                            window.location.href = "../../svt/exportAllSvtHistory?site_id="+site_id+"&rtu_id="+rtu_id+"&tilt_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure;
                        }
                    }
                });
            }else if(deviceName == 7){
                $.ajax({
                    type: 'GET',
                    url: "../../hc/selectAllHcHistory?start=0&limit="+15+"&site_id="+site_id+"&rtu_id="+rtu_id+"&es_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure,
                    async: false,
                    dataType: 'json',
                    success: function(response){
                        var dataCount = response.totals;
                        if(dataCount > 50000){
                            alert("查询数据量过多，请调整查询条件");
                        }else{
                            window.location.href = "../../hc/exportAllHcHistory?site_id="+site_id+"&rtu_id="+rtu_id+"&es_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure;
                        }
                    }
                });
            }else if(deviceName == 8){
                $.ajax({
                    type: 'GET',
                    url: "../../stray/selectAllStrayHistory?start=0&limit="+15+"&site_id="+site_id+"&rtu_id="+rtu_id+"&stret_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure,
                    async: false,
                    dataType: 'json',
                    success: function(response){
                        var dataCount = response.totals;
                        if(dataCount > 50000){
                            alert("查询数据量过多，请调整查询条件");
                        }else{
                            window.location.href = "../../stray/exportAllStrayHistory?site_id="+site_id+"&rtu_id="+rtu_id+"&stret_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure;
                        }
                    }
                });
            }else if(deviceName == 9){
                $.ajax({
                    type: 'GET',
                    url: "../../cat/selectAllCatHistory?start=0&limit="+15+"&site_id="+site_id+"&rtu_id="+rtu_id+"&cathode_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure,
                    async: false,
                    dataType: 'json',
                    success: function(response){
                        var dataCount = response.totals;
                        if(dataCount > 50000){
                            alert("查询数据量过多，请调整查询条件");
                        }else{
                            window.location.href = "../../cat/exportAllCatHistory?site_id="+site_id+"&rtu_id="+rtu_id+"&cathode_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure;
                        }
                    }
                });
            }


        }
		
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
		};

		/* 查询数据 */
		$scope.search = function(page) {
		    var deviceName = $("#deviceName").val();
            $scope.changeDeviceTypeShow = deviceName;

            var site_id = $("#siteName").val();
            var rtu_id = $("#rtuName").val();
            var location = $("#location").val();
            var deviceId = $("#deviceId").val();
            var startTime = $("#startTime").val();
            var endTime = $("#endTime").val();

            console.log(deviceName+" "+site_id+" "+rtu_id+" "+location+" "+deviceId);

			var pageSize = $("#page-limit").val();
			var start = 1, limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}

			if(deviceName == 1){
                $http.get("../../spd/selectAllSPDHistory?start=0&limit="+limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&spd_number="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }else if(deviceName == 2){
                $http.get("../../etcr/selectAllETCRHistory?start=0&limit="+limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&rst_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }else if(deviceName == 3){
                $http.get("../../lightning/selectAllLightningHistory?start=0&limit="+limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&ltn_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }else if(deviceName == 4){
                $http.get("../../static/selectAllStaticHistory?start=0&limit="+limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&staet_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }else if(deviceName == 5){
                $http.get("../../rsws/selectAllRswsHistory?start=0&limit="+limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&hmt_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }else if(deviceName == 6){
                $http.get("../../svt/selectAllSvtHistory?start=0&limit="+limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&tilt_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }else if(deviceName == 7){
                $http.get("../../hc/selectAllHcHistory?start=0&limit="+limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&es_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }else if(deviceName == 8){
                $http.get("../../stray/selectAllStrayHistory?start=0&limit="+limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&stret_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }else if(deviceName == 9){
                $http.get("../../cat/selectAllCatHistory?start=0&limit="+limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&cathode_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }
			

		};

		//分页点击
		$scope.pageClick = function(page, totals, totalPages) {
            var deviceName = $("#deviceName").val();

            var site_id = $("#siteName").val();
            var rtu_id = $("#rtuName").val();
            var location = $("#location").val();
            var deviceId = $("#deviceId").val();
            var startTime = $("#startTime").val();
            var endTime = $("#endTime").val();

			var pageSize = $("#page-limit").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}

            if(deviceName == 1){
                $http.get("../../spd/selectAllSPDHistory?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&spd_number="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    //xh.maskHide();
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
            }else if(deviceName == 2){
                $http.get("../../etcr/selectAllETCRHistory?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&rst_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    //xh.maskHide();
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
            }else if(deviceName == 3){
                $http.get("../../lightning/selectAllLightningHistory?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&ltn_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    //xh.maskHide();
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
            }else if(deviceName == 4){
                $http.get("../../static/selectAllStaticHistory?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&staet_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    //xh.maskHide();
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
            }else if(deviceName == 5){
                $http.get("../../rsws/selectAllRswsHistory?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&hmt_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    //xh.maskHide();
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
            }else if(deviceName == 6){
                $http.get("../../svt/selectAllSvtHistory?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&tilt_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    //xh.maskHide();
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
            }else if(deviceName == 7){
                $http.get("../../hc/selectAllHcHistory?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&es_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    //xh.maskHide();
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
            }else if(deviceName == 8){
                $http.get("../../stray/selectAllStrayHistory?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&stret_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    //xh.maskHide();
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
            }else if(deviceName == 9){
                $http.get("../../cat/selectAllCatHistory?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&cathode_id="+deviceId+"&location="+location+"&startTime="+startTime+"&endTime="+endTime+"&structure="+structure).
                success(function(response){
                    //xh.maskHide();
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
            }

		};
	});
};


// 刷新数据
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();
};

/* 数据分页 */
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
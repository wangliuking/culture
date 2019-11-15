
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

//设备名称和类型id映射
var deviceTypeForName = {"接地电阻":1,"雷电流":3,"静电":4,"温湿度":5,"倾斜度":6,"电气安全":7,"杂散电流":8,"阴极保护":9};

var frist = 0;
var appElement = document.querySelector('[ng-controller=xhcontroller]');
var structure;
var tempRTUId;
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
	
	var pageSize = $("#page-limit").val();
    app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);
	app.controller("xhcontroller", function($scope,$http,$location) {
        var pageSize = "";
		$scope.count = "15";//每页数据显示默认值
		$scope.businessMenu=true; //菜单变色
        $scope.rtuId = 0;

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
        $http.get("../../connect/selectAllRTU?structure="+structure).
        success(function(response){
            var data = response.items;
            var rtuNames = [];
            for(var i=0;i<data.length;i++){
                rtuNames.push({"rtu_id":data[i].rtu_id,"rtu_name":data[i].rtu_id});
            }
            $scope.rtuNames = rtuNames;
            $scope.industrys = ["医疗","气象","新能源","轨道交通","石油化工","国防军工","电力","通讯"]

            //判断是否需要直接显示RTU
            tempRTUId = $location.search().id;
            console.log("!!!!!!!!!!!!!");
            console.log(tempRTUId);
            console.log("!!!!!!!!!!!!!");
            $scope.rtuChooseId = tempRTUId;
            if(!isNaN(tempRTUId)){
                console.log("为数字，进来了！！！");
                $scope.searchDevicesByRTU(tempRTUId);
            }
        });

        //多级联动start
        $scope.changeIndustry = function(x){
            console.log(x);
            $http.get("../../connect/selectStructureList?industry="+x+"&structure="+structure).
            success(function(response){
                console.log(response);
                var nodedata = response.nodeList;
                var companys = [];
                for(var i=0;i<nodedata.length;i++){
                    companys.push({"id":nodedata[i].id,"name":nodedata[i].name});
                }
                $scope.companys = companys;

                var siteList = response.siteList;
                var siteNames = [];
                for(var i=0;i<siteList.length;i++){
                    siteNames.push({"id":siteList[i].site_id,"name":siteList[i].site_name});
                }
                $scope.siteNames = siteNames;

                var rtuList = response.rtuList;
                var rtuNames = [];
                for(var i=0;i<rtuList.length;i++){
                    rtuNames.push({"rtu_id":rtuList[i].rtu_id,"rtu_name":rtuList[i].rtu_id});
                }
                $scope.rtuNames = rtuNames;
            });
        }

        $scope.changeCompany = function(x){
            console.log(x);
            $http.get("../../connect/selectAllSite?site_company="+x+"&structure="+structure).
            success(function(response){
                var data = response.items;
                var siteNames = [];
                for(var i=0;i<data.length;i++){
                    siteNames.push({"id":data[i].site_id,"name":data[i].site_name});
                }
                $scope.siteNames = siteNames;
            });

            $http.get("../../connect/selectRTUListByCompany?site_company="+x+"&structure="+structure).
            success(function(response){
                var data = response.rtuList;
                var rtuNames = [];
                for(var i=0;i<data.length;i++){
                    rtuNames.push({"rtu_id":data[i].rtu_id,"rtu_name":data[i].rtu_id});
                }
                $scope.rtuNames = rtuNames;
            });
        }

        $scope.changeSite = function(x){
            console.log(x);
            $http.get("../../connect/selectAllRTU?site_id="+x+"&structure="+structure).
            success(function(response){
                var data = response.items;
                var rtuNames = [];
                for(var i=0;i<data.length;i++){
                    rtuNames.push({"rtu_id":data[i].rtu_id,"rtu_name":data[i].rtu_id});
                }
                $scope.rtuNames = rtuNames;
            });
        }
        //多级联动end

        $scope.searchDevicesByRTU = function(rtu_id){
            $(".popover").each(function(){
                $(this).popover('dispose');
            });

            if(rtu_id == -1){
                rtu_id = $("#testRTU").val();
            }
            //console.log("===");
            //console.log(rtu_id);
            if(rtu_id == null || rtu_id == ""){
                alert("请选择RTU！！！");
                return false;
            }
            $scope.rtuId = rtu_id;
            $http.get("../../connect/selectRTUById?id="+rtu_id).
            success(function(response){
                $scope.rtuData = response;
            });

            $http.get("../../total/selectDeviceNum?rtu_id="+rtu_id+"&structure="+structure).
            success(function(response){
                $scope.siteInfo = response.siteInfo;
                $scope.deviceOffCount = response.deviceOffCount;
                $scope.deviceWarningCount = response.deviceWarningCount;
                $scope.rtuNum = response.rtuNum;
                $scope.spdNum = response.spdNum;
                $scope.etcrNum = response.etcrNum;
                $scope.lightningNum = response.lightningNum;
                $scope.staticNum = response.staticNum;
                $scope.rswsNum = response.rswsNum;
                $scope.svtNum = response.svtNum;
                $scope.hcNum = response.hcNum;
                $scope.strayNum = response.strayNum;
                $scope.catNum = response.catNum;

                $http.get("../../total/selectRTUPort?rtu_id="+rtu_id).
                success(function(response){
                    $scope.spdPort = response.spdPort;
                    $scope.spdPort1 = [1,2,3,4,5,6,7,8];
                    $scope.testPort1 = [1,2,3,4,5,6,7,8];
                    $scope.testRS1 = [1,2,3,4,5,6,7,8,9,10];
                    $scope.testList = response.testList;
                    $scope.rs485List = response.rs485List;
                    console.log($scope.rs485List);
                    console.log($scope.testList);
                });

            });
        }

        $scope.changeRSTabClass = function(x){
            var type = $scope.deviceTypeChoosed;
            var chooseDevId = $scope.modalDeviceId;
            if($scope.modal485Test == 1){
                //为模拟量
                return "nav-link active";
            }
            if(type == 1){
                if(x.rst_id == chooseDevId){
                    return "nav-link active";
                }else{
                    return "nav-link";
                }
            }else if(type == 3){
                if(x.ltn_id == chooseDevId){
                    return "nav-link active";
                }else{
                    return "nav-link";
                }
            }else if(type == 4){
                if(x.staet_id == chooseDevId){
                    return "nav-link active";
                }else{
                    return "nav-link";
                }
            }else if(type == 5){
                if(x.hmt_id == chooseDevId){
                    return "nav-link active";
                }else{
                    return "nav-link";
                }
            }else if(type == 6){
                if(x.tilt_id == chooseDevId){
                    return "nav-link active";
                }else{
                    return "nav-link";
                }
            }else if(type == 7){
                if(x.es_id == chooseDevId){
                    return "nav-link active";
                }else{
                    return "nav-link";
                }
            }else if(type == 8){
                if(x.stret_id == chooseDevId){
                    return "nav-link active";
                }else{
                    return "nav-link";
                }
            }else if(type == 9){
                if(x.cathode_id == chooseDevId){
                    return "nav-link active";
                }else{
                    return "nav-link";
                }
            }
        }

        $scope.changeRSContentClass = function(x){
            var type = $scope.deviceTypeChoosed;
            var chooseDevId = $scope.modalDeviceId;
            if($scope.modal485Test == 1){
                //为模拟量
                return "tab-pane show active";
            }
            if(type == 1){
                if(x.rst_id == chooseDevId){
                    return "tab-pane show active";
                }else{
                    return "tab-pane";
                }
            }else if(type == 3){
                if(x.ltn_id == chooseDevId){
                    return "tab-pane show active";
                }else{
                    return "tab-pane";
                }
            }else if(type == 4){
                if(x.staet_id == chooseDevId){
                    return "tab-pane show active";
                }else{
                    return "tab-pane";
                }
            }else if(type == 5){
                if(x.hmt_id == chooseDevId){
                    return "tab-pane show active";
                }else{
                    return "tab-pane";
                }
            }else if(type == 6){
                if(x.tilt_id == chooseDevId){
                    return "tab-pane show active";
                }else{
                    return "tab-pane";
                }
            }else if(type == 7){
                if(x.es_id == chooseDevId){
                    return "tab-pane show active";
                }else{
                    return "tab-pane";
                }
            }else if(type == 8){
                if(x.stret_id == chooseDevId){
                    return "tab-pane show active";
                }else{
                    return "tab-pane";
                }
            }else if(type == 9){
                if(x.cathode_id == chooseDevId){
                    return "tab-pane show active";
                }else{
                    return "tab-pane";
                }
            }
        }

        $scope.showRSDev = function(event,x){
            $(".popover").each(function(){
                $(this).popover('dispose');
            });
            //将状态设置为485，便于ng-class操作
            $scope.modal485Test = 0;
            var tempList = $scope.rs485List;
            var showList = [];
            for(var i=0;i<tempList.length;i++){
                if(tempList[i].port == x){
                    showList.push(tempList[i]);
                }
            }
            var tempHtml = "";
            var redColor = 'background:-webkit-linear-gradient(left, red , #EEAD0E);background:-o-linear-gradient(top, red, #EEAD0E);background:-moz-linear-gradient(top, red, #EEAD0E);background:linear-gradient(to top, red , #EEAD0E)';
            var greenColor = 'background:-webkit-linear-gradient(top, #008B00 , #00FF00);background:-o-linear-gradient(top, #008B00 , #00FF00);background:-moz-linear-gradient(top, #008B00 , #00FF00);background:linear-gradient(to top, #008B00 , #00FF00)';
            for(var i=0;i<showList.length;i++){
                var color = "";
                if(showList[i].alarm == 0 && showList[i].status == 0){
                    color = greenColor;
                }else{
                    color = redColor;
                }
                tempHtml += '<div class="tableStyle" style="width:auto;float: left;margin:2px;'+color+'"><a href="javascript:void(0);" style="color: white;display : block;" onclick="popToModel('+x+','+showList[i].deviceId+')">'+"ID:"+showList[i].deviceId+'</a></div>';
            }
            $(event.target).popover({
                placement:'bottom',
                /*title:'啦啦啦',*/
                html:true,
                content:'<div style="height: 70px;">'+tempHtml+'</div>'
            }).popover('hide').popover('show');
        }

        $scope.showRSDevice = function(x){
            var type = $scope.judgeDeviceRSType(x);
            $scope.setTimeType = 1;
            $scope.showDevice(type,1,x);
        }

        $scope.showTestDevice = function(x){
            //将状态设置为模拟，便于ng-class操作
            $scope.modal485Test = 1;

            var type = $scope.judgeDeviceTestType(x);
            $scope.setTimeType = 0;
            console.log(type);
            $scope.showDevice(type,0,x);
        }

        $scope.showDevice = function(type,test485,channel){
            //test485=0 模拟量 test485=1 485
            //console.log(type);
            var rtu_id = $scope.rtuId;
            $scope.deviceTypeChoosed = type;
            if(type == 1){
                //接触式地阻
                $http.get("../../etcr/selectETCROneType?rtu_id="+rtu_id).
                success(function(response){
                    var finalData1 = $scope.filterRSData(response,"rst_id",channel,test485);
                    $scope.ETCROneCount = finalData1.length;
                    $scope.ETCROneData = finalData1;
                    $http.get("../../etcr/selectETCRTwoType?rtu_id="+rtu_id).
                    success(function(response){
                        var finalData2 = $scope.filterRSData(response,"rst_id",channel,test485);
                        $scope.ETCRTwoCount = finalData2.length;
                        $scope.ETCRTwoData = finalData2;
                        $scope.ETCRAddCount = $scope.ETCROneCount+$scope.ETCRTwoCount;
                        console.log($scope.ETCRAddCount);
                        //console.log($scope.ETCROneData);
                        //console.log($scope.ETCRTwoData);
                    });
                });

                //非接触式地阻
                $http.get("../../etcr/selectETCRThreeType?rtu_id="+rtu_id).
                success(function(response){
                    var finalData = $scope.filterRSData(response,"rst_id",channel,test485);
                    //console.log(response);
                    $scope.ETCRThreeData = finalData;
                    $scope.ETCRThreeCount = finalData.length;
                });
            }else if(type == 3){
                //雷电流
                $http.get("../../lightning/selectLightningByRTU?rtu_id="+rtu_id).
                success(function(response){
                    var finalData = $scope.filterRSData(response,"ltn_id",channel,test485);
                    //console.log(response);
                    $scope.LightningData = finalData;
                });
            }else if(type == 4){
                //静电
                $http.get("../../static/selectStaticByRTU?rtu_id="+rtu_id).
                success(function(response){
                    var finalData = $scope.filterRSData(response,"staet_id",channel,test485);
                    //console.log(response);
                    $scope.StaticData = finalData;
                });
            }else if(type == 5){
                //温湿度
                $http.get("../../rsws/selectRswsByRTU?rtu_id="+rtu_id).
                success(function(response){
                    var finalData = $scope.filterRSData(response,"hmt_id",channel,test485);
                    //console.log(response);
                    $scope.RswsData = finalData;
                });
            }else if(type == 6){
                //倾斜度
                $http.get("../../svt/selectSvtByRTU?rtu_id="+rtu_id).
                success(function(response){
                    var finalData = $scope.filterRSData(response,"tilt_id",channel,test485);
                    //console.log(response);
                    $scope.SvtData = finalData;
                });
            }else if(type == 7){
                //电器安全
                $http.get("../../hc/selectHcByRTU?rtu_id="+rtu_id).
                success(function(response){
                    var finalData = $scope.filterRSData(response,"es_id",channel,test485);
                    //console.log(response);
                    $scope.HcData = finalData;
                });
            }else if(type == 8){
                //杂散电流
                $http.get("../../stray/selectStrayByRTU?rtu_id="+rtu_id).
                success(function(response){
                    var finalData = $scope.filterRSData(response,"stret_id",channel,test485);
                    console.log(response);
                    $scope.StrayData = finalData;
                });
            }else if(type == 9){
                //阴极保护
                $http.get("../../cat/selectCatByRTU?rtu_id="+rtu_id).
                success(function(response){
                    var finalData = $scope.filterRSData(response,"cathode_id",channel,test485);
                    //console.log(response);
                    $scope.CatData = finalData;
                });
            }
            $("#show").modal('show');
        }

        $scope.filterRSData = function(data,deviceId,channel,test485){
            console.log("test485:"+test485);
            if(test485 == 1){
                var finalData = [];
                var ids = [];
                var rs485List = $scope.rs485List;
                for(var i=0;i<rs485List.length;i++){
                    var port = rs485List[i]["port"];
                    if(port == channel){
                        ids.push(rs485List[i]["deviceId"]);
                    }
                }
                for(var i=0;i<data.length;i++){
                    var devId = data[i][deviceId];
                    var rtu_channel = data[i]["rtu_channel"];
                    for(var j=0;j<ids.length;j++){
                        if(rtu_channel == channel && devId == ids[j]){
                            finalData.push(data[i]);
                        }
                    }
                }
                return finalData;
            }else if(test485 == 0){
                var finalData = [];
                var tempKey;
                var testList = $scope.testList;
                for(var i=0;i<testList.length;i++){
                    for(var key in testList[i]){
                        if(key > 0 && key == channel){
                            tempKey = key;
                        }
                    }
                }
                for(var i=0;i<data.length;i++){
                    var devId = data[i][deviceId];
                    var ch = data[i]["rtu_channel"];
                    if(ch == tempKey && devId == 0){
                        finalData.push(data[i]);
                    }
                }
                return finalData;
            }

        }

        $scope.judgeDeviceRSType = function(x){
            var rs485List = $scope.rs485List;
            for(var i=0;i<rs485List.length;i++){
                var temp = rs485List[i];
                var port = temp["port"];
                if(x == port){
                    var type = temp["type"];
                    //console.log(type);
                    return deviceTypeForName[type];
                }
            }
            return 0;
        }

        $scope.judgeDeviceTestType = function(x){
            var testList = $scope.testList;
            for(var i=0;i<testList.length;i++){
                var temp = testList[i];
                if(temp[x] != null && temp[x] != ""){
                    return deviceTypeForName[temp[x]];
                }
            }
            return 0;
        }

        $scope.compareRS = function (x) {
            var rs485List = $scope.rs485List;
            var count = 0;
            var type;
            for(var i=0;i<rs485List.length;i++){
                var temp = rs485List[i];
                var port = temp["port"];
                if(x == port){
                    count++;
                    type = temp["type"];
                }
            }
            if(count>0){
                return type+"("+count+")";
            }else{
                return x;
            }
        };

        $scope.compareRSStyle = function (x) {
            var rs485List = $scope.rs485List;
            var count = 0;
            var status = 0;
            var alarm = 0;
            for(var i=0;i<rs485List.length;i++){
                var temp = rs485List[i];
                var port = temp["port"];
                if(x == port){
                    count++;
                    if(temp["status"] != null && temp["status"] != ""){
                        status = status + parseInt(temp["status"]);
                    }
                    if(temp["alarm"] != null && temp["alarm"] != ""){
                        alarm = alarm + parseInt(temp["alarm"]);
                    }
                }
            }
            if(count>0){
                if(status == 0 && alarm == 0){
                    return {"background" : "-webkit-linear-gradient(top, #008B00 , #00FF00)","background":"-o-linear-gradient(top, #008B00 , #00FF00)","background":"-moz-linear-gradient(top, #008B00 , #00FF00)","background":"linear-gradient(to top, #008B00 , #00FF00)","cursor":"pointer"};
                }else{
                    return {"background" : "-webkit-linear-gradient(left, red , #EEAD0E)","background":"-o-linear-gradient(top, red, #EEAD0E)","background":"-moz-linear-gradient(top, red, #EEAD0E)","background":"linear-gradient(to top, red , #EEAD0E)","cursor":"pointer"};
                }
            }
        };

        $scope.compareTest = function (x) {
            var testList = $scope.testList;
            for(var i=0;i<testList.length;i++){
                var temp = testList[i];

                for (var p in temp) {
                    if (temp.hasOwnProperty(p)){
                        //console.log("p : "+p);
                        //console.log("values : "+temp[p]);
                        if(p == x){
                            return temp[p];
                        }
                    }
                }

            }
            return x;
        };

        $scope.compareTestStyle = function (x) {
            var testList = $scope.testList;
            for(var i=0;i<testList.length;i++){
                var temp = testList[i];

                for (var p in temp) {
                    if (temp.hasOwnProperty(p)){
                        //console.log("p : "+p);
                        //console.log("values : "+temp[p]);
                        if(p == x){
                            var state = temp["0"];
                            var alarm = temp["-1"];
                            if(state == 0 && alarm == 0){
                                return {"background" : "-webkit-linear-gradient(left, #008B00 , #00FF00)","background":"-o-linear-gradient(top, #008B00 , #00FF00)","background":"-moz-linear-gradient(top, #008B00 , #00FF00)","background":"linear-gradient(to top, #008B00 , #00FF00)","cursor":"pointer"};
                            }else{
                                return {"background" : "-webkit-linear-gradient(left, red , #EEAD0E)","background":"-o-linear-gradient(top, red, #EEAD0E)","background":"-moz-linear-gradient(top, red, #EEAD0E)","background":"linear-gradient(to top, red , #EEAD0E)","cursor":"pointer"};
                            }
                        }
                    }
                }

            }
        };

        var z = 10;
        var y = 30;
        var newtitle = '';
        $scope.mouseoverSPD = function(x,$event){
            var off = $($event.target).offset();
            newtitle = '暂无位置信息';
            var spdPorts = $scope.spdPort;
            for(var i=0;i<spdPorts.length;i++){
                var temp = spdPorts[i].spd_number;
                if(temp == x){
                    newtitle = "位置："+spdPorts[i].spd_location;
                }
            }
            $('body').append('<div id="mytitle" >' + newtitle + '</div>');
            $('#mytitle').css({
                'left': (off.left + 'px'),
                'top': (off.top + y - 80 + 'px')
            }).show();

        };

        $scope.mouseoutSPD = function(x){
            $('#mytitle').remove();
        };

        $scope.nameSPD = function(x){
            var spdPorts = $scope.spdPort;
            for(var i=0;i<spdPorts.length;i++){
                var temp = spdPorts[i].spd_number;
                if(temp == x){
                    return "SPD"+x;
                }
            }
            return x;
        };

        $scope.compareSpd = function (x) {
            var spdPorts = $scope.spdPort;
            for(var i=0;i<spdPorts.length;i++){
                var temp = spdPorts[i].spd_number;
                if(temp == x){
                    var state = spdPorts[i].spd_state;
                    if(state == 0){
                        return {"background" : "-webkit-linear-gradient(left, #008B00 , #00FF00)","background":"-o-linear-gradient(top, #008B00 , #00FF00)","background":"-moz-linear-gradient(top, #008B00 , #00FF00)","background":"linear-gradient(to top, #008B00 , #00FF00)"};
                    }else{
                        return {"background" : "-webkit-linear-gradient(left, red , #EEAD0E)","background":"-o-linear-gradient(top, red, #EEAD0E)","background":"-moz-linear-gradient(top, red, #EEAD0E)","background":"linear-gradient(to top, red , #EEAD0E)"};
                    }
                }
            }
        };

		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
		};

	});

};

// 刷新数据
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();
};

var countdown = 60;
var result = "no";
var initValue;
function settime(obj) {
    var $scope = angular.element(appElement).scope();
    //console.log("=====");
    //console.log($scope.setTimeType);
    //console.log(obj);
    if(countdown == 60){
        initValue = $(obj).text();
        var rtu_id = $("#testRTU").val();
        var deviceType = $(obj).val();
        var channo;
        var deviceId;
        if(deviceType == 8){
            channo = $(obj).parent().parent().siblings().eq(0).find("div").find("input").val();
            deviceId = $(obj).parent().parent().siblings().eq(1).find("div").find("input").val();
        }else {
            channo = $(obj).parent().parent().siblings().eq(0).find("div").eq(0).find("input").val();
            deviceId = $(obj).parent().parent().siblings().eq(0).find("div").eq(1).find("input").val();
        }

        if($scope.setTimeType == 0){
            channo = parseInt(channo)+20;
        }
        var name = $(obj).attr("name");
        console.log(rtu_id+"=="+channo+"=="+deviceId+"=="+deviceType+"=="+name);

        //var data = {"resultValue":[9,8,7,6,5]};
        $.ajax({
            url : '../../mq/getDeviceInfo?rtu_id='+rtu_id+'&channo='+channo+'&deviceId='+deviceId+'&deviceType='+deviceType+"&portId="+name,
            contentType : "application/json;charset=utf-8",
            type : 'GET',
            dataType : "json",
            async : true,
            success : function(data) {
                result = "yes";
                console.log(data);
                if(deviceType == 3){//温湿度
                    var i = parseFloat(data.resultValue[0]);
                    var j = parseFloat(data.resultValue[1]);
                    $(obj).parent().parent().siblings().eq(2).find("div").eq(0).find("input").val(j);
                    $(obj).parent().parent().siblings().eq(2).find("div").eq(1).find("input").val(i);
                }else if(deviceType == 5){//倾斜度
                    var x = parseFloat(data.resultValue[0]);
                    var y = parseFloat(data.resultValue[1]);
                    $(obj).parent().parent().siblings().eq(2).find("div").eq(0).find("input").val(x);
                    $(obj).parent().parent().siblings().eq(2).find("div").eq(1).find("input").val(y);
                    var tanX = Math.tan(x/180*(Math.PI));
                    var tanY = Math.tan(y/180*(Math.PI));
                    var Z = Math.sqrt((tanX*tanX)+(tanY*tanY));
                    $(obj).parent().parent().siblings().eq(3).find("div").eq(0).find("input").val(tanX);
                    $(obj).parent().parent().siblings().eq(3).find("div").eq(1).find("input").val(tanY);
                    $(obj).parent().parent().siblings().eq(4).find("div").find("input").val(Z);
                }else if(deviceType == 6){//电气安全
                    var a = parseFloat(data.resultValue[0]);
                    var b = parseFloat(data.resultValue[1]);
                    var c = parseFloat(data.resultValue[2]);
                    var d = parseFloat(data.resultValue[3]);
                    $(obj).parent().parent().siblings().eq(2).find("div").eq(0).find("input").val(a);
                    $(obj).parent().parent().siblings().eq(2).find("div").eq(1).find("input").val(b);
                    $(obj).parent().parent().siblings().eq(3).find("div").eq(0).find("input").val(c);
                    $(obj).parent().parent().siblings().eq(3).find("div").eq(1).find("input").val(d);
                }else if(deviceType == 7){//杂散电流
                    var a = parseFloat(data.resultValue[0]);
                    var b = parseFloat(data.resultValue[1]);
                    var c = parseFloat(data.resultValue[2]);
                    var d = parseFloat(data.resultValue[3]);
                    $(obj).parent().parent().siblings().eq(2).find("div").eq(0).find("input").val(a);
                    $(obj).parent().parent().siblings().eq(2).find("div").eq(1).find("input").val(b);
                    $(obj).parent().parent().siblings().eq(3).find("div").eq(0).find("input").val(c);
                    $(obj).parent().parent().siblings().eq(3).find("div").eq(1).find("input").val(d);
                }else if(deviceType == 8){
                    var i = parseFloat(data.resultValue);
                    var a = Math.round(i*100);
                    var res = a/100;
                    $(obj).parent().parent().siblings().eq(3).find("div").find("input").val(res);
                }else if(deviceType == 4){
                    console.log("静电");
                    var i = parseFloat(data.resultValue)/1000;
                    var a = Math.round(i*100);
                    var res = a/100;
                    $(obj).parent().parent().siblings().eq(2).find("div").find("input").val(res);
                }else{
                    var i = parseFloat(data.resultValue);
                    var a = Math.round(i*100);
                    var res = a/100;
                    $(obj).parent().parent().siblings().eq(2).find("div").find("input").val(res);
                }
            }
        });
    }

    if (countdown == 0) {
        $("button").attr('disabled',false);
        console.log("进来了！！！"+initValue);
        obj.innerHTML = initValue;
        countdown = 60;
        return;
    } else {
        $("button").attr('disabled',true);
        obj.innerHTML = countdown;
        countdown--;
    }
    if(result == "no"){
        setTimeout(function () {
            settime(obj)
        }, 1000)
    }else{
        $("button").attr('disabled',false);
        //obj.removeAttribute("disabled");
        obj.innerHTML = initValue;
        countdown = 60;
        //$scope.testETCR1 = Math.floor(Math.random()*10)+1.1;
        result = "no";
        return;
    }

}

function popToModel(x,deviceId) {
    //pop悬浮窗跳转模态框
    var $scope = angular.element(appElement).scope();
    $scope.modalDeviceId = deviceId;
    $scope.showRSDevice(x);
}
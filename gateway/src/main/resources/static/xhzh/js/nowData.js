
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

    app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);
	app.controller("xhcontroller", function($scope,$http,$location) {
		$scope.businessMenu=true; //菜单变色

        //判断是否登录start
        $.ajax({
            type: 'GET',
            url: "../../connect/ensure",
            async: false,
            dataType: 'json',
            success: function(response){

            } ,
            error: function () {
                alert("登录已失效，请重新登录！");
                window.location.href = "../login.html";
                window.parent.location.href = "../login.html";
            }
        });
        //判断是否登录end

        $http.get("../../connect/selectAllSite").
        success(function(response){
        	var data = response.items;
        	var siteNames = [];
            siteNames.push("请选择站点名称");
        	for(var i=0;i<data.length;i++){
                siteNames.push(data[i].site_name);
			}
        	$scope.siteNames = siteNames;
        	$scope.industrys = ["请选择行业","文博","医疗","气象","新能源","轨道交通","石油化工","国防军工","电力","通讯"]
            $scope.data = data;
            $scope.totals = response.totals;

            $scope.testData = [{"id":1,"name":"one"},{"id":2,"name":"two"}];
            $scope.testData1 = [{"id":1,"name":"three"},{"id":2,"name":"four"}];

        });

        $http.get("../../connect/selectAllRTU").
        success(function(response){
            var data = response.items;
            var rtuNames = [];
            rtuNames.push({"rtu_id":"请选择RTU"});
            for(var i=0;i<data.length;i++){
                rtuNames.push({"rtu_id":data[i].rtu_id,"rtu_name":data[i].rtu_id});
            }
            $scope.rtuNames = rtuNames;
        });

        $scope.searchDevicesByRTU = function(){
            var rtu_id = $("#testRTU").val();
            if(rtu_id != null && rtu_id != ''){
                $http.get("../../spd/selectAllSPDByRTU?rtu_id="+rtu_id).
                success(function(response){
                    //console.log(response);
                    var spdData = [];
                    for(var i=0;i<8;i++){
                        spdData.push({"rtu_id": response[0].rtu_id, "udpateTime":"", "spd_number": i+1, "spd_state": 2});
                    }
                    for(var j=0;j<response.length;j++){
                        var index = response[j].spd_number;
                        spdData[index-1].spd_state = response[j].spd_state;
                    }
                    $scope.spdData = spdData;
                });
                //接触式地阻
                $http.get("../../etcr/selectETCROneType?rtu_id="+rtu_id).
                success(function(response){
                    $scope.ETCROneCount = response.length;
                    $scope.ETCROneData = response;
                    $http.get("../../etcr/selectETCRTwoType?rtu_id="+rtu_id).
                    success(function(response){
                        $scope.ETCRTwoCount = response.length;
                        $scope.ETCRTwoData = response;
                        console.log($scope.ETCROneData);
                        console.log($scope.ETCRTwoData);
                    });
                });
                //非接触式地阻
                $http.get("../../etcr/selectETCRThreeType?rtu_id="+rtu_id).
                success(function(response){
                    console.log(response);
                    $scope.ETCRThreeData = response;
                });
                //雷电流
                $http.get("../../lightning/selectLightningByRTU?rtu_id="+rtu_id).
                success(function(response){
                    console.log(response);
                    $scope.LightningData = response;
                });
                //静电
                $http.get("../../static/selectStaticByRTU?rtu_id="+rtu_id).
                success(function(response){
                    console.log(response);
                    $scope.StaticData = response;
                });
                //温湿度
                $http.get("../../rsws/selectRswsByRTU?rtu_id="+rtu_id).
                success(function(response){
                    console.log(response);
                    $scope.RswsData = response;
                });
                //倾斜度
                $http.get("../../svt/selectSvtByRTU?rtu_id="+rtu_id).
                success(function(response){
                    console.log(response);
                    $scope.SvtData = response;
                });
                //电器安全
                $http.get("../../hc/selectHcByRTU?rtu_id="+rtu_id).
                success(function(response){
                    console.log(response);
                    $scope.HcData = response;
                });
                //杂散电流
                $http.get("../../stray/selectStrayByRTU?rtu_id="+rtu_id).
                success(function(response){
                    console.log(response);
                    $scope.StrayData = response;
                });
                //阴极保护
                $http.get("../../cat/selectCatByRTU?rtu_id="+rtu_id).
                success(function(response){
                    console.log(response);
                    $scope.CatData = response;
                });
            }
        }

	});

};

//设备状态图
function test() {

    // 基于准备好的dom，初始化echarts实例 macarons
    var myChart = echarts.init(document.getElementById('statusForDevice'));
    myChart.showLoading();

    option = {
        tooltip : {
            formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
            feature: {
                restore: {},
                saveAsImage: {}
            }
        },
        series: [
            {
                name: '业务指标',
                type: 'gauge',
                detail: {formatter:'{value}%'},
                data: [{value: 50, name: '完成率'}]
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    myChart.hideLoading();
}

var countdown = 60;
var result = "no";
function searchValue(rtu_id,channo,deviceId,deviceType){

}

function settime(obj) {
    //console.log(obj);
    if(countdown == 60){
        var rtu_id = $("#testRTU").val();
        var channo = $(obj).siblings("input").eq(0).val();
        var deviceId = $(obj).siblings("input").eq(1).val();
        var deviceType = $(obj).val();
        var name = $(obj).attr("name");
        //console.log($(obj).siblings("input"));
        console.log(rtu_id+"=="+channo+"=="+deviceId+"=="+deviceType+"=="+name);
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
                    $(obj).siblings("input").eq(2).val(j);
                    $(obj).siblings("input").eq(3).val(i);
                }else if(deviceType == 5){//倾斜度
                    var x = parseFloat(data.resultValue[0]);
                    var y = parseFloat(data.resultValue[1]);
                    $(obj).siblings("input").eq(2).val(x);
                    $(obj).siblings("input").eq(3).val(y);
                    var tanX = Math.tan(x/180*(Math.PI));
                    var tanY = Math.tan(y/180*(Math.PI));
                    var Z = Math.sqrt((tanX*tanX)+(tanY*tanY));
                    $(obj).siblings("input").eq(4).val(tanX);
                    $(obj).siblings("input").eq(5).val(tanY);
                    $(obj).siblings("input").eq(6).val(Z);
                }else if(deviceType == 6){//电气安全
                    var a = parseFloat(data.resultValue[0]);
                    var b = parseFloat(data.resultValue[1]);
                    var c = parseFloat(data.resultValue[2]);
                    var d = parseFloat(data.resultValue[3]);
                    $(obj).siblings("input").eq(2).val(a);
                    $(obj).siblings("input").eq(3).val(b);
                    $(obj).siblings("input").eq(4).val(c);
                    $(obj).siblings("input").eq(5).val(d);
                }else if(deviceType == 7){//杂散电流
                    var a = parseFloat(data.resultValue[0]);
                    var b = parseFloat(data.resultValue[1]);
                    var c = parseFloat(data.resultValue[2]);
                    var d = parseFloat(data.resultValue[3]);
                    $(obj).siblings("input").eq(2).val(a);
                    $(obj).siblings("input").eq(3).val(b);
                    $(obj).siblings("input").eq(4).val(c);
                    $(obj).siblings("input").eq(5).val(d);
                }else{
                    var i = parseFloat(data.resultValue);
                    var a = Math.round(i*100);
                    var res = a/100;
                    $(obj).siblings("input").eq(2).val(res);
                }

            },
            error : function() {
            }
        });
    }
    var $scope = angular.element(appElement).scope();
    if (countdown == 0) {
        $("button").attr('disabled',false);
        //obj.removeAttribute("disabled");
        obj.innerHTML = "";
        countdown = 60;
        //$scope.testETCR1 = Math.floor(Math.random()*10)+1.1;
        return;
    } else {
        $("button").attr('disabled',true);
        //obj.setAttribute("disabled", true);
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
        obj.innerHTML = "";
        countdown = 60;
        //$scope.testETCR1 = Math.floor(Math.random()*10)+1.1;
        result = "no";
        return;
    }

}

//产生随机数函数
function RndNum(n){
    var rnd="";
    for(var i=0;i<n;i++)
        rnd+=Math.floor(Math.random()*10);
    return rnd;
}
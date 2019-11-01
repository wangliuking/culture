var outputPath = 'tiles/';    //地图瓦片所在的文件夹
var fromat = ".jpg";    //格式
var chart;
var option;
var arr;
var map;
var initStatus = true;
var markers = [];
var areas=[];
var recArr=[];
var offArr=[];
var count = 0;
var rtuArr = [];

if (!("xh" in window)) {
    window.xh = {};
};

var frist = 0;
var appElement = document.querySelector('[ng-controller=xhcontroller]');
var structure;
xh.load = function() {
    var app = angular.module("app", []);

    app.filter('formatTime', function() { //可以注入依赖
        return function(text) {
            return getLocalTime(text);
        };
    });

    app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);
    app.controller("xhcontroller", function($scope,$http,$location) {
        $scope.count = "15";//每页数据显示默认值
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

        $scope.goStatistic = function(id) {
            window.location.href = '/xhzh/dataStatistic.html?id='+id;
            //$location.path('/xhzh/deviceList.html');
        };

        $scope.goRTU = function(id) {
            window.location.href = '/xhzh/rtuShow.html?id='+id;
            //$location.path('/xhzh/deviceList.html');
        };

        $("#myModal").on("hide.bs.modal",function(){
            //console.log("模态框消失了！！！");
            $("#myTab li").each(function () {
                $(this).find("a").attr("class","nav-link");
            });
            $("#myTab li:first").find("a").attr("class","nav-link active");

            $("#admin").attr("class","tab-pane fade show active");
            $("#edit").attr("class","tab-pane fade");
        });

        $scope.getDeviceData = function(site_id){
            $http.get("../../connect/selectAllRTU?site_id="+site_id+"&structure="+structure).
            success(function(responseData){
                //console.log("===");
                //console.log(responseData);
                $scope.deviceData = responseData.items;
                if($scope.deviceData != null && $scope.deviceData.length > 0){
                    $http.get("../../total/selectRTUPort?rtu_id="+$scope.deviceData[0].rtu_id).
                    success(function(response){
                        $scope.spdPort = response.spdPort;
                        $scope.spdPort1 = [1,2,3,4];
                        $scope.spdPort2 = [5,6,7,8];
                        $scope.testPort1 = [1,2,3,4];
                        $scope.testPort2 = [5,6,7,8];
                        $scope.testRS1 = [1,2,3,4,5];
                        $scope.testRS2 = [6,7,8,9,10];
                        $scope.testList = response.testList;
                        $scope.rs485List = response.rs485List;
                    });
                }
            });

        }

        $scope.changeDeviceData = function(rtu_id){
            $http.get("../../total/selectRTUPort?rtu_id="+rtu_id).
            success(function(response){
                //console.log("进来了！！！");
                $scope.spdPort = response.spdPort;
                $scope.spdPort1 = [1,2,3,4];
                $scope.spdPort2 = [5,6,7,8];
                $scope.testPort1 = [1,2,3,4];
                $scope.testPort2 = [5,6,7,8];
                $scope.testRS1 = [1,2,3,4,5];
                $scope.testRS2 = [6,7,8,9,10];
                $scope.testList = response.testList;
                $scope.rs485List = response.rs485List;
            });
        }
        //deviceData start
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
                if(status > 0 && alarm == 0){
                    return {"background-color" : "red"};
                }else if(status > 0 && alarm > 0){
                    return {"background" : "-webkit-linear-gradient(left, red , #EEAD0E)","background":"-o-linear-gradient(right, red, #EEAD0E)","background":"-moz-linear-gradient(right, red, #EEAD0E)","background":"linear-gradient(to right, red , #EEAD0E)"};
                }else if(status == 0 && alarm > 0){
                    return {"background-color" : "#EEAD0E"};
                }else{
                    return {"background-color" : "green"};
                }
            }else{
                return {"background-color" : "grey"};
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
                                return {"background-color" : "green"};
                            }else if(state > 0 && alarm == 0){
                                return {"background-color" : "red"};
                            }else if(state > 0 && alarm > 0){
                                return {"background" : "-webkit-linear-gradient(left, red , #EEAD0E)","background":"-o-linear-gradient(right, red, #EEAD0E)","background":"-moz-linear-gradient(right, red, #EEAD0E)","background":"linear-gradient(to right, red , #EEAD0E)"};
                            }else if(state == 0 && alarm > 0){
                                return {"background-color" : "#EEAD0E"};
                            }
                        }
                    }
                }

            }
            return {"background-color" : "grey"};
        };

        $scope.compareSpd = function (x) {
            var spdPorts = $scope.spdPort;
            for(var i=0;i<spdPorts.length;i++){
                var temp = spdPorts[i].spd_number;
                if(temp == x){
                    var state = spdPorts[i].spd_state;
                    if(state == 0){
                        return {"background-color" : "green"};
                    }else{
                        return {"background-color" : "#EEAD0E"};
                    }
                }
            }
            return {"background-color" : "grey"};
        };
        //deviceData end

        $scope.industryData = ["医疗","气象","新能源","轨道交通","石油化工","国防军工","电力","通讯"];

        $scope.searchShow = function(){
            if($(".navform").css("display") == "none"){
                $(".navform").css({"display":"block"});
            }else{
                $(".navform").css({"display":"none"});
            }
        };

        $scope.showMenu = function(){
            if($(".info_right").css("display") == "none"){
                $(".info_right").css({"display":"block"});
                $(".info_right_temp").css({"display":"none"});
            }else{
                $(".info_right").css({"display":"none"});
                $(".info_right_temp").css({"display":"block"});
            }
        };

        //搜索点击定位
        $scope.changePositionForSearch = function(){
            var content = $("#search_kw").val();
            var tempArr = content.split("-");
            console.log(tempArr[0]);
            if(tempArr[0] != "RTU"){
                for(var i=0;i<arr.length;i++){
                    if(arr[i].site_id == tempArr[0]){
                        var point = new BMap.Point(arr[i].site_lng, arr[i].site_lat);
                        map.setZoom(11);
                        map.setCenter(point);
                    }
                }
            }else{
                for(var i=0;i<rtuArr.length;i++){
                    if(rtuArr[i].rtu_id == tempArr[1]){
                        var point = new BMap.Point(rtuArr[i].site_lng, rtuArr[i].site_lat);
                        map.setZoom(11);
                        map.setCenter(point);
                    }
                }
            }
        }

        //选择行业
        $scope.chooseIndustry = function(param){
            console.log(markers);
            clearIndustry();
            addMarker();
        }

        initMap();
        /*setInterval(function () {
            initMap();
            count++;
        }, 60000);*/

        /* 显示添加框 */
        $scope.showMod = function() {
            /*$('#add input').val('');*/
            $('#add').modal('show');
        };

        /* 刷新数据 */
        $scope.refresh = function() {
            $scope.search(1);
        };

        /* 查询数据 */
        $scope.search = function(page) {

            var pageSize = $("#page-limit").val();
            var start = 1, limit = pageSize;
            frist = 0;
            page = parseInt(page);
            if (page <= 1) {
                start = 0;
            } else {
                start = (page - 1) * pageSize;
            }

            /*console.log("=====");
            console.log(start);
            console.log(limit);
            console.log(recArr.length);
            console.log("=====");*/
            var recPageData = [];
            for(var i=0;i<recArr.length;i++){
                var temp = i - start;
                if(temp>=0 && temp<limit){
                    recPageData.push(recArr[i]);
                }
            }
            $scope.recData = recPageData;
            $scope.recTotal = recArr.length;
            $scope.$apply();
            console.log($scope.recData);
            xh.pagging(page, parseInt($scope.recTotal), $scope);
        };

        //分页点击
        $scope.pageClick = function(page, totals, totalPages) {

            var pageSize = $("#page-limit").val();
            var start = 1, limit = pageSize;
            page = parseInt(page);
            if (page <= 1) {
                start = 0;
            } else {
                start = (page - 1) * pageSize;
            }

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
            var recPageData = [];
            for(var i=0;i<recArr.length;i++){
                var temp = i - start;
                if(temp>=0 && temp<limit){
                    recPageData.push(recArr[i]);
                }
            }
            $scope.recData = recPageData;
            $scope.recTotal = recArr.length;

        };
    });
};



//区域选择函数
function chooseArea(checkbox) {

    console.log(checkbox);
    if (checkbox.checked == true) {
        console.log("选中了！！！"+checkbox.value)
        choosedArea(checkbox.value);
    } else {
        console.log("取消了！！！"+checkbox.value)
        clearArea(checkbox.value);
    }

}

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

function initMap() {
    var url = "../../connect/selectAllSite?structure="+structure;
    $.ajax({
        type: 'GET',
        url: url,
        async: false,
        success: function (data) {
            console.log(data.items);
            arr = data.items;
        }
    });
    $.ajax({
        type: 'GET',
        url: "../../connect/selectAllRTUPosition?structure="+structure,
        async: false,
        success: function (rtuData) {
            rtuArr = rtuData;
        }
    });

    //检索数据源
    var searchData = [];
    for(var i=0;i<arr.length;i++){
        var t = arr[i].site_id+"-"+arr[i].site_name+" "+arr[i].site_province+arr[i].site_city+arr[i].site_county;
        searchData.push(t);
    }
    for(var i=0;i<rtuArr.length;i++){
        var t = "RTU-"+rtuArr[i].rtu_id;
        searchData.push(t);
    }
    $("#search_kw").autocomplete({
        source : searchData
    });

    if (initStatus) {
        start();
        initDrawTool();
        initChart();
        initStatus = false;
    }
}

function start() {
    chart = echarts.init(document.getElementById('container'));
    //chart.showLoading();

    var j;
    var objTemp = [];
    for (j = 0; j < arr.length; j++) {
        var x = {
            name : arr[j].site_name,
            id : arr[j].site_id
        };
        objTemp.push(x);
    }

    option = {
        // 加载 bmap 组件
        bmap: {
            // 百度地图中心经纬度
            center: [104.075493, 30.660545],
            // 百度地图缩放
            zoom: 6,
            // 是否开启拖拽缩放，可以只设置 'scale' 或者 'move'
            roam: true,
            // 百度地图的自定义样式，见 http://developer.baidu.com/map/jsdevelop-11.htm
            mapStyle: { styleJson: [ { 'featureType': 'land', 'elementType': 'geometry', 'stylers': { 'color': '#081734' } }, { 'featureType': 'building', 'elementType': 'geometry', 'stylers': { 'color': '#04406F' } }, { 'featureType': 'building', 'elementType': 'labels', 'stylers': { 'visibility': 'off' } }, { 'featureType': 'highway', 'elementType': 'geometry', 'stylers': { 'color': '#015B99' } }, { 'featureType': 'highway', 'elementType': 'labels', 'stylers': { 'visibility': 'off' } }, { 'featureType': 'arterial', 'elementType': 'geometry', 'stylers': { 'color':'#003051' } }, { 'featureType': 'arterial', 'elementType': 'labels', 'stylers': { 'visibility': 'off' } }, { 'featureType': 'green', 'elementType': 'geometry', 'stylers': { 'visibility': 'off' } }, { 'featureType': 'water', 'elementType': 'geometry', 'stylers': { 'color': '#044161' } }, { 'featureType': 'subway', 'elementType': 'geometry.stroke', 'stylers': { 'color': '#003051' } }, { 'featureType': 'subway', 'elementType': 'labels', 'stylers': { 'visibility': 'off' } }, { 'featureType': 'railway', 'elementType': 'geometry', 'stylers': { 'visibility': 'off' } }, { 'featureType': 'railway', 'elementType': 'labels', 'stylers': { 'visibility': 'off' } }, { 'featureType': 'all', 'elementType': 'labels.text.stroke', 'stylers': { 'color': '#313131' } }, { 'featureType': 'all', 'elementType': 'labels.text.fill', 'stylers': { 'color': '#FFFFFF' } }, { 'featureType': 'manmade', 'elementType': 'geometry', 'stylers': { 'visibility': 'off' } }, { 'featureType': 'manmade', 'elementType': 'labels', 'stylers': { 'visibility': 'off' } }, { 'featureType': 'local', 'elementType': 'geometry', 'stylers': { 'visibility': 'off' } }, { 'featureType': 'local', 'elementType': 'labels', 'stylers': { 'visibility': 'off' } }, { 'featureType': 'subway', 'elementType': 'geometry', 'stylers': { 'lightness': -65 } }, { 'featureType': 'railway', 'elementType': 'all', 'stylers': { 'lightness': -40 } }, { 'featureType': 'boundary', 'elementType': 'geometry', 'stylers': { 'color': '#8b8787', 'weight': '1', 'lightness': -29 } }] }
        },
        series: [
            {
                name: 'Top 5',
                type: 'effectScatter',
                coordinateSystem: 'bmap',
                symbolSize : function(v) {
                    return 3;
                },
                data: [],
                showEffectOn: 'render',
                rippleEffect: {
                    period: 4,
                    brushType: 'fill',
                    scale: 25
                },
                label: {
                    normal: {
                            show: true,
                            formatter: "{b}",
                            fontSize: 16,
                            color: "white",
                            offset: [0, 0]
                        }
                },
                itemStyle: {
                    normal: {
                        color: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.5,
                            colorStops: [{
                                offset: 0, color: 'rgba(255,0,0,0.3)'
                            }, {
                                offset: 0.4, color: 'rgba(255,0,0,6)'
                            }, {
                                offset: 0.9, color: 'rgba(255,0,0,9)'
                            }, {
                                offset: 1, color: 'rgba(255,0,0,1)'
                            }],
                            globalCoord: true
                        },
                        shadowBlur: 0,
                        shadowColor: '#25fffb'
                    }
                }

            }
        ]
    }
    chart.setOption(option);
    // 获取百度地图实例，使用百度地图自带的控件
    map = chart.getModel().getComponent('bmap').getBMap();
    //添加地图类型控件
    map.addControl(new BMap.MapTypeControl({
        mapTypes: [
            BMAP_NORMAL_MAP,
            BMAP_HYBRID_MAP
        ]
    }));
    map.addControl(new BMap.NavigationControl());//添加默认缩放平移控件
    map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT })); //向地图中添加比例尺控件
    //map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

    map.addEventListener("rightclick",function(e){
        if(confirm(e.point.lng + "," + e.point.lat)){
            $("shape").innerHTML=$("shape").innerHTML+" <br/>("+e.point.lng+","+e.point.lat+")";
        }
    });

    /*map.addEventListener("dragstart", function(evt){
        option.series[0].data = [];
        chart.setOption(option);
    });

    map.addEventListener("dragend", function(evt){
        option.series[0].data = offArr;
        chart.setOption(option);
    });*/

    addMarker();

    //监听地图层级
    map.addEventListener("zoomend", function (e) {
        var ZoomNum = map.getZoom();
        console.log("当前地图层级：" + ZoomNum);
    });
}

function addMarker() {  // 创建图标对象
    var chooesdIndustrys = [];
    //获取所有选中的行业
    $("#industrys input:checked").each(function(j) {
        chooesdIndustrys.push($(this).val());
    });
    var arrNem = [];
    if(chooesdIndustrys!=null && chooesdIndustrys.length>0){
        for(var i=0;i<arr.length;i++){
            for(var j=0;j<chooesdIndustrys.length;j++){
                if(arr[i].site_industry == chooesdIndustrys[j]){
                    arrNem.push(arr[i]);
                }
            }
        }
    }else{
        arrNem = arr;
    }
    //console.log("aaa");
    //console.log(chooesdIndustrys);
    //console.log(arrNem);
    //闪烁效果数组清空
    offArr = [];
    for (var i = 0; i < arrNem.length; i++) {
        $.ajax({
            type: 'GET',
            url: "../../total/selectSiteAllStatus?site_id=" + arrNem[i].site_id+"&structure="+structure,
            async: false,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                var industry = arrNem[i].site_industry;
                var rtuStatusList = data.rtuStatusList;
                var rtuWarningNum = data.rtuWarningNum;
                var rtuOffNum = data.rtuOffNum;
                var rtuNum = data.rtuNum;
                arrNem[i]["rtuStatusList"] = data.rtuStatusList;
                arrNem[i]["rtuWarningNum"] = data.rtuWarningNum;
                arrNem[i]["rtuOffNum"] = data.rtuOffNum;
                arrNem[i]["rtuNum"] = data.rtuNum;
                //闪烁效果数组
                if(rtuNum == 0 || rtuOffNum > 0){
                    offArr.push([arrNem[i].site_lng,arrNem[i].site_lat,1]);
                }
                var iconImg;
                if ("医疗" == industry) {
                    if (rtuNum == 0 || rtuOffNum > 0 || rtuStatusList == 0) {
                        iconImg = "../iconfont/6-1.png";
                    } else if (rtuWarningNum > 0) {
                        iconImg = "../iconfont/6-2.png";
                    } else {
                        iconImg = "../iconfont/6-3.png";
                    }
                } else if ("气象" == industry) {
                    if (rtuNum == 0 || rtuOffNum > 0 || rtuStatusList == 0) {
                        iconImg = "../iconfont/7-1.png";
                    } else if (rtuWarningNum > 0) {
                        iconImg = "../iconfont/7-2.png";
                    } else {
                        iconImg = "../iconfont/7-3.png";
                    }
                } else if ("新能源" == industry) {
                    if (rtuNum == 0 || rtuOffNum > 0 || rtuStatusList == 0) {
                        iconImg = "../iconfont/3-1.png";
                    } else if (rtuWarningNum > 0) {
                        iconImg = "../iconfont/3-2.png";
                    } else {
                        iconImg = "../iconfont/3-3.png";
                    }
                } else if ("轨道交通" == industry) {
                    if (rtuNum == 0 || rtuOffNum > 0 || rtuStatusList == 0) {
                        iconImg = "../iconfont/4-1.png";
                    } else if (rtuWarningNum > 0) {
                        iconImg = "../iconfont/4-2.png";
                    } else {
                        iconImg = "../iconfont/4-3.png";
                    }
                } else if ("石油化工" == industry) {
                    if (rtuNum == 0 || rtuOffNum > 0 || rtuStatusList == 0) {
                        iconImg = "../iconfont/5-1.png";
                    } else if (rtuWarningNum > 0) {
                        iconImg = "../iconfont/5-2.png";
                    } else {
                        iconImg = "../iconfont/5-3.png";
                    }
                } else if ("国防军工" == industry) {
                    if (rtuNum == 0 || rtuOffNum > 0 || rtuStatusList == 0) {
                        iconImg = "../iconfont/8-1.png";
                    } else if (rtuWarningNum > 0) {
                        iconImg = "../iconfont/8-2.png";
                    } else {
                        iconImg = "../iconfont/8-3.png";
                    }
                } else if ("电力" == industry) {
                    if (rtuNum == 0 || rtuOffNum > 0 || rtuStatusList == 0) {
                        iconImg = "../iconfont/1-1.png";
                    } else if (rtuWarningNum > 0) {
                        iconImg = "../iconfont/1-2.png";
                    } else {
                        iconImg = "../iconfont/1-3.png";
                    }
                } else if ("通讯" == industry) {
                    if (rtuNum == 0 || rtuOffNum > 0 || rtuStatusList == 0) {
                        iconImg = "../iconfont/2-1.png";
                    } else if (rtuWarningNum > 0) {
                        iconImg = "../iconfont/2-2.png";
                    } else {
                        iconImg = "../iconfont/2-3.png";
                    }
                }
                var zoom = map.getZoom();
                var x;
                var y;
                if (zoom >= 5 && zoom <= 7) {
                    x = 16;
                    y = 20;
                } else if (zoom >= 8 && zoom <= 9) {
                    x = 48;
                    y = 56;
                }
                var myIcon = new BMap.Icon(iconImg, new BMap.Size(x, y), {
                    // 指定定位位置。
                    // 当标注显示在地图上时，其所指向的地理位置距离图标左上
                    // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
                    // 图标中央下端的尖角位置。
                    //anchor: new BMap.Size(10, 25)
                    // 设置图片偏移。
                    // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
                    // 需要指定大图的偏移位置，此做法与css sprites技术类似。
                    //imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移
                    imageSize: new BMap.Size(x, y)
                });
                // 创建标注对象并添加到地图
                var point = new BMap.Point(arrNem[i].site_lng, arrNem[i].site_lat);
                var marker = new BMap.Marker(point, {icon: myIcon});
                var label = new BMap.Label(arrNem[i].site_name, {
                    offset: new BMap.Size(15, -25)
                });
                var backgroundColor;
                if (rtuNum == 0 || rtuOffNum > 0 || rtuStatusList == 0) {
                    backgroundColor = "#bfbfbf";
                } else if (rtuWarningNum > 0) {
                    backgroundColor = "#EEAD0E";
                } else {
                    backgroundColor = "green";
                }
                label.setStyle({
                    width: "auto",
                    color: '#fff',
                    background: backgroundColor,
                    border: '1px solid "#00CD66"',
                    borderRadius: "5px",
                    textAlign: "center",
                    height: "24px",
                    lineHeight: "24px",
                    fontSize: "15px",
                    fontWeight: "bold"
                });
                marker.setLabel(label); //为标注添加一个标签
                createInfoWindow(marker,arrNem[i].site_id);
                map.addOverlay(marker);
                var json = {};
                json[arrNem[i].site_id] = marker;
                markers.push(json);
            }
        });
    }
    console.log("offArr:");
    console.log(offArr);
    option.series[0].data = offArr;
    chart.setOption(option);
}

function createInfoWindow(marker,site_id) {
    marker.addEventListener("click", function () {
        for(var j=0;j<arr.length;j++){
            if(arr[j].site_id == site_id){
                //console.log(arr[j]);
                var $scope = angular.element(appElement).scope();
                $scope.getDeviceData(site_id);
                $scope.siteData = arr[j];
                $scope.$apply();
                $("#myModal").modal('show');
            }
        }
    });
}

//时间戳格式化
function getLocalTime(nS) {
    var now = new Date(nS);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

//当前时间
function getNowTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

//区域选择
function choosedArea(params){
    //添加轮廓线start
    var areaUrl = "area.json";
    $.getJSON(areaUrl, function (data){
        var rs = data[params];
        //map.clearOverlays();        //清除地图覆盖物
        var count = rs.length; //行政区域的点有多少个
        for(var i = 0; i < count; i++){
            var ply = new BMap.Polygon(rs[i], {strokeWeight: 2, strokeColor: "#ff0000"}); //建立多边形覆盖物
            map.addOverlay(ply);  //添加覆盖物
            map.setViewport(ply.getPath());    //调整视野
            var json = {};
            json[params] = ply;
            areas.push(json);
        }
    });
    //添加轮廓线end
}

//区域清除
function clearArea(param) {

    for(var i=0;i<areas.length;i++){
        //console.log(Object.keys(areas[i])[0]);
        if(Object.keys(areas[i])[0] == param){
            //console.log(areas[i][param]);
            map.removeOverlay(areas[i][param]);
        }
    }
}

//行业清除
function clearIndustry() {
    for(var i=0;i<markers.length;i++){
        var key = Object.keys(markers[i])[0];
        map.removeOverlay(markers[i][key]);
    }
}

// 百度地图API功能
var overlays = [];
var overlaycomplete = function(e){
    overlays.push(e.overlay);
    drawingManager.close();

    recArr = [];
    for(var i=0;i<arr.length;i++){
        var point = new BMap.Point(arr[i].site_lng, arr[i].site_lat);
        if(BMapLib.GeoUtils.isPointInPolygon(point,e.overlay)){
            //console.log("在里面！！！");
            recArr.push(arr[i]);
        }
    }

    xh.refresh();
    $('#rectangle').modal('show');

    //console.log(recArr);
};
var styleOptions = {
    strokeColor:"red",    //边线颜色。
    fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3,       //边线的宽度，以像素为单位。
    strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid' //边线的样式，solid或dashed。
}
var drawingManager;
function initDrawTool() {
    //实例化鼠标绘制工具
    drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        //enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
        },
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式
    });

    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
}

function draw(type){
    //开始绘制前清除所有图形
    clearAll();

    drawingManager.open();
    //console.log(drawingManager.getDrawingMode());
    drawingManager.setDrawingMode(type);
}

function clearAll() {
    for(var i = 0; i < overlays.length; i++){
        map.removeOverlay(overlays[i]);
    }
    overlays.length = 0
}
function getPoint(){
    $("resultShape").innerHTML='';
    for(var i = 0; i < overlays.length; i++){
        var overlay=overlays[i].getPath();
        $("resultShape").innerHTML=$("resultShape").innerHTML+overlay.length+'边形:<br/>';
        for(var j = 0; j < overlay.length; j++){
            var grid =overlay[j];
            $("resultShape").innerHTML=$("resultShape").innerHTML+(j+1)+"个点:("+grid.lng+","+grid.lat+");<br/>";
        }
    }
}
function Editing(state){
    for(var i = 0; i < overlays.length; i++){
        state=='enable'?overlays[i].enableEditing():overlays[i].disableEditing();
    }
}

function showPolygon(btn){
    var polygon = new BMap.Polygon([
        new BMap.Point(113.941853,22.530777),
        new BMap.Point(113.940487,22.527789),
        new BMap.Point(113.94788,22.527597),
        new BMap.Point(113.947925,22.530618)
    ], styleOptions);  //创建多边形
    map.addOverlay(polygon);   //增加多边形
    // overlays.push(polygon); //是否把该图像加入到编辑和删除行列
    btn.setAttribute('disabled','false');
    showText();
}

function showText(){
    var opts = {
        position : new BMap.Point(113.941853,22.530777),    // 指定文本标注所在的地理位置
        offset   : new BMap.Size(30, 30)    //设置文本偏移量
    }
    var label = new BMap.Label("不可编辑", opts);  // 创建文本标注对象
    label.setStyle({
        color : "black",
        fontSize : "16px",
        fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
    });
    map.addOverlay(label);
}

function initChart() {
    $.ajax({
        type: 'GET',
        url: "../../total/selectSiteAllInfo?structure="+structure,
        async: false,
        dataType: 'json',
        success: function (data) {
            console.log("==================");
            console.log(arr);
            console.log("==================");
            var d = 0;
            var e = 0;
            var f = 0;
            for(var i=0;i<arr.length;i++){
                if(arr[i].rtuOffNum > 0 || arr[i].rtuNum == 0 || arr[i].rtuStatusList == 0){
                    f++;
                }else if(arr[i].rtuWarningNum > 0){
                    e++;
                }else{
                    d++;
                }
            }
            siteForBar(d, e, f);
            //console.log(data);
            var a = data.rtuNum - data.rtuOffNum - data.rtuWarningNum;
            var b = data.rtuWarningNum;
            var c = data.rtuOffNum;
            var x = data.spdNum + data.etcrNum + data.lightningNum + data.staticNum + data.rswsNum + data.svtNum + data.hcNum + data.strayNum + data.catNum - data.deviceWarningCount - data.deviceOffCount;
            var y = data.deviceWarningCount;
            var z = data.deviceOffCount;
            rtuForBar(a, b, c);
            deviceForBar(x, y, z);

        }
    });
}

//站点统计图
function siteForBar(a,b,c) {
    // 基于准备好的dom，初始化echarts实例 macarons
    var myChart = echarts.init(document.getElementById('leftsideOne'));
    myChart.showLoading();

    var total = parseInt(a)+parseInt(b)+parseInt(c);
    // 指定图表的配置项和数据
    var option = {
        color:['#00CD66', '#EEAD0E','#DCDCDC'],
        title : {
            text: '站点统计情况 \n 总数：'+total,
            textStyle: {
                fontSize: 16,
                color : 'white'
            },
            //subtext: '总数：'+total,
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            textStyle : {
                color : 'white'
            },
            orient: 'vertical',
            left: 'left',
            data: ['站点正常','站点异常','站点离线']
        },
        series : [
            {
                textStyle : {
                    color : 'black'
                },
                name: '统计数量',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:a, name:'站点正常'},
                    {value:b, name:'站点异常'},
                    {value:c, name:'站点离线'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    myChart.hideLoading();

}

//rtu统计图
function rtuForBar(a,b,c) {
    // 基于准备好的dom，初始化echarts实例
    $("#rtuForBar").width($("#siteStatus").width());
    var myChart = echarts.init(document.getElementById('leftsideTwo'));

    var total = parseInt(a)+parseInt(b)+parseInt(c);
    // 指定图表的配置项和数据
    var option = {
        color:['#00CD66', '#EEAD0E','#DCDCDC'],
        title : {
            text: 'RTU统计情况 \n 总数：'+total,
            textStyle: {
                fontSize: 16,
                color : 'white'
            },
            //subtext: '纯属虚构',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            textStyle : {
                color : 'white'
            },
            orient: 'vertical',
            left: 'left',
            data: ['RTU正常','RTU异常','RTU离线']
        },
        series : [
            {
                name: '统计数量',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:a, name:'RTU正常'},
                    {value:b, name:'RTU异常'},
                    {value:c, name:'RTU离线'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//设备统计图
function deviceForBar(x,y,z) {
    // 基于准备好的dom，初始化echarts实例
    $("#deviceForBar").width($("#siteStatus").width());
    var myChart = echarts.init(document.getElementById('leftsideThree'));

    var total = parseInt(x)+parseInt(y)+parseInt(z);
    // 指定图表的配置项和数据
    var option = {
        color:['#00CD66', '#EEAD0E','#DCDCDC'],
        title : {
            text: '设备统计情况 \n 总数：'+total,
            textStyle: {
                fontSize: 16,
                color : 'white'
            },
            //subtext: '纯属虚构',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            textStyle : {
                color : 'white'
            },
            orient: 'vertical',
            left: 'left',
            data: ['设备正常','设备异常','设备离线']
        },
        series : [
            {
                name: '统计数量',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:x, name:'设备正常'},
                    {value:y, name:'设备异常'},
                    {value:z, name:'设备离线'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
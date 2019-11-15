
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
    var pageSize = $("#page-limit").val();
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

        $http.get("../../selectAlarmConf").
        success(function(response){
            $scope.windowMap = response.window;
            $scope.voiceMap = response.voice;
            $scope.smsMap = response.sms;
        });

        $http.get("../../mq/selectSmsConf").
        success(function(response){
            var smsConf = response.smsConf;
            $("#ip").val(smsConf.ip);
            $("#port").val(smsConf.port);
            var tempPhone = smsConf.phone;
            var phoneArr = tempPhone.split(";");
            var list = [];
            if(phoneArr.length>0){
                for(var i=0;i<phoneArr.length-1;i++){
                    list.push(phoneArr[i]);
                }
            }
            $scope.phoneList = list;
        });

        $scope.saveSmsConf = function(tag){
            var ip = $("#ip").val();
            var port = $("#port").val();
            var phone = $("#phone").val();
            var list = $scope.phoneList;
            console.log("++++++++++++++++++++")
            console.log(list)
            console.log("++++++++++++++++++++")
            var strs = "";
            if(tag == 0){
                //新增
                if(phone == "" || phone == null){
                    alert("号码不能为空")
                    return false;
                }
                if(list.length>0){
                    for(var i=0;i<list.length;i++){
                        if(list[i] == phone){
                            alert("已存在该号码")
                            return false;
                        }
                        strs += list[i] + ";"
                    }
                    strs += phone + ";"
                }else{
                    strs += phone + ";"
                }
                console.log(strs)
            }else if(tag == 1){
                //删除
                if(phone == "" || phone == null){
                    alert("号码不能为空")
                    return false;
                }
                if(list.length>0){
                    var status = true;
                    for(var i=0;i<list.length;i++){
                        if(list[i] != phone){
                            strs += list[i] + ";"
                        }else{
                            status = false
                        }
                    }
                    if(status){
                        alert("无可删除号码")
                        return false;
                    }
                }else{
                    alert("无可删除号码")
                    return false;
                }
            }else if(tag == 2){
                //保存
                if(list.length>0){
                    for(var i=0;i<list.length;i++){
                        strs += list[i] + ";"
                    }
                }
            }

            var f = {};//声明一个对象
            f["ip"] = ip;
            f["port"] = port;
            f["phone"] = strs;
            console.log(f);
            var str = JSON.stringify(f);
            $.ajax({
                url : "../../mq/saveSmsConf",
                contentType : "application/json;charset=utf-8",
                type : 'POST',
                dataType : "json",
                async : true,
                data : str,
                success: function (response) {
                    var smsConf = response.smsConf;
                    $("#ip").val(smsConf.ip);
                    $("#port").val(smsConf.port);
                    var tempPhone = smsConf.phone;
                    var phoneArr = tempPhone.split(";");
                    var list = [];
                    if(phoneArr.length>0){
                        for(var i=0;i<phoneArr.length-1;i++){
                            list.push(phoneArr[i]);
                        }
                    }
                    $scope.phoneList = list;
                    $scope.$apply();
                }
            });
        }

        $scope.checkBoxClick = function($event){
            console.log($event.target.checked)
            if($event.target.checked==true){
                $($event.target).val(1);
            }else{
                $($event.target).val(0);
            }
        }

        $scope.save = function (x) {
            var formId = "";
            if(x == 1){
                formId = "windowForm";
            }else if(x == 2){
                formId = "voiceForm";
            }else if(x == 3){
                formId = "smsForm";
            }

            var fields = $('#'+formId+' input:checkbox').map(function() {
                return { name: this.name, value: this.checked ? 1 : 0 };
            });

            console.log(fields)
            var f = {};//声明一个对象
            $.each(fields,function(index,field){
                f[field.name] = field.value;//通过变量，将属性值，属性一起放到对象中
            });
            console.log(f);
            var str = JSON.stringify(f);
            $.ajax({
                url : "../../saveAlarmConf",
                contentType : "application/json;charset=utf-8",
                type : 'POST',
                dataType : "json",
                async : true,
                data : str,
                success: function (json) {
                    toastr.success("保存成功", '提示');
                }
            });
        }

	});


};
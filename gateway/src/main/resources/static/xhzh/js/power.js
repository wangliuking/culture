/**
 * 用户管理
 */
if (!("xh" in window)) {
    window.xh = {};
};
var frist = 0;
var appElement = document.querySelector('[ng-controller=power]');
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
    app.controller("power", function($scope, $http, $location) {
        $scope.securityMenu = true; // 菜单变色
        $scope.userId = $location.search().id;
        $scope.name = $location.search().name;
        console.log("=====");
        console.log($scope.userId);
        console.log($scope.name);
        console.log("=====");
        /* 获取菜单 */
        $http.get("../../connect/selectRoleById?id="+$scope.userId).success(function(response) {
            $scope.data = response.items;
        });
        $scope.refresh=function(){
            $http.get("../../connect/selectRoleById?id="+$scope.userId).success(function(response) {
                $scope.data = response.items;
            });
        };
        $scope.save=function(){
            var fields = $("#form").serializeArray();
            var f = {};//声明一个对象
            $.each(fields,function(index,field){
                var status = 0;
                if(field.value == "on"){
                    status = 1;
                }
                f[field.name] = status;//通过变量，将属性值，属性一起放到对象中
            });
            f["id"] = $scope.userId;
            console.log(f);
            var str = JSON.stringify(f);
            $.ajax({
                url : '../../connect/updateRole',
                contentType : "application/json;charset=utf-8",
                type : 'POST',
                dataType : "json",
                async : true,
                data : str,
                success : function(data) {
                    if (data.success) {
                        toastr.success(data.message, '提示');
                        xh.refresh();
                    } else {
                        toastr.error(data.message, '提示');
                        xh.refresh();
                    }
                },
                error : function() {
                }
            });

        };


    });
};
$("#selectAll").bind("click", function() {
    $("#form").find("[type='checkbox']").prop("checked", true);// 全选
});
$("#selectNo").bind("click", function() {
    $("#form").find("[type='checkbox']").prop("checked", false);// 反选
});
$("#selectOther").bind("click", function() {
    var checkbox=$("#form").find("[type='checkbox']");

    for(var i=0;i<checkbox.length;i++){
        if(checkbox[i].checked==true){
            checkbox[i].checked=false;
        }else{
            checkbox[i].checked=true;
        }
    }
});
//刷新数据
xh.refresh = function() {
    var $scope = angular.element(appElement).scope();
    // 调用$scope中的方法
    $scope.refresh();

};
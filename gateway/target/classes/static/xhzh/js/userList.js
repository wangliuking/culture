
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

        $http.get("../../connect/selectGroupList?start=0&limit=1000").
        success(function(response){
            $scope.groups = response.items;
        });

        $http.get("../../connect/selectRoleList?start=0&limit=1000&structure="+structure).
        success(function(response){
            $scope.roles = response.items;
        });

        $http.get("../../connect/selectUserList?start=0&limit="+pageSize+"&structure="+structure).
        success(function(response){
            $scope.data = response.items;
            $scope.totals = response.totals;
            xh.pagging(1, parseInt($scope.totals), $scope);
        });


        /* 显示添加框 */
        $scope.showMod = function() {
            $('#addForm')[0].reset()
            $scope.nowUserName = "";
            $scope.message = "用户名不能为空";
            $scope.mesColor = "red";
            $scope.btnStatus = false;
            $('#add').modal('show');
        };

        /* 显示修改框 */
        $scope.showEdit = function(id) {
            $.ajax({
                url : '../../connect/selectUserByUsername?username='+id,
                type : 'get',
                dataType : "json",
                async : false,
                success : function(response) {
                    $scope.nowUserName = response.item.username;
                    $scope.editData = response.item;
                    $scope.message = "";
                    $scope.btnStatus = true;
                    $('#edit').modal('show');
                },
                error : function() {
                    $scope.refresh();
                }
            });
        };

        /* 刷新数据 */
        $scope.refresh = function() {
            $scope.search(1);
        };

        $scope.message = "";
        $scope.selectCountUserByUsername = function(param){
            var username = $("#"+param).val();
            if(username == ""){
                $scope.message = "用户名不能为空";
                $scope.mesColor = "red";
                $scope.btnStatus = false;
                return false;
            }
            if(username == $scope.nowUserName){
                console.log(11111)
                console.log($scope.nowUserName)
                $scope.message = "";
                $scope.btnStatus = true;
                return false;
            }
            $.ajax({
                url : '../../connect/selectCountUserByUsername?username='+username,
                type : 'get',
                dataType : "json",
                async : false,
                success : function(data) {
                    if (data.success) {
                        $scope.message = data.message;
                        $scope.mesColor = "green";
                        $scope.btnStatus = true;
                    }else{
                        $scope.message = data.message;
                        $scope.mesColor = "red";
                        $scope.btnStatus = false;
                    }
                },
                error : function() {
                    $scope.refresh();
                }
            });
        }

        /* 删除 */
        $scope.delBs = function(username) {
            swal({
                title : "提示",
                text : "确定要删除该用户吗？",
                type : "info",
                showCancelButton : true,
                confirmButtonColor : "#DD6B55",
                confirmButtonText : "确定",
                cancelButtonText : "取消"
                /*
                 * closeOnConfirm : false, closeOnCancel : false
                 */
            }, function(isConfirm) {
                if (isConfirm) {
                    $.ajax({
                        url : '../../connect/deleteUser?username='+username,
                        type : 'get',
                        dataType : "json",
                        async : false,
                        success : function(data) {
                            if (data.success) {
                                toastr.success(data.message, '提示');
                                $scope.refresh();
                            } else {
                                toastr.error(data.message, '提示');
                            }
                        },
                        error : function() {
                            $scope.refresh();
                        }
                    });
                }
            });
        };
        /* 查询数据 */
        $scope.search = function(page) {
            var searchUser = $("#searchUser").val();

            var pageSize = $("#page-limit").val();
            var start = 1, limit = pageSize;
            frist = 0;
            page = parseInt(page);
            if (page <= 1) {
                start = 0;
            } else {
                start = (page - 1) * pageSize;
            }

            $http.get("../../connect/selectUserList?start=0&limit=" + limit+"&param="+searchUser+"&structure="+structure).
            success(function(response){
                console.log(response);
                $scope.data = response.items;
                $scope.totals = response.totals;
                xh.pagging(page, parseInt($scope.totals), $scope);
            });
        };

        //分页点击
        $scope.pageClick = function(page, totals, totalPages) {
            var searchUser = $("#searchUser").val();
            var pageSize = $("#page-limit").val();
            var start = 1, limit = pageSize;
            page = parseInt(page);
            if (page <= 1) {
                start = 0;
            } else {
                start = (page - 1) * pageSize;
            }

            $http.get("../../connect/selectUserList?start="+start+"&limit=" + limit+"&param="+searchUser+"&structure="+structure).
            success(function(response){
                /*xh.maskHide();*/
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
        };
    });
};

xh.add = function() {
    var fields = $("#addForm").serializeArray();
    var f = {};//声明一个对象
    $.each(fields,function(index,field){
        f[field.name] = field.value;//通过变量，将属性值，属性一起放到对象中
    });
    console.log(f);
    var str = JSON.stringify(f);
    $.ajax({
        url : '../../connect/insertUser',
        contentType : "application/json;charset=utf-8",
        type : 'POST',
        dataType : "json",
        async : true,
        data : str,
        success : function(data) {
            $("#add_btn").button('reset');
            if (data.success) {
                $('#add').modal('hide');
                toastr.success(data.message, '提示');
                xh.refresh();
            } else {
                toastr.error(data.message, '提示');
                xh.refresh();
            }
        },
        error : function() {
            $("#add_btn").button('reset');
        }
    });
};

xh.edit = function() {
    var fields = $("#editForm").serializeArray();
    var f = {};//声明一个对象
    $.each(fields,function(index,field){
        f[field.name] = field.value;//通过变量，将属性值，属性一起放到对象中
    });
    var str = JSON.stringify(f);
    $.ajax({
        url : '../../connect/updateUser',
        contentType : "application/json;charset=utf-8",
        type : 'POST',
        dataType : "json",
        async : true,
        data : str,
        success : function(data) {
            $("#edit_btn").button('reset');
            if (data.success) {
                $('#edit').modal('hide');
                toastr.success(data.message, '提示');
                xh.refresh();
            } else {
                toastr.error(data.message, '提示');
                xh.refresh();
            }
        },
        error : function() {
            $("#edit_btn").button('reset');
        }
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
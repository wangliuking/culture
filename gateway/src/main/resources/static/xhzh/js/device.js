
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
	
	var pageSize = $("#page-limit").val();
    app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);

	app.controller("xhcontroller", function($scope,$http,$location) {

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

	    //页面传值跳转
        if(!jQuery.isEmptyObject($location.search())){
            $scope.locationRTUIDAdd = $location.search().rtu_idAdd;
            $scope.locationSiteIDAdd = $location.search().site_idAdd;
        }

        $scope.changeDeviceTypeShow = 1;//默认显示spd
		$scope.count = "15";//每页数据显示默认值
		$scope.businessMenu=true; //菜单变色

        $http.get("../../connect/selectAllSite?structure="+structure).
        success(function(response){
            var data = response.items;
            var siteNames = [];
            for(var i=0;i<data.length;i++){
                siteNames.push({"site_id":data[i].site_id,"site_name":data[i].site_name});
            }
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
            var etcrs = [{"id":"1","name":"地阻在线检测仪-J"},{"id":"2","name":"地阻在线检测仪-F"}];
            var strays = [{"id":"1","name":"RS485"},{"id":"2","name":"模拟量"}]
            var cats = [{"id":"1","name":"RS485"},{"id":"2","name":"模拟量"}]
            var strayParams = [{"id":"1","name":"A"},{"id":"2","name":"B"},{"id":"3","name":"C"}]
            $scope.etcrs = etcrs;
            $scope.strays = strays;
            $scope.cats = cats;
            $scope.strayParams = strayParams;
        });

        $http.get("../../spd/selectAllSPD?start=0&limit=" + pageSize+"&structure="+structure).
        success(function(response){

        	var data = response.items;
			console.log(data);

            $scope.data = data;
            $scope.totals = response.totals;
            xh.pagging(1, parseInt($scope.totals), $scope);

        });

        /* 变更设备类型选择 */
        $scope.changeDeviceTypeChoose = function(id){
            $scope.deviceTypeChoose = id;
        };

        /*变更地阻类型选择*/
        $scope.changeEtcr = function(id){
            console.log("进入变更地阻类型选择！！！");
            $scope.changeEtcrType = id;
        }

        /*变更杂散电流类型选择*/
        $scope.changeStray = function(id){
            console.log("进入变更杂散电流类型选择！！！");
            $scope.changeStrayType = id;
        }

        /*变更阴极保护类型选择*/
        $scope.changeCat = function(id){
            console.log("进入变更阴极保护类型选择！！！");
            $scope.changeCatType = id;
        }

        /* 变更rtu 列表 */
        $scope.changeRtuList = function(){
        	var site_id = $("#siteName").val();
            $http.get("../../connect/selectAllRTU?site_id="+site_id+"&structure="+structure).
            success(function(response){
                var data = response.items;
                var rtuNames = [];
                for(var i=0;i<data.length;i++){
                    rtuNames.push({"rtu_id":data[i].rtu_id,"rtu_name":data[i].rtu_id});
                }
                $scope.rtuNames = rtuNames;
            });
		};

        /* 变更rtu 列表(添加页面) */
        $scope.changeRtuListAdd = function(){
            var site_id = $("#siteNameAdd").val();
            $http.get("../../connect/selectAllRTU?site_id="+site_id+"&structure="+structure).
            success(function(response){
                var data = response.items;
                var rtuNames = [];
                for(var i=0;i<data.length;i++){
                    rtuNames.push({"rtu_id":data[i].rtu_id,"rtu_name":data[i].rtu_id});
                }
                $scope.rtuNamesAdd = rtuNames;
            });
        };

        /* 变更rtu 列表(修改页面) */
        $scope.changeRtuListEdit = function(){

            var site_id = $("#siteNameEdit").val();
            console.log(site_id);
            $http.get("../../connect/selectAllRTU?site_id="+site_id+"&structure="+structure).
            success(function(response){
                var data = response.items;
                var rtuNames = [];
                for(var i=0;i<data.length;i++){
                    rtuNames.push({"rtu_id":data[i].rtu_id,"rtu_name":data[i].rtu_id});
                }
                $scope.rtuNamesEdit = rtuNames;
            });
        };

        /* 显示添加框 */
        $scope.showMod = function() {
            //$('#add input').val('');
            $('#add').removeData();
            $('#add').modal('show');
        };

        /* 显示spd修改框 */
        $scope.showEditSpd = function(id) {
            $scope.editData = $scope.data[id];
            console.log($scope.editData);
            $('#editSpd').modal('show');
        };

        /* 显示etcr修改框 */
        $scope.showEditEtcr = function(rtu_id,rst_id,rtu_port) {
            $.ajax({
                url : '../../etcr/selectETCRByRTUID4RSTID?rtu_id='+rtu_id+"&rst_id="+rst_id+"&rtu_port="+rtu_port,
                type : 'get',
                dataType : "json",
                async : false,
                success : function(data) {
                    $scope.editData = data.items;
                    console.log($scope.editData);
                    $('#editEtcr').modal('show');
                },
                error : function() {
                    $scope.refresh();
                }
            });
        };

        /* 显示lightning修改框 */
        $scope.showEditLightning = function(id) {
            $scope.editData = $scope.data[id];
            console.log($scope.editData);
            $('#editLightning').modal('show');
        };

        /* 显示static修改框 */
        $scope.showEditStatic = function(id) {
            $scope.editData = $scope.data[id];
            console.log($scope.editData);
            $('#editStatic').modal('show');
        };

        /* 显示rsws修改框 */
        $scope.showEditRsws = function(id) {
            $scope.editData = $scope.data[id];
            console.log($scope.editData);
            $('#editRsws').modal('show');
        };

        /* 显示svt修改框 */
        $scope.showEditSvt = function(id) {
            $scope.editData = $scope.data[id];
            console.log($scope.editData);
            $('#editSvt').modal('show');
        };

        /* 显示hc修改框 */
        $scope.showEditHc = function(id) {
            $scope.editData = $scope.data[id];
            console.log($scope.editData);
            $('#editHc').modal('show');
        };

        /* 显示杂散电流修改框 */
        $scope.showEditStray = function(rtu_id,stret_id,rtu_port) {
            $.ajax({
                url : '../../stray/selectStray?rtu_id='+rtu_id+"&stret_id="+stret_id+"&rtu_port="+rtu_port,
                type : 'get',
                dataType : "json",
                async : false,
                success : function(data) {
                    $scope.editData = data.items;
                    console.log($scope.editData);
                    $('#editStray').modal('show');
                },
                error : function() {
                    $scope.refresh();
                }
            });
        };

        /* 显示阴极保护修改框 */
        $scope.showEditCat = function(id) {
            $scope.editData = $scope.data[id];
            console.log($scope.editData);
            $('#editCat').modal('show');
        };
		
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
		};

		/* 删除spd */
		$scope.delDevSpd = function(site_id,rtu_id,spd_number) {
            swal({
                title : "提示",
                text : "确定要删除该spd配置吗？",
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
                        url : '../../spd/deleteSPD?site_id='+site_id+"&rtu_id="+rtu_id+"&spd_number="+spd_number,
                        type : 'get',
                        dataType : "json",
                        async : false,
                        success : function(data) {
                            if (data.success) {
                                toastr.success(data.message, '提示');
                                $scope.refresh();

                                //记录日志
                                var type = "删除操作";
                                var content = "删除了SPD,站点编号"+site_id+",RTU编号"+rtu_id+",SPD路数"+spd_number;
                                $.ajax({
                                    url : "../../insertLog?type="+type+"&content="+content,
                                    contentType : "application/json;charset=utf-8",
                                    type : 'GET',
                                    success : function() {
                                        console.log("记录日志结束");
                                    }
                                });
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

        /* 删除etcr */
        $scope.delDevEtcr = function(rtu_id,rst_id,rtu_port) {
            swal({
                title : "提示",
                text : "确定要删除该etcr配置吗？",
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
                        url : '../../etcr/deleteETCR?rtu_id='+rtu_id+"&rst_id="+rst_id+"&rtu_port="+rtu_port,
                        type : 'get',
                        dataType : "json",
                        async : false,
                        success : function(data) {
                            $scope.refresh();

                            //记录日志
                            var type = "删除操作";
                            var content = "删除了地阻,RTU编号"+rtu_id+",设备编号"+rst_id+",RTU串口号"+rtu_port;
                            $.ajax({
                                url : "../../insertLog?type="+type+"&content="+content,
                                contentType : "application/json;charset=utf-8",
                                type : 'GET',
                                success : function() {
                                    console.log("记录日志结束");
                                }
                            });
                        },
                        error : function() {
                            $scope.refresh();
                        }
                    });
                }
            });

        };

        /* 删除lightning */
        $scope.delDevLightning = function(rtu_id,ltn_id,rtu_port) {
            swal({
                title : "提示",
                text : "确定要删除该雷电流配置吗？",
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
                        url : '../../lightning/deleteLightning?rtu_id='+rtu_id+"&ltn_id="+ltn_id+"&rtu_port="+rtu_port,
                        type : 'get',
                        dataType : "json",
                        async : false,
                        success : function(data) {
                            $scope.refresh();

                            //记录日志
                            var type = "删除操作";
                            var content = "删除了雷电流,RTU编号"+rtu_id+",设备编号"+ltn_id+",RTU串口号"+rtu_port;
                            $.ajax({
                                url : "../../insertLog?type="+type+"&content="+content,
                                contentType : "application/json;charset=utf-8",
                                type : 'GET',
                                success : function() {
                                    console.log("记录日志结束");
                                }
                            });
                        },
                        error : function() {
                            $scope.refresh();
                        }
                    });
                }
            });

        };

        /* 删除static */
        $scope.delDevStatic = function(rtu_id,staet_id,rtu_port) {
            swal({
                title : "提示",
                text : "确定要删除该静电配置吗？",
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
                        url : '../../static/deleteStatic?rtu_id='+rtu_id+"&staet_id="+staet_id+"&rtu_port="+rtu_port,
                        type : 'get',
                        dataType : "json",
                        async : false,
                        success : function(data) {
                            $scope.refresh();

                            //记录日志
                            var type = "删除操作";
                            var content = "删除了静电,RTU编号"+rtu_id+",设备编号"+staet_id+",RTU串口号"+rtu_port;
                            $.ajax({
                                url : "../../insertLog?type="+type+"&content="+content,
                                contentType : "application/json;charset=utf-8",
                                type : 'GET',
                                success : function() {
                                    console.log("记录日志结束");
                                }
                            });
                        },
                        error : function() {
                            $scope.refresh();
                        }
                    });
                }
            });

        };

        /* 删除rsws */
        $scope.delDevRsws = function(rtu_id,hmt_id,rtu_port) {
            swal({
                title : "提示",
                text : "确定要删除该温湿度配置吗？",
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
                        url : '../../rsws/deleteRsws?rtu_id='+rtu_id+"&hmt_id="+hmt_id+"&rtu_port="+rtu_port,
                        type : 'get',
                        dataType : "json",
                        async : false,
                        success : function(data) {
                            $scope.refresh();

                            //记录日志
                            var type = "删除操作";
                            var content = "删除了温湿度,RTU编号"+rtu_id+",设备编号"+hmt_id+",RTU串口号"+rtu_port;
                            $.ajax({
                                url : "../../insertLog?type="+type+"&content="+content,
                                contentType : "application/json;charset=utf-8",
                                type : 'GET',
                                success : function() {
                                    console.log("记录日志结束");
                                }
                            });
                        },
                        error : function() {
                            $scope.refresh();
                        }
                    });
                }
            });

        };

        /* 删除svt */
        $scope.delDevSvt = function(rtu_id,tilt_id,rtu_port) {
            swal({
                title : "提示",
                text : "确定要删除该倾斜度配置吗？",
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
                        url : '../../svt/deleteSvt?rtu_id='+rtu_id+"&tilt_id="+tilt_id+"&rtu_port="+rtu_port,
                        type : 'get',
                        dataType : "json",
                        async : false,
                        success : function(data) {
                            $scope.refresh();

                            //记录日志
                            var type = "删除操作";
                            var content = "删除了倾斜度,RTU编号"+rtu_id+",设备编号"+tilt_id+",RTU串口号"+rtu_port;
                            $.ajax({
                                url : "../../insertLog?type="+type+"&content="+content,
                                contentType : "application/json;charset=utf-8",
                                type : 'GET',
                                success : function() {
                                    console.log("记录日志结束");
                                }
                            });
                        },
                        error : function() {
                            $scope.refresh();
                        }
                    });
                }
            });

        };


        /* 删除hc */
        $scope.delDevHc = function(rtu_id,es_id,rtu_port) {
            swal({
                title : "提示",
                text : "确定要删除该电气安全配置吗？",
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
                        url : '../../hc/deleteHc?rtu_id='+rtu_id+"&es_id="+es_id+"&rtu_port="+rtu_port,
                        type : 'get',
                        dataType : "json",
                        async : false,
                        success : function(data) {
                            $scope.refresh();

                            //记录日志
                            var type = "删除操作";
                            var content = "删除了电气安全,RTU编号"+rtu_id+",设备编号"+es_id+",RTU串口号"+rtu_port;
                            $.ajax({
                                url : "../../insertLog?type="+type+"&content="+content,
                                contentType : "application/json;charset=utf-8",
                                type : 'GET',
                                success : function() {
                                    console.log("记录日志结束");
                                }
                            });
                        },
                        error : function() {
                            $scope.refresh();
                        }
                    });
                }
            });

        };

        /* 删除杂散电流 */
        $scope.delDevStray = function(rtu_id,stret_id,rtu_port) {
            swal({
                title : "提示",
                text : "确定要删除该杂散电流配置吗？",
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
                        url : '../../stray/deleteStray?rtu_id='+rtu_id+"&stret_id="+stret_id+"&rtu_port="+rtu_port,
                        type : 'get',
                        dataType : "json",
                        async : false,
                        success : function(data) {
                            $scope.refresh();

                            //记录日志
                            var type = "删除操作";
                            var content = "删除了杂散电流,RTU编号"+rtu_id+",设备编号"+stret_id+",RTU串口号"+rtu_port;
                            $.ajax({
                                url : "../../insertLog?type="+type+"&content="+content,
                                contentType : "application/json;charset=utf-8",
                                type : 'GET',
                                success : function() {
                                    console.log("记录日志结束");
                                }
                            });
                        },
                        error : function() {
                            $scope.refresh();
                        }
                    });
                }
            });

        };

        /* 删除阴极保护 */
        $scope.delDevCat = function(rtu_id,cathode_id,rtu_port) {
            swal({
                title : "提示",
                text : "确定要删除该阴极保护配置吗？",
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
                        url : '../../cat/deleteCat?rtu_id='+rtu_id+"&cathode_id="+cathode_id+"&rtu_port="+rtu_port,
                        type : 'get',
                        dataType : "json",
                        async : false,
                        success : function(data) {
                            $scope.refresh();

                            //记录日志
                            var type = "删除操作";
                            var content = "删除了阴极保护,RTU编号"+rtu_id+",设备编号"+cathode_id+",RTU串口号"+rtu_port;
                            $.ajax({
                                url : "../../insertLog?type="+type+"&content="+content,
                                contentType : "application/json;charset=utf-8",
                                type : 'GET',
                                success : function() {
                                    console.log("记录日志结束");
                                }
                            });
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
            var site_id = $("#siteName").val();
            var rtu_id = $("#rtuName").val();

			var pageSize = $("#page-limit").val();
			var start = 1, limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}

            var deviceVal = $("#deviceName").val();
            $scope.changeDeviceTypeShow = deviceVal;
			if($scope.changeDeviceTypeShow == 1){
                $http.get("../../spd/selectAllSPD?start=0&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }else if($scope.changeDeviceTypeShow == 2){
                $http.get("../../etcr/selectAllETCR?start=0&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }else if($scope.changeDeviceTypeShow == 3){
                $http.get("../../lightning/selectAllLightning?start=0&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }else if($scope.changeDeviceTypeShow == 4){
                $http.get("../../static/selectAllStatic?start=0&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }else if($scope.changeDeviceTypeShow == 5){
                $http.get("../../rsws/selectAllRsws?start=0&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }else if($scope.changeDeviceTypeShow == 6){
                $http.get("../../svt/selectAllSvt?start=0&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }else if($scope.changeDeviceTypeShow == 7){
                $http.get("../../hc/selectAllHc?start=0&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }else if($scope.changeDeviceTypeShow == 8){
                $http.get("../../stray/selectAllStray?start=0&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
                success(function(response){
                    console.log(response);
                    $scope.data = response.items;
                    $scope.totals = response.totals;
                    xh.pagging(page, parseInt($scope.totals), $scope);
                });
            }else if($scope.changeDeviceTypeShow == 9){
                $http.get("../../cat/selectAllCat?start=0&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
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
            var site_id = $("#siteName").val();
            var rtu_id = $("#rtuName").val();

            /*var status = $("#testSiteStatus").val();
            if(status == "全部状态"){
                status = null;
            }else if(status == "正常"){
            	status = 0;
			}else if(status == "异常"){
                status = 1;
            }else if(status == "断开"){
                status = 2;
            }*/
            console.log(site_id+"=="+rtu_id);

			var pageSize = $("#page-limit").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}

            if($scope.changeDeviceTypeShow == 1){
                $http.get("../../spd/selectAllSPD?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
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
            }else if($scope.changeDeviceTypeShow == 2){
                $http.get("../../etcr/selectAllETCR?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
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
            }else if($scope.changeDeviceTypeShow == 3){
                $http.get("../../lightning/selectAllLightning?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
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
            }else if($scope.changeDeviceTypeShow == 4){
                $http.get("../../static/selectAllStatic?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
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
            }else if($scope.changeDeviceTypeShow == 5){
                $http.get("../../rsws/selectAllRsws?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
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
            }else if($scope.changeDeviceTypeShow == 6){
                $http.get("../../svt/selectAllSvt?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
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
            }else if($scope.changeDeviceTypeShow == 7){
                $http.get("../../hc/selectAllHc?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
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
            }else if($scope.changeDeviceTypeShow == 8){
                $http.get("../../stray/selectAllStray?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
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
            }else if($scope.changeDeviceTypeShow == 9){
                $http.get("../../cat/selectAllCat?start="+start+"&limit=" + limit+"&site_id="+site_id+"&rtu_id="+rtu_id+"&status="+status+"&structure="+structure).
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
            }
			

		};
	});
};

xh.add = function() {
    $('#test2').css('display', 'block');
    var $scope = angular.element(appElement).scope();

    var fields = $("#addForm").serializeArray();
    var f = {};//声明一个对象
    $.each(fields,function(index,field){
        f[field.name] = field.value;//通过变量，将属性值，属性一起放到对象中
    });
    //console.log(f);
    var str = JSON.stringify(f);
    if($scope.deviceTypeChoose == 1){
        $.ajax({
            url : '../../spd/insertSPD',
            contentType : "application/json;charset=utf-8",
            type : 'POST',
            dataType : "json",
            async : true,
            data : str,
            success : function(data) {
                $('#test2').css('display', 'none');
                $("#add_btn").button('reset');
                if (data.success) {
                    $('#add').modal('hide');
                    toastr.success(data.message, '提示');
                    xh.refresh();

                    //记录日志
                    var type = "新增操作";
                    var content = "新增了SPD,RTU编号"+f.rtu_id+",站点编号"+f.site_id+",SPD路数"+f.spd_number;
                    $.ajax({
                        url : "../../insertLog?type="+type+"&content="+content,
                        contentType : "application/json;charset=utf-8",
                        type : 'GET',
                        success : function() {
                            console.log("记录日志结束");
                        }
                    });
                } else {
                    toastr.error(data.message, '提示');
                    xh.refresh();
                }
            },
            error : function() {
                $('#test2').css('display', 'none');
                $("#add_btn").button('reset');
            }
        });
    }else if($scope.deviceTypeChoose == 2){
        $.ajax({
            url : '../../etcr/insertETCR',
            contentType : "application/json;charset=utf-8",
            type : 'POST',
            dataType : "json",
            async : true,
            data : str,
            success : function(data) {
                $('#test2').css('display', 'none');
                $("#add_btn").button('reset');
                if (data.success) {
                    $('#add').modal('hide');
                    toastr.success(data.message, '提示');
                    xh.refresh();

                    //记录日志
                    var type = "新增操作";
                    var content = "新增了地阻,RTU编号"+f.rtu_id+",设备编号"+f.rst_id+",RTU串口"+f.rtu_port;
                    $.ajax({
                        url : "../../insertLog?type="+type+"&content="+content,
                        contentType : "application/json;charset=utf-8",
                        type : 'GET',
                        success : function() {
                            console.log("记录日志结束");
                        }
                    });
                } else {
                    toastr.error(data.message, '提示');
                    xh.refresh();
                }
            },
            error : function() {
                $('#test2').css('display', 'none');
                $("#add_btn").button('reset');
            }
        });
    }else if($scope.deviceTypeChoose == 3){
        console.log(str);
        $.ajax({
            url : '../../lightning/insertLightning',
            contentType : "application/json;charset=utf-8",
            type : 'POST',
            dataType : "json",
            async : true,
            data : str,
            success : function(data) {
                $('#test2').css('display', 'none');
                $("#add_btn").button('reset');
                if (data.success) {
                    $('#add').modal('hide');
                    toastr.success(data.message, '提示');
                    xh.refresh();

                    //记录日志
                    var type = "新增操作";
                    var content = "新增了雷电流,RTU编号"+f.rtu_id+",设备编号"+f.ltn_id+",RTU串口"+f.rtu_port;
                    $.ajax({
                        url : "../../insertLog?type="+type+"&content="+content,
                        contentType : "application/json;charset=utf-8",
                        type : 'GET',
                        success : function() {
                            console.log("记录日志结束");
                        }
                    });
                } else {
                    toastr.error(data.message, '提示');
                    xh.refresh();
                }
            },
            error : function() {
                $("#add_btn").button('reset');
            }
        });
    }else if($scope.deviceTypeChoose == 4){
        var staet_threshold1 = f.staet_threshold1;
        var staet_threshold2 = f.staet_threshold2;
        var staet_v0 = f.staet_v0;
        f["staet_threshold1"] = staet_threshold1*1000;
        f["staet_threshold2"] = staet_threshold2*1000;
        f["staet_v0"] = staet_v0*1000;
        str = JSON.stringify(f);
        console.log(str);
        $.ajax({
            url : '../../static/insertStatic',
            contentType : "application/json;charset=utf-8",
            type : 'POST',
            dataType : "json",
            async : true,
            data : str,
            success : function(data) {
                $('#test2').css('display', 'none');
                $("#add_btn").button('reset');
                if (data.success) {
                    $('#add').modal('hide');
                    toastr.success(data.message, '提示');
                    xh.refresh();

                    //记录日志
                    var type = "新增操作";
                    var content = "新增了静电,RTU编号"+f.rtu_id+",设备编号"+f.staet_id+",RTU串口"+f.rtu_port;
                    $.ajax({
                        url : "../../insertLog?type="+type+"&content="+content,
                        contentType : "application/json;charset=utf-8",
                        type : 'GET',
                        success : function() {
                            console.log("记录日志结束");
                        }
                    });
                } else {
                    toastr.error(data.message, '提示');
                    xh.refresh();
                }
            },
            error : function() {
                $("#add_btn").button('reset');
            }
        });
    }else if($scope.deviceTypeChoose == 5){
        console.log(str);
        $.ajax({
            url : '../../rsws/insertRsws',
            contentType : "application/json;charset=utf-8",
            type : 'POST',
            dataType : "json",
            async : true,
            data : str,
            success : function(data) {
                $('#test2').css('display', 'none');
                $("#add_btn").button('reset');
                if (data.success) {
                    $('#add').modal('hide');
                    toastr.success(data.message, '提示');
                    xh.refresh();

                    //记录日志
                    var type = "新增操作";
                    var content = "新增了温湿度,RTU编号"+f.rtu_id+",设备编号"+f.hmt_id+",RTU串口"+f.rtu_port;
                    $.ajax({
                        url : "../../insertLog?type="+type+"&content="+content,
                        contentType : "application/json;charset=utf-8",
                        type : 'GET',
                        success : function() {
                            console.log("记录日志结束");
                        }
                    });
                } else {
                    toastr.error(data.message, '提示');
                    xh.refresh();
                }
            },
            error : function() {
                $("#add_btn").button('reset');
            }
        });
    }else if($scope.deviceTypeChoose == 6){
        console.log(str);
        $.ajax({
            url : '../../svt/insertSvt',
            contentType : "application/json;charset=utf-8",
            type : 'POST',
            dataType : "json",
            async : true,
            data : str,
            success : function(data) {
                $('#test2').css('display', 'none');
                $("#add_btn").button('reset');
                if (data.success) {
                    $('#add').modal('hide');
                    toastr.success(data.message, '提示');
                    xh.refresh();

                    //记录日志
                    var type = "新增操作";
                    var content = "新增了倾斜度,RTU编号"+f.rtu_id+",设备编号"+f.tilt_id+",RTU串口"+f.rtu_port;
                    $.ajax({
                        url : "../../insertLog?type="+type+"&content="+content,
                        contentType : "application/json;charset=utf-8",
                        type : 'GET',
                        success : function() {
                            console.log("记录日志结束");
                        }
                    });
                } else {
                    toastr.error(data.message, '提示');
                    xh.refresh();
                }
            },
            error : function() {
                $("#add_btn").button('reset');
            }
        });
    }else if($scope.deviceTypeChoose == 7){
        console.log(str);
        $.ajax({
            url : '../../hc/insertHc',
            contentType : "application/json;charset=utf-8",
            type : 'POST',
            dataType : "json",
            async : true,
            data : str,
            success : function(data) {
                $('#test2').css('display', 'none');
                $("#add_btn").button('reset');
                if (data.success) {
                    $('#add').modal('hide');
                    toastr.success(data.message, '提示');
                    xh.refresh();

                    //记录日志
                    var type = "新增操作";
                    var content = "新增了电气安全,RTU编号"+f.rtu_id+",设备编号"+f.es_id+",RTU串口"+f.rtu_port;
                    $.ajax({
                        url : "../../insertLog?type="+type+"&content="+content,
                        contentType : "application/json;charset=utf-8",
                        type : 'GET',
                        success : function() {
                            console.log("记录日志结束");
                        }
                    });
                } else {
                    toastr.error(data.message, '提示');
                    xh.refresh();
                }
            },
            error : function() {
                $("#add_btn").button('reset');
            }
        });
    }else if($scope.deviceTypeChoose == 8){
        console.log(str);
        $.ajax({
            url : '../../stray/insertStray',
            contentType : "application/json;charset=utf-8",
            type : 'POST',
            dataType : "json",
            async : true,
            data : str,
            success : function(data) {
                $('#test2').css('display', 'none');
                $("#add_btn").button('reset');
                if (data.success) {
                    $('#add').modal('hide');
                    toastr.success(data.message, '提示');
                    xh.refresh();

                    //记录日志
                    var type = "新增操作";
                    var content = "新增了杂散电流,RTU编号"+f.rtu_id+",设备编号"+f.stret_id+",RTU串口"+f.rtu_port;
                    $.ajax({
                        url : "../../insertLog?type="+type+"&content="+content,
                        contentType : "application/json;charset=utf-8",
                        type : 'GET',
                        success : function() {
                            console.log("记录日志结束");
                        }
                    });
                } else {
                    toastr.error(data.message, '提示');
                    xh.refresh();
                }
            },
            error : function() {
                $("#add_btn").button('reset');
            }
        });
    }else if($scope.deviceTypeChoose == 9){
        console.log(str);
        $.ajax({
            url : '../../cat/insertCat',
            contentType : "application/json;charset=utf-8",
            type : 'POST',
            dataType : "json",
            async : true,
            data : str,
            success : function(data) {
                $('#test2').css('display', 'none');
                $("#add_btn").button('reset');
                if (data.success) {
                    $('#add').modal('hide');
                    toastr.success(data.message, '提示');
                    xh.refresh();

                    //记录日志
                    var type = "新增操作";
                    var content = "新增了阴极保护,RTU编号"+f.rtu_id+",设备编号"+f.cathode_id+",RTU串口"+f.rtu_port;
                    $.ajax({
                        url : "../../insertLog?type="+type+"&content="+content,
                        contentType : "application/json;charset=utf-8",
                        type : 'GET',
                        success : function() {
                            console.log("记录日志结束");
                        }
                    });
                } else {
                    toastr.error(data.message, '提示');
                    xh.refresh();
                }
            },
            error : function() {
                $("#add_btn").button('reset');
            }
        });
    }

};

xh.editSpd = function() {
    $('#test2').css('display', 'block');
    var fields = $("#editSpdForm").serializeArray();
    var f = {};//声明一个对象
    $.each(fields,function(index,field){
        f[field.name] = field.value;//通过变量，将属性值，属性一起放到对象中
    });
    var str = JSON.stringify(f);
    $.ajax({
        url : '../../spd/updateSPD',
        contentType : "application/json;charset=utf-8",
        type : 'POST',
        dataType : "json",
        async : true,
        data : str,
        success : function(data) {
            $('#test2').css('display', 'none');
            $("#editSpd_btn").button('reset');
            if (data.success) {
                $('#editSpd').modal('hide');
                toastr.success(data.message, '提示');
                xh.refresh();

                //记录日志
                var type = "修改操作";
                var content = "修改了SPD,RTU编号"+f.rtu_id+",站点编号"+f.site_id+",SPD路数"+f.spd_number;
                $.ajax({
                    url : "../../insertLog?type="+type+"&content="+content,
                    contentType : "application/json;charset=utf-8",
                    type : 'GET',
                    success : function() {
                        console.log("记录日志结束");
                    }
                });
            } else {
                toastr.error(data.message, '提示');
                xh.refresh();
            }
        },
        error : function() {
            $('#test2').css('display', 'none');
            $("#editSpd_btn").button('reset');
        }
    });
};

xh.editEtcr = function() {
    $('#test2').css('display', 'block');
    var fields = $("#editEtcrForm").serializeArray();
    var f = {};//声明一个对象
    $.each(fields,function(index,field){
        f[field.name] = field.value;//通过变量，将属性值，属性一起放到对象中
    });
    var str = JSON.stringify(f);
    $.ajax({
        url : '../../etcr/updateETCR',
        contentType : "application/json;charset=utf-8",
        type : 'POST',
        dataType : "json",
        async : true,
        data : str,
        success : function(data) {
            $('#test2').css('display', 'none');
            $("#editEtcr_btn").button('reset');
            if (data.success) {
                $('#editEtcr').modal('hide');
                toastr.success(data.message, '提示');
                xh.refresh();

                //记录日志
                var type = "修改操作";
                var content = "修改了地阻,RTU编号"+f.rtu_id+",设备编号"+f.rst_id+",RTU串口"+f.rtu_port;
                $.ajax({
                    url : "../../insertLog?type="+type+"&content="+content,
                    contentType : "application/json;charset=utf-8",
                    type : 'GET',
                    success : function() {
                        console.log("记录日志结束");
                    }
                });
            } else {
                toastr.error(data.message, '提示');
                xh.refresh();
            }
        },
        error : function() {
            $('#test2').css('display', 'none');
            $("#editEtcr_btn").button('reset');
        }
    });
};

xh.editLightning = function() {
    $('#test2').css('display', 'block');
    var fields = $("#editLightningForm").serializeArray();
    var f = {};//声明一个对象
    $.each(fields,function(index,field){
        f[field.name] = field.value;//通过变量，将属性值，属性一起放到对象中
    });
    var str = JSON.stringify(f);
    $.ajax({
        url : '../../lightning/updateLightning',
        contentType : "application/json;charset=utf-8",
        type : 'POST',
        dataType : "json",
        async : true,
        data : str,
        success : function(data) {
            $('#test2').css('display', 'none');
            $("#editLightning_btn").button('reset');
            if (data.success) {
                $('#editLightning').modal('hide');
                toastr.success(data.message, '提示');
                xh.refresh();

                //记录日志
                var type = "修改操作";
                var content = "修改了雷电流,RTU编号"+f.rtu_id+",设备编号"+f.ltn_id+",RTU串口"+f.rtu_port;
                $.ajax({
                    url : "../../insertLog?type="+type+"&content="+content,
                    contentType : "application/json;charset=utf-8",
                    type : 'GET',
                    success : function() {
                        console.log("记录日志结束");
                    }
                });
            } else {
                toastr.error(data.message, '提示');
                xh.refresh();
            }
        },
        error : function() {
            $('#test2').css('display', 'none');
            $("#editLightning_btn").button('reset');
        }
    });
};

xh.editStatic = function() {
    $('#test2').css('display', 'block');
    var fields = $("#editStaticForm").serializeArray();
    var f = {};//声明一个对象
    $.each(fields,function(index,field){
        f[field.name] = field.value;//通过变量，将属性值，属性一起放到对象中
    });
    var staet_threshold1 = f.staet_threshold1;
    var staet_threshold2 = f.staet_threshold2;
    var staet_v0 = f.staet_v0;
    f["staet_threshold1"] = staet_threshold1*1000;
    f["staet_threshold2"] = staet_threshold2*1000;
    f["staet_v0"] = staet_v0*1000;
    var str = JSON.stringify(f);
    $.ajax({
        url : '../../static/updateStatic',
        contentType : "application/json;charset=utf-8",
        type : 'POST',
        dataType : "json",
        async : true,
        data : str,
        success : function(data) {
            $('#test2').css('display', 'none');
            $("#editStatic_btn").button('reset');
            if (data.success) {
                $('#editStatic').modal('hide');
                toastr.success(data.message, '提示');
                xh.refresh();

                //记录日志
                var type = "修改操作";
                var content = "修改了静电,RTU编号"+f.rtu_id+",设备编号"+f.staet_id+",RTU串口"+f.rtu_port;
                $.ajax({
                    url : "../../insertLog?type="+type+"&content="+content,
                    contentType : "application/json;charset=utf-8",
                    type : 'GET',
                    success : function() {
                        console.log("记录日志结束");
                    }
                });
            } else {
                toastr.error(data.message, '提示');
                xh.refresh();
            }
        },
        error : function() {
            $("#editStatic_btn").button('reset');
        }
    });
};

xh.editRsws = function() {
    $('#test2').css('display', 'block');
    var fields = $("#editRswsForm").serializeArray();
    var f = {};//声明一个对象
    $.each(fields,function(index,field){
        f[field.name] = field.value;//通过变量，将属性值，属性一起放到对象中
    });
    var str = JSON.stringify(f);
    $.ajax({
        url : '../../rsws/updateRsws',
        contentType : "application/json;charset=utf-8",
        type : 'POST',
        dataType : "json",
        async : true,
        data : str,
        success : function(data) {
            $('#test2').css('display', 'none');
            $("#editRsws_btn").button('reset');
            if (data.success) {
                $('#editRsws').modal('hide');
                toastr.success(data.message, '提示');
                xh.refresh();

                //记录日志
                var type = "修改操作";
                var content = "修改了温湿度,RTU编号"+f.rtu_id+",设备编号"+f.hmt_id+",RTU串口"+f.rtu_port;
                $.ajax({
                    url : "../../insertLog?type="+type+"&content="+content,
                    contentType : "application/json;charset=utf-8",
                    type : 'GET',
                    success : function() {
                        console.log("记录日志结束");
                    }
                });
            } else {
                toastr.error(data.message, '提示');
                xh.refresh();
            }
        },
        error : function() {
            $("#editRsws_btn").button('reset');
        }
    });
};

xh.editSvt = function() {
    $('#test2').css('display', 'block');
    var fields = $("#editSvtForm").serializeArray();
    var f = {};//声明一个对象
    $.each(fields,function(index,field){
        f[field.name] = field.value;//通过变量，将属性值，属性一起放到对象中
    });
    var str = JSON.stringify(f);
    $.ajax({
        url : '../../svt/updateSvt',
        contentType : "application/json;charset=utf-8",
        type : 'POST',
        dataType : "json",
        async : true,
        data : str,
        success : function(data) {
            $('#test2').css('display', 'none');
            $("#editSvt_btn").button('reset');
            if (data.success) {
                $('#editSvt').modal('hide');
                toastr.success(data.message, '提示');
                xh.refresh();

                //记录日志
                var type = "修改操作";
                var content = "修改了倾斜度,RTU编号"+f.rtu_id+",设备编号"+f.tilt_id+",RTU串口"+f.rtu_port;
                $.ajax({
                    url : "../../insertLog?type="+type+"&content="+content,
                    contentType : "application/json;charset=utf-8",
                    type : 'GET',
                    success : function() {
                        console.log("记录日志结束");
                    }
                });
            } else {
                toastr.error(data.message, '提示');
                xh.refresh();
            }
        },
        error : function() {
            $("#editSvt_btn").button('reset');
        }
    });
};

xh.editHc = function() {
    $('#test2').css('display', 'block');
    var fields = $("#editHcForm").serializeArray();
    var f = {};//声明一个对象
    $.each(fields,function(index,field){
        f[field.name] = field.value;//通过变量，将属性值，属性一起放到对象中
    });
    var str = JSON.stringify(f);
    $.ajax({
        url : '../../hc/updateHc',
        contentType : "application/json;charset=utf-8",
        type : 'POST',
        dataType : "json",
        async : true,
        data : str,
        success : function(data) {
            $('#test2').css('display', 'none');
            $("#editHc_btn").button('reset');
            if (data.success) {
                $('#editHc').modal('hide');
                toastr.success(data.message, '提示');
                xh.refresh();

                //记录日志
                var type = "修改操作";
                var content = "修改了电气安全,RTU编号"+f.rtu_id+",设备编号"+f.es_id+",RTU串口"+f.rtu_port;
                $.ajax({
                    url : "../../insertLog?type="+type+"&content="+content,
                    contentType : "application/json;charset=utf-8",
                    type : 'GET',
                    success : function() {
                        console.log("记录日志结束");
                    }
                });
            } else {
                toastr.error(data.message, '提示');
                xh.refresh();
            }
        },
        error : function() {
            $("#editHc_btn").button('reset');
        }
    });
};

xh.editStray = function() {
    $('#test2').css('display', 'block');
    var fields = $("#editStrayForm").serializeArray();
    var f = {};//声明一个对象
    $.each(fields,function(index,field){
        f[field.name] = field.value;//通过变量，将属性值，属性一起放到对象中
    });
    var str = JSON.stringify(f);
    $.ajax({
        url : '../../stray/updateStray',
        contentType : "application/json;charset=utf-8",
        type : 'POST',
        dataType : "json",
        async : true,
        data : str,
        success : function(data) {
            $('#test2').css('display', 'none');
            $("#editStray_btn").button('reset');
            if (data.success) {
                $('#editStray').modal('hide');
                toastr.success(data.message, '提示');
                xh.refresh();

                //记录日志
                var type = "修改操作";
                var content = "修改了杂散电流,RTU编号"+f.rtu_id+",设备编号"+f.stret_id+",RTU串口"+f.rtu_port;
                $.ajax({
                    url : "../../insertLog?type="+type+"&content="+content,
                    contentType : "application/json;charset=utf-8",
                    type : 'GET',
                    success : function() {
                        console.log("记录日志结束");
                    }
                });
            } else {
                toastr.error(data.message, '提示');
                xh.refresh();
            }
        },
        error : function() {
            $("#editStray_btn").button('reset');
        }
    });
};

xh.editCat = function() {
    $('#test2').css('display', 'block');
    var fields = $("#editCatForm").serializeArray();
    var f = {};//声明一个对象
    $.each(fields,function(index,field){
        f[field.name] = field.value;//通过变量，将属性值，属性一起放到对象中
    });
    var str = JSON.stringify(f);
    $.ajax({
        url : '../../cat/updateCat',
        contentType : "application/json;charset=utf-8",
        type : 'POST',
        dataType : "json",
        async : true,
        data : str,
        success : function(data) {
            $('#test2').css('display', 'none');
            $("#editCat_btn").button('reset');
            if (data.success) {
                $('#editCat').modal('hide');
                toastr.success(data.message, '提示');
                xh.refresh();

                //记录日志
                var type = "修改操作";
                var content = "修改了阴极保护,RTU编号"+f.rtu_id+",设备编号"+f.cathode_id+",RTU串口"+f.rtu_port;
                $.ajax({
                    url : "../../insertLog?type="+type+"&content="+content,
                    contentType : "application/json;charset=utf-8",
                    type : 'GET',
                    success : function() {
                        console.log("记录日志结束");
                    }
                });
            } else {
                toastr.error(data.message, '提示');
                xh.refresh();
            }
        },
        error : function() {
            $("#editCat_btn").button('reset');
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

/* 显示网页遮罩层 */
xh.maskShow = function() {
    var html = "<div class='xh-mask text-white'><div class='color-line'></div>";
    html += "<i class=''>请等待...</i>";
    html += "</div>";
    $("body").append(html);
};

/* 关闭网页遮罩层 */
xh.maskHide = function() {
    $(".xh-mask").fadeOut(300);
}
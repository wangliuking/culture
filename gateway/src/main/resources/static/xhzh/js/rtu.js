
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

        $scope.goDevice = function(rtu_id,site_id) {
            window.location.href = "/xhzh/deviceList.html?rtu_idAdd="+rtu_id+"&site_idAdd="+site_id;
            //$location.path('/xhzh/deviceList.html');
        };

        $scope.goRTUStatistic = function(id) {
            window.location.href = '/xhzh/rtuStatistic.html?id='+id;
            //$location.path('/xhzh/deviceList.html');
        };


        $scope.count = "15";//每页数据显示默认值
		$scope.businessMenu=true; //菜单变色

        $http.get("../../connect/selectAllSite?structure="+structure).
        success(function(response){
            var data = response.items;
            var siteNames = [];
            siteNames.push({"site_id":0,"site_name":"全部名称"});
            for(var i=0;i<data.length;i++){
                siteNames.push({"site_id":data[i].site_id,"site_name":data[i].site_name});
            }
            $scope.siteNames = siteNames;

			$scope.connectType = [{"id":2,"name":"全部模式"},{"id":1,"name":"TCP"},{"id":0,"name":"UDP"}];
        });

        $http.get("../../connect/selectAllRTU?start=0&limit=" + pageSize+"&structure="+structure).
        success(function(response){
        	var data = response.items;

            $scope.data = data;
            $scope.totals = response.totals;
            xh.pagging(1, parseInt($scope.totals), $scope);
        });

        /* 显示添加框 */
        $scope.showMod = function() {
            //$('#add input').val('');
            $('#addRTU').removeData();
            $('#addRTU').modal('show');
        };

        /* 显示修改框 */
        $scope.showEdit = function(id) {
            $scope.editData = $scope.data[id];
            $('#edit').modal('show');
        };
		
		/* 刷新数据 */
		$scope.refresh = function() {
			$scope.search(1);
		};

		/* 删除 */
		$scope.delBs = function(id) {
            swal({
                title : "提示",
                text : "确定要删除该RTU吗？这同时会删除相关设备",
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
                        url : '../../connect/deleteRTU?id='+id,
                        type : 'get',
                        dataType : "json",
                        async : false,
                        success : function(data) {
                            if (data.success) {
                                toastr.success(data.message, '提示');
                                $scope.refresh();

                                //记录日志
                                var type = "删除操作";
                                var content = "删除了RTU"+id;
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
		/* 查询数据 */
		$scope.search = function(page) {
            var site_id = $("#testSiteName").val();
            if(site_id == 0){
                site_id = '';
			}
            var connect_type = $("#testRTUConnectType").val();
            if(connect_type == "全部模式"){
                connect_type = null;
            }
            var rtu_ip = $("#rtu_ip").val();
            var rtu_netmask = $("#rtu_netmask").val();
            var rtu_gateway = $("#rtu_gateway").val();

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
            console.log(site_id+"=="+connect_type+"=="+rtu_ip+"=="+rtu_netmask+"=="+rtu_gateway)

			var pageSize = $("#page-limit").val();
			var start = 1, limit = pageSize;
			frist = 0;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			
			$http.get("../../connect/selectAllRTU?start=0&limit=" + limit+"&site_id="+site_id+"&connect_type="+connect_type+"&rtu_ip="+rtu_ip+"&rtu_netmask="+rtu_netmask+"&rtu_gateway="+rtu_gateway+"&status="+status+"&structure="+structure).
			success(function(response){
				console.log(response);
				$scope.data = response.items;
				$scope.totals = response.totals;
				xh.pagging(page, parseInt($scope.totals), $scope);
			});
		};

		//分页点击
		$scope.pageClick = function(page, totals, totalPages) {
            var site_id = $("#testSiteName").val();
            if(site_id == 0){
                site_id = '';
            }
            var connect_type = $("#testRTUConnectType").val();
            if(connect_type == "全部模式"){
                connect_type = null;
            }
            var rtu_ip = $("#rtu_ip").val();
            var rtu_netmask = $("#rtu_netmask").val();
            var rtu_gateway = $("#rtu_gateway").val();

			var pageSize = $("#page-limit").val();
			var start = 1, limit = pageSize;
			page = parseInt(page);
			if (page <= 1) {
				start = 0;
			} else {
				start = (page - 1) * pageSize;
			}
			
			$http.get("../../connect/selectAllRTU?start="+start+"&limit=" + limit+"&site_id="+site_id+"&connect_type="+connect_type+"&rtu_ip="+rtu_ip+"&rtu_netmask="+rtu_netmask+"&rtu_gateway="+rtu_gateway+"&status="+status+"&structure="+structure).
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

xh.addRTU = function() {
    var fields = $("#addRTUForm").serializeArray();
    var f = {};//声明一个对象
    $.each(fields,function(index,field){
        f[field.name] = field.value;//通过变量，将属性值，属性一起放到对象中
    });
    console.log(f);
    var str = JSON.stringify(f);
	$.ajax({
		url : '../../connect/insertRTU',
		contentType : "application/json;charset=utf-8",
		type : 'POST',
		dataType : "json",
		async : true,
		data : str,
		success : function(data) {
            $("#addRTU_btn").button('reset');
            if (data.success) {
                $('#addRTU').modal('hide');
                toastr.success(data.message, '提示');
                xh.refresh();

                //记录日志
                var type = "新增操作";
                var content = "新增了RTU"+f.rtu_id;
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
			$("#addRTU_btn").button('reset');
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
        url : '../../connect/updateRTU',
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

                //记录日志
                var type = "修改操作";
                var content = "修改了RTU"+f.rtu_id;
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

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
        pageSize = "";
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

        $http.get("../../connect/selectAllStructure?structure="+structure).
        success(function(data){
            $scope.industrys = ["医疗","气象","新能源","轨道交通","石油化工","国防军工","电力","通讯"]
            startTree(data);
            createEcharts(data);
        });

        $scope.createBegin = function () {
            $http.get("../../connect/selectAllStructure?structure="+structure).
            success(function(data){
                startTree(data);
                createEcharts(data);
            });
        }

	});
};

// 刷新数据
xh.refresh = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.refresh();
};

var startTree = function(data) {
    // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    var setting = {
        view: {
            addHoverDom: addHoverDom, //当鼠标移动到节点上时，显示用户自定义控件
            removeHoverDom: removeHoverDom, //离开节点时的操作
            fontCss: { 'color': 'blue', 'font-family': '微软雅黑'}
            //fontCss: getFontCss //个性化样式
        },
        edit : {
            enable : true
            // 单独设置为true时，可加载修改、删除图标
        },
        data : {
            simpleData : {
                enable : true
            }
        },
        callback : {
            //onClick : zTreeOnClick,// 单击事件
            beforeDrag: beforeDrag,
            beforeRemove: beforeRemove,
            beforeRename: beforeRename,
            onRemove: onRemove,
            onRename: onRename
        }
    };
    // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
    /*var zNodes = [ {
        name : "组织名称",
        open : true,
        "checked" : "true",
        children : dataForTree
    } ];*/
    var log,className = "dark";
    function beforeDrag(treeId, treeNodes) {
        return false;
    }
    function beforeRemove(treeId, treeNode) {
        className = (className === "dark" ? "" : "dark");
        showLog("[ " + getTime() + " beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; "
            + treeNode.name);
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.selectNode(treeNode);
        return confirm("确认删除 " + treeNode.name + " 吗？");
    }
    function onRemove(e, treeId, treeNode) {
        showLog("[ " + getTime() + " onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; "
            + treeNode.name);
        $.ajax({
            type: "GET",
            url: "../../connect/deleteStructure?id="+treeNode.id,
            dataType: "json",
            success: function(data){
                var $scope = angular.element(appElement).scope();
                $scope.createBegin();
            }
        });
    }
    var tempnewName;
    function beforeRename(treeId, treeNode, newName) {
        console.log(treeNode+"==="+treeNode.name+"==="+treeNode.id);
        tempnewName=newName;
        className = (className === "dark" ? "" : "dark");
        showLog("[ " + getTime() + " beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; "
            + treeNode.name);
        if (newName.length == 0) {
            alert("节点名称不能为空.");
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            setTimeout(function() {
                zTree.editName(treeNode);
            }, 10);
            return false;
        }
        return true;
    }
    function onRename(e, treeId, treeNode) {
        showLog("[ " + getTime() + " onRename ]&nbsp;&nbsp;&nbsp;&nbsp; "
            + treeNode.name);
        $.ajax({
            type: "GET",
            url: "../../connect/updateStructure?id="+treeNode.id+"&name="+tempnewName,
            dataType: "json",
            success: function(){
                var $scope = angular.element(appElement).scope();
                $scope.createBegin();
            }
        });
    }
    function showLog(str) {
        if (!log)
            log = $("#log");
        log.append("<li class='" + className + "'>" + str + "</li>");
        if (log.children("li").length > 8) {
            log.get(0).removeChild(log.children("li")[0]);
        }
    }
    function getTime() {
        var now = new Date(), h = now.getHours(), m = now.getMinutes(), s = now
            .getSeconds(), ms = now.getMilliseconds();
        return (h + ":" + m + ":" + s + " " + ms);
    }

    $(document).ready(function() {
        // 页面加载成功后,开始加载树形结构
        $.fn.zTree.init($("#treeDemo"), setting, data);
    });
    // 为每个节点添加点击事件
    /*function zTreeOnClick(event, treeId, treeNode) {
        xh.select(treeNode.id);
    };*/
};

function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
};

function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span"); //获取节点信息
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;

    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId + "' title='add node' onfocus='this.blur();'></span>"; //定义添加按钮
    sObj.after(addStr); //加载添加按钮
    var btn = $("#addBtn_"+treeNode.tId);

    //绑定添加事件，并定义添加操作
    if (btn) btn.bind("click", function(){
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        //将新节点添加到数据库中
        var name='NewNode';
        /*$.post('./index.php?r=data/addtree&pid='+treeNode.id+'&name='+name,function (data) {
            var newID = data; //获取新添加的节点Id
            zTree.addNodes(treeNode, {id:newID, pId:treeNode.id, name:name}); //页面上添加节点
            var node = zTree.getNodeByParam("id", newID, null); //根据新的id找到新添加的节点
            zTree.selectNode(node); //让新添加的节点处于选中状态
        });*/
        console.log(+"==="+treeNode.pId+"==="+treeNode.level+"==="+treeNode.name);
        $("#id").val(treeNode.id);
        $("#pId").val(treeNode.pId);
        $("#level").val(treeNode.level);
        $('#add').modal('show');
    });
};
function createEcharts(data) {
    //console.log(data);
    // 基于准备好的dom，初始化echarts实例 macarons
    var myChart = echarts.init(document.getElementById('testTree'));

    myChart.showLoading();    //显示Loading标志； var myChart = echarts.init(document.getElementById('页面中div的id'));

    echarts.util.each(data.children, function (datum, index) {
        index % 2 === 0 && (datum.collapsed = true);
    });    //间隔展开子数据，animate，display，physics，scale，vis是展开的

    myChart.setOption(option = {
        tooltip: {    //提示框组件
            trigger: 'item',    //触发类型，默认：item（数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用）。可选：'axis'：坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。'none':什么都不触发。
            triggerOn: 'mousemove'    //提示框触发的条件，默认mousemove|click（鼠标点击和移动时触发）。可选mousemove：鼠标移动时，click：鼠标点击时，none：
        },
        series: [    //系列列表
            {
                type: 'tree',    //树形结构

                data: data,    //上面从flare.json中得到的数据

                top: '1%',       //距离上
                left: '7%',      //左
                bottom: '1%',    //下
                right: '20%',    //右的距离

                symbolSize: 7,   //标记的大小，就是那个小圆圈，默认7

                label: {         //每个节点所对应的标签的样式
                    normal: {
                        position: 'left',       //标签的位置
                        verticalAlign: 'middle',//文字垂直对齐方式，默认自动。可选：top，middle，bottom
                        align: 'right',         //文字水平对齐方式，默认自动。可选：top，center，bottom
                        fontSize: 16             //标签文字大小
                    }
                },

                leaves: {    //叶子节点的特殊配置，如上面的树图示例中，叶子节点和非叶子节点的标签位置不同
                    label: {
                        normal: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    }
                },

                expandAndCollapse: true,    //子树折叠和展开的交互，默认打开
                animationDuration: 550,     //初始动画的时长，支持回调函数,默认1000
                animationDurationUpdate: 750//数据更新动画的时长，默认300
            }
        ]
    });

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    myChart.hideLoading();
}


xh.add = function() {
    var $scope = angular.element(appElement).scope();
    var fields = $("#addForm").serializeArray();
    var f = {};//声明一个对象
    $.each(fields,function(index,field){
        f[field.name] = field.value;//通过变量，将属性值，属性一起放到对象中
    });
    console.log(f);
    var str = JSON.stringify(f);
    $.ajax({
        url : '../../connect/insertStructure',
        contentType : "application/json;charset=utf-8",
        type : 'POST',
        dataType : "json",
        async : true,
        data : str,
        success : function(data) {
            $("#add_btn").button('reset');
            if (data.success) {
                //重新加载列表和树形图
                $scope.createBegin();
                $('#add').modal('hide');
                toastr.success(data.message, '提示');
                //xh.refresh();
            } else {
                toastr.error(data.message, '提示');
                //xh.refresh();
            }
        },
        error : function() {
            $("#add_btn").button('reset');
        }
    });
};
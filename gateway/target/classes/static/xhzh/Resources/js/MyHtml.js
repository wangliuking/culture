var InitializeTable1 = function() {
	// Initialize Example 2
	// 初始化表格
	$('#example2').dataTable({
		"bAutoWidth" : false,
		"bPaginate" : false,
		"bInfo" : false,
		"bFilter" : false,
		"sPaginationType" : "full_numbers",
		"sAjaxSource" : "index/ajax",
		"oLanguage" : {
			"sLengthMenu" : "每页显示 _MENU_ 条",
			"sZeroRecords" : "没有找到符合条件的数据",
			"sInfo" : "",
			"sInfoEmpty" : "没有记录",
			"sInfoFiltered" : "(从 _MAX_ 条记录中过滤)",
			"sSearch" : "搜索",
			"sProcessing" : "数据加载中...",
			"oPaginate" : {
				"sFirst" : "首页",
				"sPrevious" : "上页",
				"sNext" : "下页",
				"sLast" : "尾页"
			}
		},
		"aoColumns" : [ {
			"mData" : function(a){
				return '<a class="showByBsId" href="javascript:void(0)" onclick="aClick('+a.bsId+')">'+a.name+'</a>';
			}
		}, {
			"mData" : function(a) {
				if (a.alarmLevel == 1) {
					return '<span style="color:white">一般</span>';
				} else if (a.alarmLevel == 2) {
					return '<span style="color:yellow">严重</span>';
				} else if (a.alarmLevel == 3) {
					return '<span style="color:red">紧急</span>';
				}
			}
		}, {
			"mData" : function(a) {
				if (a.alarmType == 1) {
					return '<span>系统</span>';
				} else if (a.alarmType == 2) {
					return '<span>设备</span>';
				} else if (a.alarmType == 3) {
					return '<span>调度台</span>';
				}
			}
		}, {
			"mData" : "content"
		} ]
	});

}
var InitializeTable2 = function(a) {
	$('#table_id_example').dataTable({
		"bAutoWidth" : false,
		"bPaginate" : false,
		"bInfo" : false,
		"bFilter" : false,
		"sPaginationType" : "full_numbers",
		"sAjaxSource" : "index/ajax_table2",
		"oLanguage" : {
			"sLengthMenu" : "每页显示 _MENU_ 条",
			"sZeroRecords" : "没有找到符合条件的数据",
			"sInfo" : "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条",
			"sInfoEmpty" : "没有记录",
			"sInfoFiltered" : "(从 _MAX_ 条记录中过滤)",
			"sSearch" : "搜索",
			"sProcessing" : "数据加载中...",
			"oPaginate" : {
				"sFirst" : "首页",
				"sPrevious" : "上页",
				"sNext" : "下页",
				"sLast" : "尾页"
			}
		},
		"aoColumns" : [ {
			"mData" : function(a){
				return '<a class="showByBsId" href="javascript:void(0)" onclick="aClick('+a.bsId+')">'+a.name+'</a>';
			}
		}, {
			"mData" : function(a) {
				if (a.status == 0) {
					return '<span style="color:white">断开</span>';
				} else if (a.status == 1) {
					return '<span style="color:yellow">连接</span>';
				}
			}
		}, {
			"mData" : "updateTime"
		} ]
	});
}
var InitializeTable3 = function() {
	$('#table_id_example1').dataTable({
		"bAutoWidth" : false,
		"bPaginate" : false,
		"bInfo" : false,
		"bFilter" : false,
		"sPaginationType" : "full_numbers",
		"sAjaxSource" : "index/ajax_table3",
		"oLanguage" : {
			"sLengthMenu" : "每页显示 _MENU_ 条",
			"sZeroRecords" : "没有找到符合条件的数据",
			"sInfo" : "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条",
			"sInfoEmpty" : "没有记录",
			"sInfoFiltered" : "(从 _MAX_ 条记录中过滤)",
			"sSearch" : "搜索",
			"sProcessing" : "数据加载中...",
			"oPaginate" : {
				"sFirst" : "首页",
				"sPrevious" : "上页",
				"sNext" : "下页",
				"sLast" : "尾页"
			}
		},
		"aoColumns" : [ {
			"mData" : "mscId"
		}, {
			"mData" : function(a) {
				if (a.onlineStatus == 0) {
					return '<span style="color:white">离线</span>';
				} else if (a.onlineStatus == 1) {
					return '<span style="color:yellow">在线</span>';
				}
			}
		}, {
			"mData" : function(a) {
				if (a.talkStatus == 0) {
					return '<span style="color:white">空闲</span>';
				} else if (a.talkStatus == 1) {
					return '<span style="color:grown">通话中</span>';
				}
			}
		}, {
			"mData" : "updateTime"
		} ]
	});
}
InitializeTable1();
InitializeTable2();
InitializeTable3();
/*
 * 表格刷新操作
 */
$(function() {
	$("#table1_flash").click(function() {
		$('#example2').DataTable().ajax.reload();
	});
	$("#table2_flash").click(function() {
		$('#table_id_example').DataTable().ajax.reload();
	});
	$("#table3_flash").click(function() {
		$('#table_id_example1').DataTable().ajax.reload();
	});
})

/*
 * 悬浮窗关闭与出现
 */
$(function() {
	$(".close_right").click(function() {
		$(".panel-body").animate({
			right : "-40%"
		});
		window.setTimeout(function() {
			$(".left_arrow").css("display", "block");
		}, 600);
	});
	$(".left_arrow").mouseover(function() {
		$(".panel-body").animate({
			right : "0"
		});
		$(".left_arrow").css("display", "none");
	});

	$(".close_left").click(function() {
		$(".panel-body4").animate({
			left : "-15%"
		});
		window.setTimeout(function() {
			$(".right_arrow").css("display", "block");
		}, 600);
	});
	$(".right_arrow").mouseover(function() {
		$(".panel-body4").animate({
			left : "0"
		});
		$(".right_arrow").css("display", "none");
	});

})
/* 展开收缩效果 */
$(function() {
	// 菜单隐藏展开
	var tabs_i = 0
	$('.vtitle').click(function() {
		var _self = $(this);
		var j = $('.vtitle').index(_self);
		tabs_i = j;
		$('.vtitle em').each(function(e) {
			if (e == tabs_i) {
				if ($('em', _self).attr('class') == "v v02") {
					$('em', _self).removeClass('v02').addClass('v01');
					$('.vcon').eq(tabs_i).slideUp();
				} else {
					$('em', _self).removeClass('v01').addClass('v02');
					$('.vcon').eq(tabs_i).slideDown();
				}
			}
		});

	});
	// 关闭悬浮窗
	$('#close1').click(function() {
		$('.vcon').eq(0).animate({
			"display" : "none"
		}, 500);
		$('.vtitle').eq(0).animate({
			"display" : "none"
		}, 500);
	});
})
/*文档加载完变更地图高度和右侧框高度*/
$(document).ready(function(){
	$(window).on('load', function() {
		var a = $('#header').css("height");
		var b = $('#nav-top').css("height");
		var c = $(window).height();
		
		console.log("a=>"+a);
		console.log("b=>"+b);
		console.log("c=>"+c);
		a=a.replace('px','');
		b=b.replace('px','');
		var temp = parseInt(c)-parseInt(a)-parseInt(b);
		console.log("tem=>"+temp);
		$('#map_canvas').css({'height':temp});
		$('.panel-body').css({'height':temp});
	});
	
});
/* 模态框样式变化操作 */
/* 将模态框移入页面中部 */
$(function() {
	$('#myModal').on(
			'show.bs.modal',
			function(e) {
				// 关键代码，如没将modal设置为 block，则$modala_dialog.height() 为零
				$(this).css('display', 'block');
				var modalHeight = ($(window).height() / 2 - $(
						'#youModel .modal-dialog').height() / 2) * 0.2;
				$(this).find('.modal-dialog').css({
					'margin-top' : modalHeight
				});
			});

})

/* 拖拽模态框 */
var mouseStartPoint = {
	"left" : 0,
	"top" : 0
};
var mouseEndPoint = {
	"left" : 0,
	"top" : 0
};
var mouseDragDown = false;
var oldP = {
	"left" : 0,
	"top" : 0
};
var moveTartet;
$(document).ready(
		function() {
			$(document).on("mousedown", ".modal-header", function(e) {
				if ($(e.target).hasClass("close"))// 点关闭按钮不能移动对话框
					return;
				mouseDragDown = true;
				moveTartet = $(this).parent();
				mouseStartPoint = {
					"left" : e.clientX,
					"top" : e.clientY
				};
				oldP = moveTartet.offset();
			});
			$(document).on("mouseup", function(e) {
				mouseDragDown = false;
				moveTartet = undefined;
				mouseStartPoint = {
					"left" : 0,
					"top" : 0
				};
				oldP = {
					"left" : 0,
					"top" : 0
				};
			});
			$(document).on(
					"mousemove",
					function(e) {
						if (!mouseDragDown || moveTartet == undefined)
							return;
						var mousX = e.clientX;
						var mousY = e.clientY;
						if (mousX < 0)
							mousX = 0;
						if (mousY < 0)
							mousY = 25;
						mouseEndPoint = {
							"left" : mousX,
							"top" : mousY
						};
						var width = moveTartet.width();
						var height = moveTartet.height();
						mouseEndPoint.left = mouseEndPoint.left
								- (mouseStartPoint.left - oldP.left);// 移动修正，更平滑
						mouseEndPoint.top = mouseEndPoint.top
								- (mouseStartPoint.top - oldP.top);
						moveTartet.offset(mouseEndPoint);
					});
		});

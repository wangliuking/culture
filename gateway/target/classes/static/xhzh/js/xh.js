if (!("xh" in window)) {
	window.xh = {};
};
var powerData=null;
var aesstr="2f6DhqPBNoK3f2A7";
$(document).ready(function() {
	/*if (TopESAConfig()){xh.initCertList();}*/
	/* 初始化页面加载动画 */
	/*xh.setcookie("skin","skin-blur-ocean");*/
	if(xh.getcookie("skin")==null || xh.getcookie("skin")==""){
		xh.setcookie("skin","skin-blur-ocean");
	}
	
	$(window).on('load', function() {
		$('.splash').css('display', 'none');
		
		/*xh.getFresh();*/
		/*$('body').attr('id', xh.getcookie("skin"));*/
		/*if(xh.getcookie("skin")!=null || xh.getcookie("skin")!=""){
			$('body').attr('id', xh.getcookie("skin"));
		}else{
			$('body').attr('id', "skin-blur-ocean");
			xh.setcookie("skin","skin-blur-ocean");
			 
		}*/
	})
	$("#wrapper-iframe").height($("body").height()-100);
	/* 首页全屏 */
	$("#full").on('click', function(event) {
		$(this).parent().toggleClass('fullscreen');
		if ($("#showMap").hasClass("full-screen")) {
			$("#showMap").removeClass("full-screen");
			$("#showMap").addClass("little-screen");
		} else {
			$("#showMap").removeClass("little-screen");
			$("#showMap").addClass("full-screen");
		}
	})
	/*alert close*/
	$("#alert-close").on('click',function(event){
		$(this).parent().fadeOut(100);
	})
	/* 表格全选 */
	$(".table-check").bind("click", function() {
		var checkVal = [];
		var flag = $(this).is(':checked') ? 1 : 0;
		if ($(this).is(':checked')) {
			$("[name='tb-check']").prop("checked", true);// 全选
			/*
			 * $("[name='tb-check']:checkbox").each(function(){
			 * if($(this).is(':checked')){ checkVal.push($(this).attr("value")); }
			 * });
			 */
		} else {
			$("[name='tb-check']").prop("checked", false);// 反选
		}
	});
	/* 表格行选择 */
	/*$("body").delegate(".xh-table>tbody>tr", "click", function() {
		$(this).addClass("tr-click");
		$(this).css({"background":"#bce774"});
		if ($(this).find("[name='tb-check']").is(':checked')) {
			$(this).find("[name='tb-check']").prop("checked",false);
		} else {
			$(this).find("[name='tb-check']").prop("checked",true);
		}
	});*/
	//xh.tableColor("tb-info","#f8fbfc","#e5f1f4","#ecfbd4","#bce774");

	setBodySmall();

	// Handle minimalize sidebar menu
	$('.hide-menu').on('click', function(event) {
		event.preventDefault();
		if ($(window).width() < 769) {
			$("body").toggleClass("show-sidebar");
		} else {
			$("body").toggleClass("hide-sidebar");
		}
	});
	// Initialize metsiMenu plugin to sidebar menu
	/* $('#side-menu').metisMenu(); */
	/* 返回到顶部 */
	$(window).scroll(function() {
		// 获取窗口的滚动条的垂直位置
		var s = $(window).scrollTop();
		// 当窗口的滚动条的垂直位置大于页面的最小高度时，让返回顶部元素渐现，否则渐隐
		if (s > 140) {
			$(".scroll-top").fadeIn(100);
		} else {
			$(".scroll-top").fadeOut(200);
		}
		;
	});
	$(".scroll-top").click(function() {
		$('html,body').animate({
			scrollTop : 0
		}, 300);
	});

	// MASKED INPUT
	// =================================================================
	// Require Masked Input
	// http://digitalbush.com/projects/masked-input-plugin/
	// =================================================================

	// Initialize Masked Inputs
	// a - Represents an alpha character (A-Z,a-z)
	// 9 - Represents a numeric character (0-9)
	// * - Represents an alphanumeric character (A-Z,a-z,0-9)
	/*
	 * $('#demo-msk-date').mask('99/99/9999');
	 * $('#demo-msk-date2').mask('99-99-9999'); $('#demo-msk-phone').mask('(999)
	 * 999-9999'); $('#demo-msk-phone-ext').mask('(999) 999-9999? x99999');
	 * $('#demo-msk-taxid').mask('99-9999999');
	 * $('#demo-msk-ssn').mask('999-99-9999');
	 * $('#demo-msk-pkey').mask('a*-999-a999');
	 * =]
	 */

	// Initialize animate panel function
	
	
	
	if ($("div").hasClass("animate-panel")){
		$('.animate-panel').animatePanel();
	}

	// Function for collapse hpanel
	$('.showhide').on('click', function(event) {
		event.preventDefault();
		var hpanel = $(this).closest('div.hpanel');
		var icon = $(this).find('i:first');
		var body = hpanel.find('div.panel-body');
		var footer = hpanel.find('div.panel-footer');
		body.slideToggle(200);
		footer.slideToggle(200);

		// Toggle icon from up to down
		icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
		hpanel.toggleClass('').toggleClass('panel-collapse');
		setTimeout(function() {
			hpanel.resize();
			hpanel.find('[id^=map-]').resize();
		}, 50);
	});
	
	$(".search-hide").on('click',function(event){
		event.preventDefault();
		var search=$("#search-panel");
		search.slideToggle(200);
	})

	// Function for close hpanel
	$('.closebox').on('click', function(event) {
		event.preventDefault();
		var hpanel = $(this).closest('div.hpanel');
		hpanel.remove();
		if ($('body').hasClass('fullscreen-panel-mode')) {
			$('body').removeClass('fullscreen-panel-mode');
		}
	});
	// Fullscreen for fullscreen hpanel
	$('.fullscreen').on('click', function() {
		var hpanel = $(this).closest('div.hpanel');
		var icon = $(this).find('i:first');
		$('body').toggleClass('fullscreen-panel-mode');
		icon.toggleClass('fa-expand').toggleClass('fa-compress');
		hpanel.toggleClass('fullscreen');
		setTimeout(function() {
			$(window).trigger('resize');
		}, 100);
	});
	// Function for small header
	$('.small-header-action').on('click', function(event) {
		event.preventDefault();
		var icon = $(this).find('i:first');
		var breadcrumb = $(this).parent().find('#hbreadcrumb');
		$(this).parent().parent().parent().toggleClass('small-header');
		$(this).parent().parent().parent().toggleClass('normalheader');
		breadcrumb.toggleClass('m-t-lg');
		icon.toggleClass('fa-arrow-up').toggleClass('fa-arrow-down');
	});
	// Set minimal height of #wrapper to fit the window
	setTimeout(function() {
		fixWrapperHeight();
	});
	// Handle minimalize sidebar menu
	/*
	 * $('.hide-menu').on('click', function(event){ event.preventDefault(); if
	 * ($(window).width() < 769) { $("body").toggleClass("show-sidebar"); } else {
	 * $("body").toggleClass("hide-sidebar");
	 *  } });
	 */
	// tooltip
	/*$("[data-toggle='tooltip']").tooltip();
	$("[data-toggle='popover']").popover();*/
});

function fixWrapperHeight() {

	// Get and set current height
	var headerH = 62;
	var navigationH = $("#navigation").height();
	var contentH = $(".content").height();

	// Set new height when contnet height is less then navigation
	if (contentH < navigationH) {
		$("#wrapper").css("min-height", navigationH + 'px');
	}

	// Set new height when contnet height is less then navigation and navigation
	// is less then window
	if (contentH < navigationH && navigationH < $(window).height()) {
		$("#wrapper").css("min-height", $(window).height() - headerH + 'px');
	}

	// Set new height when contnet is higher then navigation but less then
	// window
	if (contentH > navigationH && contentH < $(window).height()) {
		$("#wrapper").css("min-height", $(window).height() - headerH + 'px');
	}
}

// 隐藏左侧菜单

function setBodySmall() {
	if ($(this).width() < 769) {
		$('body').addClass('page-small');
	} else {
		$('body').removeClass('page-small');
		$('body').removeClass('show-sidebar');
	}
}
// Animate panel function
$.fn['animatePanel'] = function() {

	var element = $(this);
	var effect = $(this).data('effect');
	var delay = $(this).data('delay');
	var child = $(this).data('child');

	// Set default values for attrs
	if (!effect) {
		effect = 'zoomIn'
	}/* fadeInLeftBig ,fadeInUpBig */
	if (!delay) {
		delay = 0.06
	} else {
		delay = delay / 10
	}
	if (!child) {
		child = '.row > div'
	} else {
		child = "." + child
	}

	// Set defaul values for start animation and delay
	var startAnimation = 0;
	var start = Math.abs(delay) + startAnimation;

	// Get all visible element and set opacity to 0
	var panel = element.find(child);
	panel.addClass('opacity-0');

	// Get all elements and add effect class
	panel = element.find(child);
	panel.addClass('stagger').addClass('animated-panel').addClass(effect);

	var panelsCount = panel.length + 10;
	var animateTime = (panelsCount * delay * 10000) / 10;

	// Add delay for each child elements
	panel.each(function(i, elm) {
		start += delay;
		var rounded = Math.round(start * 10) / 10;
		$(elm).css('animation-delay', rounded + 's');
		// Remove opacity 0 after finish
		$(elm).removeClass('opacity-0');
	});

	// Clear animation after finish
	setTimeout(function() {
		$('.stagger').css('animation', '');
		$('.stagger').removeClass(effect).removeClass('animated-panel')
				.removeClass('stagger');
	}, animateTime)

};
//获取几天前的起始时间
xh.getBeforeDay = function(day) {
	var today = new Date();
	var yesterday_milliseconds = today.getTime()-day*1000*60*60*24;

	var yesterday = new Date();
	yesterday.setTime(yesterday_milliseconds);

	var strYear = yesterday.getFullYear();

	var strDay = yesterday.getDate();
	var strMonth = yesterday.getMonth() + 1;

	if (strMonth < 10) {
		strMonth = "0" + strMonth;
	}
	if (strDay < 10) {
		strDay = "0" + strDay;
	}
	var strYesterday = strYear + "-" + strMonth + "-" + strDay + " "
			+ "00:00:00";
	return strYesterday;
}
//获取几天前一天的起始时间
xh.getDay = function() {
	var today = new Date();
	var yesterday_milliseconds = today.getTime(); // -1000*60*60*24

	var yesterday = new Date();
	yesterday.setTime(yesterday_milliseconds);

	var strYear = yesterday.getFullYear();

	var strDay = yesterday.getDate();
	var strMonth = yesterday.getMonth() + 1;

	if (strMonth < 10) {
		strMonth = "0" + strMonth;
	}
	if (strDay < 10) {
		strDay = "0" + strDay;
	}
	var strYesterday = strYear + "-" + strMonth + "-" + strDay + " "
			+ "00:00:00";
	return strYesterday;
}
//获取当天结束时间；
xh.getOneDay = function() {
	var today = new Date();
	var yesterday_milliseconds = today.getTime(); // -1000*60*60*24

	var yesterday = new Date();
	yesterday.setTime(yesterday_milliseconds);

	var strYear = yesterday.getFullYear();

	var strDay = yesterday.getDate();
	var strMonth = yesterday.getMonth() + 1;

	if (strMonth < 10) {
		strMonth = "0" + strMonth;
	}
	if (strDay < 10) {
		strDay = "0" + strDay;
	}
	var strYesterday = strYear + "-" + strMonth + "-" + strDay + " "
			+ "23:59:59";
	return strYesterday;
}
xh.getNowDate = function() {
	var today = new Date();
	var yesterday_milliseconds = today.getTime(); // -1000*60*60*24

	var yesterday = new Date();
	yesterday.setTime(yesterday_milliseconds);

	var strYear = yesterday.getFullYear();

	var strDay = yesterday.getDate();
	var strMonth = yesterday.getMonth() + 1;

	if (strMonth < 10) {
		strMonth = "0" + strMonth;
	}
	if (strDay < 10) {
		strDay = "0" + strDay;
	}
	var strYesterday = strYear + "-" + strMonth + "-" + strDay;
	return strYesterday;
}
xh.getYMD= function(day) {
	var today = new Date();
	var yesterday_milliseconds = today.getTime()-1000*60*60*24*parseInt(day);

	var yesterday = new Date();
	yesterday.setTime(yesterday_milliseconds);

	var strYear = yesterday.getFullYear();

	var strDay = yesterday.getDate();
	var strMonth = yesterday.getMonth() + 1;

	if (strMonth < 10) {
		strMonth = "0" + strMonth;
	}
	if (strDay < 10) {
		strDay = "0" + strDay;
	}
	var strYesterday = strYear + "-" + strMonth + "-" + strDay;
	return strYesterday;
}
xh.getTime = function(value) {
	var ss=parseInt(value);
	var mm=0;
	var hh=0;
	if(ss>60){
		mm=parseInt(ss/60);
		ss=parseInt(ss%60);
		if(mm>60){
			hh=parseInt(mm/60);
			mm=parseInt(mm%60);
		}
	}
	if(ss<10){ss="0"+ss;}
	if(mm<10){mm="0"+mm;}
	if(hh<10){hh="0"+hh;}
	return hh+":"+mm+":"+ss;
}
xh.getNowMonth = function() {
	var today = new Date();
	var yesterday_milliseconds = today.getTime(); // -1000*60*60*24

	var yesterday = new Date();
	yesterday.setTime(yesterday_milliseconds);

	var strYear = yesterday.getFullYear();

	var strDay = yesterday.getDate();
	var strMonth = yesterday.getMonth() + 1;

	if (strMonth < 10) {
		strMonth = "0" + strMonth;
	}
	if (strDay < 10) {
		strDay = "0" + strDay;
	}
	var strYesterday = strYear + "-" + strMonth ;
	return strYesterday;
}
xh.getPreMonth = function() {
	var today = new Date();
	var yesterday_milliseconds = today.getTime(); // -1000*60*60*24

	var yesterday = new Date();
	yesterday.setTime(yesterday_milliseconds);

	var strYear = yesterday.getFullYear();

	var strDay = yesterday.getDate();
	var strMonth = yesterday.getMonth();

	if (strMonth < 10) {
		strMonth = "0" + strMonth;
	}
	if (strDay < 10) {
		strDay = "0" + strDay;
	}
	var strYesterday = strYear + "-" + strMonth ;
	return strYesterday;
}
/* 显示网页遮罩层 */
xh.maskShow = function() {
	var html = "<div class='xh-mask text-white'><div class='color-line'></div>";
	html += "<i class='fa fa-spinner fa-spin fa-2x text-success'></i>";
	html += "<i class=''>数据处理中...</i>";
	html += "</div>";
	$("body").append(html);
}
xh.delayShow = function() {
	var html = "<div class='xh-mask text-white'><div class='color-line'></div>";
	html += "<i class='fa fa-spinner fa-spin fa-2x text-success'></i>";
	html += "<i class='delayText'></i>";
	html += "</div>";
	$("body").append(html);
}
xh.maskShow = function(message) {
	var msg="数据处理中...";
	if(message==null){
		message=msg;
	}else{
		/*html = "<div class='xh-mask text-white'><div class='color-line'></div>";
		html += "<i class='fa fa-spinner fa-spin fa-2x text-success'></i>";
		html += "<i class=''>"+message+"</i>";
		html += "</div>";*/
	}
	var html = "<div class='xh-mask text-white'><div class='color-line'></div>";
	html += "<i class='fa fa-spinner fa-spin fa-2x text-success'></i>";
	html += "<i class=''>"+message+"</i>";
	html += "</div>";
	
	$("body").append(html);
}
/* 关闭网页遮罩层 */
xh.maskHide = function() {
	$(".xh-mask").fadeOut(300);
}
xh.userPower=function(){
	$.ajax({
		url : '../../web/loginUserPower',
		type : 'post',
		dataType : "json",
		data : {},
		async : true,
		success : function(data) {
			powerData=data;
			
		},
		error : function() {
			
		}
	});
}
var result=false;
xh.isfile=function(filePath){
	
	$.ajax({
		url : '../../uploadFile/fileExists',
		type : 'post',
		dataType : "json",
		data : {filePath:filePath},
		async : false,
		success : function(data) {			
				
			result=data.success;
	
		},
		error : function() {
		}
	});
	return result;
}

/* 获取cookie */
xh.getcookie = function(name) {
	var strcookie = document.cookie;
	var arrcookie = strcookie.split(";");
	for (var i = 0; i < arrcookie.length; i++) {
		var arr = arrcookie[i].split("=");
		if (arr[0].match(name) == name)
			return arr[1];
	}
	return "";
};
/* 设置cookie */
xh.setcookie = function(name,value) {
	//获取当前时间
	var date=new Date();
	var expiresDays=10;
	//将date设置为10天以后的时间
	date.setTime(date.getTime()+expiresDays*24*3600*1000);
	//将userId和userName两个cookie设置为10天后过期
	document.cookie=name+"="+value+"; expires="+date.toGMTString()+";path=/";
};
/*utf-8编码*/
xh.encodeUTF8 = function(str) {
	return encodeURIComponent(str);
}
/*utf-8解码*/
xh.decodeUTF8 = function(str) {
	return decodeURIComponent(str);
}
/*序列化form数据到json字符串*/
xh.serializeJson=function(array){
    var serializeObj={};
    $(array).each(function(){
        if(serializeObj[this.name]){
            if($.isArray(serializeObj[this.name])){
                serializeObj[this.name].push(this.value);
            }else{
                serializeObj[this.name]=[serializeObj[this.name],this.value];
            }
        }else{
            serializeObj[this.name]=this.value;
        }
    });
    return JSON.stringify(serializeObj);
};
/*表格颜色变化*/
xh.tableColor=function(o,a,b,c,d){
	 var t=document.getElementById(o).getElementsByTagName("tr");
	 for(var i=0;i<t.length;i++){
		 
	  t[i].style.backgroundColor=(t[i].sectionRowIndex%2==0)?a:b;
	  t[i].onclick=function(){
	   if(this.x!="1"){
	    this.x="1";
	    this.style.backgroundColor=d;
	   }else{
	    this.x="0";
	    this.style.backgroundColor=(this.sectionRowIndex%2==0)?a:b;
	   }
	  }
	  t[i].onmouseover=function(){
	   if(this.x!="1")this.style.backgroundColor=c;
	  }
	  t[i].onmouseout=function(){
	   if(this.x!="1")this.style.backgroundColor=(this.sectionRowIndex%2==0)?a:b;
	  }
	 }
	}
/*xh.initCertList=function(){
	if (TopESAConfig()){
		var certs = CertStore.listAllCerts().forSign() ; //过滤签名证书
	    var certs = CertStore.listAllCerts().byKeyUsage(128); //过滤签名证书
	    var certs_Validity = CertStore.listAllCerts().byKeyUsage(128).byValidity(); //过滤有效期内的签名证书
	    //alert(certs.size());
	     if (certs.size() > 0) {
	     } else {
	         alert("key已经拔出，请重新登录")
	        // window.location.href="../web/loginOut";
	     }
	}
 
	
} */
xh.getFresh=function(){
	if (TopESAConfig()){
		var certs = CertStore.listAllCerts().forSign() ; //过滤签名证书
	    var certs = CertStore.listAllCerts().byKeyUsage(128); //过滤签名证书
	    var certs_Validity = CertStore.listAllCerts().byKeyUsage(128).byValidity(); //过滤有效期内的签名证书
	    //alert(certs.size());
	     if (certs.size() > 0) {
	     } else {
	    	 $.ajax({
	    			url : xh.rootPath()+'web/loginUserInfo',
	    			type : 'GET',
	    			dataType : "json",
	    			async : false,
	    			success : function(data) {
	    				var user=data.user;
	    				
	    				if(user.indexOf("test")>-1 || user.indexOf("admin")>-1){
	    					
	    				}else{
	    					alert("key已经拔出，请重新登录");
	    			         var path=xh.rootPath();
	    			         window.location.href=path+"web/loginOut";
	    				}
	    				
	    				/*if(user!="admin"){
	    					alert("key已经拔出，请重新登录");
	    			         var path=xh.rootPath();
	    			         window.location.href=path+"web/loginOut";
	    				}*/
	    			},
	    			error : function() {
	    			}
	    		});
	         
	     }
	}
 }
xh.rootPath=function(){
	 var scripts = document.getElementsByTagName('script'),
   
    path, i, ln, scriptSrc, match;

for (i = 0, ln = scripts.length; i < ln; i++) {
    scriptSrc = scripts[i].src;

    match = scriptSrc.match(/xh\.js$/);

    if (match) {
        path = scriptSrc.substring(0, scriptSrc.length - match[0].length-13);
        break;
    }
}
return path;
}
xh.dateFormat=function(timem){
	   var date=new Date(timem);
	   var h=date.getFullYear();
	   var m=date.getMonth()+1;
	   var d=date.getDate();
		m= m<10?"0"+m:m;   //  这里判断月份是否<10,如果是在月份前面加'0'
		d= d<10?"0"+d:d;        //  这里判断日期是否<10,如果是在日期前面加'0'
		return h+"-"+m+"-"+d;
	}

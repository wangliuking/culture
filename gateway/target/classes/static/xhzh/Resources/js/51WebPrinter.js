
var oscript = document.createElement("script");
oscript.src = "http://localhost:59418/WebPrinter.js";
var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
head.insertBefore( oscript,head.firstChild );

function getWebPrinter(){
	var strCLodopInstall="<br><font color='#FF00FF'>WebPrinter云打印服务(localhost本地)未安装启动!点击这里<a href='xx.exe' target='_self'>执行安装</a>,安装后请刷新页面。</font>";
    var PRINTER;
    try{
        var isIE = (navigator.userAgent.indexOf('MSIE')>=0) || (navigator.userAgent.indexOf('Trident')>=0);
        try { PRINTER = getCPrinter(); } catch (err) { };
        if (!PRINTER && document.readyState!=="complete") {alert("云打印服务没准备好，请稍后再试！"); return;};
        if (!PRINTER) {
			/*if (isIE) document.write(strCLodopInstall); else
			document.documentElement.innerHTML=strCLodopInstall+document.documentElement.innerHTML;
			alert("123")*/
        	/*swal({
				title : "提示",
				text : "只能选择一条数据",
				type : "error"
			});*/
        	/*swal("Here's a message!")*/
        	swal({
        		  title: "插件安装",
        		  text: "你还没有安装打印插件，是否需要安装？",
        		  
        		  showCancelButton : true,
  				confirmButtonColor : "#DD6B55",
  				confirmButtonText : "安装插件",
  				cancelButtonText : "取消"
        		  
        		  /*showCancelButton: true,
        		  confirmButtonColor: "#DD6B55",
        		  confirmButtonText: "是",
        		  cancelButtonText: "否",
        		  closeOnConfirm: false,
        		  closeOnCancel: false*/
        		},
        		function(isConfirm){
        		  if (isConfirm) {
        			  var filename="EasyWebPrinter.exe";
        			  var filepath = "/Resources/" + filename;
        				var downUrl = "../../uploadFile/download?fileName=" + filename + "&filePath=" + filepath;
        				window.open(downUrl, '_self','width=1,height=1,toolbar=no,menubar=no,location=no');
        		  } else {
        		    /*swal("Cancelled", "Your imaginary file is safe :)", "error");*/
        		  }
        		});
			return;
        }
        return PRINTER;
    } catch(err) {alert("获取云打印服务出错:"+err);};
};

function getLodop(oOBJECT, oEMBED) {
	/***************************************************************************
	 * 本函数根据浏览器类型决定采用哪个对象作为控件实例： IE系列、IE内核系列的浏览器采用oOBJECT，
	 * 其它浏览器(Firefox系列、Chrome系列、Opera系列、Safari系列等)采用oEMBED,
	 * 对于64位浏览器指向64位的安装程序install_lodop64.exe。
	 **************************************************************************/
	var strHtmInstall = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop32.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
	var strHtmUpdate = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
	var strHtm64_Install = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
	var strHtm64_Update = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
	var strHtmFireFox = "<br><br><font color='#FF00FF'>注意：<br>1：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它。</font>";
	var LODOP = oEMBED;
	try {
		if (navigator.appVersion.indexOf("MSIE") >= 0)
			LODOP = oOBJECT;
		if ((LODOP == null) || (typeof (LODOP.VERSION) == "undefined")) {
			if (navigator.userAgent.indexOf('Firefox') >= 0)
				/*document.documentElement.innerHTML = strHtmFireFox
						+ document.documentElement.innerHTML;*/
				sweet();
				
			if (navigator.userAgent.indexOf('Win64') >= 0) {
				if (navigator.appVersion.indexOf("MSIE") >= 0)
					/*document.write(strHtm64_Install);*/
				sweet();
				else
					/*document.documentElement.innerHTML = strHtm64_Install
							+ document.documentElement.innerHTML;*/
				sweet();
			} else {
				if (navigator.appVersion.indexOf("MSIE") >= 0)
					/*document.write(strHtmInstall);*/
					sweet();
				else
					/*document.documentElement.innerHTML = strHtmInstall
							+ document.documentElement.innerHTML;*/
					sweet();
			}
			return LODOP;
		} else if (LODOP.VERSION < "6.1.5.8") {
			if (navigator.userAgent.indexOf('Win64') >= 0) {
				if (navigator.appVersion.indexOf("MSIE") >= 0)
					/*document.write(strHtm64_Update);*/
					sweet();
				else
					/*document.documentElement.innerHTML = strHtm64_Update
							+ document.documentElement.innerHTML;*/
					sweet();
			} else {
				if (navigator.appVersion.indexOf("MSIE") >= 0)
					/*document.write(strHtmUpdate);*/
					sweet();
				else
					/*document.documentElement.innerHTML = strHtmUpdate
							+ document.documentElement.innerHTML;*/
					sweet();
			}
			return LODOP;
		}
		// =====如下空白位置适合调用统一功能:=====

		// =======================================
		return LODOP;
	} catch (err) {
		if (navigator.userAgent.indexOf('Win64') >= 0)
			document.documentElement.innerHTML = "Error:" + strHtm64_Install
					+ document.documentElement.innerHTML;
		else
			document.documentElement.innerHTML = "Error:" + strHtmInstall
					+ document.documentElement.innerHTML;
		return LODOP;
	}
}
function sweet(){
	swal({
		  title: "插件安装",
		  text: "你还没有安装打印插件，安装后请刷新页面或重新进入",
		  
		  showCancelButton : true,
		confirmButtonColor : "#DD6B55",
		confirmButtonText : "安装插件",
		cancelButtonText : "取消"
		},
		function(isConfirm){
		  if (isConfirm) {
			  var filename="EasyWebPrinter.exe";
			  var filepath = "/Resources/" + filename;
				var downUrl = "../../uploadFile/download?fileName=" + filename + "&filePath=" + filepath;
				window.open(downUrl, '_self','width=1,height=1,toolbar=no,menubar=no,location=no');
		  } else {
		  }
		});
}

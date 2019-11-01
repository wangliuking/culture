if (!("xh" in window)) {
	window.xh = {};
};
var aesstr="2f6DhqPBNoK3f2A7";
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
	"timeOut" : "3000",
	"extendedTimeOut" : "2000",
	"showMethod" : "fadeIn",
	"hideMethod" : "fadeOut",
	"progressBar" : true,
};
/*清空会话标识*/
xh.clearSession = function() {
	$.ajax({
		url : '../web/clearSession',
		type : 'get',
		dataType : "json",
		data : {
		},
		async : false,
		success : function(data) {
			
		},
		error : function() {

		}
	});
}
/* 登录系统 */
xh.login = function() {
	  $("button[type='button']").button('loading')
	$.ajax({
		url : '../web/login',
		type : 'POST',
		dataType : "json",
		data : {
			username : $("#loginForm").find("input[name='username']").val(),
			/*password : xh.encrypt($("#loginForm").find("input[name='password']").val()),*/
			password : $("#loginForm").find("input[name='password']").val(),
			//code:$("#loginForm").find("input[name='code']").val(),
			ToSign : $("#loginForm").find("input[name='ToSign']").val(),
			Signature : $("#loginForm").find("input[name='Signature']").val()
		},
		/* data : $("#loginForm").serializeArray(), */
		async : false,
		success : function(data) {
			  $("button[type='button']").button('reset')
			if (data.success) {
				var url=data.url;
				window.location.href = url;
			} else {
				toastr.error(data.message, '提示');
				xh.changeUrl();
			}
		},
		error : function() {
			toastr.error("登录超时", '提示');
			xh.changeUrl();
		   $("button[type='button']").button('reset')

		}
	});
}
xh.MathRand=function() {
	var num = "";
	for (var i = 0; i < 13; i++) {
		num += Math.floor(Math.random() * 10);
	}
	$("input[name='ToSign']").val(num)
	return num;
}

// 模块初始化
/* 加密 */
xh.encrypt = function(data) {
	var key = CryptoJS.enc.Utf8.parse(aesstr);// Latin1
												// w8m31+Yy/Nw6thPsMpO5fg==
	var srcs = CryptoJS.enc.Utf8.parse(data);
	var encrypted = CryptoJS.AES.encrypt(srcs, key, {
		mode : CryptoJS.mode.ECB,
		padding : CryptoJS.pad.Pkcs7
	});
	return encrypted.toString();
}

/*
 * AES解密 param : message 密文 return : decrypted string 明文
 */
xh.decrypt = function(message) {
	decrypted = '';
	decrypted = CryptoJS.AES.decrypt(message, key, {
		iv : iv,
		mode : CryptoJS.mode.CBC,
		padding : CryptoJS.pad.ZeroPadding
	});
	return decrypted.toString(CryptoJS.enc.Utf8);
}

xh.changeUrl=function() {
	var url = $("#codevalidate").prop('src');
	url = url.substr(0, url.lastIndexOf('/') + 1);
	url = url + Math.random().toFixed(4);
	$("#codevalidate").prop('src', url);
}
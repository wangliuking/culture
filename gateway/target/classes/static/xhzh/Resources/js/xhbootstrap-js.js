/**
 * 系统启动js文件
 */
(function(){
	var path=rootPath();
	document.write('<script type="text/javascript" src="'+path+'Resources/js/jquery-2.1.4.min.js"></script>');
	document.write('<script type="text/javascript" src="'+path+'Resources/js/paging.js"></script>');
	document.write('<script type="text/javascript" src="'+path+'lib/bootstrap-3.3.6/js/bootstrap.min.js"></script>');
	document.write('<script type="text/javascript" src="'+path+'Resources/js/angular.min.js"></script>');
	document.write('<script type="text/javascript" src="'+path+'Resources/js/angular-ui-router.js"></script>');
	document.write('<script type="text/javascript" src="'+path+'Resources/js/xh.js"></script>');
	document.write('<script type="text/javascript" src="'+path+'Resources/js/bootstrapValidator.min.js"></script>');
	document.write('<script type="text/javascript" src="'+path+'lib/sweetalert/lib/sweet-alert.js"></script>');
	document.write('<script type="text/javascript" src="'+path+'lib/toastr/build/toastr.min.js"></script>');
	document.write('<script type="text/javascript" src="'+path+'lib/My97DatePicker/WdatePicker.js"></script>');
	

})()
function rootPath(){
	 var scripts = document.getElementsByTagName('script'),
    
     path, i, ln, scriptSrc, match;

 for (i = 0, ln = scripts.length; i < ln; i++) {
     scriptSrc = scripts[i].src;

     match = scriptSrc.match(/xhbootstrap-js\.js$/);

     if (match) {
         path = scriptSrc.substring(0, scriptSrc.length - match[0].length-13);
         break;
     }
 }
 return path;
}

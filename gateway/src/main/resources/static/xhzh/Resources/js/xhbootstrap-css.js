
(function(){
	var path=rootPath();
    document.write('<link rel="stylesheet" type="text/css" href="'+path+'lib/bootstrap-3.3.6/css/bootstrap.min.css">');
    document.write('<link rel="stylesheet" type="text/css" href="'+path+'Resources/css/xh.min.css">');
    document.write('<link rel="stylesheet" type="text/css" href="'+path+'lib/sweetalert/lib/sweet-alert.css">');
    document.write('<link rel="stylesheet" type="text/css" href="'+path+'lib/toastr/build/toastr.min.css">');
    document.write('<link rel="stylesheet" type="text/css" href="'+path+'Resources/css/magic-check.min.css">');
    /*document.write('<link rel="stylesheet" type="text/css" href="'+path+'lib/metisMenu/dist/metisMenu.css">');*/
})()
function rootPath(){
	 var scripts = document.getElementsByTagName('script'),
     path, i, ln, scriptSrc, match;

 for (i = 0, ln = scripts.length; i < ln; i++) {
     scriptSrc = scripts[i].src;

     match = scriptSrc.match(/xhbootstrap-css\.js$/);

     if (match) {
         path = scriptSrc.substring(0, scriptSrc.length - match[0].length-13);
         break;
     }
 }
 return path;
}

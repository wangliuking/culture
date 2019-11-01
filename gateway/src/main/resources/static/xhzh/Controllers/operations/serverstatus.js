/**
 * 终端状态
 */
if (!("xh" in window)) {
	window.xh = {};
};
var background="#fff";
var frist = 0;
var wheight=document.documentElement.clientHeight;
var wwidth=document.documentElement.clientWidth;
if(wwidth<1200){
	wwidth=1366;
}


var appElement = document.querySelector('[ng-controller=xhcontroller]');
//画布
var canvas = document.getElementById('server-canvas');
canvas.width = document.documentElement.clientWidth-42;
canvas.height = document.documentElement.clientHeight-60;
var stage = new JTopo.Stage(canvas);
var scene = new JTopo.Scene();
stage.add(scene);
/*scene.background = '../../Resources/images/img/bg.jpg';80,100,80*/
scene.alpha=1;
scene.backgroundColor='53,63,79';
/*stage.eagleEye.visible = true;*/
stage.wheelZoom = 0.55;

$(window).resize(function(){
	canvas.width = document.documentElement.clientWidth-22;
	canvas.height = document.documentElement.clientHeight-38;
})


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
xh.load = function() {
	var app = angular.module("app", []);
	app.controller("xhcontroller", function($scope, $http) {
		xh.maskShow();
		$scope.accessCurrentNode = null;
		$http.get("../../status/dispatch").
		success(function(response){
			xh.maskHide();
			$scope.dispatch = response.items;
			$scope.dTotals = response.totals;
		});
		 
		 $scope.emh = function() {
 			$http.get("../../bsstatus/bsEmh?siteId=200&period=3").success(function(response) {
 				$scope.emhData = response;
 				
 				
 				
 			});
		 }
		 $scope.status = function() {
	 			$http.get("../../bsstatus/linkStatus").success(function(response) {
	 				$scope.s= response.data;
	 				
	 				$scope.serverCanvas();
	 			});
		 }
            $scope.serverCanvas=function(){
    			scene.clear();
         		var point1 =xh.createNewNode(wwidth/2-20,0,3,3,"");
    			var point2 =xh.createNewNode(wwidth/2-20,wheight-70,3,3,"");
    			var dlink1 = xh.createNewLink(point1, point2,5);
    			dlink1.strokeColor = '169,169,169';
    			dlink1.dashedPattern =15; // 虚线
    			//交换中心1
    			
    			//汇聚交换机s5700

    			var s57_point_one_1 =xh.createNode(100, wheight/10+50,"switch-blue.png","ZY-S5700-1");
    			var s57_point_one_2 =xh.createNode(170, wheight/10+50,"switch-blue.png","ZY-S5700-2");
    			var s57_point_one_3 =xh.createNode(240, wheight/10+50,"switch-blue.png","ZY-S5700-3");
    			var s57_point_one_4 =xh.createNode(310, wheight/10+50,"switch-blue.png","ZY-S5700-4");
    			
    			var s57_point_one_5 =xh.createNode(380, wheight/10+50,"switch-blue.png","ZY-S5700-5");
    			var s57_point_one_6 =xh.createNode(450, wheight/10+50,"switch-blue.png","ZY-S5700-6");
    			var s57_point_one_7 =xh.createNode(520, wheight/10+50,"switch-blue.png","ZY-S5700-7");
    			var s57_point_one_8 =xh.createNode(590, wheight/10+50,"switch-blue.png","ZY-S5700-8");
    			
    			//NE16
    			var ne16_point_one_1 =xh.createNode(300, wheight/10+200,"sw1.png","ZY_NE16-1");
    			
    			var ne16_point_one_2 =xh.createNode(300, wheight/10+300,"sw1.png","ZY_NE16-2");
    			var ne16_point_one_3 =xh.createNode(400, wheight/10+200,"sw1.png","ZY_NE16-3");
    			var ne16_point_one_4 =xh.createNode(400, wheight/10+300,"sw1.png","ZY_NE16-4");
    		
    			//思科C3560
    			var c3560_point_one_1 =xh.createNode(200, wheight/10+200,"switch3.png","C3560");
    			var c3560_point_one_2 =xh.createNode(200, wheight/10+300,"switch3.png","C3560");
    			
    			var c3560_point_one_3 =xh.createNewNode(150, wheight/10+215,2,2,"");
    			var c3560_point_one_4 =xh.createNewNode(150, wheight/10+315,2,2,"");
    			//思科C3560-连线
    			var link5 = xh.createNewLink(c3560_point_one_1, ne16_point_one_1,5);
                 link5.strokeColor = '220,220,220';
                 var link6 = xh.createNewLink(c3560_point_one_2, ne16_point_one_2,5);
                 link6.strokeColor = '220,220,220';
                 var link7 = xh.createNewLink(c3560_point_one_1, c3560_point_one_2,5);
                 link7.strokeColor = '220,220,220';
                 var link8 = xh.createNewLink(c3560_point_one_1, c3560_point_one_3,5);
                 link8.strokeColor = '220,220,220';
                 var link9 = xh.createNewLink(c3560_point_one_2, c3560_point_one_4,5);
                 link9.strokeColor = '220,220,220';
    			
    			
    			//核心交换机
    			
    			var s7703_point_one =xh.createNode(400, wheight/10+360,"server7.png","S7703");
                var S3700_point_one=xh.createNode(480, wheight/10+380,"sw1.png","S3700");
                 //中和应用平台
                 var server_point_one=xh.createNode(550, wheight/10+380,"server4.png","综合应用与平台");
                 //中和应用平台-连线
                 var link15 = xh.createNewLink(server_point_one,S3700_point_one,5);
                 link15.strokeColor = '0,255,0';
                 
                 //公网路由器
                 var ar3260_point_one=xh.createNode(330, wheight/10+380,"sw1.png","公网路由器[AR3260]");
                 
                 var link20 = xh.createNewLink(ar3260_point_one,s7703_point_one,5);
                 link20.strokeColor = '0,255,0';
                 
                 
                 
     			//NE16-连线
     			xh.createNewLink(s7703_point_one, ne16_point_one_1,"[1]",$scope.s.s_1);
                xh.createNewLink(ne16_point_one_1, s57_point_one_2,"[2]",$scope.s.s_2);
                xh.createNewLink(ne16_point_one_1, ne16_point_one_2,"[3]",$scope.s.s_3);
                xh.createNewLink(ne16_point_one_1, s57_point_one_1,"[4]",$scope.s.s_4);
                xh.createNewLink(ne16_point_one_1, ne16_point_one_3,"[5]",$scope.s.s_5);
                xh.createNewLink(ne16_point_one_1, ne16_point_one_4,"[6]",$scope.s.s_6);
                xh.createNewLink(ne16_point_one_2, s57_point_one_3,"[7]",$scope.s.s_7);
                xh.createNewLink(ne16_point_one_2, s57_point_one_4,"[8]",$scope.s.s_8);
                xh.createNewLink(ne16_point_one_2, ne16_point_one_3,"[9]",$scope.s.s_9);
                xh.createNewLink(ne16_point_one_2, ne16_point_one_4,"[10]",$scope.s.s_10);
                xh.createNewLink(ne16_point_one_3, s57_point_one_6,"[11]",$scope.s.s_11);
                xh.createNewLink(ne16_point_one_3, s57_point_one_5,"[12]",$scope.s.s_12);
                xh.createNewLink(ne16_point_one_3, ne16_point_one_4,"[13]",$scope.s.s_13);
                xh.createNewLink(ne16_point_one_4, S3700_point_one,"[14]",$scope.s.s_14);
                xh.createNewLink(ne16_point_one_4, s57_point_one_8,"[15]",$scope.s.s_15);
                xh.createNewLink(ne16_point_one_4, s57_point_one_7,"[16]",$scope.s.s_16);
     			//交换中心2
     			
     			//汇聚交换机s5700

     			var s57_point_two_1 =xh.createNode(wwidth/2, wheight/10+50,"switch-blue.png","RZ-S5700-1");
     			var s57_point_two_2 =xh.createNode(wwidth/2+70, wheight/10+50,"switch-blue.png","RZ-S5700-2");
     			var s57_point_two_3 =xh.createNode(wwidth/2+140, wheight/10+50,"switch-blue.png","RZ-S5700-3");
     			var s57_point_two_4 =xh.createNode(wwidth/2+210, wheight/10+50,"switch-blue.png","RZ-S5700-4");
     			
     			var s57_point_two_5 =xh.createNode(wwidth/2+280, wheight/10+50,"switch-blue.png","RZ-S5700-5");
     			var s57_point_two_6 =xh.createNode(wwidth/2+350, wheight/10+50,"switch-blue.png","RZ-S5700-6");
     			var s57_point_two_7 =xh.createNode(wwidth/2+420, wheight/10+50,"switch-blue.png","RZ-S5700-7");
     			var s57_point_two_8 =xh.createNode(wwidth/2+490, wheight/10+50,"switch-blue.png","RZ-S5700-8");
     			
     			//NE16
     			
     			var ne16_point_two_1 =xh.createNode(wwidth/2+200, wheight/10+200,"sw1.png","RZ_NE16-1");
     			
     			
     			var ne16_point_two_2 =xh.createNode(wwidth/2+200, wheight/10+300,"sw1.png","RZ_NE16-2");
     			var ne16_point_two_3 =xh.createNode(wwidth/2+100, wheight/10+200,"sw1.png","RZ_NE16-3");
     			var ne16_point_two_4 =xh.createNode(wwidth/2+100, wheight/10+300,"sw1.png","RZ_NE16-4");
     			
                 
               //思科C3560
     			var c3560_point_two_1 =xh.createNode(wwidth/2+300, wheight/10+200,"switch3.png","C3560");
     			var c3560_point_two_2 =xh.createNode(wwidth/2+300, wheight/10+300,"switch3.png","C3560");
     			
     			var c3560_point_two_3 =xh.createNewNode(wwidth/2+400, wheight/10+215,2,2,"");
     			var c3560_point_two_4 =xh.createNewNode(wwidth/2+400, wheight/10+315,2,2,"");
     			//思科C3560-连线
     			 var link109 = xh.createNewLink(c3560_point_two_1, ne16_point_two_1,5);
                  link109.strokeColor = '220,220,220';
                  var link110 = xh.createNewLink(c3560_point_two_2, ne16_point_two_2,5);
                  link110.strokeColor = '220,220,220';
                  var link111 = xh.createNewLink(c3560_point_two_1, c3560_point_two_2,5);
                  link111.strokeColor = '220,220,220';
                  var link112 = xh.createNewLink(c3560_point_two_1, c3560_point_two_3,5);
                  link112.strokeColor = '220,220,220';
                  var link113 = xh.createNewLink(c3560_point_two_2, c3560_point_two_4,5);
                  link113.strokeColor = '220,220,220';
                
                //核心交换机
      			
      			var s7703_point_two =xh.createNode(wwidth/2+100, wheight/10+360,"server7.png","S7703");
      			//核心交换机-连线
      		
                 
                  /* var link116 = xh.createNewLink(ne16_point_one_2,ne16_point_two_1,5);
                   link116.strokeColor = '0,255,0';
                   var link117 = xh.createNewLink(ne16_point_one_4,ne16_point_two_3,5);
                   link117.strokeColor = '0,255,0';*/
                   
                   
             
                   
                   //3700
                   var S3700_point_two=xh.createNode(wwidth/2, wheight/10+350,"sw1.png","S3700");
                   
                   var link123 = xh.createNewLink(S3700_point_two,s7703_point_two,5);
                   link123.strokeColor = '0,255,0';
                   
                   //中和应用平台
                   var server_point_two=xh.createNode(wwidth/2+30, wheight/10+400,"server4.png","综合应用与平台");
                   //中和应用平台-连线
                   var link115 = xh.createNewLink(server_point_two,S3700_point_two,5);
                   link115.strokeColor = '0,255,0';
                 
                   //公网路由器
                   var ar3260_point_two=xh.createNode(wwidth/2+200, wheight/10+380,"sw1.png","公网路由器[AR3260]");
                   
                   var link122 = xh.createNewLink(ar3260_point_two,s7703_point_two,5);
                   link122.strokeColor = '0,255,0';
                   var link122 = xh.createNewLink(ne16_point_two_4,s7703_point_two,5);
                   link122.strokeColor = '0,255,0';
                   
                   
                   
                 //NE16-连线
       			 
                   xh.createNewLink(ne16_point_two_1, s57_point_two_1,"[101]",$scope.s.s_101);
                   xh.createNewLink(ne16_point_two_1, s57_point_two_2,"[102]",$scope.s.s_102);
                   xh.createNewLink(ne16_point_two_1, ne16_point_two_2,"[103]",$scope.s.s_103);
                   xh.createNewLink(ne16_point_two_1, ne16_point_two_3,"[104]",$scope.s.s_104);
                   xh.createNewLink(ne16_point_two_1, ne16_point_two_4,"[105]",$scope.s.s_105);
                   xh.createNewLink(ne16_point_two_2, s57_point_two_3,"[106]",$scope.s.s_106);
                   xh.createNewLink(ne16_point_two_2, s57_point_two_4,"[107]",$scope.s.s_107);
                   xh.createNewLink(ne16_point_two_2, ne16_point_two_3,"[108]",$scope.s.s_108);
                   xh.createNewLink(ne16_point_two_2, ne16_point_two_4,"[109]",$scope.s.s_109);
                   xh.createNewLink(ne16_point_two_3, s57_point_two_5,"[110]",$scope.s.s_110);
                   xh.createNewLink(ne16_point_two_3, ne16_point_two_4,"[111]",$scope.s.s_111);
                   xh.createNewLink(ne16_point_two_3, ne16_point_one_3,"[112]",$scope.s.s_112);
                   xh.createNewLink(ne16_point_two_3, s57_point_two_6,"[113]",$scope.s.s_113);
                   xh.createNewLink(ne16_point_two_4, s57_point_two_7,"[114]",$scope.s.s_114);
                   xh.createNewLink(ne16_point_two_4, s57_point_two_8,"[115]",$scope.s.s_115);
                   xh.createNewLink(ne16_point_two_4, ne16_point_one_4,"[116]",$scope.s.s_116);
                   
                 
               //服务器
                 $http.get("../../server/list").success(function(response){
         			xh.maskHide();
         			var data = response.items;
         			var totals = response.totals;
         			var left1=50,left2=wwidth/2+500,top1=wheight/3,top2=wheight/3;
         			for(var j=0; j<totals; j++){
         				var vmNode="";
         				var link="";
         				if(data[j].ID==1){
         					 vmNode=xh.createNode(left1,top1,"server4.png",data[j].name);
         					 link=xh.createNewFoldLink(vmNode,c3560_point_one_3,"",1);
         					 
         					 top1+=50;
         				}else{
         					 vmNode=xh.createNode(left2,top2,"server4.png",data[j].name);
        					 link=xh.createNewFoldLink(vmNode,c3560_point_two_3,"",1)
        					 top2+=50;
         				}
         				vmNode.index=j;
         				if(data[j].status!=0){
                  			 vmNode.alarm = '告警';
                  			 link.strokeColor = '255,0,0';
                  			
                  	      }else{
                  	    	  if(data[j].cpuLoad>=95 || data[j].diskResidue<10 ){
                  	    		vmNode.alarm = '警告！';
                  	    		link.strokeColor = '255,0,0';
                  	    	  }else{
                  	    		link.strokeColor = '0,255,0';
                  	    	  }
                  	    	 
                  	     }
         				 vmNode.addEventListener('mouseover', function(event){
   	                	  var d=data[this.index];
   	                	  var html="<table>";
   	                	  html+="<tr><td>服务器名称</td><td>"+d.name+"</td></tr>";
   	                	  if(d.cpuLoad>=95){
   	                		  html+="<tr style='color:#fff;background:red;'><td>CPU使用率</td><td>"+d.cpuLoad+"%</td></tr>";
   	                	  }else{
   	                		  html+="<tr><td>CPU使用率</td><td>"+d.cpuLoad+"%</td></tr>";
   	                	  }
   	                	  
   	                	  html+="<tr><td>内存大小</td><td>"+d.memSize+"G</td></tr>";
   	                	  html+="<tr><td>剩余内存</td><td>"+d.memResidue+"G</td></tr>";
   	                	  html+="<tr><td>磁盘空间</td><td>"+d.diskSize+"G</td></tr>";
   	                	  if(d.diskResidue<10 ){
   	                		  html+="<tr style='color:#fff;background:red;'><td>剩余空间</td><td>"+d.diskResidue+"G</td></tr>";
   	               	      }else{
   	               	    	 html+="<tr><td>剩余空间</td><td>"+d.diskResidue+"G</td></tr>";
   	               	      }
   	                	  html+="<tr><td>更新时间</td><td>"+d.time+"</td></tr>";
   	                	 
   	                	  html+="<table>";
   	                	 
   	                	  $(".server-info1").html(html);
   	                	  
   	                	  var top=event.pageY,left=event.pageX+20;
   	                	  var clientW=document.documentElement.clientWidth;
   	                	  var clientH=document.documentElement.clientHeight;
   	                	  if(clientW-left<200){
   	                		  left-=250;
   	                	  }
   	                	  if(clientH-top<250){
   	                		  top-=160;
   	                	  }
   	                	  
   	                	  $(".server-info1").css({
   	                	        top: top,
   	                	        left: left
   	                	    }).show();
   	                  });
                        
   	                  vmNode.addEventListener('mouseout', function(event){
   	                	  $(".server-info1").hide();
   	                  });
         			}
         		 })
    			
    			
    			
    			
    			
    			
    			//交换中心1
    			//结点
    			/*var emh1 =xh.createNode(400, wheight/10,"emh.png","动环设备");*/
    			
    			
    			
    			/*var sw1 =xh.createNode(300, wheight/10+200,"switch.png","交换机");
    			var sw2 =xh.createNode(400, wheight/10+200,"switch.png","交换机");
    			var sw3 =xh.createNode(500, wheight/10+200,"switch.png","交换机");*/
    			
    			/*var hsw1 =xh.createNode(400, wheight/2+30,"hsw.png","核心交换机");
    			
    			var sw4 =xh.createNode(200, wheight/2+100,"switch.png","交换机");
    			var sw5 =xh.createNode(300, wheight/2+100,"switch.png","交换机");
    			var sw6 =xh.createNode(400, wheight/2+100,"switch.png","交换机");
    			var sw7 =xh.createNode(500, wheight/2+100,"switch.png","交换机");*/
    			
    			/*var poc1 =xh.createNode(200,wheight/2+200,"poc.png","POC系统");
                var bridging1 =xh.createNode(300, wheight/2+200,"bridging.png","桥接系统");
                var dispatch1 =xh.createNode(400, wheight/2+200,"dispatch.png","调度台");
                var bs1 =xh.createNode(500, wheight/2+200,"bs.png","基站");*/
    			
    			
    			//连线
               /* var link1 = xh.createNewLink(server1, sw3,5);
                link1.strokeColor = '0,255,0';
                var link2 = xh.createNewLink(emh1, sw2,5);
                link2.strokeColor = '0,255,0';*/
                
                
                
                
               
                             
                
                //交换中心1
                

                
                //$scope.emh();
               //状态监测
               /* emh1.addEventListener('mouseover', function(event){
              	  var html="<table>";
              	  if($scope.emhData.door==0){
              		html+="<tr style='color:#fff;background:green'><td>门禁</td><td>关闭</td></tr>";
              	  }else{
              		html+="<tr style='color:#fff;background:red'><td>门禁</td><td>打开</td></tr>";
              	  }
              	 if($scope.emhData.smoke==0){
              		html+="<tr style='color:#fff;background:green'><td>烟感</td><td>正常</td></tr>";
              	  }else{
              		html+="<tr style='color:#fff;background:red'><td>烟感</td><td>异常</td></tr>";
              	  }
              	 if($scope.emhData.red==0){
               		html+="<tr style='color:#fff;background:green'><td>红外</td><td>正常</td></tr>";
               	  }else{
               		html+="<tr style='color:#fff;background:red'><td>红外</td><td>异常</td></tr>";
               	  }
              	 if($scope.emhData.water==0){
               		html+="<tr style='color:#fff;background:green'><td>水浸</td><td>正常</td></tr>";
               	  }else{
               		html+="<tr style='color:#fff;background:red'><td>水浸</td><td>异常</td></tr>";
               	  }
              	html+="<tr><td>温度</td><td>"+$scope.emhData.temp+"</td></tr>";
          	    html+="<tr><td>湿度</td><td>"+$scope.emhData.damp+"</td></tr>";
          	    html+="<tr><td>交流电压</td><td>"+$scope.emhData.jv+"</td></tr>";
       	        html+="<tr><td>交流电流</td><td>"+$scope.emhData.ji+"</td></tr>";
       	        html+="<tr><td>直流电压</td><td>"+$scope.emhData.lv+"</td></tr>";
       	        html+="<tr><td>直流电流</td><td>"+$scope.emhData.li+"</td></tr>";
              	  html+="<table>";              	 
              	  $(".server-emh").html(html);            	  
              	  var top=event.pageY,left=event.pageX+20;
              	  var clientW=document.documentElement.clientWidth;
              	  var clientH=document.documentElement.clientHeight;
              	  if(clientW-left<200){
              		  left-=250;
              	  }
              	  if(clientH-top<250){
              		  top-=160;
              	  } 
              	  $(".server-emh").css({
              	        top: top,
              	        left: left
              	    }).show();
                });*/              
                              
              
         
		   
		}
            $scope.status();
            
            setInterval(function(){
            	$scope.status();
            }, 30000);
            
            
            $(window).resize(function(){
            	$scope.serverCanvas();
            }) 
		
	});
};

//创建结点
xh.createNode=function(x, y, img,text){
    var node = new JTopo.Node(text);
    node.setLocation(x, y);
    node.setImage('../../Resources/images/top/' + img, true);  
    scene.add(node);
    return node;
}
xh.createNewNode=function(x, y, w, h,text){
    var node = new JTopo.Node(text);
    node.setLocation(x, y);
    node.setSize(w, h);
    scene.add(node);
    return node;
}

//简单连线
xh.createNewLink=function(nodeA, nodeZ, text,state){
    var link = new JTopo.Link(nodeA, nodeZ, text);        
    link.lineWidth = 1; // 线宽
    link.bundleOffset = 60; // 折线拐角处的长度
    link.bundleGap = 20; // 线条之间的间隔
    link.textOffsetY = 3; // 文本偏移量（向下3个像素）
    //link.strokeColor = '248,248,255';
    if(state==0){
		 link.strokeColor = '0,255,0';
	 }else{
		 link.strokeColor = '255,0,0';
	 }
    scene.add(link);
    return link;
}
//折线
xh.createNewFoldLink=function(nodeA, nodeZ, text,tag){
    var link = new JTopo.FoldLink(nodeA, nodeZ, text);
    link.direction ='horizontal';
    link.arrowsRadius = 2; //箭头大小
    link.lineWidth = 1; // 线宽
    link.bundleOffset = 10; // 折线拐角处的长度
    link.bundleGap = 20; // 线条之间的间隔
    link.textOffsetY = 2; // 文本偏移量（向下3个像素）
    if(parseInt(tag)==1){
    	link.strokeColor = '0,255,0';
    }else{
    	link.strokeColor = '255,0,0';
    }
    
    scene.add(link);
    return link;
}

xh.handler=function(event){
   /* if(event.button == 2){// 左键
        // 当前位置弹出菜单（div）
            
    }*/
	$("#contextmenu").css({
        top: event.pageY,
        left: event.pageX
    }).show();
}

/* 右键菜单处理 */    
/*$("#contextmenu a").click(function(){
    var text = $(this).text();
    
    if(text == '删除该节点'){
        scene.remove(currentNode);
        currentNode = null;
    }if(text == '撤销上一次操作'){
        currentNode.restore();
    }else{
        currentNode.save();
    }
    
    if(text == '更改颜色'){
        currentNode.fillColor = JTopo.util.randomColor();
    }else if(text == '顺时针旋转'){
        currentNode.rotate += 0.5;
    }else if(text == '逆时针旋转'){
        currentNode.rotate -= 0.5;
    }else if(text == '放大'){
        currentNode.scaleX += 0.2;
        currentNode.scaleY += 0.2;
    }else if(text == '缩小'){
        currentNode.scaleX -= 0.2;
        currentNode.scaleY -= 0.2;
    }
    $("#contextmenu").hide();
});*/

// 刷新数据
xh.drawCanvas = function() {
	var $scope = angular.element(appElement).scope();
	// 调用$scope中的方法
	$scope.drawCanvas();

};
/*$scope.drawCanvas=function(){
	
    scene.backgroundColor='green';
    

    var cloudNode = new JTopo.Node('交换中心');
    cloudNode.setSize(30, 26);
    cloudNode.setLocation(360,300);            
    cloudNode.layout = {type: 'circle',radius: 150};
    
    scene.add(cloudNode);
    
    for(var i=0; i<2; i++){
        var node =null;
        if(i==0){
        	node = new JTopo.CircleNode("接入应用");
        }else{
        	node = new JTopo.CircleNode("调度台");
        }   
        node.fillStyle = '200,255,0';
        node.radius = 15;
        //node.setLocation(scene.width * Math.random(), scene.height * Math.random());
        if(i == 0){
            node.layout = {type: 'tree', direction: 'bottom', width: 50, height: 90};
        }else{
            node.layout = {type: 'circle', radius: 60};
        }
        scene.add(node);                                
        var link = new JTopo.Link(cloudNode, node);
        link.lineWidth = 3; // 线宽
        link.bundleOffset = 60; // 折线拐角处的长度
        link.bundleGap = 20; // 线条之间的间隔
        link.strokeColor('200,255,0')
        scene.add(link);
        
        if(i==0){
        	for(var j=0; j<6; j++){
                var vmNode = new JTopo.CircleNode('用户343435355-' + j);
                vmNode.radius = 5;
                vmNode.fillColor='220,20,60';
                vmNode.fillStyle = '255,255,0';
                vmNode.setLocation(scene.width * Math.random(), scene.height * Math.random());
                vmNode.fontColor = "255,255,0";
                vmNode.scaleY=0;
                vmNode.rotate=12
                scene.add(vmNode);                                
                scene.add(new JTopo.Link(node, vmNode));                            
            }
        }else{
        	for(var j=0; j<24; j++){
                var vmNode = new JTopo.CircleNode('dispctch' + i + '-' + j);
                vmNode.radius = 10;
                vmNode.fillStyle = '255,255,0';
                vmNode.setLocation(scene.width * Math.random(), scene.height * Math.random());
                scene.add(vmNode);                                
                scene.add(new JTopo.Link(node, vmNode));                            
            }
        }
        
        
    }
    
   
    
    
    
    JTopo.layout.layoutNode(scene, cloudNode, true);
    
    scene.addEventListener('mouseup', function(e){
        if(e.target && e.target.layout){
            JTopo.layout.layoutNode(scene, e.target, true);    
        }                
    });

}*/
xh.timeStamp=function(start,end){ 
	
	var time1=new Date(start);
	var time2=new Date(end);
	var second_time=(time2.getTime()-time1.getTime())/1000;
	
	var time = parseInt(second_time) + "秒";  
	if( parseInt(second_time )> 60){  	  
	    var second = parseInt(second_time) % 60;  
	    var min = parseInt(second_time / 60);  
	    time = min + "分" + second + "秒";  
	      
	    if( min > 60 ){  
	        min = parseInt(second_time / 60) % 60;  
	        var hour = parseInt( parseInt(second_time / 60) /60 );  
	        time = hour + "小时" + min + "分" + second + "秒";  
	  
	        if( hour > 24 ){  
	            hour = parseInt( parseInt(second_time / 60) /60 ) % 24;  
	            var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );  
	            time = day + "天" + hour + "小时" + min + "分" + second + "秒";  
	        }  
	    }        
	  
	}    
	return time;          
} 

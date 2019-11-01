/**
 * 终端状态
 */
if (!("xh" in window)) {
	window.xh = {};
};
require.config({
	paths : {
		echarts : '../../lib/echarts'
	}
});
var background="#fff";
var frist = 0;
var appElement = document.querySelector('[ng-controller=xhcontroller]');
//画布
var canvas = document.getElementById('canvas');
canvas.width = document.documentElement.clientWidth-22;
canvas.height = document.documentElement.clientHeight-38;
var stage = new JTopo.Stage(canvas);
var scene = new JTopo.Scene();
var width=document.documentElement.clientWidth;
var height=document.documentElement.clientHeight;
if(width<1200){
	width=1366;
}
stage.add(scene);
/*scene.background = '../../Resources/images/img/bg.jpg';*/
scene.alpha=1;
scene.backgroundColor='53,63,79';
/*stage.eagleEye.visible = true;*/
stage.wheelZoom = 0.85;

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
		 

		$scope.drawCanvas=function(){
			scene.clear();
			
			
			
			var point11 =xh.createNewNode(70,60,3,3,"");
			var point12 =xh.createNewNode(70,530,3,3,"");
			var point21 =xh.createNewNode(200,60,3,3,"");
			var point22 =xh.createNewNode(200,530,3,3,"");
			
			var point1 =xh.createNewNode(width-750,height-160,3,3,"");
			var point2 =xh.createNewNode(width-750,height-100,3,3,"");
			var point31 =xh.createNewNode(width-50,height-160,3,3,"");
			var point32 =xh.createNewNode(width-50,height-100,3,3,"");
			
			var point41 =xh.createNewNode(width-750,80,3,3,"");
			var point42 =xh.createNewNode(width-750,150,3,3,"");
			var point51 =xh.createNewNode(width-50,80,3,3,"");
			var point52 =xh.createNewNode(width-50,150,3,3,"");
			
			
			
			
			
			var link_point = xh.createNewLink(point1, point2,5);
			link_point.strokeColor = '169,169,169';
			link_point.dashedPattern =15; // 虚线
			
			var link_point1 = xh.createNewLink(point11, point12,5);
			link_point1.strokeColor = '169,169,169';
			link_point1.dashedPattern =15; // 虚线
			
			var link_point2 = xh.createNewLink(point11, point21,"三方接入应用");
			link_point2.strokeColor = '169,169,169';
			link_point2.dashedPattern =15; // 虚线
			
			var link_point3 = xh.createNewLink(point21, point22,5);
			link_point3.strokeColor = '169,169,169';
			link_point3.dashedPattern =15; // 虚线
			
			var link_point4= xh.createNewLink(point12, point22,5);
			link_point4.strokeColor = '169,169,169';
			link_point4.dashedPattern =15; // 虚线
			
			
			
			var link_point5 = xh.createNewLink(point1, point31,"公安");
			link_point5.strokeColor = '169,169,169';
			link_point5.dashedPattern =15; // 虚线
			
			var link_point6 = xh.createNewLink(point31, point32,5);
			link_point6.strokeColor = '169,169,169';
			link_point6.dashedPattern =15; // 虚线
			
			var link_point7= xh.createNewLink(point2, point32,5);
			link_point7.strokeColor = '169,169,169';
			link_point7.dashedPattern =15; // 虚线
			
			
			
			var link_point8 = xh.createNewLink(point41, point51,"交警");
			link_point8.strokeColor = '169,169,169';
			link_point8.dashedPattern =15; // 虚线
			
			var link_point9 = xh.createNewLink(point51, point52,5);
			link_point9.strokeColor = '169,169,169';
			link_point9.dashedPattern =15; // 虚线
			
			var link_point10= xh.createNewLink(point42, point52,5);
			link_point10.strokeColor = '169,169,169';
			link_point10.dashedPattern =15; // 虚线
			var link_point11= xh.createNewLink(point41, point42,5);
			link_point11.strokeColor = '169,169,169';
			link_point11.dashedPattern =15; // 虚线
			
			
			
			
			var rootNode =xh.createRootNode(200, height/2, 30, 30,"交换中心","tree");
            
            
            $http.get("../../status/dispatch").
    		success(function(response){
    			xh.maskHide();
    			var dispatch = response.items;
    			var left=50,top=height/2-200;
    			var x=width/2-200,y=0,tag=0;;
    			for(var i=0;i<dispatch.length;i++){
    				var dd=dispatch[i].items;
    				var type=dispatch[i].type;
    				
    				if(type=="交警"){
    					x=width/2;y=height/2;
    				}else if(type=="公安"){
    					x=width/2+150;y=height/2+20;
    				}else{
    					x=width/2-200
    					tag+=50;
    					y=tag;
    				}
    				
				/*	if(i<=6){
						x+=30;
						y+=45;
					}else{
						x-=30;
						y+=45;
					}*/
					
				
					
    				var img="d1.png";
    				if(dd.length>1){
    					img="sw1.png";
    				}else{
    				 var setup=dd[0].setupStatus;
   					 if(setup!=1){
                        img="d2.png";
                      }
    				}
                    var oneNode = xh.createNode(x,y,img,type);
                    oneNode.index=i;
                    
                    var link=new JTopo.Link(rootNode, oneNode);
                    link.lineWidth = 1; // 线宽
                    link.strokeColor = '0,255,0'; 
                    if(dd.length==1){
                    	  var lineType=dd[0].flag;
                          var setup=dd[0].setupStatus;
                          
                          if(setup==1){
                         	 if(lineType==1){
                               	link.strokeColor = '0,255,0';
                               }else{
                               	link.strokeColor = '255,0,0';
                               }
                          }else{
                         	 link.strokeColor = '119,136,153';
                          }
                    }
                    scene.add(link); 
                    
                   
                    if(dd.length>1){
                    	var a=10,b=0,x2=width-750,y2=0;
                    	for(var j=0;j<dd.length;j++){
        					var b=dd[j];
        					 var lineType=b.flag;
                             var setup=b.setupStatus;
        					
        					/*y2+=50;x2+=30;*/
        					
        					if(b.dstName.indexOf("公安")>-1){
        						/*x2=width/2+200;
            					y2+=a+40;*/
        						y2=height-150;
        						x2+=80
        					}else{
        						
            					/*x2=width/2+400;
            					y2+=70;*/
        						y2=100;
        						x2+=80
        					}
        					//图标
        					var ico="d1.png";
        					 if(setup!=1){
                               	 ico="d2.png";
                            }
                            var twoNode = xh.createNode(x2,y2,ico,b.dstName);

                            twoNode.indexi=i;
                            twoNode.indexj=j;
                            var link2=new JTopo.Link(oneNode, twoNode);
                            link2.lineWidth = 1; // 线宽 
                           
                            
                            if(setup==1){
                           	 if(lineType==1){
                                 	link2.strokeColor = '0,255,0';
                                 }else{
                                 	link2.strokeColor = '255,0,0';
                                 }
                            }else{
                           	 link2.strokeColor = '119,136,153';
                            }
                            scene.add(link2); 
                            twoNode.addEventListener('mouseover', function(event){
      	                	  var d=dispatch[this.indexi].items[this.indexj];
      	                	  var html="<table>";
      	                	  html+="<tr><td>调度台ID</td><td>"+d.dstId+"</td></tr>";
      	                	  html+="<tr><td>调度台名称</td><td>"+d.dstName+"</td></tr>";
      	                	  if(d.setupStatus==1){
      	                		  if(d.flag==1){
      	                			  html+="<tr style='color:#fff;background:green;'><td>状态</td><td>正常</td></tr>";
      		                	  }else{
      		                		  html+="<tr style='color:#fff;background:red;'><td>状态</td><td>异常</td></tr>"; 
      		                	 }
      	                	  }else{
      	                		  html+="<tr style='color:#000;background:#fafafa;'><td>状态</td><td>未安装</td></tr>"; 
      	                	  }
      	                	  html+="<tr><td>更新时间</td><td>"+d.updateTime+"</td></tr>";
      	                	  html+="</table>";
      	                	 
      	                	  $(".dispatch-info").html(html);
      	                	  
      	                	  var top=event.pageY,left=event.pageX;
      	                	  var clientW=document.documentElement.clientWidth;
      	                	  var clientH=document.documentElement.clientHeight;
      	                	  if(clientW-left<200){
      	                		  left-=250;
      	                	  }
      	                	  if(clientH-top<100){
      	                		  top-=180;
      	                	  }
      	                	  
      	                	  $(".dispatch-info").css({
      	                	        top: top,
      	                	        left: left
      	                	    }).show();
      	                  });
                            
      	                  twoNode.addEventListener('mouseout', function(event){
      	                	  $(".dispatch-info").hide();
      	                  });
        				}
                    	/*left=width-300;
                    	top=top-100;*/	
                    	
                    }else{
                    	oneNode.addEventListener('mouseover', function(event){
    	                	  var d=dispatch[this.index].items[0];
    	                	  var html="<table>";
    	                	  html+="<tr><td>调度台ID</td><td>"+d.dstId+"</td></tr>";
    	                	  html+="<tr><td>调度台名称</td><td>"+d.dstName+"</td></tr>";
    	                	  if(d.setupStatus==1){
    	                		  if(d.flag==1){
    	                			  html+="<tr style='color:#fff;background:green;'><td>状态</td><td>正常</td></tr>";
    		                	  }else{
    		                		  html+="<tr style='color:#fff;background:red;'><td>状态</td><td>异常</td></tr>"; 
    		                	 }
    	                	  }else{
    	                		  html+="<tr style='color:#000;background:#fafafa;'><td>状态</td><td>未安装</td></tr>"; 
    	                	  }
    	                	  html+="<tr><td>更新时间</td><td>"+d.updateTime+"</td></tr>";
    	                	  html+="</table>";
    	                	 
    	                	  $(".dispatch-info").html(html);
    	                	  
    	                	  var top=event.pageY,left=event.pageX;
    	                	  var clientW=document.documentElement.clientWidth;
    	                	  var clientH=document.documentElement.clientHeight;
    	                	  if(clientW-left<200){
    	                		  left-=250;
    	                	  }
    	                	  if(clientH-top<100){
    	                		  top-=180;
    	                	  }
    	                	  
    	                	  $(".dispatch-info").css({
    	                	        top: top,
    	                	        left: left
    	                	    }).show();
    	                  });
                          
    	                  oneNode.addEventListener('mouseout', function(event){
    	                	  $(".dispatch-info").hide();
    	                  });
                    }
    			}
    			
    			
    			
    			 /*for(var j=0; j<dTotals; j++){
             	    var data=$scope.dispatch;
                     var vmNode = new JTopo.Node(dispatch[j].dstId);
                     vmNode.radius = 10;
                     vmNode.fillStyle = '255,255,0';
                     vmNode.index=j;
                     vmNode.setLocation(scene.width * Math.random(), scene.height * Math.random());
                     vmNode.setImage("../../Resources/images/top/dispatch-point.png",true);
                    
                     if(dispatch[j].setupStatus==1){
               		  if(dispatch[j].flag!=1){
               			 vmNode.alarm = '告警';
               			 setInterval(function(){
                            if(this.alarm == '告警'){
                            	vmNode.alarm = null;
                            }else{
                            	vmNode.alarm = '告警'
                            }
                        }, 600);
               	      }
                     }
                     scene.add(vmNode); 
                     var link=new JTopo.Link(dispatchNode, vmNode);
                     link.lineWidth = 1; // 线宽
                     link.bundleOffset = 60; // 折线拐角处的长度
                     link.bundleGap = 20; // 线条之间的间隔
                     var lineType=dispatch[j].flag;
                     var setup=dispatch[j].setupStatus;
                     
                     if(setup==1){
                    	 if(lineType==1){
                          	link.strokeColor = '0,255,0';
                          }else{
                          	link.strokeColor = '255,0,0';
                          }
                     }else{
                    	 link.strokeColor = '119,136,153';
                     }
                     
                     scene.add(link);  
                     vmNode.addEventListener('mouseover', function(event){
	                	  var d=dispatch[this.index];
	                	  var html="<table>";
	                	  html+="<tr><td>调度台ID</td><td>"+d.dstId+"</td></tr>";
	                	  html+="<tr><td>调度台名称</td><td>"+d.dstName+"</td></tr>";
	                	  if(d.setupStatus==1){
	                		  if(d.flag==1){
	                			  html+="<tr style='color:#fff;background:green;'><td>状态</td><td>正常</td></tr>";
		                	  }else{
		                		  html+="<tr style='color:#fff;background:red;'><td>状态</td><td>异常</td></tr>"; 
		                	 }
	                	  }else{
	                		  html+="<tr style='color:#000;background:#fafafa;'><td>状态</td><td>未安装</td></tr>"; 
	                	  }
	                	  html+="<tr><td>更新时间</td><td>"+d.updateTime+"</td></tr>";
	                	  html+="</table>";
	                	 
	                	  $(".dispatch-info").html(html);
	                	  
	                	  var top=event.pageY,left=event.pageX;
	                	  var clientW=document.documentElement.clientWidth;
	                	  var clientH=document.documentElement.clientHeight;
	                	  if(clientW-left<200){
	                		  left-=250;
	                	  }
	                	  if(clientH-top<100){
	                		  top-=180;
	                	  }
	                	  
	                	  $(".dispatch-info").css({
	                	        top: top,
	                	        left: left
	                	    }).show();
	                  });
                      
	                  vmNode.addEventListener('mouseout', function(event){
	                	  $(".dispatch-info").hide();
	                  });
               }*/
    			
    			// JTopo.layout.layoutNode(scene, dispatchNode, true);
    		});
            $scope.user=null;
            //接入应用
           $http.get("../../access/list").
			success(function(response){
				xh.maskHide();
				var data = response.items;
				var totals = response.totals;
				var x2=100,y2=50;
				 for(var j=0; j<totals; j++){
					 y2+=80;
	                  var vmNode = xh.createNode(x2,y2,"user.png",data[j].User_Unit);
	                  vmNode.radius = 10;
	                  vmNode.fillStyle = '255,255,0';
	                  vmNode.index=j;
	                  if(data[j].status!=1){
	                	  vmNode.alarm = '接入告警';
	                  }
	                  scene.add(vmNode); 
	                  var link=new JTopo.Link(rootNode, vmNode);
	                  link.lineWidth = 1; // 线宽
	                  link.bundleOffset = 60; // 折线拐角处的长度
	                  link.bundleGap = 20; // 线条之间的间隔
	                  if(data[j].status==1){
	                	  link.strokeColor = '0,255,0'; 
	                  }else{
                        	link.strokeColor = '255,0,0';
                      }
	                  
	                  scene.add(link);
	                  
	                  vmNode.addEventListener('mouseover', function(event){
	                	  var user=data[this.index];
	                	  var html="<table>";
	                	  html+="<tr><td>用户编号</td><td>"+user.User_id+"</td></tr>";
	                	  html+="<tr><td>隶属单位</td><td>"+user.User_Unit+"</td></tr>";
	                	  html+="<tr><td>IP地址</td><td>"+user.User_Ip+"</td></tr>";
	                	  html+="<tr><td>开户时间</td><td>"+user.User_Reg_Time+"</td></tr>";
	                	 if(user.status==1){
	                		 html+="<tr style='color:#fff;background:green;'><td>状态</td><td>正常</td></tr>";
	                		 html+="<tr style='color:green'><td>运行时长</td><td>"+xh.timeStamp(user.runTime,new Date())+"</td></tr>";
	                	 }else{
	                		 html+="<tr style='color:#fff;background:red;'><td>状态</td><td>异常</td></tr>";
	                		 html+="<tr style='color:red'><td>离线时长</td><td>"+xh.timeStamp(user.runTime,new Date())+"</td></tr>";
	                	 }
	                	 html+="</table>";
	                	  $(".user-info").html(html);
	                	  $(".user-info").css({
	                	        top: event.pageY,
	                	        left: event.pageX
	                	    }).show();
	                  });
	                  vmNode.addEventListener('mouseout', function(event){
	                	  $(".user-info").hide();
	                  });
	                 /* JTopo.layout.layoutNode(scene, rootNode, true);*/
	            }
				
			});
            
            stage.click(function(event){
                if(event.button == 0){// 右键
                    // 关闭弹出菜单（div）
                    $("#contextmenu").hide();
                }
            });
            
            
            
            
             
	         
	          
	            
	            scene.addEventListener('mouseup', function(e){
	                if(e.target && e.target.layout){
	                    JTopo.layout.layoutNode(scene, e.target, true);    
	                }                
	            });
	            scene.addEventListener('mouseover', function(e){
	            	
	                /*if(e.target && e.target.layout){
	                    JTopo.layout.layoutNode(scene, e.target, true);    
	                }*/                
	            });
	            stage.addEventListener("dbclick", function(e){
	            	
	            });
		   
		}
		$scope.drawCanvas();
		/*setInterval(function(){
			$scope.drawCanvas();
        }, 10000);*/
	
		
		/*setInterval(function(){
			$scope.refresh();
			
			}, 10000);*/ //每隔 10 秒 
		
	});
};

//创建结点
xh.createNewNode=function(x, y, w, h,text){
    var node = new JTopo.Node(text);
    node.setLocation(x, y);
    node.setSize(w, h);
    scene.add(node);
    return node;
}
xh.createNode=function(x, y, img,text){
    var node = new JTopo.Node(text);
    node.setLocation(x, y);
    node.setImage('../../Resources/images/top/' + img, true);  
    scene.add(node);
    return node;
}
xh.createRootNode=function(x, y, w, h, text,type){
    var node = new JTopo.Node(text);
    node.setLocation(x, y);
    node.setSize(w, h);
    node.setImage("../../Resources/images/top/msc.png",true);
    scene.add(node);
    return node;
}
xh.createUserNode=function(x, y, w, h, text,type){
    var node = new JTopo.Node(text);
    node.dragable=false;
    node.setLocation(x, y);
    node.setSize(w, h);
    node.setImage("../../Resources/images/top/access.png",true);
    /*node.layout = {type: 'tree', direction: 'left', width: 50, height: 90};*/
    node.layout = {type: 'circle',radius: 100};
    scene.add(node);
    return node;
}
xh.createDispatchNode=function(x, y, w, h, text,type){
    var node = new JTopo.Node(text);
    
    node.setLocation(x, y);
    node.setSize(w, h);
    node.setImage("../../Resources/images/top/dispatch.png",true);
    node.layout = {type: 'tree', direction: 'right', width: 50, height: 90};
    scene.add(node);
    return node;
}
//简单连线
xh.createNewLink=function(nodeA, nodeZ, text,lineType){
    var link = new JTopo.Link(nodeA, nodeZ, text);        
    link.lineWidth = 1; // 线宽
    link.bundleOffset = 60; // 折线拐角处的长度
    link.bundleGap = 20; // 线条之间的间隔
    link.textOffsetY = 3; // 文本偏移量（向下3个像素）
    link.strokeColor = '248,248,255';
   
    
    scene.add(link);
    return link;
}
//折线
xh.createNewFoldLink=function(nodeA, nodeZ, text, direction){
    var link = new JTopo.FoldLink(nodeA, nodeZ, text);
    link.direction = direction || 'horizontal';
    link.arrowsRadius = 10; //箭头大小
    link.lineWidth = 1; // 线宽
    link.bundleOffset = 60; // 折线拐角处的长度
    link.bundleGap = 20; // 线条之间的间隔
    link.textOffsetY = 2; // 文本偏移量（向下3个像素）
    link.strokeColor = '248,248,255';
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

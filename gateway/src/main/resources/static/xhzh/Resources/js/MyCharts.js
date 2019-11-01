require.config({
	paths : {
		echarts : 'lib/echarts'
	}
});
var background="#272625";
//循环调用的函数
/*var tempCharts=function(j,data){
	switch(j){
	case 4:
		temperature(data);
		break;
	case 5:
		humidity(data);
		break;
	case 8:
		Current_voltage(data);
		break;
	}
}*/

//基于准备好的dom，初始化echarts实例
var chart = null;
if (chart != null) {
	chart.clear();
	chart.dispose();
}
//温度表盘
var temperature=function (data){
	require([ 'echarts', 'echarts/chart/gauge' ],
			function(ec) {
				chart = ec.init(document.getElementById('temperature'));
				chart.showLoading({
					text : '正在努力的读取数据中...'
				});
				var option = {
					    tooltip : {
					        formatter: "{a} <br/>{b} : {c}%"
					    },
					    series : [
					        {
					            name:'温度',
					            type:'gauge',
					            detail : {formatter:'{value}℃'},
					            data:[{name: '当前温度',value: data.sig_value}]
					        }
					    ]
					};
				chart.hideLoading();
				chart.setOption(option);
			});
}
//湿度表盘
var humidity=function (data){
	require([ 'echarts', 'echarts/chart/gauge' ],
			function(ec) {
				chart = ec.init(document.getElementById('humidity'));
				chart.showLoading({
					text : '正在努力的读取数据中...'
				});
				var option = {
					    tooltip : {
					        formatter: "{a} <br/>{b} : {c}%"
					    },
					    series : [
					        {
					            name:'湿度',
					            type:'gauge',
					            detail : {formatter:'{value}%'},
					            data:[{name: '当前湿度',value: data.sig_value}]
					        }
					    ]
					};
				chart.hideLoading();
				chart.setOption(option);
			});
}
var Current_voltage= function (data){
	require([ 'echarts', 'echarts/chart/gauge' ],
			function(ec) {
				chart = ec.init(document.getElementById('Current_voltage'));
				chart.showLoading({
					text : '正在努力的读取数据中...'
				});
				var option = {
					    tooltip : {
					        formatter: "{a} <br/>{c} {b}"
					    },
					    series : [
					              {
							            name:'DC电压',
							            type:'gauge',
							            center : ['25%', '50%'],    // 默认全局居中
							            radius : '100%',
							            min:0,
							            max:2,
							            startAngle:135,
							            endAngle:45,
							            splitNumber:2,
							            axisLine: {            // 坐标轴线
							                lineStyle: {       // 属性lineStyle控制线条样式
							                    color: [[0.2, '#ff4500'],[0.8, '#48b'],[1, '#228b22']], 
							                    width: 8
							                }
							            },
							            axisTick: {            // 坐标轴小标记
							                splitNumber:5,
							                length :10,        // 属性length控制线长
							                lineStyle: {       // 属性lineStyle控制线条样式
							                    color: 'auto'
							                }
							            },
							            axisLabel: {
							                formatter:function(v){
							                    switch (v + '') {
							                        case '0' : return 'L';
							                        case '1' : return 'V';
							                        case '2' : return 'H';
							                    }
							                }
							            },
							            splitLine: {           // 分隔线
							                length :15,         // 属性length控制线长
							                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
							                    color: 'auto'
							                }
							            },
							            pointer: {
							                width:2
							            },
							            title : {
							                show: false
							            },
							            detail : {
							                show: false
							            },
							            data:[{value: data[0].sig_value, name: '伏特'}]
							        },
							        {
							            name:'AC电压',
							            type:'gauge',
							            center : ['25%', '50%'],    // 默认全局居中
							            radius : '100%',
							            min:0,
							            max:2,
							            startAngle:315,
							            endAngle:225,
							            splitNumber:2,
							            axisLine: {            // 坐标轴线
							                lineStyle: {       // 属性lineStyle控制线条样式
							                    color: [[0.2, '#ff4500'],[0.8, '#48b'],[1, '#228b22']], 
							                    width: 8
							                }
							            },
							            axisTick: {            // 坐标轴小标记
							                show: false
							            },
							            axisLabel: {
							                formatter:function(v){
							                    switch (v + '') {
							                        case '0' : return 'L';
							                        case '1' : return 'V';
							                        case '2' : return 'H';
							                    }
							                }
							            },
							            splitLine: {           // 分隔线
							                length :15,         // 属性length控制线长
							                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
							                    color: 'auto'
							                }
							            },
							            pointer: {
							                width:2
							            },
							            title : {
							                show: false
							            },
							            detail : {
							                show: false
							            },
							            data:[{value: data[1].sig_value, name: '伏特'}]
							        },
					        
					        {
					            name:'AC',
					            type:'gauge',
					            center : ['75%', '55%'],    // 默认全局居中
					            radius : '100%',
					            min:0,
					            max:7,
					            endAngle:45,
					            splitNumber:7,
					            axisLine: {            // 坐标轴线
					                lineStyle: {       // 属性lineStyle控制线条样式
					                    width: 8
					                }
					            },
					            axisTick: {            // 坐标轴小标记
					                length :12,        // 属性length控制线长
					                lineStyle: {       // 属性lineStyle控制线条样式
					                    color: 'auto'
					                }
					            },
					            splitLine: {           // 分隔线
					                length :20,         // 属性length控制线长
					                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
					                    color: 'auto'
					                }
					            },
					            pointer: {
					                width:5
					            },
					            title : {
					                offsetCenter: [0, '-30%'],       // x, y，单位px
					            },
					            detail : {
					                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
					                    fontWeight: 'bolder'
					                }
					            },
					            data:[{value: data[2].sig_value, name: 'A'}]
					        }
					       
					    ]
					};

				chart.hideLoading();
				chart.setOption(option);
			});
}
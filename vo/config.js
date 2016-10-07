// @charset "utf-8";
/**
 * 类的描述 个股曲线图表参数设置
 * 
 * @Filename config.js
 * @author Rocky
 * @Time 2014-4-25 下午02:21:06
 * @Version v1.0.0
 */

var fsCanvas = $id('canvasFS');
var klCanvas = $id('canvasKL');
var width_parent = fsCanvas.parentNode.clientWidth; // screen.width;// , screen.width, screen.height
var height_parent = 290;

var canvasWidth = width_parent;
var marginLeft = 40;
var marginRight = 46;
var marginTop = 0;

var fsChartWidth = canvasWidth - marginLeft - marginRight;
var klChartWidth = canvasWidth - marginRight - 0.5;


fsCanvas.style.width = canvasWidth + "px";
fsCanvas.style.height = height_parent + 1 + "px";
fsCanvas.height = height_parent * devicePixelRatio;
fsCanvas.width = canvasWidth * devicePixelRatio;

klCanvas.style.width = canvasWidth + "px";
klCanvas.style.height = height_parent + "px";
klCanvas.height = height_parent * devicePixelRatio;
klCanvas.width = canvasWidth * devicePixelRatio;

var xAxisHeight = 20;
var chartHeight = Math.floor(height_parent * 0.6);
var temp = height_parent - chartHeight;
var volumeHeight = temp - xAxisHeight;
//var priceHeight = temp - volumeHeight - xAxisHeight;

/**
 * 分时图表区域
 * 
 * @type
 */
var _fsChartRegion = {
	x : marginLeft * devicePixelRatio + 0.5,
	y : marginTop * devicePixelRatio,
	width : fsChartWidth * devicePixelRatio,
	height : chartHeight * devicePixelRatio
};
var _klChartRegion = {
	x : marginLeft * devicePixelRatio + 0.5,
	y : marginTop * devicePixelRatio,
	width : klChartWidth * devicePixelRatio,
	height : chartHeight * devicePixelRatio - 0.5
};

/**
 * 成交量
 * 
 * @type
 */
var _fsVolumeRegion = {
	x : marginLeft * devicePixelRatio + 0.5,
	y : _fsChartRegion.y + _fsChartRegion.height + xAxisHeight * devicePixelRatio - 0.5,
	height : volumeHeight * devicePixelRatio,
	width : fsChartWidth * devicePixelRatio
};

var _klVolumeRegion = {
	x : marginLeft * devicePixelRatio + 0.5,
	y : _klChartRegion.y + _klChartRegion.height + xAxisHeight * devicePixelRatio - 1,
	height : volumeHeight * devicePixelRatio,
	width : klChartWidth * devicePixelRatio
};

var fsOptions = {
	canvas : fsCanvas,
	leftTipSize : {
		width : 38 * devicePixelRatio,
		height : 18 * devicePixelRatio
	},
	rightTipSize : {
		width : 38 * devicePixelRatio,
		height : 18 * devicePixelRatio
	},
	bottomTipSize : {
		width : 35 * devicePixelRatio,
		height : 18 * devicePixelRatio
	},
	backgroundColor : '#fff',
	riseColor : RiseColor,
	fallColor : FallColor,
	normalColor : 'black',
	needPaintAvgPriceLine : true,
	minsChart : {
		totalDotsCount : 242,
		region : _fsChartRegion,
		priceLineColor : 'rgb(48, 133, 213)',
		avgPriceLineColor : 'rgb(241, 140, 79)',
		middleLineStyle : 'gray',
		middleLineWidth : lineWidth,
		otherLineWidth : lineWidth,
		otherLineStyle : 'lightgray',
		borderColor : 'gray',
		horizontalLineCount : 3,
		verticalLineCount : 3,
		lineStyle : 'dashed',// 'solid',
		yScalerLeft : {
			font : font + 'px Arial',
			region : {
				x : 0.5,
				y : _fsChartRegion.y,
				width : marginLeft * devicePixelRatio,
				height : _fsChartRegion.height
			},
			align : 'right',
			textBaseline : 'top',
			fontHeight : font
		},
		yScalerRight : {
			font : font + 'px Arial',
			region : {
				x : _fsChartRegion.width + _fsChartRegion.x,
				y : _fsChartRegion.y,
				width : marginRight * devicePixelRatio,
				height : _fsChartRegion.height
			},
			align : 'left',
			textBaseline : 'top',
			fontHeight : font
		}
	},
	xScaler : {
		textBaseline : 'top',
		font : font + 'px Arial',
		color : 'black',
		region : {
			x : _fsChartRegion.x,
			y : _fsChartRegion.y + _fsChartRegion.height,
			width : _fsChartRegion.width,
			height : xAxisHeight
		},
		data : ['09:30', '10:30', '11:30/13:00', '14:00', '15:00'],
		fontHeight : font
	},
	volume : {
		region : _fsVolumeRegion,
		totalDotsCount : 241,
		borderColor : 'gray',
		splitLineColor : 'lightgray',
		splitLineWidth : lineWidth,
		verticalLineCount : 3,
		yScalerLeft : {
			font : font + 'px Arial',
			region : {
				x : _fsVolumeRegion.x - marginLeft * devicePixelRatio,
				y : _fsVolumeRegion.y, 
				width : _fsVolumeRegion.x,
				height : _fsVolumeRegion.height - 5
			},
			color : 'black',
			align : 'right',
			textBaseline : 'top',
			fontHeight : font
		},
		yScalerRight : {
			font : font + 'px Arial',
			region : {
				x : _fsVolumeRegion.width + _fsVolumeRegion.x,
				y : _fsVolumeRegion.y,
				width : _fsVolumeRegion.x,
				height : _fsVolumeRegion.height - 5
			},
			color : 'black',
			align : 'left',
			textBaseline : 'top',
			fontHeight : font
		}
	},
	slider : {
		bar : {
			width : 20,
			height : 35,
			borderColor : 'black',
			fillColor : 'lightgray'
		},
		minBarDistance : 20
	}
};

var klOptions = {
	leftTipSize : {
		width : 38 * devicePixelRatio,
		height : 18 * devicePixelRatio
	},
//	rightTipSize : {
//		width : 38 * devicePixelRatio,
//		height : 18 * devicePixelRatio
//	},
	bottomTipSize : {
		width : 70 * devicePixelRatio,
		height : 18 * devicePixelRatio
	},
	canvas : klCanvas,
//	backgroundColor : '#fff',
	riseColor : RiseColor,
	fallColor : FallColor,
	normalColor : 'black',
	// 主图区域
	region : _klChartRegion,
	// 柱子宽度
	barWidth : 4 * devicePixelRatio,
	// 两根柱子之间间隔宽度
	spaceWidth : 2 * devicePixelRatio,
	// 水平线数量
	horizontalLineCount : 2,
	// 垂直线数量
	verticalLineCount : 1,
	lineStyle : 'dashed',// 'solid',
	borderColor : 'gray',
	splitLineColor : '#eeeeee',
	circleColor : RiseColor,
	lineWidth : lineWidth,
	MAs : [{
				color : 'rgb(255,70,251)',
				daysCount : 5
			}, {
				color : 'rgb(227,150,34)',
				daysCount : 10
			}, {
				color : 'rgb(53,71,107)',
				daysCount : 20
			}],
	yAxis : {
		region : {
			x : 0.5,
			y : _klChartRegion.y,
			width : marginLeft * devicePixelRatio,
			height : _klChartRegion.height
		},
		font : font + 'px Arial',
		color : 'black',
		fontHeight : font,
		textBaseline : 'top'
	},
	xAxis : {
		region : {
			x : _klChartRegion.x / 2,
			y : _klChartRegion.y + _klChartRegion.height,
			width : _klChartRegion.width + _klChartRegion.x / 2,
			height : xAxisHeight
		},
		font : font + 'px Arial',
		color : 'black',
		align : 'left',
		fontHeight : font,
		textBaseline : 'top',
		scalerCount : 2,
		height : xAxisHeight
	},
	volume : {
		region : _klVolumeRegion,
		lineWidth : lineWidth,
		horizontalLineCount : 1,
		lineStyle : 'dashed',
		yAxis : {
			region : {
				x : _klVolumeRegion.x - marginLeft * devicePixelRatio,
				y : _klVolumeRegion.y, // + _chartRegion.height + xAxisHeight *
										// devicePixelRatio
				width : _klVolumeRegion.x,
				height : _klVolumeRegion.height
			},
			font : font + 'px Arial',
			color : 'black',
			align : 'right',
			fontHeight : font,
			textBaseline : 'top'
		}
	},
	/*priceLine : {
		region : {
			x : marginLeft * devicePixelRatio,
			y : _klVolumeRegion.y + _klVolumeRegion.height,
			height : (height_parent * devicePixelRatio - xAxisHeight
					* devicePixelRatio - _klVolumeRegion.height - _klChartRegion.height),
			width : _klVolumeRegion.width
		},
		verticalLineCount : 5,
		horizontalLineCount : 1,
		lineStyle : 'dashed',
		borderColor : '#cccccc',
		splitLineColor : '#eeeeee',
		fillColor : '#a0d4f6',
		alpha : 1,
		yAxis : {
			font : font + 'px Arial',
			color : 'black',
			align : 'left',
			fontHeight : font,
			textBaseline : 'top'
		}
	},*/
	slider : {
		bar : {
			width : 20 * devicePixelRatio,
			height : 35 * devicePixelRatio,
			borderColor : 'gray',
			fillColor : 'lightgray'
		},
		minBarDistance : 20 * devicePixelRatio
	}
};
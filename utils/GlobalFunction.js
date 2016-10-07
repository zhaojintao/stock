// @charset "utf-8";
/**
 * 类的描述 全局公共函数
 * 
 * @Filename GlobalFunction.js
 * @author Rocky
 * @Time 2014-3-20 下午02:18:23
 * @Version v1.0.0
 */
 

/**
 * 常量
 */
var dashSize = 2;


/**
 * 线宽
 * 
 * @type Number
 */
var lineWidth = 2;

/**
 * 显示字体大小
 * 
 * @type
 */
var font = 12 * devicePixelRatio;
/**
 * 红色
 * 
 * @type String
 */
var RiseColor = 'rgb(252, 4, 4)';
/**
 * 绿色
 * 
 * @type String
 */
var FallColor = 'rgb(0, 168, 0)';

/**
 * 日期转换
 * 
 * @param {}
 *            val
 * @param {}
 *            withWeek 转换后是否带有‘星期’
 * @return {}
 */
function convertDate(val, withWeek) {
	var year = Math.ceil(val / 10000) - 1;
	var day = val % 100;
	var month = (Math.ceil(val / 100) - 1) % 100;
	var d = new Date();
	d.setYear(year);
	d.setMonth(month - 1);
	d.setDate(day);
	if (month < 10)
		month = '0' + month;
	if (day < 10)
		day = '0' + day;
	if (withWeek) {
		var weekNames = ['日', '一', '二', '三', '四', '五', '六'];
		return year + '-' + month + '-' + day + '，' + '星期'+ weekNames[d.getDay()]; // 
	} else {
		return year + '-' + month + '-' + day;
	}
}
/**
 * 
 * @param {}
 *            high
 * @param {}
 *            low
 * @param {}
 *            count
 * @param {}
 *            formatFunc
 */
function calcAxisValues(high, low, count, formatFunc) {
	var delta = high - low;
	var space = delta / (count - 1);
	var result = [];
	if (typeof formatFunc == 'undefined') {
		formatFunc = toMoney;
	}
	for (var i = 0; i < count; ++i) {
		var x = toMoney(high - space * i);
		if (x >= 10000 && x <= 1000000) {
			x = x / 10000 + '万';
		} else if (x >= 1000000 && x <= 100000000) {
			x = x / 1000000 + '百万';
		}
		if(x >= 1000)
		{
			x = Math.round(x).toFixed(0);
		}
		result.push(x);
	}
	return result;
}

function toMoney(num) {
	if (!isNaN(num)) {
		return num.toFixed(2);
	}
}
/**
 * 计算移动平均线
 * 
 * @param {}
 *            ks
 * @param {}
 *            startIndex
 * @param {}
 *            count
 * @param {}
 *            daysCn
 * @return {}
 */
function calcMAPrices(ks, startIndex, count, daysCn) {
	var result = new Array();
	for (var i = startIndex; i < startIndex + count; i++) {
		var startCalcIndex = i - daysCn + 1;
		if (startCalcIndex < 0) {
			result.push(false);
			continue;
		}
		var sum = 0;
		for (var k = startCalcIndex; k <= i; k++) {
			sum += ks[k].close;
		}
		var val = sum / daysCn;
		result.push(val);
	}
	return result;
}

function $id(id) {
	return document.getElementById(id);
}
/*
 * 获取K线颜色 ki 当前要显示的TIP框K线数据
 */
function getPriceColor(close, price) {
	if (price >= close) {
		return riseColor;
	} else if (price < close) {
		return fallColor;
	} else {
		return normalColor;
	}
}

function getColor(price) {
	if (price >= 0) {
		return riseColor;
	} else {
		return fallColor;
	}
}

/**
 * 对Array的each进行扩展
 * 
 * @param {}
 *            func
 * @param {}
 *            startIndex
 * @param {}
 *            endIndex
 */
Array.prototype.each = function(func, startIndex, endIndex) {
	startIndex = startIndex || 0;
	endIndex = endIndex || this.length - 1;
	for (var index = startIndex; index <= endIndex; index++) {
		func(this[index], this, index);
		if (this.breakLoop) {
			this.breakLoop = false;
			break;
		}
	}
}

function setTouchEventOffsetPosition(e, relativePoint) {
	e = e || event;
	if (e.touches && e.touches.length) {
		e = e.touches[0];
	} else if (e.changedTouches && e.changedTouches.length) {
		e = e.changedTouches[0];
	}
	
	var offsetX = e.pageX - relativePoint.x;
	var offsetY = e.pageY - relativePoint.y;
//	console.log(e.pageX,e.pageY, relativePoint.x,  relativePoint.y, offsetX, offsetY);
	return {
		offsetX : offsetX  * devicePixelRatio ,
		offsetY : offsetY  * devicePixelRatio 
	}
}

/**
 * 
 * @param {}
 *            ctx
 * @param {}
 *            x0
 * @param {}
 *            y0
 * @param {}
 *            x1
 * @param {}
 *            y1
 * @param {}
 *            color
 * @param {}
 *            width
 */
function line(lineParam) {
	if (lineParam == null) {
		return;
	}
	var ctx = lineParam.ctx;
	var x0 = lineParam.x0;
	var y0 = lineParam.y0;
	var x1 = lineParam.x1;
	var y1 = lineParam.y1;
	var color = lineParam.color;
	var lineWidth = lineParam.lineWidth;
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.stroke();
}
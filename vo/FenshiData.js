// @charset "utf-8";
/**
 * 类的描述 分时曲线数据
 * 
 * @Filename FenshiData.js
 * @author Rocky
 * @Time 2014-3-21 下午04:39:15
 * @Version v1.0.0
 */
/**
 * 分时数据参数对象
 * 
 * @param {}
 *            options 参数对象
 */
function FenshiData(options, fsOptions) {
	this.options = options;
	this.fsOptions = fsOptions;
	this.chart = null;
	var info = 'vm_';
	var code = this.options.code;
	
	if(code.substr(0, 1) == '1' || code.substr(0, 3) == "399" || code.substr(0, 1) == "8") {
		this.fsOptions.needPaintAvgPriceLine = false;
	}
	
	this.needPaintAvgPriceLine = this.fsOptions.needPaintAvgPriceLine;
	
	var firstLetter = code.substr(0, 1);
	if(firstLetter == '6' || firstLetter == '9') {
		info += 'sh_';
	} else if(firstLetter == '0' || firstLetter == '2' || firstLetter == '3') {
		info += 'sz_';
	} else {
		info += 'sh_';
	}
	info += code;
	
	this.url = 'http://qd.10jqka.com.cn/api.php' + '?info=' + info;
			// + '&fq=' + this.options.fq + '&start=' + this.options.starttime;
	this.refresh(this.url, info);
}

var dataObject = {};

FenshiData.prototype = {
	/**
	 * 获取今天日期
	 * 
	 * @return {} 返回今天日期
	 */
	getToday : function() {
		var date = new Date();
		return date.getDay();
	},
	/**
	 * 初始化
	 */
	init : function() {
		var me = this;
		var firstLetter = code.substr(0, 1);
		if(firstLetter == '6' || firstLetter == '9') {
			info += 'sh_';
		} else if(firstLetter == '0' || firstLetter == '2' || firstLetter == '3') {
			info += 'sz_';
		}
		info += code;
		me.refresh(me.url, info);
	},
	stopRefresh : function(t) {
		clearTimeout(t);
	},
	refresh : function(url, info) {
		var me = this;
		var today = me.getToday();
		var script;
		if (today == 6 || today == 1) {
			me.stopRefresh(me.t);
		}
		me.t = setTimeout(function() {
					me.refresh(me.url, info);
				}, me.options.duration);
		if (script) {
			document.body.removeChild(script);
		}
		script = document.createElement('script');
		script.src = url;
		script.onload = function() {
			var _info = info;
			var _data = me.parseData(window[_info]);
			var _mins = _data['mins'];
			var axisMaxAndMin = me.getAxisMaxAndMin(_mins);
			var data;
			if (_mins.length > 0) {
				data = {
					quote : {
						date : _data.day,
						preClose : _data.preClose,
						minute : _mins[_mins.length - 1]['minute'],
						price : _mins[_mins.length - 1]['price'],
						volume : _mins[_mins.length - 1]['volume'],
						average : _mins[_mins.length - 1]['average'],
						minPrice : axisMaxAndMin.yMin,
						maxPrice : axisMaxAndMin.yMax
					},
					mins : _mins
				}
			}

			if (me.options.updateTip) {
				me.fsOptions.updateTip = me.options.updateTip;
			}
			dataObject = data;

			var newScript;
			realUrl = "http://qd.10jqka.com.cn/quote.php?cate=real&type=stock&code="
					+ fsDataOptions.code + "&return=json&callback=realBack";
			if (newScript) {
				document.removeChild(newScript);
			}
			newScript = document.createElement('script');
			newScript.src = realUrl;
			document.body.appendChild(newScript);
		}
		document.body.appendChild(script);
	},
	/**
	 * 格式化时间
	 * 
	 * @param {}
	 *            strTime 需要格式化的时间字符串
	 * @return 格式化后的时间
	 */
	formatTime : function(strTime) {
		if (typeof strTime != 'string' || strTime == null) {
			return;
		}
		var minute = strTime.substr(strTime.length - 2, 2);
		var hour = strTime.substr(0, 2);
		return hour + ':' + minute;
	},
	/**
	 * JSON数据解析
	 * 
	 * @param {}
	 *            strData 服务器返回的数据
	 * @return {}
	 */
	parseData : function(strData) {		
		var todayData = strData.split('|')[1];
		var items = todayData.split('~');
		var date = items[0];
		var preClosePrice = parseFloat(items[1]);
		var dataList = items[2].split(';');
		var data = [];
		
		for (var i = 0; i < dataList.length; i++) {
			var item = dataList[i].split(',');						
			var minData = {
				minute : this.formatTime(item[0]),
				price : isNaN(parseFloat(item[1]))
						? parseFloat(item[2])
						: parseFloat(item[1]),
				average : isNaN(parseFloat(item[2]))
						? parseFloat(item[1])
						: parseFloat(item[2]),
				volume : parseFloat(item[3] / 100),
				preClose : preClosePrice
			};
			data.push(minData);
//			console.log(Number(item[0]) - Number(tempItem[0]));
//			if(Number(item[0]) - Number(tempItem[0]) > 1)
//			{
//				var delta = Number(item[0]) - Number(tempItem[0]);
//				for(var j = 0; j < delta; j++) {
//					data.push(minData);
//				}
//			}
		}
		return {
			day : date,
			preClose : preClosePrice,
			mins : data
		};
	},
	/**
	 * 获取最大最小值
	 * 
	 * @param {}
	 *            data 目标数组
	 * @return {} 返回最大最小值
	 */
	getAxisMaxAndMin : function(data) {
		var me = this;
		var X = [], priceY = [], averageY = [];
		for (var i = 0; i < data.length; ++i) {
			X.push(data[i].minute);
			priceY.push(Number(data[i].price));
			averageY.push(Number(data[i].average));
		}
		var minPrice = Math.min.apply(null, priceY);
		var minAverage = Math.min.apply(null, averageY);
		var maxPrice = Math.max.apply(null, priceY);
		var maxAverage = Math.max.apply(null, averageY);
		if(this.needPaintAvgPriceLine) {
			return {
				xMin : X[0],
				xMax : X[X.length - 1],
				yMin : Math.min(minPrice, minAverage),
				yMax : Math.max(maxPrice, maxAverage)
			};
		} else {
			return {
				xMin : X[0],
				xMax : X[X.length - 1],
				yMin : Math.round(minPrice),
				yMax : Math.round(maxPrice)
			};
		}
		
	},
	/**
	 * 计算前后两点时间差
	 * 
	 * @param {}
	 *            firstTime
	 * @param {}
	 *            secondTime
	 */
	calcTimeDelta : function(firstTime, secondTime) {
		if (!firstTime || !secondTime) {
			return;
		}
		var firstMinute = firstTime.substr(firstTime.length - 2, 2);
		var firstHour = firstTime.substr(0, 2);
		var firstMinutes = parseInt(firstHour) * 60 + parseInt(firstMinute);
		var secondMinute = secondTime.substr(secondTime.length - 2, 2);
		var secondHour = secondTime.substr(0, 2);
		var secondMinutes = parseInt(secondHour) * 60 + parseInt(secondMinute);
		return Math.abs(secondMinutes - firstMinutes);
	},
	/**
	 * 计算缺失的时间
	 * 
	 * @param {}
	 *            firstTime
	 * @param {}
	 *            secondTime
	 */
	calcLastTime : function(lastTime) {
		if (!lastTime) {
			return;
		}
		var minute = parseInt(lastTime.substr(lastTime.length - 2, 2));
		var hour = parseInt(lastTime.substr(0, 2));
		var newMinute = minute + 1;
		if (newMinute >= 60) {
			newMinute -= 60;
			hour += 1;
		}
		hour = hour < 10 ? '0' + hour : hour;
		var newTime = hour.toString() + minute.toString();
		return newTime;
	}
};

function realBack(backData) {
	var itemData = backData.data[fsDataOptions.code];
	dataObject.quote.turnover = parseFloat(itemData['1968584']);
	dataObject.quote.volume = (itemData['13'] / 100).toFixed(0);
	drawFs(dataObject, fsOptions, fsDataOptions);
}
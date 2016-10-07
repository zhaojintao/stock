// @charset "utf-8";
/**
 * 类的描述 K线数据
 * 
 * @Filename kdata.js
 * @author Rocky
 * @Time 2014-2-25 下午01:31:39
 * @Version v1.0.0
 */

/**
 * K线数据对象 K线类型 stock_day 日线 stock_week 周线 stock_month 月线 stock_min5 五分钟
 * stock_min15 15分钟 stock_min30 30分钟 stock_min60 60分钟
 * 
 * @param {}
 *            kOptions k线参数
 */
function klData(kOptions, kChartOptions) {
	this.options = kOptions;
	this.kChartOptions = kChartOptions;
}

/*
 * 
 * day 当前日期 支持K线使用， year 返回数据的年份 格式 Y （2013）， 多年分用逗号分隔 支持stock_day,
 * stock_week,stock_month， min 返回min 之后的最新推送数据 格式 is (0930)， fq 是否复权 默认 为空不复权 （b
 * 向后， q向前）， aid 值为1，返回javascript可解析的字符串。
 */
klData.prototype = {
	/**
	 * 初始化
	 */
	init : function() {
		var me = this;
		var script;
		
		var url = "http://qd.10jqka.com.cn/quote.php?type=stock&cate=history&name=real&code="
				+ me.options.code
				+ "&start="
				+ me.options.start
				+ "&return=json&callback=dataReturn";
		if (script) {
			document.removeChild(script);
		}
		script = document.createElement('script');
		script.src = url;
		document.body.appendChild(script);
	}
};

var dataObject = {};

function dataReturn(callbackData) {
	var dataArr = callbackData.data;
	var result = {};
	var ks = [];
	for (var i = 0; i < dataArr.length; i++) {
		var itemData = dataArr[i];
		var date = String(itemData['date']).replace(/-/g, "");
		// var date = String(itemData['date']);
		
		var item = {
			code : itemData['code'],
			quoteTime : date,
			preClose : parseFloat(itemData['6']),
			open : parseFloat(itemData['7']),
			high : parseFloat(itemData['8']),
			low : parseFloat(itemData['9']),
			close : parseFloat(itemData['11']),
			volume : Math.round(parseInt(itemData['13'] / 100)),
			amount : parseInt(itemData['19']),
			turnover : parseFloat(itemData['1968584'])
		};

		if (ks.length == 0) {
			result.low = item.low;
			result.high = item.high;
		} else {
			result.low = Math.min(result.low, item.low);
			result.high = Math.max(result.high, item.high);
		}
		if(date == '20140520') {
			console.log(item);
		}
		if(item.open > 0) {
			ks.push(item);
		}
	}
	result.ks = ks;
	result.dataLength = result.ks.length;
	result.name = callbackData.info[klDataOptions.code].name;
	dataObject = result;

	var newScript;
	realUrl = "http://qd.10jqka.com.cn/quote.php?cate=real&type=stock&code="
			+ klDataOptions.code + "&return=json&callback=realReturn";
	if (newScript) {
		document.removeChild(newScript);
	}
	newScript = document.createElement('script');
	newScript.src = realUrl;
	document.body.appendChild(newScript);
}

function realReturn(backData) {
	var itemData = backData.data[klDataOptions.code];
	var date = new Date();
	var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0'
			+ (date.getMonth() + 1);
	var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
	var time = date.getFullYear() + month + day;

	var item = {
		code : klDataOptions.code,
		quoteTime : time,
		preClose : parseFloat(itemData['6']),
		open : parseFloat(itemData['7']),
		high : parseFloat(itemData['8']),
		low : parseFloat(itemData['9']),
		close : parseFloat(itemData['11'])
				? parseFloat(itemData['11'])
				: parseFloat(itemData['7']),
		volume : parseInt(itemData['13'] / 100).toFixed(0),
		amount : parseInt(itemData['19']),
		turnover : parseFloat(itemData['1968584'])
	};
	var len = dataObject.ks.length;
	if (dataObject.ks[len - 1].quoteTime != item.quoteTime) {
		dataObject.ks.push(item);
	}
	drawKL(null, dataObject, klOptions);
}

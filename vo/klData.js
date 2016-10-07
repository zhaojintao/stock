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
 * K线数据对象
 * K线类型 	stock_day 日线
 * 			stock_week 周线 
 * 			stock_month 月线 
 * 			stock_min5 五分钟 
 * 			stock_min15 15分钟 
 * 			stock_min30 30分钟 
 * 			stock_min60 60分钟
 * @param {} kOptions k线参数
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
		var isFq = 'fq=' + me.options.fq;
		var klineType = "p=" + me.options.type;
		var year = "year=" + me.options.time;
		var info = "info=k_sz_" + me.options.code + "&aid=1";
		var baseUrl = "http://qd.10jqka.com.cn/api.php";
		var url = baseUrl + "?" + klineType + "&" + isFq + "&" + year + "&"
				+ info;

		if (script) {
			document.removeChild(script);
		}
		script = document.createElement('script');
		script.src = url;
		script.onload = function() {
			var time = me.options.time;
			var arr = time.split(',');
			var kType = (me.options.type);
			var kdata = 'k';
			switch (kType) {
				case 'stock_day' :
					kdata += '_daily_';
					break;
				case 'stock_week' :
					kdata += '_week_';
					break;
				case 'stock_month' :
					kdata += '_month_';
					break;
				case 'stock_min5' :
					kdata += '_5_';
					break;
				case 'stock_min15' :
					kdata += '_15_';
					break;
				case 'stock_min30' :
					kdata += '_30_';
					break;
				case 'stock_min60' :
					kdata += '_60_';
					break;
			}
			kdata += me.options.code;

			if (kType == 'stock_min5' || kType == 'stock_min15'
					|| kType == 'stock_min30' || kType == 'stock_min60') {
				var data = me.parseData(window[kdata]);
				drawKL(null, data, me.kChartOptions);
				return;
			}
			result = '';
			var data;
			if (arr.length == 1) {
				result = result + kdata + '_' + time.substr(2, 2);
				var data = me.parseData(window[result]);
				drawKL(null, data, me.kChartOptions);
				return;
			} else {
				for (var i = 0; i < arr.length; ++i) {
					if (arr.length == 1) {
						result = result + kdata + '_' + arr[i].substr(2, 2);
					} else {
						result = result + kdata + '_' + arr[i].substr(2, 2)
								+ '+';
					}
				}
			}
			result = result.substr(0, result.length - 1);

			var tempArr = result.split('+');
			var c = '';
			for (i = 0; i < tempArr.length; ++i) {
				c += window[tempArr[i]];
			}
			var data = me.parseData(c);
			drawKL(null, data, me.kChartOptions);
		};
		document.body.appendChild(script);
	},
	/**
	 * 解析服务器返回的JSON数据
	 * @param {} strData 需要解析的字符串数据
	 * @return {} K线所需的数据对象
	 */
	parseData : function(strData) {
		var me = this;
		var dataArr = strData.split('|');
		dataArr.pop();
		var result = {};
		var ks = [];
		this.setDataLength(dataArr.length);
		for (var i = 0; i < dataArr.length; i++) {
			var itemData = dataArr[i].split(',');
			var item;
			if (itemData.length == 0) {
				break;
			}
			var preData;
			if (i == 0) {
				item = {
					quoteTime : parseInt(itemData[0]),
					preClose : parseInt(0),
					open : parseFloat(itemData[1]),
					high : parseFloat(itemData[2]),
					low : parseFloat(itemData[3]),
					close : parseFloat(itemData[4]),
					volume : parseInt(itemData[5]),
					amount : parseInt(itemData[6])
				}
			} else {
				preData = dataArr[i - 1].split(',');
				item = {
					quoteTime : parseInt(itemData[0]),
					preClose : parseFloat(preData[4]),
					open : parseFloat(itemData[1]),
					high : parseFloat(itemData[2]),
					low : parseFloat(itemData[3]),
					close : parseFloat(itemData[4]),
					volume : parseInt(itemData[5]),
					amount : parseInt(itemData[6])
				}
			}

			if (ks.length == 0) {
				result.low = item.low;
				result.high = item.high;
			} else {
				result.low = Math.min(result.low, item.low);
				result.high = Math.max(result.high, item.high);
			}
			ks.push(item);
		}
		result.ks = ks;
		result.dataLength = result.ks.length;
		result.updateTip = me.options.updateTip;

		return result;
	},
	/**
	 * 获取数据length
	 * @return {} length
	 */
	getDataLength : function() {
		return this.dataLength;
	},
	/**
	 * 设置数据length
	 * @param {} len 
	 */
	setDataLength : function(len) {
		this.dataLength = len;
	}
};
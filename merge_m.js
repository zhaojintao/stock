// @charset "utf-8";
/**
 * 生成文件
 * @param {} code 代码段
 * @param {} filename 文件名
 */
function translate2unicode(code, filename) {
	fs.writeFileSync(filename, unicode(code), 'utf-8');
	console.log(filename + '文件生成成功');
}

/**
 * 转化成unicode
 * @param {} text 要转化的文本
 * @return {}
 */
function unicode(text) {
	var reg = /[\u4e00-\u9fa5]/g, matches = text.match(reg) || [];
	for (var i = 0; i < matches.length; i++) {
		text = text.replace(matches[i], String(escape(matches[i])).replace('%',
						'\\'));
	}
	return text;
}

var filesList = [	
					"utils/Util.js", 
					"utils/GlobalFunction.js",
					"common/LinePainter.js",
					"common/Painter.js",
					"common/VolumePainter.js",
					"common/xAxis.js", 
					"common/yAxis.js",
					"common/Tip_m.js",
					"common/CrossLines.js",
					"common/Slider_m.js", 					
					"views/FenshiChart_m.js",
					"views/klineChart_m.js",
					"events/ChartTouchEvent.js"
				];
var dataFiles = [
					"views/Fenshi_m.js",
					"vo/FenshiData.js",
					"views/kline_m.js",
					"vo/KLineData.js",
					"vo/config.js"
				];
var UglifyJs = require('uglify-js');
var result = UglifyJs.minify(filesList);
var data = UglifyJs.minify(dataFiles);
var fs = require('fs');
var charsetHead = '//@charset "utf-8";\n';
var code = charsetHead + result.code;
var datacode = charsetHead + data.code;
translate2unicode(code, 'js/stock_m.js');
translate2unicode(datacode, 'js/stockdata_m.js');
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

var filesList = ["utils/Util.js", 
				"utils/GlobalFunction.js",
				"common/Painter.js", 
				"common/xAxis.js", 
				"common/yAxis.js",
				"common/Slider.js", 
				"common/CrossLines.js", 
				"common/Tip.js",
				"events/ChartEvent.js"
				];
var dataFiles = ["vo/klData.js", 
				"views/klineChart.js", 
				"views/kline.js"];
var UglifyJs = require('uglify-js');
var result = UglifyJs.minify(filesList);
var data = UglifyJs.minify(dataFiles);
var fs = require('fs');
var charsetHead = '//@charset "utf-8";\n';
var code = charsetHead + result.code;
var datacode = charsetHead + data.code;
translate2unicode(code, 'all/kline.js');
translate2unicode(datacode, 'all/kdata.js');
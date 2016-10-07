// @charset "utf-8";
/**
 * 类的描述 分时曲线图表数据及其配置参数
 * 
 * @Filename Fenshi.js
 * @author Rocky
 * @Time 2014-3-25 上午10:08:28
 * @Version v1.0.0
 */


var fenshiPainter;

function drawFs(data, fsOptions, fsDataOptions) {
	var fs;
	if (!fenshiPainter) {
		fs = new FenshiChart(fsOptions, fsDataOptions);
	}
	fs.paint(data);
}

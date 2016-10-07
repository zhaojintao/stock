// @charset "utf-8";
/**
 * 类的描述 分时曲线图表数据及其配置参数
 * 
 * @Filename Fenshi.js
 * @author Rocky
 * @Time 2014-3-25 上午10:08:28
 * @Version v1.0.0
 */

function drawFs(data, dataRanges) {
	
	var fs;
	if (!fs) {
		fs = new FenshiChart("canvasFS", fsOptions);
	}
	fs.paint(data);
}

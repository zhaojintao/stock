// @charset "utf-8";
/*******************************************************************************
 * @author Rocky
 * @description K线实例化
 * @version 1.0.0
 * @type
 */

var painter;
function drawKL(ranges, data, kChartOptions) {
	if (!painter) {
		var kl = new kLine(kChartOptions);
		painter = new Painter('canvasKL', kl, data);
	}
	painter.dataRanges = ranges;
	painter.paint();
}
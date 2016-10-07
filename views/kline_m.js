// @charset "utf-8";
/*******************************************************************************
 * @author Rocky
 * @description K线实例化
 * @version 1.0.0
 * @type
 */


var painter;

function drawKL(ranges, data, klOptions) {
	
	if (!painter) {
		var kl = new kLine(klOptions);
		painter = new Painter(klOptions.canvas.id, kl, data);
	}
	painter.dataRanges = ranges;
	painter.paint();
}
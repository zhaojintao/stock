// @charset "utf-8";
/**
 * 类的描述 X轴绘制
 * 
 * @Filename xAxis.js
 * @author Rocky
 * @Time 2014-3-25 下午03:53:42
 * @Version v1.0.0
 */
/**
 * Y轴 参数说明 
 */
 /**
  * Y轴构造函数
  * @param {} scaleOptions 参数列表对象 
  * scaleOptions : { 
  * 				font: '11px Arial', 
  * 				region: { x: 0, y: 47, height: 320, width: 55}, 
  * 				color: 'black', 
  * 				align:'right', 
  * 				fontHeight:8,
  * 				textBaseline:'top'
  * 				}
  */
function yAxis(scaleOptions) {
	this.scaleOptions = scaleOptions;
}

yAxis.prototype = {
	/**
	 * 初始化执行画笔
	 * @param {} painter 执行绘制对象
	 */
	initialize : function(painter) {
		painter.scaleOptions = this.scaleOptions;
	},
	/**
	 * 开始绘制
	 */
	start : function() {
		var ctx = this.ctx;
		ctx.save();
		if (typeof this.scaleOptions.color == 'string') {
			ctx.fillStyle = this.scaleOptions.color;
		}
		ctx.font = this.scaleOptions.font;
		if (this.scaleOptions.textBaseline) {
			ctx.textBaseline = this.scaleOptions.textBaseline;
		}
		ctx.translate(this.scaleOptions.region.x + 0.5, this.scaleOptions.region.y + 0.5);
	},
	/**
	 * 绘制结束
	 */
	end : function() {
		this.ctx.restore();
	},
	/**
	 *  获取X坐标
	 * @param {} i 索引
	 * @return {Number} X坐标 
	 */
	getX : function(i) {
		if (this.scaleOptions.align == 'left') {
			return 0;
		}
		// this.scaleOption.align == 'right'

		var w = this.ctx.measureText(this.data[i]).width;
		return this.scaleOptions.region.width - w;
	},
	/**
	 * 获取Y轴坐标
	 * @param {} i 索引
	 * @return {Number} Y坐标
	 */
	getY : function(i) {
		if (i == 0) {
			return 0;
		}
		if (i == this.data.length - 1) {
			return this.scaleOptions.region.height - this.scaleOptions.fontHeight;
		}
		return this.scaleOptions.region.height * i / (this.data.length - 1) - this.scaleOptions.fontHeight / 2;
	},
	/**
	 * 绘制每个item
	 * @param {} i 索引
	 * @param {} x X坐标
	 * @param {} y Y坐标
	 */
	paintItem : function(i, x, y) {
		if (typeof this.scaleOptions.color == 'function') {
			this.ctx.fillStyle = this.scaleOptions.color(this.data[i]);
		} else if (typeof this.scaleOptions.color == 'string') {
			this.ctx.fillStyle = this.scaleOptions.color;
		}
		var text = this.data[i] >= 1000 ?  Number(this.data[i]).toFixed(0) : this.data[i];
		this.ctx.fillText(text, x, y);
	}
};

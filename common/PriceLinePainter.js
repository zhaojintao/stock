// @charset "utf-8";
/**
 * 类的描述 价格线绘制
 * 
 * @Filename PriceLinePainter.js
 * @author Rocky
 * @Time 2014-4-10 上午10:53:42
 * @Version v1.0.0
 */
 /**
  * 绘制分时成交量
  * @param {} options 参数对象
  */
function PriceLinePainter(options) {
	this.options = options;
}

PriceLinePainter.prototype = {
/**
	 * 初始化
	 * @param {} painter 画线对象
	 */
	initialize : function(painter) {
		painter.options = this.options;
		painter.implement = this;
	},
	/**
	 * 画线开始
	 */
	start : function() {
		var me = this;
		var ctx = me.ctx;
		var options = me.options;
		var region = options.region;
		ctx.save();
		ctx.translate(region.x, region.y + region.height / 2);
		
		var positiveDiff = Math.abs(options.middleValue - options.maxPrice);
		var negativeDiff = Math.abs(options.middleValue - options.minPrice);
		var maxDiff = Math.max(positiveDiff, negativeDiff);
		this.maxDiff = maxDiff * 1.1;
		ctx.beginPath();
		ctx.strokeStyle = options.lineColor;
	},
	/**
	 * 画线结束
	 */
	end : function() {
		this.ctx.stroke();
		this.ctx.restore();
	},
	/**
	 * 绘制具体某一点的曲线
	 * @param {} index 数据索引
	 * @param {} x x坐标
	 * @param {} y y坐标
	 */
	paintItem : function(index, x, y) {
		var ctx = this.ctx;
		ctx.lineWidth = this.options.lineWidth;
		if(index == 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	},
	/**
	 * 获取曲线点个数
	 * @return {}
	 */
	getDataLength : function() {
		return this.options.getDataLength.call(this);
	},
	/**
	 * 获取X坐标
	 * @param {} i 曲线绘制点索引
	 * @return {}
	 */
	getX : function(i) {
		return Math.floor(i * (this.options.region.width / this.options.totalDotsCount)) + 0.5;
	},
	/**
	 * 获取Y坐标
	 * @param {} i 曲线绘制点索引
	 * @return {}
	 */
	getY : function(i) {
		var options = this.options;
		var diff = options.getItemValue(this.data.items[i]) - options.middleValue;
		var scale = diff / this.maxDiff;
		var y = scale * options.region.height / 2;
		return -y ;
	}
};
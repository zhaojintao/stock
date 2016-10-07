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
 * 
 * options:{ font:'11px Arial', color:black,
 * region:{x:5,y:130,width:180,height:20} }
 */
 /**
  * x轴构造函数
  * @param {} xOptions X轴所需参数 xOptions:{ 
  * 								font:'11px Arial', 
  * 								color:black,
  * 								region:{x:5,y:130,width:180,height:20} 
  * 							}
  * 
  */
function xAxis(xOptions) {
	this.xOptions = xOptions;
}

xAxis.prototype = {
	/**
	 * 初始化执行画笔
	 * @param {} painter 执行绘制对象
	 */
	initialize : function(painter) {
		painter.options = this.xOptions;
	},
	/**
	 * 开始绘制
	 */
	start : function() {
		var ctx = this.ctx;
		ctx.save();
		if (typeof this.options.color == 'string') {
			ctx.fillStyle = this.options.color;
		}
		ctx.font = this.options.font;
		if (this.options.textBaseline) {
			ctx.textBaseline = this.options.textBaseline;
		}
		ctx.translate(this.options.region.x + 0.5, this.options.region.y + 0.5);
	},
	/**
	 * 获取Y坐标
	 * @return {Number}
	 */
	getY : function() {
		return 0;
	},
	/**
	 * 获取X坐标
	 * @param {} i 点索引
	 * @return {Number}
	 */
	getX : function(i) {
		if (i == 0) {
			return 0;
		}
		var w = this.ctx.measureText(this.data[i]).width;
		if (i == this.data.length - 1) {
			return this.options.region.width - w;
		}
		return this.options.region.width * i / (this.data.length - 1) - w / 2;
	},
	/**
	 * 绘制每个item
	 * @param {} i 索引
	 * @param {} x X坐标
	 * @param {} y Y坐标
	 */
	paintItem : function(i, x, y) {
		this.ctx.fillText(this.data[i], x, y);
	},
	/**
	 * 绘制结束
	 */
	end : function() {
		this.ctx.restore();
	}
};
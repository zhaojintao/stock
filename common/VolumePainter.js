// @charset "utf-8";
/**
 * 类的描述 成交量绘制
 * 
 * @Filename VolumePainter.js
 * @author Rocky
 * @Time 2014-3-25 下午03:53:42
 * @Version v1.0.0
 */
 /**
  * 绘制分时成交量
  * @param {} options 参数对象
  */
function VolumePainter(options) {
	this.options = options;

	var w = options.region.width / options.totalDotsCount;
	this.barWidth = 0.5 * w;
	this.spaceWidth = 0.5 * w;

	if (this.barWidth * options.totalDotsCount > options.region.width) {
		this.barWidth = Math.floor(options.region.width / options.totalDotsCount) + 0.5;
	}
}

VolumePainter.prototype = {
	/**
	 * 初始化
	 * @param {} painter 执行绘制对象
	 */
	initialize : function(painter) {
		painter.options = this.options;
		painter.barWidth = this.barWidth;
		painter.spaceWidth = this.spaceWidth;
	},
	/**
	 * 获取数据长度
	 * @return {}
	 */
	getDataLength : function() {
		return this.options.getDataLength.call(this);
	},
	/**
	 * 获取X坐标
	 * @param {} i 索引点
	 * @return {} X坐标
	 */
	getX : function(i) {
		return Math.floor(this.options.region.x + i * (this.barWidth + this.spaceWidth)) + 0.5;
	},
	
	/**
	 * 开始绘制
	 */
	start : function() {
		var ctx = this.ctx;
		var options = this.options;
		var region = options.region;
		ctx.save();
		// 转换坐标
//		ctx.translate(region.x + 0.5, 0);
		var maxVolume = 0;
		this.data.items.each(function(item) {
					maxVolume = Math.max(maxVolume, item.volume);
				});
		this.maxVolume = maxVolume;// * 1.1;
	},
	/**
	 * 绘制结束
	 */
	end : function() {
		this.ctx.restore();
	},
	/**
	 * 获取Y轴坐标
	 * @param {} i 索引点
	 * @return {} Y坐标
	 */
	getY : function(i) {
		var diff = this.options.region.y + (this.maxVolume - this.data.items[i].volume) * this.options.region.height / this.maxVolume;
		return Math.floor(diff) - 0.5;
	},
	/**
	 * 绘制item
	 * @param {} i 索引
	 * @param {} x x坐标
	 * @param {} y y坐标
	 */
	paintItem : function(i, x, y) {
		var ctx = this.ctx;
		var color;
		if(i == 0) {
			if (this.data.items[i].price >= this.data.items[i].preClose) {
				color = window.riseColor;
			} else if (this.data.items[i].price < this.data.items[i].preClose) {
				color = window.fallColor;
			} else {
				color = window.normalColor;
			}
		} else {
			if (this.data.items[i].price >= this.data.items[i - 1].price) {
				color = window.riseColor;
			} else if (this.data.items[i].price < this.data.items[i - 1].price) {
				color = window.fallColor;
			} else {
				color = window.normalColor;
			}
		}
		ctx.fillStyle = color;
		ctx.beginPath();
//		console.log(x, y, this.barWidth, this.options.region.y, this.options.region.width);
		ctx.rect(x, y, this.barWidth, this.options.region.y + this.options.region.height - y);
		ctx.fill();
	}
};
// @charset "utf-8";
/**
 * 类的描述 TODO
 * 
 * @Filename Painter.js
 * @author Rocky
 * @Time 2014-2-25 下午02:04:17
 * @Version v1.0.0
 */

/**
 * 绘制类
 * @param {} canvasId 画布对象ID
 * @param {} paintImplement 绘制执行者
 * @param {} data 绘制所需数据
 */
function Painter(canvasId, paintImplement, data) {
	this.canvas = $id(canvasId);
	if (!this.canvas.getContext) {
		return;
	}
	this.ctx = this.canvas.getContext('2d');
	this.data = data;
	this.paintImplement = paintImplement;
	this.width = this.canvas.width;
	this.height = this.canvas.height;
}

Painter.prototype = {
	/**
	 * 画图函数
	 */
	paint : function() {
		var ctx = this.ctx;
		var pctx = this.paintImplement;

		if (typeof pctx.initialize == 'function') {
			pctx.initialize(this);
		}
		if (pctx.start) {
			pctx.start.call(this);
		}
		if (typeof pctx.paintItems == 'function') {
			pctx.paintItems.call(this);
		} else {
			var dataLength;
			if (this.data.items) {
				dataLength = this.data.items.length;
			} else {
				dataLength = this.data.length;
			}

			for (var index = 0; index < dataLength; index++) {
				var x = pctx.getX ? pctx.getX.call(this, index) : undefined;
				var y = pctx.getY ? pctx.getY.call(this, index) : undefined;
				pctx.paintItem.call(this, index, x, y);
			}
		}
		if (pctx.end) {
			pctx.end.call(this, this.data);
		}
	},
	/**
	 * 绘制水平线
	 * @param {} color 线的颜色
	 * @param {} x0 起始点x坐标
	 * @param {} y0 起始点y坐标
	 * @param {} w  水平线宽度
	 * @param {} lineWidth 线宽
	 * @param {} lineStyle 水平线风格：虚线或实线
	 */
	drawHLine : function(color, x0, y0, w, lineWidth, lineStyle) {
		var ctx = this.ctx;
        ctx.strokeStyle = color;
        if (y0 * 10 % 10 == 0) y0 += .5;
        if (lineStyle && lineStyle == 'dashed') {
            var width = 0;
            do {
                this.drawHLine(color, width, y0, dashSize, lineWidth);
                width += dashSize * 2;
            } while (width < w);
        }
        else {
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x0 + w, y0);
            ctx.stroke();
        }
	},
	/**
	 * 绘制垂直线
	 * @param {} color 	线的颜色
	 * @param {} x0		起始点x坐标
	 * @param {} y0		起始点y坐标
	 * @param {} h 		垂直线高度
	 * @param {} lineWidth 线宽
	 * @param {} lineStyle 垂直线风格：虚线或实线
	 */
	drawVLine : function(color, x0, y0, h, lineWidth, lineStyle) {
		var ctx = this.ctx;
        ctx.strokeStyle = color;
        if (x0 * 10 % 10 == 0) x0 += .5;
        if (lineStyle && lineStyle == 'dashed') {
            var height = 0;
            do {
                this.drawVLine(color, x0, height, dashSize, lineWidth);
                height += dashSize * 2;
            } while (height < h);
        }
        else {
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x0, y0 + h);
            ctx.stroke();
        }
	},
	/**
	 * 设置数据
	 * @param {} data 画线所需data
	 */
	setData : function(data) {
		this.data = data;
	},
	/**
	 * 设置绘制执行对象
	 * @param {} implement 执行对象 
	 */
	setPaintImplement : function(implement) {
		this.paintImplement = implement;
	}
}
// @charset "utf-8";
/**
 * 类的描述 TODO
 * 
 * @Filename CrossLines.js
 * @author Rocky
 * @Time 2014-3-21 下午03:27:39
 * @Version v1.0.0
 */

/**
 * 十字线构造函数
 * 
 * @param {}
 *            options 十字线所需参数对象
 */
function CrossLines(options) {
	this.updateOptions(options);
}

CrossLines.prototype = {
	/**
	 * 更新options
	 * 
	 * @method
	 * @param {}
	 *            options 参数对象
	 */
	updateOptions : function(options) {
		this.options = options;
		this.canvas = options.canvas;
		this.horizontalRange = options.horizontalRange;
		this.verticalRange = options.verticalRange;
		this.canvasPosition = getPageCoord(this.canvas);
		this.crossPoint = options.points.crossPoint;
		this.color = options.crossLinesColor;
		this.lineWidth = options.crossLineWidth || '1px';
		this.relative = options.relative;
	},
	/**
	 * 移除十字线
	 */
	removeCrossLines : function() {
		var canvas = this.canvas;
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	},
	/**
	 * 更新十字线交叉点
	 * 
	 * @param {} point 十字线光标
	 */
	updateCrossPoint : function(point) {
		this.crossPoint = point;
		this.drawCrossLines();
	},
	/**
	 * 绘制十字线光标
	 */
	drawCrossLines : function() {
		var me = this;
		var canvas = me.canvas;
		var horizontalRange = me.horizontalRange;
		var verticalRange = me.verticalRange;
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.translate(canvas.x, canvas.y);
		if(me.options.points.averagePoint) {
			me._drawCircle(ctx, me.options.points.averagePoint);
		}
		if(me.options.points.pricePoint) {
			me._drawCircle(ctx, me.options.points.pricePoint);
		}
		if(me.options.points.volumePoint) {
			me._drawCircle(ctx, me.options.points.volumePoint);
		}
		
		ctx.strokeStyle = me.color;
		ctx.lineWidth = me.lineWidth;
		ctx.beginPath();
		// 画十字线之水平线
		ctx.moveTo(Math.floor(horizontalRange.x1) + 0.5, Math.floor(this.crossPoint.y) + 0.5);
		ctx.lineTo(Math.floor(horizontalRange.x2) + 0.5, Math.floor(this.crossPoint.y) + 0.5);
		var leftOption, rightOption, bottomOption;
		if (me.options.leftTipSize) {
			leftOption = {
				ctx : ctx,
				posType : 'left',
				fillStyle : 'rgb(90, 90, 90)',
				strokeStyle : 'rgb(255, 255, 255)',
				font : font + 'px Arial',
				text : me.crossPoint.text ? me.crossPoint.text : me._getRelativeY(me.crossPoint.y),
				tfHeight : me.options.leftTipSize.height,
				tfWidth : me.options.leftTipSize.width,
				textBaseline : 'middle',
				devicePixelRatio : me.options.devicePixelRatio,
				point : {
					x : Math.floor(horizontalRange.x1) + 0.5,
					y : Math.floor(me.crossPoint.y) + 0.5
				}
			};
			me._drawTextField(leftOption);
		}
		
		if(me.options.rightTipSize) {
			rightOption = {
			ctx : ctx,
			posType : 'right',
			fillStyle : 'rgb(90, 90, 90)',
			strokeStyle : 'rgb(255, 255, 255)',
			font : font + 'px Arial',
			text : me._getPercent(me.crossPoint.y),
			tfHeight : me.options.rightTipSize.height,
			tfWidth : me.options.rightTipSize.width,
			textBaseline : 'middle',
				devicePixelRatio : me.options.devicePixelRatio,
				point : {
					x : horizontalRange.x2,
					y : Math.floor(this.crossPoint.y) + 0.5
				}
			};
			me._drawTextField(rightOption);
		}
		
		// 画十字线之垂直线
		ctx.moveTo(Math.floor(this.crossPoint.x) + 0.5, verticalRange.y1 + me.options.bottomTipSize.height);
		ctx.lineTo(Math.floor(this.crossPoint.x) + 0.5, verticalRange.y2);
		ctx.moveTo(Math.floor(this.crossPoint.x) + 0.5, verticalRange.y3);
		ctx.lineTo(Math.floor(this.crossPoint.x) + 0.5, verticalRange.y4);
		
		if(me.options.bottomTipSize) {
			bottomOption = {
			ctx : ctx,
			posType : 'bottom',
			fillStyle : 'rgb(90, 90, 90)',
			strokeStyle : 'rgb(255, 255, 255)',
			font : font + 'px Arial',
			text : me.options.points.timeText,
			tfHeight : me.options.bottomTipSize.height,
			tfWidth : me.options.bottomTipSize.width,
			textBaseline : 'middle',
				devicePixelRatio : me.options.devicePixelRatio,
				point : {
					x : Math.floor(this.crossPoint.x) + 0.5,
					y : 0
				}
			};
			
			me._drawTextField(bottomOption);
		}		
		
		ctx.closePath();
		ctx.stroke();
	},
	/**
	 * 
	 * ctx, posType, fillStyle, strokeStyle, font, text, textBaseline, point
	 * @param {} tipOptions
	 */
	_drawTextField : function(tipOptions) {		
		var tfHeight = tipOptions.tfHeight;
		var tfWidth = tipOptions.tfWidth;
		var startX, startY, textX, rectY;
		var ctx = tipOptions.ctx;
		ctx.save();
		ctx.fillStyle = tipOptions.fillStyle;
		ctx.strokeStyle = tipOptions.strokeStyle;
		ctx.textBaseline = tipOptions.textBaseline;
		ctx.font = tipOptions.font;
		var posType = tipOptions.posType;
		var textWidth = ctx.measureText(tipOptions.text).width;
		switch(posType) {
			case 'left':
				startX = tipOptions.point.x - tfWidth;
				textX = tipOptions.point.x - textWidth;
				startY = tipOptions.point.y;
				rectY = tipOptions.point.y -  tfHeight / 2;
				break;
			case 'right':			
				startX = tipOptions.point.x + 3;
				textX = startX;
				startY = tipOptions.point.y;
				rectY = tipOptions.point.y -  tfHeight / 2;
				break;
			case 'bottom':		
				if(this.canvas.width - tipOptions.point.x <= tfWidth / 2) {
					startX = this.canvas.width - tfWidth;
					textX = this.canvas.width - textWidth;
				} else {
					startX = tipOptions.point.x - tfWidth / 2;
					textX = tipOptions.point.x - textWidth / 2;
				}				
				startY = tipOptions.point.y + tfHeight / 2;
				rectY = tipOptions.point.y;
				break;
			default:
				break;
		}
		
		ctx.rect(startX, rectY, tfWidth, tfHeight);
		ctx.fillRect(startX, rectY, tfWidth, tfHeight);
		ctx.fillStyle = tipOptions.strokeStyle;
		ctx.fillText(tipOptions.text, textX, startY);
		ctx.restore();
	},
	_getRelativeY : function (y) {
		var rate = (this.relative.middleY - y) / this.relative.middleY;
		var price = this.relative.preClose + this.relative.maxDiff * rate;
		return parseFloat(price).toFixed(2);
    },
    _getPercent : function(y) {
    	var rate = (this.relative.middleY - y) / this.relative.middleY;
    	var preClose = this.relative.preClose;
		var price = preClose + this.relative.maxDiff * rate;
		var percent = (price - preClose) * 100 / preClose;
		return percent.toFixed(2) + '%';
    },
    _drawCircle : function(ctx, point) {
    	ctx.save();
    	ctx.strokeStyle = point.color;
    	ctx.fillStyle = point.color;
    	ctx.beginPath();
    	ctx.arc(point.x, point.y, 3, 0, Math.PI * 2, false);
    	ctx.closePath();
    	ctx.fill();
    	ctx.restore();
    }
}
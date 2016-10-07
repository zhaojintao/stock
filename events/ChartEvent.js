// @charset "utf-8";
/**
 * 类的描述 十字线及Tip框管理类
 * 
 * @Filename KLineEvent.js
 * @author Rocky
 * @Time 2014-2-25 下午02:02:54
 * @Version v1.0.0
 */

/**
 * 
 * @param {} canvas 画布
 * @param {} options: { getCrossPoint:function(ev){return {x:x,y:y};},
 *            triggerEventRanges:{}, 
 *            tipOptions{getTipHtml:function(ev){} },
 *            crossLinesColor:'red' 
 *            }
 */
function ChartEvent(canvas, options) {
	this.canvas = canvas;
	this.options = options;
}

ChartEvent.prototype = {
	_removeCrossLinesAndTip : function() {
		var me = this;
		if (me.tip) {
			me.tip.hide();
		}
		if (me.crossLines) {
			me.crossLines.removeCrossLines();
		}
	},
	updateOptions : function(options) {
		this.options = options;
	},
	_onMouseMove : function(ev) {
		var ev = ev || event;
		ev = getOffset(ev);
		var me = this;
		var canvas = me.canvas;
		var options = me.options;
		var canvasPosition = getPageCoord(canvas);
		var range = options.triggerEventRanges;

		if (ev.offsetX < range.chartRegion.x || ev.offsetX > range.chartRegion.x + range.width
				|| ev.offsetY < range.chartRegion.y 
				|| ev.offsetY > range.chartRegion.y + range.chartRegion.height) {
			me._removeCrossLinesAndTip();
			return;
		}
		var crossPoint = options.getCrossPoint(ev);
		var crossLinesOption = {
			relative : options.relative,
			points : crossPoint,
			horizontalRange : {
				x1 : range.chartRegion.x ,
				x2 : (range.chartRegion.x + range.chartRegion.width)
			},
			verticalRange : {
				y1 : range.chartRegion.y,
				y2 : (range.chartRegion.y + range.chartRegion.height) ,
				y3 : range.volumeRegion.y ,
				y4 : (range.volumeRegion.y + range.volumeRegion.height)
			},
			crossLinesColor : options.crossLinesColor,
			crossLineWidth : options.crossLineWidth,
			leftTipSize : options.leftTipSize,
			rightTipSize : options.rightTipSize,
			bottomTipSize : options.bottomTipSize,
			canvas : canvas
		};

		if (!me.crossLines) {
			var crossLines = new CrossLines(crossLinesOption);
			me.crossLines = crossLines;
		} else {
			me.crossLines.updateOptions(crossLinesOption);
		}
		me.crossLines.drawCrossLines();
		var points = options.getCrossPoint(ev);
		if (options.tipOptions) {
			var tipOp = options.tipOptions;
			if (!me.tip) {
				var tipOptions = {
					lineType : tipOp.lineType,
					position : tipOp.position,
					region : tipOp.region,
					crossPoint : points.crossPoint,
					size : tipOp.size,
					opacity : tipOp.opacity,
					cssClass : tipOp.cssClass,
					canvas : canvas,
					innerHTML : tipOp.getTipHtml(ev)
				};
				var tip = new Tip(tipOptions);
				me.tip = tip;
			}
			me.tip.show(points.crossPoint, tipOp.getTipHtml(ev));
		}
		
	},
	_onMouseOut : function(ev) {
		ev = ev || event;
		ev = getOffset(ev);
		var me = this;
		var range = me.options.triggerEventRanges;
		if (ev.offsetX <= range.x || ev.offsetX >= range.x + range.width
				|| ev.offsetY <= range.y
				|| ev.offsetY >= range.y + range.height) {
			me._removeCrossLinesAndTip();
			return;
		}
		var toEle = ev.toElement || ev.relatedTarget || ev.target;
		if (toEle) {
			me._removeCrossLinesAndTip();
		}
	},
	addCrossLinesAndTipEvents : function() {
		var me = this;
		var canvas = this.canvas;
		var options = this.options;
		var canvasPosition = getPageCoord(canvas);
		if (canvas.addCrossLinesAndTipEvents == true) {
			return;
		}
		canvas.addCrossLinesAndTipEvents = true;

		addEvent(canvas, 'mousemove', function(ev) {
					me._onMouseMove(ev);
				});
		addEvent(canvas, 'mouseout', function(ev) {
					me._onMouseOut(ev);
				});
		if (typeof options.onClick == 'function') {
			addEvent(canvas, 'click', options.onClick);
		}
	}
}

function addCrossLinesAndTipEvents(canvas, options) {
	if (!canvas.lineEventInstance) {
		var lEvent = new ChartEvent(canvas, options);
		canvas.lineEventInstance = lEvent;
		canvas.lineEventInstance.addCrossLinesAndTipEvents();
	}
}

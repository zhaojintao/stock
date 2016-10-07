// @charset "utf-8";
/**
 * 类的描述 K线触摸设备下十字线及Tip管理类
 * 
 * @Filename ChartTouchEvent.js
 * @author Rocky
 * @Time 2014-3-12 下午02:43:48
 * @Version v1.0.0
 */

/**
 * 
 * @param {}
 *            canvas 画布
 * @param {}
 *            options: { getCrossPoint:function(ev){return {x:x,y:y};},
 *            triggerEventRanges:{}, tipOptions{getTipHtml:function(ev){} },
 *            crossLinesColor:'red' }
 */
function ChartTouchEvent(canvas, options) {
	this.canvas = canvas;
	this.options = options;
}

/**
 * 阻止事件冒泡并取消默认行为
 * 
 * @param {}
 *            e
 */
function cancleBubbleAndPreventDefault(e) {
	if (e && e.preventDefault) {
		e.preventDefault();
	}
	// 阻止事件冒泡
	e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
}

ChartTouchEvent.prototype = {
	setData : function(data) {
		this.data = data;
	},
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
	_touchStart : function(ev) {
		ev = ev || event;
		cancleBubbleAndPreventDefault(ev);
		this.touchStartTime = new Date();
	},
	_touchMove : function(ev) {
		ev = ev || event;
		cancleBubbleAndPreventDefault(ev);
		var canvas = this.canvas;
		var relativePoint = getPageCoord(canvas);
		var fixedEvt = setTouchEventOffsetPosition(ev, relativePoint);
		this._onTouchMove(fixedEvt);
	},
	_touchEnd : function(ev) {
		ev = ev || event;
		cancleBubbleAndPreventDefault(ev);
		var canvas = this.canvas;
		var relativePoint = getPageCoord(canvas);
		var fixedEvt = setTouchEventOffsetPosition(ev, relativePoint);
//		this._removeCrossLinesAndTip();
		var time = new Date();
		var delta = time.getTime() - this.touchStartTime.getTime();
		if (delta < 200) {
			if (typeof this.options.onClick == 'function') {
			}
		}
	},
	_onClick : function(ev) {
		var ev = ev || event;
		ev = getOffset(ev);
		var me = this;
		var options = me.options;
		var range = options.triggerEventRanges;
		if (ev.offsetX < range.chartRegion.x || ev.offsetX > range.chartRegion.x + range.width
				|| ev.offsetY < range.chartRegion.y 
				|| ev.offsetY > range.volumeRegion.y + range.volumeRegion.height) {
			me._removeCrossLinesAndTip();
			return;
		}
	},
	_onTouchMove : function(ev) {		
		var ev = ev || event;
		var me = this;
		var canvas = me.canvas;
		var options = me.options;
		var canvasPosition = getPageCoord(canvas);
		var range = options.triggerEventRanges;
		
		if (ev.offsetX < range.chartRegion.x || ev.offsetX > range.chartRegion.x + range.width
				|| ev.offsetY < range.chartRegion.y 
				|| ev.offsetY > range.volumeRegion.y + range.volumeRegion.height) {
			me._removeCrossLinesAndTip();
			return;
		}
		var crossPoint = options.getCrossPoint(ev, this.data);
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
			canvas : canvas,
			devicePixelRatio : devicePixelRatio
		};
		if (!me.crossLines) {
			var crossLines = new CrossLines(crossLinesOption);
			me.crossLines = crossLines;
		} else {
			me.crossLines.updateOptions(crossLinesOption);
		}
//		me.crossLines.updateOptions(crossLinesOption);
		me.crossLines.updateCrossPoint(crossPoint.crossPoint);

		if (options.tipOptions) {
			var tipOp = options.tipOptions;
			if (!me.tip) {
				var tipOptions = {
					position : tipOp.position,
					region : tipOp.region,
					crossPoint : crossPoint,
					size : tipOp.size,
					opacity : tipOp.opacity,
					cssClass : tipOp.cssClass,
					canvas : canvas,
					innerHTML : tipOp.getTipHtml(ev, this.data)
				};
				var tip = new Tip(tipOptions);
				me.tip = tip;
			}
			me.tip.show(crossPoint, tipOp.getTipHtml(ev, this.data));
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

		var touchable = isTouchDevice();
		if (touchable) {
			addEvent(canvas, 'touchstart', function(ev) {
						me._touchStart(ev);
					});
			addEvent(canvas, 'touchmove', function(ev) {
						me._touchMove(ev);
					});
			addEvent(canvas, 'touchend', function(ev) {
						me._touchEnd(ev);
					});
			addEvent(document.body, 'click', function(ev) {
					me._onClick(ev);
				});
		}
	}
}

function addCrossLinesAndTipEvents(canvas, options, data) {
	if (!canvas.lineEventInstance) {
		var lEvent = new ChartTouchEvent(canvas, options);
		canvas.lineEventInstance = lEvent;
		canvas.lineEventInstance.addCrossLinesAndTipEvents();
	}
	canvas.lineEventInstance.setData(data);
}

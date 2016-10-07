// @charset "utf-8";
function convertDate(t, i) {
	var e = Math.ceil(t / 1e4) - 1, n = t % 100, o = (Math.ceil(t / 100) - 1)
			% 100, s = new Date;
	if (s.setYear(e), s.setMonth(o - 1), s.setDate(n), 10 > o && (o = "0" + o), 10 > n
			&& (n = "0" + n), i) {
		var a = ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94",
				"\u516D"];
		return e + "-" + o + "-" + n + "，" + a[s.getDay()]
	}
	return e + "-" + o + "-" + n
}
function calcAxisValues(t, i, e, n) {
	var o = t - i, s = o / (e - 1), a = [];
	"undefined" == typeof n && (n = toMoney);
	for (var r = 0; e > r; ++r) {
		var h = toMoney(t - s * r);
		h >= 1e4 && 1e6 >= h ? h = h / 1e4 + "\u4E07" : h >= 1e6 && 1e8 >= h
				&& (h = h / 1e6 + "\u767E\u4E07"), a.push(h)
	}
	return a
}
function toMoney(t) {
	return isNaN(t) ? void 0 : t.toFixed(2)
}
function calcMAPrices(t, i, e, n) {
	for (var o = new Array, s = i; i + e > s; s++) {
		var a = s - n + 1;
		if (0 > a)
			o.push(!1);
		else {
			for (var r = 0, h = a; s >= h; h++)
				r += t[h].close;
			var c = r / n;
			o.push(c)
		}
	}
	return o
}
function $id(t) {
	return document.getElementById(t)
}
function getPriceColor(t, i) {
	return i >= t ? riseColor : t > i ? fallColor : normalColor
}
function getColor(t) {
	return t >= 0 ? riseColor : fallColor
}
function setTouchEventOffsetPosition(t, i) {
	t = t || event, t.touches && t.touches.length
			? t = t.touches[0]
			: t.changedTouches && t.changedTouches.length
					&& (t = t.changedTouches[0]);
	var e = t.pageX - i.x, n = t.pageY - i.y;
	return {
		offsetX : e,
		offsetY : n
	}
}
function Painter(t, i, e) {
	this.canvas = $id(t), this.canvas.getContext
			&& (this.ctx = this.canvas.getContext("2d"), this.data = e, this.paintImplement = i, this.width = this.canvas.width, this.height = this.canvas.height)
}
function xAxis(t) {
	this.xOptions = t
}
function yAxis(t) {
	this.scaleOptions = t
}
function Slider(t, i) {
	this.canvas = t, this.relativePoint = getPageCoord(t), this.ctx = this.canvas
			.getContext("2d"), this.region = i.region, this.bar = i.bar, this.value = i.value, this.minBarDistance = i.minBarDistance, this.onPositionChanged = i.onPositionChanged, this.prePaint = i.prePaint, this.isTouchDevice = isTouchDevice(), this
			.calcPositions()
}
function CrossLines(t) {
	this.updateOptions(t)
}
function Tip(t) {
	extendObject(t, this), this.tipX = 0, this.tipY = 0
}
function ChartTouchEvent(t, i) {
	this.canvas = t, this.options = i
}
function cancleBubbleAndPreventDefault(t) {
	t && t.preventDefault && t.preventDefault(), t.cancelBubble = !0
}
function addCrossLinesAndTipEvents(t, i) {
	if (!t.klineEventInstance) {
		var e = new ChartTouchEvent(t, i);
		t.klineEventInstance = e, t.klineEventInstance
				.addCrossLinesAndTipEvents()
	}
}
!function() {
	function t() {
		this.tapTimeLimit = 500
	}
	t.prototype = {
		isTouchDevice : function() {
			return !!("ontouchstart" in window || window.DocumentTouch
					&& document instanceof DocumentTouch)
		},
		toMoney : function(t) {
			return t.toFixed(2)
		},
		bigNumberToText : function(t) {
			var i, e = t / 1e8;
			if (e > 1)
				i = e.toFixed(2) + "\u4EBF";
			else {
				var n = t / 1e4;
				i = n > 1 ? n.toFixed(2) + "\u4E07" : t
			}
			return i
		},
		addEvent : function(t, i, e, n) {
			if (t.addEventListener)
				return t.addEventListener(i, e, n), !0;
			if (t.attachEvent) {
				var o = t.attachEvent("on" + i, e);
				return o
			}
			t["on" + i] = e
		},
		getEventTarget : function(t) {
			return t.srcElement || t.target || t.relatedTarget
		},
		$id : function(t) {
			return document.getElementById(t)
		},
		getOffset : function(t) {
			if (!isNaN(t.offsetX) && !isNaN(t.offsetY))
				return t;
			var i = t.target;
			void 0 == i.offsetLeft && (i = i.parentNode);
			var e = getPageCoord(i), n = {
				x : window.pageXOffset + t.clientX,
				y : window.pageYOffset + t.clientY
			}, o = {
				offsetX : n.x - e.x,
				offsetY : n.y - e.y
			};
			return o
		},
		getPageCoord : function(t) {
			for (var i = {
				x : 0,
				y : 0
			}; t;)
				i.x += t.offsetLeft, i.y += t.offsetTop, t = t.offsetParent;
			return i
		}
	}, window.extendObject = function(t, i) {
		for (var e in t)
			i[e] = t[e];
		return i
	}, window.extendWindow = function(t) {
		window.extendObject(t, window)
	};
	var i = new t;
	extendWindow(i)
}();
var dashSize = 3, lineWidth = 1, devicePixelRatio = window.devicePixelRatio
		|| 1, canvas_width = 603, canvas_height = 410, margin_left = 50.5, margin_top = .5, chart_height = 200, priceHeight = 80, volumeHeight = 80, font = 11
		* devicePixelRatio, RiseColor = "rgb(252, 4, 4)", FallColor = "rgb(0, 168, 0)";
Array.prototype.each = function(t, i, e) {
	i = i || 0, e = e || this.length - 1;
	for (var n = i; e >= n; n++)
		if (t(this[n], this, n), this.breakLoop) {
			this.breakLoop = !1;
			break
		}
}, Painter.prototype = {
	paint : function() {
		var t = (this.ctx, this.paintImplement);
		if ("function" == typeof t.initialize && t.initialize(this), t.start
				&& t.start.call(this), "function" == typeof t.paintItems)
			t.paintItems.call(this);
		else
			for (var i = this.data.length, e = 0; i > e; e++) {
				var n = t.getX ? t.getX.call(this, e) : void 0, o = t.getY
						? t.getY.call(this, e)
						: void 0;
				t.paintItem.call(this, e, n, o)
			}
		t.end && t.end.call(this)
	},
	drawHLine : function(t, i, e, n, o, s) {
		var a = this.ctx;
		if (a.strokeStyle = t, e = Math.floor(e) + .5, s && "dashed" == s) {
			var r = 0;
			do
				this.drawHLine(t, r, e, o, o, "solid"), r += 2 * dashSize;
			while (n > r)
		} else
			a.beginPath(), a.moveTo(i, e), a.lineTo(i + n, e), a.stroke()
	},
	drawVLine : function(t, i, e, n, o, s) {
		var a = this.ctx;
		if (a.strokeStyle = t, i = Math.floor(i) + .5, s && "dashed" == s) {
			var r = 0;
			do
				this.drawVLine(t, i, r, o, o, "solid"), r += 2 * dashSize;
			while (n > r)
		} else
			a.beginPath(), a.moveTo(i, e), a.lineTo(i, e + n), a.stroke()
	},
	setData : function(t) {
		this.data = t
	},
	setPaintImplement : function(t) {
		this.paintImplement = t
	}
}, xAxis.prototype = {
	initialize : function(t) {
		t.options = this.xOptions
	},
	start : function() {
		var t = this.ctx;
		t.save(), "string" == typeof this.options.color
				&& (t.fillStyle = this.options.color), t.font = this.options.font, this.options.textBaseline
				&& (t.textBaseline = this.options.textBaseline), t.translate(
				this.options.region.x + .5, this.options.region.y + .5)
	},
	getY : function() {
		return 0
	},
	getX : function(t) {
		if (0 == t)
			return 0;
		var i = this.ctx.measureText(this.data[t]).width;
		return t == this.data.length - 1
				? this.options.region.width - i
				: this.options.region.width * t / (this.data.length - 1) - i
						/ 2
	},
	paintItem : function(t, i, e) {
		this.ctx.fillText(this.data[t], i, e)
	},
	end : function() {
		this.ctx.restore()
	}
}, yAxis.prototype = {
	initialize : function(t) {
		t.scaleOptions = this.scaleOptions
	},
	start : function() {
		var t = this.ctx;
		t.save(), "string" == typeof this.scaleOptions.color
				&& (t.fillStyle = this.scaleOptions.color), t.font = this.scaleOptions.font, this.scaleOptions.textBaseline
				&& (t.textBaseline = this.scaleOptions.textBaseline)
	},
	end : function() {
		this.ctx.restore()
	},
	getX : function(t) {
		if ("left" == this.scaleOptions.align)
			return 0;
		var i = this.ctx.measureText(this.data[t]).width;
		return console.log(this.data[t], this.scaleOptions.region.width - i), this.scaleOptions.region.width
				- i
	},
	getY : function(t) {
		return 0 == t ? 0 : t == this.data.length - 1
				? this.scaleOptions.region.height
						- this.scaleOptions.fontHeight
				: this.scaleOptions.region.height * t / (this.data.length - 1)
						- this.scaleOptions.fontHeight / 2
	},
	paintItem : function(t, i, e) {
		"function" == typeof this.scaleOptions.color
				? this.ctx.fillStyle = this.scaleOptions.color(this.data[t])
				: "string" == typeof this.scaleOptions.color
						&& (this.ctx.fillStyle = this.scaleOptions.color), this.ctx
				.fillText(this.data[t], i, e)
	}
}, Slider.prototype = {
	calcPositions : function() {
		var t = this.region.width - this.bar.width;
		this.leftPosition = this.value.left * t / 100 + this.bar.width / 2, this.rightPosition = this.value.right
				* t / 100 + this.bar.width / 2, "undefined" == typeof this.preValue
				&& (this.preValue = this.value)
	},
	drawSlider : function() {
		var t = (this.canvas, this.ctx);
		t.save();
		var i = this.region, e = this.bar, n = this.leftPosition, o = this.rightPosition;
		t.clearRect(i.x, i.y, i.width, i.height), t.translate(i.x - .5, i.y
						- .5), this.calcPositions(), "function" == typeof this.prePaint
				&& this.prePaint(t), t.lineWidth = lineWidth, t.strokeStyle = i.borderColor, t
				.beginPath(), t.moveTo(i.x, i.y), t.lineTo(i.x, i.y + i.height), t
				.lineTo(i.x + n, i.y + i.height), t.lineTo(i.x + n, i.y
						+ i.height - (i.height - e.height) / 2), t.stroke(), t.strokeStyle = i.borderColor, t
				.beginPath(), t
				.moveTo(i.x + n, i.y + (i.height - e.height) / 2), t.lineTo(i.x
						+ n, i.y), t.lineTo(i.x, i.y), t.stroke(), t.strokeStyle = i.borderColor, t
				.beginPath(), t.moveTo(i.x + n, i.y), t.lineTo(i.x + i.width,
				i.y), t.lineTo(i.x + i.width, i.y + i.height), t.lineTo(
				i.x + o, i.y + i.height), t.lineTo(i.x + o, i.y + i.height
						- (i.height - e.height) / 2), t.stroke(), t.strokeStyle = i.borderColor, t
				.beginPath(), t.moveTo(i.x + o, i.y), t.lineTo(i.x + o, i.y
						+ (i.height - e.height) / 2), t.stroke(), t.beginPath(), t.fillStyle = i.fillColor, t.globalAlpha = .3, t
				.rect(i.x + n, i.y, o - n, i.height), t.closePath(), t.fill(), t.globalAlpha = 1, t.strokeStyle = e.borderColor, t.fillStyle = e.fillColor, t
				.beginPath();
		var s = {
			x : i.x + n - e.width / 2,
			y : i.y + (i.height - e.height) / 2,
			width : e.width,
			height : e.height
		};
		t.rect(s.x, s.y, s.width, s.height), this.leftBarRegion = s, t
				.closePath(), t.stroke(), t.fill(), t.strokeStyle = e.borderColor, t.fillStyle = e.fillColor, t
				.beginPath();
		var a = {
			x : i.x + o - e.width / 2,
			y : i.y + (i.height - e.height) / 2,
			width : e.width,
			height : e.height
		};
		t.rect(a.x, a.y, a.width, a.height), this.rightBarRegion = a, t
				.closePath(), t.stroke(), t.fill(), t.restore()
	},
	setLeftPosition : function(t) {
		this.leftPosition = t <= this.bar.width / 2
				? this.bar.width / 2
				: this.rightPosition - this.minBarDistance - t >= this.bar.width
						? t
						: this.rightPosition - this.minBarDistance
								- this.bar.width, this.value = this.getValue()
	},
	setRightPosition : function(t) {
		this.rightPosition = t <= this.leftPosition + this.bar.width
				+ this.minBarDistance ? this.leftPosition + this.bar.width
				+ this.minBarDistance : t >= this.region.width - this.bar.width
				/ 2 ? this.region.width - this.bar.width / 2 : t, this.value = this
				.getValue()
	},
	addSliderEvents : function() {
		var t = this, i = isTouchDevice();
		i && (addEvent(t.canvas, "touchend", function(i) {
					t.onEndMove(i)
				}), addEvent(t.canvas, "touchmove", function(i) {
					t.onTouchMove(i)
				}), addEvent(t.canvas, "touchstart", function(i) {
					t.onStartHandle(i)
				}))
	},
	onEndMove : function(t) {
		t = t || event, cancleBubbleAndPreventDefault(t);
		var i = this.canvas, e = getPageCoord(i), n = setTouchEventOffsetPosition(
				t, e);
		this._endMove(n);
		var o = new Date, s = o.getTime() - this.touchStartTime.getTime();
		200 > s && "function" == typeof this.options.onClick
				&& addEvent(i, "click", options.onClick)
	},
	onStartHandle : function(t) {
		t = t || event, cancleBubbleAndPreventDefault(t);
		var i = this.canvas, e = getPageCoord(i), n = setTouchEventOffsetPosition(
				t, e);
		this._startHandle(n), this.touchStartTime = new Date
	},
	onTouchMove : function(t) {
		t = t || event, cancleBubbleAndPreventDefault(t);
		var i = this.canvas, e = getPageCoord(i), n = setTouchEventOffsetPosition(
				t, e);
		this._moveHandle(n)
	},
	_isInRegion : function(t, i) {
		var e = t.offsetX > i.x && t.offsetX < i.x + i.width && t.offsetY > i.y
				&& t.offsetY < i.y + i.height;
		return e
	},
	_isBetweenLeftAndRight : function(t) {
		var i = this.region, e = {
			x : i.x + this.leftPosition + this.bar.width / 2,
			y : i.y,
			width : this.rightPosition - this.leftPosition - this.bar.width,
			height : this.region.height
		};
		return this._isInRegion(t, e)
	},
	_isValueChanged : function() {
		var t = this.preValue, i = this.getValue(), e = Math.abs(i.left
				- t.left)
				+ Math.abs(i.right - t.right);
		return this.preValue = i, 0 != e
	},
	getValue : function() {
		var t = this.region.width - this.bar.width;
		return {
			left : 100 * (this.leftPosition - this.bar.width / 2) / t,
			right : 100 * (this.rightPosition - this.bar.width / 2) / t
		}
	},
	_isOnLeftBar : function(t) {
		return this._isInRegion(t, this.leftBarRegion)
	},
	_isOnRightBar : function(t) {
		return this._isInRegion(t, this.rightBarRegion)
	},
	_startHandle : function(t) {
		var i = this, e = i._isOnLeftBar(t), n = i._isOnRightBar(t), o = i
				._isBetweenLeftAndRight(t);
		o ? document.body.style.cursor = "move" : (e || n)
				&& (document.body.style.cursor = "col-resize"), i.triggerBar = e
				? {
					type : "left",
					x : t.offsetX,
					position : i.leftPosition
				}
				: n ? {
					type : "right",
					x : t.offsetX,
					position : i.rightPosition
				} : o ? {
					type : "middle",
					x : t.offsetX,
					leftPosition : i.leftPosition,
					rightPosition : i.rightPosition
				} : null
	},
	_moveHandle : function(t) {
		var i = this, e = i._isOnLeftBar(t), n = i._isOnRightBar(t), o = i
				._isBetweenLeftAndRight(t), s = i.triggerBar;
		if (o ? document.body.style.cursor = "move" : (e || n || s)
				&& (document.body.style.cursor = "col-resize"), s) {
			s.targetX = t.offsetX;
			var a = s.targetX - s.x;
			"left" == s.type ? (document.body.style.cursor = "col-resize", i
					.setLeftPosition(s.position + a)) : "right" == s.type ? i
					.setRightPosition(s.position + a) : (i
					.setLeftPosition(s.leftPosition + a), i
					.setRightPosition(s.rightPosition + a)), i.drawSlider()
		}
	},
	_endMove : function() {
		var t = this;
		t.triggerBar, t.triggerBar = null, document.body.style.cursor = "default", "function" == typeof t.onPositionChanged
				&& t._isValueChanged()
				&& (t.value = t.getValue(), t.onPositionChanged(t.value), t.preValue = t
						.getValue())
	}
}, CrossLines.prototype = {
	updateOptions : function(t) {
		this.canvas = t.canvas, this.canvasId = this.canvas.id, this.horizontalDivId = this.canvasId
				+ "crossLines_H", this.verticalDivId = this.canvasId
				+ "crossLines_V", this.horizontalRange = t.horizontalRange, this.verticalRange = t.verticalRange, this.canvasPosition = getPageCoord(this.canvas), this.crossPoint = t.crossPoint, this.color = t.color
				|| "black"
	},
	removeCrossLines : function() {
		var t = this.canvas, i = t.id, e = i + "crossLines_H", n = i
				+ "crossLines_V", o = $id(e);
		o && (o.style.display = "none");
		var s = $id(n);
		s && (s.style.display = "none")
	},
	getHLine : function() {
		return $id(this.horizontalDivId)
	},
	getVLine : function() {
		return $id(this.verticalDivId)
	},
	setMouseEvents : function(t, i) {
		this.hLineMouseEvt = t, this.vLineMouseEvt = i
	},
	updateCrossPoint : function(t) {
		this.crossPoint = t, this.drawCrossLines()
	},
	drawCrossLines : function() {
		var t = this.canvas, i = this.canvas.id, e = i + "crossLines_H", n = i
				+ "crossLines_V", o = this.horizontalRange, s = this.verticalRange, a = this.canvasPosition;
		if (this.crossPoint.x < o.x1 || this.crossPoint.x > o.x2
				|| this.crossPoint.y < s.y1 || this.crossPoint.y > s.y2)
			return void this.removeCrossLines();
		var r, h = (t.style.zIndex || 1) + 1, c = !1;
		$id(e)
				? (c = !0, r = $id(e))
				: (r = document.createElement("div"), r.id = e), r.style.display = "block", r.style.position = "absolute", r.style.width = Math
				.round(o.x2 - o.x1)
				+ "px", r.style.height = "1px", r.style.left = Math.round(a.x
				+ o.x1 - 1)
				+ "px", r.style.top = Math.round(this.crossPoint.y + a.y)
				+ "px", r.style.backgroundColor = this.color, r.style.zIndex = h, c
				|| (document.body.appendChild(r), "function" == typeof this.hLineMouseEvt
						&& (addEvent(r, "mouseover", this.hLineMouseEvt), addEvent(
								r, "mousemove", this.hLineMouseEvt))), c = !1;
		var l;
		$id(n)
				? (c = !0, l = $id(n))
				: (l = document.createElement("div"), l.id = n), l.style.display = "block", l.style.position = "absolute", l.style.width = "1px", l.style.height = Math
				.round(s.y2 - s.y1)
				+ "px", l.style.left = Math.round(this.crossPoint.x + a.x)
				+ "px", l.style.top = Math.round(a.y + s.y1) + "px", l.style.backgroundColor = this.color, l.style.zIndex = h, c
				|| (document.body.appendChild(l), "function" == typeof this.vLineMouseEvt
						&& (addEvent(l, "mouseover", this.vLineMouseEvt), addEvent(
								l, "mousemove", this.vLineMouseEvt)))
	}
}, Tip.prototype = {
	getElementId : function() {
		return this.canvas.id + "_tip"
	},
	show : function(t, i) {
		t && (this.crossPoint = t), i && (this.innerHTML = i)
	},
	hide : function() {
		var t = $id(this.getElementId());
		t && (t.style.display = "none")
	},
	update : function(t, i) {
		this.relativePoint = t, this.innerHTML = i, this.show()
	}
}, ChartTouchEvent.prototype = {
	_removeCrossLinesAndTip : function() {
		var t = this;
		t.tip && t.tip.hide(), t.crossLines && t.crossLines.removeCrossLines()
	},
	updateOptions : function(t) {
		this.options = t
	},
	_touchStart : function(t) {
		t = t || event, cancleBubbleAndPreventDefault(t), this.touchStartTime = new Date
	},
	_touchMove : function(t) {
		t = t || event, cancleBubbleAndPreventDefault(t);
		var i = this.canvas, e = getPageCoord(i), n = setTouchEventOffsetPosition(
				t, e);
		this._onTouchMove(n)
	},
	_touchEnd : function(t) {
		t = t || event, cancleBubbleAndPreventDefault(t);
		{
			var i = this.canvas, e = getPageCoord(i);
			setTouchEventOffsetPosition(t, e)
		}
		this._removeCrossLinesAndTip();
		var n = new Date, o = n.getTime() - this.touchStartTime.getTime();
		200 > o && "function" == typeof this.options.onClick
				&& addEvent(i, "click", options.onClick)
	},
	_onTouchMove : function(t) {
		var t = t || event;
		t = getOffset(t);
		var i = this, e = i.canvas, n = i.options, o = getPageCoord(e), s = n.triggerEventRanges;
		if (t.offsetX < s.x || t.offsetX > s.x + s.width || t.offsetY < s.y
				|| t.offsetY > s.y + s.height)
			return void i._removeCrossLinesAndTip();
		var a = n.getCrossPoint(t), r = {
			crossPoint : a,
			horizontalRange : {
				x1 : s.x / devicePixelRatio,
				x2 : (s.x + s.width) / devicePixelRatio
			},
			verticalRange : {
				y1 : s.y / devicePixelRatio,
				y2 : (s.y + s.height) / devicePixelRatio
			},
			color : n.crossLinesColor,
			canvas : e
		};
		if (i.crossLines)
			i.crossLines.updateOptions(r);
		else {
			var h = new CrossLines(r);
			h.setMouseEvents(function(t) {
						t = t || event, t = getOffset(t);
						var e = {
							offsetX : t.offsetX + s.x,
							offsetY : parseInt(i.crossLines.getHLine().style.top)
									- o.y
						}, a = n.getCrossPoint(e);
						h.updateCrossPoint(a), i.tip
								&& i.tip.update(a, n.tipOptions.getTipHtml(e))
					}, function(t) {
						t = t || event, t = getOffset(t);
						var e = {
							offsetX : parseInt(i.crossLines.getVLine().style.left)
									- o.x,
							offsetY : t.offsetY + s.y
						}, a = n.getCrossPoint(e);
						h.updateCrossPoint(a), i.tip
								&& i.tip.update(a, n.tipOptions.getTipHtml(e))
					}), i.crossLines = h
		}
		if (i.crossLines.drawCrossLines(), n.tipOptions) {
			var c = n.tipOptions;
			if (!i.tip) {
				var l = {
					position : c.position,
					region : c.region,
					crossPoint : a,
					size : c.size,
					opacity : c.opacity,
					cssClass : c.cssClass,
					canvas : e,
					innerHTML : c.getTipHtml(t)
				}, d = new Tip(l);
				i.tip = d
			}
			i.tip.show(a, c.getTipHtml(t))
		}
	},
	addCrossLinesAndTipEvents : function() {
		{
			var t = this, i = this.canvas;
			this.options, getPageCoord(i)
		}
		if (1 != i.addCrossLinesAndTipEvents) {
			i.addCrossLinesAndTipEvents = !0;
			var e = isTouchDevice();
			e && (addEvent(i, "touchstart", function(i) {
						t._touchStart(i)
					}), addEvent(i, "touchmove", function(i) {
						t._touchMove(i)
					}), addEvent(i, "touchend", function(i) {
						t._touchEnd(i)
					}))
		}
	}
};
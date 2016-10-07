// @charset "utf-8";
function convertDate(t, i) {
	var e = Math.ceil(t / 1e4) - 1, s = t % 100, n = (Math.ceil(t / 100) - 1)
			% 100, o = new Date;
	if (o.setYear(e), o.setMonth(n - 1), o.setDate(s), 10 > n && (n = "0" + n), 10 > s
			&& (s = "0" + s), i) {
		var a = ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94",
				"\u516D"];
		return e + "-" + n + "-" + s + "，" + a[o.getDay()]
	}
	return e + "-" + n + "-" + s
}
function calcAxisValues(t, i, e, s) {
	var n = t - i, o = n / (e - 1), a = [];
	"undefined" == typeof s && (s = toMoney);
	for (var r = 0; e > r; ++r) {
		var h = toMoney(t - o * r);
		h >= 1e4 && 1e6 >= h ? h = h / 1e4 + "\u4E07" : h >= 1e6 && 1e8 >= h
				&& (h = h / 1e6 + "\u767E\u4E07"), a.push(h)
	}
	return a
}
function toMoney(t) {
	return isNaN(t) ? void 0 : t.toFixed(2)
}
function calcMAPrices(t, i, e, s) {
	for (var n = new Array, o = i; i + e > o; o++) {
		var a = o - s + 1;
		if (0 > a)
			n.push(!1);
		else {
			for (var r = 0, h = a; o >= h; h++)
				r += t[h].close;
			var l = r / s;
			n.push(l)
		}
	}
	return n
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
	var e = t.pageX - i.x, s = t.pageY - i.y;
	return {
		offsetX : e,
		offsetY : s
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
	this.canvas = t, this.ctx = this.canvas.getContext("2d"), this.region = i.region, this.bar = i.bar, this.value = i.value, this.minBarDistance = i.minBarDistance, this.onPositionChanged = i.onPositionChanged, this.prePaint = i.prePaint, this.isTouchDevice = isTouchDevice(), this
			.calcPositions()
}
function CrossLines(t) {
	this.updateOptions(t)
}
function Tip(t) {
	extendObject(t, this), this.tipX = 0, this.tipY = 0
}
function KLineEvent(t, i) {
	this.canvas = t, this.options = i
}
function addCrossLinesAndTipEvents(t, i) {
	if (!t.klineEventInstance) {
		var e = new KLineEvent(t, i);
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
				var s = t / 1e4;
				i = s > 1 ? s.toFixed(2) + "\u4E07" : t
			}
			return i
		},
		addEvent : function(t, i, e, s) {
			if (t.addEventListener)
				return t.addEventListener(i, e, s), !0;
			if (t.attachEvent) {
				var n = t.attachEvent("on" + i, e);
				return n
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
			var e = getPageCoord(i), s = {
				x : window.pageXOffset + t.clientX,
				y : window.pageYOffset + t.clientY
			}, n = {
				offsetX : s.x - e.x,
				offsetY : s.y - e.y
			};
			return n
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
	for (var s = i; e >= s; s++)
		if (t(this[s], this, s), this.breakLoop) {
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
				var s = t.getX ? t.getX.call(this, e) : void 0, n = t.getY
						? t.getY.call(this, e)
						: void 0;
				t.paintItem.call(this, e, s, n)
			}
		t.end && t.end.call(this)
	},
	drawHLine : function(t, i, e, s, n, o) {
		var a = this.ctx;
		if (a.strokeStyle = t, e = Math.floor(e) + .5, o && "dashed" == o) {
			var r = 0;
			do
				this.drawHLine(t, r, e, n, n, "solid"), r += 2 * dashSize;
			while (s > r)
		} else
			a.beginPath(), a.moveTo(i, e), a.lineTo(i + s, e), a.stroke()
	},
	drawVLine : function(t, i, e, s, n, o) {
		var a = this.ctx;
		if (a.strokeStyle = t, i = Math.floor(i) + .5, o && "dashed" == o) {
			var r = 0;
			do
				this.drawVLine(t, i, r, n, n, "solid"), r += 2 * dashSize;
			while (s > r)
		} else
			a.beginPath(), a.moveTo(i, e), a.lineTo(i, e + s), a.stroke()
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
				&& (t.textBaseline = this.scaleOptions.textBaseline), t
				.translate(this.scaleOptions.region.x + .5,
						this.scaleOptions.region.y + .5)
	},
	end : function() {
		this.ctx.restore()
	},
	getX : function(t) {
		if ("left" == this.scaleOptions.align)
			return 0;
		var i = this.ctx.measureText(this.data[t]).width;
		return this.scaleOptions.region.width - i
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
				* t / 100 + this.bar.width / 2
	},
	drawSlider : function() {
		var t = (this.canvas, this.ctx);
		t.save();
		var i = this.region, e = this.bar, s = this.leftPosition, n = this.rightPosition;
		t.clearRect(i.x - 1, i.y - 1, i.width + 1, i.height + 1), t.translate(
				i.x - .5, i.y - .5), this.calcPositions(), "function" == typeof this.prePaint
				&& this.prePaint(t), t.lineWidth = lineWidth, t.strokeStyle = i.borderColor, t
				.beginPath(), t.moveTo(i.x, i.y), t.lineTo(i.x, i.y + i.height), t
				.lineTo(i.x + s, i.y + i.height), t.lineTo(i.x + s, i.y
						+ i.height - (i.height - e.height) / 2), t.stroke(), t.strokeStyle = i.borderColor, t
				.beginPath(), t
				.moveTo(i.x + s, i.y + (i.height - e.height) / 2), t.lineTo(i.x
						+ s, i.y), t.lineTo(i.x, i.y), t.stroke(), t.strokeStyle = i.borderColor, t
				.beginPath(), t.moveTo(i.x + s, i.y), t.lineTo(i.x + i.width,
				i.y), t.lineTo(i.x + i.width, i.y + i.height), t.lineTo(
				i.x + n, i.y + i.height), t.lineTo(i.x + n, i.y + i.height
						- (i.height - e.height) / 2), t.stroke(), t.strokeStyle = i.borderColor, t
				.beginPath(), t.moveTo(i.x + n, i.y), t.lineTo(i.x + n, i.y
						+ (i.height - e.height) / 2), t.stroke(), t.beginPath(), t.fillStyle = i.fillColor, t.globalAlpha = .3, t
				.rect(i.x + s, i.y, n - s, i.height), t.closePath(), t.fill(), t.globalAlpha = 1, t.strokeStyle = e.borderColor, t.fillStyle = e.fillColor, t
				.beginPath();
		var o = {
			x : i.x + s - e.width / 2,
			y : i.y + (i.height - e.height) / 2,
			width : e.width,
			height : e.height
		};
		t.rect(o.x, o.y, o.width, o.height), this.leftBarRegion = o, t
				.closePath(), t.stroke(), t.fill(), t.strokeStyle = e.borderColor, t.fillStyle = e.fillColor, t
				.beginPath();
		var a = {
			x : i.x + n - e.width / 2,
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
		var t = this, i = function(i) {
			var e = t._isOnLeftBar(i), s = t._isOnRightBar(i), n = t
					._isBetweenLeftAndRight(i);
			n ? document.body.style.cursor = "move" : (e || s)
					&& (document.body.style.cursor = "col-resize"), t.triggerBar = e
					? {
						type : "left",
						x : i.offsetX,
						position : t.leftPosition
					}
					: s ? {
						type : "right",
						x : i.offsetX,
						position : t.rightPosition
					} : n ? {
						type : "middle",
						x : i.offsetX,
						leftPosition : t.leftPosition,
						rightPosition : t.rightPosition
					} : null
		}, e = function(i) {
			var e = t._isOnLeftBar(i), s = t._isOnRightBar(i), n = t
					._isBetweenLeftAndRight(i), o = t.triggerBar;
			if (n ? document.body.style.cursor = "move" : (e || s || o)
					&& (document.body.style.cursor = "col-resize"), o) {
				o.targetX = i.offsetX;
				var a = o.targetX - o.x;
				"left" == o.type
						? (document.body.style.cursor = "col-resize", t
								.setLeftPosition(o.position + a))
						: "right" == o.type ? t
								.setRightPosition(o.position + a) : (t
								.setLeftPosition(o.leftPosition + a), t
								.setRightPosition(o.rightPosition + a)), "function" == typeof t.onPositionChanged
						&& t._isValueChanged()
						&& (t.value = t.getValue(), t
								.onPositionChanged(t.value)), t.drawSlider()
			}
		}, s = function() {
			t.triggerBar, t.triggerBar = null, document.body.style.cursor = "default", "function" == typeof t.onPositionChanged
					&& t._isValueChanged()
					&& (t.value = t.getValue(), t.onPositionChanged(t.value))
		};
		addEvent(t.canvas, "mouseout", s), addEvent(t.canvas, "mouseup", s), addEvent(
				t.canvas, "mousemove", e), addEvent(t.canvas, "mousedown", i)
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
		if ("undefined" == typeof this.preValue)
			return this.preValue = this.getValue(), !1;
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
	}
}, CrossLines.prototype = {
	updateOptions : function(t) {
		this.canvas = t.canvas, this.canvasId = this.canvas.id, this.horizontalDivId = this.canvasId
				+ "crossLines_H", this.verticalDivId = this.canvasId
				+ "crossLines_V", this.horizontalRange = t.horizontalRange, this.verticalRange = t.verticalRange, this.canvasPosition = getPageCoord(this.canvas), this.crossPoint = t.crossPoint, this.color = t.color
				|| "black"
	},
	removeCrossLines : function() {
		var t = this.canvas, i = t.id, e = i + "crossLines_H", s = i
				+ "crossLines_V", n = $id(e);
		n && (n.style.display = "none");
		var o = $id(s);
		o && (o.style.display = "none")
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
		var t = this.canvas, i = this.canvas.id, e = i + "crossLines_H", s = i
				+ "crossLines_V", n = this.horizontalRange, o = this.verticalRange, a = this.canvasPosition;
		if (this.crossPoint.x < n.x1 || this.crossPoint.x > n.x2
				|| this.crossPoint.y < o.y1 || this.crossPoint.y > o.y2)
			return void this.removeCrossLines();
		var r, h = (t.style.zIndex || 1) + 1, l = !1;
		$id(e)
				? (l = !0, r = $id(e))
				: (r = document.createElement("div"), r.id = e), r.style.display = "block", r.style.position = "absolute", r.style.width = Math
				.round(n.x2 - n.x1)
				+ "px", r.style.height = "1px", r.style.left = Math.round(a.x
				+ n.x1 - 1)
				+ "px", r.style.top = Math.round(this.crossPoint.y + a.y)
				+ "px", r.style.backgroundColor = this.color, r.style.zIndex = h, l
				|| (document.body.appendChild(r), "function" == typeof this.hLineMouseEvt
						&& (addEvent(r, "mouseover", this.hLineMouseEvt), addEvent(
								r, "mousemove", this.hLineMouseEvt))), l = !1;
		var c;
		$id(s)
				? (l = !0, c = $id(s))
				: (c = document.createElement("div"), c.id = s), c.style.display = "block", c.style.position = "absolute", c.style.width = "1px", c.style.height = Math
				.round(o.y2 - o.y1)
				+ "px", c.style.left = Math.round(this.crossPoint.x + a.x)
				+ "px", c.style.top = Math.round(a.y + o.y1) + "px", c.style.backgroundColor = this.color, c.style.zIndex = h, l
				|| (document.body.appendChild(c), "function" == typeof this.vLineMouseEvt
						&& (addEvent(c, "mouseover", this.vLineMouseEvt), addEvent(
								c, "mousemove", this.vLineMouseEvt)))
	}
}, Tip.prototype = {
	getElementId : function() {
		return this.canvas.id + "_tip"
	},
	_getLeftLimit : function() {
		return this.canvasRange.x
	},
	_getRightLimit : function() {
		return this.canvasRange.x + this.canvasRange.width
	},
	_getTopLimit : function() {
		return this.canvasRange.y
	},
	_getBottomLimie : function() {
		return this.canvasRange.y + this.canvasRange.height
	},
	show : function(t, i) {
		t && (this.crossPoint = t), i && (this.innerHTML = i);
		var e = $id(this.getElementId()), s = this.size, n = this.position, t = this.crossPoint, o = getPageCoord(this.canvas);
		0 == o.x && (o.x = 10), 0 == o.y && (o.y = 10);
		var a = (this.region, n.x + this.region.x + o.x), r = this.canvas.width
				- n.x - s.width;
		if (t.x
				&& (t.x > this.canvas.width - a - s.width - 30
						? this.tipX = a
						: t.x < this.canvas.width - r + 30 && (this.tipX = r)), n.y
				&& (this.tipY = n.y + o.y), !e) {
			e = document.createElement("DIV"), e.id = this.getElementId();
			var h = this.opacity || 80;
			e.style.cssText = "-moz-opacity:."
					+ h
					+ "; filter:alpha(opacity="
					+ h
					+ "); opacity:"
					+ h
					/ 100
					+ ';line-height:18px;font-family:Arial,"\u5B8B\u4F53";font-size:9pt;padding:4px;', e.style.position = "absolute", e.style.zIndex = (this.canvas.style.zIndex || 1)
					+ 2, e.style.backgroundColor = "white", e.style.border = "1px solid gray", e.style.width = this.size.width
					+ "px", e.style.height = this.size.height + "px", this.cssClass
					&& (e.className = this.cssClass), document.body
					.appendChild(e)
		}
		return this.tipX <= 0
				? void(e.style.display = "none")
				: (e.style.left = this.tipX + "px", e.style.top = this.tipY
						+ "px", e.style.display = "block", void(e.innerHTML = this.innerHTML))
	},
	hide : function() {
		var t = $id(this.getElementId());
		t && (t.style.display = "none")
	},
	update : function(t, i) {
		this.relativePoint = t, this.innerHTML = i, this.show()
	}
}, KLineEvent.prototype = {
	_removeCrossLinesAndTip : function() {
		var t = this;
		t.tip && t.tip.hide(), t.crossLines && t.crossLines.removeCrossLines()
	},
	updateOptions : function(t) {
		this.options = t
	},
	_onMouseMove : function(t) {
		var t = t || event;
		t = getOffset(t);
		var i = this, e = i.canvas, s = i.options, n = getPageCoord(e), o = s.triggerEventRanges;
		if (t.offsetX < o.x || t.offsetX > o.x + o.width || t.offsetY < o.y
				|| t.offsetY > o.y + o.height)
			return void i._removeCrossLinesAndTip();
		var a = s.getCrossPoint(t), r = {
			crossPoint : a,
			horizontalRange : {
				x1 : o.x,
				x2 : o.x + o.width
			},
			verticalRange : {
				y1 : o.y,
				y2 : o.y + o.height
			},
			color : s.crossLinesColor,
			canvas : e
		};
		if (i.crossLines)
			i.crossLines.updateOptions(r);
		else {
			var h = new CrossLines(r);
			h.setMouseEvents(function(t) {
						t = t || event, t = getOffset(t);
						var e = {
							offsetX : t.offsetX + o.x,
							offsetY : parseInt(i.crossLines.getHLine().style.top)
									- n.y
						}, a = s.getCrossPoint(e);
						h.updateCrossPoint(a), i.tip
								&& i.tip.update(a, s.tipOptions.getTipHtml(e))
					}, function(t) {
						t = t || event, t = getOffset(t);
						var e = {
							offsetX : parseInt(i.crossLines.getVLine().style.left)
									- n.x,
							offsetY : t.offsetY + o.y
						}, a = s.getCrossPoint(e);
						h.updateCrossPoint(a), i.tip
								&& i.tip.update(a, s.tipOptions.getTipHtml(e))
					}), i.crossLines = h
		}
		if (i.crossLines.drawCrossLines(), s.tipOptions) {
			var l = s.tipOptions;
			if (!i.tip) {
				var c = {
					position : l.position,
					region : l.region,
					crossPoint : a,
					size : l.size,
					opacity : l.opacity,
					cssClass : l.cssClass,
					canvas : e,
					innerHTML : l.getTipHtml(t)
				}, d = new Tip(c);
				i.tip = d
			}
			i.tip.show(a, l.getTipHtml(t))
		}
	},
	_onMouseOut : function(t) {
		t = t || event, t = getOffset(t);
		var i = this, e = i.options.triggerEventRanges;
		if (t.offsetX <= e.x || t.offsetX >= e.x + e.width || t.offsetY <= e.y
				|| t.offsetY >= e.y + e.height)
			return void i._removeCrossLinesAndTip();
		var s = t.toElement || t.relatedTarget || t.target;
		if (s) {
			if (s == i.canvas)
				return;
			if (s == i.crossLines.getHLine() || s == i.crossLines.getVLine())
				return;
			i._removeCrossLinesAndTip()
		}
	},
	addCrossLinesAndTipEvents : function() {
		{
			var t = this, i = this.canvas, e = this.options;
			getPageCoord(i)
		}
		1 != i.addCrossLinesAndTipEvents
				&& (i.addCrossLinesAndTipEvents = !0, addEvent(i, "mousemove",
						function(i) {
							t._onMouseMove(i)
						}), addEvent(i, "mouseout", function(i) {
							t._onMouseOut(i)
						}), "function" == typeof e.onClick
						&& addEvent(i, "click", e.onClick))
	}
};
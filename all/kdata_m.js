// @charset "utf-8";
function klData(t, i) {
	this.options = t, this.kOptions = i
}
function kLine(t) {
	this.options = t, this.dataRanges = null
}
function drawKL(t, i) {
	var e = {
		backgroundColor : "#fff",
		riseColor : RiseColor,
		fallColor : FallColor,
		normalColor : "black",
		chartMargin : _chartMargin,
		region : _chartRegion,
		barWidth : 7 * devicePixelRatio,
		spaceWidth : 3 * devicePixelRatio,
		horizontalLineCount : 2,
		verticalLineCount : 1,
		lineStyle : "dashed",
		borderColor : "gray",
		splitLineColor : "#eeeeee",
		lineWidth : lineWidth,
		MAs : [{
					color : "rgb(255,70,251)",
					daysCount : 5
				}, {
					color : "rgb(227,150,34)",
					daysCount : 10
				}, {
					color : "rgb(53,71,107)",
					daysCount : 20
				}],
		yAxis : {
			font : font + "px Arial",
			color : "black",
			align : "left",
			fontHeight : font,
			textBaseline : "top"
		},
		xAxis : {
			font : font + "px Arial",
			color : "black",
			align : "left",
			fontHeight : font,
			textBaseline : "top",
			scalerCount : 2,
			height : xAxisHeight
		},
		volume : {
			region : _volumeRegion,
			lineWidth : lineWidth,
			horizontalLineCount : 1,
			lineStyle : "dashed",
			yAxis : {
				font : font + "px Arial",
				color : "black",
				align : "left",
				fontHeight : font,
				textBaseline : "top"
			}
		},
		priceLine : {
			region : {
				x : marginLeft * devicePixelRatio,
				y : _volumeRegion.y + _volumeRegion.height + xAxisHeight,
				height : priceHeight * devicePixelRatio,
				width : chart_width * devicePixelRatio
			},
			verticalLineCount : 5,
			horizontalLineCount : 1,
			lineStyle : "dashed",
			borderColor : "#cccccc",
			splitLineColor : "#eeeeee",
			fillColor : "#a0d4f6",
			alpha : 1,
			yAxis : {
				font : font + "px Arial",
				color : "black",
				align : "left",
				fontHeight : font,
				textBaseline : "top"
			}
		},
		slider : {
			bar : {
				width : 20,
				height : 35,
				borderColor : "black",
				fillColor : "lightgray"
			},
			minBarDistance : 20
		}
	};
	if (!painter) {
		var a = new kLine(e);
		painter = new Painter("canvasKL", a, i)
	}
	painter.dataRanges = t, painter.paint()
}
klData.prototype = {
	init : function() {
		var t, i = this, e = "fq=" + i.options.fq, a = "p=" + i.options.type, o = "year="
				+ i.options.time, n = "info=k_sz_" + i.options.code + "&aid=1", r = "http://qd.10jqka.com.cn/api.php", h = r
				+ "?" + a + "&" + e + "&" + o + "&" + n;
		t && document.removeChild(t), t = document.createElement("script"), t.src = h, t.onload = function() {
			var t = i.options.time, e = t.split(","), a = i.options.type, o = "k";
			switch (a) {
				case "stock_day" :
					o += "_daily_";
					break;
				case "stock_week" :
					o += "_week_";
					break;
				case "stock_month" :
					o += "_month_";
					break;
				case "stock_min5" :
					o += "_5_";
					break;
				case "stock_min15" :
					o += "_15_";
					break;
				case "stock_min30" :
					o += "_30_";
					break;
				case "stock_min60" :
					o += "_60_"
			}
			if (o += i.options.code, "stock_min5" == a || "stock_min15" == a
					|| "stock_min30" == a || "stock_min60" == a) {
				var n = i.parseData(window[o]);
				return void drawKL(null, n)
			}
			result = "";
			var n;
			if (1 == e.length) {
				result = result + o + "_" + t.substr(2, 2);
				var n = i.parseData(window[result]);
				return void drawKL(null, n)
			}
			for (var r = 0; r < e.length; ++r)
				result = 1 == e.length
						? result + o + "_" + e[r].substr(2, 2)
						: result + o + "_" + e[r].substr(2, 2) + "+";
			result = result.substr(0, result.length - 1);
			var h = result.split("+"), l = "";
			for (r = 0; r < h.length; ++r)
				l += window[h[r]];
			var n = i.parseData(l);
			drawKL(null, n)
		}, document.body.appendChild(t)
	},
	parseData : function(t) {
		var i = this, e = t.split("|");
		e.pop();
		var a = {}, o = [];
		this.setDataLength(e.length);
		for (var n = 0; n < e.length; n++) {
			var r, h = e[n].split(",");
			if (0 == h.length)
				break;
			var l;
			0 == n ? r = {
				quoteTime : parseInt(h[0]),
				preClose : parseInt(0),
				open : parseFloat(h[1]),
				high : parseFloat(h[2]),
				low : parseFloat(h[3]),
				close : parseFloat(h[4]),
				volume : parseInt(h[5]),
				amount : parseInt(h[6])
			} : (l = e[n - 1].split(","), r = {
				quoteTime : parseInt(h[0]),
				preClose : parseFloat(l[4]),
				open : parseFloat(h[1]),
				high : parseFloat(h[2]),
				low : parseFloat(h[3]),
				close : parseFloat(h[4]),
				volume : parseInt(h[5]),
				amount : parseInt(h[6])
			}), 0 == o.length
					? (a.low = r.low, a.high = r.high)
					: (a.low = Math.min(a.low, r.low), a.high = Math.max(
							a.high, r.high)), o.push(r)
		}
		return a.ks = o, a.dataLength = a.ks.length, a.updateTip = i.options.updateTip, a
	},
	getDataLength : function() {
		return this.dataLength
	},
	setDataLength : function(t) {
		this.dataLength = t
	}
}, kLine.prototype = {
	initialize : function(t) {
		t.klOptions = this.options, t.implement = this
	},
	start : function() {
		var t = this.canvas, i = this.ctx;
		this.painting = !0;
		var e = this.klOptions;
		i.lineWidth = e.lineWidth;
		var a = {
			width : t.width,
			height : t.height
		};
		i.clearRect(0, 0, a.width * devicePixelRatio, a.height), i.save(), window.riseColor = e.riseColor, window.fallColor = e.fallColor, window.normalColor = e.normalColor, e.backgroundColor
				&& !this.drawnBackground
				&& (i.beginPath(), i.fillStyle = e.backgroundColor, i.rect(0,
						0, a.width, a.height), i.fill(), this.drawnBackground = !0), i
				.translate(e.region.x, e.region.y), i.strokeStyle = e.borderColor, i
				.beginPath(), i.rect(0, 0, e.region.width, e.region.height), i
				.stroke();
		var o = e.region.height / (e.horizontalLineCount + 1);
		o = o.toFixed(0);
		for (var n = 1; n <= e.horizontalLineCount; n++) {
			var r = o * n;
			r = Math.floor(r) + .5, this.drawHLine(e.splitLineColor, 0, r,
					e.region.width, e.lineWidth, e.lineStyle)
		}
		for (var h = e.region.width / (e.verticalLineCount + 1), n = 1; n <= e.verticalLineCount; n++) {
			var l = h * n;
			l = Math.floor(l) + .5, this.drawVLine(e.splitLineColor, l, 0,
					e.region.height, e.lineWidth, e.lineStyle)
		}
	},
	end : function() {
		function t(t) {
			if (t -= n.x, t *= devicePixelRatio, t > 0) {
				var i = o.spaceWidth + o.barWidth, e = Math.ceil(t / i) - 1, a = o.toIndex
						- o.startIndex + 1;
				return e >= a && (e = a - 1), e
			}
			return 0
		}
		function i(i) {
			var e = t(i), a = (n.x + o.spaceWidth * (e + 1) + o.barWidth
					* (e + .27))
					/ devicePixelRatio;
			return a
		}
		function e(i) {
			var e = a.startIndex + t(i);
			e >= a.data.ks.length ? e = a.data.ks.length - 1 : 0 >= e
					&& (e = 0);
			var o, n, r = a.data.ks[e];
			0 == r.preClose ? (o = "-", n = "-") : (o = (r.close - r.preClose)
					.toFixed(2), n = o / r.preClose, n = (100 * n).toFixed(2));
			var h = {
				preClose : r.preClose,
				open : r.open,
				high : r.high,
				low : r.low,
				close : r.close,
				zhangdie : o,
				zhangdiefu : n,
				volume : r.volume,
				amount : r.amount
			};
			a.data.updateTip(h)
		}
		this.ctx.restore();
		var a = this, o = a.klOptions, n = o.region, r = o.volume.region, h = this.canvas, l = {
			getCrossPoint : function(t) {
				return {
					x : i(t.offsetX),
					y : t.offsetY
				}
			},
			triggerEventRanges : {
				x : n.x + .5,
				y : n.y,
				width : n.width,
				height : r.y + r.height - n.y
			},
			tipOptions : {
				getTipHtml : function(t) {
					return e(t.offsetX)
				},
				position : {
					x : 20,
					y : 20
				},
				region : n,
				size : {
					width : 120,
					height : 160
				},
				opacity : 100,
				cssClass : ""
			},
			crossLinesColor : "black"
		};
		if (addCrossLinesAndTipEvents(h, l), null == a.slider) {
			a.implement.paintPriceLine.call(a);
			var s = o.slider, d = h.id + "_slider", c = $id(d), g = c ? !0 : !1;
			g
					|| (c = document.createElement("canvas"), c.id = d, document.body
							.appendChild(c));
			var v = o.priceLine.region;
			c.width = v.width / devicePixelRatio, c.height = v.height
					/ devicePixelRatio;
			var p = getPageCoord(a.canvas);
			c.x = (p.x + v.x) / devicePixelRatio, c.y = (p.y + v.y)
					/ devicePixelRatio, c.style.left = p.x + v.x + "px", c.style.top = p.y
					+ v.y / devicePixelRatio + "px", c.style.position = "absolute", c.style.zIndex = a.canvas.style.zIndex
					? a.canvas.style.zIndex + 1
					: 1, c.style.display = "block";
			var u = {
				region : {
					x : 0,
					y : 0,
					width : c.width,
					height : c.height,
					fillColor : "#a0d4f6"
				},
				bar : {
					width : 20,
					height : 35,
					borderColor : "green",
					fillColor : "orange"
				},
				value : {
					left : a.dataRanges.start,
					right : a.dataRanges.to
				},
				minBarDistance : s.minBarDistance || 40,
				onPositionChanged : function(t) {
					drawKL({
								start : t.left,
								to : t.right
							}), a.slider.drawSlider()
				},
				prePaint : function() {
				},
				touchFaultTolerance : 20
			}, f = new Slider(c, u);
			this.slider = f, f.drawSlider(), f.addSliderEvents()
		}
	},
	paintItems : function() {
		function t() {
			return (a.spaceWidth + a.barWidth) * v <= n.width
		}
		function i(t) {
			return (C.high - t) * n.height / (C.high - C.low)
		}
		function e(t) {
			var i = t * (a.spaceWidth + a.barWidth) + .5
					* (a.spaceWidth + a.barWidth);
			return i = Math.floor(i) + .5
		}
		var a = this.klOptions, o = this.ctx, n = a.region;
		o.lineWidth = a.lineWidth, o.translate(.5, n.y);
		var r = this.data.ks.length, h = !0;
		if (null == this.dataRanges) {
			var l = Math.ceil(n.width / (a.spaceWidth + a.barWidth));
			l > r && (l = r), this.dataRanges = {
				start : 100 * (this.data.ks.length - l) / this.data.ks.length,
				to : 100
			}, h = !1
		}
		var s = this.dataRanges, d = Math.ceil(s.start / 100 * r), c = d - 1 >= 0
				? d
				: 0, g = Math.ceil(s.to / 100 * r);
		g == r && (g = r - 1), this.startIndex = c, this.toIndex = g;
		var v = g - c + 1;
		if (h) {
			var p, u;
			t()
					? (p = 1, u = (n.width - p * v) / v, u > 6
							&& (p = 3, u = (n.width - p * v) / v))
					: (p = 1, u = (n.width - p * v) / v, 3 >= u
							? (p = 0, u = (n.width - p * v) / v)
							: u > 6 && (p = 5, u = (n.width - p * v) / v)), a.barWidth = u, a.spaceWidth = p
		}
		for (var f = [], x = c; g >= x && r > x; x++)
			f.push(this.data.ks[x]);
		var w, m;
		f.each(function(t, i, e) {
					0 == e
							? (w = t.high, m = t.low)
							: (w = Math.max(t.high, w), m = Math.min(m, t.low))
				}), this.high = w, this.low = m;
		var o = this.ctx, C = this;
		this.implement.paintMAs.call(this, f, i);
		var y = 0, k = a.barWidth > 1.5, b = a.region.width / f.length;
		b > a.barWidth + a.spaceWidth
				&& (a.barWidth = .7 * b, a.spaceWidth = .3 * b);
		var L = function(t, n, r) {
			var h = t.close > t.open, l = h ? riseColor : fallColor, s = e(r);
			if (0 == y)
				y = s;
			else if (1 > s - y)
				return;
			y = s;
			var d = i(t.high), c = i(t.low);
			if (k) {
				o.fillStyle = l, o.strokeStyle = l;
				var g, v;
				h
						? (g = i(t.close), v = i(t.open) - g)
						: (g = i(t.open), v = i(t.close) - g), o.beginPath(), o
						.moveTo(s, d), o.lineTo(s, c), o.stroke();
				var p = s - a.barWidth / 2;
				o.beginPath(), o.fillRect(p, g, a.barWidth, v)
			} else
				o.strokeStyle = l, o.beginPath(), o.moveTo(s, d), o
						.lineTo(s, c), o.stroke()
		};
		f.each(L), this.filteredData = f;
		var _ = a.yAxis;
		_.region = _.region || {
			x : n.x,
			y : n.y,
			height : n.height - 2 * n.y,
			width : 50
		};
		var W = new yAxis(_), P = calcAxisValues(w, m, a.horizontalLineCount
						+ 2), R = new Painter(this.canvas.id, W, P);
		R.paint(), this.implement.paintVolume.call(this, f), this.implement.paintPriceLine
				.call(this)
	},
	paintMAs : function(t, i) {
		var e = this.ctx, a = this.klOptions, o = a.MAs, n = this;
		o.each(function(i) {
			var e = calcMAPrices(n.data.ks, n.startIndex, t.length, i.daysCount);
			i.values = e, e.each(function(t) {
						t
								&& (n.high = Math.max(n.high, t), n.low = Math
										.min(n.low, t))
					})
		}), o.each(function(t) {
					var o = t.values;
					e.strokeStyle = t.color, e.beginPath();
					o.each(function(t, o, n) {
								var r = n * (a.spaceWidth + a.barWidth) + .5
										* (a.spaceWidth + a.barWidth);
								if (t) {
									var h = i(t);
									h && 0 == n ? e.moveTo(r, h) : e.lineTo(r,
											h)
								}
							}), e.stroke()
				})
	},
	paintPriceLine : function() {
		function t(t) {
			return t * o.width / g
		}
		function i(t) {
			return (d.high - t) * o.height / (d.high - d.low)
		}
		var e = this.ctx;
		e.lineWidth = this.klOptions.lineWidth;
		var a = this.klOptions.priceLine, o = a.region;
		e.restore(), e.save(), e.translate(o.x, o.y), e.clearRect(0, 0,
				o.width, o.height);
		for (var n = (o.height / (a.horizontalLineCount + 1)).toFixed(0), r = 1; r <= a.horizontalLineCount; r++) {
			var h = n * r;
			10 * h % 10 == 0 && (h += .5), this.drawHLine(a.splitLineColor, 0,
					h, o.width, this.klOptions.lineWidth, a.lineStyle)
		}
		for (var l = (o.width / (a.verticalLineCount + 1)).toFixed(0), r = 1; r <= a.verticalLineCount; r++) {
			var s = l * r;
			10 * s % 10 == 0 && (s += .5), this.drawVLine(a.splitLineColor, s,
					0, o.height, this.klOptions.lineWidth, a.lineStyle)
		}
		var d, c = this.data.ks, g = c.length;
		c.each(function(t, i, e) {
					0 == e ? d = {
						high : t.high,
						low : t.low
					} : (d.high = Math.max(d.high, t.close), d.low = Math.min(
							d.low, t.close))
				}), d.low > 1 && (d.low -= 1);
		var v = 0;
		c.each(function(a, o, n) {
					var r = t(n);
					if (0 == v)
						v = r;
					else if (1 > r - v)
						return;
					v = r;
					var h = i(a.close);
					0 == n ? (e.beginPath(), e.moveTo(r, h)) : e.lineTo(r, h)
				}), e.stroke(), e.strokeStyle = a.borderColor, e.lineTo(
				o.width, o.height), e.lineTo(0, o.height), e.stroke(), e.fillStyle = a.fillColor, e.globalAlpha = a.alpha, e
				.fill(), e.beginPath(), e.rect(0, 0, o.width, o.height), e
				.stroke(), e.closePath();
		var p = a.yAxis;
		p.region = p.region || {
			x : o.x,
			y : o.y,
			height : o.height,
			width : o.width
		};
		var u = new yAxis(p), f = calcAxisValues(d.high, d.low,
				a.horizontalLineCount + 2), x = new Painter(this.canvas.id, u,
				f);
		x.paint(), e.restore()
	},
	paintVolume : function(t) {
		function i(t) {
			return r.height - r.height / g * t
		}
		function e(t) {
			var i = t * (o.spaceWidth + o.barWidth) + .5 * o.spaceWidth;
			return i = Math.round(i) + .5
		}
		var a = this.ctx, o = this.klOptions, n = o.volume, r = n.region;
		a.restore(), a.save(), a.translate(r.x, r.y), a.globalAlpha = 1;
		for (var h = r.height / (n.horizontalLineCount + 1), l = 1; l <= n.horizontalLineCount; l++) {
			var s = h * l;
			10 * s % 10 == 0 && (s += .5), this.drawHLine(o.splitLineColor, 0,
					s, o.region.width, o.lineWidth, o.lineStyle)
		}
		for (var d = o.region.width / (o.verticalLineCount + 1), l = 1; l <= o.verticalLineCount; l++) {
			var c = d * l;
			10 * c % 10 == 0 && (c += .5), this.drawVLine(o.splitLineColor, c,
					0, r.height, o.lineWidth, o.lineStyle)
		}
		a.strokeStyle = o.borderColor, a.beginPath(), a.rect(0, 0, r.width,
				r.height), a.stroke();
		var g = 0;
		t.each(function(t) {
					g = Math.max(g, t.volume)
				}), g *= 1.1, a.globalAlpha = 1, t.each(function(t, n, h) {
			var l = e(h), s = i(t.volume);
			a.beginPath(), a.rect(l, s, o.barWidth, r.height / g * t.volume), a.fillStyle = t.close > t.open
					? riseColor
					: fallColor, a.fill()
		});
		var v, p;
		1e6 > g
				? (v = 1e4, p = "\u4E07\u624B")
				: (v = 1e6, p = "\u767E\u4E07\u624B");
		for (var u = [], f = g / (n.horizontalLineCount + 1), l = 0; l < n.horizontalLineCount
				+ 1; ++l) {
			var x = ((g - f * l) / v).toFixed(2);
			u.push(x)
		}
		u.push(p);
		var w = n.yAxis;
		w.region = {
			x : r.x,
			y : r.y,
			width : r.width,
			height : r.height
		};
		var m = new yAxis(w), C = new Painter(this.canvas.id, m, u);
		C.paint(), a.restore(), a.save();
		var y = o.xAxis;
		y.region = {
			x : r.x,
			y : o.region.height + o.volume.region.height,
			width : o.region.width,
			height : y.height
		};
		var k = new xAxis(y), b = [], L = t.length / (o.verticalLineCount + 1);
		1 > L && (o.xAxis.scalerCount = t.length, L = 1), b.push(convertDate(
				t[0].quoteTime, !1).substr(2));
		for (var l = 1; l < o.verticalLineCount + 2; l++) {
			var _ = Math.ceil(l * L);
			_ >= t.length && (_ = t.length - 1);
			var W = convertDate(t[_].quoteTime, !1);
			W = W.substr(2), b.push(W)
		}
		var P = new Painter(this.canvas.id, k, b);
		P.paint()
	}
};
var canvas = $id("canvasKL"), width_parent = canvas.parentNode.clientWidth, canvasWidth = width_parent, marginLeft = .5, chart_width = canvasWidth
		- marginLeft, canvasHeight = 380;
canvas.style.width = canvasWidth + "px", canvas.style.height = canvasHeight
		+ "px";
var xAxisHeight = 20 * devicePixelRatio;
canvas.height = canvasHeight * devicePixelRatio, canvas.width = canvasWidth
		* devicePixelRatio;
var _chartMargin = {
	left : marginLeft * devicePixelRatio,
	top : margin_top * devicePixelRatio,
	right : marginLeft * devicePixelRatio
}, _chartRegion = {
	x : marginLeft * devicePixelRatio,
	y : margin_top * devicePixelRatio,
	width : chart_width * devicePixelRatio,
	height : chart_height * devicePixelRatio
}, _volumeRegion = {
	x : marginLeft * devicePixelRatio,
	y : (margin_top + chart_height + .5) * devicePixelRatio,
	height : volumeHeight * devicePixelRatio,
	width : chart_width * devicePixelRatio
}, painter;
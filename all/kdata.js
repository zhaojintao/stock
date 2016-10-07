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
		region : _chartRegion,
		barWidth : 7 * devicePixelRatio,
		spaceWidth : 3 * devicePixelRatio,
		horizontalLineCount : 3,
		verticalLineCount : 4,
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
			align : "right",
			fontHeight : 7,
			textBaseline : "top"
		},
		xAxis : {
			font : font + "px Arial",
			color : "black",
			align : "left",
			fontHeight : 8,
			textBaseline : "top",
			scalerCount : 5,
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
				align : "right",
				fontHeight : 8,
				textBaseline : "top"
			}
		},
		priceLine : {
			region : {
				x : margin_left * devicePixelRatio,
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
				align : "right",
				fontHeight : 8,
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
		var o = new kLine(e);
		painter = new Painter("canvasKL", o, i)
	}
	painter.dataRanges = t, painter.paint()
}
klData.prototype = {
	init : function() {
		var t, i = this, e = "fq=" + i.options.fq, o = "p=" + i.options.type, a = "year="
				+ i.options.time, n = "info=k_sz_" + i.options.code + "&aid=1", r = "http://qd.10jqka.com.cn/api.php", h = r
				+ "?" + o + "&" + e + "&" + a + "&" + n;
		t && document.removeChild(t), t = document.createElement("script"), t.src = h, t.onload = function() {
			var t = i.options.time, e = t.split(","), o = i.options.type, a = "k";
			switch (o) {
				case "stock_day" :
					a += "_daily_";
					break;
				case "stock_week" :
					a += "_week_";
					break;
				case "stock_month" :
					a += "_month_";
					break;
				case "stock_min5" :
					a += "_5_";
					break;
				case "stock_min15" :
					a += "_15_";
					break;
				case "stock_min30" :
					a += "_30_";
					break;
				case "stock_min60" :
					a += "_60_"
			}
			if (a += i.options.code, "stock_min5" == o || "stock_min15" == o
					|| "stock_min30" == o || "stock_min60" == o) {
				var n = i.parseData(window[a]);
				return void drawKL(null, n)
			}
			result = "";
			var n;
			if (1 == e.length) {
				result = result + a + "_" + t.substr(2, 2);
				var n = i.parseData(window[result]);
				return void drawKL(null, n)
			}
			for (var r = 0; r < e.length; ++r)
				result = 1 == e.length
						? result + a + "_" + e[r].substr(2, 2)
						: result + a + "_" + e[r].substr(2, 2) + "+";
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
		var o = {}, a = [];
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
			}), 0 == a.length
					? (o.low = r.low, o.high = r.high)
					: (o.low = Math.min(o.low, r.low), o.high = Math.max(
							o.high, r.high)), a.push(r)
		}
		return o.ks = a, o.dataLength = o.ks.length, o.updateTip = i.options.updateTip, o
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
		var o = {
			width : t.width,
			height : t.height
		};
		i.clearRect(0, 0, o.width * devicePixelRatio, o.height), i.save(), window.riseColor = e.riseColor, window.fallColor = e.fallColor, window.normalColor = e.normalColor, e.backgroundColor
				&& !this.drawnBackground
				&& (i.beginPath(), i.fillStyle = e.backgroundColor, i.rect(0,
						0, o.width, o.height), i.fill(), this.drawnBackground = !0), i
				.translate(e.region.x, e.region.y), i.strokeStyle = e.borderColor, i
				.beginPath(), i.rect(0, 0, e.region.width, e.region.height), i
				.stroke();
		var a = e.region.height / (e.horizontalLineCount + 1);
		a = a.toFixed(0);
		for (var n = 1; n <= e.horizontalLineCount; n++) {
			var r = a * n;
			r = Math.floor(r) + .5, this.drawHLine(e.splitLineColor, 0, r,
					e.region.width, e.lineWidth, e.lineStyle)
		}
		for (var h = e.region.width / (e.verticalLineCount + 1), n = 1; n <= e.verticalLineCount; n++) {
			var l = h * n;
			10 * l % 10 == 0 && (l += .5), this.drawVLine(e.splitLineColor, l,
					0, e.region.height, e.lineWidth, e.lineStyle)
		}
	},
	end : function() {
		function t(t) {
			if (t -= n.x, t > 0) {
				var i = Math.ceil(t / (a.spaceWidth + a.barWidth)) - 1, e = a.toIndex
						- a.startIndex + 1;
				return i >= e && (i = e - 1), i
			}
			return 0
		}
		function i(i) {
			var e = t(i), o = n.x + (a.spaceWidth + a.barWidth) * e + .5
					* (a.spaceWidth + a.barWidth);
			return o
		}
		function e(i) {
			var e = o.startIndex + t(i);
			e >= o.data.ks.length ? e = o.data.ks.length - 1 : 0 >= e
					&& (e = 0);
			var a, n, r = o.data.ks[e];
			0 == r.preClose ? (a = "-", n = "-") : (a = (r.close - r.preClose)
					.toFixed(2), n = a / r.preClose, n = (100 * n).toFixed(2));
			var h = "<div>" + convertDate(r.quoteTime, !0)
					+ '</div>\u5F00\u76D8\u4EF7：<font color="'
					+ getPriceColor(r.close, r.open) + '">' + toMoney(r.open)
					+ '</font><br/>\u6536\u76D8\u4EF7：<font color="'
					+ getPriceColor(r.close, r.close) + '">' + toMoney(r.close)
					+ '</font><br/>\u6700\u9AD8\u4EF7：<font color="'
					+ getPriceColor(r.close, r.high) + '">' + toMoney(r.high)
					+ '</font><br/>\u6700\u4F4E\u4EF7：<font color="'
					+ getPriceColor(r.close, r.low) + '">' + toMoney(r.low)
					+ '</font><br/>\u6DA8\u8DCC\u989D：<font color="'
					+ getColor(a) + '">' + a
					+ '</font><br/>\u6DA8\u8DCC\u5E45：<font color="'
					+ getColor(n) + '">' + n
					+ "%</font><br/>\u6210\u4EA4\u91CF："
					+ bigNumberToText(r.volume / 100)
					+ "\u624B<br/>\u6210\u4EA4\u989D："
					+ bigNumberToText(r.amount);
			return h
		}
		this.ctx.restore();
		var o = this, a = o.klOptions, n = a.region, r = a.volume.region, h = this.canvas, l = {
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
		if (addCrossLinesAndTipEvents(h, l), null == o.slider) {
			o.implement.paintPriceLine.call(o);
			var s = a.slider, c = h.id + "_slider", d = $id(c), g = d ? !0 : !1;
			g
					|| (d = document.createElement("canvas"), d.id = c, document.body
							.appendChild(d));
			var v = a.priceLine.region;
			d.width = v.width, d.height = v.height;
			var p = getPageCoord(o.canvas);
			d.style.left = p.x + v.x + "px", d.style.top = p.y + v.y + "px", d.style.position = "absolute", d.style.zIndex = o.canvas.style.zIndex
					? o.canvas.style.zIndex + 1
					: 1, d.style.display = "block";
			var u = {
				region : {
					x : 0,
					y : 0,
					width : d.width,
					height : d.height,
					fillColor : "#a0d4f6"
				},
				bar : {
					width : 10,
					height : 35,
					borderColor : "green",
					fillColor : "orange"
				},
				value : {
					left : o.dataRanges.start,
					right : o.dataRanges.to
				},
				minBarDistance : s.minBarDistance || 20,
				onPositionChanged : function(t) {
					drawKL({
								start : t.left,
								to : t.right
							}), o.slider.drawSlider()
				},
				prePaint : function() {
				},
				touchFaultTolerance : 20
			}, f = new Slider(d, u);
			this.slider = f, f.drawSlider(), f.addSliderEvents()
		}
	},
	paintItems : function() {
		function t() {
			return (o.spaceWidth + o.barWidth) * v <= n.width
		}
		function i(t) {
			return (m.high - t) * n.height / (m.high - m.low)
		}
		function e(t) {
			var i = t * (o.spaceWidth + o.barWidth) + .5
					* (o.spaceWidth + o.barWidth);
			return i = Math.floor(i) + .5
		}
		var o = this.klOptions, a = this.ctx, n = o.region;
		a.lineWidth = o.lineWidth, a.translate(.5, n.y);
		var r = this.data.ks.length, h = !0;
		if (null == this.dataRanges) {
			var l = Math.ceil(n.width / (o.spaceWidth + o.barWidth));
			l > r && (l = r), this.dataRanges = {
				start : 100 * (this.data.ks.length - l) / this.data.ks.length,
				to : 100
			}, h = !1
		}
		var s = this.dataRanges, c = Math.ceil(s.start / 100 * r), d = c - 1 >= 0
				? c
				: 0, g = Math.ceil(s.to / 100 * r);
		g == r && (g = r - 1), this.startIndex = d, this.toIndex = g;
		var v = g - d + 1;
		if (h) {
			var p, u;
			t()
					? (p = 1, u = (n.width - p * v) / v, u > 6
							&& (p = 3, u = (n.width - p * v) / v))
					: (p = 1, u = (n.width - p * v) / v, 3 >= u
							? (p = 0, u = (n.width - p * v) / v)
							: u > 6 && (p = 5, u = (n.width - p * v) / v)), o.barWidth = u, o.spaceWidth = p
		}
		for (var f = [], w = d; g >= w && r > w; w++)
			f.push(this.data.ks[w]);
		var x, C;
		f.each(function(t, i, e) {
					0 == e
							? (x = t.high, C = t.low)
							: (x = Math.max(t.high, x), C = Math.min(C, t.low))
				}), this.high = x, this.low = C;
		var a = this.ctx, m = this;
		this.implement.paintMAs.call(this, f, i);
		var b = 0, y = o.barWidth > 1.5, k = o.region.width / f.length;
		k > o.barWidth + o.spaceWidth
				&& (o.barWidth = .7 * k, o.spaceWidth = .3 * k);
		var L = function(t, n, r) {
			var h = t.close > t.open, l = h ? riseColor : fallColor, s = e(r);
			if (0 == b)
				b = s;
			else if (1 > s - b)
				return;
			b = s;
			var c = i(t.high), d = i(t.low);
			if (y) {
				a.fillStyle = l, a.strokeStyle = l;
				var g, v;
				h
						? (g = i(t.close), v = i(t.open) - g)
						: (g = i(t.open), v = i(t.close) - g), a.beginPath(), a
						.moveTo(s, c), a.lineTo(s, d), a.stroke();
				var p = s - o.barWidth / 2;
				a.beginPath(), a.fillRect(p, g, o.barWidth, v)
			} else
				a.strokeStyle = l, a.beginPath(), a.moveTo(s, c), a
						.lineTo(s, d), a.stroke()
		};
		f.each(L), this.filteredData = f;
		var _ = o.yAxis;
		_.region = _.region || {
			x : -n.x,
			y : .5,
			height : n.height - _.fontHeight,
			width : n.x - 3
		};
		var W = new yAxis(_), P = calcAxisValues(x, C, o.horizontalLineCount
						+ 2), R = new Painter(this.canvas.id, W, P);
		R.paint(), this.implement.paintVolume.call(this, f), this.implement.paintPriceLine
				.call(this)
	},
	paintPriceLine : function() {
		function t(t) {
			return t * a.width / g
		}
		function i(t) {
			return (c.high - t) * a.height / (c.high - c.low)
		}
		var e = this.ctx;
		e.lineWidth = this.klOptions.lineWidth;
		var o = this.klOptions.priceLine, a = o.region;
		e.restore(), e.save(), e.translate(a.x, a.y), e.clearRect(0, 0,
				a.width, a.height);
		for (var n = (a.height / (o.horizontalLineCount + 1)).toFixed(0), r = 1; r <= o.horizontalLineCount; r++) {
			var h = n * r;
			10 * h % 10 == 0 && (h += .5), this.drawHLine(o.splitLineColor, 0,
					h, a.width, this.klOptions.lineWidth, o.lineStyle)
		}
		for (var l = (a.width / (o.verticalLineCount + 1)).toFixed(0), r = 1; r <= o.verticalLineCount; r++) {
			var s = l * r;
			10 * s % 10 == 0 && (s += .5), this.drawVLine(o.splitLineColor, s,
					0, a.height, this.klOptions.lineWidth, o.lineStyle)
		}
		var c, d = this.data.ks, g = d.length;
		d.each(function(t, i, e) {
					0 == e ? c = {
						high : t.high,
						low : t.low
					} : (c.high = Math.max(c.high, t.close), c.low = Math.min(
							c.low, t.close))
				}), c.low > 1 && (c.low -= 1);
		var v = 0;
		d.each(function(o, a, n) {
					var r = t(n);
					if (0 == v)
						v = r;
					else if (1 > r - v)
						return;
					v = r;
					var h = i(o.close);
					0 == n ? (e.beginPath(), e.moveTo(r, h)) : e.lineTo(r, h)
				}), e.stroke(), e.strokeStyle = o.borderColor, e.lineTo(
				a.width, a.height), e.lineTo(0, a.height), e.stroke(), e.fillStyle = o.fillColor, e.globalAlpha = o.alpha, e
				.fill(), e.beginPath(), e.rect(0, 0, a.width, a.height), e
				.stroke(), e.closePath();
		var p = o.yAxis;
		p.region = p.region || {
			x : -a.x,
			y : 0,
			height : a.height - p.fontHeight,
			width : a.x - 3
		};
		var u = new yAxis(p), f = calcAxisValues(c.high, c.low,
				o.horizontalLineCount + 2), w = new Painter(this.canvas.id, u,
				f);
		w.paint(), e.restore()
	},
	paintMAs : function(t, i) {
		var e = this.ctx, o = this.klOptions, a = o.MAs, n = this;
		a.each(function(i) {
			var e = calcMAPrices(n.data.ks, n.startIndex, t.length, i.daysCount);
			i.values = e, e.each(function(t) {
						t
								&& (n.high = Math.max(n.high, t), n.low = Math
										.min(n.low, t))
					})
		}), a.each(function(t) {
					var a = t.values;
					e.strokeStyle = t.color, e.beginPath();
					a.each(function(t, a, n) {
								var r = n * (o.spaceWidth + o.barWidth) + .5
										* (o.spaceWidth + o.barWidth);
								if (t) {
									var h = i(t);
									h && 0 == n ? e.moveTo(r, h) : e.lineTo(r,
											h)
								}
							}), e.stroke()
				})
	},
	paintVolume : function(t) {
		function i(t) {
			return r.height - r.height / g * t
		}
		function e(t) {
			var i = t * (a.spaceWidth + a.barWidth) + .5 * a.spaceWidth;
			return i = Math.round(i) + .5
		}
		var o = this.ctx, a = this.klOptions, n = a.volume, r = n.region;
		o.restore(), o.save(), o.translate(r.x, r.y), o.globalAlpha = 1;
		for (var h = r.height / (n.horizontalLineCount + 1), l = 1; l <= n.horizontalLineCount; l++) {
			var s = h * l;
			10 * s % 10 == 0 && (s += .5), this.drawHLine(a.splitLineColor, 0,
					s, a.region.width, a.lineWidth, a.lineStyle)
		}
		for (var c = a.region.width / (a.verticalLineCount + 1), l = 1; l <= a.verticalLineCount; l++) {
			var d = c * l;
			10 * d % 10 == 0 && (d += .5), this.drawVLine(a.splitLineColor, d,
					0, r.height, a.lineWidth, a.lineStyle)
		}
		o.strokeStyle = a.borderColor, o.beginPath(), o.rect(0, 0, r.width,
				r.height), o.stroke();
		var g = 0;
		t.each(function(t) {
					g = Math.max(g, t.volume)
				}), g *= 1.1, o.globalAlpha = 1, t.each(function(t, n, h) {
			var l = e(h), s = i(t.volume);
			o.beginPath(), o.rect(l, s, a.barWidth, r.height / g * t.volume), o.fillStyle = t.close > t.open
					? riseColor
					: fallColor, o.fill()
		});
		var v, p;
		1e6 > g
				? (v = 1e4, p = "\u4E07\u624B")
				: (v = 1e6, p = "\u767E\u4E07\u624B");
		for (var u = [], f = g / (n.horizontalLineCount + 1), l = 0; l < n.horizontalLineCount
				+ 1; ++l) {
			var w = ((g - f * l) / v).toFixed(2);
			u.push(w)
		}
		u.push(p);
		var x = n.yAxis;
		x.region = x.region || {
			x : -r.x,
			y : .5,
			width : r.x - 3,
			height : r.height - x.fontHeight
		};
		var C = new yAxis(x), m = new Painter(this.canvas.id, C, u);
		m.paint(), o.restore(), o.save();
		var b = a.xAxis;
		b.region = {
			x : r.x,
			y : a.region.height + a.volume.region.height,
			width : a.region.width,
			height : b.height
		};
		var y = new xAxis(b), k = [], L = t.length / (a.verticalLineCount + 1);
		1 > L && (a.xAxis.scalerCount = t.length, L = 1), k.push(convertDate(
				t[0].quoteTime, !1).substr(2));
		for (var l = 1; l < a.verticalLineCount + 2; l++) {
			var _ = Math.ceil(l * L);
			_ >= t.length && (_ = t.length - 1);
			var W = convertDate(t[_].quoteTime, !1);
			W = W.substr(2), k.push(W)
		}
		var P = new Painter(this.canvas.id, y, k);
		P.paint()
	}
};
var canvas = $id("canvasKL"), width_parent = canvas.parentNode.offsetWidth;
canvas.style.width = canvas_width + "px", canvas.style.height = canvas_height
		+ "px", canvas.height = canvas_height * devicePixelRatio, canvas.width = canvas_width
		* devicePixelRatio;
var chart_width = canvas_width - margin_left, xAxisHeight = 20, _chartRegion = {
	x : margin_left * devicePixelRatio,
	y : margin_top * devicePixelRatio,
	width : chart_width * devicePixelRatio,
	height : chart_height * devicePixelRatio
}, _volumeRegion = {
	x : margin_left * devicePixelRatio,
	y : (margin_top + chart_height) * devicePixelRatio,
	height : volumeHeight * devicePixelRatio,
	width : chart_width * devicePixelRatio
}, painter;
// @charset "utf-8";
/**
 * 类的描述 K线绘制
 * 
 * @Filename klineChart.js
 * @author Rocky
 * @Time 2014-2-24 下午02:28:23
 * @Version v1.0.0
 * @param {}
 *            options options : { code : '300033', type : 'stock_day', ktype :
 *            {}, fq : '', time : '2012,2013', updateTip : function(obj) {} }
 */
function kLine(options) {
	this.options = options;
	this.dataRanges = null;
}

kLine.prototype = {
	initialize : function(painter) {
		painter.klOptions = this.options;
		painter.implement = this;
	},
	start : function() {
		var canvas = this.canvas;
		var ctx = this.ctx;
		this.painting = true;
		var options = this.klOptions;
		ctx.lineWidth = options.lineWidth;

		var clearPart = {
			width : canvas.width,
			height : canvas.height
		};
		ctx.clearRect(0, 0, clearPart.width * devicePixelRatio,
				clearPart.height);

		ctx.save();

		window.riseColor = options.riseColor;
		window.fallColor = options.fallColor;
		window.normalColor = options.normalColor;

		if (options.backgroundColor && !this.drawnBackground) {
			ctx.beginPath();
			ctx.fillStyle = options.backgroundColor;
			ctx.rect(0, 0, clearPart.width, clearPart.height);
			ctx.fill();
			this.drawnBackground = true;
		}

		ctx.translate(options.region.x, options.region.y);

		ctx.strokeStyle = options.borderColor;
		ctx.beginPath();
		ctx.rect(0, 0, options.region.width, options.region.height);
		ctx.stroke();
		// 画水平底纹线
		var spaceHeight = options.region.height / (options.horizontalLineCount + 1);
		spaceHeight = spaceHeight.toFixed(0);
		for (var i = 1; i <= options.horizontalLineCount; i++) {
			var y = spaceHeight * i;
			y = Math.floor(y) + 0.5;
			this.drawHLine(options.splitLineColor, 0, y, options.region.width,
					options.lineWidth, options.lineStyle);
		}
		// 画垂直底纹线
		var spaceWidth = options.region.width / (options.verticalLineCount + 1);
		for (var i = 1; i <= options.verticalLineCount; i++) {
			var w = spaceWidth * i;
			if (w * 10 % 10 == 0) {
				w += 0.5;
			}
			this.drawVLine(options.splitLineColor, w, 0, options.region.height,
					options.lineWidth, options.lineStyle);
		}
	},
	end : function(data) {
		this.ctx.restore();
		this.data = data;
		console.log(data);
		var me = this;
		var options = me.klOptions;
		var region = options.region;
		var volumeRegion = options.volume.region;
		var canvas = this.canvas;
		
		/**
		 * 获取当前显示时间
		 */
		function getCurTime(x) {
			var index = me.startIndex + getIndex(x);
			console.log(data);
			if (index >= me.data.ks.length) {
				index = me.data.ks.length - 1;
			} else if (index <= 0) {
				index = 0;
			}
			var ki = me.data.ks[index];
			return convertDate(ki.quoteTime, false);
		}
		/**
		 * 计算相对Y坐标
		 */
		function getY(price) {
			return (me.high - price) * region.height / (me.high - me.low);
		}
		// 添加十字线及TIP事件
		var clOptions = {
			leftTipSize : options.leftTipSize,
			rightTipSize : options.rightTipSize,
			bottomTipSize : options.bottomTipSize,
			relative : {
				middleY : region.height / 2,
				maxDiff : me.high,
				preClose : (me.high + me.low) / 2
			},
			getCrossPoint : function(ev) {
				var crossPoint = {
					x : getX(ev.offsetX),
					y : ev.offsetY
				};

				var timeText = getCurTime(ev.offsetX);
				return {
					crossPoint : crossPoint,
//					volumePoint : volumePoint,
					timeText : timeText
				};
			},
			triggerEventRanges : {
				chartRegion : region,
				volumeRegion : volumeRegion
			},
			// TIP参数
			tipOptions : {
				getTipHtml : function(ev) {
					return getTipHtml(ev.offsetX)
				},
				// 相对于region区域坐标
				position : {
					x : 20,
					y : 20
				},
				region : region,
				size : {
					width : 120,
					height : 160
				},
				opacity : 100,
				cssClass : ''
			},
			crossLinesColor : 'black'
		};
		// 获取柱子索引，索引从0开始
		function getIndex(x) {
			// 获取相对于K线区域坐标
			x -= region.x;
			if (x > 0) {
				var index = Math.ceil(x / (options.spaceWidth + options.barWidth)) - 1;
				var count = options.toIndex - options.startIndex + 1;
				if (index >= count) {
					index = count - 1;
				}
				return index;
			} else {
				return 0;
			}
		}
		// 获取当前位置坐标
		function getX(offsetX) {
			var index = getIndex(offsetX);
			var x = region.x + (options.spaceWidth + options.barWidth) * index
					+ (options.spaceWidth + options.barWidth) * 0.5;
			return x;
		}

		// TIP框显示内容
		function getTipHtml(x) {
			var index = me.startIndex + getIndex(x);
			if (index >= me.data.ks.length) {
				index = me.data.ks.length - 1;
			} else if (index <= 0) {
				index = 0;
			}
			var ki = me.data.ks[index];
			var zhangdie, zhangdiefu;
			if (ki.preClose == 0) {
				zhangdie = '-';
				zhangdiefu = '-';
			} else {
				zhangdie = (ki.close - ki.preClose).toFixed(2);
				zhangdiefu = zhangdie / ki.preClose;
				zhangdiefu = (zhangdiefu * 100).toFixed(2);
			}
			var tipHtml = '<div>' + convertDate(ki.quoteTime, true) + '</div>'
					+ '开盘价：<font color="' + getPriceColor(ki.close, ki.open)
					+ '">' + toMoney(ki.open) + '</font><br/>'
					+ '收盘价：<font color="' + getPriceColor(ki.close, ki.close)
					+ '">' + toMoney(ki.close) + '</font><br/>'
					+ '最高价：<font color="' + getPriceColor(ki.close, ki.high)
					+ '">' + toMoney(ki.high) + '</font><br/>'
					+ '最低价：<font color="' + getPriceColor(ki.close, ki.low)
					+ '">' + toMoney(ki.low) + '</font><br/>'
					+ '涨跌额：<font color="' + getColor(zhangdie) + '">'
					+ zhangdie + '</font><br/>' + '涨跌幅：<font color="'
					+ getColor(zhangdiefu) + '">' + zhangdiefu + '%'
					+ '</font><br/>' + '成交量：'
					+ bigNumberToText(ki.volume / 100) + '手<br/>' + '成交额：'
					+ bigNumberToText(ki.amount);

			return tipHtml;
		}
		var canvasPosition = getPageCoord(me.canvas);
		console.log(canvasPosition);
		// 图表上层显示圆点
		if (me.mask == null) {
			var id = me.canvas.id + '_mask';
			var maskCanvas = $id(id);
			var exists = (maskCanvas ? true : false);
			if (!exists) {
				maskCanvas = document.createElement('canvas');
				maskCanvas.id = id;
				document.body.appendChild(maskCanvas);
			}
			maskCanvas.width = me.canvas.width;
			maskCanvas.height = me.canvas.height;
			maskCanvas.style.width = me.canvas.style.width;
			maskCanvas.style.height = me.canvas.style.height;
			maskCanvas.style.left = canvasPosition.x + 'px';
			maskCanvas.style.top = canvasPosition.y  + 'px';
			maskCanvas.style.position = 'absolute';
			maskCanvas.style.zIndex = me.canvas.style.zIndex ? (me.canvas.style.zIndex + 1) : 1;
			maskCanvas.style.display = 'block';
		}

		addCrossLinesAndTipEvents(maskCanvas, clOptions);

		// 底部滑块
		if (me.slider == null) {
			// me.implement.paintPriceLine.call(me);
			var sliderOptions = options.slider;
			var id = canvas.id + '_slider';
			var sliderCanvas = $id(id);
			var exists = (sliderCanvas ? true : false);
			if (!exists) {
				sliderCanvas = document.createElement('canvas');
				sliderCanvas.id = id;
				document.body.appendChild(sliderCanvas);
			}
			var priceRegion = options.priceLine.region;
			sliderCanvas.width = priceRegion.width;
			sliderCanvas.height = priceRegion.height;
			var canvasPosition = getPageCoord(me.canvas);
			sliderCanvas.style.left = canvasPosition.x + priceRegion.x + 'px';
			sliderCanvas.style.top = canvasPosition.y + priceRegion.y + 'px';
			sliderCanvas.style.position = 'absolute';
			sliderCanvas.style.zIndex = me.canvas.style.zIndex
					? (me.canvas.style.zIndex + 1)
					: 1;
			sliderCanvas.style.display = 'block';

			var sliderOption = {
				region : {
					x : 0,
					y : 0,
					width : sliderCanvas.width,
					height : sliderCanvas.height,
					fillColor : '#a0d4f6'
				},
				bar : {
					width : 10,
					height : 35,
					borderColor : 'green',
					fillColor : 'orange'
				},
				value : {
					left : me.dataRanges.start,
					right : me.dataRanges.to
				},
				minBarDistance : sliderOptions.minBarDistance || 20,
				onPositionChanged : function(changeToValue) {
					drawKL({
								start : changeToValue.left,
								to : changeToValue.right
							});
					me.slider.drawSlider();
				},
				prePaint : function(ctx) {
				},
				touchFaultTolerance : 20
			};
			var slider = new Slider(sliderCanvas, sliderOption);
			this.slider = slider;
			slider.drawSlider();
			slider.addSliderEvents();
		}
	},
	paintItems : function() {
		var options = this.klOptions;
		var ctx = this.ctx;
		var region = options.region;
		ctx.lineWidth = options.lineWidth;
		// 此处不需要转换坐标
		ctx.translate(0.5, region.y);

		var maxDataLength = this.data.ks.length;
		var needCalcSpaceAndBarWidth = true;
		// 初始状态
		if (this.dataRanges == null) {
			// 计算dataRanges
			var dataCount = Math.ceil(region.width / (options.spaceWidth + options.barWidth));
			if (dataCount > maxDataLength)
				dataCount = maxDataLength;
			// 数据可视范围
			this.dataRanges = {
				start : 100 * (this.data.ks.length - dataCount) / this.data.ks.length,
				to : 100
			};
			needCalcSpaceAndBarWidth = false;
		}
		// 滑块区域
		var dataRanges = this.dataRanges;
		var tempIndex = Math.ceil(dataRanges.start / 100 * maxDataLength);
		var startIndex = tempIndex - 1 >= 0 ? tempIndex : 0;
		var toIndex = Math.ceil(dataRanges.to / 100 * maxDataLength);
		if (toIndex == maxDataLength) {
			toIndex = maxDataLength - 1;
		}
		this.startIndex = startIndex;
		this.toIndex = toIndex;
		var itemsCount = this.toIndex - this.startIndex + 1;
		if (needCalcSpaceAndBarWidth) {
			// 重新计算spaceWidth和barWidth属性
			function isOptionsOK() {
				return (options.spaceWidth + options.barWidth) * itemsCount <= region.width;
			}
			// 柱宽，间距
			var spaceWidth, barWidth;
			if (isOptionsOK()) {
				// 柱足够细了
				spaceWidth = 1;
				barWidth = (region.width - spaceWidth * itemsCount) / itemsCount;
				if (barWidth > 6) {
					spaceWidth = 3;
					barWidth = ((region.width - spaceWidth * itemsCount) / itemsCount);
				}
			} else {
				spaceWidth = 1;
				barWidth = (region.width - spaceWidth * itemsCount) / itemsCount;
				if (barWidth <= 3) {
					spaceWidth = 0;
					barWidth = (region.width - spaceWidth * itemsCount) / itemsCount;
				} else if (barWidth > 6) {
					spaceWidth = 5;
					barWidth = ((region.width - spaceWidth * itemsCount) / itemsCount);
				}
			}
			options.barWidth = barWidth;
			options.spaceWidth = spaceWidth;
		}

		var filteredData = [];
		for (var i = startIndex; i <= toIndex && i < maxDataLength; i++) {
			filteredData.push(this.data.ks[i]);
		}
		var high, low;
		filteredData.each(function(val, a, i) {
					if (i == 0) {
						high = val.high;
						low = val.low;
					} else {
						high = Math.max(val.high, high);
						low = Math.min(low, val.low);
					}
				});
		this.high = high;
		this.low = low;
		var ctx = this.ctx;
		var me = this;
		// 画移动平均线
		this.implement.paintMAs.call(this, filteredData, getY);
		/**
		 * 计算相对Y坐标
		 */
		function getY(price) {
			return (me.high - price) * region.height / (me.high - me.low);
		}
		/**
		 * 获取每根柱子的X坐标
		 */
		function getCandleX(i) {
			var result = i * (options.spaceWidth + options.barWidth)
					+ (options.spaceWidth + options.barWidth) * 0.5;
			result = Math.floor(result) + 0.5;
			return result;
		}

		var currentX = 0;
		var needCandleRect = options.barWidth > 1.5;
		var candleWidth = options.region.width / filteredData.length;
		if (candleWidth > options.barWidth + options.spaceWidth) {
			options.barWidth = candleWidth * 0.7;
			options.spaceWidth = candleWidth * 0.3;
		}

		/**
		 * 画蜡烛
		 */
		var drawCandle = function(ki, a, i) {
			var isRise = ki.close > ki.open; // 红 ? 绿
			var color = isRise ? riseColor : fallColor;
			var lineX = getCandleX(i);

			if (currentX == 0) {
				currentX = lineX;
			} else {
				if (lineX - currentX < 1)
					return;
			}

			currentX = lineX;
			var topY = getY(ki.high);
			var bottomY = getY(ki.low);
			if (needCandleRect) {
				ctx.fillStyle = color;
				ctx.strokeStyle = color;
				var candleY, candleHeight;
				// 柱子高度，开盘价与收盘价之间的高度
				if (isRise) {
					candleY = getY(ki.close);
					candleHeight = getY(ki.open) - candleY;
				} else {
					candleY = getY(ki.open);
					candleHeight = getY(ki.close) - candleY;
				}

				// 画线，high-->low
				ctx.beginPath();
				ctx.moveTo(lineX, topY);
				ctx.lineTo(lineX, bottomY);
				ctx.stroke();

				var candleX = lineX - options.barWidth / 2;
				ctx.beginPath();
				ctx.fillRect(candleX, candleY, options.barWidth, candleHeight);
			} else {
				ctx.strokeStyle = color;
				// 画线
				ctx.beginPath();
				ctx.moveTo(lineX, topY);
				ctx.lineTo(lineX, bottomY);
				ctx.stroke();
			}
		};
		// 画蜡烛
		filteredData.each(drawCandle);
		this.filteredData = filteredData;
		// 画y轴,Y轴参数
		var yAxisOptions = options.yAxis;
		yAxisOptions.region = yAxisOptions.region || {
			x : -region.x,
			y : 0.5,
			height : region.height - yAxisOptions.fontHeight,
			width : region.x - 3
		};
		var yAxisImp = new yAxis(yAxisOptions);
		// Y轴显示数据
		var yData = calcAxisValues(high, low, options.horizontalLineCount + 2);
		var yPainter = new Painter(this.canvas.id, yAxisImp, yData);
		yPainter.paint();
		// 画量
		this.implement.paintVolume.call(this, filteredData);
		// 画价格线
		this.implement.paintPriceLine.call(this);
	},
	paintPriceLine : function() {
		var ctx = this.ctx;
		ctx.lineWidth = this.klOptions.lineWidth;
		var options = this.klOptions.priceLine;
		var region = options.region;
		ctx.restore();
		ctx.save();

		ctx.translate(region.x, region.y);
		ctx.clearRect(0, 0, region.width, region.height);

		// 画水平底纹线
		var spaceHeight = (region.height / (options.horizontalLineCount + 1))
				.toFixed(0);
		for (var i = 1; i <= options.horizontalLineCount; i++) {
			var y = spaceHeight * i;
			if (y * 10 % 10 == 0) {
				y += 0.5;
			}
			this.drawHLine(options.splitLineColor, 0, y, region.width,
					this.klOptions.lineWidth, options.lineStyle);
		}
		// 画垂直底纹线
		var spaceWidth = (region.width / (options.verticalLineCount + 1))
				.toFixed(0);
		for (var i = 1; i <= options.verticalLineCount; i++) {
			var w = spaceWidth * i;
			if (w * 10 % 10 == 0) {
				w += 0.5;
			}
			this.drawVLine(options.splitLineColor, w, 0, region.height,
					this.klOptions.lineWidth, options.lineStyle);
		}
		var ks = this.data.ks;

		var ksLength = ks.length;
		// 价格区间
		var priceRange;
		// 寻找价格最大最小值
		ks.each(function(val, arr, i) {
					if (i == 0) {
						priceRange = {
							high : val.high,
							low : val.low
						};
					} else {
						priceRange.high = Math.max(priceRange.high, val.close);
						priceRange.low = Math.min(priceRange.low, val.close);
					}
				});
		if (priceRange.low > 1) {
			priceRange.low -= 1;
		}
		function getRangeX(i) {
			return i * region.width / ksLength;
		}
		function getRangeY(val) {
			return (priceRange.high - val) * region.height
					/ (priceRange.high - priceRange.low);
		}
		var currentX = 0;
		ks.each(function(val, arr, i) {
					var x = getRangeX(i);
					if (currentX == 0)
						currentX = x;
					else {
						if (x - currentX < 1)
							return;
					}
					currentX = x;
					var y = getRangeY(val.close);
					if (i == 0) {
						ctx.beginPath();
						ctx.moveTo(x, y);
					} else {
						ctx.lineTo(x, y);
					}
				});
		ctx.stroke();
		ctx.strokeStyle = options.borderColor;
		ctx.lineTo(region.width, region.height);
		ctx.lineTo(0, region.height);
		ctx.stroke();
		ctx.fillStyle = options.fillColor;
		ctx.globalAlpha = options.alpha;
		ctx.fill();

		ctx.beginPath();
		ctx.rect(0, 0, Math.floor(region.width) + 0.5, Math
						.floor(region.height)
						- 0.5);
		ctx.strokeStyle = options.borderColor;
		ctx.stroke();
		ctx.closePath();

		var yAxisOptions = options.yAxis;
		yAxisOptions.region = yAxisOptions.region || {
			x : -region.x,
			y : 0,
			height : region.height - yAxisOptions.fontHeight,
			width : region.x - 3
		};
		// 画y轴
		var yAxisImp = new yAxis(yAxisOptions);
		var yPriceData = calcAxisValues(priceRange.high, priceRange.low,
				(options.horizontalLineCount + 2));
		var yPainter = new Painter(this.canvas.id, yAxisImp, yPriceData);
		yPainter.paint();

		ctx.restore();
	},
	/**
	 * 移动平均线
	 * 
	 * @param {}
	 *            filteredData
	 * @param {}
	 *            funcGetY
	 */
	paintMAs : function(filteredData, funcGetY) {
		var ctx = this.ctx;
		var options = this.klOptions;
		var MAs = options.MAs;

		var me = this;
		MAs.each(function(val, arr, index) {
					var MA = calcMAPrices(me.data.ks, me.startIndex,
							filteredData.length, val.daysCount);
					val.values = MA;
					MA.each(function(val, arr, i) {
								if (val) {
									me.high = Math.max(me.high, val);
									me.low = Math.min(me.low, val);
								}
							});
				});

		MAs.each(function(val, arr, index) {
			var MA = val.values;
			ctx.strokeStyle = val.color;
			ctx.beginPath();
			var currentX = 0;
			MA.each(function(val, arr, i) {
						var x = i * (options.spaceWidth + options.barWidth)
								+ 0.5 * (options.spaceWidth + options.barWidth);
						if (!val)
							return;
						var y = funcGetY(val);
						if (y && i == 0) {
							ctx.moveTo(x, y);
						} else {
							ctx.lineTo(x, y);
						}
					});
			ctx.stroke();
		});
	},
	/**
	 * 成交量
	 * 
	 * @param {}
	 *            filteredData
	 */
	paintVolume : function(filteredData) {
		var ctx = this.ctx;
		var options = this.klOptions;
		// 画量线
		var volumeOptions = options.volume;
		var volumeRegion = volumeOptions.region;
		ctx.restore();
		ctx.save();
		ctx.translate(volumeRegion.x, volumeRegion.y);
		ctx.globalAlpha = 1;
		// 画水平底纹线
		var spaceHeight = volumeRegion.height
				/ (volumeOptions.horizontalLineCount + 1);
		for (var i = 1; i <= volumeOptions.horizontalLineCount; i++) {
			var y = spaceHeight * i;
			if (y * 10 % 10 == 0) {
				y += 0.5;
			}
			this.drawHLine(options.splitLineColor, 0, y, options.region.width,
					options.lineWidth, options.lineStyle);
		}
		// 画垂直底纹线
		var spaceWidth = options.region.width / (options.verticalLineCount + 1);
		for (var i = 1; i <= options.verticalLineCount; i++) {
			var w = spaceWidth * i;
			if (w * 10 % 10 == 0) {
				w += 0.5;
			}
			this.drawVLine(options.splitLineColor, w, 0, volumeRegion.height,
					options.lineWidth, options.lineStyle);
		}

		ctx.strokeStyle = options.borderColor;
		ctx.beginPath();
		ctx.rect(0, 0, volumeRegion.width, volumeRegion.height);
		ctx.stroke();

		var maxVolume = 0;

		filteredData.each(function(val, arr, i) {
					maxVolume = Math.max(maxVolume, val.volume);
				});
		maxVolume *= 1.1;
		function getVolumeY(v) {
			return volumeRegion.height - volumeRegion.height / maxVolume * v;
		}
		/**
		 * i : 索引
		 */
		function getVolumeX(i) {
			var volumeX = i * (options.spaceWidth + options.barWidth)
					+ (options.spaceWidth) * 0.5;
			volumeX = Math.round(volumeX) + 0.5;
			return volumeX;
		}
		ctx.globalAlpha = 1;
		filteredData.each(function(val, arr, i) {
					var x = getVolumeX(i);
					var y = getVolumeY(val.volume);
					ctx.beginPath();
					// 画柱子
					ctx.rect(x, y, options.barWidth, volumeRegion.height
									/ maxVolume * val.volume);
					ctx.fillStyle = val.close > val.open
							? riseColor
							: fallColor;
					ctx.fill();
				});

		// 画y轴
		var volumeLevel;
		var volumeUnit;
		if (maxVolume < 10000 * 100) {
			volumeLevel = 10000;
			volumeUnit = '万手';
		} else {
			volumeLevel = 10000 * 100;
			volumeUnit = '百万手';
		}

		var volumeScalers = [];
		var deltaHeight = maxVolume / (volumeOptions.horizontalLineCount + 1);
		for (var i = 0; i < volumeOptions.horizontalLineCount + 1; ++i) {
			var temp = ((maxVolume - (deltaHeight * i)) / volumeLevel)
					.toFixed(2);
			volumeScalers.push(temp);
		}
		volumeScalers.push(volumeUnit);
		var volumeScalerOptions = volumeOptions.yAxis;
		volumeScalerOptions.region = volumeScalerOptions.region || {
			x : -volumeRegion.x,
			y : 0.5,
			width : volumeRegion.x - 3,
			height : volumeRegion.height - volumeScalerOptions.fontHeight
		};
		var volumeScalerImp = new yAxis(volumeScalerOptions);
		var volumeScalerPainter = new Painter(this.canvas.id, volumeScalerImp,
				volumeScalers);
		volumeScalerPainter.paint();

		ctx.restore();
		ctx.save();

		// 画X轴
		var xAxisOptions = options.xAxis;
		xAxisOptions.region = {
			x : volumeRegion.x,
			y : options.region.height + options.volume.region.height,
			width : options.region.width,
			height : xAxisOptions.height
		};
		var xAxisImp = new xAxis(xAxisOptions);
		var xScalers = []; // X轴显示数据
		var stepLength = filteredData.length / (options.verticalLineCount + 1);
		if (stepLength < 1) {
			options.xAxis.scalerCount = filteredData.length;
			stepLength = 1;
		}
		xScalers.push(convertDate(filteredData[0].quoteTime, false).substr(2));

		for (var i = 1; i < options.verticalLineCount + 2; i++) {
			var index = Math.ceil(i * stepLength);
			if (index >= filteredData.length) {
				index = filteredData.length - 1;
			}
			var quoteTime = convertDate(filteredData[index].quoteTime, false);
			quoteTime = quoteTime.substr(2);
			xScalers.push(quoteTime);
		}
		var xPainter = new Painter(this.canvas.id, xAxisImp, xScalers);
		xPainter.paint();
	}
};
// @charset "utf-8";
/**
 * 类的描述 TODO
 * 
 * @Filename FenshiChart.js
 * @author Rocky
 * @Time 2014-3-24 下午04:19:56
 * @Version v1.0.0
 */

function FenshiChart(options, dataOptions) {
	this.canvas = options.canvas;
	this.options = options;
	this.dataOptions = dataOptions;
//	console.log(dataOptions);
	this.ctx = this.canvas.getContext('2d');
	window.riseColor = options.riseColor;
	window.fallColor = options.fallColor;
	window.normalColor = options.normalColor;
}

FenshiChart.prototype = {
	clearCanvas : function() {
		var ctx = this.ctx;
		var clearPart = {
			width : this.canvas.width,
			height : this.canvas.height
		};
		ctx.clearRect(0, 0, clearPart.width * devicePixelRatio,
				clearPart.height * devicePixelRatio);

//		ctx.save();
	},
	paint : function(data) {
		this.clearCanvas();
		this.paintChart(data);
		this.paintXAxis(data)
		this.paintVolume(data);
		// 绘制价格线
	},
	/**
	 * 绘制曲线图表
	 * 
	 * @param {}
	 *            data
	 */
	paintChart : function(data) {
		var minsChartOptions = this.options.minsChart;
		var region = minsChartOptions.region;
		var volumeRegion = this.options.volume.region;
		var ctx = this.ctx;
		ctx.beginPath();
		ctx.strokeStyle = minsChartOptions.borderColor;
		ctx.rect(region.x, region.y, region.width, region.height);
		ctx.stroke();

		// 画水平底纹线
		var middleIndex = (minsChartOptions.horizontalLineCount + minsChartOptions.horizontalLineCount % 2) / 2;
		var splitCount = minsChartOptions.horizontalLineCount + 1;
		for (var i = 1; i <= minsChartOptions.horizontalLineCount; ++i) {
			var hLineWidth = (i == middleIndex
					? minsChartOptions.middleLineWidth
					: minsChartOptions.otherLineWidth);
			var hLineStyle = (i == middleIndex
					? minsChartOptions.middleLineStyle
					: minsChartOptions.otherLineStyle);
			var y = region.y + region.height * i / splitCount;
			y = Math.floor(y) + 0.5;
			var lineParam = {
				ctx : ctx,
				x0 : region.x,
				y0 : y,
				x1 : region.x + region.width,
				y1 : y,
				color : hLineStyle,
				lineWidth : hLineWidth
			};
			line(lineParam);
		}
		// 画垂直底纹线
		splitCount = minsChartOptions.verticalLineCount + 1;
		for (var i = 1; i <= minsChartOptions.verticalLineCount; ++i) {
			var x = region.x + region.width * i / splitCount;
			x = Math.floor(x) + 0.5;
			var lineParam = {
				ctx : ctx,
				x0 : x,
				y0 : region.y,
				x1 : x,
				y1 : region.y + region.height,
				color : minsChartOptions.otherLineStyle,
				lineWidth : minsChartOptions.otherLineWidth
			};
			line(lineParam);
		}
		// 价格线
		var lineOptions = {
			region : region,
			totalDotsCount : this.options.minsChart.totalDotsCount,
			getDataLength : function() {
				return this.data.items.length;
			},
			getItemValue : function(item) {
				return item.price;
			},
			middleValue : data.quote.preClose, // 通常是昨收
			lineColor : minsChartOptions.priceLineColor,
			lineName : 'priceLine',
			lineWidth : lineWidth,
			maxPrice : data.quote.maxPrice,
			minPrice : data.quote.minPrice
		};
		var linePainterImp = new LinePainter(lineOptions);
		var priceLinePainter = new Painter(this.canvas.id, linePainterImp, {
					items : data.mins
				});
		priceLinePainter.paint();
		// Y轴
		var yOptions = minsChartOptions.yScalerLeft;
		var preClose = data.quote.preClose;
		var me = this;
		var canvasPosition = getPageCoord(me.canvas);
		yOptions.color = function(val) {
			return val > preClose ? riseColor : (val == preClose
					? normalColor
					: fallColor);
		};
		var scalerLeft = [];
		var scalerRight = [];
		var min = preClose - priceLinePainter.maxDiff;
		var space = priceLinePainter.maxDiff * 2 / (minsChartOptions.horizontalLineCount + 1);
		for (var i = minsChartOptions.horizontalLineCount + 1; i >= 0; i--) {
			var val = min + i * space;
			if(val >= 1000 ) {
				scalerLeft.push(val.toFixed(0));
			} else {
				scalerLeft.push(val.toFixed(2));
			}
			var percent = (val - preClose) * 100 / preClose;
			scalerRight.push(percent.toFixed(2) + '%');
		}
		var yMins = new yAxis(yOptions);
		var yAxisPainter = new Painter(this.canvas.id, yMins, scalerLeft);
		yAxisPainter.paint();

		var yPercentOptions = minsChartOptions.yScalerRight;
		yPercentOptions.color = function(val) {
			return (val == '0.00%' ? normalColor : (parseFloat(val) < 0
					? fallColor
					: riseColor));
		}
		var yPercent = new yAxis(yPercentOptions);

		var yPercentPainter = new Painter(this.canvas.id, yPercent, scalerRight);
		yPercentPainter.paint();
		// 均线
		if (this.options.needPaintAvgPriceLine) {
			var items = [];
			data.mins.each(function(item) {
						items.push(item.average);
					});
			lineOptions.lineColor = minsChartOptions.avgPriceLineColor;
			lineOptions.lineWidth = lineWidth;
			lineOptions.maxPrice = data.quote.maxPrice;
			lineOptions.getItemValue = function(item) {
				return item;
			};
			linePainterImp = new LinePainter(lineOptions);
			var avgPainter = new Painter(this.canvas.id, linePainterImp, {
						items : items
					});
			avgPainter.paint();
		}

		var delta = region.width / minsChartOptions.totalDotsCount;

		// 获取柱子索引，索引从0开始
		function getIndex(x, newData) {
			// 获取相对于分时线区域坐标
			x -= region.x;

			if (x > 0) {
				var index = Math.round(x / delta);
				var count = minsChartOptions.totalDotsCount;
				if (index >= count) {
					index = count - 1;
				}
				if (index >= newData.mins.length) {
					index = newData.mins.length - 1;
				} else if (index <= 0) {
					index = 0;
				}
				return index;
			} else {
				return 0;
			}
		}

		var quote = data.quote;
		var priceDiffMax = Math.max(Math.abs(quote.preClose - quote.maxPrice));

		function getRealY(x, priceType, newData) {
			var relativeY;
			var index = getIndex(x, newData);
			if (index >= 0 && index < newData.mins.length) {
				if (priceType == 'price') {
					relativeY = newData.mins[index].price;
				} else if (priceType == 'average') {
					relativeY = newData.mins[index].average;
				}
			}
			var diff = relativeY - preClose;
			var middleY = region.height / 2;
			var scale = diff / priceLinePainter.maxDiff;
			var y = scale * middleY;
			return middleY - y;
		}

		// 获取当前位置坐标
		function getX(offsetX, newData) {
			var index = getIndex(offsetX, newData);
			var x = region.x + delta * index + delta * 0.5;
			return parseInt(x);
		}
		// TIP框显示内容
		function getTipHtml(x, newData) {
			var index = getIndex(x, newData);
			if (index >= newData.mins.length) {
				index = newData.mins.length - 1;
			} else if (index <= 0) {
				index = 0;
			}
			var min = newData.mins[index];
			var zhangdie, zhangdiefu;
			if (newData.quote.preClose == 0) {
				zhangdie = '-';
				zhangdiefu = '-';
			} else {
				zhangdie = (min.price - newData.quote.preClose).toFixed(2);
				zhangdiefu = zhangdie / newData.quote.preClose;
				zhangdiefu = (zhangdiefu * 100).toFixed(2) + '%';
			}

			function getColor(price) {
				if (isNaN(price)) {
					return;
				}
				var color = price > preClose ? "red" : "green";
				if (price == preClose) {
					color = "black";
				}
				return color;
			}

			var obj = {
				time : min.minute,
				preClose : min.preClose,
				price : min.price,
				average : min.average,
				zhangdie : zhangdie,
				zhangdiefu : zhangdiefu,
				volume : min.volume,
				maxPrice : newData.quote.maxPrice,
				minPrice : newData.quote.minPrice
			};
			me.dataOptions.updateTip(obj);
		}

		// 图表上层显示圆点
		if (me.mask == null) {
			var id = me.canvas.id + '_mask';
			var maskCanvas = $id(id);
			var exists = (maskCanvas ? true : false);
			if (!exists) {
				maskCanvas = document.createElement('canvas');
				maskCanvas.id = id;
				me.canvas.parentNode.appendChild(maskCanvas);
			}
			maskCanvas.width = me.canvas.width;
			maskCanvas.height = me.canvas.height;
			maskCanvas.style.width = me.canvas.style.width;
			maskCanvas.style.height = me.canvas.style.height;
			maskCanvas.style.left = canvasPosition.x + 'px';
			maskCanvas.style.top = canvasPosition.y + 'px';
			maskCanvas.style.position = 'absolute';
			maskCanvas.style.zIndex = me.canvas.style.zIndex
					? (me.canvas.style.zIndex + 1)
					: 1;
			maskCanvas.style.display = 'block';
		}

		function getCurTime(x, newData) {
			var index = getIndex(x, newData);
			if (index >= newData.mins.length) {
				index = newData.mins.length - 1;
			} else if (index <= 0) {
				index = 0;
			}
			var min = newData.mins[index];
			return min.minute;
		}

		function getVolumeY(x, newData) {
			var index = getIndex(x, newData);
			var maxVolume = 0;
			newData.mins.each(function(item) {
						maxVolume = Math.max(maxVolume, item.volume);
					});

			// maxVolume *= 1.1;
			var volumeY = volumeRegion.y + (maxVolume - newData.mins[index].volume) * volumeRegion.height / maxVolume;
			return volumeY;
		}
		var clOptions = {
			leftTipSize : me.options.leftTipSize,
			rightTipSize : me.options.rightTipSize,
			bottomTipSize : me.options.bottomTipSize,
			relative : {
				middleY : region.height / 2,
				maxDiff : priceLinePainter.maxDiff,
				preClose : preClose
			},
			getCrossPoint : function(ev, newData) {
				var crossPoint = {
					x : getX(ev.offsetX, newData),
					y : getRealY(ev.offsetX, 'price', newData)
				};
				var pricePoint = {
					x : getX(ev.offsetX, newData),
					y : getRealY(ev.offsetX, 'price', newData),
					color : minsChartOptions.priceLineColor
				};
				var volumePoint = {
					x : getX(ev.offsetX, newData),
					y : getVolumeY(ev.offsetX, newData),
					color : minsChartOptions.priceLineColor
				}
				var averagePoint = {
					x : getX(ev.offsetX, newData),
					y : getRealY(ev.offsetX, 'average', newData),
					color : minsChartOptions.avgPriceLineColor
				};

				var timeText = getCurTime(ev.offsetX, newData);
				return {
					crossPoint : crossPoint,
					pricePoint : pricePoint,
					averagePoint : averagePoint,
					volumePoint : volumePoint,
					timeText : timeText
				};
			},
			triggerEventRanges : {
				chartRegion : region,
				volumeRegion : volumeRegion
			},
			crossLineWidth : lineWidth,
			tipOptions : {
				lineType : 'stockminute',
				getTipHtml : function(ev, newData) {
					return getTipHtml(ev.offsetX, newData);
				},
				// 相对于region区域坐标
				position : {
					x : 20,
					y : 10
				},
				region : region,
				size : {
					width : 60,
					height : 220
				},
				opacity : 100,
				cssClass : ''
			},
			crossLinesColor : 'gray'
		};
//		addCrossLinesAndTipEvents(maskCanvas, clOptions, data);

		function setInitTip() {
			var min = data.mins[data.mins.length - 1];
			var zhangdie, zhangdiefu;
			if (data.quote.preClose == 0) {
				zhangdie = '-';
				zhangdiefu = '-';
			} else {
				zhangdie = (min.price - data.quote.preClose).toFixed(2);
				zhangdiefu = zhangdie / data.quote.preClose;
				zhangdiefu = (zhangdiefu * 100).toFixed(2) + '%';
			}
			var date = String(data.quote.date).split(';')[0];

			var obj = {
				zhangdie : zhangdie,
				zhangdiefu : zhangdiefu,
				time : '20' +date.substr(0, 2) + '-'
						+ date.substr(2, 2) + '-' + date.substr(4, 2) + '  ' + min.minute,
				volume : data.quote.volume,
				maxPrice : data.quote.maxPrice.toFixed(2),
				minPrice : data.quote.minPrice.toFixed(2),
				turnover : data.quote.turnover ? data.quote.turnover.toFixed(2) + '%' : "-",
				average : min.average.toFixed(2),
				price : min.price.toFixed(2),
				curVolume : min.volume
			};		
			me.dataOptions.setInitTip(obj);
		}
		setInitTip();
	},
	/**
	 * 绘制成交量
	 * 
	 * @param {}
	 *            data
	 */
	paintVolume : function(data) {
		var ctx = this.ctx;
		var options = this.options.volume;
		ctx.beginPath();
		ctx.strokeStyle = options.borderColor;

		ctx.rect(options.region.x, options.region.y, options.region.width, options.region.height);
		ctx.stroke();

		var volumeRegion = options.region;
		// 画水平底纹线
		var firstLineParam = {
			ctx : ctx,
			x0 : volumeRegion.x,
			y0 : Math.floor(volumeRegion.y + volumeRegion.height / 3) + 0.5,
			x1 : volumeRegion.width + volumeRegion.x,
			y1 : Math.floor(volumeRegion.y + volumeRegion.height / 3) + 0.5,
			color : options.splitLineColor,
			lineWidth : options.splitLineWidth
		}
		line(firstLineParam);

		var secondLineParam = {
			ctx : ctx,
			x0 : volumeRegion.x,
			y0 : Math.floor(volumeRegion.y + volumeRegion.height / 3 * 2) + 0.5,
			x1 : volumeRegion.width + volumeRegion.x,
			y1 : Math.floor(options.region.y + volumeRegion.height / 3 * 2) + 0.5,
			color : options.splitLineColor,
			lineWidth : options.splitLineWidth
		};
		line(secondLineParam);

		// 画垂直底纹线
		var splitCount = options.verticalLineCount + 1;
		for (var i = 1; i < splitCount; ++i) {
			var x = volumeRegion.x + volumeRegion.width * i / splitCount;
			x = Math.floor(x) + 0.5;
			var lineParam = {
				ctx : ctx,
				x0 : x,
				y0 : volumeRegion.y,
				x1 : x,
				y1 : volumeRegion.y + volumeRegion.height,
				color : options.splitLineColor,
				lineWidth : options.splitLineWidth
			};
			line(lineParam);
		}

		options.getDataLength = function() {
			return this.data.items.length
		};
		var volumePainterImp = new VolumePainter(options);
		var volumePainter = new Painter(this.canvas.id, volumePainterImp, {
					items : data.mins
				});
		volumePainter.paint();

		var maxVolume = volumePainter.maxVolume;
		var unit;
		if (maxVolume < 10000) {
			maxVolume = maxVolume;
			unit = '(手)';
		} else if (maxVolume > 10000 && maxVolume < 1000000) {
			maxVolume = maxVolume / 100;
			unit = '(百手)';
		} else {
			maxVolume = maxVolume / 10000;
			unit = '(万手)';
		}

		var scalers = [maxVolume.toFixed(0), (maxVolume / 3 * 2).toFixed(0), (maxVolume / 3).toFixed(0)];
		scalers.push(unit);
		var yScalerL = new yAxis(options.yScalerLeft);
		var yAxisPainterL = new Painter(this.canvas.id, yScalerL, scalers);
		yAxisPainterL.paint();

		var yScalerR = new yAxis(options.yScalerRight);
		yAxisPainterR = new Painter(this.canvas.id, yScalerR, scalers);
		yAxisPainterR.paint();
	},
	/**
	 * 绘制X轴
	 * 
	 * @param {}
	 *            data
	 */
	paintXAxis : function(data) {
		var xScaler = this.options.xScaler;
		var xAxisImp = new xAxis(xScaler);
		var xAxisPainter = new Painter(this.canvas.id, xAxisImp, xScaler.data);
		xAxisPainter.paint();
	},
	/**
	 * 绘制价格线
	 * 
	 * @param {}
	 *            data
	 */
	paintPriceLine : function(data) {
		var me = this;

		var priceLineOptions = me.options.priceLine;
		priceLineOptions.isNeedFill = true;
		priceLineOptions.getDataLength = function() {
			return me.data.items.length;
		};
		priceLineOptions.getItemValue = function(item) {
			return item.price;
		};
		priceLineOptions.maxPrice = data.quote.maxPrice;
		priceLineOptions.minPrice = data.quote.minPrice;
		priceLineOptions.lineWidth = lineWidth;
		priceLineOptions.middleValue = data.quote.preClose;
		priceLineOptions.totalDotsCount = me.options.minsChart.totalDotsCount;

		var region = priceLineOptions.region;
		var ctx = this.ctx;
		ctx.beginPath();
		ctx.strokeStyle = priceLineOptions.borderColor;
		ctx.rect(Math.floor(region.x) + 0.5, Math.floor(region.y) + 0.5, Math
						.floor(region.width), Math.floor(region.height));
		ctx.stroke();

		var linePainterImp = new LinePainter(priceLineOptions);
		var priceLinePainter = new Painter(this.canvas.id, linePainterImp, {
					items : data.mins
				});
		priceLinePainter.paint();

		// 底部滑块
		if (me.slider == null) {
			var sliderOptions = me.options.slider;
			var id = canvas.id + '_slider';

			var sliderCanvas = $id(id);
			var exists = (sliderCanvas ? true : false);
			if (!exists) {
				sliderCanvas = document.createElement('canvas');
				sliderCanvas.id = id;
				document.body.appendChild(sliderCanvas);
			}
			var priceRegion = priceLineOptions.region;
			sliderCanvas.width = priceRegion.width / devicePixelRatio;
			sliderCanvas.height = priceRegion.height / devicePixelRatio;
			var canvasPosition = getPageCoord(me.canvas);
			sliderCanvas.x = (canvasPosition.x + priceRegion.x)
					/ devicePixelRatio;
			sliderCanvas.y = (canvasPosition.y + priceRegion.y)
					/ devicePixelRatio;
			sliderCanvas.style.left = canvasPosition.x + priceRegion.x + 'px';
			sliderCanvas.style.top = (canvasPosition.y + priceRegion.y
					/ devicePixelRatio)
					+ 'px';
			sliderCanvas.style.position = 'absolute';
			sliderCanvas.style.zIndex = me.canvas.style.zIndex
					? (me.canvas.style.zIndex + 1)
					: 1;
			sliderCanvas.style.display = 'block';

			if (!me.dataRanges) {
				me.dataRanges = {
					start : 0,
					to : 100
				}
			}
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
					drawFs(data, {
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
	}
}
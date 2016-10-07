// @charset "utf-8";
/**
 * 类的描述 TODO
 * 
 * @Filename FenshiChart.js
 * @author Rocky
 * @Time 2014-3-24 下午04:19:56
 * @Version v1.0.0
 */

function FenshiChart(canvasId, options) {
	this.canvas = $id(canvasId);
	this.options = options;
	this.ctx = this.canvas.getContext('2d');
	window.riseColor = options.riseColor;
	window.fallColor = options.fallColor;
	window.normalColor = options.normalColor;
}

FenshiChart.prototype = {
	clearCanvas : function() {
		this.canvas.width += 0;
	},
	paint : function(data) {
		this.clearCanvas();
		this.paintChart(data);
		this.paintXAxis(data)
		this.paintVolume(data);
		// 绘制价格线
		this.paintPriceLine(data);
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
		ctx.rect(region.x, region.y, Math.floor(region.width), region.height);
		ctx.stroke();

		// 画水平底纹线
		var middleIndex = (minsChartOptions.horizontalLineCount + minsChartOptions.horizontalLineCount % 2)	/ 2;
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
			scalerLeft.push(val.toFixed(3));
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
		function getIndex(x) {
			// 获取相对于分时线区域坐标
			x -= region.x;
			if (x > 0) {
				var index = Math.ceil(x / delta);
				var count = minsChartOptions.totalDotsCount;
				if (index >= count) {
					index = count - 1;
				}
				console.log(index, data.mins.length);
				if(index >= data.mins.length) {
					index = data.mins.length - 1;
				}
				return index;
			} else {
				return 0;
			}
		}

		var quote = data.quote;
		var priceDiffMax = Math.max(Math.abs(quote.preClose - quote.maxPrice));
		
		function getRealY(x, priceType) {
			var relativeY;
//			var index = Math.ceil((x - region.x) * minsChartOptions.totalDotsCount	/ region.width);
			var index = getIndex(x);
			if (index >= 0 && index < data.mins.length) {
				if(priceType == 'price') {
					relativeY = data.mins[index].price;
				} else if(priceType == 'average'){
					relativeY = data.mins[index].average;
				}
			}
			var diff = relativeY - preClose;
			var middleY = region.height / 2;
			var scale = diff / priceLinePainter.maxDiff;
			var y = scale * region.height / 2;		
			return middleY - y ;
		}
                
		// 获取当前位置坐标
		function getX(offsetX) {
			var index = getIndex(offsetX);
			console.log(offsetX);
			var x = region.x + delta * index + delta * 0.5;
			return parseInt(x);
		}
		// TIP框显示内容
		function getTipHtml(x) {
			var index = getIndex(x);
			if (index >= data.mins.length) {
				index = data.mins.length - 1;
			} else if (index <= 0) {
				index = 0;
			}
			var min = data.mins[index];
			var zhangdie, zhangdiefu;
			if (data.quote.preClose == 0) {
				zhangdie = '-';
				zhangdiefu = '-';
			} else {
				zhangdie = (min.price - data.quote.preClose).toFixed(2);
				zhangdiefu = zhangdie / data.quote.preClose;
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
			
			var tipHtml = "<div align='center'>时间</div>"
					+ "<div align='center'>" + min.minute + "</div>"
					+ "<div align='center'>价格 </div>"
					+ "<div align='center'><font style='color:"
					+ getColor(parseFloat(min.price)) + "'>" + min.price.toFixed(2)
					+ "</font></div>" + "<div align='center'>均价</div>"
					+ "<div align='center'><font style='color:"
					+ getColor(parseFloat(min.average)) + "'>" + min.average.toFixed(2)
					+ "</font></div>" + "<div align='center'>涨跌 </div>"
					+ "<div align='center'><font style='color:"
					+ getColor(parseFloat(min.price)) + "'>" + zhangdie
					+ "</font></div>" + "<div align='center'>涨跌幅</div>"
					+ "<div align='center'><font style='color:"
					+ getColor(parseFloat(min.price)) + "'>" + zhangdiefu
					+ "</font></div>" + "<div align='center'>分时量</div>" 
					+ "<div align='center'><font style='color:" + minsChartOptions.priceLineColor +"'>"
					+ parseInt(min.volume / 100) + "</font></div>";
			return tipHtml;
		}
		
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
			maskCanvas.height = region.height + me.options.volume.region.height + me.options.xScaler.region.height;
			maskCanvas.style.left = canvasPosition.x + 'px';
			maskCanvas.style.top = canvasPosition.y  + 'px';
			maskCanvas.style.position = 'absolute';
			maskCanvas.style.zIndex = me.canvas.style.zIndex ? (me.canvas.style.zIndex + 1) : 1;
			maskCanvas.style.display = 'block';
		}
		
		function getCurTime(x) {
			var index = getIndex(x);
			if (index >= data.mins.length) {
				index = data.mins.length - 1;
			} else if (index <= 0) {
				index = 0;
			}
			var min = data.mins[index];
			return min.minute;
		}
		
		function getVolumeY(x) {
			var index = getIndex(x);
			var maxVolume = 0;
			data.mins.each(function(item) {
				maxVolume = Math.max(maxVolume, item.volume);
			});

			maxVolume *= 1.1;
			var volumeY = volumeRegion.y + (maxVolume - data.mins[index].volume) * volumeRegion.height / maxVolume;
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
			getCrossPoint : function(ev) {
				var crossPoint = {
					x : getX(ev.offsetX ),
					y : getRealY(ev.offsetX, 'price')
				};
				var pricePoint = {
					x : getX(ev.offsetX),
					y : getRealY(ev.offsetX, 'price'),
					color : minsChartOptions.priceLineColor
				};
				var volumePoint = {
					x : getX(ev.offsetX),
					y : getVolumeY(ev.offsetX),
					color : minsChartOptions.priceLineColor
				}
				var averagePoint = {
					x : getX(ev.offsetX),
					y : getRealY(ev.offsetX, 'average'),
					color : minsChartOptions.avgPriceLineColor
				};
				
				var timeText = getCurTime(ev.offsetX);
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
				getTipHtml : function(ev) {
					return getTipHtml(ev.offsetX)
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
			crossLinesColor : 'black'
		};
	
		addCrossLinesAndTipEvents(maskCanvas, clOptions);
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
		var volumeX = Math.floor(options.region.x) + 0.5;
		var volumeY = Math.floor(options.region.y) + 0.5;
		ctx.rect(volumeX, volumeY, Math.floor(options.region.width), options.region.height);
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
			y0 : volumeRegion.y + volumeRegion.height / 3 * 2,
			x1 : volumeRegion.width + volumeRegion.x,
			y1 : options.region.y + volumeRegion.height / 3 * 2,
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
		if (maxVolume / 1000000 > 100) {
			maxVolume = maxVolume / 1000000;
			unit = '0(万手)';
		} else if (maxVolume / 10000 > 100) {
			maxVolume = maxVolume / 10000;
			uint = '0(百手)'
		} else {
			maxVolume = maxVolume / 100;
			uint = '0(手)'
		}

		var scalers = [maxVolume.toFixed(0), (maxVolume / 3 * 2).toFixed(0), (maxVolume / 3).toFixed(0)];
		scalers.push(uint);

		var yScalerL = new yAxis(options.yScalerLeft);
		var yAxisPainter = new Painter(this.canvas.id, yScalerL, scalers);
		yAxisPainter.paint();

		var yScalerR = new yAxis(options.yScalerRight);
		yAxisPainter = new Painter(this.canvas.id, yScalerR, scalers);
		yAxisPainter.paint();
	},
	/**
	 * 绘制X轴
	 * 
	 * @param {} data
	 */
	paintXAxis : function(data) {
		var xScaler = this.options.xScaler;
		var xAxisImp = new xAxis(xScaler);
		var xAxisPainter = new Painter(this.canvas.id, xAxisImp, xScaler.data);
		xAxisPainter.paint();
	},
	/**
	 * 绘制价格线
	 * @param {} data
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
		ctx.rect(Math.floor(region.x) + 0.5, Math.floor(region.y) + 0.5, Math.floor(region.width), Math.floor(region.height));
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
			sliderCanvas.width = priceRegion.width;
			sliderCanvas.height = priceRegion.height;
			var canvasPosition = getPageCoord(me.canvas);
			sliderCanvas.style.left = canvasPosition.x + priceRegion.x + 'px';
			sliderCanvas.style.top = canvasPosition.y + priceRegion.y + 'px';
			sliderCanvas.style.position = 'absolute';
			sliderCanvas.style.zIndex = me.canvas.style.zIndex ? (me.canvas.style.zIndex + 1) : 1;
			sliderCanvas.style.display = 'block';

			if(!me.dataRanges) {
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
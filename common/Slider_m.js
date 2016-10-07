// @charset "utf-8";
/**
 * 类的描述 滑块，控制K线显示范围
 * 
 * @Filename Slider.js
 * @author Rocky
 * @Time 2014-2-26 下午04:35:33
 * @Version v1.0.0
 */

/**
 * 
 * @param {} canvas 画布对象
 * @param {} options { 
 * 				region : { 	x : 0, 
 * 							y : 0, 
 * 							width : canvas.width, 
 * 							height : canvas.height,
 * 							borderColor : 'black', 
 * 							fillColor : 'snow'
 * 						}, 
 *            	bar : ptions.bar || { 
 *            							width : 25, 
 *            							height : 35, 
 *            							borderColor : 'black',
 *            							fillColor : 'snow'
 *            						},
 *              value : { 	
 *              			left : me.dataRanges.start, 
 *              			right : me.dataRanges.to 
 *              		}, 
 *              minBarDistance : options.minBarDistance || 20, //两个滑块间的最小距离 
 *              onPositionChanged : function(changeToValue) {},
 *            	prePaint : function(ctx) { } 
 *           }
 *           参数列表 {
 *           			区域（包括起始点，宽高，边框颜色，填充颜色），
 *           			滑块属性（宽高，边框色，填充色），
 *           			值（滑块左侧位置，右侧位置，
 *           			滑块最小间距，
 *           			位置改变时执行函数，
 *           			prePaint 之前画的
 *           		}
 */
function Slider(canvas, options) {
	this.canvas = canvas;
	this.relativePoint = getPageCoord(canvas);
	this.ctx = this.canvas.getContext('2d');
	this.region = options.region;
	this.bar = options.bar;
	this.value = options.value;
	this.minBarDistance = options.minBarDistance;
	this.onPositionChanged = options.onPositionChanged;
	this.prePaint = options.prePaint;
	this.isTouchDevice = isTouchDevice();
	this.calcPositions();
}

Slider.prototype = {
	/**
	 * 计算左右滑块位置
	 */
	calcPositions : function() {
		var width = this.region.width - this.bar.width;
		this.leftPosition = Math.floor(this.value.left * width / 100 + this.bar.width / 2) + 0.5;
		this.rightPosition = Math.floor(this.value.right * width / 100 + this.bar.width / 2) + 0.5;
		if(typeof this.preValue  == 'undefined') {
			this.preValue = this.value;
		}
	},
	/**
	 * 绘制滑块区域
	 */
	drawSlider : function() {
		var canvas = this.canvas;
		var ctx = this.ctx;
		ctx.save();
		var region = this.region;
		var bar = this.bar;
		var leftPosition = this.leftPosition;
		var rightPosition = this.rightPosition;
		ctx.clearRect(region.x - 1, region.y - 1, region.width + 1, region.height + 1);
		ctx.translate(region.x - 0.5, region.y - 0.5);

		this.calcPositions();
		if (typeof this.prePaint == 'function') {
			this.prePaint(ctx);
		}

		ctx.lineWidth = lineWidth;

		ctx.strokeStyle = region.borderColor;
		ctx.beginPath();
		ctx.moveTo(Math.floor(region.x + leftPosition) + 0.5, Math.floor(region.y + region.height) - 0.5);
		ctx.lineTo(Math.floor(region.x + leftPosition) + 0.5, Math.floor(region.y + region.height - (region.height - bar.height) / 2) - 0.5);
		ctx.stroke();

		ctx.strokeStyle = region.borderColor;
		ctx.beginPath();
		ctx.moveTo(Math.floor(region.x + leftPosition) + 0.5, Math.floor(region.y + (region.height - bar.height) / 2)) + 0.5;
		ctx.lineTo(Math.floor(region.x + leftPosition) + 0.5, Math.floor(region.y) + 0.5);
		ctx.stroke();

		ctx.strokeStyle = region.borderColor;
		ctx.beginPath();
		ctx.moveTo(Math.floor(region.x + region.width) + 0.5, Math.floor(region.y) + 0.5);
		ctx.lineTo(Math.floor(region.x + region.width) + 0.5, Math.floor(region.y + region.height) - 0.5);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.moveTo(Math.floor(region.x + rightPosition) + 0.5, Math.floor(region.y + region.height) - 0.5);
		ctx.lineTo(Math.floor(region.x + rightPosition) + 0.5, Math.floor(region.y + region.height - (region.height - bar.height) / 2) + 0.5);
		ctx.stroke();
		
		ctx.strokeStyle = region.borderColor;
		ctx.beginPath();
		ctx.moveTo(Math.floor(region.x + rightPosition) + 0.5, Math.floor(region.y) + 0.5);
		ctx.lineTo(Math.floor(region.x + rightPosition) + 0.5, Math.floor(region.y + (region.height - bar.height) / 2) + 0.5);
		ctx.stroke();

		// 绘制拖拽区
		ctx.beginPath();
		ctx.fillStyle = region.fillColor;
		ctx.globalAlpha = 0.3;
		ctx.rect(Math.floor(region.x + leftPosition) + 0.5, Math.floor(region.y) + 0.5, Math.floor(rightPosition - leftPosition) + 0.5, Math.floor(region.height) + 0.5);
		ctx.closePath();
		ctx.fill();
		ctx.globalAlpha = 1;

		// 绘制左侧小滑块
		ctx.strokeStyle = bar.borderColor;
		ctx.fillStyle = bar.fillColor;
		ctx.beginPath();
		var leftBarRegion = {
			x : region.x + leftPosition - bar.width / 2,
			y : region.y + (region.height - bar.height) / 2,
			width : bar.width,
			height : bar.height
		};
		ctx.rect(leftBarRegion.x, leftBarRegion.y, leftBarRegion.width, leftBarRegion.height);
		this.leftBarRegion = leftBarRegion;
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		// 绘制右侧小滑块
		ctx.strokeStyle = bar.borderColor;
		ctx.fillStyle = bar.fillColor;
		ctx.beginPath();

		var rightBarRegion = {
			x : region.x + rightPosition - bar.width / 2,
			y : region.y + (region.height - bar.height) / 2,
			width : bar.width,
			height : bar.height
		};
		ctx.rect(rightBarRegion.x, rightBarRegion.y, rightBarRegion.width,
				rightBarRegion.height);
		this.rightBarRegion = rightBarRegion;
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	},
	/**
	 * 设置左滑块位置
	 * @param {} x 左滑块X坐标
	 */
	setLeftPosition : function(x) {
		if (x <= this.bar.width / 2) {
			this.leftPosition = Math.floor(this.bar.width / 2) + 0.5;
		} else if (this.rightPosition - this.minBarDistance - x >= this.bar.width) {
			this.leftPosition = Math.floor(x) + 0.5;
		} else {
			this.leftPosition = Math.floor(this.rightPosition - this.minBarDistance - this.bar.width) + 0.5;
		}
		this.value = this.getValue();
	},
	/**
	 * 设置右滑块位置
	 * @param {} x 右滑块X坐标
	 */
	setRightPosition : function(x) {
		if (x <= this.leftPosition + this.bar.width + this.minBarDistance) {
			this.rightPosition = this.leftPosition + this.bar.width + this.minBarDistance;
		} else if (x >= this.region.width - this.bar.width / 2) {
			this.rightPosition = this.region.width - this.bar.width / 2;
		} else {
			this.rightPosition = x;
		}
		this.value = this.getValue();
	},
	/**
	 * 添加滑块事件
	 */
	addSliderEvents : function() {
		var me = this;
		// 添加事件
		var touchable = isTouchDevice();
		if (touchable) {
			addEvent(me.canvas, 'touchend', function(ev) {
						me.onEndMove(ev);
					});
			addEvent(me.canvas, 'touchmove', function(ev) {
						me.onTouchMove(ev);
					});
			addEvent(me.canvas, 'touchstart', function(ev) {
						me.onStartHandle(ev);
					});
		}
	},
	/**
	 * 停止滑动handle
	 * @param {} ev 事件对象
	 */
	onEndMove : function(ev) {
		ev = ev || event;
		cancleBubbleAndPreventDefault(ev);
		var canvas = this.canvas;
		var relativePoint = getPageCoord(canvas);
		var fixedEvt = setTouchEventOffsetPosition(ev, relativePoint);
		this._endMove(fixedEvt);
		var time = new Date();
		var delta = time.getTime() - this.touchStartTime.getTime();
		if (delta < 200) {
//			if (this.options.onClick && typeof this.options.onClick == 'function') {
//				addEvent(canvas, 'click', options.onClick);
//			}
		}
	},
	/**
	 * 开始滑动handle
	 * @param {} ev 事件对象
	 */
	onStartHandle : function(ev) {
		ev = ev || event;
		cancleBubbleAndPreventDefault(ev);
		
		var canvas = this.canvas;
		var relativePoint = getPageCoord(canvas);
		var fixedEvt = setTouchEventOffsetPosition(ev, relativePoint);
		this._startHandle(fixedEvt);
		
		this.touchStartTime = new Date();
	},
	/**
	 * 触摸移动过程中
	 * @param {} ev 触摸事件对象
	 */
	onTouchMove : function(ev) {
		ev = ev || event;
		cancleBubbleAndPreventDefault(ev);
		var canvas = this.canvas;
		var relativePoint = getPageCoord(canvas);
		var fixedEvt = setTouchEventOffsetPosition(ev, relativePoint);
		this._moveHandle(fixedEvt);
	},
	/**
	 * 判断触摸点是否在区域内
	 * @param {} ev 事件对象
	 * @param {} region 目标区域
	 * @return {}
	 */
	_isInRegion : function(ev, region) {
		var isInRegion = ev.offsetX > region.x
				&& ev.offsetX < region.x + region.width
				&& ev.offsetY > region.y
				&& ev.offsetY < region.y + region.height;
		return isInRegion;
	},
	/**
	 * 判断触摸点是否在左右滑块之间
	 * @param {} ev 事件对象
	 * @return {}
	 */
	_isBetweenLeftAndRight : function(ev) {
		var region = this.region;
		
		var midRegion = {
			x : region.x + this.leftPosition + this.bar.width / 2,
			y : region.y,
			width : this.rightPosition - this.leftPosition - this.bar.width,
			height : this.region.height
		};
		return this._isInRegion(ev, midRegion);
	},
	/**
	 * 判断触摸后是否改变
	 * @return {} 是或否
	 */
	_isValueChanged : function() {
		var preValue = this.preValue;
		var value = this.getValue();
		var changed = Math.abs(value.left - preValue.left) + Math.abs(value.right - preValue.right);
		this.preValue = value;
		return (changed != 0);
	},
	/**
	 * 获取左右位置
	 * @return {} 左右位置
	 */
	getValue : function() {
		var totalWidth = this.region.width - this.bar.width;
		return {
			left : (this.leftPosition - this.bar.width / 2) * 100 / totalWidth,
			right : (this.rightPosition - this.bar.width / 2) * 100 / totalWidth
		};
	},
	/**
	 * 判断是否触摸在左侧滑块上
	 * @param {} ev 事件对象
	 * @return {} 是或否
	 */
	_isOnLeftBar : function(ev) {
		return this._isInRegion(ev, this.leftBarRegion);
	},
	/**
	 * 判断是否在右侧滑块上
	 * @param {} ev 事件对象
	 * @return {} 是或否
	 */
	_isOnRightBar : function(ev) {
		return this._isInRegion(ev, this.rightBarRegion);
	},
	/**
	 * 触摸开始handle
	 * @param {} ev 事件对象
	 */
	_startHandle : function(ev) {
		var me = this;
		ev = getOffset(ev);
		var isOnLeftBar = me._isOnLeftBar(ev);
		var isOnRigheBar = me._isOnRightBar(ev);
		var isOnMiddleArea = me._isBetweenLeftAndRight(ev);
		if (isOnMiddleArea) {
			document.body.style.cursor = 'move';
		} else if (isOnLeftBar || isOnRigheBar) {
			document.body.style.cursor = 'col-resize';
		}
		if (isOnLeftBar) {
			me.triggerBar = {
				type : 'left',
				x : ev.offsetX,
				position : me.leftPosition
			};
		} else if (isOnRigheBar) {
			me.triggerBar = {
				type : 'right',
				x : ev.offsetX,
				position : me.rightPosition
			};
		} else if (isOnMiddleArea) {
			me.triggerBar = {
				type : 'middle',
				x : ev.offsetX,
				leftPosition : me.leftPosition,
				rightPosition : me.rightPosition
			}
		} else {
			me.triggerBar = null;
		}
	},
	/**
	 * 移动过程handle
	 * @param {} ev 事件对象
	 */
	_moveHandle : function(ev) {
		var me = this;
		ev = getOffset(ev);
		var isOnLeftBar = me._isOnLeftBar(ev);
		var isOnRigheBar = me._isOnRightBar(ev);
		var isOnMiddleArea = me._isBetweenLeftAndRight(ev);
		var triggerBar = me.triggerBar;
		if (isOnMiddleArea) {
			document.body.style.cursor = 'move';
		} else if (isOnLeftBar || isOnRigheBar || triggerBar) {
			document.body.style.cursor = 'col-resize';
		}

		if (triggerBar) {
			triggerBar.targetX = ev.offsetX;
			var moveLength = triggerBar.targetX - triggerBar.x;
			if (triggerBar.type == 'left') {
				document.body.style.cursor = 'col-resize';
				me.setLeftPosition(triggerBar.position + moveLength);
			} else if (triggerBar.type == 'right') {
				me.setRightPosition(triggerBar.position + moveLength);
			} else {
				me.setLeftPosition(triggerBar.leftPosition + moveLength);
				me.setRightPosition(triggerBar.rightPosition + moveLength);
			}
			me.drawSlider();
		}
	},
	/**
	 * 移动结束后handle
	 * @param {} ev 事件对象
	 */
	_endMove : function(ev) {
		ev = getOffset(ev);
		var me = this;
		if (me.triggerBar) {
		}
		me.triggerBar = null;
		document.body.style.cursor = 'default';
		if (typeof me.onPositionChanged == 'function' && me._isValueChanged()) {
			me.value = me.getValue();
			me.onPositionChanged(me.value);
			me.preValue = me.getValue();
		}
	}
};

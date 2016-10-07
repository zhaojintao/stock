// @charset "utf-8";
/**
 * 类的描述 匿名函数
 * 
 * @Filename Util.js
 * @author Rocky
 * @Time 2014-3-20 下午02:19:36
 * @Version v1.0.0
 */
(function() {
	function windowHelper() {
		this.tapTimeLimit = 500;
		this.devicePixelRatio = window.devicePixelRatio || 1;
	}

	windowHelper.prototype = {
		/**
		 * 检测是否是触摸设备
		 */
		isTouchDevice : function() {
			return !!(('ontouchstart' in window) || window.DocumentTouch
					&& document instanceof DocumentTouch);
		},
		/**
		 * 数字转换，保留两位小数
		 */
		toMoney : function(num) {
			return num.toFixed(2);
		},
		/**
		 * 大数值进行转化
		 */
		bigNumberToText : function(num) {
			var str;
			var yi = num / 100000000;
			if (yi > 1) {
				str = yi.toFixed(2) + '亿';
			} else {
				var wan = num / 10000;
				if (wan > 1) {
					str = wan.toFixed(2) + '万';
				} else {
					str = num;
				}
			}
			return str;
		},
		/**
		 * 添加事件监听
		 */
		addEvent : function(elm, evType, fn, useCapture) {
			if (elm.addEventListener) {
				elm.addEventListener(evType, fn, useCapture);
				return true;
			} else if (elm.attachEvent) {
				var r = elm.attachEvent('on' + evType, fn);
				return r;
			} else {
				elm['on' + evType] = fn;
			}
		},
		getEventTarget : function(e) {
			return e.srcElement || e.target || e.relatedTarget;
		},
		$id : function(id) {
			return document.getElementById(id);
		},
		getOffset : function(e) {
			if (!isNaN(e.offsetX) && !isNaN(e.offsetY))
				return e;
			var target = e.target;
			if (target.offsetLeft == undefined) {
				target = target.parentNode;
			}
			var pageCoord = getPageCoord(target);
			var eventCoord = { // 计算鼠标位置（触发元素与窗口的距离）
				x : window.pageXOffset + e.clientX,
				y : window.pageYOffset + e.clientY
			};
			var offset = {
				offsetX : eventCoord.x - pageCoord.x,
				offsetY : eventCoord.y - pageCoord.y
			};
			return offset;
		},
		getPageCoord : function(element) // 计算从触发到root间所有元素的offsetLeft值之和。
		{
			var coord = {
				x : 0,
				y : 0
			};
			while (element) {
				coord.x += element.offsetLeft;
				coord.y += element.offsetTop;
				element = element.offsetParent;
			}
			return coord;
		}
	};
	window.extendObject = function(src, dest) {
		for (var f in src) {
			dest[f] = src[f];
		}
		return dest;
	};

	window.extendWindow = function(src) {
		window.extendObject(src, window);
	};

	var wh = new windowHelper();
	extendWindow(wh);
})();
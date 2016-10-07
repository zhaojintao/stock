// @charset "utf-8";
/**
 * 类的描述 个股行情图表库
 * 
 * @Filename tip.js
 * @author Rocky
 * @Time 2014-2-24 下午02:27:30
 * @Version v1.0.0
 */

/**
 * Tip框构造函数
 * @param {} options options:{ 
 * 					position:{x:10, y:30},
 *            		//position中的值是相对于canvas的左上角的 size:{width:150,height:200},
 *            		opacity:100, 
 *            		cssClass:'', 
 *            		relativePoint:{x:15,y:30}, 十字线
 *            		canvas:canvas, 
 *            		canvasRange:{x:1,y:2,width:200,height:100},
 *            		innerHTML;'some text'
 *            }
 *            参数：{
 *            		位置，
 *            		透明度，
 *            		样式表，
 *            		十字线光标，
 *            		画布对象，
 *            		显示区域，
 *            		显示文本
 *            }
 * 
 */
function Tip(options) {
	extendObject(options, this);
	this.tipX = 0;
	this.tipY = 0;
}

Tip.prototype = {
	/**
	 * 获取画布对象
	 * @return {} 画布对象
	 */
	getElementId : function() {
		return this.canvas.id + '_tip';
	},
	/**
	 * 显示tip框
	 * @param {} crossPoint 十字光标
	 * @param {} html 显示文本
	 */
	show : function(crossPoint, html) {
		if (crossPoint) {
			this.crossPoint = crossPoint;
		}
		if (html) {
			this.innerHTML = html;
		}
		var objTip = $id(this.getElementId());
		var size = this.size;
		var position = this.position;
		var crossPoint = this.crossPoint;
		var canvasPosition = getPageCoord(this.canvas);
		if (canvasPosition.x == 0) {
			canvasPosition.x = 10;
		}
		if (canvasPosition.y == 0) {
			canvasPosition.y = 10;
		}
		var region = this.region;

		var leftPos = position.x + this.region.x + canvasPosition.x;
		var rightPos = this.canvas.width - position.x - size.width;// -
																	// this.region.x;
		if (crossPoint.x) {
			if (crossPoint.x > this.canvas.width - leftPos - size.width - 30) {
				this.tipX = leftPos;
			} else if (crossPoint.x < this.canvas.width - rightPos + 30) {
				if (this.lineType == 'stockminute') {
					this.tipX = rightPos - this.region.x;
				} else {
					this.tipX = rightPos;
				}
			}
		}

		if (position.y) {
			this.tipY = position.y + canvasPosition.y;
		}
		if (!objTip) {
			objTip = document.createElement('DIV');
			objTip.id = this.getElementId();
			var opacity = this.opacity || 80;
			objTip.style.cssText = '-moz-opacity:.'
					+ opacity
					+ 'text-align:center'
					+ '; filter:alpha(opacity='
					+ opacity
					+ '); opacity:'
					+ (opacity / 100)
					+ ';line-height:18px;font-family:Arial,"宋体";font-size:9pt;padding:4px;';
			objTip.style.position = 'absolute';
			objTip.style.zIndex = (this.canvas.style.zIndex || 1) + 2;
			objTip.style.backgroundColor = 'white';
			objTip.style.border = '1px solid gray';
			objTip.style.width = this.size.width + 'px';
			objTip.style.height = this.size.height + 'px';
			if (this.cssClass) {
				objTip.className = this.cssClass;
			}
			document.body.appendChild(objTip);
		}

		if (this.tipX <= 0) {
			objTip.style.display = 'none';
			return;
		}

		objTip.style.left = this.tipX + 'px';
		objTip.style.top = this.tipY + 'px';
		objTip.style.display = 'block';
		objTip.innerHTML = this.innerHTML;
	},
	/**
	 * 隐藏Tip框
	 */
	hide : function() {
		var obj = $id(this.getElementId());
		if (obj) {
			obj.style.display = 'none';
		}
	},
	/**
	 * 更新Tip显示内容
	 * @param {} relativePoint 位置
	 * @param {} html 文本内容
	 */
	update : function(relativePoint, html) {
		this.relativePoint = relativePoint;
		this.innerHTML = html;
		this.show(); // this.crossPoint, this.innerHTML
	}
};
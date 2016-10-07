// @charset "utf-8";
/**
 * 类的描述 个股行情图表Tip框类 
 * @Filename Tip_m.js
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
		this.show();
	}
};
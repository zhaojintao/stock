// @charset "utf-8";
/**
 * 类的描述 TODO
 * 
 * @Filename top.js
 * @author Rocky
 * @Time 2014-5-14 下午04:06:12
 * @Version v1.0.0
 */

/**
 * @license RequireJS text 2.0.6 Copyright (c) 2010-2012, The Dojo Foundation
 *          All Rights Reserved. Available via the MIT or new BSD license. see:
 *          http://github.com/requirejs/text for details
 */

/*
 * ! artTemplate - Template Engine https://github.com/aui/artTemplate Released
 * under the MIT, BSD, and GPL Licenses
 */

define("plugin/zepto/zepto.ua", ["require", "zepto"], function(e) {
			var t = e("zepto");
			return function(e) {
				e.ua = {
					system : function() {
						return navigator.userAgent.match(/iPhone/i)
								|| navigator.userAgent.match(/iPod/i) ? !0 : !1
					},
					isRetina : function() {
						return navigator.userAgent.match(/iPhone/i)
								|| navigator.userAgent.match(/iPod/i)
								? Boolean(navigator.userAgent
										.match(/OS [5-9]_\d[_\d]* like Mac OS X/i))
								: !1
					},
					ios4 : function() {
						return navigator.userAgent.match(/iPhone/i)
								|| navigator.userAgent.match(/iPod/i)
								? Boolean(navigator.userAgent
										.match(/OS [4]_\d[_\d]* like Mac OS X/i))
								: !1
					},
					isAndroid : function() {
						var e = navigator.userAgent, t = e.indexOf("Android") > -1;
						return t
					},
					isiPhone : function() {
						var e = navigator.userAgent, t = e.indexOf("iPhone") > -1
								|| e.indexOf("iPod") > -1;
						return t
					},
					isQQBrowsr : function() {
						var e = navigator.userAgent, t = e.indexOf("Android") > -1
								&& e.indexOf("QQBrowser") > -1;
						return t
					}
				}
			}(t), t.ua
		}), define("view", ["require", "backbone", "underscore",
				"plugin/zepto/zepto.ua"], function(e) {
			function i(e, t) {
				while (e) {
					if (t in e.models)
						return e.models[t];
					e = e.parent
				}
			}
			var t = e("backbone"), n = t.$, r = e("underscore");
			e("plugin/zepto/zepto.ua");
			var s = t.View.extend({
				style : "",
				html : "",
				models : {},
				views : {},
				events : {},
				initialize : function(e) {
					e = e || {};
					var t = this;
					e.parent && (this.parent = e.parent), e.wrapper
							&& (this.wrapper = e.wrapper);
					var n = {};
					r.extend(n, t.models, e.models), this.models = n;
					var s = {};
					r.each(t.views, function(e, n) {
						e.options = e.options || {};
						var o = {};
						r.isString(e.models)
								&& (e.models = e.models.split(/[ ,]+/)), r
								.isArray(e.models) ? r.each(e.models, function(
										e) {
									o[e] = i(t, e)
								}) : r.each(e.models, function(e, n) {
									o[n] = r.isString(e) ? i(t, e) : e
								}), e.options.models = o, e.options.parent = t, s[n] = new e.init(e.options)
					}), t.views = s, r.each(t.models, function(e) {
								t.listenTo(e, "change", function() {
											t.afterChange.apply(t, arguments)
										})
							});
					var o = {};
					r.each(t.events, function(e, n) {
								o[n] = e, typeof e == "function"
										&& (o[n] = r.bind(e, t))
							}), t.events = o, this.afterInitialize(e)
				},
				render : function() {
					this.beforeRender() !== !0
							&& (this.style
									&& (this.style = n("<style></style>")
											.append(this.style)
											.appendTo(n("head"))), this.html
									&& this.$el.html(this.html), r.each(
									this.views, function(e) {
										e.render()
									})), this.afterRender()
				},
				setScene : function(e) {
					e == "newsCon"
							? n("#scene-4").show()
							: (this.$el.hide(), e == "index"
									? (n("#scene-1").show(), n("#news-tabs")
											.hide(), n.ua.system()
											|| n(window)
													.trigger("mod-chart:reload"))
									: e == "news"
											? (n("#scene-2").show(), n("#news-tabs")
													.show())
											: e == "info"
													&& (n("#scene-3").show(), n("#news-tabs")
															.hide()), n("#scene-4")
									.hide())
				},
				remove : function() {
					this.beforeRemove() !== !0
							&& (r.each(this.views, function(e) {
										e.remove()
									}), this.style && this.style.remove(), this
									.stopListening()), this.afterRemove()
				},
				afterInitialize : function() {
				},
				afterChange : function() {
				},
				navigate : function() {
				},
				beforeRender : function() {
				},
				afterRender : function() {
				},
				beforeRemove : function() {
				},
				afterRemove : function() {
				}
			});
			return s.$ = t.$, s._ = r, s
		}), define("text", ["module"], function(e) {
	var t, n, r, i, s = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP",
			"Msxml2.XMLHTTP.4.0"], o = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, u = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im, a = typeof location != "undefined"
			&& location.href, f = a && location.protocol
			&& location.protocol.replace(/\:/, ""), l = a && location.hostname, c = a
			&& (location.port || undefined), h = [], p = e.config && e.config()
			|| {};
	t = {
		version : "2.0.6",
		strip : function(e) {
			if (e) {
				e = e.replace(o, "");
				var t = e.match(u);
				t && (e = t[1])
			} else
				e = "";
			return e
		},
		jsEscape : function(e) {
			return e.replace(/(['\\])/g, "\\$1").replace(/[\f]/g, "\\f")
					.replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(
							/[\t]/g, "\\t").replace(/[\r]/g, "\\r").replace(
							/[\u2028]/g, "\\u2028").replace(/[\u2029]/g,
							"\\u2029")
		},
		createXhr : p.createXhr || function() {
			var e, t, n;
			if (typeof XMLHttpRequest != "undefined")
				return new XMLHttpRequest;
			if (typeof ActiveXObject != "undefined")
				for (t = 0; t < 3; t += 1) {
					n = s[t];
					try {
						e = new ActiveXObject(n)
					} catch (r) {
					}
					if (e) {
						s = [n];
						break
					}
				}
			return e
		},
		parseName : function(e) {
			var t, n, r, i = !1, s = e.indexOf("."), o = e.indexOf("./") === 0
					|| e.indexOf("../") === 0;
			return s !== -1 && (!o || s > 1) ? (t = e.substring(0, s), n = e
					.substring(s + 1, e.length)) : t = e, r = n || t, s = r
					.indexOf("!"), s !== -1
					&& (i = r.substring(s + 1) === "strip", r = r.substring(0,
							s), n ? n = r : t = r), {
				moduleName : t,
				ext : n,
				strip : i
			}
		},
		xdRegExp : /^((\w+)\:)?\/\/([^\/\\]+)/,
		useXhr : function(e, n, r, i) {
			var s, o, u, a = t.xdRegExp.exec(e);
			return a
					? (s = a[2], o = a[3], o = o.split(":"), u = o[1], o = o[0], (!s || s === n)
							&& (!o || o.toLowerCase() === r.toLowerCase())
							&& (!u && !o || u === i))
					: !0
		},
		finishLoad : function(e, n, r, i) {
			r = n ? t.strip(r) : r, p.isBuild && (h[e] = r), i(r)
		},
		load : function(e, n, r, i) {
			if (i.isBuild && !i.inlineText) {
				r();
				return
			}
			p.isBuild = i.isBuild;
			var s = t.parseName(e), o = s.moduleName
					+ (s.ext ? "." + s.ext : ""), u = n.toUrl(o), h = p.useXhr
					|| t.useXhr;
			!a || h(u, f, l, c) ? t.get(u, function(n) {
						t.finishLoad(e, s.strip, n, r)
					}, function(e) {
						r.error && r.error(e)
					}) : n([o], function(e) {
						t.finishLoad(s.moduleName + "." + s.ext, s.strip, e, r)
					})
		},
		write : function(e, n, r, i) {
			if (h.hasOwnProperty(n)) {
				var s = h[n];
				/^\s*define\s*\(\s*function\s*\(/.test(s)
						|| (s = "define(function () { return '" + t.jsEscape(s)
								+ "';});"), r.asModule(e + "!" + n, s + "\n")
			}
		},
		writeFile : function(e, n, r, i, s) {
			var o = t.parseName(n), u = o.ext ? "." + o.ext : "", a = o.moduleName
					+ u, f = r.toUrl(o.moduleName + u) + ".js";
			t.load(a, r, function(n) {
						var r = function(e) {
							return i(f, e)
						};
						r.asModule = function(e, t) {
							return i.asModule(e, f, t)
						}, t.write(e, a, r, s)
					}, s)
		}
	};
	if (p.env === "node" || !p.env && typeof process != "undefined"
			&& process.versions && !!process.versions.node)
		n = require.nodeRequire("fs"), t.get = function(e, t) {
			var r = n.readFileSync(e, "utf8");
			r.indexOf("\ufeff") === 0 && (r = r.substring(1)), t(r)
		};
	else if (p.env === "xhr" || !p.env && t.createXhr())
		t.get = function(e, n, r, i) {
			var s = t.createXhr(), o;
			s.open("GET", e, !0);
			if (i)
				for (o in i)
					i.hasOwnProperty(o)
							&& s.setRequestHeader(o.toLowerCase(), i[o]);
			p.onXhr && p.onXhr(s, e), s.onreadystatechange = function(t) {
				var i, o;
				s.readyState === 4
						&& (i = s.status, i > 399 && i < 600
								? (o = new Error(e + " HTTP status: " + i), o.xhr = s, r(o))
								: n(s.responseText), p.onXhrComplete
								&& p.onXhrComplete(s, e))
			}, s.send(null)
		};
	else if (p.env === "rhino" || !p.env && typeof Packages != "undefined"
			&& typeof java != "undefined")
		t.get = function(e, t) {
			var n, r, i = "utf-8", s = new java.io.File(e), o = java.lang.System
					.getProperty("line.separator"), u = new java.io.BufferedReader(new java.io.InputStreamReader(
					new java.io.FileInputStream(s), i)), a = "";
			try {
				n = new java.lang.StringBuffer, r = u.readLine(), r
						&& r.length() && r.charAt(0) === 65279
						&& (r = r.substring(1)), n.append(r);
				while ((r = u.readLine()) !== null)
					n.append(o), n.append(r);
				a = String(n.toString())
			} finally {
				u.close()
			}
			t(a)
		};
	else if (p.env === "xpconnect" || !p.env
			&& typeof Components != "undefined" && Components.classes
			&& Components.interfaces)
		r = Components.classes, i = Components.interfaces, Components.utils["import"]("resource://gre/modules/FileUtils.jsm"), t.get = function(
				e, t) {
			var n, s, o = {}, u = new FileUtils.File(e);
			try {
				n = r["@mozilla.org/network/file-input-stream;1"]
						.createInstance(i.nsIFileInputStream), n.init(u, 1, 0,
						!1), s = r["@mozilla.org/intl/converter-input-stream;1"]
						.createInstance(i.nsIConverterInputStream), s
						.init(
								n,
								"utf-8",
								n.available(),
								i.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER), s
						.readString(n.available(), o), s.close(), n.close(), t(o.value)
			} catch (a) {
				throw new Error((u && u.path || "") + ": " + a)
			}
		};
	return t
}), define("text!cn/top.html", [], function() {
	return '<div id="mod-toppanel"></div>\r\n<div id="mod-nav"></div>\r\n<div id="wrapper">\r\n	<div id="scroller">\r\n		<div id="pullDown" class="clearfix">\r\n            <span class="pullDownIcon"></span><span class="pullDownLabel">\u4e0b\u62c9\u5237\u65b0...</span>\r\n        </div>\r\n	</div>\r\n</div>'
}), define("model", ["require", "underscore", "backbone"], function(e) {
	var t = e("underscore"), n = document.head
			|| document.getElementsByTagName("head")[0]
			|| document.documentElement, r = /loaded|complete|undefined/, i = function(
			e, t, i) {
		i = i || {};
		var s = document.createElement("script");
		s.type = "text/javascript", s.charset = i.charset || "utf-8", s.async = !0, s.onload = s.onerror = s.onreadystatechange = function() {
			r.test(s.readyState)
					&& (s.onload = s.onerror = s.onreadystatechange = null, n
							.removeChild(s), s = undefined, t.call(i.context))
		}, s.src = e, n.appendChild(s)
	};
	String.prototype.cutstr = function(e) {
		var t = this, n = 0, r = 0, i, s = new String;
		r = t.length;
		for (var o = 0; o < r; o++) {
			i = t.charAt(o), n++, escape(i).length > 4 && n++, s = s.concat(i);
			if (n >= e)
				return s = s.concat("..."), s
		}
		if (n < e)
			return t
	};
	var s = 0, o = e("backbone"), u = o.Model.extend({
		constructor : function() {
			this.qt = a, this.queue = [], this.init.apply(this, arguments), o.Model
					.apply(this, arguments)
		},
		bind : function(e) {
			return e.id = ++s, this.data && this.flush(e, this.data), this.queue
					.push(e), this.run(), e.id
		},
		rem : function(e) {
			var t;
			for (var n = 0; n < this.queue.length; n++)
				if (this.queue[n] && this.queue[n].id == e) {
					t = this.queue.splice(n, 1);
					break
				}
			return this.run(), t
		},
		run : function() {
			var e = this.queue.length, t = this;
			e && !this.isRun ? (this.isRun = !0, this.start()) : !e && t.isRun
					&& (this.isRun = !1, this.stop())
		},
		send : function(e) {
			this.data = e;
			var t = this;
			for (var n = 0; n < this.queue.length; n++) {
				var r = this.queue[n];
				r && this.flush(r, this.data)
			}
		},
		init : function() {
		},
		start : function() {
		},
		stop : function() {
		},
		flush : function(e, t) {
			e.fn && e.fn(t)
		},
		load : i
	}), a;
	return u.addJob = function(e) {
		var t = this;
		return this.__singleton || (this.__singleton = new t(e)), e._id == "qt"
				&& (a = this.__singleton), this.__singleton
	}, u.single = function(e) {
		var t = this;
		return this.__singleton || (this.__singleton = new t(e)), this.__singleton
	}, u
}), define("qt", ["require", "model"], function(e) {
	var t = e("model");
	return t.extend({
		init : function() {
			var e = app.symbol.substr(0, 2);
			this.fields == undefined
					&& (e == "hk"
							? (this.fields = "2|3|4|31|32|33|41|1|5|6|34|35|37|38|46|45|44|40|49|50", this.symbol = "r_"
									+ app.symbol)
							: e == "us"
									? (this.fields = "2|3|4|31|32|33|41|1|5|6|34|35|37|46|40|48", this.symbol = app.symbol
											.replace(/\.[^.]+$/, "").replace(
													/\./g, "__"))
									: (this.fields = "2|3|4|31|32|33|41|1|5|6|34|35|37|38|46|45|39|44|40|47", this.symbol = app.symbol), this.fields = this.fields
							? "(" + this.fields + ")"
							: "")
		},
		start : function() {
			var e = this, t = function() {
				e.load(	"http://sqt.gtimg.cn/" + Math.random() + "&q="
								+ e.symbol + e.fields, function() {
							var t = window["v_" + e.symbol];
							t ? e.send(t.split("~")) : e.send(["", "", "0.000",
									"", "0.00", "0.00", "0.000", "0.000",
									"0.000", "0.000", "0.00", "0.00", "0",
									"0.00"])
						})
			};
			t(), this.timer = setInterval(t, 5e3)
		},
		stop : function() {
			clearInterval(this.timer), this.timer = !1
		},
		symbolChange : function(e) {
			this.stop(), this.symbol = e, this.start()
		},
		fieldsChange : function(e) {
			this.stop(), this.fields = e ? "(" + e + ")" : "", this.start()
		}
	})
}), define("widgets/cn/mod-toppanel/scripts/data", ["require", "exports",
				"module", "model"], function(e, t, n) {
			var r = e("model");
			return r.extend({
				init : function() {
					this.symbol = app.symbol, this.Qt = this.qt
				},
				_join : function() {
					var e = this;
					this._qt[3].length > 10
							&& (this._qt[3] = this._qt[3].substr(4)), this
							.load(	"http://qt.gtimg.cn/r=" + Math.random()
											+ "q=marketStat", function() {
										var t = window.v_marketStat;
										e._qt.stat = t.split("|")[2].split("_")[2], e
												.set("qt", e._qt)
									})
				},
				start : function() {
					var e = this;
					this._qtId || (this._qtId = this.Qt.bind({
								fn : function(t) {
									e._qt = t, e._join()
								}
							}))
				},
				stop : function() {
					this._qtId && (this.Qt.rem(this._qtId), this._qtId = null)
				}
			})
		});
var e = function(t, n) {
	return e[typeof n == "object" ? "render" : "compile"].apply(e, arguments)
};
(function(e, t) {
	e.version = "2.0.1", e.openTag = "<%", e.closeTag = "%>", e.isEscape = !0, e.isCompress = !1, e.parser = null, e.render = function(
			e, t) {
		var n = r(e);
		return n === undefined ? i({
					id : e,
					name : "Render Error",
					message : "No Template"
				}) : n(t)
	}, e.compile = function(t, r) {
		function c(n) {
			try {
				return new f(n) + ""
			} catch (s) {
				return u
						? (s.id = t || r, s.name = "Render Error", s.source = r, i(s))
						: e.compile(t, r, !0)(n)
			}
		}
		var o = arguments, u = o[2], a = "anonymous";
		typeof r != "string" && (u = o[1], r = o[0], t = a);
		try {
			var f = s(r, u)
		} catch (l) {
			return l.id = t || r, l.name = "Syntax Error", i(l)
		}
		return c.prototype = f.prototype, c.toString = function() {
			return f.toString()
		}, t !== a && (n[t] = c), c
	}, e.helper = function(t, n) {
		e.prototype[t] = n
	}, e.onerror = function(e) {
		var n = "[template]:\n" + e.id + "\n\n[name]:\n" + e.name;
		e.message && (n += "\n\n[message]:\n" + e.message), e.line
				&& (n += "\n\n[line]:\n" + e.line, n += "\n\n[source]:\n"
						+ e.source.split(/\n/)[e.line - 1].replace(/^[\s\t]+/,
								"")), e.temp && (n += "\n\n[temp]:\n" + e.temp), t.console
				&& console.error(n)
	};
	var n = {}, r = function(r) {
		var i = n[r];
		if (i === undefined && "document" in t) {
			var s = document.getElementById(r);
			if (s) {
				var o = s.value || s.innerHTML;
				return e.compile(r, o.replace(/^\s*|\s*$/g, ""))
			}
		} else if (n.hasOwnProperty(r))
			return i
	}, i = function(t) {
		function n() {
			return n + ""
		}
		return e.onerror(t), n.toString = function() {
			return "{Template Error}"
		}, n
	}, s = function() {
		e.prototype = {
			$render : e.render,
			$escape : function(e) {
				return typeof e == "string" ? e.replace(/&(?![\w#]+;)|[<>"']/g,
						function(e) {
							return {
								"<" : "&#60;",
								">" : "&#62;",
								'"' : "&#34;",
								"'" : "&#39;",
								"&" : "&#38;"
							}[e]
						}) : e
			},
			$string : function(e) {
				return typeof e == "string" || typeof e == "number"
						? e
						: typeof e == "function" ? e() : ""
			}
		};
		var t = Array.prototype.forEach || function(e, t) {
			var n = this.length >>> 0;
			for (var r = 0; r < n; r++)
				r in this && e.call(t, this[r], r, this)
		}, n = function(e, n) {
			t.call(e, n)
		}, r = "break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined", i = /\/\*(?:.|\n)*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|'[^']*'|"[^"]*"|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g, s = /[^\w$]+/g, o = new RegExp(
				["\\b" + r.replace(/,/g, "\\b|\\b") + "\\b"].join("|"), "g"), u = /\b\d[^,]*/g, a = /^,+|,+$/g, f = function(
				e) {
			return e = e.replace(i, "").replace(s, ",").replace(o, "").replace(
					u, "").replace(a, ""), e = e ? e.split(/,+/) : [], e
		};
		return function(t, r) {
			function S(t) {
				return l += t.split(/\n/).length - 1, e.isCompress
						&& (t = t.replace(/[\n\r\t\s]+/g, " ")), t = t.replace(
						/('|\\)/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g,
						"\\n"), t = m[1] + "'" + t + "'" + m[2], t + "\n"
			}
			function x(t) {
				var n = l;
				o ? t = o(t) : r && (t = t.replace(/\n/g, function() {
							return l++, "$line=" + l + ";"
						}));
				if (t.indexOf("=") === 0) {
					var i = t.indexOf("==") !== 0;
					t = t.replace(/^=*|[\s;]*$/g, "");
					if (i && e.isEscape) {
						var s = t.replace(/\s*\([^\)]+\)/, "");
						!h.hasOwnProperty(s) && !/^(include|print)$/.test(s)
								&& (t = "$escape($string(" + t + "))")
					} else
						t = "$string(" + t + ")";
					t = m[1] + t + m[2]
				}
				return r && (t = "$line=" + n + ";" + t), T(t), t + "\n"
			}
			function T(e) {
				e = f(e), n(e, function(e) {
							c.hasOwnProperty(e) || (N(e), c[e] = !0)
						})
			}
			function N(e) {
				var t;
				e === "print" ? t = y : e === "include"
						? (p.$render = h.$render, t = b)
						: (t = "$data." + e, h.hasOwnProperty(e)
								&& (p[e] = h[e], e.indexOf("$") === 0
										? t = "$helpers." + e
										: t = t + "===undefined?$helpers." + e
												+ ":" + t)), d += e + "=" + t
						+ ","
			}
			var i = e.openTag, s = e.closeTag, o = e.parser, u = t, a = "", l = 1, c = {
				$data : !0,
				$helpers : !0,
				$out : !0,
				$line : !0
			}, h = e.prototype, p = {}, d = "var $helpers=this,"
					+ (r ? "$line=0," : ""), v = "".trim, m = v ? ["$out='';",
					"$out+=", ";", "$out"] : ["$out=[];", "$out.push(", ");",
					"$out.join('')"], g = v
					? "if(content!==undefined){$out+=content;return content}"
					: "$out.push(content);", y = "function(content){" + g + "}", b = "function(id,data){if(data===undefined){data=$data}var content=$helpers.$render(id,data);"
					+ g + "}";
			n(u.split(i), function(e, t) {
						e = e.split(s);
						var n = e[0], r = e[1];
						e.length === 1 ? a += S(n) : (a += x(n), r
								&& (a += S(r)))
					}), u = a, r
					&& (u = "try{" + u + "}catch(e){" + "e.line=$line;"
							+ "throw e" + "}"), u = "" + d + m[0] + u
					+ "return new String(" + m[3] + ")";
			try {
				var w = new Function("$data", u);
				return w.prototype = p, w
			} catch (E) {
				throw E.temp = "function anonymous($data) {" + u + "}", E
			}
		}
	}()
})(e, this), typeof define == "function" ? define("template", ["require",
				"exports", "module"], function(t, n, r) {
			r.exports = e
		}) : typeof exports != "undefined" && (module.exports = e), define(
		"text!widgets/cn/mod-toppanel/css/style.css", [], function() {
			return '#mod-toppanel{height:106px;border-bottom:1px solid #bfbdb9;border-top:1px solid #cacaca;background-color:#f4f4f4;position:relative}#mod-toppanel #toppanel-name{height:54px}#mod-toppanel #toppanel-name h1{text-align:center;font-size:25px;font-family:sans-serif;font-weight:700;color:#615d5b;margin-top:7px}#mod-toppanel #toppanel-name h2{text-align:center;font-size:13px;font-family:Helvetica,sans-serif;color:#989391}#mod-toppanel #toppanel-name #btn-refresh{width:50px;height:50px;background:url(http://mat1.gtimg.com/finance/images/stock/p/gu/sprites_11.png) no-repeat 9px -223px;-webkit-background-size:33px 400px;background-size:33px 400px;position:absolute;top:5px;right:15px}#mod-toppanel #toppanel-name #btn-refresh.selected{background:url(http://mat1.gtimg.com/finance/images/stock/p/gu/sprites_11.png) no-repeat 9px -275px;-webkit-background-size:33px 400px;background-size:33px 400px}#mod-toppanel #toppanel-name #btn-refresh #chry{position:absolute;top:10px;right:25px}#mod-toppanel #toppanel-name #btn-refresh #chry::after,#mod-toppanel #toppanel-name #btn-refresh #chry::before{position:absolute;content:"";height:0;width:0;pointer-events:none;border:solid transparent}#mod-toppanel #toppanel-name #btn-refresh #chry::after{border-color:rgba(194,225,245,0);border-top-color:#474644;border-width:5px;margin-left:-5px;bottom:7px}#mod-toppanel #toppanel-name #btn-refresh #chry::before{border-color:rgba(194,225,245,0);border-top-color:#cacaca;border-width:6px;margin-left:-6px;bottom:4px}#mod-toppanel #toppanel-data{height:45px;border-bottom:1px solid #acaaa7;background-color:#dedbd7;width:100%}#mod-toppanel #toppanel-data .toppanel-item:nth-child(1){border-right:1px solid #bfbdb9}#mod-toppanel #toppanel-data .toppanel-item:nth-child(2){border-left:1px solid #f4f4f4}#mod-toppanel #toppanel-data .toppanel-item{-webkit-box-flex:1;-moz-box-flex:1;-o-box-flex:1;box-flex:1;width:50%;height:45px}#mod-toppanel #toppanel-data .toppanel-item .sup{height:32px;background:url(http://mat1.gtimg.com/finance/images/stock/p/gu/sprites_11.png) no-repeat 0 -140px;-webkit-background-size:33px 400px;background-size:33px 400px;color:#d93510}#mod-toppanel #toppanel-data .toppanel-item .seq{height:32px;color:#706c6a}#mod-toppanel #toppanel-data .toppanel-item .sdown{height:32px;background:url(http://mat1.gtimg.com/finance/images/stock/p/gu/sprites_11.png) no-repeat 0 -97px;-webkit-background-size:33px 400px;background-size:33px 400px;color:#008325}#mod-toppanel #toppanel-data .toppanel-item #price{font-size:30px;font-family:Helvetica,sans-serif;padding-left:20px;margin-top:5px}#mod-toppanel #toppanel-data .toppanel-item .up{color:#d93510}#mod-toppanel #toppanel-data .toppanel-item .eq{color:#706c6a}#mod-toppanel #toppanel-data .toppanel-item .down{color:#008325}#mod-toppanel #toppanel-data .toppanel-item #zf{width:120px;font-size:14px;font-family:Helvetica,sans-serif;padding-top:5px;margin:0 auto}#mod-toppanel #toppanel-data .toppanel-item #zf div:nth-child(1){text-align:left;width:50%}#mod-toppanel #toppanel-data .toppanel-item #zf div:nth-child(2){text-align:right;width:50%}#mod-toppanel #toppanel-data .toppanel-item #date{width:128px;text-align:center;color:#353432;font-size:9px;font-family:Helvetica,sans-serif;padding-top:2px;margin:0 auto}#mod-toppanel #toppanel-data .toppanel-item #date div:nth-child(2){width:60px;text-align:center}'
		}), define("text!widgets/cn/mod-toppanel/tpl-wx.html", [], function() {
	return '<div id="toppanel-name">\r\n	<h1><%= rs[0] %></h1>\r\n	<h2><%= rs[\'g_Sclx\'] %><%= rs[1] %></h2>\r\n</div>\r\n<div id="toppanel-data" class="row-box">\r\n	<div class="toppanel-item">\r\n		<div class="row-box row-center" style="width:100%">\r\n			<% if (rs[6] == \'\'){%>\r\n				<% if (rs[4] > 0){ %>\r\n					<div id="price" class="sup"><%= rs[2] %></div>\r\n				<% }else if(rs[4] == 0){ %>\r\n					<div id="price" class="seq"><%= rs[2] %></div>\r\n				<% }else{  %>\r\n					<div id="price" class="sdown"><%= rs[2] %></div>\r\n				<% } %>\r\n			<% }else if(rs[6] == \'D\'){ %>\r\n				<div id="price" style="color:#cc0000; font-size:20px; padding-left:10px; margin-top: 10px;">\u9000 \u5e02</div>\r\n			<% }else if(rs[6] == \'S\'){ %>\r\n				<div id="price" style="color:#cc0000; font-size:20px; padding-left:10px; margin-top: 10px;">\u505c \u724c</div>\r\n			<% }else if(rs[6] == \'U\'){ %>\r\n				<div id="price" style="color:#cc0000; font-size:20px; padding-left:10px; margin-top: 10px;">\u672a\u4e0a\u5e02</div>\r\n			<% } %>\r\n		</div>\r\n	</div>\r\n	<div class="toppanel-item">\r\n		<% if (rs[4] > 0){ %>\r\n				<div id="zf" class="row-box up">\r\n					<div>+<%= rs[4] %></div>\r\n					<div>+<%= rs[5] %>%</div>\r\n				</div>\r\n		<% }else if(rs[4] == 0){ %>\r\n				<div id="zf" class="row-box eq">\r\n					<div><%= rs[4] %></div>\r\n					<div><%= rs[5] %>%</div>\r\n				</div>\r\n		<% }else{  %>\r\n				<div id="zf" class="row-box down">\r\n					<div><%= rs[4] %></div>\r\n					<div><%= rs[5] %>%</div>\r\n				</div>\r\n		<% } %>\r\n\r\n		<div id="date" class="row-box">\r\n			<div><%= rs[3].substr(0, 2) %>-<%= rs[3].substr(2, 2) %></div>\r\n			<div><%= rs[3].substr(4, 2) %>:<%= rs[3].substr(6, 2)%>:<%= rs[3].substr(8, 2) %></div>\r\n			<div><%= rs[\'stat\'] %></div>\r\n		</div>\r\n	</div>\r\n</div>'
}), define("widgets/cn/mod-toppanel/scripts/mod-wx", ["require", "zepto",
				"view", "template", "text!../css/style.css",
				"text!../tpl-wx.html"], function(e) {
			var t = e("zepto"), n = e("view"), r = e("template");
			return n.extend({
				style : e("text!../css/style.css"),
				html : e("text!../tpl-wx.html"),
				afterRender : function() {
					var e = this;
					this.models.toppanel.start(), this.isBind = 0, this.toggle = 0, this.test = 0, t(window)
							.on("mod-top:reload", t.proxy(this.reload, e))
				},
				afterChange : function(e) {
					var t = r.compile(this.html), n = e.get("qt") || {};
					n.g_Sclx = app.symbol.substr(0, 2).toUpperCase();
					var i = t({
								rs : n
							});
					this.parent.$("#" + this.wrapper).html(i);
					if (typeof window.callPhantom == "function" && !this.test) {
						this.test = 1;
						var s = window.callPhantom({
									name : "mod-toppanel",
									time : Date.now()
								})
					}
				},
				reload : function() {
					this.models.qt.stop(), this.models.qt.start()
				}
			})
		}), define("plugin/zepto/zepto.tap", ["require", "exports", "module",
				"zepto"], function(e, t) {
			var n = e("zepto");
			return function(e) {
				e.fn.tap = function(t) {
					var n, r, i, s, o, u;
					return n = "1.0.1", i = 2e3, u = function(e, t) {
						return function() {
							return e.apply(t, arguments)
						}
					}, this.each(function(n, a) {
								var f = e(a);
								f.on("touchstart", u(function(e) {
													r = !1, s = (new Date)
															.getTime()
												}, this)), f.on("touchmove", u(
												function(e) {
													r = !0
												}, this)), f.on("touchend", u(
												function(e) {
													o = (new Date).getTime(), !r
															&& o - s < i
															&& t(e)
												}, this)), f.on("touchcancel",
										u(function(e) {
													t(e)
												}, this))
							})
				}
			}(n), n.fn.tap
		}), define("text!widgets/cn/mod-nav/css/style.css", [], function() {
	return "#mod-nav{width:100%;height:38px;line-height:38px;border-bottom:#7c7a77;background-color:#333130;color:#fff;font-size:15px;font-family:sans-serif;position:relative}#mod-nav .nav-btns{width:100%;position:relative;top:0;left:0;z-index:2}#mod-nav .nav-btn{-webkit-box-flex:1;-moz-box-flex:1;-o-box-flex:1;box-flex:1;text-align:center;text-shadow:rgba(0,0,0,.75) 0 1px 0}#mod-nav .nav-btn:nth-child(1){width:33%}#mod-nav .nav-btn:nth-child(2){width:34%}#mod-nav .nav-btn:nth-child(3){width:33%}#mod-nav .cur{background-color:#ae4804;position:absolute;top:0;height:38px;z-index:1;-webkit-transition:-webkit-transform .2s ease-in-out;-moz-transition:-moz-transform .2s ease-in-out;-o-transition:-moz-transform .2s ease-in-out;transition:transform .2s ease-in-out;-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);-o-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}"
}), define("text!widgets/cn/mod-nav/tpl.html", [], function() {
	return '<div class="nav-btns row-box">\r\n	<div class="nav-btn" rel="index">\u884c\u60c5</div>\r\n	<div class="nav-btn" rel="news/2">\u8d44\u8baf</div>\r\n	<div class="nav-btn" rel="info">\u6982\u51b5</div>\r\n</div>\r\n<div class="cur"></div>'
}), define("widgets/cn/mod-nav/scripts/mod", ["require", "exports", "module",
				"zepto", "view", "plugin/zepto/zepto.tap",
				"text!../css/style.css", "text!../tpl.html"],
		function(e, t, n) {
			var r = e("zepto"), i = e("view");
			return e("plugin/zepto/zepto.tap"), i.extend({
				style : e("text!../css/style.css"),
				html : e("text!../tpl.html"),
				afterRender : function() {
					var e = this, t = app.symbol.substr(0, 2);
					e.test = 0;
					if (t == "sh" && app.symbol.substr(2, 3) == "000"
							|| t == "sz" && app.symbol.substr(2, 3) == "399")
						r("#" + this.wrapper).hide();
					else {
						r("#" + this.wrapper).html(this.html).show(), r(".nav-btn")
								.click(r.proxy(e.go, e));
						if (app.page == "index")
							var n = 0;
						else if (app.page == "news")
							var n = 1;
						else if (app.page == "info")
							var n = 2;
						this.slide(n, function() {
									if (typeof window.callPhantom == "function"
											&& !e.test) {
										e.test = 1;
										var t = window.callPhantom({
													name : "mod-nav",
													time : Date.now()
												})
									}
								}), r(window).on("mod-nav:reload",
								function(t, n) {
									e.slide(n)
								})
					}
				},
				slide : function(e) {
					var t = app.symbol.substr(0, 2);
					if (!(t == "sh" && app.symbol.substr(2, 3) == "000" || t == "sz"
							&& app.symbol.substr(2, 3) == "399")) {
						var n = r(".nav-btn").eq(e).css("width");
						if (e == 0)
							var i = 0;
						else if (e == 1)
							var i = parseFloat(r(".nav-btn").eq(0).css("width"))
									+ "px";
						else if (e == 2)
							var i = parseFloat(n)
									+ parseFloat(r(".nav-btn").eq(1)
											.css("width")) + "px";
						r(".cur").animate({
									translate3d : "" + i + ", 0, 0"
								}, 200, "ease-out-in").css("width", n)
					}
					arguments.length > 1 && arguments[1]()
				},
				go : function(e) {
					var t = r(e.currentTarget).attr("rel");
					t != "index"
							? app.navigate(app.symbol + "/" + t + "/")
							: app.navigate(app.symbol);
					if (app.page == "index")
						var n = 0;
					else if (app.page == "news")
						var n = 1;
					else if (app.page == "info")
						var n = 2;
					this.slide(n, function() {
							})
				}
			})
		}), define("cn/top", ["require", "view", "text!./top.html", "qt",
				"widgets/cn/mod-toppanel/scripts/data",
				"widgets/cn/mod-toppanel/scripts/mod-wx",
				"widgets/cn/mod-nav/scripts/mod"], function(e) {
			var t = e("view"), n = t._, r = t.$;
			return t.extend({
						attributes : {
							id : "mod-box"
						},
						html : e("text!./top.html"),
						models : {
							qt : e("qt").addJob({
										_id : "qt"
									}),
							toppanel : e("widgets/cn/mod-toppanel/scripts/data")
									.addJob({
												_id : "toppanel"
											})
						},
						views : {
							"mod-toppanel" : {
								init : e("widgets/cn/mod-toppanel/scripts/mod-wx"),
								models : "qt toppanel",
								options : {
									wrapper : "mod-toppanel"
								}
							},
							"mod-nav" : {
								init : e("widgets/cn/mod-nav/scripts/mod"),
								options : {
									wrapper : "mod-nav"
								}
							}
						},
						beforeRender : function() {
							this.$el.appendTo(t.$("body"))
						},
						afterRender : function() {
						},
						afterRemove : function() {
							this.$el.remove()
						}
					})
		}), define("text!cn/index.html", [], function() {
	return '<div id="mod-quotchart"></div>\r\n<div id="mod-hqpanel"></div>\r\n<div id="mod-footer"></div>\r\n'
}), define("widgets/cn/mod-hqpanel/scripts/data", ["require", "exports",
				"module", "model"], function(e, t, n) {
			var r = e("model");
			return r.extend({
						init : function() {
							this.symbol = app.symbol, this.Qt = this.qt
						},
						_join : function() {
							var e = this, t;
							this.symbol == "sh000001"
									? t = "bkqtRank_A_sh"
									: this.symbol == "sz399001"
											&& (t = "bkqtRank_A_sz");
							if (t)
								this.load("http://qt.gtimg.cn/q=" + t + "&r="
												+ Math.random(), function() {
											var n = window["v_" + t];
											n
													&& (n = n.split("~"), e._qt
															.push(n[2]), e._qt
															.push(n[3]), e._qt
															.push(n[4]));
											var r = e._qt.slice(0);
											e.set("qt", r)
										});
							else {
								var n = e._qt.slice(0);
								n[20] = Math.random(), e.set("qt", n)
							}
						},
						start : function() {
							var e = this;
							this._qtId || (this._qtId = this.Qt.bind({
										fn : function(t) {
											e._qt = t, e._join()
										}
									}))
						},
						stop : function() {
							this._qtId
									&& (this.Qt.rem(this._qtId), this._qtId = null)
						}
					})
		}), define("widgets/cn/mod-hqpanel/scripts/data-5d", ["require",
				"exports", "module", "model"], function(e, t, n) {
			var r = e("model");
			return r.extend({
				init : function() {
					this.symbol = app.symbol, this.Qt = this.qt
				},
				_join : function() {
					var e = this._qt, t = parseFloat(e[18]) + parseFloat(e[20])
							+ parseFloat(e[22]) + parseFloat(e[24])
							+ parseFloat(e[26]), n = parseFloat(e[8])
							+ parseFloat(e[10]) + parseFloat(e[12])
							+ parseFloat(e[14]) + parseFloat(e[16]), r = t - n, i = t
							+ n, s = i > 0
							? (r * 100 / i).toFixed(2) + "%"
							: "--";
					e.push(s), e.push(r), this.set("qt", e)
				},
				start : function() {
					var e = this;
					this._qtId || (this._qtId = this.Qt.bind({
								fn : function(t) {
									e._qt = t, e._join()
								}
							}))
				},
				stop : function() {
					this._qtId && (this.Qt.rem(this._qtId), this._qtId = null)
				}
			})
		}), define("widgets/cn/mod-hqpanel/scripts/data-mx", ["require",
				"exports", "module", "model"], function(e, t, n) {
			var r = e("model");
			return r.extend({
				init : function() {
					this.symbol = app.symbol, this.Qt = this.qt
				},
				_join : function() {
					var e = this._qt[7].split("|"), t = [];
					for (var n in e) {
						var r = e[n].split("/");
						t[n] = [], t[n][0] = r[0], t[n][1] = r[1], t[n][2] = r[2], t[n][3] = r[3], t[n][4] = Math
								.random()
					}
					this.set("qt", t)
				},
				start : function() {
					var e = this;
					this._qtId || (this._qtId = this.Qt.bind({
								fn : function(t) {
									e._qt = t, e._join()
								}
							}))
				},
				stop : function() {
					this._qtId && (this.Qt.rem(this._qtId), this._qtId = null)
				}
			})
		}), define("plugin/zepto/zepto.marquee", ["require", "zepto"],
		function(e) {
			var t = e("zepto");
			return function(e) {
				var t = [], n = 0, r = 1e4, i = 25, s = [];
				e.fn.marquee = function(o) {
					var u = o[0];
					s = o, e(this)
							.html('<ul id=marqueeBox style="overflow:hidden;height:'
									+ i + 'px"><li>' + u + "</li></ul>"), n++, t[0] = setInterval(
							e.fn.marquee.start, r)
				}, e.fn.marquee.start = function() {
					var r = s[n];
					n++, n >= s.length && (n = 0);
					if (marqueeBox.childNodes.length == 1) {
						var i = document.createElement("LI");
						i.innerHTML = r, marqueeBox.appendChild(i)
					} else
						marqueeBox.childNodes[0].innerHTML = r, marqueeBox
								.appendChild(marqueeBox.childNodes[0]), marqueeBox.scrollTop = 0;
					clearInterval(t[1]), t[1] = setInterval(
							e.fn.marquee.scroll, 10)
				}, e.fn.marquee.scroll = function() {
					marqueeBox.scrollTop++, marqueeBox.scrollTop % i == i
							&& clearInterval(t[1])
				}, e.fn.marquee.clear = function() {
					clearInterval(t[0]), clearInterval(t[1])
				}
			}(t), t.fn.marquee
		}), define("g/util/tool", ["require", "exports", "module"], function(e,
		t, n) {
	t.cache = function(e, t) {
		var n = {};
		return t = (t || 300) * 1e3, function() {
			var r = JSON.stringify(Array.prototype.slice.call(arguments)), i = +(new Date);
			if (n[r] && n[r][0] - i < t)
				return n[r][1];
			var s = e.apply(this, arguments);
			return n[r] = [i, s], s
		}
	};
	var r = function(e) {
		return e
	};
	t.array_find = r(function(e, t, n) {
				var r = 0, i = e.length - 1, s, o;
				while (i >= r) {
					s = r + i >> 1, o = t(e[s], s);
					if (o === 0)
						return s;
					o > 0 ? i = s - 1 : r = s + 1
				}
				if (n) {
					var u = e.length;
					if (u == 0)
						return -1;
					var a = 0;
					o = Math.abs(o);
					if (s > 0) {
						a = Math.abs(t(e[s - 1]));
						if (a < o)
							return s - 1
					}
					if (s < u - 1) {
						a = Math.abs(t(e[s + 1]));
						if (a < o)
							return s + 1
					}
					return s >= 0 && s < u
							? s
							: (o = Math.abs(t(e[u - 1])), a = Math.abs(t(e[0])), o < a
									? u - 1
									: 0)
				}
				return -1
			}), t.date_shift = r(function(e, t) {
		if (typeof t == "undefined" || t == 0)
			return e;
		var n = String(e), r;
		if (t.substr) {
			var i = t.substr(t.length - 1, 1);
			return i == "y"
					? (t = parseInt(t, 10), r = new Date(+n.substr(0, 4) + t, n
									.substr(4, 2)
									- 1, n.substr(6, 2)))
					: i == "m"
							&& (t = parseInt(t, 10), r = new Date(+n.substr(0,
											4), n.substr(4, 2) - 1 + t, n
											.substr(6, 2))), r.getFullYear()
					* 1e4 + (+r.getMonth() + 1) * 100 + +r.getDate()
		}
		var r = new Date(n.substr(0, 4), n.substr(4, 2) - 1, n.substr(6, 2)), s = new Date(r
				.getTime()
				+ t * 24 * 60 * 60 * 1e3);
		return s.getFullYear() * 1e4 + (+s.getMonth() + 1) * 100 + +s.getDate()
	}), t.object_extend = function(e, t, n) {
		e = e || {};
		if (t)
			for (var r in t)
				t.hasOwnProperty(r) && (!e.hasOwnProperty(r) || n === !0)
						&& (e[r] = t[r]);
		return e
	}, t.load = function(e, t) {
		var n = document, r = n.getElementsByTagName("head")[0], i = !1, s = n
				.createElement("script");
		s.type = "text/javascript", s.charset = "gbk", s.src = e, s.onload = s.onreadystatechange = function() {
			!i
					&& (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")
					&& (i = !0, t && t(), t = s.onload = s.onreadystatechange = s.onerror = null, r
							&& s.parentNode && r.removeChild(s))
		}, s.onerror = function() {
			i
					|| (i = !0, t && t(), t = s.onload = s.onreadystatechange = s.onerror = null, r
							&& s.parentNode && r.removeChild(s))
		}, r.appendChild(s)
	}, t.singed = function(e) {
		return e < 0 ? e : "+" + e
	}, t.percent = function(e) {
		return e = parseFloat(e), (e > 0 ? "+" : "") + e.toFixed(2) + "%"
	}, t.getLongNum = function(e) {
		var t = {
			toString : function() {
				return this[0] + this[1]
			},
			e : 1
		};
		return e < 1e6 ? (t[0] = e, t[1] = "") : e < 1e9 ? (t[0] = (e / 1e4)
				.toFixed(0), t[1] = "\u4e07", t.e = 1e4) : (t[0] = (e / 1e8)
				.toFixed(2), t[1] = "\u4ebf", t.e = 1e8), t
	}
}), define("g/data/base", ["require", "exports", "module", "../util/tool"],
		function(e, t, n) {
			var r = 0, i = e("../util/tool"), s = i.array_find, o = i.load, u = i.object_extend, a = {};
			n.exports = {
				get : function(e) {
					e.id = r++;
					var t = this;
					return this.data && setTimeout(function() {
								t.flush(e, t.data)
							}, 0), this.queue.push(e), setTimeout(function() {
								t.run()
							}, 0), e.id
				},
				rem : function(e) {
					var t;
					for (var n = 0; n < this.queue.length; n++)
						if (this.queue[n] && this.queue[n].id == e) {
							t = this.queue.splice(n, 1);
							break
						}
					return this.run(), t
				},
				run : function() {
					var e = this.queue.length, t = this;
					e && !this.isRun ? (this.isRun = !0, this.start()) : !e
							&& t.isRun && (this.isRun = !1, this.stop())
				},
				set : function(e) {
					this.data = e;
					var t = this;
					for (var n = 0; n < this.queue.length; n++) {
						var r = this.queue[n];
						r
								&& (this.flush(r, this.data), r.onceoff
										&& this.queue[n] == r
										&& setTimeout(function() {
													var e = r.id;
													return function() {
														t.rem(e)
													}
												}(), 0))
					}
				},
				init : function() {
				},
				start : function() {
				},
				stop : function() {
				},
				flush : function(e, t) {
					e.fn(t)
				},
				_flushDays : function(e, t) {
					var n = e.shift || 0, r = e.beg, i = e.end;
					if (r) {
						var o = t.length, u = 0, a = o - 1, f, l, c = u, h = a;
						f = s(t, function(e) {
									return parseInt(e[0], 10) - r
								}, !0), n != 0
								&& (f += n, f < 0 ? (n -= f, f = 0) : f >= o
										&& (n -= f - o - 1, f = o - 1)), c = f, f = s(
								t, function(e) {
									return parseInt(e[0], 10) - i
								}, !0), h = f;
						var p = t.slice(c, h + 1);
						if (e.__delay && h + 1 < t.length)
							return
					} else if (r !== !1) {
						var c = t.length - this.defalutCnt, h = t.length - 1;
						c < 0 && (c = 0), n != 0
								&& (c += n, c < 0 ? (n -= c, c = 0) : c >= o
										&& (n -= c - t.length - 1, c = t.length
												- 1));
						var p = t.slice(c, h + 1)
					}
					var d = e.limit === !1 ? 0 : e.limit || 20;
					if (p.length + n < d) {
						var v = d - p.length - n;
						if (c < v / 2)
							v -= c, c = 0, h += v, p = t.slice(c, h + 1);
						else if (t.length - h - 1 < v / 2)
							v -= t.length - h - 1, h = t.length - 1, c -= v, c < 0
									&& (c = 0), p = t.slice(c, h + 1);
						else {
							var m = Math.round(v / 2);
							v -= m, c -= m, h += v, p = t.slice(c, h + 1)
						}
					}
					p.qt = t.qt;
					if (p.length > 1e3) {
						if (!e.__delay || +(new Date) - e.__delay >= 3e4)
							e.__delay = +(new Date), e.fn(p, n)
					} else
						e.__delay = +(new Date), e.fn(p, n)
				},
				_load : function(e, t, n) {
					var r = this, i = a[t] = a[t] || {}, s = i[e] = i[e] || [];
					s.push(n);
					if (s.length > 1)
						return;
					for (var u in i)
						if (u != e)
							return;
					var f, l = 6e4, c = function() {
						var n = !1;
						for (var r in i) {
							n = r;
							break
						}
						if (n == 0)
							return;
						var s = setTimeout(function() {
									n != e && (e = n, f = 1);
									if (!(f--)) {
										var t = i[n];
										if (t) {
											for (var r = 0; r < t.length; r++)
												t[r]([]);
											delete i[n]
										}
									}
									c()
								}, l);
						o(n, function() {
							var e = window[t], r;
							if (e) {
								clearTimeout(s), s = null, window[t] = null, typeof e == "string"
										? e = e.split("\n")
										: e && "data" in e
												? typeof e.data == "string"
														? e = e.data
																.replace(
																		/\\"/g,
																		"")
																.split("\\\\n\\\\\\n")
														: r = e.data
												: r = e;
								if (!r) {
									r = [];
									for (var o = 0; o < e.length; o++)
										if (e[o] && e[o].length > 2) {
											var u = e[o].split(" ");
											/^\d{6}$/.test(u[0])
													&& (u[0].substr(0, 2) > "20"
															? u[0] = "19"
																	+ u[0]
															: u[0] = "20"
																	+ u[0]), r
													.push(u)
										}
								}
							}
							var a = i[n];
							if (a) {
								for (var o = 0; o < a.length; o++)
									a[o](r || []);
								delete i[n]
							}
							c()
						})
					};
					c()
				},
				_cleanMinute : function(e, t) {
					var n = [], r = [], i = [], s = 0, o = 0, u = t.length, a = e.time.length, f = 0, l = e.open;
					if (!l) {
						for (var c = 0; c < a; c++)
							if (e.price[c]) {
								l = e.price[c];
								break
							}
						(isNaN(l) || l == 0) && (l = e.yprice)
					}
					while (s < u || o < a) {
						var h = t[s], p = e.time[o];
						if (!h && p) {
							if (!n[s - 1])
								break;
							l = e.price[o] == 0 ? l : e.price[o], r[s - 1] = l, i[s
									- 1] += parseInt(e.volume[o], 10), o++
						} else
							!p || p > h
									? (n.push(h), r.push(l), i.push(f), f = 0, s++)
									: (f += parseInt(e.volume[o], 10), l = e.price[o] == 0
											? l
											: e.price[o], p == h
											&& (n.push(h), r.push(l), i.push(f), f = 0, s++), o++)
					}
					e.time = n, e.volume = i, e.price = r
				},
				create : function(e) {
					var t = function() {
						this.queue = [], this.init.apply(this, arguments)
					};
					return t.prototype.get = this.get, t.prototype.rem = this.rem, t.prototype.run = this.run, t.prototype.set = this.set, t.prototype.flush = this.flush, t.prototype._join = this._join, t.prototype._flushDays = this._flushDays, t.prototype._load = this._load, u(
							t.prototype, e, !0), t
				}
			}
		}), define("g/data/mqt", ["require", "exports", "module"], function(e,
		t, n) {
	var r = 0, i = Math.random() * 1e4 | 0, s = function() {
		return i + "_" + r++
	}, o = t.load = function(e, t) {
		var n = document, r = n.getElementsByTagName("head")[0], i = !1, s = n
				.createElement("script");
		s.type = "text/javascript", s.charset = "gbk", s.src = e, s.onload = s.onreadystatechange = function() {
			!i
					&& (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")
					&& (i = !0, t && t(), t = s.onload = s.onreadystatechange = null, r
							&& s.parentNode && r.removeChild(s))
		}, r.appendChild(s)
	}, u = 0, a = [];
	t.interval = 5, t.KEYS_LIMIT = 60, t.add = function(e) {
		return e = e || {}, e.id = u++, e.keys = e.keys || [], typeof e.keys == "string"
				&& (e.keys = e.keys.split(",")), e.onData = e.onData
				|| function() {
				}, e.onUpdate = e.onUpdate || e.onData, e.interval = e.interval
				|| t.interval, e._status = 0, a.push(e), h(), e.id
	}, t.get = function(e) {
		for (var t = 0; t < objs.length; t++)
			if (a[t].id == e)
				return a[t]
	}, t.rem = function(e) {
		for (var t = 0; t < a.length; t++)
			if (a[t].id == e) {
				var n = a;
				return a.splice(t, 1), n._status = -1, h(), n
			}
	};
	var f = 0, l = setInterval(function() {
				f++, p()
			}, 1e3), c = !1, h = function() {
		c || (c = setTimeout(function() {
					c = !1, p()
				}, 0))
	}, p = function() {
		var e = {}, t = [], n = 0;
		for (var r = 0; r < a.length; r++) {
			var i = a[r];
			if (i._status == 0 || f % i.interval == 0) {
				for (var s = 0; s < i.keys.length; s++)
					e[i.keys[s]] || (e[i.keys[s]] = !0, n++);
				i._status == 0 && (i._status = 1), t.push(i)
			}
		}
		if (n) {
			var o = [];
			for (var u in e)
				o.push(u);
			d(o, t)
		}
	}, d = function(e, n) {
		var r = 0, i = {}, u = e.slice();
		for (;;) {
			var a = e.splice(0, t.KEYS_LIMIT);
			if (!a.length)
				break;
			r++, o("http://qt.gtimg.cn/" + s() + "&q=" + a.join(","),
					function() {
						r--;
						if (r == 0)
							for (var e = 0; e < n.length; e++) {
								var i = {};
								for (var s = 0; s < n[e].keys.length; s++)
									i[n[e].keys[s]] = window["v_"
											+ n[e].keys[s]];
								n[e]._status == 1
										? (n[e].onData(i, n[e].keys), n[e]._status = 2)
										: n[e]._status > 0
												&& n[e].onUpdate(i, n[e].keys), n[e].onceOff
										&& t.rem(n[e].id)
							}
					})
		}
	}
}), define("g/data/qt", ["require", "exports", "module", "./base", "./mqt",
				"../util/tool"], function(e, t, n) {
			var r = e("./base"), i = e("./mqt"), s = e("../util/tool").load;
			n.exports = r.create({
				init : function(e) {
					var t = this.market = e.substr(0, 2);
					t == "hk"
							? (this.symbol = "r_" + e, this.hqingtime = "r_hqingtime")
							: t == "us"
									? (this.symbol = ""
											+ e.replace(/\.[^.]+$/, "")
													.replace(/[\.\-]/g, "__"), this.hqingtime = "usDJI")
									: (this.symbol = e, this.hqingtime = "")
				},
				start : function() {
					var e = this;
					this.id = i.add({
						keys : [e.symbol, e.hqingtime],
						onData : function(t) {
							var n = t[e.symbol];
							if (n) {
								if (e._symbol == n)
									if (!e.hqingtime
											|| e.hqingtime
											&& e._hqingtime == window["v_"
													+ e.hqingtime])
										return;
								e._symbol = n, n = n.split("~");
								if (e.hqingtime) {
									var r = t[e.hqingtime];
									r
											&& (e._hqingtime = r, r = r
													.split("~"), r.length == 1
													? r = r[0]
													: r[30]
															? r = r[30]
															: r = !1, r
													&& r > n[30] && (n[30] = r))
								}
								if (e.market == "us") {
									var r = n[30].substr(11, 5);
									r < "09:30"
											? n[30] = n[30].substr(0, 11)
													+ "09:30"
													+ n[30].substr(16)
											: r > "16:00"
													&& (n[30] = n[30].substr(0,
															11)
															+ "16:00"
															+ n[30].substr(16))
								}
								e.set(n)
							} else
								e.set([])
						}
					})
				},
				stop : function() {
					i.rem(this.id)
				}
			})
		}), define("g/data/daily", ["require", "exports", "module", "./base",
				"./qt", "../util/tool"], function(e, t, n) {
			var r = e("./base"), i = e("./qt"), s = e("../util/tool"), o = s.date_shift, u = s.array_find;
			n.exports = r.create({
				init : function(e, t, n) {
					this.symbol = e, e.substr(0, 2) == "us"
							&& e.indexOf(".") < 0
							&& (this.symbol = "us." + e.substr(2)), this.dataQt = t
							|| new i(e);
					var r = this.symbol.substr(0, 2);
					r == "us"
							? this.baseUrl = "http://data.gtimg.cn/flashdata/us/"
							: r == "hk"
									? this.baseUrl = "http://data.gtimg.cn/flashdata/hk/"
									: this.baseUrl = "http://data.gtimg.cn/flashdata/hushen/", this.defalutCnt = n
							|| 70
				},
				_getData : function() {
					var e = this, t, n = "latest_daily_data";
					this._load(this.baseUrl + "latest/daily/" + this.symbol
									+ ".js", n, function(t) {
								var n = {};
								for (var r = 0; t[0] && r < t[0].length; r++) {
									var i = t[0][r].split(":");
									i[0] == "start"
											&& (i[1] = (i[1].substr(0, 2) >= "50"
													? "19"
													: "20")
													+ i[1]), n[i[0]] = parseInt(
											i[1], 10)
								}
								t = t.slice(1), e._cfg = n, e._data = t
										.slice(1), e._lastVolume = 0, e._join()
							})
				},
				_clean : function(e) {
					var e = e || this._data, t = this._qt;
					this._cleanData = !0;
					if (t.length) {
						var n = this.precision = t[3].length
								- t[3].indexOf(".") - 1, r = Math.pow(10, n), i;
						for (var s = 0, o = e.length; s < o; s++)
							i = e[s], i[1] = (i[1] * r | 0) / r, i[2] = (i[2]
									* r | 0)
									/ r, i[3] = (i[3] * r | 0) / r, i[4] = (i[4]
									* r | 0)
									/ r
					}
				},
				_join : function() {
					var e = this, t = this._data, n = this._qt;
					if (t && n) {
						if (!n.length)
							return e.set(t);
						!e._cleanData && e._clean();
						var r = n[30].replace(/[- \/:]/ig, ""), i = t[t.length
								- 1], s = [r.substr(0, 8),
								n[5] == 0 ? n[3] : n[5], n[3], n[33], n[34],
								parseInt(n[36], 10)];
						/hk[a-z]+/gi.test(this.symbol) && (s[5] *= 1e4), n[3] != 0
								&& (i && i[0] == s[0]
										? (i[0] = s[0], i[2] = s[2], i[3] = Math
												.max(i[3], s[3]), i[4] = Math
												.min(i[4], s[4]), i[5] = parseInt(
												i[5], 10)
												+ s[5] - this._lastVolume, this._lastVolume = s[5])
										: t.push(s)), t.qt = n, e.set(t)
					}
				},
				getFqData : function(e, t) {
					var n = function(n) {
						function r(t, i) {
							var s = n.length;
							return s == 0 ? 1 : e == "b" ? n[0][0] <= t
									&& (s == 1 || s > 1 && n[1][0] > t)
									? s > 1 && n[1][0] <= i
											? (n.shift(), !1)
											: n[0][2]
									: n[0][0] > t ? n[0][0] > i ? 1 : !1 : (n
											.shift(), r(t, i)) : e == "f"
									? n[0][0] > t
											? n[0][0] <= i ? !1 : n[0][1]
											: (n.shift(), r(t, i))
									: 1
						}
						t(n, r)
					};
					if (this._fq)
						return n(this._fq.slice());
					var r = this.symbol, i = this;
					this._load("http://data.gtimg.cn/flashdata/hushen/fuquan/"
									+ r + ".js?maxage=6000000", "v_fq_" + r,
							function(e) {
								var t = e && e[0] && e[0].join(" ") || "";
								t = t.split("^"), t.forEach(function(e, n) {
									t[n] = e.split("~"), n > 0
											&& (t[n][2] *= t[n - 1][2]), t[n][0] = parseInt(
											t[n][0], 10)
								});
								for (var r = t.length - 2; r >= 0; r--)
									t[r][1] *= t[r + 1][1];
								i._fq = t, n(t.slice())
							})
				},
				_checkFq : function(e, t, n) {
					var r = this;
					this.getFqData(e, function(i, s) {
								function u(e, t) {
									return (e * t).toFixed(r.precision)
								}
								var o = [];
								for (var a = 0; a < t.length; a++) {
									var f = t[a];
									if (!f[e]) {
										var l = s(f[0], f[0]);
										f[e] = [f[0], u(f[1], l), u(f[2], l),
												u(f[3], l), u(f[4], l), f[5]]
									}
									o.push(f[e])
								}
								n(o)
							})
				},
				_check : function(e, t) {
					var n = e.beg, r = e.end, i = this, s = this._data;
					if (n) {
						var a = i._cfg, f = o(n, e.shift), l = String(r)
								.substr(0, 4), c = 0, h = a.total;
						while (h > 0) {
							var p = String(f).substr(0, 4), d = p.substr(2, 2);
							a[d]
									&& (c++, h -= a[d], this._load(this.baseUrl
													+ "daily/" + d + "/"
													+ i.symbol + ".js",
											"daily_data_" + d, function() {
												var e = d;
												return function(n) {
													i._clean(n);
													if (a[e]) {
														a.total -= a[e], delete a[e];
														var r = parseInt(
																n[0][0], 10), o = u(
																s, function(e) {
																	return parseInt(
																			e[0],
																			10)
																			- r
																}, !0), f = parseInt(
																s[o][0], 10);
														f < r && o++;
														var l = parseInt(
																n[n.length - 1][0],
																10), h = u(s,
																function(e) {
																	return parseInt(
																			e[0],
																			10)
																			- l
																}, !0), p = parseInt(
																s[h][0], 10);
														p <= l && h++, h < o
																&& (h = o), Array.prototype.splice
																.apply(
																		s,
																		[
																				o,
																				h
																						- o]
																				.concat(n))
													}
													c--, c === 0 && t(s)
												}
											}()));
							if (p >= l)
								break;
							f = o(f, "1y")
						}
						if (c)
							return
					}
					t(s)
				},
				flush : function(e, t) {
					var n = this;
					this._check(e, function(t) {
								e.fq ? n._checkFq(e.fq, t, function(t) {
											n._flushDays(e, t)
										}) : n._flushDays(e, t)
							})
				},
				start : function() {
					var e = this;
					this._data || this._getData(), this._qtId
							|| (this._qtId = this.dataQt.get({
								fn : function(t) {
									if (e._qt && e._qt.join("~") == t.join("~"))
										return;
									e._qt = t, e._join()
								}
							}))
				},
				stop : function() {
					this._qtId
							&& (this.dataQt.rem(this._qtId), this._qtId = null)
				}
			})
		}), define("g/data/weekly", ["require", "exports", "module", "./base",
				"./qt", "./daily"], function(e, t, n) {
			function o(e) {
				e += "", e = new Date(e.substr(0, 4), e.substr(4, 2) - 1, e
								.substr(6, 2));
				var t = e.getDay(), n = 864e5;
				return w = [new Date(e.getTime() - (t - 1) * n),
						new Date(e.getTime() + (5 - t) * n)], [
						w[0].getFullYear() * 1e4 + (w[0].getMonth() + 1) * 100
								+ w[0].getDate(),
						w[1].getFullYear() * 1e4 + (w[1].getMonth() + 1) * 100
								+ w[1].getDate()]
			}
			var r = e("./base"), i = e("./qt"), s = e("./daily");
			n.exports = r.create({
				init : function(e, t, n, r) {
					this.symbol = e, e.substr(0, 2) == "us"
							&& e.indexOf(".") < 0
							&& (this.symbol = "us." + e.substr(2)), this.dataQt = t
							|| new i(e), this.dataDaily = n
							|| new s(e, this.dataQt);
					var o = this.symbol.substr(0, 2);
					o == "us"
							? this.baseUrl = "http://data.gtimg.cn/flashdata/us/"
							: o == "hk"
									? this.baseUrl = "http://data.gtimg.cn/flashdata/hk/"
									: this.baseUrl = "http://data.gtimg.cn/flashdata/hushen/", this.defalutCnt = r
							|| 70
				},
				_clean : function() {
					var e = this._data, t = this._qt;
					this._cleanData = !0;
					if (t.length) {
						var n = this.precision = t[3].length
								- t[3].indexOf(".") - 1;
						for (var r = 0; r < e.length; r++)
							e[r][1] = parseFloat(e[r][1]).toFixed(n), e[r][2] = parseFloat(e[r][2])
									.toFixed(n), e[r][3] = parseFloat(e[r][3])
									.toFixed(n), e[r][4] = parseFloat(e[r][4])
									.toFixed(n)
					}
				},
				_getData : function() {
					var e = this, t, n = "weekly_data";
					this._load(this.baseUrl + "weekly/" + this.symbol + ".js",
							n, function(t) {
								e._data = t, e._lastVolume = 0, e._join()
							})
				},
				_join : function(e) {
					var t = this, n = this._data, r = this._qt;
					if (n && r) {
						if (!r.length)
							return t.set(n);
						!t._cleanData && t._clean();
						if (r[3] != 0) {
							var i = r[30].replace(/[- \/:]/ig, ""), s = n[n.length
									- 1], o = [i.substr(0, 8),
									r[5] == 0 ? r[3] : r[5], r[3], r[33],
									r[34], parseInt(r[36], 10)];
							/hk[a-z]+/gi.test(this.symbol) && (o[5] *= 1e4);
							var u = new Date(i.substr(0, 4),
									i.substr(4, 2) - 1, i.substr(6, 2)), a = new Date(u
									.getTime()
									- u.getDay() * 24 * 60 * 60 * 1e3), f = new Date(a
									.getTime()
									+ 5184e5);
							a = a.getFullYear() * 1e4 + (a.getMonth() + 1)
									* 100 + a.getDate(), f = f.getFullYear()
									* 1e4 + (f.getMonth() + 1) * 100
									+ f.getDate(), s && a < parseInt(s[0], 10)
									&& parseInt(s[0], 10) < f
									? (s[0] = o[0], s[2] = o[2], s[3] = Math
											.max(s[3], o[3]), s[4] = Math.min(
											s[4], o[4]), s[5] = parseInt(s[5],
											10)
											+ o[5] - (this._lastVolume || 0), this._lastVolume = o[5])
									: n.push(o)
						}
						n.qt = r, t.set(n)
					}
				},
				_checkFq : function(e, t, n) {
					var r = this, i = this.dataDaily;
					i.getFqData(e, function(s, u) {
						function f(e, t) {
							return (e * t).toFixed(r.precision)
						}
						var a = [], l = 0;
						for (var c = 0; c < t.length; c++) {
							var h = t[c];
							if (!h[e]) {
								var p = o(h[0]), d = u(p[0], p[1]);
								d === !1 ? (l++, i.get({
									onceoff : !0,
									beg : p[0],
									end : p[1],
									fq : e,
									limit : !1,
									fn : function() {
										var r = c, i = t, s = e;
										return function(t) {
											var s = a[r] = i[r][e] = i[r]
													.slice(), o = t.length, u = [];
											for (var f = 0; f < o; f++)
												f == 0 && (s[1] = t[f][1]), f == o
														- 1
														&& (s[2] = t[f][2]), u
														.push(t[f][3], t[f][4]);
											s[3] = Math.max.apply(null, u), s[4] = Math.min
													.apply(null, u), l--, l == 0
													&& n(a)
										}
									}()
								}))
										: h[e] = [h[0], f(h[1], d), f(h[2], d),
												f(h[3], d), f(h[4], d), h[5]]
							}
							a[c] = h[e]
						}
						l == 0 && n(a)
					})
				},
				flush : function(e, t) {
					var n = this;
					e.fq ? n._checkFq(e.fq, t, function(t) {
								n._flushDays(e, t)
							}) : n._flushDays(e, t)
				},
				start : function() {
					var e = this;
					this._data || this._getData(), this._qtId
							|| (this._qtId = this.dataQt.get({
										fn : function(t) {
											e._qt = t, e._join()
										}
									}))
				},
				stop : function() {
					this._qtId
							&& (this.dataQt.rem(this._qtId), this._qtId = null)
				}
			})
		}), define("g/data/monthly", ["require", "exports", "module", "./base",
				"./qt", "./daily"], function(e, t, n) {
			function o(e) {
				e += "";
				var t = e.substr(0, 4), n = e.substr(4, 2) - 1, r = [
						new Date(t, n, 1), new Date(t, n + 1, 0)];
				return [
						r[0].getFullYear() * 1e4 + (r[0].getMonth() + 1) * 100
								+ r[0].getDate(),
						r[1].getFullYear() * 1e4 + (r[1].getMonth() + 1) * 100
								+ r[1].getDate()]
			}
			var r = e("./base"), i = e("./qt"), s = e("./daily");
			n.exports = r.create({
				init : function(e, t, n, r) {
					this.symbol = e, e.substr(0, 2) == "us"
							&& e.indexOf(".") < 0
							&& (this.symbol = "us." + e.substr(2)), this.dataQt = t
							|| new i(e), this.dataDaily = n
							|| new s(e, this.dataQt);
					var o = this.symbol.substr(0, 2);
					o == "us"
							? this.baseUrl = "http://data.gtimg.cn/flashdata/us/"
							: o == "hk"
									? this.baseUrl = "http://data.gtimg.cn/flashdata/hk/"
									: this.baseUrl = "http://data.gtimg.cn/flashdata/hushen/", this.defalutCnt = r
							|| 70
				},
				_getMonthly : function() {
					var e = this, t, n = "monthly_data";
					this._load(this.baseUrl + "monthly/" + this.symbol + ".js",
							n, function(t) {
								e._data = t;
								var n = e._data, r = e._qt;
								e._lastVolume = 0, e._join()
							})
				},
				_clean : function() {
					var e = this._data, t = this._qt;
					this._cleanData = !0;
					var n = this.precision = t[3].length - t[3].indexOf(".")
							- 1;
					for (var r = 0; r < e.length; r++)
						e[r][1] = parseFloat(e[r][1]).toFixed(n), e[r][2] = parseFloat(e[r][2])
								.toFixed(n), e[r][3] = parseFloat(e[r][3])
								.toFixed(n), e[r][4] = parseFloat(e[r][4])
								.toFixed(n)
				},
				_join : function() {
					var e = this, t = this._data, n = this._qt;
					if (t && n) {
						if (!n.length)
							return e.set(t);
						!e._cleanData && e._clean();
						if (n[3] != 0) {
							var r = n[30].replace(/[- \/:]/ig, ""), i = t[t.length
									- 1], s = [r.substr(0, 8),
									n[5] == 0 ? n[3] : n[5], n[3], n[33],
									n[34], parseInt(n[36], 10)];
							/hk[a-z]+/gi.test(this.symbol) && (s[5] *= 1e4), i
									&& i[0].substr(0, 6) == r.substr(0, 6)
									? (i[0] = s[0], i[2] = s[2], i[3] = Math
											.max(i[3], s[3]), i[4] = Math.min(
											i[4], s[4]), i[5] = parseInt(i[5],
											10)
											+ s[5] - (this._lastVolume || 0), this._lastVolume = s[5])
									: t.push(s)
						}
						t.qt = n, e.set(t)
					}
				},
				_checkFq : function(e, t, n) {
					var r = this, i = this.dataDaily;
					i.getFqData(e, function(s, u) {
						function f(e, t) {
							return (e * t).toFixed(r.precision)
						}
						var a = [], l = 0;
						for (var c = 0; c < t.length; c++) {
							var h = t[c];
							if (!h[e]) {
								var p = o(h[0]), d = u(p[0], p[1]);
								d === !1 ? (l++, i.get({
									onceoff : !0,
									beg : p[0],
									end : p[1],
									fq : e,
									limit : !1,
									fn : function() {
										var r = c, i = t, s = e;
										return function(t) {
											var s = a[r] = i[r][e] = i[r]
													.slice(), o = t.length, u = [];
											for (var f = 0; f < o; f++)
												f == 0 && (s[1] = t[f][1]), f == o
														- 1
														&& (s[2] = t[f][2]), u
														.push(t[f][3], t[f][4]);
											s[3] = Math.max.apply(null, u), s[4] = Math.min
													.apply(null, u), l--, l == 0
													&& n(a)
										}
									}()
								}))
										: h[e] = [h[0], f(h[1], d), f(h[2], d),
												f(h[3], d), f(h[4], d), h[5]]
							}
							a[c] = h[e]
						}
						l == 0 && n(a)
					})
				},
				flush : function(e, t) {
					var n = this;
					e.fq ? n._checkFq(e.fq, t, function(t) {
								n._flushDays(e, t)
							}) : n._flushDays(e, t)
				},
				start : function() {
					var e = this;
					this._data || this._getMonthly(), this._qtId
							|| (this._qtId = this.dataQt.get({
										fn : function(t) {
											e._qt = t, e._join()
										}
									}))
				},
				stop : function() {
					this._qtId
							&& (this.dataQt.rem(this._qtId), this._qtId = null)
				}
			})
		}), define("g/data/time", ["require", "exports", "module",
				"../util/tool"], function(e, t, n) {
			var r = e("../util/tool").array_find;
			n.exports = {
				us : ["0930", "1600"],
				sh : [["0930", "1130"], ["1300", "1500"]],
				sz : [["0930", "1130"], ["1300", "1500"]],
				hk : [["0930", "1200"], ["1300", "1600"]],
				data : {},
				create : function(e, t) {
					var n = [], r = parseInt(e.substr(0, 2), 10), i = parseInt(
							t.substr(0, 2), 10), s = parseInt(e.substr(2, 2),
							10), o = parseInt(t.substr(2, 2), 10), u = function(
							e, t) {
						return (e < 10 ? "0" : "") + e + (t < 10 ? "0" : "")
								+ t
					};
					while (r < i || r == i && s <= o)
						n.push(u(r, s)), s++, s == 60
								&& (s = 0, r++, r == 24 && (r = 0));
					return n
				},
				get : function(e) {
					if (!this.data[e]) {
						var t = this[e], n = [];
						if (typeof t[0] == "string")
							n = this.create(t[0], t[1]);
						else
							for (var r = 0; r < t.length; r++)
								n.push.apply(n, this.create(t[r][0], t[r][1]));
						this.data[e] = n
					}
					return this.data[e]
				},
				range : function(e, t, n, i) {
					var s = this.get(e);
					return t ? t = r(s, function(e) {
								return e - t
							}, !0) + (i ? 0 : 1) : t = 0, n ? n = r(s,
							function(e, t) {
								return e - n
							}, !0) : n = t, s.slice(t, n + (i ? 1 : 0))
				}
			}
		}), define("g/data/minute", ["require", "exports", "module", "./base",
				"./qt", "./time"], function(e, t, n) {
			var r = e("./base"), i = e("./qt"), s = e("./time");
			n.exports = r.create({
				init : function(e, t) {
					this.symbol = e, e.substr(0, 2) == "us"
							&& e.indexOf(".") < 0
							&& (this.symbol = "us." + e.substr(2)), this.dataQt = t
							|| new i(e)
				},
				_join : function() {
					var e = this;
					if (new Date - e._data_time > 3e5) {
						e._getData();
						return
					}
					var t = e._data, n = e._qt;
					if (t && n) {
						if (!n.length) {
							this.set(t);
							return
						}
						n[36] = n[36] | 0;
						var i = n[30].replace(/[\- :\/]/g, ""), o = i.substr(8,
								4), u = s.get(e.symbol.substr(0, 2));
						o > u[u.length - 1] ? o = u[u.length - 1] : o < u[0]
								&& (o = u[0]), t.date != i.substr(0, 8)
								&& (t = e._data = {
									date : i.substr(0, 8),
									time : [],
									price : [],
									volume : []
								}), n[3] = parseFloat(n[3]) === 0
								? parseFloat(n[5]) === 0 ? n[4] : n[5]
								: n[3], t.yprice = n[4], e._isClean
								|| (e._isClean = !0, r._cleanMinute(t, s.range(
												e.symbol.substr(0, 2), null, o,
												!0)));
						var a = t.time.length - 1, f = a < 0
								? n[4] || n[3]
								: t.price[a], l = s.range(
								e.symbol.substr(0, 2), t.time[a], o);
						for (var c = 0; c < l.length; c++)
							a++, t.time.push(l[c]), t.price.push(f), t.volume
									.push(0);
						if (a < 0 || o != t.time[a])
							t.time.push(o), t.price.push(n[3]), t.volume
									.push(n[36] - e._lastVolume < 0 ? 0 : n[36]
											- e._lastVolume), e._lastVolume = n[36];
						else {
							t.price[a] = n[3];
							var h = n[36] - e._lastVolume;
							t.volume[a] += h, t.volume[a] < 0
									&& (t.volume[a] = 0), e._lastVolume = n[36]
						}
						t.qt = n, this.set(t)
					}
				},
				_getData : function() {
					if (this._loading)
						return;
					this._loading = !0;
					var e = this, t, n;
					e.symbol.substr(0, 2) == "us"
							? (t = "http://message.finance.qq.com/flash/minute/day_minute.php?code="
									+ this.symbol + "&var_name=mindata", n = "mindata")
							: e.symbol.substr(0, 2) == "hk"
									? (t = "http://data.gtimg.cn/flashdata/hk/minute/"
											+ this.symbol + ".js", n = "min_data")
									: (t = "http://data.gtimg.cn/flashdata/hushen/minute/"
											+ this.symbol + ".js", n = "min_data"), this
							._load(t, n, function(t) {
								e._loading = !1, e._data_time = new Date;
								var n = e._data = {
									date : t[0] && t[0][0]
											&& t[0][0].split(":")[1],
									volume : [],
									price : [],
									time : []
								};
								/^\d{6}$/.test(n.date)
										&& (n.date.substr(0, 2) > "20"
												? n.date = "19" + n.date
												: n.date = "20" + n.date);
								var r = 0;
								for (var i = 1; i < t.length; i++)
									n.time.push(t[i][0]), n.price.push(t[i][1]), n.volume
											.push(t[i][2] - r < 0 ? 0 : t[i][2]
													- r), r = t[i][2];
								e._lastVolume = r, e._join()
							})
				},
				start : function() {
					var e = this;
					this._data || this._getData(), this._qtId
							|| (this._qtId = this.dataQt.get({
										fn : function(t) {
											e._qt = t, e._join()
										}
									}))
				},
				stop : function() {
					this._qtId
							&& (this.dataQt.rem(this._qtId), this._qtId = null)
				}
			})
		}), define("g/data/minute5", ["require", "exports", "module", "./base",
				"./minute", "./time"], function(e, t, n) {
			var r = e("./base"), i = e("./minute"), s = e("./time");
			n.exports = r.create({
				init : function(e, t) {
					this.symbol = e, e.substr(0, 2) == "us"
							&& e.indexOf(".") < 0
							&& (this.symbol = "us." + e.substr(2)), this.dataMin = t
							|| new i(e)
				},
				_join : function() {
					var e = this, t = e._data4, n = e._data;
					t
							&& n
							&& (t.length && n.date == t[t.length - 1].date
									? t[t.length - 1] = n
									: t.push(n), t = t.slice(-5), t.qt = n.qt, this
									.set(t))
				},
				_getData : function() {
					if (this._loading)
						return;
					this._loading = !0;
					var e = this, t, n;
					e.symbol.substr(0, 2) == "us"
							? (t = "http://data.gtimg.cn/flashdata/us/4day/"
									+ this.symbol + ".js", n = "us_5day_min")
							: e.symbol.substr(0, 2) == "hk"
									? (t = "http://stock.gtimg.cn/data/hk_4day_minute.php?var_name=hk4dayminute&code="
											+ this.symbol, n = "hk4dayminute")
									: (t = "http://data.gtimg.cn/flashdata/hushen/4day/"
											+ this.symbol.substr(0, 2)
											+ "/"
											+ this.symbol + ".js?", n = "min_data_4d"), this
							._load(t, n, function(t) {
								e._loading = !1, e._data4 = [];
								for (var n = 0; n < t.length; n++) {
									/^\d{6}$/.test(t[n].date)
											&& (t[n].date = (t[n].date.substr(
													0, 2) > 20 ? "19" : "20")
													+ t[n].date);
									var i = e._data4[n] = {
										date : t[n].date,
										time : [],
										price : [],
										volume : [],
										yprice : t[n].prec
									}, o = t[n].data.split("^"), u = 0;
									for (var a = 0; a < o.length; a++) {
										var f = o[a].split("~");
										f[0] = f[0].replace(":", "").substr(0,
												4), f.length >= 3
												&& (i.time.push(f[0]), i.price
														.push(f[1]), i.volume
														.push(f[2] - u), u = f[2])
									}
									r._cleanMinute(i, s.get(e.symbol.substr(0,
													2)))
								}
								e._data4.reverse(), e._join()
							})
				},
				start : function() {
					var e = this;
					this._data4 || this._getData(), this._qtId
							|| (this._qtId = this.dataMin.get({
										fn : function(t) {
											e._data = t, e._join()
										}
									}))
				},
				stop : function() {
					this._qtId
							&& (this.dataMin.rem(this._qtId), this._qtId = null)
				}
			})
		}), define("g/data/minutek", ["require", "exports", "module", "./base",
				"./minute5", "./time"], function(e, t, n) {
			var r = e("./base"), i = e("./minute5"), s = e("./time");
			n.exports = r.create({
				init : function(e, t, n, r) {
					this.symbol = e, e.substr(0, 2) == "us"
							&& e.indexOf(".") < 0
							&& (this.symbol = "us." + e.substr(2));
					switch (t || 5) {
						case 60 :
							this.period = function(e) {
								return /(1030|1130|1400|1500)$/.test(e)
							};
							break;
						case 30 :
							this.period = function(e) {
								return /(30|00)$/.test(e)
							};
							break;
						default :
							this.period = function(e) {
								return e % 5 == 0
							}
					}
					this.dataMin = n || new i(e), this.defalutCnt = r || 70
				},
				_join : function(e) {
					var t = [], n = this.period, r = this.precision;
					for (var i = 0; i < e.length; i++) {
						var s = e[i], o = s.date, u = s.time.length, a = 0;
						for (var f = 0; f < u; f++) {
							if (f < u - 1) {
								if (!n(s.time[f]))
									continue;
								if (a == f)
									continue
							}
							var l = [o + s.time[f], s.price[a], s.price[f]];
							l[1] = parseFloat(l[1]).toFixed(r), l[2] = parseFloat(l[2])
									.toFixed(r);
							var c = s.price.slice(a, f + 1);
							l[3] = parseFloat(Math.max.apply(null, c))
									.toFixed(r), l[4] = parseFloat(Math.min
									.apply(null, c)).toFixed(r), l[5] = 0, c = s.volume
									.slice(a, f + 1);
							while (c.length)
								l[5] += parseInt(c.pop(), 10);
							t.push(l), a = f + 1
						}
					}
					this.set(t)
				},
				flush : r._flushDays,
				start : function() {
					var e = this;
					this._qtId || (this._qtId = this.dataMin.get({
								fn : function(t) {
									if (!e.precision) {
										var n = t.qt;
										e.precision = n[3].length
												- n[3].indexOf(".") - 1
									}
									e._data = t, e._join(t)
								}
							}))
				},
				stop : function() {
					this._qtId
							&& (this.dataMin.rem(this._qtId), this._qtId = null)
				}
			})
		}), define("g/util/promise", ["require", "exports", "module"],
		function(e, t, n) {
			var r = n.exports = function(e, t) {
				var n = this;
				this._status = r.STATUS.INIT;
				var n = this;
				setTimeout(function() {
					e.call(n, function() {
						if (n._status == r.STATUS.INIT
								|| n._status == r.STATUS.PROGRESS)
							n._status = r.STATUS.DONE, n._done_arg = arguments, n._done_fn
									&& n._done_fn.apply(window, n._done_arg)
					}, function() {
						n._status != r.STATUS.CANCEL
								&& (n._status = r.STATUS.ERROR, n._error_arg = arguments, n._error_fn
										&& n._error_fn.apply(window,
												n._error_arg))
					}, function() {
						if (n._status == r.STATUS.INIT
								|| n._status == r.STATUS.PROGRESS)
							n._status = r.STATUS.PROGRESS, n._progress_arg = arguments, n._progress_fn
									&& n._progress_fn.apply(window,
											n._progress_arg)
					})
				}, 0), t && (this._cancel_fn = t)
			};
			r.STATUS = {
				INIT : 0,
				CANCEL : -1,
				DONE : 1,
				ERROR : 2,
				PROGRESS : 3
			}, r.join = function() {
				var e = arguments;
				e.length == 1
						&& Object.prototype.toString.call(e[0]) === "[object Array]"
						&& (e = e[0]);
				var t = e.length;
				return new r(function(n, r, i) {
							var s = [], o = [], u = [], a = [], f = [], l = [];
							for (var c = 0; c < t; c++)
								e[c].then(function() {
											var e = c;
											return function() {
												a[e] = !0, s[e] = arguments;
												for (var r = 0; r < t; r++)
													if (!a[r])
														return;
												a = [], n.apply(this, s)
											}
										}(), function() {
											var e = c;
											return function() {
												f[e] = !0, o[e] = arguments;
												for (var n = 0; n < t; n++)
													if (!f[n])
														return;
												f = [], r.apply(this, o)
											}
										}(), function() {
											var e = c;
											return function() {
												l[e] = !0, u[e] = u.slice
														.call(arguments);
												for (var n = 0; n < t; n++)
													if (!l[n])
														return;
												l = [], i.apply(this, u)
											}
										}())
						}, function() {
							for (var n = 0; n < t; n++)
								e[n].cancel()
						})
			}, r.prototype.cancel = function() {
				return this._status = r.STATUS.CANCEL, this._cancel_fn
						&& this._cancel_fn.apply(window), this
			}, r.prototype.done = function(e) {
				return this._status == r.STATUS.DONE
						&& e.apply(window, this._done_arg), this._done_fn = e, this
			}, r.prototype.error = function(e) {
				return this._status == r.STATUS.ERROR
						&& e.apply(window, this._error_arg), this._error_fn = e, this
			}, r.prototype.progress = function(e) {
				return this._status == r.STATUS.PROGRESS
						&& e.apply(window, this._progress_arg), this._progress_fn = e, this
			}, r.prototype.then = function(e, t, n) {
				return e && this.done(e), t && this.error(t), n
						&& this.progress(n), this
			}
		}), define("g/util/formula",
		["require", "exports", "module", "./tool"], function(e, t, n) {
			var r = e("./tool"), i = r.cache, s = function(e, t) {
				var n = e.length, r = [];
				for (var i = 0; i < n; i++)
					r.push(e[i] instanceof Array ? e[i].length : -1);
				var s = [];
				for (var i = 0, o = Math.max.apply(null, r); i < o; i++) {
					var u = [];
					for (var a = 0; a < n; a++)
						u.push(r[a] >= 0 ? e[a][i] : e[a]);
					s[i] = t.apply(s, u)
				}
				return s
			}, o = t["+"] = function(e, t) {
				return s([e, t], function(e, t) {
							return e + t
						})
			}, u = t["-"] = function(e, t) {
				return s([e, t], function(e, t) {
							return e - t
						})
			}, a = t["*"] = function(e, t) {
				return s([e, t], function(e, t) {
							return e * t
						})
			}, f = t["/"] = function(e, t) {
				return s([e, t], function(e, t) {
							return e / t
						})
			}, l = t.zero = function(e) {
				return s([e], function(e) {
							return isNaN(e) ? 0 : e
						})
			}, c = t.MAX = function() {
				var e = Array.prototype.slice.apply(arguments), t = e.length;
				return s(e, function() {
							return Math.max.apply(Math, arguments)
						})
			}, h = t.ABS = function(e) {
				return s([e], function(e) {
							return Math.abs(e)
						})
			}, p = t.REF = function(e, t) {
				var n = e.length, r = [];
				for (var i = 0; i < t; i++)
					r.push(undefined);
				return r.concat(e).slice(0, n)
			}, d = t.IF = function(e, t) {
				return s(e, t)
			}, v = t.SUM = function(e, t) {
				var n = [];
				if (e && e.length && t > 0) {
					var r = 0, i = 0, s = e.length;
					for (; i < s; i++)
						e[i] && (r += e[i]), i >= t && e[i - t]
								&& (r -= e[i - t]), i >= t - 1 && (n[i] = r)
				}
				return n
			}, m = t.MA = i(function(e, t) {
						var n = [];
						if (e && e.length && t > 0) {
							var r = 0, i = 0, s = e.length;
							for (; i < s; i++)
								e[i] && (r += e[i]), i >= t && e[i - t]
										&& (r -= e[i - t]), i >= t - 1
										&& (n[i] = r / t)
						}
						return l(n)
					}), g = i(function(e, t, n) {
						var r = n / t, i = 1 - r, o = !1, u = s([e],
								function(e) {
									return o = o !== !1 && !isNaN(o) ? r * e
											+ i * o : e
								});
						return u
					}), y = t.EMA = i(function(e, t) {
						var n = [];
						if (e && e.length && t > 0) {
							var r = 0, i = 0, s = e.length, o = 2 / (t + 1), u = 1
									- o;
							for (; i < s; i++)
								n[i] = i ? o * e[i] + u * n[i - 1] : e[i]
						}
						return n
					}), b = t.HHV = i(function(e, t) {
						var n = [];
						for (var r = t - 1, i = e.length; r < i; r++)
							n[r] = Math.max.apply(null, e.slice(r - t + 1, r
													+ 1));
						return n
					}), w = t.LLV = i(function(e, t) {
						var n = [];
						for (var r = t - 1, i = e.length; r < i; r++)
							n[r] = Math.min.apply(null, e.slice(r - t + 1, r
													+ 1));
						return n
					});
			t.MACD = i(function(e, t, n, r) {
						t = t || 26, n = n || 12, r = r || 9;
						var i = u(y(e, n), y(e, t)), s = y(i, r), o = a(
								u(i, s), 2);
						return {
							DIF : i,
							DEA : s,
							MACD : o
						}
					}), t.RSI = i(function(e, t) {
						var n = p(e, 1), r = u(e, n), i = h(r);
						return a(f(g(c(r, 0), t, 1), g(i, t, 1)), 100)
					});
			var E = t.STD = i(function(e, t) {
						var n = [], r = m(e, t);
						for (var i = t - 1, s = e.length; i < s; i++) {
							var o = 0;
							for (var u = i - t + 1; u <= i; u++)
								o += Math.pow(e[u] - r[i], 2);
							n[i] = Math.sqrt(o / t)
						}
						return n
					});
			t.BOLL = i(function(e, t, n) {
						t = t || 20, n = n || 2;
						var r = m(e, t), i = a(E(e, t), n), s = o(r, i), f = u(
								r, i);
						return [s, r, f]
					}), t.SAR = i(function(e, t, n, r, i) {
				var s = [], o = [], u = [], a = e.length, f = [], l = function(
						l) {
					if (l >= a)
						return;
					s[l] = Math.min.apply(null, t.slice(l - n, l)), f[l] = 1;
					if (s[l] > t[l])
						c(l + 1);
					else {
						u[l] = Math.max.apply(null, e.slice(l - n + 1, l + 1)), o[l] = r;
						while (l < a - 1) {
							s[l + 1] = s[l] + o[l] * (u[l] - s[l]) / 100, f[l
									+ 1] = 1;
							if (s[l + 1] > t[l + 1]) {
								c(l + 2);
								return
							}
							u[l + 1] = Math.max.apply(null, e.slice(l - n + 2,
											l + 2)), e[l + 1] > u[l]
									? (o[l + 1] = o[l] + r, o[l + 1] > i
											&& (o[l + 1] = i))
									: o[l + 1] = o[l], l++
						}
					}
				}, c = function(c) {
					if (c >= a)
						return;
					s[c] = Math.max.apply(null, e.slice(c - n, c)), f[c] = -1;
					if (s[c] < e[c]) {
						l(c + 1);
						return
					}
					u[c] = Math.min.apply(null, t.slice(c - n + 1, c + 1)), o[c] = r;
					while (c < a - 1) {
						s[c + 1] = s[c] + o[c] * (u[c] - s[c]) / 100, f[c + 1] = -1;
						if (s[c + 1] < e[c + 1]) {
							l(c + 2);
							return
						}
						u[c + 1] = Math.min.apply(null, t.slice(c - n + 2, c
												+ 2)), t[c + 1] < u[c]
								? (o[c + 1] = o[c] + r, o[c + 1] > i
										&& (o[c + 1] = i))
								: o[c + 1] = o[c], c++
					}
				};
				return e[n] > e[0] || t[n] > t[0] ? l(n) : c(n), [s, f]
			}), t["W&R"] = i(function(e, t, n, r, i) {
						i = i || 6;
						var s = b(t, r), o = f(a(u(s, e), 100), u(s, w(n, r))), l = b(
								t, i), c = f(a(u(l, e), 100), u(l, w(n, i)));
						return [o, c]
					}), t.OBV = i(function(e, t) {
						var n = [0];
						for (var r = 1, i = e.length; r < i; r++)
							e[r] > e[r - 1]
									? n[r] = n[r - 1] + t[r]
									: e[r] < e[r - 1]
											? n[r] = n[r - 1] - t[r]
											: n[r] = n[r - 1];
						return f(n, 1e4)
					}), t.KDJ = i(function(e, t, n, r, i, s) {
						var o = w(t, r), l = f(u(e, o), f(u(b(n, r), o), 100)), c = g(
								l, i, 1), h = g(c, s, 1), p = u(a(3, c),
								a(2, h));
						return [c, h, p]
					}), t.DMI = i(function(e, t, n, r, i) {
				var s = v(c(c(u(n, t), h(u(n, p(e, 1)))), h(u(t, p(e, 1)))), r), l = u(
						n, p(n, 1)), g = u(p(t, 1), t), y = v(d([l, g],
								function(e, t) {
									return e > 0 && e > t ? e : 0
								}), r), b = v(d([g, l], function(e, t) {
									return e > 0 && e > t ? e : 0
								}), r), w = f(a(y, 100), s), E = f(a(b, 100), s), S = m(
						f(h(u(E, w)), f(o(w, E), 100)), i), x = f(
						o(S, p(S, i)), 2);
				return [w, E, S, x]
			})
		}), define("g/data/data", ["require", "exports", "module", "./qt",
				"./daily", "./weekly", "./monthly", "./minute", "./minute5",
				"./minutek", "../util/promise", "../util/tool",
				"../util/formula"], function(e, t, n) {
			var r = e("./qt"), i = e("./daily"), s = e("./weekly"), o = e("./monthly"), u = e("./minute"), a = e("./minute5"), f = e("./minutek"), l = e("../util/promise"), c = e("../util/tool"), h = e("../util/formula"), p = n.exports = function(
					e, t) {
				var n = this;
				this.symbol = e || "sh000001";
				var l = new r(this.symbol);
				this.precision = 2, l.get({
							onceoff : !0,
							fn : function(e) {
								e.length
										&& (n.precision = e[3].length
												- e[3].indexOf(".") - 1, n.name = e[1])
							}
						});
				var c = this.loader = {
					qt : l,
					monthly : new o(this.symbol, l),
					weekly : new s(this.symbol, l),
					daily : new i(this.symbol, l, t),
					minute : new u(this.symbol, l)
				};
				c.minute5 = new a(this.symbol, c.minute), c.minuteK5 = new f(
						this.symbol, 5, c.minute5), c.minuteK30 = new f(
						this.symbol, 30, c.minute5), c.minuteK60 = new f(
						this.symbol, 60, c.minute5)
			};
			p.prototype.clear = function() {
				for (var e in this.loader)
					this.loader[e].stop()
			}, p.prototype.getData = function(e, t, n, r) {
				var i = this, s;
				return new l(function(o, u, a) {
							s = i.loader[e].get({
										beg : t,
										end : n,
										shift : -1,
										fq : r,
										fn : function(e, t) {
											if (e[0])
												var n = t === 0
														? e[0][1]
														: e[0][2];
											a({
														qt : e.qt,
														yprice : n,
														data : e.slice(-t)
													})
										}
									})
						}, function() {
							i.loader[e].rem(s)
						})
			}, p.prototype.getVolume = function(e, t, n) {
				var r = this, i;
				return new l(function(s, o, u) {
							i = r.loader[e].get({
										beg : t,
										end : n,
										fn : function(e) {
											u(e)
										}
									})
						}, function() {
							r.loader[e].rem(i)
						})
			}, p.prototype.getMin5Data = function() {
				var e = this, t;
				return new l(function(n, r, i) {
							t = e.loader.minute5.get({
										fn : function(e) {
											i(e)
										}
									})
						}, function() {
							e.loader.minute5.rem(t)
						})
			}, p.prototype.getMinData = function() {
				var e = this, t;
				return new l(function(n, r, i) {
							t = e.loader.minute.get({
										fn : function(e) {
											i(e)
										}
									})
						}, function() {
							e.loader.minute.rem(t)
						})
			}, p.prototype.getTrend = function() {
				var e = this, t;
				return new l(function(n, r, i) {
							t = e.loader.weekly.get({
										beg : !0,
										fn : function(e) {
											e.length
													&& (e[0][0] = String(c
															.date_shift(
																	e[0][0], -7))), i(e)
										}
									})
						}, function() {
							e.loader.weekly.rem(t)
						})
			}, p.prototype.getMA = function(e, t, n, r, i, s) {
				r = r || 5;
				var o = this, u;
				return new l(function(a, f, l) {
							u = o.loader[e].get({
										beg : t,
										end : n,
										shift : -r,
										fq : s,
										fn : function(e, t) {
											var n = [], s = i == "volume"
													? 5
													: 2;
											for (var o = 0, u = e.length; o < u; o++)
												n.push(parseFloat(e[o][s]));
											l(h.MA(n, r).slice(-t))
										}
									})
						}, function() {
							o.loader[e].rem(u)
						})
			}, p.prototype.getMACD = function(e, t, n, r) {
				var i = this, s;
				return new l(function(o, u, a) {
							s = i.loader[e].get({
										beg : t,
										end : n,
										shift : -100,
										fq : r,
										fn : function(e, t) {
											var n = [];
											for (var r = 0, i = e.length; r < i; r++)
												n[r] = parseFloat(e[r][2]);
											var s = h.MACD(n);
											a(s.MACD.slice(-t),
													s.DIF.slice(-t), s.DEA
															.slice(-t))
										}
									})
						}, function() {
							i.loader[e].rem(s)
						})
			}, p.prototype.getRSI = function(e, t, n, r) {
				var i = this, s;
				return new l(function(o, u, a) {
					s = i.loader[e].get({
								beg : t,
								end : n,
								shift : -30,
								fq : r,
								fn : function(e, t) {
									var n = [];
									for (var r = 0, i = e.length; r < i; r++)
										n[r] = parseFloat(e[r][2]);
									var s = h.RSI(n, 6), o = h.RSI(n, 12), u = h
											.RSI(n, 24);
									a(s.slice(-t), o.slice(-t), u.slice(-t))
								}
							})
				}, function() {
					i.loader[e].rem(s)
				})
			}, p.prototype.getKDJ = function(e, t, n, r) {
				var i = this, s;
				return new l(function(o, u, a) {
					s = i.loader[e].get({
						beg : t,
						end : n,
						shift : -15,
						fq : r,
						fn : function(e, t) {
							var n = [], r = [], i = [];
							for (var s = 0, o = e.length; s < o; s++)
								n[s] = parseFloat(e[s][2]), i[s] = parseFloat(e[s][3]), r[s] = parseFloat(e[s][4]);
							var u = h.KDJ(n, r, i, 9, 3, 3);
							a(u[0].slice(-t), u[1].slice(-t), u[2].slice(-t))
						}
					})
				}, function() {
					i.loader[e].rem(s)
				})
			}, p.prototype.getDMI = function(e, t, n, r) {
				var i = this, s;
				return new l(function(o, u, a) {
					s = i.loader[e].get({
						beg : t,
						end : n,
						shift : -20,
						fq : r,
						fn : function(e, t) {
							var n = [], r = [], i = [];
							for (var s = 0, o = e.length; s < o; s++)
								n[s] = parseFloat(e[s][2]), i[s] = parseFloat(e[s][3]), r[s] = parseFloat(e[s][4]);
							var u = h.DMI(n, r, i, 14, 6);
							a(u[0].slice(-t), u[1].slice(-t), u[2].slice(-t),
									u[3].slice(-t))
						}
					})
				}, function() {
					i.loader[e].rem(s)
				})
			}, p.prototype.getOBV = function(e, t, n, r) {
				var i = this, s;
				return new l(function(o, u, a) {
					s = i.loader[e].get({
								beg : t,
								end : n,
								shift : -1,
								fq : r,
								fn : function(e, t) {
									var n = [], r = [];
									for (var i = 0, s = e.length; i < s; i++)
										n[i] = parseFloat(e[i][2]), r[i] = parseInt(
												e[i][5], 10);
									var o = h.OBV(n, r);
									a(o.slice(-t))
								}
							})
				}, function() {
					i.loader[e].rem(s)
				})
			}, p.prototype.getWR = function(e, t, n, r) {
				var i = this, s;
				return new l(function(o, u, a) {
					s = i.loader[e].get({
						beg : t,
						end : n,
						shift : -20,
						fq : r,
						fn : function(e, t) {
							var n = [], r = [], i = [];
							for (var s = 0, o = e.length; s < o; s++)
								n[s] = parseFloat(e[s][2]), i[s] = parseFloat(e[s][3]), r[s] = parseFloat(e[s][4]);
							var u = h["W&R"](n, i, r, 10, 6);
							a(u[0].slice(-t), u[1].slice(-t))
						}
					})
				}, function() {
					i.loader[e].rem(s)
				})
			}, p.prototype.getBOLL = function(e, t, n, r) {
				var i = this, s;
				return new l(function(o, u, a) {
					s = i.loader[e].get({
						beg : t,
						end : n,
						shift : -30,
						fq : r,
						fn : function(e, t) {
							var n = [], r = [], i = [], s = [];
							for (var o = 0, u = e.length; o < u; o++)
								s[o] = parseFloat(e[o][1]), r[o] = parseFloat(e[o][3]), i[o] = parseFloat(e[o][4]), n[o] = parseFloat(e[o][2]);
							var f = h.BOLL(n, 20, 2);
							a(f[0].slice(-t), f[1].slice(-t), f[2].slice(-t), [
											s.slice(-t), r.slice(-t),
											i.slice(-t), n.slice(-t)])
						}
					})
				}, function() {
					i.loader[e].rem(s)
				})
			}, p.prototype.getSAR = function(e, t, n, r) {
				var i = this, s;
				return new l(function(o, u, a) {
					s = i.loader[e].get({
						beg : t,
						end : n,
						shift : -30,
						fq : r,
						fn : function(e, t) {
							var n = [], r = [], i = [], s = [];
							for (var o = 0, u = e.length; o < u; o++)
								s[o] = parseFloat(e[o][1]), r[o] = parseFloat(e[o][3]), i[o] = parseFloat(e[o][4]), n[o] = parseFloat(e[o][2]);
							var f = h.SAR(r, i, 10, 2, 20);
							a(f[0].slice(-t), f[1].slice(-t), [s.slice(-t),
											r.slice(-t), i.slice(-t),
											n.slice(-t)])
						}
					})
				}, function() {
					i.loader[e].rem(s)
				})
			}
		}), function(e) {
	e("graphic", [], function() {
		var e = {
			NaN : 1,
			Infinity : 1,
			"-Infinity" : 1
		}, t = String, n = t.prototype.toLowerCase, r = /[, ]+/, i = Object.prototype.hasOwnProperty, s = Object.prototype.toString, o = function(
				e, t, n) {
			var r = document.createElement("canvas");
			return r.width = e, r.height = t, typeof FlashCanvas != "undefined"
					&& FlashCanvas.initElement(r), (n || document.body)
					.appendChild(r), r
		}, u = {
			"-" : [3, 1],
			"." : [1, 1],
			"-." : [3, 1, 1, 1],
			"-.." : [3, 1, 1, 1, 1, 1],
			". " : [1, 3],
			"- " : [4, 3],
			"--" : [8, 3],
			"- ." : [4, 3, 1, 3],
			"--." : [8, 3, 1, 3],
			"--.." : [8, 3, 1, 3, 1, 3]
		}, a = function(e, n, r) {
			n = u[t(n).toLowerCase()], n
					? e.attrs["stroke-dasharray"] = n
					: delete e.attrs["stroke-dasharray"]
		}, f = {
			M : {
				num : 2,
				cb : "moveTo"
			},
			L : {
				num : 2,
				cb : "lineTo"
			},
			Z : {
				num : 0,
				cb : "closePath"
			},
			C : {
				num : 6,
				cb : "bezierCurveTo"
			},
			X : {
				num : 6,
				cb : "arc"
			}
		}, l = function(t, r) {
			return r = n.call(r), r == "finite" ? !i.call(e, +t) : r == "array"
					? t instanceof Array
					: r == "null" && t === null || r == typeof t && t !== null
							|| r == "object" && t === Object(t) || r == "array"
							&& Array.isArray && Array.isArray(t)
							|| s.call(t).slice(8, -1).toLowerCase() == r
		}, c = function(e, t) {
			var n = e.attrs, r = e.round;
			e.parent._dirty = !0;
			for (var s in t)
				if (i.call(t, s)) {
					var o = n[s] = t[s];
					switch (s) {
						case "path" :
							var u = l(o, "array") ? o : o.replace(/[A-Z]/g,
									" $& ").split(" ");
							if (u[0] && u[0].length > 1)
								n.path = u;
							else {
								var c = n.path = [], h = f, p = 0, d, v = u.length, m, g;
								for (p = 0; p < v; p++) {
									m = h[u[p]];
									if (m) {
										d = p + m.num, g = [];
										while (p < d)
											p++, g.push(u[p]);
										c.push([m.cb, g])
									}
								}
							}
							break;
						case "fill" :
							n.fill = o;
							break;
						case "stroke" :
							n.stroke = o;
							break;
						case "stroke-dasharray" :
							o
									? a(e, o, n.stroke)
									: delete n["stroke-dasharray"];
							break;
						case "align" :
							n[s] = o;
							break;
						case "src" :
							var y = new Image;
							y.src = o, y.crossOrigin = "anonymous", y.onload = function() {
								e.attr({
											image : y
										})
							};
							break;
						case "x" :
						case "y" :
						case "x1" :
						case "y1" :
						case "x2" :
						case "y2" :
							n[s] = r(o);
							break;
						case "text" :
							n[s] = String(o);
							break;
						default :
							n[s] = o
					}
				}
		}, h = function(e, t, n) {
			this.width = e, this.height = t, this.zoomWidth = this.zoomHeight = 1, this._top = this._bottom = null, this.node = document
					.createElement("div"), this.node.style.cssText = "width:"
					+ this.width + "px;height:" + this.height
					+ "px;position:relative;", (n || document.body)
					.appendChild(this.node), this.id = this.uuid();
			var r = ["mousemove", "mousedown", "mouseup", "click", "dblclick",
					"mouseout"], s = this, o = null;
			for (var u = 0; u < r.length; u++)
				H(this.node, r[u], function() {
					var e = r[u];
					return function(t, n, r) {
						if (!i.call(t, "dx")) {
							t.gx = n, t.gy = r;
							var u = s.node;
							while (u)
								n -= u.offsetLeft, r -= u.offsetTop, u = u.offsetParent;
							t.dx = n / s.zoomWidth, t.dy = r / s.zoomHeight
						}
						if (e == "mouseout")
							o && o.dispatchEvent(t.type, t), o = null;
						else {
							var a = s.getElementByPoint(t.dx, t.dy, e);
							o
									&& a != o
									&& o.dispatchEvent(
											e != t.type && L && O.mouseout
													|| "mouseout", t), a
									&& (t.element = a, a != o
											&& a.dispatchEvent(e != t.type && L
															&& O.mouseover
															|| "mouseover", t)), o = a, a
									&& a.dispatchEvent(t.type, t)
						}
						var f = s._top;
						while (f)
							(!t.element || t.element.parent != f || t.returnValue)
									&& f.dispatchEvent(t.type, t), f = f._next
					}
				}(), this)
		};
		h.createCanvas = o;
		var p = h.prototype;
		p.layer = function() {
			return new g(this)
		}, p.zoom = function(e, t) {
			t = t || e, e = e || this.zoomWidth, t = t || this.zoomHeight;
			if (e != this.zoomWidth || t != this.zoomHeight) {
				this.zoomWidth = e, this.zoomHeight = t, e = this.width
						* this.zoomWidth + "px", t = this.height
						* this.zoomHeight + "px", this.node.style.width = e, this.node.style.height = t;
				var n = this._top;
				while (n)
					n.node.style.width = n._canvas.style.width = e, n.node.style.height = n._canvas.style.height = t, n = n._next;
				this._hideCanvas
						&& (this._hideCanvasNode.style.width = e, this._hideCanvasNode.style.height = t)
			}
			return this
		}, p.size = function(e, t) {
			e = e || this.width, t = t || this.height;
			if (e != this.width || t != this.height) {
				this.width = e, this.height = t, w1 = this.width
						* this.zoomWidth + "px", h1 = this.height
						* this.zoomHeight + "px", this.node.style.width = w1, this.node.style.height = h1;
				var n = this._top;
				while (n)
					n.node.style.width = n._canvas.style.width = w1, n.node.style.height = n._canvas.style.height = h1, n._canvas.width = e, n._canvas.height = t, n._dirty = !0, n = n._next;
				this.draw(), this._hideCanvas
						&& (this._hideCanvas.width = e, this._hideCanvas.height = t, this._hideCanvasNode.style.width = w1, this._hideCanvasNode.style.height = h1)
			}
			return this
		};
		var d = ["path", "circle", "rect", "ellipse", "image", "text", "line",
				"shape"];
		for (var v = 0; v < d.length; v++)
			p[d[v]] = function() {
				var e = d[v];
				return function() {
					return !this._bottom && this.layer(), this._bottom[e]
							.apply(this._bottom, arguments)
				}
			}();
		var m = function(e) {
			var t = e.parent;
			e._next = null, t._bottom
					? (e._prev = t._bottom, t._bottom._next = e, t._bottom = e)
					: (e._prev = null, t._top = t._bottom = e)
		}, g = function(e) {
			this.parent = e, this.node = document.createElement("div");
			var t = e.width * e.zoomWidth, n = e.height * e.zoomHeight;
			this.node.style.cssText = "width:"
					+ t
					+ "px;height:"
					+ n
					+ "px;position:absolute;top:0px;left:0px;background:transparent;-webkit-transform: translate3d(0px, 0, 0);", e.node
					.appendChild(this.node), this._canvas = o(e.width,
					e.height, this.node), this.ctx = this._canvas
					.getContext("2d"), this._top = this._bottom = null, this.id = this
					.uuid(), this.attrs = {}, m(this)
		}, y = g.prototype;
		y.getContext = function() {
			return this.ctx
		}, p.getContext = function() {
			return !this._bottom && this.layer(), this._bottom.getContext()
		}, p.cursor = function(e) {
			this.node.style.cursor = e
		}, y.cursor = function(e) {
			this.parent.cursor(e)
		}, p._getHideLayer = function() {
			if (!this._hideLayer) {
				var e = document.createElement("div"), t = this.width
						* this.zoomWidth, n = this.height * this.zoomHeight;
				e.style.cssText = "width:"
						+ t
						+ "px;height:"
						+ n
						+ "px;position:absolute;top:0px;left:0px;background:transparent;display:none;", this.node
						.appendChild(e);
				var r = o(this.width, this.height, e);
				this._hideCanvasNode = e, this._hideCanvas = r, this._hideLayer = r
						.getContext("2d")
			}
			return this._hideLayer
		}, p.getElementByPoint = function(e, t) {
			var n = this._getHideLayer();
			if (e < 0 || t < 0 || e > this.width || t > this.height)
				return null;
			var r = this._bottom;
			while (r) {
				if (r._display != "none") {
					var i = r._bottom;
					while (i) {
						if (i._display != "none" && i._events) {
							var s = i.attrs, o = s.draw || b.drawMethod[i.type];
							if (o && s.fill || s.draw)
								if (i.getPolygon() != i.polygon) {
									if (i._hasPoint(e, t))
										return i
								} else {
									o(n, s, i);
									if (n.isPointInPath && !i.polygon ? n
											.isPointInPath(e, t) : i._hasPoint(
											e, t))
										return i
								}
						}
						i = i._prev
					}
				}
				r = r._prev
			}
			return null
		}, p.draw = function() {
			var e = this;
			if (this._drawTimer)
				return;
			var t = function() {
				e._drawTimer = !1;
				var t = e._top;
				while (t)
					t.draw.apply(t, [!0]), t = t._next
			};
			return e._drawTimer = setTimeout(t, 0), this
		}, p.toDataURL = function() {
			var e = this._getHideLayer();
			return e.putImageData(this.getImageData(0, 0, this.width,
							this.height), 0, 0), this._hideCanvas.toDataURL()
		}, p.getImageData = function(e, t, n, r) {
			var i = this._top, s, o = 0;
			while (i) {
				if (!s)
					s = i.getImageData(e, t, n, r);
				else {
					var u = i.getImageData(e, t, n, r).data, a = s.data;
					for (var o = 0; o < a.length; o += 4) {
						var f = u[o + 3] / 255, l = a[o + 3] / 255;
						if (f != 0) {
							for (var c = o; c < o + 3; c++)
								a[c] = u[c] * f + a[c] * (1 - f);
							a[o + 3] = (f + (1 - f) * l) * 255
						}
					}
				}
				i = i._next
			}
			return s
		}, y.getImageData = function(e, t, n, r) {
			return e = e || 0, t = t || 0, n = n || this.parent.width, r = r
					|| this.parent.height, this._display != "none" ? this.ctx
					.getImageData(e, t, n, r) : this.ctx.createImageData(n, r)
		}, y.show = function() {
			return this._display = "", this.node.style.display = "", this
		}, y.hide = function() {
			return this._display = "none", this.node.style.display = "none", this
		}, y.draw = function(e) {
			var t = this, n = function() {
				t._drawTimer = !1;
				if (t._dirty || e) {
					t._dirty = !1;
					var n = t._top;
					t.ctx.clearRect(0, 0, t.parent.width, t.parent.height);
					while (n)
						n.draw.apply(n), n = n._next
				}
			};
			if (e === !0)
				return n(), this;
			if (this._drawTimer)
				return;
			return t._drawTimer = setTimeout(n, 0), this
		}, y.path = function(e) {
			var t = new b("path", this);
			return t.attr({
						path : e,
						stroke : "#000"
					}), t
		}, y.line = function(e, t, n, r) {
			var i = new b("line", this);
			return i.attr({
						x1 : e,
						y1 : t,
						x2 : n,
						y2 : r,
						stroke : "#000"
					}), i
		}, y.circle = function(e, t, n) {
			var r = new b("circle", this);
			return r.attr({
						x : e,
						y : t,
						r : n,
						stroke : "#000"
					}), r
		}, y.rect = function(e, t, n, r, i) {
			var s = new b("rect", this);
			return s.attr({
						x : e,
						y : t,
						width : n,
						height : r,
						r : i || 0,
						rx : i || 0,
						ry : i || 0,
						stroke : "#000"
					}), s
		}, y.ellipse = function(e, t, n, r) {
			var i = new b("ellipse", this);
			return i.attr({
						cx : e,
						cy : t,
						rx : n,
						ry : r,
						stroke : "#000"
					}), i
		}, y.image = function(e, t, n, r, i) {
			var s = new b("image", this);
			return s.attr({
						x : t,
						y : n,
						width : r,
						height : i,
						src : e
					}), s
		}, y.text = function(e, t, n) {
			var r = new b("text", this);
			return r.attr({
						x : e,
						y : t,
						align : "start",
						text : n,
						font : "12px arial",
						fill : "#000"
					}), r
		}, y.shape = function(e) {
			var t = new b("shape", this);
			return t.attr({
						draw : e
					}), t
		}, y.clear = function() {
			var e = this._top;
			while (e)
				e.removed = !0, e = e._next;
			this._top = this._bottom = null, this._dirty = !0, this.draw()
		};
		var b = function(e, t, n) {
			this.parent = t, this.ctx = t.ctx, this._prev = this._next = null, this.attrs = {}, this.type = e, this._data = {}, n
					&& this.attr(n), this.id = this.uuid(), m(this)
		}, w = b.prototype, E = 0;
		p.uuid = y.uuid = w.uuid = function() {
			var e = this.parent;
			if (e) {
				var t = (e._uuid || 0) + 1;
				e._uuid = t
			} else {
				var t = E + 1;
				E = t
			}
			var n = (e && e.id || "") + "#" + t;
			return n
		}, w.data = function(e, t) {
			var n = this._data;
			if (arguments.length == 1) {
				if (l(e, "object")) {
					for (var r in e)
						i.call(e, r) && this.data(r, e[r]);
					return this
				}
				return n[e]
			}
			return n[e] = t, this
		}, w.hide = function() {
			return this._display != "none"
					&& (this._display = "none", this.parent._dirty = !0, this.parent
							.draw()), this
		}, w.show = function() {
			return this._display != ""
					&& (this._display = "", this.parent._dirty = !0, this.parent
							.draw()), this
		}, w.toFront = function() {
			return this.removed
					? this
					: this.parent._bottom == this
							? this
							: (this._prev
									? this._prev._next = this._next
									: this.parent._top = this._next, this._next._prev = this._prev, this._next = null, this._prev = this.parent._bottom, this.parent._bottom._next = this, this.parent._bottom = this, this.parent._dirty = !0, this.parent
									.draw(), this)
		}, w.remove = function() {
			return this.removed
					? this
					: (this.removed = !0, this._prev
							? this._prev._next = this._next
							: this.parent._top = this._next, this._next
							? this._next._prev = this._prev
							: this.parent._bottom = this._prev, this._prev = this._next = null, this.parent._dirty = !0, this.parent
							.draw(), this)
		}, w.attach = function(e) {
			if (!this.removed) {
				if (this.parent == e)
					return this;
				this.remove()
			}
			return this.parent = e, this.ctx = e.ctx, this.removed = !1, m(this), this.parent._dirty = !0, this.parent
					.draw(), this
		}, w.toBack = function() {
			return this.removed
					? this
					: this.parent._top == this
							? this
							: (this._next
									? this._next._prev = this._prev
									: this.parent._bottom = this._prev, this._prev._next = this._next, this._prev = null, this._next = this.parent._top, this.parent._top._prev = this, this.parent._top = this, this.parent._dirty = !0, this.parent
									.draw(), this)
		}, w.attr = function(e, t) {
			var n = this.attrs;
			if (e == null) {
				var s = {};
				for (var o in n)
					i.call(n, o) && (s[o] = n[o]);
				return s
			}
			if (t == null && l(e, "string")) {
				var u = e.split(r), a = {};
				for (var f = 0, h = u.length; f < h; f++)
					e = u[f], e in n && (a[e] = n[e]);
				return h - 1 ? a : a[u[0]]
			}
			if (t == null && l(e, "array")) {
				a = {};
				for (f = 0, h = e.length; f < h; f++)
					a[e[f]] = attr(e[f]);
				return a
			}
			if (t != null) {
				var p = {};
				p[e] = t
			} else
				e != null && l(e, "object") && (p = e);
			return this.removed ? this : (c(this, p), this.parent.draw(), this)
		}, w.animate = function(e, t, n, r) {
			return X(this, e, t, n, r), this
		}, b.drawMethod = {
			path : function(e, t) {
				e.beginPath();
				var n = t.path, r = 0, i = n.length;
				while (r < i)
					e[n[r][0]].apply(e, n[r][1]), r++
			},
			line : function(e, t) {
				e.beginPath(), e.moveTo(t.x1, t.y1), e.lineTo(t.x2, t.y2)
			},
			rect : function(e, t, n) {
				var r = t.rx || t.r || 0, i = t.ry || t.r || 0, s = [t.x,
						t.x + r, t.x + t.width - r, t.x + t.width], o = [t.y,
						t.y + i, t.y + t.height - i, t.y + t.height];
				e.beginPath(), e.moveTo(s[1], o[0]), e.lineTo(s[2], o[0]), r
						&& i && e.quadraticCurveTo(s[3], o[0], s[3], o[1]), e
						.lineTo(s[3], o[2]), r && i
						&& e.quadraticCurveTo(s[3], o[3], s[2], o[3]), e
						.lineTo(s[1], o[3]), r && i
						&& e.quadraticCurveTo(s[0], o[3], s[0], o[2]), e
						.lineTo(s[0], o[1]), r && i
						&& e.quadraticCurveTo(s[0], o[0], s[1], o[0]), n.polygon = [
						[s[0], o[0]], [s[3], o[0]], [s[3], o[3]], [s[0], o[3]]]
			},
			text : function(e, t) {
				e.font = t.font;
				var n = t.x, r = t.y;
				t.font && (e.font = t.font), t.align && (e.textAlign = t.align), t.valign
						&& (e.textBaseline = t.valign)
			},
			circle : function(e, t) {
				e.beginPath(), e.arc(t.x, t.y, t.r, 0, Math.PI * 2, !0)
			},
			ellipse : function(e, t) {
				e.translate(t.x, t.y), e.scale(t.rx, t.ry), e.beginPath(), e
						.arc(0, 0, 1, 0, Math.PI * 2, !0)
			},
			image : function(e, t) {
				t.image && e.drawImage(t.image, t.x, t.y)
			}
		}, b.prototype.getPolygon = function(e) {
			return typeof e == "function"
					? (this.getPolygon = e, this)
					: this.polygon
		}, b.prototype._hasPoint = function(e, t) {
			var n = this.getPolygon();
			if (n && n[0]) {
				l(n[0][0], "array") || (n = [n]);
				for (var r = 0; r < n.length; r++) {
					var i = n[r], s = i.length, o, u, a = 0, f;
					for (f = 0; f < s; f++) {
						o = i[f], u = i[f + 1 == s ? 0 : f + 1];
						if (o[1] == u[1])
							continue;
						if (t < Math.min(o[1], u[1]))
							continue;
						if (t > Math.max(o[1], u[1]))
							continue;
						e < (t - o[1]) * (u[0] - o[0]) / (u[1] - o[1]) + o[0]
								&& a++
					}
					if (a % 2 === 1)
						return !0
				}
			}
			return !1
		}, b.prototype.draw = function(e, t, n, r) {
			if (this._display != "none") {
				var i = b.drawMethod[this.type], s = this.ctx, o = this.attrs;
				s.save();
				if (o.draw)
					o.draw(s, o, this);
				else if (i) {
					i(s, o, this);
					if (o.shadow) {
						var u = o.shadow.split(" ");
						s.shadowOffsetX = u[0], s.shadowOffsetY = u[1], s.shadowBlur = u[2], s.shadowColor = u
								.slice(3).join(" ")
					}
					o.fill
							&& (s.fillStyle = o.fill, this.type != "text" ? s
									.fill() : o.width ? s.fillText(o.text, o.x,
									o.y, o.width) : s
									.fillText(o.text, o.x, o.y)), o.stroke
							&& (o["stroke-width"]
									&& (s.lineWidth = o["stroke-width"]), o["stroke-dasharray"]
									&& (s.mozDash = s.webkitLineDash = o["stroke-dasharray"]), s.strokeStyle = o.stroke, this.type != "text"
									? s.stroke()
									: o.width ? s.strokeText(o.text, o.x, o.y,
											o.width) : s.strokeText(o.text,
											o.x, o.y))
				}
				s.restore()
			}
			return this
		};
		var S = function(e) {
			this.els = e && (l(e, "array") && e || [e]) || []
		}, x = "remove hide show attach toFront toBack".split(" ");
		for (var T = 0; T < x.length; T++)
			S.prototype[x[T]] = function() {
				var e = x[T];
				return function() {
					for (var t = 0; t < this.els.length; t++)
						if (l(this.els[t], "array")) {
							var n = new S(this.els[t]);
							n[e].apply(n, arguments)
						} else
							this.els[t]
									&& this.els[t][e]
									&& this.els[t][e].apply(this.els[t],
											arguments);
					return this
				}
			}();
		h.Set = S, p.set = y.set = function(e) {
			return new S(e)
		}, h.round = p.round = y.round = w.round = function(e) {
			return Math.floor(e) + .5
		};
		var N = document, C = window, k = "split", L = "createTouch" in document, A = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[k](" "), O = {
			mousedown : "touchstart",
			mousemove : "touchmove",
			mouseup : "touchend"
		}, M = function() {
			this.returnValue = !1
		}, _ = function() {
			return this.originalEvent.preventDefault()
		}, D = function() {
			this.cancelBubble = !0
		}, P = function() {
			return this.originalEvent.stopPropagation()
		}, H = function() {
			if (document.addEventListener)
				return function(e, t, n, r) {
					var i = L && O[t] ? O[t] : t, s = function(i) {
						var s = N.documentElement.scrollTop || N.body.scrollTop, o = N.documentElement.scrollLeft
								|| N.body.scrollLeft, u = i.clientX + o, a = i.clientY
								+ s;
						if (i.type != t)
							for (var f = 0, l = i.targetTouches
									&& i.targetTouches.length; f < l; f++)
								if (i.targetTouches[f].target == e) {
									var c = i;
									i = i.targetTouches[f], u = i.clientX + o, a = i.clientY
											+ s;
									break
								}
						return n.call(r, i, u, a)
					};
					return e.addEventListener(t, s, !1), i != t
							&& e.addEventListener(i, s, !1), function() {
						return e.removeEventListener(t, s, !1), i != t
								&& e.removeEventListener(i, s, !1), !0
					}
				};
			if (N.attachEvent)
				return function(e, t, n, r) {
					var i = function(e) {
						e = e || window.event;
						var t = N.documentElement.scrollTop || N.body.scrollTop, i = N.documentElement.scrollLeft
								|| N.body.scrollLeft, s = e.clientX + i, o = e.clientY
								+ t;
						return e.preventDefault = e.preventDefault || M, e.stopPropagation = e.stopPropagation
								|| D, n.call(r, e, s, o)
					};
					e.attachEvent("on" + t, i);
					var s = function() {
						return e.detachEvent("on" + t, i), !0
					};
					return s
				}
		}(), B = {}, j = 0, F = {}, I = function(e) {
			var t = e.clientX, n = e.clientY, r = N.documentElement.scrollTop
					|| N.body.scrollTop, i = N.documentElement.scrollLeft
					|| N.body.scrollLeft, s;
			for (var o in B) {
				s = B[o];
				if (L && e.touches) {
					var u = e.touches.length, a;
					while (u--) {
						a = e.touches[u];
						if (a.identifier == s.el._drag.id) {
							t = a.clientX, n = a.clientY, (e.originalEvent
									? e.originalEvent
									: e).preventDefault();
							break
						}
					}
				} else
					e.preventDefault();
				t += i, n += r, s.onmove
						&& s.onmove.apply(s.move_scope || s.el, [
										t - s.el._drag.x, n - s.el._drag.y, t,
										n, e])
			}
		}, q = function(e) {
			h.unmousemove(I).unmouseup(q);
			var t;
			for (var n in B)
				t = B[n], t.el._drag = {}, t.onend
						&& t.onend.apply(t.end_scope || t.start_scope
										|| t.move_scope || t.el, [e]);
			B = {}, j = 0
		};
		y.drag = w.drag = function(e, t, n, r, i, s) {
			function o(o) {
				(o.originalEvent || o).preventDefault();
				var u = N.documentElement.scrollTop || N.body.scrollTop, a = N.documentElement.scrollLeft
						|| N.body.scrollLeft;
				this._drag.x = o.clientX + a, this._drag.y = o.clientY + u, this._drag.id = o.identifier, !j
						&& h.mousemove(I).mouseup(q), B[this.id] = {
					el : this,
					move_scope : r,
					start_scope : i,
					end_scope : s,
					onstart : t,
					onmove : e,
					onend : n
				}, j++, t
						&& t.apply(i || r || this, [o.clientX + a,
										o.clientY + u, o])
			}
			return this._drag = {}, F[this.id] = {
				el : this,
				start : o
			}, this.mousedown(o), this
		}, y.undrag = w.undrag = function() {
			for (var e in F)
				F[e].el == this
						&& (this.unmousedown(F[e].start), delete F[e], delete B[e]);
			for (var e in F)
				return;
			h.unmousemove(I).unmouseup(q)
		};
		for (var v = A.length; v--;)
	(function(e) {
				h[e] = p[e] = y[e] = w[e] = function(t, n) {
					return l(t, "function")
							&& (this.events = this.events || [], this.events
									.push({
												name : e,
												f : t,
												unbind : H(this.id
																? this
																: document, e,
														t, this)
											})), this
				}, h["un" + e] = p["un" + e] = y["un" + e] = w["un" + e] = function(
						t) {
					var n = this.events || [], r = n.length;
					while (r--)
						if (n[r].name == e && n[r].f == t)
							return n[r].unbind(), n.splice(r, 1), !n.length
									&& delete this.events, this;
					return this
				}
			})(A[v]);
		p.attachEvent = y.attachEvent = w.attachEvent = p.addEventListener = y.addEventListener = w.addEventListener = function(
				e, t, n) {
			this._events = this._events || {}, e = e.replace("on", ""), this._events[e] = this._events[e]
					|| [], this._events[e].push(t)
		}, p.dispatchEvent = y.dispatchEvent = w.dispatchEvent = function(e, t) {
			t.target = t.target || this;
			var n = this._events && this._events[e];
			if (n)
				for (var r = 0; r < n.length; r++)
					if (n[r](t) === !1 || t.returnValue === !1)
						return;
			this.parent && !t.cancelBubble && this.parent.dispatchEvent(e, t)
		}, p.detachEvent = y.detachEvent = w.detachEvent = p.removeEventListener = y.removeEventListener = w.removeEventListener = function(
				e, t) {
			e = e.replace("on", "");
			var n = this._events && this._events[e];
			if (n) {
				if (!t) {
					delete this._events[e];
					return
				}
				for (var r = 0; r < n.length; r++)
					if (n[r] == t) {
						n.splice(r, 1), !this._events[e].length
								&& delete this._events[e];
						return
					}
			}
		}, h.addEvent = H;
		var R = window.requestAnimationFrame
				|| window.webkitRequestAnimationFrame
				|| window.mozRequestAnimationFrame
				|| window.oRequestAnimationFrame
				|| window.msRequestAnimationFrame || function(e) {
					setTimeout(e, 16)
				}, U = [], z = {
			linear : function(e) {
				return e
			},
			"ease-in" : function(e) {
				return Math.pow(e, 1.7)
			},
			"ease-out" : function(e) {
				return Math.pow(e, .48)
			},
			"ease-in-out" : function(e) {
				var t = .48 - e / 1.04, n = Math.sqrt(.1734 + t * t), r = n - t, i = Math
						.pow(Math.abs(r), 1 / 3)
						* (r < 0 ? -1 : 1), s = -n - t, o = Math.pow(Math
								.abs(s), 1 / 3)
						* (s < 0 ? -1 : 1), u = i + o + .5;
				return (1 - u) * 3 * u * u + u * u * u
			},
			"back-in" : function(e) {
				var t = 1.70158;
				return e * e * ((t + 1) * e - t)
			},
			"back-out" : function(e) {
				e -= 1;
				var t = 1.70158;
				return e * e * ((t + 1) * e + t) + 1
			},
			elastic : function(e) {
				return e == !!e ? e : pow(2, -10 * e)
						* Math.sin((e - .075) * 2 * PI / .3) + 1
			},
			bounce : function(e) {
				var t = 7.5625, n = 2.75, r;
				return e < 1 / n ? r = t * e * e : e < 2 / n
						? (e -= 1.5 / n, r = t * e * e + .75)
						: e < 2.5 / n
								? (e -= 2.25 / n, r = t * e * e + .9375)
								: (e -= 2.625 / n, r = t * e * e + .984375), r
			}
		}, W = function(e) {
			for (var t = 0; t < U.length; t++)
				if (U[t].el == e)
					return e._animate = !1, l(U[t].fn, "function") && U[t].fn(), U
							.splice(t, 1), !0;
			return !1
		}, X = function(e, t, n, r, s) {
			e._animate && W(e);
			var o = {}, u = {}, a = {}, f = !1;
			for (var l in t)
				i.call(e.attrs, l)
						&& Math.abs(e.round(t[l]) - e.attrs[l]) > .5
						&& (u[l] = e.round(t[l]), o[l] = e.attrs[l], a[l] = u[l]
								- o[l], f = !0);
			if (!f)
				return;
			e._animate = !0, U.push({
						el : e,
						start : +(new Date),
						from : o,
						diff : a,
						to : u,
						ms : n,
						easing : z[r] || z.linear,
						fn : s
					}), $()
		}, V = !1, $ = function() {
			if (V)
				return;
			var e = +(new Date);
			for (var t = 0; t < U.length; t++) {
				var n = U[t], r = e - n.start;
				if (r >= n.ms)
					n.el.attr(n.to), W(n.el), t--;
				else {
					var i = n.easing(r / n.ms), s = {};
					for (var o in n.diff)
						s[o] = n.from[o] + i * n.diff[o], s[o] > n.to[o]
								&& (s[o] = n.to[o]);
					n.el.attr(s)
				}
			}
			U.length && (V = !0, R(function() {
						V = !1, $()
					}))
		};
		return h
	})
}(typeof define == "function" && define.amd ? define : function(e) {
	typeof exports == "object" ? module.exports = e() : this.__
			? this.__.Graphic = e()
			: this.__ = {
				Graphic : e()
			}
}), define("g/chart/base", ["require", "exports", "module", "../data/data",
				"../util/tool", "graphic"], function(e, t, n) {
			var r = e("../data/data"), i = e("../util/tool"), s = e("graphic"), o = i.object_extend, u = n.exports = function(
					e, t, n) {
				this.config = o(n, u.config), this.canvas = new s(
						this.config.width, this.config.height, document
								.getElementById(e)), this.data = new r(t,
						this.config.defalutCnt), this.isVs = 0, this.dataVs = {}, this.symbol = t, this.market = t
						.substr(0, 2), this.date = [], this.subCharts = [], this.backLayer = this.canvas
						.layer(), this.paper = this.canvas.layer(), this.foreLayer = this.canvas
						.layer(), this.drawBackground(), this.drawForeground(), this
						.draw()
			};
			u.prototype.addVs = function(e) {
				return this.dataVs[e]
						? !0
						: this.isVs >= 4 ? !1 : (this.dataVs[e] = new r(e,
								this.config.defalutCnt), this.isVs++, this
								.drawBackground(), this.draw(), !0)
			}, u.prototype.remVs = function(e) {
				this.dataVs[e]
						&& (this.dataVs[e].clear(), delete this.dataVs[e], this.isVs--, this
								.drawBackground(), this.draw())
			}, u.config = {
				width : 800,
				height : 600
			}, u.CONSTANT = {
				"kline-limit" : 20,
				"us-minutes-length" : 391,
				"sh-minutes-length" : 242,
				"sz-minutes-length" : 242,
				"hk-minutes-length" : 332,
				"us-minutes-time" : ["9:30", "10:00", "10:30", "11:00",
						"11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
						"14:30", "15:00", "15:30", "16:00"],
				"sh-minutes-time" : ["9:30", "10:00", "10:30", "11:00",
						"11:30/13:00", "13:30", "14:00", "14:30", "15:00"],
				"sz-minutes-time" : ["9:30", "10:00", "10:30", "11:00",
						"11:30/13:00", "13:30", "14:00", "14:30", "15:00"],
				"hk-minutes-time" : ["9:30", "10:00", "10:30", "11:00",
						"11:30", "12:00/13:00", "13:30", "14:00", "14:30",
						"15:00", "15:30", "16:00"]
			}, u.addSubChart = function(e, t) {
				var n = function(t, n, r) {
					this.scene = t, this.type = e, this.parent = n, this.paper = n.paper, this.data = n.data, this.init
							&& this.init.apply(this, r)
				};
				return n.toString = function() {
					return e
				}, n.prototype.draw = function() {
					this._isShow = !0, t.draw && t.draw.apply(this, arguments), this._isOver
							&& this.over.apply(this, this._overArgs)
				}, n.prototype.clear = function() {
					this._isShow
							&& (this._isShow = !1, t.out
									&& t.out.apply(this, arguments), t.clear
									&& t.clear.apply(this, arguments))
				}, n.prototype.over = function(e, n, r) {
					if (!e) {
						if (!this._overArgs) {
							this.out();
							return
						}
					} else
						this._overArgs = arguments;
					this._isOver = t.over && t.over.apply(this, this._overArgs), this._isOver
							|| this.out()
				}, n.prototype.out = function() {
					this._isOver = !1, this._overArgs = !1, t.out
							&& t.out.apply(this, arguments)
				}, o(n.prototype, t), t.drawForeground != undefined
						&& (u.prototype.drawForeground = t.drawForeground), u._ChartFactory[e] = n, n
			}, u._ChartFactory = {}, u.prototype.addSubChart = function(e, t) {
				var n = Array.prototype.slice.call(arguments, 2);
				if (u._ChartFactory[t]) {
					var r = new u._ChartFactory[t](e, this, n);
					return this.subCharts.push(r), r
				}
				if (typeof t == "function") {
					var r = new t(e, this, n);
					return this.subCharts.push(r), r
				}
			}, u.prototype.remSubChart = function() {
				for (var e = 0; e < this.subCharts.length; e++)
					this.subCharts[e].clear(), this.subCharts[e] = null, delete this.subCharts[e];
				u._ChartFactory = {}
			}, u.drawAxis = {
				y : function(e, t, n) {
					var r = t.length, i = n.h / (r - 1), s = n.x, o = n.y, u = [], a = 50;
					for (var f = 0; f < r; f++)
						o = n.y + f * i, u[f] = e.text(s, o, t[f]).attr({
									align : n.align || "start",
									fill : "#81a1c4",
									width : a,
									valign : "middle"
								});
					return u
				},
				x : function(e, t, n) {
					var r = t.length, i = n.w / r, s = n.x, o = n.y, u = [];
					for (var a = 0; a < r; a++)
						n.align == "center" ? s = n.x + i / 2 + a * i : s = n.x
								+ a * i, u[a] = e.text(s, o, t[a]).attr({
									align : n.align || "start",
									fill : "#81a1c4",
									valign : n.valign || "top"
								});
					return u
				},
				"y-left" : function(e, t, n, r) {
					n = n || 8;
					var i = r.h / 8 * (r.max - r.min) / (r.h - 2 * r.offset), s = (r.max + r.min)
							/ 2, o = String(t).length - String(t).indexOf(".")
							- 1, a = [(s + 4 * i).toFixed(o),
							(s + 3 * i).toFixed(o), (s + 2 * i).toFixed(o),
							(s + 1 * i).toFixed(o), s.toFixed(o),
							(s - 1 * i).toFixed(o), (s - 2 * i).toFixed(o),
							(s - 3 * i).toFixed(o), (s - 4 * i).toFixed(o)];
					return u.drawAxis.y(e, a, {
								x : 51,
								y : 64,
								h : r.h,
								align : "end"
							})
				},
				"y-right" : function(e, t, n, r) {
					n = n || 8;
					var s = r.h / 8 * (r.max - r.min) / (r.h - 2 * r.offset), o = (r.max + r.min)
							/ 2, a = String(t).length - String(t).indexOf(".")
							- 1, f = [i.percent((o + 4 * s - t) * 100 / t),
							i.percent((o + 3 * s - t) * 100 / t),
							i.percent((o + 2 * s - t) * 100 / t),
							i.percent((o + 1 * s - t) * 100 / t),
							i.percent((o + 0 * s - t) * 100 / t),
							i.percent((o - 1 * s - t) * 100 / t),
							i.percent((o - 2 * s - t) * 100 / t),
							i.percent((o - 3 * s - t) * 100 / t),
							i.percent((o - 4 * s - t) * 100 / t)];
					return u.drawAxis.y(e, f, {
								x : 777,
								y : 64,
								h : r.h,
								align : "end"
							})
				}
			}, u.drawShape = {
				line : function(e, t) {
					var n = t.x, r = t.y, i, s, o = 0, u = 0;
					t.type == "x"
							? (i = n + t.length, s = r, u = 1)
							: (i = n, s = r + t.length, o = 1), e.beginPath(), e
							.moveTo(n, r), e.lineTo(i, s), e.strokeStyle = "#aaa9a9", e
							.stroke(), e.beginPath(), e.moveTo(n - o, r - u), e
							.lineTo(i - o, s - u), e.moveTo(n + o, r + u), e
							.lineTo(i + o, s + u), e.strokeStyle = "rgba(255,255,255,0.3)", e
							.stroke()
				},
				label : function(e, t) {
					var n = t.width || 48, r = t.height || 20, i = t.width1
							|| 4, s = t.height1 || 5, o = [], u, a;
					t.type == "left"
							? (o[0] = [t.x - s - n, t.y - i - r / 2], o[1] = [
									t.x - s, o[0][1]], o[2] = [o[1][0], t.y - i], o[3] = [
									t.x, t.y], o[4] = [o[1][0], t.y + i], o[5] = [
									o[1][0], t.y + i + r / 2], o[6] = [o[0][0],
									o[5][1]], u = t.x - s - n / 2, a = t.y)
							: t.type == "right"
									? (o[0] = [t.x + s + n, t.y - i - r / 2], o[1] = [
											t.x + s, o[0][1]], o[2] = [o[1][0],
											t.y - i], o[3] = [t.x, t.y], o[4] = [
											o[1][0], t.y + i], o[5] = [o[1][0],
											t.y + i + r / 2], o[6] = [o[0][0],
											o[5][1]], u = t.x + s + n / 2, a = t.y)
									: t.type == "top"
											? (o[0] = [t.x - n / 2, t.y], o[1] = [
													t.x + n / 2, o[0][1]], o[2] = [
													o[1][0], t.y + r], o[3] = [
													t.x + i, t.y + r], o[4] = [
													t.x, t.y + s + r], o[5] = [
													t.x - i, t.y + r], o[6] = [
													o[0][0], o[5][1]], u = t.x, a = t.y
													+ r / 2)
											: (o[0] = [t.x - n / 2, t.y + s], o[1] = [
													t.x - i, o[0][1]], o[2] = [
													t.x, t.y], o[3] = [t.x + i,
													o[0][1]], o[4] = [
													t.x + n / 2, o[0][1]], o[5] = [
													o[4][0], t.y + s + r], o[6] = [
													o[0][0], o[5][1]], u = t.x, a = t.y
													+ s + r / 2), e.beginPath();
					for (var f = 0; f < o.length; f++)
						f ? e.lineTo(o[f][0], o[f][1]) : e.moveTo(o[f][0],
								o[f][1]);
					e.closePath(), e.strokeStyle = t.stroke || "#3692da", e
							.stroke(), e.fillStyle = t.fill || "#8bcfff", e
							.fill(), e.fillStyle = "#ffffff", e.font = t.font
							|| "12px arial", e.textAlign = t.align || "center", e.textBaseline = "middle";
					var l = n;
					t.type == "left" ? t.align == "right" ? l = (t.x1 || t.x)
							- (t.x - n - s) : t.align == "left"
							&& (l = t.x - s - (t.x1 || u)) : t.type == "right"
							? t.align == "right" ? l = (t.x1 || t.x)
									- (t.x + s) : t.align == "left"
									&& (l = t.x + n + s - (t.x1 || t.x))
							: t.align == "right" ? l = (t.x1 || t.x)
									- (t.x - n / 2) : t.align == "left"
									&& (l = t.x + n / 2 - (t.x1 || t.x)), e
							.fillText(t.text, t.x1 || u, a, l)
				}
			}, u.drawMethod = {
				line : function(e, t, n) {
					var r = n.max || Math.max.apply(Math, t), i = n.min
							|| Math.min.apply(Math, t), s = n.offset || 0, o = n.offsetTop
							|| s, u = n.offsetBottom || s, a = [], f = n.w
							/ (t.length - (n.facing ? 1 : 0)), l = (n.h - o - u)
							/ (r - i), c = !0, h = n.y + n.h, p, d, v = [], m = n.x
							+ (n.facing ? 0 : f / 2), g, y = 0;
					for (var b = 0, w = t.length; b < w; b++) {
						p = m + b * f;
						if (t[b] || n.zero)
							d = n.y + o + (r - t[b]) * l, g = p, a.push(c
											? "M"
											: "L", p, " ", d), c = !1, y = b;
						v.push([p, d])
					}
					n.fill
							&& a.length
							&& a.push("L", g, " ", h, "L", n.x, " ", h, "L",
									n.x, " ", a[3]);
					var E = e.path(a.join(""));
					return n.fill && E.attr("fill", n.fill), "stroke" in n
							&& E.attr("stroke", n.stroke), n.el = E, v.slice(0,
							y + 1)
				},
				Mountain : function(e, t, n) {
					n.els = n.els || [];
					var r = n.max || Math.max.apply(Math, t), i = n.min
							|| Math.min.apply(Math, t), s = n.offset || 30, o = n.offsetTop
							|| s, u = n.offsetBottom || s, a = [], f = n.w
							/ (t.length - (n.facing ? 1 : 0)), l = (n.h - o - u)
							/ (r - i), c = !0, h, p, d, v, m = [], g = n.x
							+ (n.facing ? 0 : f / 2), y = [], b = 0;
					for (var w = 0, E = t.length; w < E; w++)
						h = g + w * f, t[w]
								&& (p = n.y + o + (r - t[w]) * l, y
										.push([h, p]), b = w), m.push([h, p]);
					if (!n.els[0]) {
						var S = function(e, t, n) {
							var r = t.points, i = t.broken, s = 0, o = 0, u = [];
							for (; o < i.length; o++) {
								var a = !0;
								e.beginPath();
								for (; s < i[o]; s++)
									a
											? (a = !1, e.moveTo(r[s][0],
													r[s][1]), u = [r[s][0],
													r[s][1]], d = r[s][0], v = r[s][1])
											: (u = [r[s][0], r[s][1]], e
													.lineTo(r[s][0], r[s][1]));
								e.lineWidth = 2, e.strokeStyle = "#0090ff", e
										.stroke(), e.lineTo(r[s - 1][0], t.y), o == 0
										? (e.lineTo(t.x, t.y), e.lineTo(t.x, v), e
												.lineTo(d, v))
										: (e.lineTo(d, t.y), e.lineTo(d, v)), e
										.closePath(), e.fillStyle = "rgba(218,234,250,0.5)", e
										.fill()
							}
						};
						n.els[0] = e.shape(S)
					}
					return n.els[0].attach(e).attr({
								points : y,
								broken : n.broken || [y.length],
								x : n.x,
								y : n.y + n.h
							}), m.slice(0, b + 1)
				},
				Histogram : function(e, t, n, r) {
					var i = r.max || Math.max.apply(Math, t), s = r.min || 0, o = r.offset
							|| 0, u = r.offsetTop || o, a = r.offsetBottom || o, f = [
							[], []], l = r.w
							/ ((r.length || t.length) - (r.facing ? 1 : 0)), c = (r.h
							- u - a)
							/ (i - s), h = !0, p = l / 3;
					r.maxWidth && p > r.maxWidth / 2 && (p = r.maxWidth / 2);
					var d = r.y + r.h - a, v = [], m, g, y, b = r.x
							+ (r.facing ? 0 : l / 2), w = r.x + r.w, E = 0;
					for (var S = 0, x = t.length; S < x; S++) {
						m = b + S * l, g = r.y + u + (i - t[S]) * c;
						if (t[S]) {
							n ? y = d - g : y = t[S] * c;
							var T = m - p, N = m + p;
							T < r.x && (T = r.x), N > w && (N = w), f[(n
									? n[S]
									: t[S]) < 0 ? 1 : 0].push("M", T, " ", g
											+ y, "L", T, " ", g, "L", N, " ",
									g, "L", N, " ", g + y, "L", T, " ", g + y), E = S
						}
						v.push([m, g])
					}
					return r.els && r.els[0] && !r.els[0].removed ? (r.els[0]
							.attr("path", f[0].join("")), r.els[1].attr("path",
							f[1].join(""))) : (r.els = [], r.els[0] = e
							.path(f[0].join("")).attr({
										fill : "#ea6f67",
										stroke : null
									}), r.els[1] = e.path(f[1].join("")).attr({
								fill : "#47b941",
								stroke : null
							})), v.slice(0, E + 1)
				},
				Candlestick : function(e, t, n) {
					var r = n.max
							|| Math.max.apply(Math, t.join(",").split(",")), i = n.min
							|| Math.min.apply(Math, t.join(",").split(",")), s = n.offset
							|| 0, o = n.offsetTop || s, u = n.offsetBottom || s, a = [
							[], [], [], []], f = n.w / t.length, l = (n.h - o - u)
							/ (r - i);
					isFinite(l) || (r += 10, i -= 10, l = (n.h - o - u) / 20);
					var c = f / 3, h, p = [], d, v;
					n.maxWidth && c > n.maxWidth / 2 && (c = n.maxWidth / 2);
					var m = [], g = n.x + f / 2, y = 0;
					for (var b = 0, w = t.length; b < w; b++) {
						var E = t[b];
						h = g + b * f, E
								&& (v = E[3] > E[0] ? 0 : 1, p = [
										n.y + o + (r - E[0]) * l,
										n.y + o + (r - E[3]) * l,
										n.y + o + (r - E[1]) * l,
										n.y + o + (r - E[2]) * l], E[0] == E[3]
										&& (p[0] -= .5, p[1] += .5), E[1] == E[2]
										&& (p[2] -= .5, p[3] += .5), a[v]
										.push("M", h - c, " ", p[1], "L",
												h - c, " ", p[0], "L", h + c,
												" ", p[0], "L", h + c, " ",
												p[1], "L", h - c, " ", p[1]), a[v
										+ 2].push("M", h, " ", p[3], "L", h,
										" ", p[2]), y = b), m.push([h, p])
					}
					return n.els && e.set(n.els).remove(), n.els = [
							e.path(a[0].join("")).attr({
										fill : "#ea6f67",
										stroke : null
									}), e.path(a[1].join("")).attr({
										fill : "#47b941",
										stroke : null
									}), e.path(a[2].join("")).attr({
										stroke : "#ea6f67"
									}), e.path(a[3].join("")).attr({
										stroke : "#47b941"
									})], m.slice(0, y + 1)
				}
			}, u.prototype.draw = function() {
				if (!this._drawing) {
					var e = this;
					this._drawing = setTimeout(function() {
						e._drawing = !1, e.paper._canvas.width = e.paper._canvas.width, e.paper
								.clear();
						for (var t = 0; t < e.subCharts.length; t++)
							e.subCharts[t]
									&& (e.subCharts[t].scene == e.scene
											? e.subCharts[t].draw
													&& e.subCharts[t].draw()
											: e.subCharts[t].clear
													&& e.subCharts[t].clear())
					}, 0)
				}
			}, u.prototype.execute = function(e, t, n) {
				var r = this;
				for (var i = 0; i < r.subCharts.length; i++)
					if (r.subCharts[i])
						if (e == "*" || r.subCharts[i].scene == e)
							if (t == "*" || r.subCharts[i].type == t) {
								n instanceof Array || (n = [n]);
								for (var s = 0; s < n.length; s++)
									r.subCharts[i].run
											&& r.subCharts[i].run(n[s])
							}
				return this
			}, u.prototype.setScene = function(e) {
				return this.backLayer._canvas.width = this.backLayer._canvas.width, this.paper._canvas.width = this.paper._canvas.width, this.foreLayer._canvas.width = this.foreLayer._canvas.width, this.scene = e, this
						.drawBackground(), this.draw(), this
			}, u.prototype.drawBackground = function() {
				if (!this._drawBackgrounding) {
					var e = this, t = this.backLayer;
					this._drawBackgrounding = setTimeout(function() {
						e._drawBackgrounding = !1, t.clear(), t.rect(0, 0,
								e.config.width, e.config.height).attr({
									fill : e.config.bgColor || "white",
									stroke : null
								});
						for (var n = 0; n < e.subCharts.length; n++)
							e.subCharts[n]
									&& (e.subCharts[n].scene == e.scene
											? e.subCharts[n].bg
													&& e.subCharts[n].bg(t)
											: e.subCharts[n].clear
													&& e.subCharts[n].clear());
						e.config.logo
								&& t
										.image(
												"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAUCAYAAAAN+ioeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADImlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjEgNjQuMTQwOTQ5LCAyMDEwLzEyLzA3LTEwOjU3OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgV2luZG93cyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5RjZDNTA0MzRGMkIxMUUyQjI0MUQ4ODEyMTk1RERERSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5RjZDNTA0NDRGMkIxMUUyQjI0MUQ4ODEyMTk1RERERSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjlGNkM1MDQxNEYyQjExRTJCMjQxRDg4MTIxOTVERERFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjlGNkM1MDQyNEYyQjExRTJCMjQxRDg4MTIxOTVERERFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+9O1nKwAABn5JREFUWEfd191HZWEUBvBj/uH+kIhERCQiIiIiIiIiIiIiIiK6iIiu3jm/PZ5tnd2ZM6czHxdzsWbvvT6f9az1vqcZtdY+ycfHx7eHh4e2s7PTVldX297eXnt6ehqb2uj+/r6trKy0jY2N7rm1tdWOj4/by8tLZ59X1Mj7+/t7//6/ylTl5eVlW1tba+vr6+3s7KxVUs7Pz3uS2Q3CE+EZxlek5p4ls/yqbR6/eWt+VWbl/WREJJLJwcHBWDUZ8Pb21ra3tztyQzTi+SP7+fl5Iqbmz/vr62tzMu7u7trj4+NY9WOrDUr++p1tl9ep8S225qWrIkee8anCBkPsP/MjMDjdQ55808+7XBMfNzc3HXlIQ96s64CvqyVkZzjIHoIaihMjv4Ht7u626+vrsbqN9vf329HRUUcSH9/xd30ZClLEWAg2AgcdHzHePX0TA40vbGrELtbz5OSkH2qehN7CDXvSP/xyI9vJPz097QQ2356p3QdqoBIHTGwRxAusG3B1ddVvNBF/cXHR2yMVaAgFUE3+7O56g8ogfN/e3nbvGhCLBE3S2Sg6RMClucTY+uRBFj/iZCCIHyLY+MEtr95suzr6NbTDw8OJng0czuRVW0964ZuBb25udvXF9kQogqhsJ7CxcZQgRHqmcQK8Ion3HmDDTdCA4sBpyDtSkCXON9GIJoHN5tcTFoLyTWCs15388tTBqysnzNlAA1fDe+qJ84RFzzlpJCfGu/48kz9iAfGRuN4AZLbZE8jYAM2PX8j0zJEniA0wduTFVsU28AHEBmqMTi7D1mwa880vNpgQROqGETaDqlcKDHJVLHpR39DghSHkI5yvk6KGmnqRM3cxnjJ0y4jwnCxCbwnU1UuG0ANVVFLivU5JYoHIjo9vReNDFDQAUhuukkZtDD/keK/HTf7o6dhgQjgs4mttgyJiK6k2Xo16qgxQLoPSQ64c9eKjd7EIo5ebXk9i2JDsXb7EWQr44B8uYvcPAVIgJw0qFoC+NTfcagSw10aykcMhRNyNwNgQeXN0NSE/m01CmKGo4zrQrK3l6xueEKyWvOoiLhtJz6/Wzw+fOP7y8at4kSdOnXBBsoyeOBBjYEjPMopRXw4++e4BcCIKID0bnbtGAXbvVepdTgCnr5OOAAU4UuVXB0EaVzf1NcIvDRHkJ48YhHnyIXIZlHc5nAQ5+CQud3Y2kq+ByJUTaMDq2cbkT7zeckoyfLEZSr1CiBpsBtIrAcjGEqTYVE7ZdgWWl5f7d3obKb5uNf00ojXFlh8yeeTPleGY0msWsd41yi91Miw53IfIs/n81KTjI4flyIDgQ4w6dOKRlM325CcPvffhoCxHBqiunOzEYJwmiwmPGsT7xEZn1UMgwPRA5zoAPJvnHREKJkfEMVKg6oACxDBTR1OJV1ODtibHP9sFfPIYFl09SXLAU/3Y1QqBROMWRU8wIlut6GDWm9q+YaqLZCn0Lyd+PPGmD74wwCaHYdCJ4df/ca4gI0dGuoiJJThHRRI/Iux1m4mpAzvUyyMOmRqtdfLjF4DAqwO8fMkFJ4yVQETT1aPrKhCfhYkuRLIhEfnqId1g0lN81FObXg26EA6X/ISPfHz0BxMxMPk6AAThknOKroqABPHNu6cGFBfr25SHJBNDypWCaOD521zihNjKiK0UQ5IPIYhJ/eTSeNXBQ19xsAcfUg3XCVE7xMfXdiONPd+WQGyuC3jjT8TzmdZ7/8KouSSeR2yVpnOV2EIbULctokF24LxrApG+xSPThngiwI8LUsVUAvgMT1y2PqdTfg3nB64KndoI84SXfogZkeyVNBtqmeAxGKchNn7TsEUmPpCsyZqApIFIigGioGdkGslAAG6LkKtJcTlyfOiRgPgIopFo4/ggUJxhIAgO8UtLSxM/WvSwaFweJ1UO34aa3w+9WhQ2edT3o8ZOz58fmzyGJ97w1eNHxLDD5hQFP1u4nCCEACWZAI5AIA8Rvk0MiEpuJBsU8vJugMhhlyfXRnwI8vmwIcDTt5rJ56lBNk07gbYsxCeXAebqYLMU6jkl9T8R+lJXHsNBrLzZTDp+6qZ3dQxcXTiJGBLcGUYGwrdvlFB4KsBpGpnEZpqebSMSm2AleBEZxv9uvkg9kX8q51dlqpIAl+OCXISG4Eq6jajbNEsWaTIxixL0q7h/QbwaUw1VEO64OXo53u5OR8nmO0bDmFng/3Zjf5vYxeLb6DvM7Ket9bLCAAAAAABJRU5ErkJggg==",
												620, 80)
					}, 0)
				}
			}, u.prototype.drawForeground = function() {
				var e = this.foreLayer, t = this;
				e.mousemove(function(n) {
							for (var r = 0; r < t.subCharts.length; r++)
								t.subCharts[r]
										&& t.subCharts[r].scene == t.scene
										&& t.subCharts[r].over
										&& t.subCharts[r].over(e, n.dx, n.dy)
						}), e.mouseout(function(n) {
							for (var r = 0; r < t.subCharts.length; r++)
								t.subCharts[r]
										&& t.subCharts[r].scene == t.scene
										&& t.subCharts[r].out
										&& t.subCharts[r].out(e)
						})
			}, u.prototype.clear = function() {
				this.setScene("")
			}
		}), define("plugin/zepto/zepto.swipe", ["require", "exports", "module",
				"zepto"], function(e, t) {
			var n = e("zepto");
			return function(e) {
				e.fn.swipe = function(t) {
					var n, r, i, s, o, u, a;
					return s = 2e3, a = function(e, t) {
						return function() {
							return e.apply(t, arguments)
						}
					}, this.each(function(n, s) {
						function u(e, t, n, r) {
							var i = Math.abs(e - t), s = Math.abs(n - r);
							return i >= s ? e - t > 0 ? "Left" : "Right" : n
									- r > 0 ? "Up" : "Down"
						}
						var o = e(s);
						o.on("touchstart", a(function(n) {
							n = n.touches[0], r = {
								x : n.pageX,
								y : n.pageY
							}, o.on("touchmove", a(function(e) {
												e = e.touches[0], i = {
													x : e.pageX,
													y : e.pageY
												};
												var n = u(r.x, i.x, r.y, i.y);
												t.callback(e, n), o
														.off("touchmove")
											}, this)), o.on("touchend", a(
											function(n) {
												t.dom.removeEventListener(
														"touchstart",
														t.touchstart), e(window)
														.off("touchmove",
																t.handler), o
														.off("touchmove"), o
														.off("touchend")
											}, this)), o.on("touchcancel", a(
											function(e) {
												o.off("touchmove"), o
														.off("touchcancel")
											}, this))
						}, this))
					})
				}
			}(n), n.fn.tap
		}), define("widgets/cn/mod-quotchart/scripts/mobile-minute", [
				"require", "exports", "module", "zepto",
				"plugin/zepto/zepto.ua", "g/chart/base", "g/util/tool",
				"plugin/zepto/zepto.swipe"], function(e, t, n) {
			var r = e("zepto");
			e("plugin/zepto/zepto.ua");
			var i = e("g/chart/base"), s = e("g/util/tool");
			e("plugin/zepto/zepto.swipe");
			var o = s.object_extend, u = s.array_find, a, f, l = 0, c = function(
					e) {
				navigator.userAgent.match(/Android/i)
						&& (e.preventDefault(), this.foreLayer._canvas.width = this.foreLayer._canvas.width, this.foreLayer
								.draw())
			}, h = function(e) {
				var t = this.foreLayer, n = this;
				if (l)
					for (var r = 0; r < n.subCharts.length; r++)
						n.subCharts[r]
								&& n.subCharts[r].scene == n.scene
								&& n.subCharts[r].over
								&& n.subCharts[r].over(t,
										e.targetTouches[0].pageX,
										e.targetTouches[0].pageY)
			}, p = function(e) {
				l = 1
			};
			return i.addSubChart("minute", {
				init : function(e) {
					this.test = 0, this.devicePixelRatio = window.devicePixelRatio, this.width = r(window)
							.width(), this.height = this.width / 2;
					if (this.devicePixelRatio >= 2) {
						var t = 30;
						this.devicePixelRatio = 2, this.parent.canvas.size(
								this.width * this.devicePixelRatio,
								this.height * this.devicePixelRatio).zoom(.5)
					} else if (this.devicePixelRatio == 1.5) {
						var t = 50;
						this.parent.canvas.size(
								this.width * this.devicePixelRatio,
								this.height * this.devicePixelRatio).zoom(.67)
					} else if (this.devicePixelRatio == 1.3) {
						var t = 50;
						this.parent.canvas.size(
								this.width * this.devicePixelRatio,
								this.height * this.devicePixelRatio).zoom(.77)
					} else {
						var t = 65;
						this.parent.canvas.size(
								this.width * this.devicePixelRatio,
								this.height * this.devicePixelRatio).zoom(1)
					}
					this.config = o(e, {
								x : t * this.devicePixelRatio,
								y : 10,
								w : this.width * this.devicePixelRatio - t
										* this.devicePixelRatio * 2,
								h : this.devicePixelRatio == 1 ? this.height
										- this.height / 3.78 - 30 : this.height
										* this.devicePixelRatio - this.height
										* this.devicePixelRatio / 3.78 - 20
										* this.devicePixelRatio,
								offset : 20 * this.devicePixelRatio
							}), this.pointsLength = i.CONSTANT[this.parent.market
							+ "-minutes-length"], this.el = [], this.priceEl = r("#d-price"), this.zdfEl = r("#d-ZDF"), this.cjl = r("#d-CJL")
				},
				bg : function(e) {
					var t = this.config, n = this;
					e.rect(t.x + .5, t.y + .5, t.w, t.h).attr({
								fill : "#ffffff",
								stroke : "#cacaca"
							});
					for (var r = 1; r < 8; r++) {
						var s = t.y
								+ r
								* (this.devicePixelRatio == 1 ? this.height
										- this.height / 3.78 - 30 : this.height
										* this.devicePixelRatio - this.height
										* this.devicePixelRatio / 3.78 - 20
										* this.devicePixelRatio) / 8;
						e.line(t.x, s, t.x + t.w, s).attr({
									stroke : "#e3dfdd"
								})
					}
					var o = i.CONSTANT[this.parent.market + "-minutes-time"];
					for (var r = 0, u = o.length; r < u - 1; r++) {
						var a = t.x + r * t.w / 4;
						e.line(
								a,
								10,
								a,
								this.devicePixelRatio == 1
										? this.height - this.height / 3.78 - 30
												+ 8
										: this.height * this.devicePixelRatio
												- this.height
												* this.devicePixelRatio / 3.78
												- 20 * this.devicePixelRatio
												+ 8).attr({
									stroke : "#e3dfdd"
								});
						var f = r * 2, l = a, c;
						this.devicePixelRatio == 1
								? c = this.height - this.height / 3.78 - 2
								: this.devicePixelRatio == 1.5
										? c = this.height
												* this.devicePixelRatio
												- this.height
												* this.devicePixelRatio / 3.78
												- 20 * this.devicePixelRatio
												+ 25
										: c = this.height
												* this.devicePixelRatio
												- this.height
												* this.devicePixelRatio / 3.78
												- 20 * this.devicePixelRatio
												+ 30, o[f] != undefined
								&& e.text(l, c, o[f]).attr({
											align : "center",
											font : "14px Helvetica",
											fill : "#6b6661"
										})
					}
					setTimeout(function() {
								e.draw(!0)
							}, 1e3)
				},
				draw : function() {
					var e = this, t = this.config;
					e.points = null, this.loader && this.loader.cancel();
					var n, o, u;
					this.loader = e.data.getMinData().progress(function(a) {
						e._data = a;
						var f = [], l, c = e._data.avgp = [], h = 0;
						if (a && a.price) {
							f = a.price.slice(0);
							for (l = f.length; l < e.pointsLength; l++)
								f[l] = 0;
							for (var l = 0; l < a.price.length; l++)
								h += parseFloat(a.price[l] == undefined
										? 0
										: a.price[l]), c[l] = h / (l + 1)
						}
						f.splice(i.CONSTANT["" + this.parent.market
										+ "-minutes-length"], f.length
										- i.CONSTANT["" + this.parent.market
												+ "-minutes-length"]);
						var p = a.yprice == undefined ? "0.000" : a.yprice, d = Math
								.max(	Math.abs(Math.max.apply(null,
												a.price = a.price.length == 0
														? ["0.000"]
														: a.price)
												- p), Math.abs(Math.min.apply(
												null, a.price)
												- p))
								|| +p || 1;
						t.max = +p + d, t.min = +p - d, e._data.date != undefined
								&& (e.points = i.drawMethod.Mountain(e.paper,
										f, t)), i.drawAxis = {
							y : function(e, t, n) {
								var r = t.length, i = n.h / (r - 1), s = n.x, o = n.y, u = [], a = 50;
								for (var f = 0; f < r; f++)
									o = f == 0 ? n.y + 8 + f * i : n.y + 8 + f
											* i - 5, u[f] = e.text(s + 5, o,
											t[f]).attr({
										align : n.align || "start",
										font : t[f] >= 1e5
												? "12px Helvetica"
												: "14px Helvetica",
										fill : "#928b8b",
										width : a,
										valign : "middle"
									});
								return u
							},
							x : function(e, t, n) {
								var r = t.length, i = n.w / r, s = n.x, o = n.y, u = [];
								for (var a = 0; a < r; a++)
									n.align == "center" ? s = n.x + i / 2 + a
											* i : s = n.x + a * i, u[a] = e
											.text(s, o, t[a]).attr({
														align : n.align
																|| "start",
														font : "14px Helvetica",
														fill : "#928b8b",
														valign : n.valign
																|| "top"
													});
								return u
							},
							"y-left" : function(e, t, n, r) {
								n = n || 8;
								var s = r.h / 8 * (r.max - r.min)
										/ (r.h - 2 * r.offset), o = (r.max + r.min)
										/ 2, u = String(t).length
										- String(t).indexOf(".") - 1;
								t = t == 0 ? 0 : t;
								if (t != 0)
									var a = [(o + 4 * s).toFixed(u),
											(o + 3 * s).toFixed(u),
											(o + 2 * s).toFixed(u),
											(o + 1 * s).toFixed(u),
											o.toFixed(u),
											(o - 1 * s).toFixed(u),
											(o - 2 * s).toFixed(u),
											(o - 3 * s).toFixed(u),
											(o - 4 * s).toFixed(u)];
								else
									var a = ["0.000", "0.000", "0.000",
											"0.000", "0.000", "0.000", "0.000",
											"0.000"];
								return i.drawAxis.y(e, a, {
											x : r.x - 10,
											y : 5,
											h : r.h,
											align : "end"
										})
							},
							"y-right" : function(e, t, n, r) {
								n = n || 8;
								var o = r.h / 8 * (r.max - r.min)
										/ (r.h - 2 * r.offset), u = (r.max + r.min)
										/ 2, a = String(t).length
										- String(t).indexOf(".") - 1;
								t = t == 0 ? 0 : t;
								if (t != 0)
									var f = [
											s
													.percent((u + 4 * o - t)
															* 100 / t),
											s
													.percent((u + 3 * o - t)
															* 100 / t),
											s
													.percent((u + 2 * o - t)
															* 100 / t),
											s
													.percent((u + 1 * o - t)
															* 100 / t),
											s
													.percent((u + 0 * o - t)
															* 100 / t),
											s
													.percent((u - 1 * o - t)
															* 100 / t),
											s
													.percent((u - 2 * o - t)
															* 100 / t),
											s
													.percent((u - 3 * o - t)
															* 100 / t),
											s
													.percent((u - 4 * o - t)
															* 100 / t)];
								else
									var f = ["0.00%", "0.00%", "0.00%",
											"0.00%", "0.00%", "0.00%", "0.00%",
											"0.00%"];
								return i.drawAxis.y(e, f, {
											x : r.x + r.w + 53,
											y : 5,
											h : r.h,
											align : "end"
										})
							}
						}, n && e.paper.set(n).remove(), n = i.drawAxis["y-left"](
								e.paper, p, 8, t), o && e.paper.set(o).remove(), o = i.drawAxis["y-right"](
								e.paper, p, 8, t);
						var v = t.y + t.h / 2;
						u && u.remove(), u = e.paper.line(t.x + .5, v,
								t.x + t.w, v).attr({
									stroke : "#ff8b2e"
								});
						var m = e._data.time.length - 1, p = e._data.yprice, g = String(p).length
								- String(p).indexOf(".") - 1;
						e._data.date != undefined
								? (r("#d-price").html("\u4ef7\u683c "
										+ parseFloat(e._data.price[m])
												.toFixed(g)), r("#d-CJL")
										.html("\u6210\u4ea4\u91cf "
												+ e._data.volume[m]), r("#d-avg")
										.html("\u5747\u4ef7 "
												+ parseFloat(e._data.avgp[m])
														.toFixed(g)))
								: (r("#d-price").html("\u4ef7\u683c 0.000"), r("#d-CJL")
										.html("\u6210\u4ea4\u91cf 0"), r("#d-avg")
										.html("\u5747\u4ef7 0.000")), e._isOver = !0, e
								.over(e.parent.foreLayer, 99999, 100);
						if (typeof window.callPhantom == "function"
								&& !this.test) {
							this.test = 1;
							var y = window.callPhantom({
										name : "mod-chart",
										time : Date.now()
									})
						}
					})
				},
				over : function(e, t, n) {
					var o = this, a = this.config;
					t *= this.devicePixelRatio, n *= this.devicePixelRatio, this.els
							|| (this.els = [], this.els[0] = e.circle(t, n, 3)
									.attr({
												"stroke-width" : 2,
												stroke : "#ff4800",
												fill : "white"
											}).hide(), this.els[1] = e
									.shape(i.drawShape.label).attr({
										x : a.x - 2,
										y : 0,
										align : "right",
										width : 60,
										x1 : a.x - 10,
										type : "left",
										font : a.max >= 1e5
												? "12px"
												: "14px Helvetica"
									}).hide(), this.els[2] = e
									.shape(i.drawShape.label).attr({
												x : a.x + a.w + 2,
												y : 0,
												align : "left",
												width : 60,
												x1 : a.x + a.w + 10,
												type : "right",
												font : "14px Helvetica"
											}).hide(), this.els[3] = e
									.shape(i.drawShape.label).attr({
												x : 0,
												y : 0,
												type : "top",
												font : "14px Helvetica"
											}).hide(), this.els[4] = e
									.shape(i.drawShape.line).attr({
												x : a.x,
												y : 0,
												length : a.w,
												type : "x"
											}).toBack().hide(), this.els[5] = e
									.shape(i.drawShape.line).attr({
												x : 0,
												y : a.y,
												length : a.h,
												type : "y"
											}).toBack().hide()), e
							.set(this.els).attach(e);
					if (this.points) {
						var f = u(this.points, function(e, n) {
									return e[0] - t
								}, !0);
						if (f >= 0) {
							var l = o._data.yprice, c = String(l).length
									- String(l).indexOf(".") - 1;
							return o._data.time.length != 0
									&& (this.els[0].attr({
												x : this.points[f][0],
												y : this.points[f][1]
											}).show(), this.els[1].attr({
										y : this.points[f][1],
										text : parseFloat(o._data.price[f])
												.toFixed(c)
									}).show(), l == 0 ? this.els[2].attr({
												y : this.points[f][1],
												text : "0.00%",
												font : "14px Helvetica"
											}).show() : this.els[2].attr({
										y : this.points[f][1],
										text : s.percent((o._data.price[f] - l)
												* 100 / l),
										font : "14px Helvetica"
									}).show(), this.els[3].attr({
										x : this.points[f][0],
										text : o._data.time[f].substr(0, 2)
												+ ":"
												+ o._data.time[f].substr(2)
									}).show()), setTimeout(function() {
								r("#d-price").html("\u4ef7\u683c "
										+ parseFloat(o._data.price[f])
												.toFixed(c)), r("#d-CJL")
										.html("\u6210\u4ea4\u91cf "
												+ o._data.volume[f]), r("#d-avg")
										.html("\u5747\u4ef7 "
												+ parseFloat(o._data.avgp[f])
														.toFixed(c))
							}, 0), this.points[f][1] != undefined
									&& (this.els[4]
											.attr("y", this.points[f][1])
											.show(), this.els[5].attr("x",
											this.points[f][0]).show()), !0
						}
					}
				},
				out : function() {
					this.paper.set(this.el).show(), this.paper.set(this.els)
							.hide()
				},
				clear : function() {
					this.loader && this.loader.cancel()
				},
				drawForeground : function() {
					var e = this.foreLayer, t = this;
					f = function() {
						h.apply(t, arguments)
					};
					var n = function(e) {
						e.preventDefault()
					};
					e._canvas.addEventListener("mousedown", r.proxy(c, t), !1), e._canvas
							.addEventListener("mouseover", f, !1), e._canvas
							.addEventListener("mouseup", p, !1), r(e._canvas)
							.swipe({
								dom : e,
								touchstart : c,
								fn : n,
								callback : function(e, t) {
									t == "Left" || t == "Right"
											? (l = 1, r(window).on("touchmove",
													n))
											: (l = 0, r(window).off(
													"touchmove", n))
								}
							})
				}
			})
		}), define("widgets/cn/mod-quotchart/scripts/mobile-5day", ["require",
				"exports", "module", "zepto", "g/chart/base", "g/util/tool"],
		function(e, t, n) {
			var r = e("zepto"), i = e("g/chart/base"), s = e("g/util/tool"), o = s.object_extend, u = s.array_find, a, f, l = 0, c = function(
					e) {
				navigator.userAgent.match(/Android/i) && e.preventDefault()
			}, h = function(e) {
				var t = this.foreLayer, n = this;
				if (l)
					for (var r = 0; r < n.subCharts.length; r++)
						n.subCharts[r]
								&& n.subCharts[r].scene == n.scene
								&& n.subCharts[r].over
								&& n.subCharts[r].over(t,
										e.targetTouches[0].pageX,
										e.targetTouches[0].pageY)
			}, p = function(e) {
				l = 1
			};
			return i.addSubChart("minute-5day", {
				init : function(e) {
					this.devicePixelRatio = window.devicePixelRatio, this.width = r(window)
							.width(), this.height = this.width / 2;
					if (this.devicePixelRatio >= 2) {
						var t = 30;
						this.devicePixelRatio = 2, this.parent.canvas.size(
								this.width * this.devicePixelRatio,
								this.height * this.devicePixelRatio).zoom(.5)
					} else if (this.devicePixelRatio == 1.5) {
						var t = 50;
						this.parent.canvas.size(
								this.width * this.devicePixelRatio,
								this.height * this.devicePixelRatio).zoom(.67)
					} else if (this.devicePixelRatio == 1.3) {
						var t = 50;
						this.parent.canvas.size(
								this.width * this.devicePixelRatio,
								this.height * this.devicePixelRatio).zoom(.77)
					} else {
						var t = 65;
						this.parent.canvas.size(
								this.width * this.devicePixelRatio,
								this.height * this.devicePixelRatio).zoom(1)
					}
					this.config = o(e, {
								x : t * this.devicePixelRatio,
								y : 10,
								w : this.width * this.devicePixelRatio - t
										* this.devicePixelRatio * 2,
								h : this.devicePixelRatio == 1 ? this.height
										- this.height / 3.78 - 30 : this.height
										* this.devicePixelRatio - this.height
										* this.devicePixelRatio / 3.78 - 20
										* this.devicePixelRatio,
								offset : 20 * this.devicePixelRatio
							}), this.el = []
				},
				bg : function(e) {
					var t = [104, 217], n = this.config;
					e.rect(n.x + .5, n.y + .5, n.w, n.h).attr({
								fill : "#ffffff",
								stroke : "#cacaca"
							});
					for (var r = 1; r < 8; r++) {
						var i = n.y
								+ r
								* (this.devicePixelRatio == 1 ? this.height
										- this.height / 3.78 - 30 : this.height
										* this.devicePixelRatio - this.height
										* this.devicePixelRatio / 3.78 - 20
										* this.devicePixelRatio) / 8;
						e.line(n.x, i, n.x + n.w, i).attr({
									stroke : "#e3dfdd"
								})
					}
					var s = 5;
					for (var r = 0; r <= s; r++) {
						var o = n.x + r * n.w / s;
						o
								&& r != 0
								&& r != s
								&& e.line(
										o,
										10,
										o,
										this.devicePixelRatio == 1
												? this.height - this.height
														/ 3.78 - 30 + 8
												: this.height
														* this.devicePixelRatio
														- this.height
														* this.devicePixelRatio
														/ 3.78 - 20
														* this.devicePixelRatio
														+ 8).attr({
											stroke : "#e3dfdd"
										})
					}
					setTimeout(function() {
								e.draw(!0)
							}, 1e3)
				},
				draw : function() {
					var e = this, t = this.config;
					e.points = null;
					var n = [], s, o, u = [], a;
					this.loader && this.loader.cancel(), this.loader = e.data
							.getMin5Data().progress(function(u) {
								e._data = {
									yprice : u[0].yprice,
									price : [],
									volume : [],
									time : [],
									date : []
								}, e.points = [];
								var f, l = 5, c = u.length, h = [], p = [];
								for (f = 0; f < c; f++)
									h.push(Math.max.apply(null, u[f].price)), p
											.push(Math.min.apply(null,
													u[f].price));
								h = Math.max.apply(null, h), p = Math.min
										.apply(null, p);
								var d = u[0].yprice == undefined
										? "0.000"
										: parseFloat(u[0].yprice)
												.toFixed(e.data.precision), v = Math
										.max(Math.abs(h - d), Math.abs(p - d))
										|| +d || 1;
								t.max = +d + v, t.min = +d - v, a
										&& e.paper.set(a).remove();
								var m = [], g = [], y = [];
								for (f = 0; f < c; f++) {
									g.push.apply(g, u[f].price), y
											.push(g.length), e._data.price.push
											.apply(e._data.price, u[f].price), e._data.volume.push
											.apply(e._data.volume, u[f].volume), e._data.time.push
											.apply(e._data.time, u[f].time), e._data.date
											.push([e._data.time.length,
													u[f].date]);
									if (f == c - 1)
										for (var b = u[f].time.length; b < i.CONSTANT[e.parent.market
												+ "-minutes-length"]; b++)
											g.push(0);
									var w = u[f].date;
									if (w != undefined) {
										var E = new Date(w.substr(0, 4), w
														.substr(4, 2)
														- 1, w.substr(6, 2)), S = [
												"\u65e5", "\u4e00", "\u4e8c",
												"\u4e09", "\u56db", "\u4e94",
												"\u516d"];
										m[f] = w.substr(4, 2) + "-"
												+ w.substr(6, 2) + " \u5468"
												+ S[E.getDay()]
									}
								}
								t.broken = y, t.defineW = 1205, e.points = i.drawMethod
										.Mountain(e.paper, g, t);
								for (f = m.length; f < l; f++)
									m.push("");
								a = i.drawAxis.x(e.paper, m, {
											x : t.x,
											y : t.y + t.h + 15,
											w : t.w,
											valign : "alphabetic",
											align : "center"
										}), s && e.paper.set(s).remove(), s = i.drawAxis["y-left"](
										e.paper, d, 8, t), o
										&& e.paper.set(o).remove(), o = i.drawAxis["y-right"](
										e.paper, d, 8, t), e.paper.set(n)
										.remove();
								var x = t.y + t.h / 2;
								n[0] = e.paper.line(t.x + .5, x, t.x + t.w, x)
										.attr({
													stroke : "#ff8b2e"
												});
								var g = u[u.length - 1], T = g.time.length - 1, d = e._data.yprice, N = e.data.precision, C = g.time[T];
								g.date == undefined
										? (r("#d2-price")
												.html("\u4ef7\u683c\uff1a0.000"), r("#d2-CJL")
												.html("\u6210\u4ea4\u91cf\uff1a0"))
										: (r("#d2-price")
												.html("\u4ef7\u683c\uff1a"
														+ parseFloat(g.price[T])
																.toFixed(N)), r("#d2-CJL")
												.html("\u6210\u4ea4\u91cf\uff1a"
														+ g.volume[T])), e._isOver = !0, e
										.over(e.parent.foreLayer, 99999, 100)
							})
				},
				over : function(e, t, n) {
					var o = this, a = this.config;
					t *= this.devicePixelRatio, n *= this.devicePixelRatio, this.els
							|| (this.els = [], this.els[0] = e.circle(t, n, 3)
									.attr({
												"stroke-width" : 2,
												stroke : "#ff4800",
												fill : "white"
											}).hide(), this.els[1] = e
									.shape(i.drawShape.label).attr({
												x : a.x - 2,
												y : 0,
												align : "right",
												width : 60,
												x1 : a.x - 10,
												type : "left",
												font : "14px Helvetica"
											}).hide(), this.els[2] = e
									.shape(i.drawShape.label).attr({
												x : a.x + a.w + 2,
												y : 0,
												align : "left",
												width : 60,
												x1 : a.x + a.w + 10,
												type : "right",
												font : "14px Helvetica"
											}).hide(), this.els[3] = e
									.shape(i.drawShape.label).attr({
												x : 0,
												y : 0,
												type : "top",
												font : "14px Helvetica"
											}).hide(), this.els[4] = e
									.shape(i.drawShape.line).attr({
												x : a.x,
												y : 0,
												length : a.w,
												type : "x"
											}).hide().toBack(), this.els[5] = e
									.shape(i.drawShape.line).attr({
												x : 0,
												y : a.y,
												length : a.h,
												type : "y"
											}).hide().toBack()), e
							.set(this.els).attach(e);
					if (this.points) {
						var f = this.points, l = u(f, function(e, n) {
									return e[0] - t
								}, !0), c = this._data;
						if (l >= 0 && c.time[l]) {
							e.set(this.el).hide();
							var h = o._data.yprice, p = this.data.precision;
							if (parseFloat(c.price[l]).toFixed(p).length >= 8)
								var d = parseFloat(c.price[l]).toFixed(p).length >= 9
										? "10px Helvetica"
										: "12px Helvetica";
							else
								var d = "14px Helvetica";
							return this.els[0].attr({
										x : f[l][0],
										y : f[l][1]
									}).show(), this.els[1].attr({
										y : f[l][1],
										text : parseFloat(c.price[l])
												.toFixed(p),
										font : d
									}).show(), h == 0 ? this.els[2].attr({
										y : f[l][1],
										text : "0.00%"
									}).show() : this.els[2].attr({
										y : f[l][1],
										text : s.percent((c.price[l] - h) * 100
												/ h)
									}).show(), this.els[3].attr({
								x : f[l][0],
								text : c.time[l].substr(0, 2) + ":"
										+ c.time[l].substr(2)
							}).show(), setTimeout(function() {
								r("#d2-price").html("\u4ef7\u683c\uff1a"
										+ parseFloat(c.price[l]).toFixed(p)), r("#d2-CJL")
										.html("\u6210\u4ea4\u91cf\uff1a"
												+ c.volume[l])
							}, 300), this.els[4].attr("y", f[l][1]).show(), this.els[5]
									.attr("x", f[l][0]).show(), !0
						}
					}
				},
				out : function() {
					this.paper.set(this.el).show(), this.paper.set(this.els)
							.hide()
				},
				clear : function() {
					this.loader && this.loader.cancel()
				}
			})
		}), define("g/chart/coordinate", ["require", "exports", "module",
				"../util/tool"], function(e, t, n) {
			function i(e) {
				return Math.LOG10E * Math.log(e)
			}
			function s(e) {
				return Math.pow(10, e)
			}
			var r = e("../util/tool"), o = n.exports = function(e, t, n, i, s) {
				this.x = e, this.y = t, this.w = n, this.h = i, this.config = r
						.object_extend(s, {
									type : "normal",
									offsetX : [0, 0],
									offsetY : [0, 0],
									centerX : !1,
									centerY : !1
								}), !this.config.offsetX.length
						&& (this.config.offsetX = [this.config.offsetX,
								this.config.offsetX]), !this.config.offsetY.length
						&& (this.config.offsetY = [this.config.offsetY,
								this.config.offsetY]), this.init()
			};
			o.prototype.init = function() {
				this.minY = this.minX = Number.MAX_VALUE, this.maxY = this.maxX = Number.MIN_VALUE, this.stepY = this.stepX = 0, this.baseX = this.x
						+ this.config.offsetX[0], this.baseY = this.y
						+ this.config.offsetY[0], this._draw = [], this._y2 = this.baseY
						+ this.maxY * this.stepY, this._x2 = this.baseX
						+ this.minX * this.stepX
			}, o.prototype.type = function(e) {
				if (this.config.type == e)
					return;
				this.config.type = e
			}, o.prototype.axis = function(e, t) {
				t || (t = e, e = !1);
				var n = !1, r = !1;
				e
						&& e.length == 2
						&& (e[0] < this.minX && (n = !0) && (this.minX = e[0]), e[1] > this.maxX
								&& (n = !0) && (this.maxX = e[1]), n
								&& (this.config.centerX
										? (this.stepX = (this.w
												- this.config.offsetX[0] - this.config.offsetX[1])
												/ (this.maxX - this.minX + 1), this.baseX = this.x
												+ this.config.offsetX[0]
												+ this.stepX / 2)
										: this.stepX = (this.w
												- this.config.offsetX[0] - this.config.offsetX[1])
												/ (this.maxX - this.minX), this._x2 = this.baseX
										+ this.minX * this.stepX)), t
						&& t.length == 2
						&& (this.config.type == "logarithm"
								&& (t[0] = i(t[0]), t[1] = i(t[1])), t[0] < this.minY
								&& (r = !0) && (this.minY = t[0]), t[1] > this.maxY
								&& (r = !0) && (this.maxY = t[1]), r
								&& (this.config.centerY
										? (this.stepY = (this.h
												- this.config.offsetY[0] - this.config.offsetY[1])
												/ (this.maxY - this.minY + 1), this.baseY = this.y
												+ this.config.offsetY[0]
												+ this.stepY / 2)
										: this.stepY = (this.h
												- this.config.offsetY[0] - this.config.offsetY[1])
												/ (this.maxY - this.minY), this._y2 = this.baseY
										+ this.maxY * this.stepY));
				if (n || r)
					for (var s = 0; s < this._draw.length; s++)
						this._draw[s]();
				return this
			}, o.prototype.draw = function(e) {
				this.undraw(e), this._draw.push(e), e();
				var t = this;
				return function() {
					t.undraw(e)
				}
			}, o.prototype.undraw = function(e) {
				for (var t = 0; t < this._draw.length; t++)
					if (this._draw[t] == e)
						return this._draw.splice(t, 1), e
			}, o.prototype.y2 = function(e) {
				return this.config.type == "logarithm" && (e = i(e)), this._y2
						- e * this.stepY
			}, o.prototype.x2 = function(e) {
				return this._x2 + e * this.stepX
			}, o.prototype.dx = function(e) {
				return e < this.baseX
						? e = this.minX
						: (e = this.minX
								+ Math.round((e - this.baseX) / this.stepX), e > this.maxX
								&& (e = this.maxX)), e
			}, o.prototype.cy = function(e) {
				var t = this.maxY - (e - this.baseY) / this.stepY;
				return this.config.type == "logarithm" && (t = s(t)), t
			}, o.prototype.grid = function(e, t, n, i) {
				i = r.object_extend(i, {
							color : "#bbd6f3",
							offsetY : [0, 0]
						});
				var s = [], o = this.x, u = this.y, a = this.x + this.w, f = this.y
						+ this.h;
				if (t > 1) {
					var l = this.h / t;
					i.offsetY[1] != 0 && t++;
					while (--t) {
						var c = u + t * l;
						s.push(e.line(o, c, a, c).attr({
									stroke : i.color
								}))
					}
					i.offsetY[0] != 0 && s.push(e.line(o, u, a, u).attr({
								stroke : i.color
							}))
				}
				if (n > 1) {
					var l = this.w / n;
					while (--n) {
						var h = o + n * l;
						s.push(e.line(h, u + i.offsetY[0], h, f + i.offsetY[1])
								.attr({
											stroke : i.color
										}))
					}
				}
				return s
			}, o.prototype.label = function(e, t) {
				t = r.object_extend(t, {
							type : "left",
							num : 3,
							offset : -17,
							align : "end",
							fill : "#81a1c4",
							font : "12px arial",
							fix : function(e) {
								return e.toFixed(2)
							}
						});
				if (typeof t.fill == "string") {
					var n = t.fill;
					t.fill = function() {
						return n
					}
				}
				var i = t.num, s, o, u, a = [], f = t.width || 50;
				if (t.type == "left" || t.type == "right") {
					s = this.h / (i - 1), t.type == "left" ? o = this.x
							+ t.offset : t.type == "right"
							&& (o = this.x + this.w + t.offset);
					for (var l = 0; l < i; l++) {
						u = this.y + l * s;
						var c = t.fix(this.cy(u));
						a[l] = e.text(o, u, c).attr({
									align : t.align,
									fill : t.fill(this.cy(u)),
									width : f,
									font : t.font,
									valign : "middle"
								})
					}
				} else if (t.type == "top" || t.type == "bottom") {
					s = this.w / (i - 1), t.type == "top" ? u = this.y
							+ t.offset : t.type == "bottom"
							&& (u = this.y + this.h + t.offset);
					for (var l = 0; l < i; l++) {
						o = this.x + l * s;
						var c = t.fix(this.dx(o));
						a[l] = e.text(o, u, c).attr({
									align : t.align,
									fill : t.fill(this.dx(o)),
									font : t.font,
									width : f,
									valign : "middle"
								})
					}
				}
				return a
			}
		}), define("g/chart/line/candlestick",
		["require", "exports", "module"], function(e, t, n) {
			return function(e, t, n, r) {
				var i = [[], [], [], []], s, o, u = n.stepX / 3, s, o = [], a, f;
				r.maxWidth && u > r.maxWidth / 2 && (u = r.maxWidth / 2);
				for (var l = 0, c = t.length; l < c; l++) {
					var h = t[l];
					s = n.x2(l), h
							&& (f = parseFloat(h[3]) < parseFloat(h[0]) ? 1 : 0, o = [
									n.y2(h[0]), n.y2(h[3]), n.y2(h[1]),
									n.y2(h[2])], h[0] == h[3]
									&& (o[0] -= .5, o[1] += .5), h[1] == h[2]
									&& (o[2] -= .5, o[3] += .5), i[f].push([
											"moveTo", [s - u, o[1]]], [
											"lineTo", [s - u, o[0]]], [
											"lineTo", [s + u, o[0]]], [
											"lineTo", [s + u, o[1]]], [
											"lineTo", [s - u, o[1]]]), i[f + 2]
									.push(["moveTo", [s, o[3]]], ["lineTo",
													[s, o[2]]]))
				}
				return [e.path(i[0]).attr({
									fill : "#ea6f67",
									stroke : null
								}), e.path(i[1]).attr({
									fill : "#47b941",
									stroke : null
								}), e.path(i[2]).attr({
									stroke : "#ea6f67"
								}), e.path(i[3]).attr({
									stroke : "#47b941"
								})]
			}
		}), define("widgets/cn/mod-quotchart/scripts/mobile-kline", ["require",
				"exports", "module", "zepto", "g/chart/base", "g/util/tool",
				"g/chart/coordinate", "g/chart/line/candlestick"], function(e,
				t, n) {
			var r = e("zepto"), i = e("g/chart/base"), s = e("g/util/tool"), o = e("g/chart/coordinate"), u = e("g/chart/line/candlestick"), a = s.object_extend, f = s.array_find;
			return i.addSubChart("kline", {
				init : function(e, t) {
					this.devicePixelRatio = window.devicePixelRatio, this.width = r(window)
							.width(), this.height = this.width / 2;
					if (this.devicePixelRatio >= 2) {
						var n = 30;
						this.devicePixelRatio = 2, this.parent.canvas.size(
								this.width * this.devicePixelRatio,
								this.height * this.devicePixelRatio).zoom(.5)
					} else if (this.devicePixelRatio == 1.5) {
						var n = 50;
						this.parent.canvas.size(
								this.width * this.devicePixelRatio,
								this.height * this.devicePixelRatio).zoom(.67)
					} else if (this.devicePixelRatio == 1.3) {
						var n = 50;
						this.parent.canvas.size(
								this.width * this.devicePixelRatio,
								this.height * this.devicePixelRatio).zoom(.77)
					} else {
						var n = 65;
						this.parent.canvas.size(
								this.width * this.devicePixelRatio,
								this.height * this.devicePixelRatio).zoom(1)
					}
					var t = this.config = a(t, {
								x : n * this.devicePixelRatio,
								y : 10,
								w : this.width * this.devicePixelRatio - n
										* this.devicePixelRatio * 2,
								h : this.devicePixelRatio == 1 ? this.height
										- this.height / 3.78 - 30 : this.height
										* this.devicePixelRatio - this.height
										* this.devicePixelRatio / 3.78 - 20
										* this.devicePixelRatio,
								offset : 20 * this.devicePixelRatio
							});
					this.coord = new o(t.x, t.y, t.w, t.h, {
								offsetY : 30,
								centerX : !0
							}), this.date = [], this.style = this.config.style
							|| "Mountain", this.type = this.config.type
							|| "daily", this.onChange = e || function() {
					}
				},
				bg : function(e) {
					var t = this.config;
					e.rect(t.x + .5, t.y + .5, t.w, t.h).attr({
								fill : "#ffffff",
								stroke : "#cacaca"
							}), this.coord.grid(e, 8, 4, {
								color : "#cacaca"
							}), setTimeout(function() {
								e.draw(!0)
							}, 1e3)
				},
				run : function(e) {
					switch (e.t) {
						case "type" :
							this.type = e.d, this._isShow && this.parent.draw();
							break;
						case "date" :
							this.date = e.d, this._isShow && this.parent.draw();
							break;
						case "coordinate" :
							this.coord.type(e.d), this._isShow
									&& this.parent.draw()
					}
				},
				dates : function(e) {
					!this._allDates && (this._allDates = {}), !this._allDates[this.type]
							&& (this._allDates[this.type] = []);
					var t = this._allDates[this.type];
					if (!e)
						return t;
					var n = parseInt(e[0], 10), r = f(t, function(e) {
								return parseInt(e, 10) - n
							});
					r < 0 && (r = n < parseInt(t[0], 10) ? 0 : t.length), n = parseInt(
							e[e.length - 1], 10);
					var i = f(t, function(e) {
								return parseInt(e, 10) - n
							});
					i < 0 ? i = n < parseInt(t[0], 10) ? 0 : t.length : i += 1, t.splice
							.apply(t, [r, i - r].concat(e))
				},
				draw : function() {
					var e = this, t = this.config;
					t.facing = 1, this.points = null, this.loader
							&& this.loader.cancel(), e.paper.set(e.el).remove(), this.el = [];
					var n = [], r = 0, s;
					this.loader = this.data.getData(e.type, e.date[0],
							e.date[1]).progress(function(o) {
						e.paper.set(n).remove(), e.paper.set(e.el).remove(), n = [], r = 0;
						var a = parseFloat(o.yprice).toFixed(e.data.precision);
						e._data = o, o = o.data;
						if (!o[0])
							return;
						var f = [parseInt(o[0][0]),
								parseInt(o[o.length - 1][0])];
						if (e.date[0] != f[0] || e.date[1] != f[1])
							e.date = f, e.onChange(f), e.coord.init();
						var l = [], c, h = [], p = [];
						for (c = 0; c < o.length; c++)
							l.push([o[c][1], o[c][3], o[c][4], o[c][2]]), p
									.push(o[c][3], o[c][4]), h.push(o[c][0]);
						e.dates(h), e.coord.axis([
										0,
										l.length < i.CONSTANT["kline-limit"]
												? i.CONSTANT["kline-limit"] - 1
												: l.length - 1], [
										Math.min.apply(Math, p),
										Math.max.apply(Math, p)]), s && s(), s = e.coord
								.draw(function() {
									n[0] && e.paper.set(n[0]).remove(), n[0] = u(
											e.paper, l, e.coord, t)
								}), n[1] = e.coord.label(e.paper, {
									num : 9,
									offset : -5,
									font : "14px Helvetica",
									fill : "#a59e9e"
								}), n[2] = e.coord.label(e.paper, {
									type : "bottom",
									num : 5,
									offset : e.devicePixelRatio == 1.5
											? 12
											: 17,
									width : 100,
									align : "center",
									font : e.devicePixelRatio == 1.5
											? "12px Helvetica"
											: "14px Helvetica",
									fill : "#a59e9e",
									fix : function(e) {
										return o[e][0].substr(0, 4) + "/"
												+ o[e][0].substr(4, 2) + "/"
												+ o[e][0].substr(6, 2)
									}
								}), e._isOver = !0, e.over(e.parent.foreLayer,
								99999, 100)
					})
				},
				_drawTipTxt : function(e, t) {
					var n = t.x, i = t.y, s = 76, o = t.data.yprice, u = t.data.data, a = [
							[u[1], u[1] < o ? "#47b941" : "#ea6f67", "\u5f00"],
							[u[3], u[3] < o ? "#47b941" : "#ea6f67", "\u9ad8"],
							[u[4], u[4] < o ? "#47b941" : "#ea6f67", "\u4f4e"],
							[u[2], u[2] < o ? "#47b941" : "#ea6f67", "\u6536"]];
					for (var f = 0; f < a.length; f++)
						r("#d3-price-" + (f + 1)).html(a[f][2] + " " + a[f][0])
				},
				_drawTipTxt2 : function(e, t) {
					var n = t.data;
					r("#d-price").html("\u4ef7\u683c " + n[0]), r("#d-ZDF")
							.html("\u6da8\u8dcc\u5e45 " + n[1]), r("#d-CJL")
							.html("\u6210\u4ea4\u91cf " + n[2])
				},
				_drawTip : function(e, t) {
					var n = t.x, r = t.y, i = 154, s = 170, o = 21;
					e.beginPath(), e.fillStyle = "rgba(255,255,255,0.85)", e.strokeStyle = "#d6d5ce", e
							.moveTo(n, r), e.lineTo(n + i, r), e.lineTo(n + i,
							r + s), e.lineTo(n, r + s), e.lineTo(n, r), e
							.fill(), e.moveTo(n, r + o), e.lineTo(n + i, r + o), e
							.stroke();
					var u = t.data.yprice, a = t.data.data;
					e.font = "14px arial", e.textAlign = "center", e.textBaseline = "middle", e.fillStyle = "#878774";
					var f = "\u65e5\u671f ";
					f += a[0].substr(0, 4) + "/" + a[0].substr(4, 2) + "/"
							+ a[0].substr(6, 2) + " ";
					var l = (new Date(a[0].substr(0, 4), a[0].substr(4, 2) - 1,
							a[0].substr(6, 2))).getDay(), c = ["\u65e5",
							"\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94",
							"\u516d"];
					f += "\u5468" + c[l], e.fillText(f, n + i / 2, r + o / 2);
					var h = a[5] >= 1e7
							? (a[5] / 1e8).toFixed(2) + "\u4ebf"
							: a[5], p = [
							["\u5f00   \u76d8", a[1],
									a[1] < u ? "#47b941" : "#ea6f67"],
							["\u6700   \u9ad8", a[3],
									a[3] < u ? "#47b941" : "#ea6f67"],
							["\u6700   \u4f4e", a[4],
									a[4] < u ? "#47b941" : "#ea6f67"],
							["\u6536   \u76d8", a[2],
									a[2] < u ? "#47b941" : "#ea6f67"],
							["\u6da8\u8dcc\u5e45",
									((a[2] - u) * 100 / u).toFixed(2) + "%",
									a[2] < u ? "#47b941" : "#ea6f67"],
							["\u6da8\u8dcc\u989d", (a[2] - u).toFixed(2),
									a[2] < u ? "#47b941" : "#ea6f67"],
							["\u6210\u4ea4\u91cf", h, "#878774"]], d = null;
					if ("pos" in t.data) {
						var v = [0, 3, 1, 2], m = v[t.data.pos];
						d = p[m][1]
					}
					for (var g = 0; g < p.length; g++)
						p[g][1] == d
								? e.font = "bold 14px arial"
								: e.font = "14px arial", e.fillStyle = "#878774", e.textAlign = "left", e
								.fillText(p[g][0], n + 15, r + o + o / 2 + g
												* o), e.fillStyle = p[g][2], e.textAlign = "right", e
								.fillText(p[g][1], n + i - 18, r + o + o / 2
												+ g * o)
				},
				over : function(e, t, n) {
					var r = this, s = this.config;
					t *= this.devicePixelRatio, n *= this.devicePixelRatio, this.els
							|| (this.els = [], this.els[0] = e
									.shape(i.drawShape.line).attr({
												x : s.x,
												y : 0,
												length : s.w,
												type : "x"
											}).hide(), this.els[1] = e
									.shape(i.drawShape.line).attr({
												x : 0,
												y : s.y,
												length : s.h,
												type : "y"
											}).hide(), this.els[2] = e.circle(
									t, n, 3).attr({
										"stroke-width" : 2,
										stroke : "#ff4800",
										fill : "white"
									}).hide(), this.els[3] = e
									.shape(this._drawTip).attr({
												x : 0,
												y : 40
											}).hide(), this.els[4] = e
									.shape(i.drawShape.label).attr({
												x : s.x - 2,
												y : 0,
												align : "right",
												width : 60,
												x1 : s.x - 10,
												type : "left",
												font : "14px Helvetica"
											}).hide(), this.els[5] = e
									.shape(i.drawShape.label).attr({
												x : s.x + s.w + 2,
												y : 0,
												align : "right",
												width : 60,
												x1 : s.x + s.w + 10,
												type : "right",
												font : "14px Helvetica"
											}).hide(), this.els[6] = e
									.shape(i.drawShape.label).attr({
												x : 0,
												y : 0,
												width : 87,
												type : "top",
												font : "14px Helvetica"
											}).hide(), this.els[7] = e
									.shape(this._drawTipTxt).attr({
												x : 0,
												y : 33
											}).hide(), this.els[8] = e
									.shape(this._drawTipTxt2).attr({
												x : 0,
												y : 33
											}).hide());
					var o = this.coord.dx(t);
					if (o >= 0 && this._data && this._data.data[o]) {
						var u = this._data.data[o], a = this.coord.cy(n), f = Number.MAX_VALUE, l = 0;
						for (var c = 1; c < 5; c++)
							Math.abs(u[c] - a) < Math.abs(f - a)
									&& (f = u[c], l = c);
						n = this.coord.y2(f), t = this.coord.x2(o), this.paper
								.set(this.el).hide(), this.els[0].attr("y", n)
								.show(), this.els[1].attr("x", t).show(), this.els[2]
								.attr({
											x : t,
											y : n
										}).show();
						var h = {
							yprice : o == 0
									? this._data.yprice
									: this._data.data[o - 1][2],
							data : u,
							pos : l - 1
						};
						this.els[3].attr("data", h).animate({
							x : o > this._data.data.length / 2 ? s.x - 2 : s.x
									+ s.w - 154
						}, 50, "linear").toFront().show(), this.els[4].attr({
									y : n,
									text : u[l]
								}).show();
						var p = u[0];
						return p = p.substr(0, 4) + "/" + p.substr(4, 2) + "/"
								+ p.substr(6, 2), this.els[6].attr({
									x : t,
									text : p
								}).show(), this.els[7].attr("data", h).show(), !0
					}
				},
				out : function() {
					this.paper.set(this.el).show(), this.paper.set(this.els)
							.hide()
				},
				clear : function() {
					this.loader && this.loader.cancel(), this.loader = null
				}
			})
		}), define("g/chart/line/line", ["require", "exports", "module"],
		function(e, t, n) {
			return function(e, t, n, r) {
				var i = !0, s = [], o, u;
				console.log(e, t, n, r);
				for (var a = 0, f = t.length; a < f; a++) {
					o = n.x2(a);
					if (r.zero || t[a])
						u = n.y2(t[a]), s
								.push([i ? "moveTo" : "lineTo", [o, u]]), i = !1
				}
				var l = e.path(s);
				return "stroke-width" in r
						&& l.attr("stroke-width", r["stroke-width"]), "stroke" in r
						&& l.attr("stroke", r.stroke), l
			}
		}), define("widgets/cn/mod-quotchart/scripts/mobile-ma", ["require",
				"exports", "module", "zepto", "g/chart/base", "g/util/tool",
				"g/chart/coordinate", "g/chart/line/line"], function(e, t, n) {
			function l(e) {
				return Math.LOG10E * Math.log(e)
			}
			var r = e("zepto"), i = e("g/chart/base"), s = e("g/util/tool"), o = e("g/chart/coordinate"), u = e("g/chart/line/line"), a = s.object_extend, f = s.array_find;
			return i.addSubChart("MA", {
				init : function(e, t, n, i) {
					var s = this;
					this.ma = e, this.matype = n, this.devicePixelRatio = window.devicePixelRatio, this.width = r(window)
							.width(), this.height = this.width / 2;
					if (this.devicePixelRatio >= 2) {
						var u = 30;
						this.devicePixelRatio = 2
					} else if (this.devicePixelRatio == 1.5)
						var u = 50;
					else if (this.devicePixelRatio == 1.3)
						var u = 50;
					else
						var u = 65;
					i = this.config = a(i, {
								x : u * this.devicePixelRatio,
								y : 20,
								w : this.width * this.devicePixelRatio - u
										* this.devicePixelRatio * 2,
								h : this.devicePixelRatio == 1 ? this.height
										- this.height / 3.78 - 30 : this.height
										* this.devicePixelRatio - this.height
										* this.devicePixelRatio / 3.78 - 20
										* this.devicePixelRatio,
								offset : 20 * this.devicePixelRatio,
								labelOffset : 20,
								centerX : !1
							}), this.coord = i.coord
							|| new o(i.x, i.y, i.w, i.h, {
										offsetY : i.offset,
										centerX : i.centerX
									}), this.config.stroke = t, this.type = "daily", this.date = [], setTimeout(
							function() {
								s.parent.paper.draw(!0)
							}, 1e3)
				},
				run : function(e) {
					switch (e.t) {
						case "fq" :
							this.fq = e.d, this._isShow && this.parent.draw();
							break;
						case "type" :
							this.type = e.d, this._isShow && this.parent.draw();
							break;
						case "date" :
							this.date = e.d, this.coord.init(), this._isShow
									&& this.parent.draw()
					}
				},
				draw : function() {
					var e = this, t = e.config;
					e.matype == "left" && !e.el ? e.el = e.parent.foreLayer
							.text(t.x, t.y + t.labelOffset, "MA" + e.ma).attr({
										fill : e.config.stroke,
										align : "start",
										valign : "bottom"
									}) : e.matype == "middle" && !e.el
							? e.el = e.parent.foreLayer.text(t.x + t.w / 2,
									t.y + t.labelOffset, "MA" + e.ma).attr({
										fill : e.config.stroke,
										align : "center",
										valign : "bottom"
									})
							: e.matype == "right"
									&& !e.el
									&& (e.el = e.parent.foreLayer.text(
											t.x + t.w, t.y + t.labelOffset,
											"MA" + e.ma).attr({
												fill : e.config.stroke,
												align : "end",
												valign : "bottom"
											})), e.el
							.attach(e.parent.foreLayer), this.loader
							&& this.loader.cancel();
					var n = [], r;
					this.loader = e.data.getMA(e.type, e.date[0], e.date[1],
							e.ma, t.datatype, e.fq).progress(function(i) {
						e.paper.set(n).remove();
						if (e.config.limit)
							for (var s = i.length; s < e.config.limit; s++)
								i.push(0);
						var o = [];
						for (var s = 0; s < i.length; s++)
							i[s] != 0 && o.push(i[s]);
						var a = Math.max.apply(Math, i), f = Math.min.apply(
								Math, o);
						e.coord.axis([0, i.length - 1], [f, a]), e._data = i, e.paper
								.set(n).remove(), r && r(), r = e.coord.draw(
								function() {
									n[0] && e.paper.set(n[0]).remove(), n[0] = u(
											e.paper, i, e.coord, t)
								}), e._isOver && e.over()
					})
				},
				over : function(e, t, n) {
					if (!this.els) {
						if (!this.el)
							return;
						this.els = [], this.els[0] = e.text(this.el.attr("x"),
								this.el.attr("y"),
								this.el.attr("text") + "\u010f\u017a\u009a")
								.attr({
											fill : this.el.attr("fill"),
											align : this.el.attr("align"),
											valign : this.el.attr("valign")
										}).hide()
					}
					var r = this.coord.dx(t);
					if (r >= 0 && this._data && this._data[r]) {
						var i = this._data[r];
						return this.config.datatype != "volume"
								? i = parseFloat(i)
										.toFixed(this.data.precision)
								: i = s.getLongNum(i).toString(), this.els[0]
								.attr("text", "MA" + this.ma + "\uff1a" + i)
								.show(), this.el.hide(), !0
					}
				},
				out : function() {
					this.el && this.el.show();
					if (this.els)
						for (var e = 0; e < this.els.length; e++)
							this.els[e].hide()
				},
				clear : function() {
					this.loader && this.loader.cancel(), this.loader = null, this.el
							&& this.el.remove()
				}
			})
		}), define("g/chart/line/histogram", ["require", "exports", "module"],
		function(e, t, n) {
			return function(e, t, n, i) {
				var s = i.color, o = [[], []], u = n.stepX / 3;
				i.maxWidth && u > i.maxWidth / 2 && (u = i.maxWidth / 2);
				var a = n.x + n.w, f, l;
				for (var c = 0, p = t.length; c < p; c++) {
					f = n.x2(c), l = n.y2(t[c]);
					if (t[c]) {
						s ? h = n.y2(n.minY) - l : h = n.y2(0) - l;
						var d = f - u;
						r = f + u, d < n.x && (d = n.x), r > a && (r = a), o[(s
								? s[c]
								: t[c]) < 0 ? 1 : 0].push(
								["moveTo", [d, l + h]], ["lineTo", [d, l]], [
										"lineTo", [r, l]], ["lineTo",
										[r, l + h]], ["lineTo", [d, l + h]])
					}
				}
				return [e.path(o[0]).attr({
									fill : "#ea6f67",
									stroke : null
								}), e.path(o[1]).attr({
									fill : "#47b941",
									stroke : null
								})]
			}
		}), define("widgets/cn/mod-quotchart/scripts/mobile-minute-volume", [
				"require", "exports", "module", "zepto", "g/chart/base",
				"g/util/tool", "g/chart/coordinate", "g/chart/line/histogram"],
		function(e, t, n) {
			var r = e("zepto"), i = e("g/chart/base"), s = e("g/util/tool"), o = e("g/chart/coordinate"), u = e("g/chart/line/histogram"), a = s.object_extend, f = s.array_find;
			return i.addSubChart("minute-volume", {
				init : function(e) {
					this.devicePixelRatio = window.devicePixelRatio, this.width = r(window)
							.width(), this.height = this.width / 2;
					if (this.devicePixelRatio >= 2) {
						var t = 30;
						this.devicePixelRatio = 2
					} else if (this.devicePixelRatio == 1.5)
						var t = 50;
					else if (this.devicePixelRatio == 1.3)
						var t = 50;
					else
						var t = 65;
					this.config = a(e, {
								x : t * this.devicePixelRatio,
								y : this.devicePixelRatio == 1 ? this.height
										- this.height / 3.78 + 10 : this.height
										* this.devicePixelRatio - this.height
										* this.devicePixelRatio / 4,
								w : this.width * this.devicePixelRatio - t
										* this.devicePixelRatio * 2,
								h : this.devicePixelRatio == 1 ? this.height
										/ 3.78 - 20 : this.height
										* this.devicePixelRatio / 3.78 - 5
										* this.devicePixelRatio,
								offset : 20 * this.devicePixelRatio
							}), this.coord = new o(this.config.x,
							this.config.y, this.config.w, this.config.h, {
								offsetY : 0
							})
				},
				bg : function(e) {
					var t = this.config, n = [104, 217];
					e.shape(function(e, t) {
						var n = t.x, r = t.y, i = t.width, s = t.height;
						e.moveTo(n, r), e.lineTo(n, r + s), e.lineTo(n + i, r
										+ s), e.lineTo(n + i, r), e.strokeStyle = "#cacaca", e
								.stroke(), e.lineTo(n, r), e.fillStyle = "#ffffff", e
								.fill()
					}).attr({
								x : this.config.x - 1,
								y : this.config.y - 1,
								width : this.config.w + 2,
								height : this.config.h + 2
							}), this.coord.grid(e, 2)
				},
				draw5day : function() {
					var e = this, t = this.config;
					this.points = null, this.loader && this.loader.cancel();
					var n, r = [], o = 5, a = [];
					this.loader = e.data.getMin5Data().progress(function(n) {
						e.paper.set(a).remove();
						var f = n.length, l, c, h = [];
						for (l = 0; l < f; l++)
							h[l] = Math.max.apply(null, n[l].volume);
						t.max = Math.max.apply(null, h);
						var p = [], d = [], v;
						for (l = 0; l < f; l++) {
							p.push.apply(p, n[l].volume);
							for (c = 0; c < n[l].price.length; c++)
								c && n[l].price[c] < n[l].price[c - 1] ? d
										.push(-1) : d.push(1);
							l == f - 1
									&& (v = p.length, c < i.CONSTANT[e.parent.market
											+ "-minutes-length"]
											&& (v += i.CONSTANT[e.parent.market
													+ "-minutes-length"]
													- c)), r[l] = r[l] || {
								x : t.x + l * t.w / o,
								y : t.y,
								w : t.w / o,
								h : t.h,
								offset : 5
							}, isFinite(t.max) || (t.max = 0), r[l].max = t.max
						}
						t.length = v, e.coord.init(), e.coord.axis([
										0,
										5
												* i.CONSTANT[e.parent.market
														+ "-minutes-length"]
												- 1], [0, t.max]), t.color = p.color = d, a[a.length] = u(
								e.paper, p, e.coord, t), e._data = p;
						var m = e.parent.market == "sh"
								|| e.parent.market == "sz"
								? "\u624b"
								: "\u80a1", g = t.max, y = s.getLongNum(g);
						m = y[1] + m;
						if (e.coord.maxY <= e.coord.minY + 1e-4) {
							var b = 0;
							a[a.length] = e.coord.label(e.paper, {
										type : "left",
										num : 2,
										fix : function(e) {
											return b++ ? m : 0
										}
									})
						} else
							a[a.length] = e.coord.label(e.paper, {
										type : "left",
										num : 3,
										offset : -5,
										font : "12px Helvetica",
										fill : "#a59e9e",
										fix : function(e) {
											return e < 0 ? m : Math.round(e
													/ y.e)
										}
									});
						e._isOver = !0, e.over(e.parent.foreLayer, 99999, 100)
					})
				},
				draw : function() {
					if (this.config.type == "5day")
						return this.draw5day();
					var e = this, t = this.config;
					this.points = null, this.loader && this.loader.cancel(), this.loader = e.data
							.getMinData();
					var n = [];
					this.loader.progress(function(r) {
						e.paper.set(n).remove();
						var o = [], a = [], f;
						if (r && r.price) {
							o = r.volume.slice(0);
							for (f = 0; f < r.price.length; f++)
								f && r.price[f] < r.price[f - 1]
										? a.push(-1)
										: a.push(1)
						}
						t.max = Math.max.apply(null, r.volume), isFinite(t.max)
								|| (t.max = 0), e.coord.init(), e.coord.axis([
										0,
										i.CONSTANT[e.parent.market
												+ "-minutes-length"]
												- 1], [0, t.max]), t.color = o.color = a, e._data = o, n[n.length] = u(
								e.paper, o, e.coord, t);
						var l = e.parent.market == "sh"
								|| e.parent.market == "sz"
								? "\u624b"
								: "\u80a1", c = t.max, h = s.getLongNum(c);
						l = h[1] + l;
						if (e.coord.maxY <= e.coord.minY + 1e-4) {
							var p = 0;
							n[n.length] = e.coord.label(e.paper, {
										x : 0,
										type : "left",
										num : 2,
										fix : function(e) {
											return p++ ? l : 0
										}
									})
						} else
							n[n.length] = e.coord.label(e.paper, {
										x : 100,
										type : "left",
										num : 3,
										offset : -5,
										font : "12px Helvetica",
										fill : "#a59e9e",
										fix : function(e) {
											return e < 0 ? l : Math.round(e
													/ h.e)
										}
									});
						e._isOver = !0, e.over(e.parent.foreLayer, 99999, 100)
					})
				},
				over : function(e, t, n) {
					var r = this, s = this.config;
					t *= this.devicePixelRatio, n *= this.devicePixelRatio, this.els
							|| (this.els = [], this.els[1] = this.paper.rect()
									.hide(), this.els[0] = this.paper
									.shape(i.drawShape.line).attr({
												x : 0,
												y : s.y,
												length : s.h,
												type : "y"
											}).hide());
					var o = this.coord.dx(t);
					if (this._data != undefined) {
						var u = this._data.length;
						o >= u && (o = u - 1)
					}
					if (this._data) {
						t = this.coord.x2(o), n = this.coord.y2(this._data[o]), this.els[0]
								.attach(this.paper).attr("x", t).show();
						var a = this.coord.stepX / 3, f = 1;
						this.config.maxWidth && a > this.config.maxWidth / 2
								&& (a = this.config.maxWidth / 2);
						var l = this._data.color[o] < 0 ? "#47b941" : "#ea6f67";
						return this.els[1].attr({
									x : t - a - f,
									y : n - f,
									width : 2 * a + 2 * f,
									height : this.coord.y2(0) - n + 2 * f,
									fill : l,
									stroke : l
								}).attach(this.paper).show(), !0
					}
				},
				out : function() {
					this.paper.set(this.els).hide()
				},
				clear : function() {
					this.loader && this.loader.cancel()
				}
			})
		}), define("widgets/cn/mod-quotchart/scripts/mobile-kline-volume", [
				"require", "exports", "module", "zepto", "g/chart/base",
				"g/util/tool", "g/chart/coordinate", "g/chart/line/histogram"],
		function(e, t, n) {
			var r = e("zepto"), i = e("g/chart/base"), s = e("g/util/tool"), o = e("g/chart/coordinate"), u = e("g/chart/line/histogram"), a = s.object_extend, f = s.array_find;
			return i.addSubChart("volume", {
				init : function(e) {
					this.devicePixelRatio = window.devicePixelRatio, this.width = r(window)
							.width(), this.height = this.width / 2;
					if (this.devicePixelRatio >= 2) {
						var t = 30;
						this.devicePixelRatio = 2
					} else if (this.devicePixelRatio == 1.5)
						var t = 50;
					else if (this.devicePixelRatio == 1.3)
						var t = 50;
					else
						var t = 65;
					if (this.devicePixelRatio == 1)
						var n = this.height / 3.78 - 20;
					else if (this.devicePixelRatio == 1.5)
						var n = this.height * this.devicePixelRatio / 3.78 - 5
								* this.devicePixelRatio - 5;
					else
						var n = this.height * this.devicePixelRatio / 3.78 - 5
								* this.devicePixelRatio;
					this.config = a(e, {
								x : t * this.devicePixelRatio,
								y : this.devicePixelRatio == 1 ? this.height
										- this.height / 3.78 + 10 : this.height
										* this.devicePixelRatio - this.height
										* this.devicePixelRatio / 4,
								w : this.width * this.devicePixelRatio - t
										* this.devicePixelRatio * 2,
								h : n,
								offset : 20 * this.devicePixelRatio
							}), this.coord = new o(this.config.x,
							this.config.y, this.config.w, this.config.h, {
								offsetY : 1,
								centerX : !0
							}), this.date = [], this.type = "daily"
				},
				bg : function(e) {
					var t = this.config;
					e.rect(t.x, t.y, t.w, t.h).attr({
								stroke : "#cacaca",
								fill : "#ffffff"
							});
					for (var n = 1; n < 2; n++) {
						var r = t.y + t.offset + n * (t.h - 2 * t.offset) / 2;
						e.line(t.x, r, t.x + t.w, r).attr({
									stroke : "#cacaca"
								})
					}
				},
				run : function(e) {
					switch (e.t) {
						case "type" :
							this.type = e.d, this._isShow && this.parent.draw();
							break;
						case "date" :
							this.date = e.d, this._isShow && this.parent.draw()
					}
				},
				draw : function() {
					var e = this, t = this.config;
					this.points = null, this.loader && this.loader.cancel();
					var n = [];
					this.loader = this.data.getVolume(e.type, e.date[0],
							e.date[1]).progress(function(r) {
						e.paper.set(n).remove();
						var i = [], o = [];
						for (var a = 0; a < r.length; a++)
							i.push(r[a][5]), o.push(r[a][2] - r[a][1]);
						if (t.limit)
							for (; a < t.limit; a++)
								i.push(0), o.push(0);
						t.max = Math.max.apply(null, i), isFinite(t.max)
								|| (t.max = 0), e.coord.init(), e.coord.axis([
										0, i.length - 1], [0, t.max]), t.color = i.color = o, n[n.length] = u(
								e.paper, i, e.coord, t), e._data = i;
						var f = e.parent.market == "sh"
								|| e.parent.market == "sz"
								? "\u624b"
								: "\u80a1", l = t.max, c = s.getLongNum(l);
						f = c[1] + f, n[n.length] = e.coord.label(e.paper, {
									type : "left",
									num : 3,
									offset : -5,
									font : "12px Helvetica",
									fill : "#a59e9e",
									fix : function(e) {
										return e < 0 ? f : Math.round(e / c.e)
									}
								}), e._isOver = !0, e.over(e.parent.foreLayer,
								99999, 100)
					})
				},
				over : function(e, t, n) {
					var r = this.config;
					t *= this.devicePixelRatio, n *= this.devicePixelRatio, this.els
							|| (this.els = [], this.els[1] = e.rect().hide(), this.els[0] = e
									.shape(i.drawShape.line).attr({
												x : 0,
												y : r.y,
												length : r.h,
												type : "y"
											}).hide());
					var s = this.coord.dx(t);
					if (this._data && this._data[s]) {
						t = this.coord.x2(s), n = this.coord.y2(this._data[s]), this.els[0]
								.attr("x", t).show();
						var o = this.coord.stepX / 3, u = 1;
						this.config.maxWidth && o > this.config.maxWidth / 2
								&& (o = this.config.maxWidth / 2);
						var a = this._data.color[s] < 0 ? "#47b941" : "#ea6f67";
						return this.els[1].attr({
									x : t - o - u,
									y : n - u,
									width : 2 * o + 2 * u,
									height : this.coord.y2(0) - n + 2 * u,
									fill : a,
									stroke : a
								}).show(), !0
					}
				},
				out : function() {
					this.paper.set(this.els).hide()
				},
				clear : function() {
					this.loader && this.loader.cancel(), this.loader = null
				}
			})
		}), define("widgets/cn/mod-quotchart/scripts/mod-invest-data", [
				"require", "exports", "module", "zepto", "g/util/tool"],
		function(e, t, n) {
			var r = e("zepto"), i = e("g/util/tool"), s = i.load;
			n.exports = {
				load : function(e, t) {
					s(		"http://ifzq.gtimg.cn/portable/mobile/CnZl/tzts?code="
									+ e + "&_var=invest", function() {
								t(window.invest.data)
							})
				}
			}
		}), define("text!widgets/cn/mod-quotchart/css/style.css", [],
		function() {
			return '#mod-quotchart{width:100%;background-color:#f8f6f3;margin-bottom:15px}#mod-quotchart #tabs-bg{position:relative;border:1px solid #b1aeab;border-width:1px 0;height:34px;background-color:#dedbd7;color:#88827e;font-family:sans-serif;-webkit-box-shadow:0 -10px 10px -10px rgba(0,0,0,.2) inset;box-shadow:0 -10px 10px -10px rgba(0,0,0,.2) inset}#mod-quotchart #tabs-cur{position:absolute;top:35px;left:16%}#mod-quotchart #tabs-cur::after,#mod-quotchart #tabs-cur::before{position:absolute;content:"";height:0;width:0;pointer-events:none;border:solid transparent}#mod-quotchart #tabs-cur::after{border-color:rgba(194,225,245,0);border-bottom-color:#f8f6f3;border-width:5px}#mod-quotchart #tabs-cur::before{border-bottom-color:#b1aeab;border-width:6px;margin-left:-1px}#mod-quotchart #tabs-cur::before,#mod-quotchart #tabs-cur::after{bottom:-6%}#mod-quotchart .row-space{width:10%}#mod-quotchart #tabs{width:80%;margin:0 auto}#mod-quotchart #tabs .tabs-child:first-child{border-left:0}#mod-quotchart #tabs .tabs-child:last-child{border-right:0}#mod-quotchart #tabs .tabs-child{-webkit-box-flex:1;-moz-box-flex:1;-o-box-flex:1;box-flex:1;width:20%;height:15px;line-height:15px;text-align:center;border-left:1px dotted gray;margin-top:12px;font-size:15px}#mod-quotchart #chart-box{height:36px;overflow:hidden}#mod-quotchart #chart-data{width:95%;height:17px;line-height:17px;border-radius:20px;border:1px solid #dcd9d6;margin:8px auto;background-color:#eeece8;font-family:sans-serif;color:#5a5654}#mod-quotchart #chart-data div{-webkit-box-flex:1;-moz-box-flex:1;-o-box-flex:1;box-flex:1;width:33.333333333333333%;text-align:center}#mod-quotchart #chart-data div.i1{width:33.333333333333333%}#mod-quotchart #chart-data div.i2{width:50%}#mod-quotchart #chart-data div.i3{width:25%}#mod-quotchart #chart{width:100%;font-family:Helvetica}#mod-quotchart #mark{width:77%;height:25px;text-align:left;text-indent:10px;margin:5px auto;border-width:1px;border-style:solid;border-top-color:#c9c7c3;border-left-color:#e5e3de;border-right-color:#e5e3de;border-bottom-color:#fff;background-color:#f3f1ec;color:#3b3939;overflow:hidden}#mod-quotchart #marqueeBox li{margin:7px 0;height:12px;overflow:hidden}'
		}), define("text!widgets/cn/mod-quotchart/tpl.html", [], function() {
	return '<div id="tabs-bg">\r\n	<div class="row-space row-box"></div>\r\n	<div id="tabs" class="row-box">\r\n		<div class="tabs-child" rel="1" style="color: #363331;">\u5206\u65f6</div>\r\n		<div class="tabs-child" rel="2">5\u65e5</div>\r\n		<div class="tabs-child" rel="3">\u65e5K</div>\r\n		<div class="tabs-child" rel="4">\u5468K</div>\r\n		<div class="tabs-child" rel="5">\u6708K</div>\r\n	</div>\r\n	<div class="row-space row-box"></div>\r\n	<div id="tabs-cur"></div>\r\n</div>\r\n<div id="chart-box">\r\n	<div class="row-space row-box"></div>\r\n	<div id="chart-data" class="row-box">\r\n		<div id="d-price"></div>\r\n		<!-- <div id="d-ZDF"></div> -->\r\n		<div id="d-avg"></div>\r\n		<div id="d-CJL"></div>\r\n	</div>\r\n	<div class="row-space row-box"></div>\r\n</div>\r\n<div id="chart" class="row-box row-center"></div>\r\n<div id="mark" class="row-box">\r\n	<!-- <div>\u6295\u8d44\u63d0\u793a\uff1a</div> -->\r\n	\r\n</div>'
}), define("widgets/cn/mod-quotchart/scripts/mod", ["require", "exports",
				"module", "zepto", "view", "plugin/zepto/zepto.marquee",
				"plugin/zepto/zepto.tap", "g/chart/base", "./mobile-minute",
				"./mobile-5day", "./mobile-kline", "./mobile-ma",
				"./mobile-minute-volume", "./mobile-kline-volume",
				"g/util/tool", "./mod-invest-data", "template",
				"text!../css/style.css", "text!../tpl.html"],
		function(e, t, n) {
			var r = e("zepto"), i = e("view");
			e("plugin/zepto/zepto.marquee"), e("plugin/zepto/zepto.tap");
			var s = e("g/chart/base"), o = e("./mobile-minute"), u = e("./mobile-5day"), a = e("./mobile-kline"), f = e("./mobile-ma"), l = e("./mobile-minute-volume"), c = e("./mobile-kline-volume"), h = e("g/util/tool"), p = h.date_shift, d = e("./mod-invest-data"), v = e("template"), m = 1;
			return i.extend({
				style : e("text!../css/style.css"),
				html : e("text!../tpl.html"),
				afterRender : function() {
					var e = this;
					d.load(app.symbol.substr(2), function(t) {
						r("#" + e.wrapper).html(e.html);
						var n = [];
						for (var i in t)
							n.push(t[i].MEMORD2);
						var s = app.symbol.substr(0, 2);
						(s == "sh" && app.symbol.substr(2, 3) == "000" || s == "sz"
								&& app.symbol.substr(2, 3) == "399")
								&& r("#mark").hide(), t.length > 1
								&& r("#mark").marquee(n), r(window).on(
								"mod-invest:reload", function() {
									r("#mark").marquee(n)
								}), r(window).on("mod-invest:clear",
								function() {
									r("#mark").marquee.clear()
								}), e.createChart(), r(".tabs-child").click(
								function(t) {
									e._tapFn.apply(e, arguments)
								}), r(window).on("mod-chart:reload",
								r.proxy(e.reload, e))
					})
				},
				reload : function() {
					var e = this;
					this.removeChart(), r("#mark").marquee.clear();
					var e = this, t = arguments;
					d.load(app.symbol.substr(2), function(n) {
						t.length == 3 ? e.createChart() : e.createChart(1), r(".tabs-child")
								.click(function(t) {
											e._tapFn.apply(e, arguments)
										})
					})
				},
				createChart : function() {
					this.chart = new s("chart", app.symbol, {
								bgColor : "#f8f6f3",
								defalutCnt : 50
							}), this.sceneCol = ["minute", "minute-5day",
							"minute-5day"], this._dom = r("#chart-data"), this.date = new Date, this.today = this.date
							.getFullYear()
							* 1e4
							+ (this.date.getMonth() + 1)
							* 100
							+ this.date.getDate();
					var e = s.CONSTANT["kline-limit"];
					this.chart.addSubChart("minute", o, {
								name : this.gname
							}), this.chart.addSubChart("minute", l), this.chart
							.addSubChart("minute-5day", u, {
										name : this.gname
									}), this.chart.addSubChart("minute-5day",
							l, {
								type : "5day"
							});
					var t = this.chart.addSubChart("kline2", a);
					this.chart.addSubChart("kline2", c, {
								limit : e
							}), this.chart.addSubChart("kline2", f, 5,
							"#335fe6", "left", {
								offset : 30,
								datatype : "close",
								labelOffset : 15,
								coord : t.coord
							}), this.chart.addSubChart("kline2", f, 10,
							"#ff6000", "middle", {
								offset : 30,
								datatype : "close",
								labelOffset : 15,
								coord : t.coord
							}), this.chart.addSubChart("kline2", f, 20,
							"#ee6ac5", "right", {
								offset : 30,
								datatype : "close",
								labelOffset : 15,
								coord : t.coord
							}), arguments.length == 1 ? this.setScene.call(
							this, m) : this.chart.setScene("minute")
				},
				removeChart : function() {
					this.chart.clear(), r(".tabs-child").off(""), r("#chart")
							.html("")
				},
				setScene : function(e) {
					r("#tabs-cur").animate({
								left : 16 * e + "%"
							}, 200, "ease-out-in"), e == 1
							? (r(".tabs-child").css("color", "#88827e"), r(".tabs-child")
									.eq(0).css("color", "#363331"), this.chart
									.setScene(), this.chart.setScene("minute"), this._dom
									.attr("class", "row-box i1"), this._dom
									.html('<div id="d-price"></div><div id="d-CJL"></div><div id="d-avg"></div>'))
							: e == 2
									? (r(".tabs-child").css("color", "#88827e"), r(".tabs-child")
											.eq(1).css("color", "#363331"), this.chart
											.setScene(), this.chart
											.setScene("minute-5day"), this._dom
											.attr("class", "row-box i2"), this._dom
											.html('<div id="d2-price"></div><div id="d2-CJL"></div>'))
									: e == 3
											? (r(".tabs-child").css("color",
													"#88827e"), r(".tabs-child")
													.eq(2).css("color",
															"#363331"), this.chart
													.setScene(), this.chart
													.setScene("kline2")
													.execute("kline2", "*", [{
																t : "type",
																d : "daily"
															}, {
																t : "style",
																d : "Candlestick"
															}, {
																t : "date",
																d : []
															}]), this._dom
													.attr("class", "row-box i3"), this._dom
													.html('<div id="d3-price-1"></div><div id="d3-price-2"></div><div id="d3-price-3"></div><div id="d3-price-4"></div>'))
											: e == 4
													? (r(".tabs-child").css(
															"color", "#88827e"), r(".tabs-child")
															.eq(3).css("color",
																	"#363331"), this.chart
															.setScene(), this.chart
															.setScene("kline2")
															.execute("kline2",
																	"*", [{
																		t : "type",
																		d : "weekly"
																	}, {
																		t : "style",
																		d : "Candlestick"
																	}, {
																		t : "date",
																		d : []
																	}]), this._dom
															.attr("class",
																	"row-box i3"), this._dom
															.html('<div id="d3-price-1"></div><div id="d3-price-2"></div><div id="d3-price-3"></div><div id="d3-price-4"></div>'))
													: (r(".tabs-child").css(
															"color", "#88827e"), r(".tabs-child")
															.eq(4).css("color",
																	"#363331"), this.chart
															.setScene("kline2")
															.execute("kline2",
																	"*", [{
																		t : "type",
																		d : "monthly"
																	}, {
																		t : "style",
																		d : "Candlestick"
																	}, {
																		t : "date",
																		d : []
																	}]), this._dom
															.attr("class",
																	"row-box i3"), this._dom
															.html('<div id="d3-price-1"></div><div id="d3-price-2"></div><div id="d3-price-3"></div><div id="d3-price-4"></div>'))
				},
				_tapFn : function(e) {
					m = r(e.currentTarget).attr("rel"), this.setScene.call(
							this, m)
				}
			})
		}), define("text!widgets/cn/mod-hqpanel/css/style.css", [], function() {
	return "#mod-hqpanel{width:100%;background-color:#f8f6f3}#mod-hqpanel .hqpanel-tabs{border-width:1px 0;border-top:1px solid #e7e5e3}#mod-hqpanel .hqpanel-tabs .hqpanel-tabs-btn{width:64px;height:28px;line-height:28px;text-align:center;color:#aaa5a5;font-size:14px;margin:10px}#mod-hqpanel .hqpanel-tabs .hqpanel-tabs-btn.cur2{border-radius:5px;border:1px solid #c1c1c1;background-color:#dedbd7;color:#5a5654}#mod-hqpanel .hqpanel-table{width:100%;display:table;border-top:1px solid #e3e3e3;height:27px}#mod-hqpanel .hqpanel-table .table-column-group{display:table-column-group}#mod-hqpanel .hqpanel-table .table-column{display:table-column}#mod-hqpanel .hqpanel-table .table-column:nth-child(odd){width:28%}#mod-hqpanel .hqpanel-table .table-column:nth-child(even){width:22%}#mod-hqpanel .hqpanel-table .table-row-group{display:table-row-group}#mod-hqpanel .hqpanel-table .table-row{display:table-row;height:27px;line-height:27px}#mod-hqpanel .hqpanel-table .table-cell{display:table-cell;border-top:1px solid #fff;border-bottom:1px solid #e3e3e3}#mod-hqpanel .hqpanel-table .table-cell.th{color:#8f8f8f!important}#mod-hqpanel .hqpanel-table .table-cell.b{color:#222!important}#mod-hqpanel .hqpanel-table .table-cell:nth-child(odd){color:#8f8f8f;text-indent:15px}#mod-hqpanel .hqpanel-table .table-cell:nth-child(even){color:#222}#mod-hqpanel .hqpanel-table .table-row:nth-child(odd){background-color:#f8f6f3}#mod-hqpanel .hqpanel-table .table-row:nth-child(even){background-color:#edece9;border-top:.5px solid #fff}"
}), define("text!widgets/cn/mod-hqpanel/tpl.html", [], function() {
	return '<div class="hqpanel-tabs">\r\n	<div class="row-box row-center">\r\n		<div class="hqpanel-tabs-btn cur2">\u62a5\u4ef7</div>\r\n		<div class="hqpanel-tabs-btn">\u4e94\u6863</div>\r\n		<div class="hqpanel-tabs-btn">\u660e\u7ec6</div>\r\n	</div>\r\n</div>\r\n<div id="hqpanel-con">\r\n	\r\n</div>\r\n'
}), define("text!widgets/cn/mod-hqpanel/tpl-price.html", [], function() {
	return '<div class="hqpanel-table">\r\n	<div class="table-column-group">\r\n		<div class="table-column"></div>\r\n		<div class="table-column"></div>\r\n		<div class="table-column"></div>\r\n		<div class="table-column"></div>\r\n	</div>\r\n	<div class="table-row-group">\r\n		<ul class="table-row">\r\n			<li class="table-cell">\u6628\u6536</li>\r\n			<li class="table-cell"><%= rs[8]%></li>\r\n			<li class="table-cell">\u4eca\u5f00</li>\r\n			<li class="table-cell"><%= rs[9]%></li>\r\n		</ul>\r\n		<ul class="table-row">\r\n			<li class="table-cell">\u6700\u9ad8</li>\r\n			<li class="table-cell"><%= rs[10]%></li>\r\n			<li class="table-cell">\u6700\u4f4e</li>\r\n			<li class="table-cell"><%= rs[11]%></li>\r\n		</ul>\r\n		<ul class="table-row">\r\n			<li class="table-cell">\u6210 \u4ea4 \u91cf</li>\r\n			<% if((rs[1].substr(0,3) == \'000\' && rs[7] == \'1\') || (rs[1].substr(0,3) == \'399\' && rs[7] == \'51\')){ %>\r\n			<% if(rs[12] > 100000000){%>\r\n				<li class="table-cell"><%= (rs[12]/100000000).toFixed(2) %>\u4ebf\u624b</li>\r\n				<% }else{ %>\r\n				<li class="table-cell"><%= (rs[12]/10000).toFixed(2) %>\u4e07\u624b</li>\r\n				<% } %>\r\n			<% }else{ %>\r\n			<li class="table-cell"><%=rs[12] %></li>\r\n			<% } %>\r\n			<li class="table-cell">\u6210 \u4ea4 \u989d</li>\r\n			<% if((rs[1].substr(0,3) == \'000\' && rs[7] == \'1\') || (rs[1].substr(0,3) == \'399\' && rs[7] == \'51\')){ %>\r\n			<li class="table-cell"><%= (rs[13]/10000).toFixed(2) %>\u4ebf</li>\r\n			<% }else{ %>\r\n			<li class="table-cell"><%= rs[13]%>\u4e07</li>\r\n			<% } %>\r\n		</ul>\r\n		<% if((rs[1] == \'000001\') || (rs[1] == \'399001\')){ %>\r\n			<ul class="table-row">\r\n				<li class="table-cell">\u632f \u5e45</li>\r\n				<li class="table-cell"><%= rs[17] == \'0.00%\' || rs[17] == undefined ? \'--\' : rs[17]+"%" %></li>\r\n				<li class="table-cell">\u4e0a \u6da8</li>\r\n				<li class="table-cell"><%= rs[20]%></li>\r\n			</ul>\r\n			<ul class="table-row">\r\n				<li class="table-cell">\u5e73 \u76d8</li>\r\n				<li class="table-cell"><%= rs[21]%></li>\r\n				<li class="table-cell">\u4e0b \u8dcc</li>\r\n				<li class="table-cell"><%= rs[22]%></li>\r\n			</ul>\r\n		<% }else if((rs[1].substr(0,3) == \'000\' && rs[7] == \'1\') || (rs[1].substr(0,3) == \'399\' && rs[7] == \'51\')){ %>\r\n			<ul class="table-row">\r\n				<li class="table-cell">\u632f \u5e45</li>\r\n				<li class="table-cell"><%= rs[17] == \'0.00%\' || rs[17] == undefined ? \'--\' : rs[17]+"%" %></li>\r\n				<li class="table-cell"></li>\r\n				<li class="table-cell"></li>\r\n			</ul>\r\n		<% }else{ %>\r\n			<ul class="table-row">\r\n					<li class="table-cell">\u603b\u5e02\u503c</li>\r\n					<li class="table-cell"><%= (rs[14] == 0.00 || \'\' || rs[14] == undefined) ? \'--\' : rs[14]+"\u4ebf"%></li>\r\n					<li class="table-cell">\u6d41\u901a\u5e02\u503c</li>\r\n					<li class="table-cell"><%= (rs[15] == 0.00 || \'\' || rs[15] == undefined) ? \'--\' : rs[15]+"\u4ebf"%></li>\r\n				</ul>\r\n			<ul class="table-row">\r\n				<li class="table-cell">\u6362\u624b\u7387</li>\r\n				<li class="table-cell"><%= (rs[16] == \'0.00%\' || rs[16] == undefined || rs[16] == \'\') ? \'--\' : rs[16]+\'%\'%></li>\r\n				<li class="table-cell">\u632f \u5e45</li>\r\n				<li class="table-cell"><%= (rs[17] == \'0.00%\' || rs[17] == undefined || rs[17] == \'\') ? \'--\' : rs[17]+"%" %></li>\r\n			</ul>\r\n			<ul class="table-row">\r\n				<li class="table-cell">\u5e02 \u76c8 \u7387</li>\r\n				<li class="table-cell"><%= rs[18] == 0.00 || \'\' ? \'--\' : rs[18]%></li>\r\n				<li class="table-cell">\u5e02 \u51c0 \u7387</li>\r\n				<li class="table-cell"><%= rs[19] == 0.00 || \'\' ? \'--\' : rs[19]%></li>\r\n			</ul>\r\n		<% } %>\r\n	</div>\r\n</div>'
}), define("text!widgets/cn/mod-hqpanel/tpl-5d.html", [], function() {
	return '<div class="hqpanel-table">\r\n	<div class="table-column-group">\r\n		<div class="table-column"></div>\r\n		<div class="table-column"></div>\r\n		<div class="table-column"></div>\r\n		<div class="table-column"></div>\r\n	</div>\r\n	<div class="table-row-group">\r\n		<ul class="table-row">\r\n			<li class="table-cell">\u59d4 \u6bd4</li>\r\n			<% if(rs[30]>0){%>\r\n			<li class="table-cell dataUp">+<%=rs[29]%></li>\r\n			<%}else{%>\r\n			<li class="table-cell dataDown"><%=rs[29]%></li>\r\n			<%}%>\r\n			<li class="table-cell">\u59d4 \u5dee</li>\r\n			<% if(rs[30]>0){%>\r\n			<li class="table-cell dataUp"><%=rs[30]%></li>\r\n			<%}else{%>\r\n			<li class="table-cell dataDown"><%=rs[30]%></li>\r\n			<%}%>\r\n		</ul>\r\n	</div>\r\n</div>\r\n<div class="hqpanel-table">\r\n	<div class="table-column-group">\r\n		<div class="table-column"></div>\r\n		<div class="table-column"></div>\r\n		<div class="table-column"></div>\r\n	</div>\r\n	<div class="table-row-group">\r\n		<ul class="table-row">\r\n			<li class="table-cell">\u5356\u4e94(\u5143/\u624b)</li>\r\n			<li class="table-cell"><%=rs[7]%></li>\r\n			<li class="table-cell"><%=rs[8]%></li>\r\n		</ul>\r\n		<ul class="table-row">	\r\n			<li class="table-cell">\u5356\u56db(\u5143/\u624b)</li>\r\n			<li class="table-cell"><%=rs[9]%></li>\r\n			<li class="table-cell"><%=rs[10]%></li>\r\n		</ul>\r\n		<ul class="table-row">\r\n			<li class="table-cell">\u5356\u4e09(\u5143/\u624b)</li>\r\n			<li class="table-cell"><%=rs[11]%></li>\r\n			<li class="table-cell"><%=rs[12]%></li>\r\n		</ul>\r\n		<ul class="table-row">\r\n			<li class="table-cell">\u5356\u4e8c(\u5143/\u624b)</li>\r\n			<li class="table-cell"><%=rs[13]%></li>\r\n			<li class="table-cell"><%=rs[14]%></li>\r\n		</ul>\r\n		<ul class="table-row">\r\n			<li class="table-cell">\u5356\u4e00(\u5143/\u624b)</li>\r\n			<li class="table-cell"><%=rs[15]%></li>\r\n			<li class="table-cell"><%=rs[16]%></li>\r\n		</ul>\r\n		<ul class="table-row">\r\n			<li class="table-cell">\u5f53 \u524d \u4ef7(\u5143)</li>\r\n			<li class="table-cell"></li>\r\n			<% if(rs[5]>0){%>\r\n			<li class="table-cell dataUp"><%=rs[2]%></li>\r\n			<%}else{%>\r\n			<li class="table-cell dataDown"><%=rs[2]%></li>\r\n			<%}%>\r\n		</ul>\r\n		<ul class="table-row">\r\n			<li class="table-cell">\u4e70\u4e94(\u5143/\u624b)</li>\r\n			<li class="table-cell"><%=rs[17]%></li>\r\n			<li class="table-cell"><%=rs[18]%></li>\r\n		</ul>\r\n		<ul class="table-row">\r\n			<li class="table-cell">\u4e70\u56db(\u5143/\u624b)</li>\r\n			<li class="table-cell"><%=rs[19]%></li>\r\n			<li class="table-cell"><%=rs[20]%></li>\r\n		</ul>\r\n		<ul class="table-row">\r\n			<li class="table-cell">\u4e70\u4e09(\u5143/\u624b)</li>\r\n			<li class="table-cell"><%=rs[21]%></li>\r\n			<li class="table-cell"><%=rs[22]%></li>\r\n		</ul>\r\n		<ul class="table-row">\r\n			<li class="table-cell">\u4e70\u4e8c(\u5143/\u624b)</li>\r\n			<li class="table-cell"><%=rs[23]%></li>\r\n			<li class="table-cell"><%=rs[24]%></li>\r\n		</ul>\r\n		<ul class="table-row">\r\n			<li class="table-cell">\u4e70\u4e00(\u5143/\u624b)</li>\r\n			<li class="table-cell"><%=rs[25]%></li>\r\n			<li class="table-cell"><%=rs[26]%></li>\r\n		</ul>\r\n	</div>\r\n</div>\r\n<div class="hqpanel-table">\r\n	<div class="table-column-group">\r\n		<div class="table-column"></div>\r\n		<div class="table-column"></div>\r\n		<div class="table-column"></div>\r\n		<div class="table-column"></div>\r\n	</div>\r\n	<div class="table-row-group">\r\n		<ul class="table-row">\r\n			<li class="table-cell">\u5916 \u76d8</li>\r\n			<li class="table-cell dataUp"><%=rs[27]%></li>\r\n			<li class="table-cell">\u5185 \u76d8</li>\r\n			<li class="table-cell dataDown"><%=rs[28]%></li>\r\n		</ul>\r\n	</div>\r\n</div>\r\n'
}), define("text!widgets/cn/mod-hqpanel/tpl-mx.html", [], function() {
	return '<div class="hqpanel-table" style="text-align: center;">\r\n	<div class="table-column-group">\r\n		<div class="table-column"></div>\r\n		<div class="table-column"></div>\r\n		<div class="table-column"></div>\r\n		<div class="table-column"></div>\r\n	</div>\r\n	<div class="table-row-group">\r\n		<% if(rs[0][0] == \'\' || rs[0][0] == undefined){ %>\r\n			<div style="padding:30px 0; border-bottom:1px solid #d6d5d2; font-size: 14px; color:#aaa5a5;">\u6682\u65e0\u6570\u636e</div>\r\n		<% }else{ %>\r\n			<ul class="table-row">\r\n				<li class="table-cell th">\u65f6\u95f4</li>\r\n				<li class="table-cell th">\u6210\u4ea4\u4ef7(\u5143)</li>\r\n				<li class="table-cell th">\u6210\u4ea4\u91cf</li>\r\n				<li class="table-cell th">\u6027\u8d28</li>\r\n			</ul>\r\n			<% for(var key in rs){ %>\r\n			<ul class="table-row">\r\n				<li class="table-cell"><%= rs[key][0]%></li>\r\n				<li class="table-cell"><%= rs[key][1]%></li>\r\n				<li class="table-cell b"><%= rs[key][2]%></li>\r\n				<% if(rs[key][3] == \'B\'){ %>\r\n				<li class="table-cell dataUp">\u4e70\u76d8</li>\r\n				<% } else if(rs[key][3] == \'S\'){ %>\r\n				<li class="table-cell dataDown">\u5356\u76d8</li>\r\n				<% } else if(rs[key][3] == \'M\'){ %>\r\n				<li class="table-cell">\u4e2d\u6027\u76d8</li>\r\n				<% } %>\r\n			</ul>\r\n			<% } %>\r\n		<% } %>\r\n	</div>\r\n</div>'
}), define("widgets/cn/mod-hqpanel/scripts/mod", ["require", "exports",
				"module", "zepto", "view", "template",
				"plugin/zepto/zepto.tap", "text!../css/style.css",
				"text!../tpl.html", "text!../tpl-price.html",
				"text!../tpl-5d.html", "text!../tpl-mx.html"],
		function(e, t, n) {
			var r = e("zepto"), i = e("view"), s = e("template");
			return e("plugin/zepto/zepto.tap"), i.extend({
				style : e("text!../css/style.css"),
				htmls : {
					tpl : e("text!../tpl.html"),
					tpl_price : e("text!../tpl-price.html"),
					tpl_5d : e("text!../tpl-5d.html"),
					tpl_mx : e("text!../tpl-mx.html")
				},
				afterRender : function() {
					var e = this, t = app.symbol.substr(0, 2);
					this.test = 0, this.parent.$("#" + this.wrapper)
							.html(this.htmls.tpl), (t == "sh"
							&& app.symbol.substr(2, 3) == "000" || t == "sz"
							&& app.symbol.substr(2, 3) == "399")
							&& r(".hqpanel-tabs").hide(), this.models.hqprice
							.start(), this.parent.$(".hqpanel-tabs-btn").click(
							function(t) {
								r(".hqpanel-tabs-btn").removeClass("cur2"), r("#hqpanel-con")
										.html('<div style="text-align:center; margin-top:80px; height:100px; border-bottom:1px solid #d6d5d2;">\u6570\u636e\u8bfb\u53d6\u4e2d...</div>');
								var n = r(t.currentTarget).html();
								n == "\u62a5\u4ef7"
										? (r(".hqpanel-tabs-btn").eq(0)
												.addClass("cur2"), e.changeQt
												.call(
														e,
														"2|3|4|31|32|33|41|1|5|6|34|35|37|38|46|45|39|44|40|47",
														function() {
															e.models.hqprice
																	.start()
														}))
										: n == "\u4e94\u6863"
												? (r(".hqpanel-tabs-btn").eq(1)
														.addClass("cur2"), e.changeQt
														.call(
																e,
																"2|3|4|31|32|33|41|28|29|26|27|24|25|22|23|20|21|18|19|16|17|14|15|12|13|10|11|8|9",
																function() {
																	e.models.hq5d
																			.start()
																}))
												: n == "\u660e\u7ec6"
														&& (r(".hqpanel-tabs-btn")
																.eq(2)
																.addClass("cur2"), e.changeQt
																.call(
																		e,
																		"2|3|4|31|32|33|41|30",
																		function() {
																			e.models.hqmx
																					.start()
																		}))
							}), r(window).on("mod-hqpanel:reload",
							r.proxy(this.reload, e))
				},
				afterChange : function(e) {
					var t;
					e == this.models.hqprice
							? t = s.compile(this.htmls.tpl_price)
							: e == this.models.hq5d
									? t = s.compile(this.htmls.tpl_5d)
									: e == this.models.hqmx
											&& (t = s
													.compile(this.htmls.tpl_mx));
					var n = e.get("qt") || {}, r = t({
								rs : n
							});
					e == this.models.hq5d
							? n.length > 10
									&& this.parent.$("#hqpanel-con").html(r)
							: this.parent.$("#hqpanel-con").html(r);
					if (typeof window.callPhantom == "function" && !this.test) {
						this.test = 1;
						var i = window.callPhantom({
									name : "mod-hqpanel",
									time : Date.now()
								})
					}
				},
				changeQt : function(e, t) {
					var n = this;
					this.f = e, n.models.qt.stop(), this.models.hqprice.stop(), this.models.hq5d
							.stop(), this.models.hqmx.stop(), setTimeout(
							function() {
								t(), n.models.qt.fieldsChange(e)
							}, 50)
				},
				reload : function() {
					var e = this;
					e.changeQt
							.call(
									e,
									"2|3|4|31|32|33|41|1|5|6|34|35|37|38|46|45|39|44|40|47",
									function() {
										e.models.hqprice.start()
									});
					var t = app.symbol.substr(0, 2);
					t == "sh" && app.symbol.substr(2, 3) == "000" || t == "sz"
							&& app.symbol.substr(2, 3) == "399"
							? r(".hqpanel-tabs").hide()
							: (r(".hqpanel-tabs").show(), r(".hqpanel-tabs-btn")
									.removeClass("cur2"), r(".hqpanel-tabs-btn")
									.eq(0).addClass("cur2"))
				}
			})
		}), define("text!widgets/cn/mod-footer/css/style.css", [], function() {
	return "#mod-footer{width:100%;height:65px;background-color:#f8f6f3}#mod-footer #footer-box{width:100%;border-bottom:1px solid #d6d5d2}#mod-footer #footer-box a:link{color:#767676;text-decoration:none}#mod-footer #footer-box a:visited{color:#767676}#mod-footer #footer-box div.link{height:35px;line-height:35px;font-size:15px;width:50%;color:#767676;text-align:center;-webkit-box-flex:1;-moz-box-flex:1;-o-box-flex:1;box-flex:1}#mod-footer #footer-box div.link:nth-child(1){border-right:1px solid #d6d5d2}#mod-footer #footer-box div.link:nth-child(1) .ico{background:url(http://mat1.gtimg.com/finance/images/stock/p/gu/sprites_11.png) no-repeat 0 -62px;-webkit-background-size:33px 400px;background-size:33px 400px;padding-left:20px;height:40px}#mod-footer #footer-box div.link:nth-child(2) .ico{background:url(http://mat1.gtimg.com/finance/images/stock/p/gu/sprites_11.png) no-repeat 0 -28px;-webkit-background-size:33px 400px;background-size:33px 400px;padding-left:20px;padding-left:25px}#mod-footer #footer-copyright{height:30px;line-height:30px;font-size:10px;text-align:center;color:#b8b5b1}"
}), define("text!widgets/cn/mod-footer/tpl.html", [], function() {
	return '<div id="footer-box" class="row-box">\r\n	<div class="link" rel="1">\r\n		<div class="row-table ico"><a href="#" target="_blank">\u81ea\u9009\u80a1\u4e0b\u8f7d</a></div>\r\n	</div>\r\n	<div class="link" rel="2">\r\n		<div class="row-table ico"><a href="#" target="_blank">PC\u8df3\u8f6c</a></div>\r\n	</div>\r\n</div>\r\n<div id="footer-copyright">\r\n	Copyright \u00a9 1998 - 2013 Tencent Inc. All Rights Reserved\r\n</div>\r\n'
}), define("widgets/cn/mod-footer/scripts/mod", ["require", "exports",
				"module", "zepto", "view", "text!../css/style.css",
				"text!../tpl.html"], function(e, t, n) {
			var r = e("zepto"), i = e("view");
			return i.extend({
				style : e("text!../css/style.css"),
				html : e("text!../tpl.html"),
				afterRender : function() {
					this.test = 0, r("#" + this.wrapper).html(this.html), r(window)
							.trigger("Mod:init"), r("#mod-footer a")
							.eq(0)
							.attr("href",
									"http://111.161.58.200/ifzq.gtimg.cn/appstock/app/appd/?t=1"), r("#mod-footer a")
							.eq(1).attr(
									"href",
									"http://stockhtm.finance.qq.com/sstock/ggcx/"
											+ app.symbol.substr(2) + ".shtml");
					if (typeof window.callPhantom == "function" && !this.test) {
						this.test = 1;
						var e = window.callPhantom({
									name : "mod-footer",
									time : Date.now()
								})
					}
				}
			})
		}), define("cn/index", ["require", "view", "text!./index.html", "qt",
				"widgets/cn/mod-hqpanel/scripts/data",
				"widgets/cn/mod-hqpanel/scripts/data-5d",
				"widgets/cn/mod-hqpanel/scripts/data-mx",
				"widgets/cn/mod-quotchart/scripts/mod",
				"widgets/cn/mod-hqpanel/scripts/mod",
				"widgets/cn/mod-footer/scripts/mod"], function(e) {
			var t = e("view"), n = t._, r = t.$;
			return t.extend({
						attributes : {
							id : "scene-1"
						},
						html : e("text!./index.html"),
						models : {
							qt : e("qt").addJob({
										_id : "qt"
									}),
							hqprice : e("widgets/cn/mod-hqpanel/scripts/data")
									.addJob({
												_id : "hqprice"
											}),
							hq5d : e("widgets/cn/mod-hqpanel/scripts/data-5d")
									.addJob({
												_id : "hq5d"
											}),
							hqmx : e("widgets/cn/mod-hqpanel/scripts/data-mx")
									.addJob({
												_id : "hqmx"
											})
						},
						views : {
							"mod-quotchart" : {
								init : e("widgets/cn/mod-quotchart/scripts/mod"),
								options : {
									wrapper : "mod-quotchart"
								}
							},
							"mod-hqpanel" : {
								init : e("widgets/cn/mod-hqpanel/scripts/mod"),
								models : "qt hqprice hq5d hqmx",
								options : {
									wrapper : "mod-hqpanel"
								}
							},
							"mod-footer" : {
								init : e("widgets/cn/mod-footer/scripts/mod"),
								options : {
									wrapper : "mod-footer"
								}
							}
						},
						beforeRender : function() {
							this.$el.html() == ""
									&& this.$el.appendTo(t.$("#scroller")), this.$el
									.show()
						},
						afterRender : function() {
						},
						afterRemove : function() {
							this.$el.remove()
						}
					})
		}), define("text!cn/news.html", [], function() {
			return '<div id="mod-news">\u6570\u636e\u8bfb\u53d6\u4e2d...</div>'
		}), define("widgets/cn/mod-news/scripts/data", ["require", "model"],
		function(e) {
			var t = e("model");
			return t.extend({
						getNews : function(e) {
							var t = this;
							this.load(
									"http://ifzq.gtimg.cn/appstock/news/info/search?type="
											+ e + "&symbol=" + app.symbol
											+ "&page=1&n=30&_var=news",
									function() {
										var n = window.news.data.data;
										if (e == 0)
											for (var r in n)
												n[r].time = n[r].time.substr(0,
														10);
										t.set("news", n), t.set("m", Math
														.random())
									})
						}
					})
		}), define("plugin/zepto/zepto.localStorage", ["require", "exports",
				"module", "zepto"], function(e, t) {
			var n = e("zepto");
			return function(e) {
				var t = !0;
				if (typeof localStorage == "undefined"
						|| typeof JSON == "undefined")
					t = !1;
				else
					var n = localStorage;
				this.setItem = function(e, r) {
					if (!t)
						return !1;
					n.setItem(e, JSON.stringify(r));
					var i = new Date;
					n.setItem("meta_ct_" + e, i.getTime())
				}, this.getItem = function(e) {
					return t ? n.getItem(e) == null ? !1 : JSON.parse(n
							.getItem(e)) : !1
				}, this.removeItem = function(e) {
					return t
							? (n.removeItem(e), n.removeItem("meta_ct_" + e), !0)
							: !1
				}, e.storage = this
			}(n), n.storage
		}), define("text!widgets/cn/mod-news/css/style.css", [], function() {
	return "#mod-news{width:100%}#mod-news #mod-news-error{width:100%;height:50px;line-height:50px;text-align:center;margin-top:10px}#mod-news .news-list{width:100%;height:65px;border-bottom:1px solid #c6c6c6;overflow:hidden}#mod-news .news-list .news-list-box{position:relative;width:95%;margin:0 auto}#mod-news .news-list .news-list-img{height:65px;padding:0 10px}#mod-news .news-list .news-list-img img{border:1px solid #999895;overflow:hidden}#mod-news .news-list .news-list-title{font-size:14px;padding:8px 0 0 10px;height:25px;line-height:25px;color:#1a1919;-webkit-box-flex:1;-moz-box-flex:1;-o-box-flex:1;box-flex:1}#mod-news .news-list .news-list-title.visited{color:#acacac}#mod-news .news-list .news-list-date{position:absolute;top:40px;right:12px;color:#b7b1ae}"
}), define("text!widgets/cn/mod-news/tpl.html", [], function() {
	return "<% if(rs == '') { %>\r\n<div id=\"mod-news-error\">\u6682\u65e0\u76f8\u5173\u6570\u636e</div>\r\n<% } else { %>\r\n<% for (var i in rs) {  %>\r\n<div class=\"news-list\">\r\n	<div id=\"<%=rs[i]['id'] %>\" class=\"news-list-box\" val=\"<%=rs[i]['url'].split('#')[0] %>\">\r\n		<div class=\"news-list-title\">\r\n			<% if(rs[i]['title'].length > 35){%>\r\n			<%=rs[i]['title'].cutstr(55) %>\r\n			<% } else{ %>\r\n			<%=rs[i]['title'] %>\r\n			<% } %>\r\n		</div>\r\n		<div class=\"news-list-date\"><%=rs[i]['time'] %></div>\r\n	</div>\r\n</div>\r\n<% } %>\r\n<% } %>"
}), define("widgets/cn/mod-news/scripts/mod", ["require", "exports", "module",
				"zepto", "view", "template", "plugin/zepto/zepto.localStorage",
				"plugin/zepto/zepto.tap", "text!../css/style.css",
				"text!../tpl.html"], function(e, t, n) {
			var r = e("zepto"), i = e("view"), s = e("template");
			e("plugin/zepto/zepto.localStorage"), e("plugin/zepto/zepto.tap");
			var o, u = function(e) {
				e.preventDefault()
			};
			return i.extend({
				style : e("text!../css/style.css"),
				html : e("text!../tpl.html"),
				afterRender : function() {
					var e = this, t = app.args[1];
					t == 0 || t == 1 || t == 2
							? (o = t, r(".news-tabs-btn")
									.removeClass("selected"), o == "2"
									? r(".news-tabs-btn").eq(0)
											.addClass("selected")
									: o == "0"
											? r(".news-tabs-btn").eq(1)
													.addClass("selected")
											: r(".news-tabs-btn").eq(2)
													.addClass("selected"), this.models.news
									.getNews(o))
							: app.navigate(app.symbol + "/news/2"), r(window)
							.on("mod-news:reload", r.proxy(this.reload, e)), r("#mod-news")
							.html('<div style="text-align:center; margin-top:100px;">\u6570\u636e\u8bfb\u53d6\u4e2d...</div>')
				},
				afterChange : function(e) {
					var t = this, n = s.compile(this.html), i = e.get("news")
							|| {}, a = n({
								rs : i
							}), f = r.storage.getItem("news_pid") || "", l;
					r("#" + this.wrapper).html(a);
					if (f != "")
						for (var c in f)
							f[c] != ""
									&& r("#" + f[c] + " .news-list-title")
											.addClass("visited");
					r(".news-tabs-btn").click(function(e) {
						o = e.currentTarget.getAttribute("rel"), app
								.navigate(app.symbol + "/news/" + o)
					}), window.onscroll = function() {
						r(window).trigger("news:scroll")
					}, r(".news-list").on("click", function(e) {
						var t = r(e.target).closest(".news-list");
						t.css({
									"background-color" : "#f8f6f3"
								});
						var n = e.currentTarget.children[0].getAttribute("id");
						app.navigate(app.symbol + "/news/" + o + "/" + n), r(window)
								.trigger("news:ontouchmove");
						var i = r("#" + n).find(".news-list-title"), s = r.storage
								.getItem("news_pid")
								|| [], u = r("#scene-4");
						i.addClass("visited");
						if (s.length == 0)
							s.push(n);
						else {
							var a = 1;
							for (var f in s)
								if (s[f] == n) {
									var a = 0;
									break
								}
							a && s.push(n)
						}
						r.storage.setItem("news_pid", s)
					}), r(window).on("news:ontouchmove", function() {
								r(window).on("touchmove", u)
							}), r(window).on("news:offtouchmove", function() {
								r(window).off("touchmove", u)
							}), r(window).trigger("Mod:init")
				},
				reload : function() {
					this.models.news.getNews(o), r(".news-list").off("")
				}
			})
		}), define("cn/news", ["require", "view", "text!./news.html", "qt",
				"widgets/cn/mod-news/scripts/data",
				"widgets/cn/mod-news/scripts/mod"], function(e) {
			var t = e("view"), n = t._, r = t.$;
			return t.extend({
				attributes : {
					id : "scene-2"
				},
				html : e("text!./news.html"),
				models : {
					qt : e("qt").addJob({
								_id : "qt"
							}),
					news : e("widgets/cn/mod-news/scripts/data").single()
				},
				views : {
					"mod-news" : {
						init : e("widgets/cn/mod-news/scripts/mod"),
						models : "news",
						options : {
							wrapper : "mod-news"
						}
					}
				},
				beforeRender : function() {
					this.$el.html() == ""
							&& (t
									.$("#mod-nav")
									.after('<div id="news-tabs"><div id="news-tabs-box" class="row-box row-center"><div class="news-tabs-btn selected" rel="2">\u65b0\u95fb</div><div class="news-tabs-btn" rel="0">\u516c\u544a</div><div class="news-tabs-btn" rel="1">\u7814\u62a5</div></div></div>'), this.$el
									.appendTo(t.$("#scroller"))), this.$el
							.show()
				},
				afterRender : function() {
				},
				afterRemove : function() {
					this.$el.remove()
				},
				navigate : function() {
					this.views["mod-news"].afterRender()
				}
			})
		}), define("text!cn/info.html", [], function() {
			return ""
		}), define("widgets/cn/mod-info/scripts/data", ["require", "model"],
		function(e) {
			var t = e("model");
			return t.extend({
						getinfo : function() {
							var e = this, t = 0, n = [];
							this.load(
									"http://ifzq.gtimg.cn/portable/mobile/CnZl/data?code="
											+ app.symbol.substr(2)
											+ "&_var=base", function() {
										var r = window.base.data;
										n.base = r, t++, r != "" && t == 2
												&& e.set("info", n)
									}), this.load(
									"http://ifzq.gtimg.cn/stock/corp/cwbb/search?symbol="
											+ app.symbol.substr(2)
											+ "&type=sum&_var=cwsj",
									function() {
										var r = window.cwsj.data;
										n.cwsj = r, t++, r != "" && t == 2
												&& e.set("info", n)
									})
						}
					})
		}), define("text!widgets/cn/mod-info/css/style.css", [], function() {
	return "#mod-info .toggleUI{height:33px;line-height:33px;background-color:#f8f6f4;border-top:2px solid #e05a00;border-bottom:1px solid #c6c6c6;position:relative}#mod-info .toggleUI.nbrb{border-bottom:0}#mod-info .toggleUI .toggleUI-header{font-size:15px;padding-left:15px}#mod-info .toggleUI .toggleUI-btn{background:url(http://mat1.gtimg.com/finance/images/stock/p/gu/sprites_11.png) no-repeat 0 -379px;-webkit-background-size:33px 400px;background-size:33px 400px;height:21px;width:21px;position:absolute;top:7px;right:15px}#mod-info .toggleUI .toggleUI-btn.hidden{background:url(http://mat1.gtimg.com/finance/images/stock/p/gu/sprites_11.png) no-repeat 0 -336px;-webkit-background-size:33px 400px;background-size:33px 400px}#mod-info .toggleUI-table{width:100%;display:table}#mod-info .toggleUI-table.hidden{display:none}#mod-info .toggleUI-table .table-column-group{display:table-column-group}#mod-info .toggleUI-table .table-column{display:table-column}#mod-info #info-1.toggleUI-table .table-column:nth-child(odd){width:25%}#mod-info #info-1.toggleUI-table .table-column:nth-child(even){width:75%}#mod-info #info-2.toggleUI-table .table-column:nth-child(odd){width:25%}#mod-info #info-2.toggleUI-table .table-column:nth-child(even){width:25%}#mod-info #info-3.toggleUI-table .table-column:nth-child(odd){width:50%}#mod-info #info-3.toggleUI-table .table-column:nth-child(even){width:50%}#mod-info #info-3.toggleUI-table .table-column:nth-child(odd){width:33.3333333%}#mod-info #info-3.toggleUI-table .table-column:nth-child(even){width:33.3333333%}#mod-info .toggleUI-table .table-row-error{height:50px;line-height:50px;text-align:center}#mod-info .toggleUI-table .table-row-group{display:table-row-group}#mod-info .toggleUI-table .table-row{display:table-row;height:27px;line-height:27px}#mod-info #info-1.toggleUI-table .table-cell{display:table-cell;border-top:1px solid #fff;border-bottom:1px solid #cecfd0;vertical-align:middle;text-align:center;padding-right:10px}#mod-info #info-2.toggleUI-table .table-cell{display:table-cell;border-bottom:1px solid #cecfd0;vertical-align:middle;text-align:center}#mod-info #info-2.toggleUI-table .table-cell.bdr{border-right:1px solid #cecfd0;font-size:11px}#mod-info #info-2.toggleUI-table .table-cell.tl{text-align:left!important;text-indent:15px!important}#mod-info #info-3.toggleUI-table .table-cell{display:table-cell;border-bottom:1px solid #cecfd0;vertical-align:middle;text-align:center}#mod-info #info-3.toggleUI-table .table-cell.bdr{border-right:1px solid #cecfd0}#mod-info #info-4.toggleUI-table .table-cell{display:table-cell;border-bottom:1px solid #cecfd0;vertical-align:middle;text-align:center}#mod-info #info-4.toggleUI-table .table-cell.bdr{border-right:1px solid #cecfd0;font-size:11px}#mod-info #info-1.toggleUI-table .table-cell:nth-child(odd){color:#8f8f8f;text-indent:15px;text-align:left}#mod-info #info-2.toggleUI-table .table-cell:nth-child(odd){color:#8f8f8f;text-indent:0}#mod-info #info-3.toggleUI-table .table-cell:nth-child(odd){color:#5d5d5d;text-indent:15px;text-align:left}#mod-info #info-4.toggleUI-table .table-cell:nth-child(odd){color:#5d5d5d;text-indent:15px;text-align:left}#mod-info #info-1.toggleUI-table .table-cell:nth-child(even){color:#222;text-align:left}#mod-info #info-2.toggleUI-table .table-cell:nth-child(even){color:#8f8f8f}#mod-info #info-3.toggleUI-table .table-cell:nth-child(even){color:#5d5d5d;text-indent:15px;text-align:left}#mod-info #info-4.toggleUI-table .table-cell:nth-child(even){color:#5d5d5d;text-indent:15px;text-align:left}#mod-info .toggleUI-table .table-row:nth-child(odd){background-color:#f8f6f3}#mod-info .toggleUI-table .table-row:nth-child(even){background-color:#f8f6f3;border-top:1px solid #fff}#mod-info #info-3.toggleUI-table .table-cell.header{text-align:center;color:#8F8F8F}#mod-info #info-4.toggleUI-table .table-cell.header{font:14px;height:40px}#mod-info #info-4.toggleUI-table .table-cell.header:nth-child(1){text-align:left;color:#8F8F8F}#mod-info #info-4.toggleUI-table .table-cell.header:nth-child(2){text-align:right;color:#8F8F8F;padding-right:10px}#mod-info #info-4.toggleUI-table .table-cell.nbrb{border-bottom:0}#mod-info #info-4.toggleUI-table .table-row .table-cell:nth-child(even){text-align:right;padding-right:10px}#mod-info .toggleUI-table .table-cell .cell-table{display:table;width:100%;height:110px;line-height:110px}#mod-info .toggleUI-table .table-cell .cell-table.weight{font-weight:bolder;color:#5d5d5d}#mod-info .toggleUI-table .table-cell .cell-table .table-cell{text-align:center}#mod-info .toggleUI-table .table-cell .cell-table .table-cell .cell-up{color:#d93510}#mod-info .toggleUI-table .table-cell .cell-table .table-cell .cell-down{color:#008325}#mod-info #info-2.toggleUI-table .table-cell .cell-table .table-row:nth-last-child(1) .table-cell{border:0}#mod-info .tableStyle th{border:1px solid #cfcfce;text-align:center;font-size:13px;height:21px;line-height:21px;color:#8f8f8f;vertical-align:middle;font-weight:400}#mod-info .tableStyle .nbr{border:0}#mod-info .tableStyle .nbrl{border-left:0}#mod-info .tableStyle .nbrr{border-right:0}#mod-info .tableStyle .nbrt{border-top:0}#mod-info .tableStyle .nbrb{border-bottom:0}#mod-info .tableStyle td{border:1px solid #cfcfce;text-align:center;height:21px;line-height:21px;vertical-align:middle}"
}), define("text!widgets/cn/mod-info/tpl.html", [], function() {
	return '<div id="mod-info">\r\n	<div class="toggleUI" rel="1">\r\n		<span class="toggleUI-header">\u57fa\u672c\u8d44\u6599</span>\r\n		<div id="toggleUI-btn-1" class="toggleUI-btn"></div>\r\n	</div>\r\n	<div id="info-1" class="toggleUI-table"></div>\r\n	<div class="toggleUI" rel="2">\r\n		<span class="toggleUI-header">\u80a1\u672c\u80a1\u4e1c</span>\r\n		<div id="toggleUI-btn-2" class="toggleUI-btn hidden"></div>\r\n	</div>\r\n	<div id="info-2" class="toggleUI-table hidden"></div>\r\n	<div class="toggleUI nbrb" rel="3">\r\n		<span class="toggleUI-header">\u5206\u7ea2\u9001\u914d</span>\r\n		<div id="toggleUI-btn-3" class="toggleUI-btn hidden"></div>\r\n	</div>\r\n	<div id="info-3" class="toggleUI-table hidden"></div>\r\n	<div class="toggleUI" rel="4">\r\n		<span class="toggleUI-header">\u8d22\u52a1\u6570\u636e</span>\r\n		<div id="toggleUI-btn-4" class="toggleUI-btn hidden"></div>\r\n	</div>\r\n	<div id="info-4" class="toggleUI-table hidden"></div>\r\n</div>'
}), define("text!widgets/cn/mod-info/base.html", [], function() {
	return '<div class="table-column-group">\r\n	<div class="table-column"></div>\r\n	<div class="table-column"></div>\r\n</div>\r\n<%if (rs[\'base\'].length == 0){ %>\r\n<div class="table-row-error">\u6682\u65e0\u6570\u636e</div>\r\n<% }else{ %>\r\n<div class="table-row-group">\r\n	<ul class="table-row">\r\n		<li class="table-cell">\u6cd5\u5b9a\u540d\u79f0</li>\r\n		<li class="table-cell"><%=rs[\'base\'][\'fdmc\'] %></li>\r\n	</ul>\r\n	<ul class="table-row">\r\n		<li class="table-cell">\u4e0a\u5e02\u65f6\u95f4</li>\r\n		<li class="table-cell"><%=rs[\'base\'][\'ssrq\'] %></li>\r\n	</ul>\r\n	<ul class="table-row">\r\n		<li class="table-cell">\u7ecf\u8425\u8303\u56f4</li>\r\n		<li class="table-cell"><%=rs[\'base\'][\'jyfw\'] %></li>\r\n	</ul>\r\n	<ul class="table-row">\r\n		<li class="table-cell">\u6240\u5c5e\u5730\u533a</li>\r\n		<li class="table-cell"><%=rs[\'base\'][\'ssdq\'] %></li>\r\n	</ul>\r\n	<ul class="table-row">\r\n		<li class="table-cell">\u6240\u5c5e\u677f\u5757</li>\r\n		<li class="table-cell">\r\n			<% for(var key in rs[\'base\'][\'plate\']){%>\r\n			<%=rs[\'base\'][\'plate\'][key] %> &nbsp;\r\n			<% } %>\r\n		</li>\r\n	</ul>\r\n</div>\r\n<% } %>'
}), define("text!widgets/cn/mod-info/cwsj.html", [], function() {
	return '<div class="table-column-group">\r\n	<div class="table-column"></div>\r\n	<div class="table-column"></div>\r\n</div>\r\n<%if (rs.length == 0){ %>\r\n<div class="table-row-error">\u6682\u65e0\u6570\u636e</div>\r\n<% }else{ %>\r\n<div class="table-row-group">\r\n	<% for(var key in rs){ %>\r\n	<ul class="table-row">\r\n		<li class="table-cell header"><%=rs[key][0][0][0] %></li>\r\n		<li class="table-cell header"><%=rs[key][0][1][0] %></li>\r\n	</ul>\r\n	<% for(var idx in rs[key]){ %>\r\n	<% if(idx != 0) {%>\r\n	<ul class="table-row">\r\n		<% if((idx != 6 && key==0) || (idx != 5 && key==1) || (idx != 4 && key==2)) {%>\r\n		<li class="table-cell nbrb bdr"><%=rs[key][idx][0][0]%></li>\r\n		<% }else{ %>\r\n		<li class="table-cell bdr"><%=rs[key][idx][0][0]%></li>\r\n		<% } %>\r\n		<% if((idx != 6 && key==0) || (idx != 5 && key==1) || (idx != 4 && key==2)) {%>\r\n		<li class="table-cell nbrb"><%=rs[key][idx][1][0]%></li>\r\n		<% }else{ %>\r\n		<li class="table-cell"><%=rs[key][idx][1][0]%></li>\r\n		<% } %>\r\n	</ul>\r\n	<% } %>\r\n	<% } %>\r\n	<% } %>\r\n</div>\r\n<% } %>\r\n'
}), define("text!widgets/cn/mod-info/fhps.html", [], function() {
	return '<div class="table-column-group">\r\n	<div class="table-column"></div>\r\n	<div class="table-column"></div>\r\n	<div class="table-column"></div>\r\n	<div class="table-column"></div>\r\n</div>\r\n<%if (rs[\'fhsp\'].length == 0){ %>\r\n<div class="table-row-error">\u6682\u65e0\u6570\u636e</div>\r\n<% }else{ %>\r\n<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="tableStyle">\r\n	<tr>\r\n		<th>\u62a5\u544a\u671f</th>\r\n		<th>\u6bcf\u80a1\u6536\u76ca(\u5143)</th>\r\n		<th class="nbr">\r\n			<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="tableStyle">\r\n				<tr>\r\n					<th colspan="3" class="nbrl nbrr">\u5206\u7ea2\u65b9\u6848(\u6bcf10\u80a1)</th>\r\n				</tr>\r\n				<tr>\r\n					<th class="nbrl nbrb" style="width:33%;">\u9001\u80a1</th>\r\n					<th class="nbrb" style="width:34%;">\u8f6c\u8d60</th>\r\n					<th class="nbrr nbrb" style="width:33%;">\u5206\u7ea2</th>\r\n				</tr>\r\n			</table>\r\n		</th>\r\n		<th>\u767b\u8bb0\u65e5</th>\r\n		<th>\u9664\u6743\u65e5</th>\r\n	</tr>\r\n	<% for(var key in rs[\'fhsp\']){%>\r\n	<tr>\r\n		<td><%=rs[\'fhsp\'][key][\'nd\']%></td>\r\n		<td><%=rs[\'fhsp\'][key][\'mgsy\']%></td>\r\n		<td>\r\n			<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="tableStyle">\r\n				<tr>\r\n					<td class="nbrl nbrt nbrb" style="width:33%;"><%=rs[\'fhsp\'][key][\'sg\']%></td>\r\n					<td class="nbrt nbrb" style="width:34%;"><%=rs[\'fhsp\'][key][\'zz\']%></td>\r\n					<td class="nbrr nbrt nbrb" style="width:33%;"><%=rs[\'fhsp\'][key][\'fh\']%></td>\r\n				</tr>\r\n			</table>\r\n		</td>\r\n		<td><%=rs[\'fhsp\'][key][\'djr\'].substr(0,4)%>/<%=rs[\'fhsp\'][key][\'djr\'].substr(5,2)%>/<%=rs[\'fhsp\'][key][\'djr\'].substr(8,2)%></td>\r\n		<td><%=rs[\'fhsp\'][key][\'cqr\'].substr(0,4)%>/<%=rs[\'fhsp\'][key][\'cqr\'].substr(5,2)%>/<%=rs[\'fhsp\'][key][\'cqr\'].substr(8,2)%></td>\r\n	</tr>\r\n	<% } %>\r\n</table>\r\n<% } %>'
}), define("text!widgets/cn/mod-info/gbgd.html", [], function() {
	return '<div class="table-column-group">\r\n	<div class="table-column"></div>\r\n	<div class="table-column"></div>\r\n</div>\r\n<%if (rs[\'gb\'].length == 0){ %>\r\n<div class="table-row-error">\u6682\u65e0\u6570\u636e</div>\r\n<% }else{ %>\r\n<div class="table-row-group">\r\n	<ul class="table-row">\r\n		<li class="table-cell bdr tl">\u603b\u80a1\u672c\uff08\u4e07\u80a1\uff09</li>\r\n		<li class="table-cell"><%=rs[\'gb\'][\'zgb\'] %></li>\r\n	</ul>\r\n		<ul class="table-row">\r\n		<li class="table-cell bdr tl">\u6d41\u901aA\u80a1\uff08\u4e07\u80a1\uff09</li>\r\n		<li class="table-cell"><%=rs[\'gb\'][\'ltag\'] %></li>\r\n	</ul>\r\n	<ul class="table-row">\r\n		<li class="table-cell bdr tl">\u9650\u552e\u6d41\u901aA\u80a1</li>\r\n		<%if (rs[\'gb\'][\'xsag\'] == 0 || rs[\'gb\'][\'xsag\'] == \'\' || rs[\'gb\'][\'xsag\'] == \'--\'){ %>\r\n		<li class="table-cell">--</li>\r\n		<% }else{ %>\r\n		<li class="table-cell"><%=rs[\'gb\'][\'xsag\'] %></li>\r\n		<% } %>\r\n	</ul>\r\n	<ul class="table-row">\r\n		<li class="table-cell bdr tl">\u80a1\u4e1c\u603b\u6570</li>\r\n		<li class="table-cell"><%=rs[\'gb\'][\'gdzs\'] %></li>\r\n	</ul>\r\n	<ul class="table-row">\r\n		<li class="table-cell bdr tl">\u4eba\u5747\u6301\u80a1\uff08\u80a1\uff09</li>\r\n		<li class="table-cell"><%=rs[\'gb\'][\'rjcg\'] %></li>\r\n	</ul>\r\n</div>\r\n<% } %>'
}), define("widgets/cn/mod-info/scripts/mod", ["require", "exports", "module",
				"zepto", "view", "template", "plugin/zepto/zepto.tap",
				"text!../css/style.css", "text!../tpl.html",
				"text!../base.html", "text!../cwsj.html", "text!../fhps.html",
				"text!../gbgd.html"], function(e, t, n) {
			var r = e("zepto"), i = e("view"), s = e("template");
			e("plugin/zepto/zepto.tap");
			var o = 0;
			return i.extend({
				style : e("text!../css/style.css"),
				htmls : {
					tpl : e("text!../tpl.html"),
					tpl_base : e("text!../base.html"),
					tpl_cwsj : e("text!../cwsj.html"),
					tpl_fhps : e("text!../fhps.html"),
					tpl_gbgd : e("text!../gbgd.html")
				},
				afterRender : function() {
					var e = this, t = app.args[1];
					r("#mod-info")
							.html('<div style="text-align:center; margin-top:100px;">\u6570\u636e\u8bfb\u53d6\u4e2d...</div>'), t == ""
							|| t == undefined
							? (r("#" + this.wrapper).html(this.htmls.tpl), this.models.info
									.getinfo())
							: app.navigate(app.symbol + "/info"), r(window).on(
							"mod-info:reload", r.proxy(this.reload, e))
				},
				afterChange : function(e) {
					var t = this, n = e.get("info") || {}, i = s
							.compile(this.htmls.tpl_base), o = i({
								rs : n.base
							});
					r("#info-1").html(o);
					var i = s.compile(this.htmls.tpl_gbgd), o = i({
								rs : n.base
							});
					r("#info-2").html(o);
					var i = s.compile(this.htmls.tpl_fhps), o = i({
								rs : n.base
							});
					r("#info-3").html(o);
					var i = s.compile(this.htmls.tpl_cwsj), o = i({
								rs : n.cwsj
							});
					r("#info-4").html(o), r(".toggleUI").click(this.toggleBar), r(window)
							.trigger("Mod:init")
				},
				reload : function() {
					r(".toggleUI").off(""), this.models.info.getinfo()
				},
				toggleBar : function(e) {
					rel = e.currentTarget.getAttribute("rel");
					var t = rel;
					r("#toggleUI-btn-" + t).hasClass("hidden")
							? (r("#toggleUI-btn-" + t).removeClass("hidden"), r("#info-"
									+ t).removeClass("hidden"))
							: (r("#toggleUI-btn-" + t).addClass("hidden"), r("#info-"
									+ t).addClass("hidden"))
				}
			})
		}), define("cn/info", ["require", "view", "text!./info.html",
				"widgets/cn/mod-info/scripts/data",
				"widgets/cn/mod-info/scripts/mod"], function(e) {
			var t = e("view"), n = t._, r = t.$;
			return t.extend({
						attributes : {
							id : "scene-3"
						},
						html : e("text!./info.html"),
						models : {
							info : e("widgets/cn/mod-info/scripts/data")
									.single()
						},
						views : {
							"mod-info" : {
								init : e("widgets/cn/mod-info/scripts/mod"),
								models : "info",
								options : {
									wrapper : "scene-3"
								}
							}
						},
						beforeRender : function() {
							this.$el.html() == ""
									&& this.$el.appendTo(t.$("#scroller")), this.$el
									.show()
						},
						afterRender : function() {
						},
						afterRemove : function() {
							this.$el.remove()
						}
					})
		});/*  |xGv00|7d5e4baa011e9c9b47606e13a82640e4 */
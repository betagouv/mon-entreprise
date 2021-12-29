if (!import.meta.env.SSR) {
	setATInternet.call(window)

	// Vérifier si on a besoin de tous ces plugins
	pluginCampaign.call(window)
	pluginStorage.call(window)
	pluginUtils.call(window)
	pluginTechClicks.call(window)
	pluginClicks.call(window)
	pluginContextVariables.call(window)
	pluginPage.call(window)
	pluginClientSideUserId.call(window)
	pluginPrivacy.call(window)

	if (typeof window.ATInternet.onTrackerLoad === 'function') {
		window.ATInternet.onTrackerLoad()
	}
}

function setATInternet() {
	var dfltPluginCfg = {}
	var dfltGlobalCfg = {
		site: 617189,
		log: '',
		logSSL: '',
		domain: 'xiti.com',
		collectDomain: 'logc412.xiti.com',
		collectDomainSSL: 'logs1412.xiti.com',
		userIdOrigin: 'server',
		pixelPath: '/hit.xiti',
		disableCookie: false,
		disableStorage: false,
		cookieSecure: true,
		cookieDomain: '',
		preview: false,
		plgs: [
			'Campaigns',
			'Clicks',
			'ContextVariables',
			'Page',
			'ClientSideUserId',
			'Privacy',
		],
		lazyLoadingPath: '',
		documentLevel: 'document',
		redirect: false,
		activateCallbacks: true,
		medium: '',
		ignoreEmptyChapterValue: false,
		base64Storage: false,
		sendHitWhenOptOut: true,
		forceHttp: false,
		requestMethod: 'GET',
		maxHitSize: 2000,
		urlPropertyAuto: true,
		urlPropertyQueryString: false,
	}
	;(function (a) {
		a.ATInternet = a.ATInternet || {}
		a.ATInternet.Tracker = a.ATInternet.Tracker || {}
		a.ATInternet.Tracker.Plugins = a.ATInternet.Tracker.Plugins || {}
	})(window)
	var Utils = function () {
		function a(h) {
			var b = typeof h
			if ('object' !== b || null === h)
				return 'string' === b && (h = '"' + h + '"'), String(h)
			var e,
				f,
				d = [],
				c = h.constructor === Array
			for (e in h)
				h.hasOwnProperty(e) &&
					((f = h[e]),
					(b = typeof f),
					'function' !== b &&
						'undefined' !== b &&
						('string' === b
							? (f = '"' + f.replace(/[^\\]"/g, '\\"') + '"')
							: 'object' === b && null !== f && (f = a(f)),
						d.push((c ? '' : '"' + e + '":') + String(f))))
			return (c ? '[' : '{') + String(d) + (c ? ']' : '}')
		}
		function g(a) {
			return null === a ? '' : (a + '').replace(d, '')
		}
		function k(a) {
			var l,
				e = null
			return (a = g(a + '')) &&
				!g(
					a.replace(b, function (a, h, b, d) {
						l && h && (e = 0)
						if (0 === e) return a
						l = b || h
						e += !d - !b
						return ''
					})
				)
				? Function('return ' + a)()
				: null
		}
		var c = this,
			b =
				/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g,
			d = RegExp(
				'^[\\x20\\t\\r\\n\\f]+|((?:^|[^\\\\])(?:\\\\.)*)[\\x20\\t\\r\\n\\f]+$',
				'g'
			)
		c.isLocalStorageAvailable = function () {
			try {
				var a = localStorage
				a.setItem('__storage_test__', '__storage_test__')
				a.removeItem('__storage_test__')
				return !0
			} catch (b) {
				return !1
			}
		}
		c.isBeaconMethodAvailable = function () {
			return (
				window.navigator && 'function' === typeof window.navigator.sendBeacon
			)
		}
		c.Base64 = {
			_keyStr:
				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
			encode: function (a) {
				var b = '',
					e,
					f,
					d,
					r,
					q,
					m,
					p = 0
				for (a = c.Base64._utf8_encode(a); p < a.length; )
					(e = a.charCodeAt(p++)),
						(f = a.charCodeAt(p++)),
						(d = a.charCodeAt(p++)),
						(r = e >> 2),
						(e = ((e & 3) << 4) | (f >> 4)),
						(q = ((f & 15) << 2) | (d >> 6)),
						(m = d & 63),
						isNaN(f) ? (q = m = 64) : isNaN(d) && (m = 64),
						(b =
							b +
							this._keyStr.charAt(r) +
							this._keyStr.charAt(e) +
							this._keyStr.charAt(q) +
							this._keyStr.charAt(m))
				return b
			},
			decode: function (a) {
				var b = '',
					e,
					f,
					d,
					r,
					q,
					m = 0
				for (a = a.replace(/[^A-Za-z0-9\+\/\=]/g, ''); m < a.length; )
					(e = this._keyStr.indexOf(a.charAt(m++))),
						(f = this._keyStr.indexOf(a.charAt(m++))),
						(r = this._keyStr.indexOf(a.charAt(m++))),
						(q = this._keyStr.indexOf(a.charAt(m++))),
						(e = (e << 2) | (f >> 4)),
						(f = ((f & 15) << 4) | (r >> 2)),
						(d = ((r & 3) << 6) | q),
						(b += String.fromCharCode(e)),
						64 != r && (b += String.fromCharCode(f)),
						64 != q && (b += String.fromCharCode(d))
				return (b = c.Base64._utf8_decode(b))
			},
			_utf8_encode: function (a) {
				a = a.replace(/\r\n/g, '\n')
				for (var b = '', e = 0; e < a.length; e++) {
					var f = a.charCodeAt(e)
					128 > f
						? (b += String.fromCharCode(f))
						: (127 < f && 2048 > f
								? (b += String.fromCharCode((f >> 6) | 192))
								: ((b += String.fromCharCode((f >> 12) | 224)),
								  (b += String.fromCharCode(((f >> 6) & 63) | 128))),
						  (b += String.fromCharCode((f & 63) | 128)))
				}
				return b
			},
			_utf8_decode: function (a) {
				for (var b = '', e = 0, f, d, c; e < a.length; )
					(f = a.charCodeAt(e)),
						128 > f
							? ((b += String.fromCharCode(f)), e++)
							: 191 < f && 224 > f
							? ((d = a.charCodeAt(e + 1)),
							  (b += String.fromCharCode(((f & 31) << 6) | (d & 63))),
							  (e += 2))
							: ((d = a.charCodeAt(e + 1)),
							  (c = a.charCodeAt(e + 2)),
							  (b += String.fromCharCode(
									((f & 15) << 12) | ((d & 63) << 6) | (c & 63)
							  )),
							  (e += 3))
				return b
			},
		}
		c.loadScript = function (a, b) {
			var e
			b = b || function () {}
			e = document.createElement('script')
			e.type = 'text/javascript'
			e.src = a.url
			e.async = !1
			e.defer = !1
			e.onload = e.onreadystatechange = function (a) {
				a = a || window.event
				if (
					'load' === a.type ||
					(/loaded|complete/.test(e.readyState) &&
						(!document.documentMode || 9 > document.documentMode))
				)
					(e.onload = e.onreadystatechange = e.onerror = null), b(null, a)
			}
			e.onerror = function (a) {
				e.onload = e.onreadystatechange = e.onerror = null
				b({ msg: 'script not loaded', event: a })
			}
			var f = document.head || document.getElementsByTagName('head')[0]
			f.insertBefore(e, f.lastChild)
		}
		c.cloneSimpleObject = function (a, b) {
			if ('object' !== typeof a || null === a || a instanceof Date) return a
			var e = new a.constructor(),
				f
			for (f in a)
				a.hasOwnProperty(f) &&
					(void 0 === f ||
						(b && void 0 === a[f]) ||
						(e[f] = c.cloneSimpleObject(a[f])))
			return e
		}
		c.isEmptyObject = function (a) {
			for (var b in a) if (a.hasOwnProperty(b)) return !1
			return !0
		}
		c.isObject = function (a) {
			return null !== a && 'object' === typeof a && !(a instanceof Array)
		}
		c.ATVALUE = '_ATVALUE'
		c.ATPREFIX = '_ATPREFIX'
		c.object2Flatten = function (a, b, e, f, d) {
			var r = {},
				q = '',
				m = '',
				p = [],
				g = '',
				s = 0,
				k
			for (k in a)
				if (a.hasOwnProperty(k))
					if (
						((r = c.splitProtocolAndKey(k, d)),
						(q = r.prefix || f || ''),
						(m = (b ? b + '_' : '') + r.key),
						c.isObject(a[k]))
					)
						c.object2Flatten(a[k], m, e, q, d)
					else {
						p = m.split('_')
						g = ''
						for (s = 0; s < p.length; s++)
							(r = c.splitProtocolAndKey(p[s], d)),
								(q = r.prefix || q),
								(g += r.key + (s < p.length - 1 ? '_' : ''))
						m = g || m
						e[m] = e[m] || {}
						e[m][c.ATVALUE] = a[k]
						e[m][c.ATPREFIX] = q
					}
		}
		c.flatten2Object = function (a, b, e) {
			b = b.split('_')
			var f, d
			for (d = 0; d < b.length - 1; d++)
				(f = b[d]), a[f] || (a[f] = {}), (a = a[f])
			if (a.hasOwnProperty(c.ATVALUE)) {
				f = a[c.ATVALUE]
				var r = a[c.ATPREFIX]
				delete a[c.ATVALUE]
				delete a[c.ATPREFIX]
				a.$ = {}
				a.$[c.ATVALUE] = f
				a.$[c.ATPREFIX] = r
			}
			e = c.cloneSimpleObject(e)
			a[b[d]] ? (a[b[d]].$ = e) : (a[b[d]] = e)
		}
		c.getFormattedObject = function (a) {
			var b = {},
				e,
				f
			for (f in a)
				a.hasOwnProperty(f) &&
					(a[f].hasOwnProperty(c.ATVALUE)
						? ((e = a[f][c.ATPREFIX] ? a[f][c.ATPREFIX] + ':' + f : f),
						  (b[e] = a[f][c.ATVALUE]))
						: (b[f] = c.getFormattedObject(a[f])))
			return b
		}
		c.completeFstLevelObj = function (a, b, e) {
			if (a) {
				if (b)
					for (var f in b) !b.hasOwnProperty(f) || (a[f] && !e) || (a[f] = b[f])
			} else a = b
			return a
		}
		c.getObjectKeys = function (a) {
			var b = [],
				e
			for (e in a) a.hasOwnProperty(e) && b.push(e)
			return b
		}
		c.objectToLowercase = function (a) {
			var b = {},
				e
			for (e in a)
				a.hasOwnProperty(e) &&
					(c.isObject(a[e])
						? (b[e.toLowerCase()] = c.objectToLowercase(a[e]))
						: (b[e.toLowerCase()] = a[e]))
			return b
		}
		c.splitProtocolAndKey = function (a, b) {
			var e, f
			2 > a.length || ':' !== a[1]
				? ((e = ''), (f = a))
				: 4 > a.length || ':' !== a[3]
				? ((e = a.substring(0, 1)), (f = a.substring(2, a.length)))
				: ((e = a.substring(0, 3)), (f = a.substring(4, a.length)))
			b && ((e = e.toLowerCase()), (f = f.toLowerCase()))
			return { prefix: e, key: f }
		}
		c.jsonSerialize = function (b) {
			try {
				return 'undefined' !== typeof JSON && JSON.stringify
					? JSON.stringify(b)
					: a(b)
			} catch (d) {
				return null
			}
		}
		c.jsonParse = function (a) {
			try {
				return 'undefined' !== typeof JSON && JSON.parse
					? JSON.parse(a + '')
					: k(a)
			} catch (b) {
				return null
			}
		}
		c.trim = function (a) {
			try {
				return String.prototype.trim
					? a.trim()
					: a.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
			} catch (b) {
				return a
			}
		}
		c.arrayIndexOf = function (a, b) {
			if (Array.prototype.indexOf) {
				var e = -1
				'undefined' !== typeof a.indexOf(b) && (e = a.indexOf(b))
				return e
			}
			return function (a) {
				if (null == this) throw new TypeError()
				var b = Object(this),
					e = b.length >>> 0
				if (0 === e) return -1
				var h = 0
				1 < arguments.length &&
					((h = Number(arguments[1])),
					h != h
						? (h = 0)
						: 0 != h &&
						  Infinity != h &&
						  -Infinity != h &&
						  (h = (0 < h || -1) * Math.floor(Math.abs(h))))
				if (h >= e) return -1
				for (h = 0 <= h ? h : Math.max(e - Math.abs(h), 0); h < e; h++)
					if (h in b && b[h] === a) return h
				return -1
			}.apply(a, [b])
		}
		c.uuid = function () {
			function a(f) {
				var h = Math.random()
				try {
					e && (h = b.getRandomValues(new Uint32Array(1))[0] / Math.pow(2, 32))
				} catch (d) {}
				return Math.floor((9 * h + 1) * Math.pow(10, f - 1))
			}
			var b = window.crypto || window.msCrypto,
				e = null !== b && 'object' === typeof b
			return {
				v4: function () {
					try {
						if (e)
							return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
								/[018]/g,
								function (a) {
									return (
										a ^
										(b.getRandomValues(new Uint32Array(1))[0] & (15 >> (a / 4)))
									).toString(16)
								}
							)
					} catch (a) {}
					return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
						/[xy]/g,
						function (a) {
							var b = (16 * Math.random()) | 0
							return ('x' === a ? b : (b & 3) | 8).toString(16)
						}
					)
				},
				num: function (b) {
					var e = new Date(),
						d = function (a) {
							a -= 100 * Math.floor(a / 100)
							return 10 > a ? '0' + a : String(a)
						}
					return (
						d(e.getHours()) +
						'' +
						d(e.getMinutes()) +
						'' +
						d(e.getSeconds()) +
						'' +
						a(b - 6)
					)
				},
			}
		}
		c.isPreview = function () {
			return window.navigator && 'preview' === window.navigator.loadPurpose
		}
		c.isPrerender = function (a) {
			var b,
				e = !1,
				f = ['webkit', 'ms']
			if ('prerender' === document.visibilityState) b = 'visibilitychange'
			else
				for (var d = 0; d < f.length; d++)
					'prerender' === document[f[d] + 'VisibilityState'] &&
						(b = f[d] + 'visibilitychange')
			if ('undefined' !== typeof b) {
				var r = function (f) {
					a(f)
					c.removeEvtListener(document, b, r)
				}
				c.addEvtListener(document, b, r)
				e = !0
			}
			return e
		}
		c.addEvtListener = function (a, b, e) {
			a.addEventListener
				? a.addEventListener(b, e, !1)
				: a.attachEvent && a.attachEvent('on' + b, e)
		}
		c.removeEvtListener = function (a, b, e) {
			a.removeEventListener
				? a.removeEventListener(b, e, !1)
				: a.detachEvent && a.detachEvent('on' + b, e)
		}
		c.hashcode = function (a) {
			var b = 0
			if (0 === a.length) return b
			for (var e = 0; e < a.length; e++)
				var f = a.charCodeAt(e), b = (b << 5) - b + f, b = b | 0
			return b
		}
		c.setLocation = function (a) {
			var b = a.location
			a = window[a.target] || window
			b && (a.location.href = b)
		}
		c.dispatchCallbackEvent = function (a) {
			var b
			if ('function' === typeof window.Event) b = new Event('ATCallbackEvent')
			else
				try {
					;(b = document.createEvent('Event')),
						b.initEvent && b.initEvent('ATCallbackEvent', !0, !0)
				} catch (e) {}
			b &&
				'function' === typeof document.dispatchEvent &&
				((b.name = a), document.dispatchEvent(b))
		}
		c.addCallbackEvent = function (a) {
			c.addEvtListener(document, 'ATCallbackEvent', a)
		}
		c.removeCallbackEvent = function (a) {
			c.removeEvent('ATCallbackEvent', a)
		}
		;(function () {
			function a(b, e) {
				e = e || { bubbles: !1, cancelable: !1, detail: void 0 }
				var f
				try {
					;(f = document.createEvent('CustomEvent')),
						f.initCustomEvent(b, e.bubbles, e.cancelable, e.detail)
				} catch (d) {}
				return f
			}
			'function' === typeof window.CustomEvent
				? (window.ATCustomEvent = window.CustomEvent)
				: ('function' === typeof window.Event &&
						(a.prototype = window.Event.prototype),
				  (window.ATCustomEvent = a))
		})()
		c.addEvent = function (a, b, e, f) {
			c[a] = new ATCustomEvent(a, { detail: { name: b, id: e } })
			c.addEvtListener(document, a, f)
		}
		c.removeEvent = function (a, b) {
			c.removeEvtListener(document, a, b)
		}
		c.dispatchEvent = function (a, b) {
			c[a] = c[a] || new ATCustomEvent(a, { detail: { name: b, id: -1 } })
			try {
				document.dispatchEvent(c[a])
			} catch (e) {}
		}
		c.privacy = new (function () {
			function a(b, f) {
				var e = [],
					d,
					h
				d = {}
				for (var l = 0; l < b.length; l++) {
					d = {}
					c.object2Flatten(b[l], null, d, null, !0)
					for (var s in d)
						d.hasOwnProperty(s) && -1 === c.arrayIndexOf(f, s) && delete d[s]
					if (!c.isEmptyObject(d)) {
						h = {}
						for (var g in d) d.hasOwnProperty(g) && c.flatten2Object(h, g, d[g])
						d = c.getFormattedObject(h)
						e.push(d)
					}
				}
				return e
			}
			function b(a) {
				for (var f = [], d = {}, e = 0; e < a.length; e++)
					if ('string' === typeof a[e]) f.push(a[e])
					else
						for (var h in a[e])
							a[e].hasOwnProperty(h) &&
								(f.push(h), (d[h] = (d[h] || []).concat(a[e][h])))
				return { keys: f, values: d }
			}
			var e = this,
				f = { storageParams: null, bufferParams: null }
			e.CONSENTNO = 'Consent-NO'
			e.ALL = '*'
			e.testStorageParam = function (a, b) {
				var d
				if (f.storageParams instanceof Array) {
					for (var h, c = f.storageParams.length - 1; 0 <= c; c--)
						if (((h = f.storageParams[c]), 'string' === typeof h)) {
							if (h === a || h === e.ALL) return { toSetInStorage: !0 }
						} else {
							a: {
								d = a
								var l = b,
									s = void 0,
									g = void 0
								for (g in h)
									if (h.hasOwnProperty(g) && d === g) {
										if (!l) {
											d = !0
											break a
										}
										s = []
										h[g] instanceof Array ? (s = h[g]) : s.push(h[g])
										for (var k = 0; k < s.length; k++)
											if (s[k] === l) {
												d = !0
												break a
											}
									}
								d = !1
							}
							if (d) return { toSetInStorage: !0 }
						}
					return { toSetInStorage: !1 }
				}
				return { toSetInStorage: !0 }
			}
			e.processStorageParams = function (a, d, h) {
				if (h) {
					h = h()
					var m = b(f.storageParams)
					if (m.keys[0] !== e.ALL)
						for (var p in h)
							if (h.hasOwnProperty(p))
								if (-1 === c.arrayIndexOf(m.keys, p)) a && a(p)
								else if (c.isObject(h[p])) {
									var g = p,
										s = h[p].val,
										k = m.values[p],
										v = a,
										w = d
									if ('undefined' !== typeof k) {
										var x = []
										k instanceof Array ? (x = k) : x.push(k)
										k = void 0
										for (k in s)
											s.hasOwnProperty(k) &&
												-1 === c.arrayIndexOf(x, k) &&
												v &&
												v([g, k])
										v && w && c.isEmptyObject(w(g)) && v(g)
									}
								}
				}
			}
			e.testBufferParam = function (b, d) {
				var l, m
				if (f.bufferParams instanceof Array) {
					for (var p, g = f.bufferParams.length - 1; 0 <= g; g--)
						if (((p = f.bufferParams[g]), 'string' === typeof p)) {
							if (p === b || p === e.ALL) return { toSetInBuffer: !0, value: d }
						} else {
							a: {
								l = b
								m = d
								if (c.isObject(p)) {
									var s = void 0,
										k = [],
										v = !1,
										w = (s = s = void 0)
									for (w in p)
										if (
											p.hasOwnProperty(w) &&
											l === w &&
											((s = m),
											'string' === typeof s && (s = c.jsonParse(s) || s),
											'object' === typeof s)
										) {
											s instanceof Array ? ((k = s), (v = !0)) : k.push(s)
											s = a(k, p[w])
											0 === s.length
												? ((l = !1), (m = void 0))
												: ((s = v ? s : s[0]),
												  (l = !0),
												  (m = c.jsonSerialize(s)))
											break a
										}
								}
								l = !1
								m = void 0
							}
							if (l) return { toSetInBuffer: !0, value: m }
						}
					return { toSetInBuffer: !1 }
				}
				return { toSetInBuffer: !0, value: d }
			}
			e.processBufferParams = function (d, g, q) {
				if (g) {
					g = g()
					var m = b(f.bufferParams)
					if (m.keys[0] !== e.ALL)
						for (var p in g)
							if (g.hasOwnProperty(p))
								if (-1 === c.arrayIndexOf(m.keys, p)) d && d(p)
								else {
									var k = p,
										s = g[p],
										t = m.values[p],
										v = d,
										w = q
									if ('undefined' !== typeof t) {
										var x = [],
											y = s._value,
											B = [],
											A = !1,
											C = void 0,
											C = void 0
										t instanceof Array ? (x = t) : x.push(t)
										'string' === typeof y && (y = c.jsonParse(y) || y)
										'object' === typeof y &&
											(y instanceof Array ? ((B = y), (A = !0)) : B.push(y),
											(C = a(B, x)),
											0 === C.length
												? v && v(k)
												: ((C = A ? C : C[0]),
												  w && w(k, c.jsonSerialize(C), s._options)))
									}
								}
				}
			}
			e.setParameters = function (a) {
				f = a
			}
			e.getParameters = function () {
				return f
			}
			e.resetParameters = function () {
				f = { storageParams: null, bufferParams: null }
			}
		})()
		c.optedOut = null
		c.addOptOutEvent = function (a, b) {
			c.addEvent('ATOptOutEvent', 'clientsideuserid', a, b)
		}
		c.removeOptOutEvent = function (a) {
			c.removeEvent('ATOptOutEvent', a)
		}
		c.dispatchOptOutEvent = function (a) {
			c.optedOut = a
			c.dispatchEvent('ATOptOutEvent', 'clientsideuserid')
		}
		c.userOptedOut = function () {
			c.dispatchOptOutEvent(!0)
		}
		c.userOptedIn = function () {
			c.dispatchOptOutEvent(!1)
		}
		c.isOptedOut = function () {
			if (null === c.optedOut) {
				var a
				a: {
					a = null
					c.isLocalStorageAvailable() && (a = localStorage.getItem('atuserid'))
					if (null === a) {
						var b = /(?:^| )atuserid=([^;]+)/.exec(document.cookie)
						null !== b && (a = b[1])
					}
					if (null !== a)
						try {
							a = decodeURIComponent(a)
						} catch (d) {}
					if (
						a &&
						((a = c.jsonParse(a) || c.jsonParse(c.Base64.decode(a))),
						null !== a)
					) {
						a = 'OPT-OUT' === a.val
						break a
					}
					a = !1
				}
				c.optedOut = a
			}
			return !!c.optedOut
		}
		c.consentReceived = function (a) {
			c.consent = !!a
		}
		c.consent = !0
		c.isTabOpeningAction = function (a) {
			var b = !1
			a &&
				(a.ctrlKey ||
					a.shiftKey ||
					a.metaKey ||
					(a.button && 1 === a.button)) &&
				(b = !0)
			return b
		}
		c.CLICKS_REDIRECTION = 'redirection'
		c.CLICKS_FORM = 'form'
		c.CLICKS_MAILTO = 'mailto'
	}
	ATInternet.Utils = new Utils()
	var BuildManager = function (a) {
			var g = this,
				k = 0,
				c = 0,
				b = ['dz'],
				d = '',
				h = function (a, b, d, f, e, h, c) {
					a = '&' + a + '='
					return {
						param: a,
						paramSize: a.length,
						str: b,
						strSize: b.length,
						truncate: d,
						multihit: f,
						separator: e || '',
						encode: h,
						last: c,
					}
				},
				l = function (a, b) {
					var d = '',
						f = 0,
						e = 0,
						h = 0,
						f = -1,
						c = null,
						l = null,
						n
					for (n in a)
						a.hasOwnProperty(n) &&
							(c = a[n]) &&
							((f = b - e),
							c.last && null !== l
								? (l[n] = c)
								: c.strSize + c.paramSize <= f
								? ((d += c.param + c.str), (e += c.paramSize + c.strSize))
								: ((l = l || {}),
								  (l[n] = c),
								  c.truncate &&
										((h = f - c.paramSize),
										c.separator &&
											((f = c.str.substring(0, f)),
											(f = c.encode
												? f.lastIndexOf(encodeURIComponent(c.separator))
												: f.lastIndexOf(c.separator)),
											0 < f && (h = f)),
										(d += c.param + c.str.substring(0, h)),
										(e += c.paramSize + c.str.substring(0, h).length),
										(l[n].str = c.str.substring(h, c.strSize)),
										(l[n].strSize = l[n].str.length))))
					return [d, l]
				},
				e = function (d, f, e) {
					var n = '',
						g = function (f) {
							if (f === {}) return []
							var d = [],
								e
							e = {}
							var m = !1,
								g = void 0,
								p,
								s,
								r,
								k,
								q,
								v,
								t,
								w,
								D = '',
								z
							for (z in f)
								if (f.hasOwnProperty(z))
									if (
										((v = q = k = r = !1),
										(p = f[z]._value),
										(s = f[z]._options || {}),
										'boolean' === typeof s.encode && (r = s.encode),
										'function' === typeof p && (p = p()),
										(p =
											p instanceof Array
												? p.join(s.separator || ',')
												: 'object' === typeof p
												? ATInternet.Utils.jsonSerialize(p)
												: 'undefined' === typeof p
												? 'undefined'
												: p.toString()),
										r && (p = encodeURIComponent(p)),
										-1 < ATInternet.Utils.arrayIndexOf(b, z)
											? (k = !0)
											: 'boolean' === typeof s.truncate && (k = s.truncate),
										'boolean' === typeof s.multihit && (q = s.multihit),
										'boolean' === typeof s.last && (v = s.last),
										(p = h(z, p, k, q, s.separator, r, v)),
										q)
									)
										(c -= p.paramSize + p.strSize), (D += p.param + p.str)
									else if (v)
										p.paramSize + p.strSize > c &&
											((p.str = p.str.substring(0, c - p.paramSize)),
											(p.strSize = p.str.length)),
											(t = z),
											(w = p)
									else if (
										((e[z] = p),
										e[z].paramSize + e[z].strSize > c && !e[z].truncate)
									) {
										a.emit('Tracker:Hit:Build:Error', {
											lvl: 'ERROR',
											msg: 'Too long parameter: "' + e[z].param + '"',
											details: { value: e[z].str },
										})
										m = !0
										g = z
										break
									}
							t && (e[t] = w)
							e = [e, m, g, D]
							f = e[0]
							m = e[1]
							n = e[3]
							m &&
								((e = e[2]),
								(f = f[e]),
								(f.str = f.str.substring(0, c - f.paramSize)),
								(f.strSize = f.str.length),
								(m = {}),
								(m.mherr = h('mherr', '1', !1, !1, '', !1, !1)),
								(m[e] = f),
								(f = m))
							f = l(f, c)
							if (null === f[1]) d = f[0]
							else
								for (d.push(f[0]); null !== f[1]; )
									(f = l(f[1], c)), d.push(f[0])
							return d
						},
						k = ''
					a.buffer.presentInFilters(f, 'hitType') ||
						(f = a.buffer.addInFilters(f, 'hitType', ['page']))
					f = a.buffer.addInFilters(f, 'hitType', ['all'])
					var r, w
					if (ATInternet.Utils.isObject(d)) {
						f = a.buffer.addInFilters(f, 'permanent', !0)
						f = a.buffer.get(f, !0)
						for (r in d)
							d.hasOwnProperty(r) &&
								((k = {}),
								d[r] &&
								'object' === typeof d[r] &&
								d[r].hasOwnProperty('_value')
									? ((w = d[r]._value),
									  d[r].hasOwnProperty('_options') && (k = d[r]._options))
									: (w = d[r]),
								(w = ATInternet.Utils.privacy.testBufferParam(r, w)),
								w.toSetInBuffer && (f[r] = { _value: w.value, _options: k }))
						k = g(f)
					} else
						for (r in ((f = a.buffer.get(f, !0)), (k = g(f)), f))
							f.hasOwnProperty(r) &&
								((f[r]._options && f[r]._options.permanent) || a.buffer.del(r))
					e && e(k, n)
				}
			g.getCollectDomain = function () {
				var b = '',
					b = a.getConfig('logSSL') || a.getConfig('log'),
					f = a.getConfig('domain')
				return (b =
					b && f
						? b + '.' + f
						: a.getConfig('collectDomainSSL') || a.getConfig('collectDomain'))
			}
			var f = function (b) {
					var f = '',
						d = a.getConfig('baseURL')
					if (d) f = d
					else {
						var d = g.getCollectDomain(),
							e = a.getConfig('pixelPath'),
							e = e || '/'
						'/' !== e.charAt(0) && (e = '/' + e)
						d &&
							(f = (a.getConfig('forceHttp') ? 'http://' : 'https://') + d + e)
					}
					d = a.getConfig('site')
					f && d
						? b && b(null, f + '?s=' + d)
						: b && b({ message: 'Config error' })
				},
				n = function (a, b, d) {
					f(function (f, h) {
						f
							? d && d(f)
							: ((c = k - (h.length + 27)),
							  e(a, b, function (a, b) {
									var f = [],
										e = ATInternet.Utils.uuid().num(13)
									if (a instanceof Array)
										for (var c = 1; c <= a.length; c++)
											f.push(
												h + b + '&mh=' + c + '-' + a.length + '-' + e + a[c - 1]
											)
									else f.push(h + b + a)
									d && d(null, f)
							  }))
					})
				},
				r = function (b, f, d, e, h, c, l) {
					return (function () {
						return function (n) {
							a.emit(b, {
								lvl: h,
								details: {
									hit: f,
									method: d,
									event: n,
									isMultiHit: c,
									elementType: l,
								},
							})
							e && e()
						}
					})()
				}
			g.send = function (b, f, d, e, h) {
				n(b, f, function (b, f) {
					if (b)
						a.emit('Tracker:Hit:Build:Error', {
							lvl: 'ERROR',
							msg: b.message,
							details: {},
						}),
							d && d()
					else for (var c = 0; c < f.length; c++) g.sendUrl(f[c], d, e, h)
				})
			}
			k = Math.max(a.getConfig('maxHitSize') || 0, 2e3)
			c = Math.max(a.getConfig('maxHitSize') || 0, 2e3)
			d = a.getConfig('requestMethod')
			g.sendUrl = function (b, f, e, h) {
				var c = -1 < b.indexOf('&mh=')
				e = e || d
				ATInternet.Utils.isOptedOut() && !a.getConfig('sendHitWhenOptOut')
					? r('Tracker:Hit:Sent:NoTrack', b, e, f, 'INFO', c, h)()
					: 'POST' === e && ATInternet.Utils.isBeaconMethodAvailable()
					? ((h = 'Tracker:Hit:Sent:Error'),
					  (e = 'ERROR'),
					  window.navigator.sendBeacon(b, null) &&
							((h = 'Tracker:Hit:Sent:Ok'), (e = 'INFO')),
					  r(h, b, 'POST', f, e, c, '')())
					: ((e = new Image()),
					  (e.onload = r('Tracker:Hit:Sent:Ok', b, 'GET', f, 'INFO', c, h)),
					  (e.onerror = r(
							'Tracker:Hit:Sent:Error',
							b,
							'GET',
							f,
							'ERROR',
							c,
							h
					  )),
					  (e.src = b))
			}
		},
		TriggersManager = function () {
			function a(a, d, h) {
				for (var c = [], e = 0; e < a.length; e++)
					a[e].callback(d, h), a[e].singleUse || c.push(a[e])
				return c
			}
			function g(a, d, h, c) {
				var e = a.shift()
				if ('*' === e)
					return (
						(d['*'] = d['*'] || []),
						d['*'].push({ callback: h, singleUse: c }),
						d['*'].length - 1
					)
				if (0 === a.length) return g([e, '*'], d, h, c)
				d['*'] = d['*'] || []
				d[e] = d[e] || {}
				return g(a, d[e], h, c)
			}
			function k(b, d, h, c) {
				var e = d.shift()
				'*' !== e &&
					(0 === d.length
						? k(b, [e, '*'], h, c)
						: h[e] && ((h[e]['*'] = a(h[e]['*'], b, c)), k(b, d, h[e], c)))
			}
			var c = {}
			this.on = function (a, d, h) {
				h = h || !1
				return g(a.split(':'), c, d, h)
			}
			this.emit = function (b, d) {
				c['*'] && (c['*'] = a(c['*'], b, d))
				k(b, b.split(':'), c, d)
			}
		},
		PluginsManager = function (a) {
			var g = {},
				k = {},
				c = 0,
				b = {},
				d = 0,
				h = function (a) {
					var b = !1
					g[a] && (b = !0)
					return b
				},
				l = (this.unload = function (b) {
					h(b)
						? ((g[b] = void 0),
						  a.emit('Tracker:Plugin:Unload:' + b + ':Ok', { lvl: 'INFO' }))
						: a.emit('Tracker:Plugin:Unload:' + b + ':Error', {
								lvl: 'ERROR',
								msg: 'not a known plugin',
						  })
					return a
				}),
				e = (this.load = function (b, f) {
					'function' === typeof f
						? 'undefined' === typeof a.getConfig.plgAllowed ||
						  0 === a.getConfig.plgAllowed.length ||
						  -1 < a.getConfig.plgAllowed.indexOf(b)
							? ((g[b] = new f(a)),
							  k[b] &&
									h(b) &&
									((k[b] = !1),
									c--,
									h(b + '_ll') && l(b + '_ll'),
									0 === c &&
										a.emit('Tracker:Plugin:Lazyload:File:Complete', {
											lvl: 'INFO',
											msg: 'LazyLoading triggers are finished',
										})),
							  a.emit('Tracker:Plugin:Load:' + b + ':Ok', { lvl: 'INFO' }))
							: a.emit('Tracker:Plugin:Load:' + b + ':Error', {
									lvl: 'ERROR',
									msg: 'Plugin not allowed',
									details: {},
							  })
						: a.emit('Tracker:Plugin:Load:' + b + ':Error', {
								lvl: 'ERROR',
								msg: 'not a function',
								details: { obj: f },
						  })
					return a
				}),
				f = (this.isLazyloading = function (a) {
					return a ? !0 === k[a] : 0 !== c
				}),
				n = function (a) {
					return !h(a) && !f(a) && h(a + '_ll')
				},
				r = function (b) {
					k[b] = !0
					c++
					ATInternet.Utils.loadScript({
						url: a.getConfig('lazyLoadingPath') + b + '.js',
					})
				},
				q = function (a) {
					return n(a) ? (r(a), !0) : !1
				},
				m = function (a) {
					b[a] ? b[a]++ : (b[a] = 1)
					d++
				},
				p = function (a, b, f, d) {
					var e = null
					b = b.split('.')
					h(a) &&
						g[a][b[0]] &&
						(e =
							1 < b.length && g[a][b[0]][b[1]]
								? g[a][b[0]][b[1]].apply(g[a], f)
								: g[a][b[0]].apply(g[a], f))
					d && d(e)
				},
				u = function (f, e, h, c) {
					m(f)
					a.onTrigger(
						'Tracker:Plugin:Load:' + f + ':Ok',
						function () {
							p(f, e, h, function (e) {
								b[f]--
								d--
								0 === d &&
									a.emit('Tracker:Plugin:Lazyload:Exec:Complete', {
										lvl: 'INFO',
										msg: 'All exec waiting for lazyloading are done',
									})
								c && c(e)
							})
						},
						!0
					)
				},
				s = function (a) {
					for (var b = { mcount: 0, plugins: {} }, f = 0; f < a.length; f++)
						g.hasOwnProperty(a[f]) || (b.mcount++, (b.plugins[a[f]] = !0))
					return b
				}
			this.isExecWaitingLazyloading = function () {
				return 0 !== d
			}
			a.exec = this.exec = function (a, b, d, e) {
				n(a) ? (u(a, b, d, e), r(a)) : f(a) ? u(a, b, d, e) : p(a, b, d, e)
			}
			this.waitForDependencies = function (b, f) {
				var d = s(b)
				if (0 === d.mcount)
					a.emit('Tracker:Plugin:Dependencies:Loaded', {
						lvl: 'INFO',
						details: { dependencies: b },
					}),
						f()
				else
					for (var e in d.plugins)
						d.plugins.hasOwnProperty(e) &&
							(a.emit('Tracker:Plugin:Dependencies:Error', {
								lvl: 'WARNING',
								msg: 'Missing plugin ' + e,
							}),
							a.onTrigger(
								'Tracker:Plugin:Load:' + e,
								function (a, b) {
									var e = a.split(':'),
										h = e[3]
									'Ok' === e[4] &&
										((d.plugins[h] = !1), d.mcount--, 0 === d.mcount && f())
								},
								!0
							),
							q(e))
			}
			this.init = function () {
				for (var a in ATInternet.Tracker.pluginProtos)
					ATInternet.Tracker.pluginProtos.hasOwnProperty(a) &&
						e(a, ATInternet.Tracker.pluginProtos[a])
			}
		},
		CallbacksManager = function (a) {
			var g = this,
				k = {},
				c = function (b) {
					if (b.name) {
						var d = !0,
							h = a.getConfig('callbacks')
						'undefined' !== typeof h &&
							(h.include instanceof Array &&
								-1 === ATInternet.Utils.arrayIndexOf(h.include, b.name) &&
								(d = !1),
							h.exclude instanceof Array &&
								-1 !== ATInternet.Utils.arrayIndexOf(h.exclude, b.name) &&
								(d = !1))
						ATInternet.Callbacks &&
							ATInternet.Callbacks.hasOwnProperty(b.name) &&
							((h = {}),
							(h[b.name] = { function: ATInternet.Callbacks[b.name] }),
							d && g.load(b.name, h[b.name]['function']),
							ATInternet.Tracker.callbackProtos[b.name] ||
								(ATInternet.Tracker.callbackProtos[b.name] = h[b.name]))
					}
				}
			g.load = function (b, d) {
				'function' === typeof d
					? (new d(a),
					  a.emit('Tracker:Callback:Load:' + b + ':Ok', {
							lvl: 'INFO',
							details: { obj: d },
					  }))
					: a.emit('Tracker:Callback:Load:' + b + ':Error', {
							lvl: 'ERROR',
							msg: 'not a function',
							details: { obj: d },
					  })
				return a
			}
			g.init = function () {
				if (a.getConfig('activateCallbacks')) {
					var b = a.getConfig('callbacks')
					if ('undefined' !== typeof b && b.include instanceof Array)
						for (var d = 0; d < b.include.length; d++)
							ATInternet.Callbacks &&
								ATInternet.Callbacks.hasOwnProperty(b.include[d]) &&
								((k[b.include[d]] = {
									function: ATInternet.Callbacks[b.include[d]],
								}),
								ATInternet.Tracker.callbackProtos[b.include[d]] ||
									(ATInternet.Tracker.callbackProtos[b.include[d]] =
										k[b.include[d]]))
					else
						for (d in ATInternet.Callbacks)
							ATInternet.Callbacks.hasOwnProperty(d) &&
								((k[d] = { function: ATInternet.Callbacks[d] }),
								ATInternet.Tracker.callbackProtos[d] ||
									(ATInternet.Tracker.callbackProtos[d] = k[d]))
					if ('undefined' !== typeof b && b.exclude instanceof Array)
						for (d = 0; d < b.exclude.length; d++) delete k[b.exclude[d]]
					for (var h in k)
						k.hasOwnProperty(h) && k[h] && g.load(h, k[h]['function'])
					ATInternet.Utils.addCallbackEvent(c)
				}
			}
			g.removeCallbackEvent = function () {
				ATInternet.Utils.removeCallbackEvent(c)
			}
		},
		BufferManager = function (a) {
			var g = this,
				k = {}
			g.set = function (a, b, c) {
				b = ATInternet.Utils.privacy.testBufferParam(a, b)
				b.toSetInBuffer &&
					((c = c || {}),
					(c.hitType = c.hitType || ['page']),
					(k[a] = { _value: b.value, _options: c }))
			}
			var c = function (a, b, c) {
					return (a = ATInternet.Utils.cloneSimpleObject(a[b])) && !c
						? a._value
						: a
				},
				b = function h(a, b) {
					if (!(a && b instanceof Array && a instanceof Array)) return []
					if (0 === a.length) return b
					var f = a[0],
						c,
						g = [],
						q = ATInternet.Utils.cloneSimpleObject(a)
					q.shift()
					for (var m = 0; m < b.length; m++)
						if ('object' !== typeof f[1])
							k[b[m]] && k[b[m]]._options[f[0]] === f[1] && g.push(b[m])
						else {
							c = f[1].length
							for (var p = 0; p < c; p++)
								if (
									k[b[m]] &&
									k[b[m]]._options[f[0]] instanceof Array &&
									0 <=
										ATInternet.Utils.arrayIndexOf(
											k[b[m]]._options[f[0]],
											f[1][p]
										)
								) {
									g.push(b[m])
									break
								}
						}
					return h(q, g)
				}
			g.get = function (a, g) {
				var e = {}
				if ('string' === typeof a) e = c(k, a, g)
				else
					for (
						var f = b(a, ATInternet.Utils.getObjectKeys(k)), n = 0;
						n < f.length;
						n++
					)
						e[f[n]] = c(k, f[n], g)
				return e
			}
			g.presentInFilters = function (a, b) {
				return a && 0 !== a.length
					? a[0][0] === b
						? !0
						: g.presentInFilters(a.slice(1), b)
					: !1
			}
			g.addInFilters = function (a, b, e, f) {
				if (!a || 0 === a.length) return f ? [] : [[b, e]]
				var c = a[0][0],
					r = a[0][1]
				c === b &&
					(r instanceof Array &&
						-1 === ATInternet.Utils.arrayIndexOf(r, e[0]) &&
						r.push(e[0]),
					(f = !0))
				return [[c, r]].concat(g.addInFilters(a.slice(1), b, e, f))
			}
			g.del = function (a) {
				k[a] = void 0
			}
			g.clear = function () {
				k = {}
			}
		},
		PropertiesManager = function (a) {
			var g = this,
				k = {}
			g.setProp = function (a, b, d) {
				'undefined' !== typeof a && (k[a] = { value: b, persistent: !!d })
			}
			g.setProps = function (a, b) {
				if (ATInternet.Utils.isObject(a))
					for (var d in a) a.hasOwnProperty(d) && g.setProp(d, a[d], b)
			}
			g.delProp = function (c, b) {
				'undefined' !== typeof k[c] && delete k[c]
				!b && a.delParam(c.toLowerCase())
			}
			g.delProps = function (a) {
				for (var b in k) k.hasOwnProperty(b) && g.delProp(b, a)
			}
			g.getProp = function (a) {
				k = k || {}
				return k[a]
			}
			g.getProps = function () {
				return k
			}
		},
		Tag = function (a, g, k) {
			g = g || {}
			var c = this
			c.version = '5.27.0'
			var b = ATInternet.Utils.cloneSimpleObject(g)
			c.triggers = new TriggersManager(c)
			c.emit = c.triggers.emit
			c.onTrigger = c.triggers.on
			var d = ATInternet.Utils.cloneSimpleObject(dfltGlobalCfg) || {},
				h
			for (h in a) a.hasOwnProperty(h) && (d[h] = a[h])
			c.getConfig = function (a) {
				return d[a]
			}
			c.setConfig = function (a, b, h) {
				;(void 0 !== d[a] && h) ||
					(c.emit('Tracker:Config:Set:' + a, {
						lvl: 'INFO',
						details: { bef: d[a], aft: b },
					}),
					(d[a] = b))
			}
			c.configPlugin = function (a, b, h) {
				d[a] = d[a] || {}
				for (var g in b)
					b.hasOwnProperty(g) && void 0 === d[a][g] && (d[a][g] = b[g])
				h &&
					(h(d[a]),
					c.onTrigger('Tracker:Config:Set:' + a, function (a, b) {
						h(b.details.aft)
					}))
				return d[a]
			}
			c.getAllContext = function () {
				return b
			}
			c.getContext = function (a) {
				return b[a]
			}
			c.setContext = function (a, f) {
				c.emit('Tracker:Context:Set:' + a, {
					lvl: 'INFO',
					details: { bef: b[a], aft: f },
				})
				b[a] = f
			}
			c.delContext = function (a, f) {
				c.emit('Tracker:Context:Deleted:' + a + ':' + f, {
					lvl: 'INFO',
					details: { key1: a, key2: f },
				})
				if (a)
					b.hasOwnProperty(a) &&
						(f
							? b[a] && b[a].hasOwnProperty(f) && (b[a][f] = void 0)
							: (b[a] = void 0))
				else if (f)
					for (var d in b)
						b.hasOwnProperty(d) &&
							b[d] &&
							b[d].hasOwnProperty(f) &&
							(b[d][f] = void 0)
			}
			c.plugins = new PluginsManager(c)
			c.buffer = new BufferManager(c)
			c.setParam = c.buffer.set
			c.getParams = function (a) {
				return c.buffer.get(a, !1)
			}
			c.getParam = c.buffer.get
			c.delParam = c.buffer.del
			c.builder = new BuildManager(c)
			c.sendUrl = c.builder.sendUrl
			c.callbacks = new CallbacksManager(c)
			c.properties = new PropertiesManager(c)
			c.setProp = c.properties.setProp
			c.setProps = c.properties.setProps
			c.delProp = c.properties.delProp
			c.delProps = c.properties.delProps
			c.getProp = c.properties.getProp
			c.getProps = c.properties.getProps
			c.sendHit = function (a, b, d, h, g) {
				var m = c.getProps(),
					p,
					l
				for (l in m)
					m.hasOwnProperty(l) &&
						((p = m[l].value),
						m[l].persistent
							? c.setParam(l.toLowerCase(), p, {
									permanent: !0,
									hitType: ['all'],
									encode: !0,
							  })
							: (ATInternet.Utils.isObject(a)
									? (a[l.toLowerCase()] = {
											_value: p,
											_options: { hitType: ['all'], encode: !0 },
									  })
									: c.setParam(l.toLowerCase(), p, {
											hitType: ['all'],
											encode: !0,
									  }),
							  c.delProp(l, !0)))
				c.builder.send(a, b, d, h, g)
			}
			ATInternet.Utils.privacy.resetParameters()
			c.setParam(
				'ts',
				function () {
					return new Date().getTime()
				},
				{ permanent: !0, hitType: ['all'] }
			)
			;(c.getConfig('disableCookie') || c.getConfig('disableStorage')) &&
				c.setParam('idclient', ATInternet.Utils.privacy.CONSENTNO, {
					permanent: !0,
					hitType: ['all'],
				})
			c.getConfig('medium') &&
				c.setParam('medium', c.getConfig('medium'), {
					permanent: !0,
					hitType: ['all'],
				})
			if (
				c.getConfig('urlPropertyAuto') &&
				'undefined' !== typeof window &&
				'undefined' !== typeof window.location
			) {
				h = (
					c.getConfig('urlPropertyQueryString')
						? window.location.href
						: window.location.protocol +
						  '//' +
						  window.location.host +
						  window.location.pathname
				)
					.replace(/[<>]/g, '')
					.substring(0, 1600)
					.replace(/&/g, '$')
				var l = c.getContext('page') || {}
				l.url = window.encodeURIComponent(h)
				c.setContext('page', l)
				c.setParam('page_url', h, {
					permanent: !0,
					hitType:
						'page click publisher selfPromotion onSiteAdsClick onSiteAdsImpression InternalSearch mvtesting richmedia'.split(
							' '
						),
				})
			}
			c.plugins.init()
			c.callbacks.init()
			c.emit('Tracker:Ready', {
				lvl: 'INFO',
				msg: 'Tracker initialized',
				details: { tracker: c, args: { config: a, context: g, callback: k } },
			})
			k && k(c)
			ATInternet.Tracker.instances.push(c)
		}
	ATInternet.Tracker.Tag = Tag
	ATInternet.Tracker.instances = []
	ATInternet.Tracker.pluginProtos = {}
	ATInternet.Tracker.addPlugin = function (a, g) {
		g = g || ATInternet.Tracker.Plugins[a]
		if (!ATInternet.Tracker.pluginProtos[a]) {
			ATInternet.Tracker.pluginProtos[a] = g
			for (var k = 0; k < ATInternet.Tracker.instances.length; k++)
				ATInternet.Tracker.instances[k].plugins.load(a, g)
		}
	}
	ATInternet.Tracker.delPlugin = function (a) {
		if (ATInternet.Tracker.pluginProtos[a]) {
			ATInternet.Tracker.pluginProtos[a] = void 0
			for (var g = 0; g < ATInternet.Tracker.instances.length; g++)
				ATInternet.Tracker.instances[g].plugins.unload(a)
		}
	}
	ATInternet.Tracker.callbackProtos = {}
}

function pluginCampaign() {
	var dfltPluginCfg = {
		lifetime: 30,
		lastPersistence: true,
		domainAttribution: true,
		enableUTMTracking: true,
		UTMParameters: [
			'utm_source',
			'utm_medium',
			'utm_campaign',
			'utm_term',
			'utm_content',
		],
		querystringPrefix: 'at_',
	}
	var dfltGlobalCfg = { visitLifetime: 30, redirectionLifetime: 30 }
	ATInternet.Tracker.Plugins.Campaigns = function (a) {
		a.setConfig('visitLifetime', dfltGlobalCfg.visitLifetime, !0)
		a.setConfig('redirectionLifetime', dfltGlobalCfg.redirectionLifetime, !0)
		var g = {},
			k,
			c
		a.configPlugin('Campaigns', dfltPluginCfg || {}, function (a) {
			g = a
		})
		var b,
			d,
			h,
			l,
			e,
			f,
			n,
			r,
			q,
			m,
			p,
			u,
			s,
			t = function () {
				var b = function (a) {
						var b = ''
						a &&
							(b =
								isNaN(a) &&
								-1 === a.search(/^\[(.*?)\]$/g) &&
								-1 === a.search(/^\d+\[(.*?)\]$/g)
									? '[' + a + ']'
									: a)
						return b
					},
					f = function (a) {
						var b = a
						;-1 !== a.search(/[-]/g) &&
							-1 === a.search(/^\[(.*?)\]$/g) &&
							(b = '[' + a + ']')
						return b
					},
					d = function (a) {
						for (; '-' === a.charAt(a.length - 1); )
							a = a.substring(0, a.length - 1)
						return a
					}
				this.SponsoredLinks = function () {
					var e = {
							google: 'goo',
							yahoo: 'ysm',
							miva: 'miv',
							orange: 'wan',
							msn: 'msn',
							mirago: 'mir',
							sklik: 'skl',
							adfox: 'adf',
							etarget: 'etg',
							yandex: 'yan',
							ebay: 'eba',
							searchalliance: 'sal',
							bing: 'bin',
							naver: 'nav',
							baidu: 'bdu',
							qwant: 'qwt',
							waze: 'waz',
							amazon: 'amz',
						},
						c = { search: 's', content: 'c' }
					this.atMedium = 'sl'
					this.atTerm =
						this.atNetwork =
						this.atVariant =
						this.atCreation =
						this.atPlatform =
						this.atCampaign =
							''
					this.format = function () {
						var a = 'sec',
							h = b(this.atCampaign),
							g = e[this.atPlatform] || f(this.atPlatform),
							m = b(this.atCreation),
							l = b(this.atVariant),
							n = c[this.atNetwork] || f(this.atNetwork),
							p = b(this.atTerm)
						return d(
							a + ('-' + h + '-' + g + '-' + m + '-' + l + '-' + n + '-' + p)
						)
					}
					this.setProperties = function (b) {
						this.atCampaign =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'campaign',
								b
							) || ''
						this.atPlatform =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'platform',
								b
							) || ''
						this.atCreation =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'creation',
								b
							) || ''
						this.atVariant =
							a.utils.getQueryStringValue(g.querystringPrefix + 'variant', b) ||
							''
						this.atNetwork =
							a.utils.getQueryStringValue(g.querystringPrefix + 'network', b) ||
							''
						this.atTerm =
							a.utils.getQueryStringValue(g.querystringPrefix + 'term', b) || ''
						a.setContext('campaigns_events', {
							$: this.atMedium,
							campaign: this.atCampaign,
							platform: this.atPlatform,
							creation: this.atCreation,
							variant: this.atVariant,
							network: this.atNetwork,
							term: this.atTerm,
						})
					}
				}
				this.Email = function () {
					var e = { acquisition: 'erec', retention: 'epr', promotion: 'es' }
					this.atMedium = 'email'
					this.atSendTime =
						this.atRecipientList =
						this.atRecipientId =
						this.atLink =
						this.atSendDate =
						this.atCreation =
						this.atCampaign =
						this.atEmailtype =
							''
					this.format = function () {
						var a = e[this.atEmailtype] || e.promotion,
							c = b(this.atCampaign),
							h = b(this.atCreation),
							g = f(this.atSendDate),
							m = b(this.atLink),
							l =
								f(this.atRecipientId) +
								(this.atRecipientList ? '@' + f(this.atRecipientList) : ''),
							n = f(this.atSendTime)
						return d(
							a + ('-' + c + '-' + h + '-' + g + '-' + m + '-' + l + '-' + n)
						)
					}
					this.setProperties = function (b) {
						this.atEmailtype =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'emailtype',
								b
							) || ''
						this.atCampaign =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'campaign',
								b
							) || ''
						this.atCreation =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'creation',
								b
							) || ''
						this.atSendDate =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'send_date',
								b
							) || ''
						this.atLink =
							a.utils.getQueryStringValue(g.querystringPrefix + 'link', b) || ''
						this.atRecipientId =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'recipient_id',
								b
							) || ''
						this.atRecipientList =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'recipient_list',
								b
							) || ''
						this.atSendTime =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'send_time',
								b
							) || ''
						a.setContext('campaigns_events', {
							$: this.atMedium,
							emailtype: this.atEmailtype,
							campaign: this.atCampaign,
							creation: this.atCreation,
							send_date: this.atSendDate,
							link: this.atLink,
							recipient_id: this.atRecipientId,
							recipient_list: this.atRecipientList,
							send_time: this.atSendTime,
						})
					}
				}
				this.Affiliate = function () {
					this.atMedium = 'affiliate'
					this.atVariant =
						this.atCreation =
						this.atFormat =
						this.atIdentifier =
						this.atType =
						this.atCampaign =
							''
					this.format = function () {
						var a = 'al',
							f = b(this.atCampaign),
							e = b(this.atType),
							c = b(this.atIdentifier),
							h = b(this.atFormat),
							g = b(this.atCreation),
							m = b(this.atVariant)
						return d(
							a + ('-' + f + '-' + e + '-' + c + '-' + h + '-' + g + '-' + m)
						)
					}
					this.setProperties = function (b) {
						this.atCampaign =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'campaign',
								b
							) || ''
						this.atType =
							a.utils.getQueryStringValue(g.querystringPrefix + 'type', b) || ''
						this.atIdentifier =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'identifier',
								b
							) || ''
						this.atFormat =
							a.utils.getQueryStringValue(g.querystringPrefix + 'format', b) ||
							''
						this.atCreation =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'creation',
								b
							) || ''
						this.atVariant =
							a.utils.getQueryStringValue(g.querystringPrefix + 'variant', b) ||
							''
						a.setContext('campaigns_events', {
							$: this.atMedium,
							campaign: this.atCampaign,
							type: this.atType,
							identifier: this.atIdentifier,
							format: this.atFormat,
							creation: this.atCreation,
							variant: this.atVariant,
						})
					}
				}
				this.Display = function () {
					this.atMedium = 'display'
					this.atDetailPlacement =
						this.atGeneralPlacement =
						this.atChannel =
						this.atFormat =
						this.atVariant =
						this.atCreation =
						this.atCampaign =
							''
					this.format = function () {
						var a = 'ad',
							f = b(this.atCampaign),
							e = b(this.atCreation),
							c = b(this.atVariant),
							h = b(this.atFormat),
							g = b(this.atChannel),
							m = b(this.atGeneralPlacement),
							l = b(this.atDetailPlacement)
						return d(
							a +
								('-' +
									f +
									'-' +
									e +
									'-' +
									c +
									'-' +
									h +
									'-' +
									g +
									'-' +
									m +
									'-' +
									l)
						)
					}
					this.setProperties = function (b) {
						this.atCampaign =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'campaign',
								b
							) || ''
						this.atCreation =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'creation',
								b
							) || ''
						this.atVariant =
							a.utils.getQueryStringValue(g.querystringPrefix + 'variant', b) ||
							''
						this.atFormat =
							a.utils.getQueryStringValue(g.querystringPrefix + 'format', b) ||
							''
						this.atChannel =
							a.utils.getQueryStringValue(g.querystringPrefix + 'channel', b) ||
							''
						this.atGeneralPlacement =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'general_placement',
								b
							) || ''
						this.atDetailPlacement =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'detail_placement',
								b
							) || ''
						a.setContext('campaigns_events', {
							$: this.atMedium,
							campaign: this.atCampaign,
							creation: this.atCreation,
							variant: this.atVariant,
							format: this.atFormat,
							channel: this.atChannel,
							general_placement: this.atGeneralPlacement,
							detail_placement: this.atDetailPlacement,
						})
					}
				}
				this.Custom = function () {
					this.atCustom4 =
						this.atCustom3 =
						this.atCustom2 =
						this.atCustom1 =
						this.atCampaign =
						this.atMedium =
							''
					this.format = function () {
						var a = ''
						;/\d+$/.test(this.atMedium) && (a = /\d+$/.exec(this.atMedium)[0])
						var a = 'cs' + a,
							f = b(this.atCampaign),
							e = b(this.atCustom1),
							c = b(this.atCustom2),
							h = b(this.atCustom3),
							g = b(this.atCustom4)
						return d(a + ('-' + f + '-' + e + '-' + c + '-' + h + '-' + g))
					}
					this.setProperties = function (b) {
						this.atMedium =
							a.utils.getQueryStringValue(g.querystringPrefix + 'medium', b) ||
							''
						this.atCampaign =
							a.utils.getQueryStringValue(
								g.querystringPrefix + 'campaign',
								b
							) || ''
						this.atCustom1 =
							a.utils.getQueryStringValue(g.querystringPrefix + 'custom1', b) ||
							''
						this.atCustom2 =
							a.utils.getQueryStringValue(g.querystringPrefix + 'custom2', b) ||
							''
						this.atCustom3 =
							a.utils.getQueryStringValue(g.querystringPrefix + 'custom3', b) ||
							''
						this.atCustom4 =
							a.utils.getQueryStringValue(g.querystringPrefix + 'custom4', b) ||
							''
						a.setContext('campaigns_events', {
							$: this.atMedium,
							campaign: this.atCampaign,
							custom1: this.atCustom1,
							custom2: this.atCustom2,
							custom3: this.atCustom3,
							custom4: this.atCustom4,
						})
					}
				}
				this.medium = {
					sl: this.SponsoredLinks,
					email: this.Email,
					affiliate: this.Affiliate,
					display: this.Display,
				}
			},
			v = function (b, f) {
				var d = a.getContext('campaigns') || {}
				d[b] = f
				a.setContext('campaigns', d)
			},
			w = function () {
				var b = a.utils.getLocation(),
					f = function () {
						for (var f = g.UTMParameters, d, e = 0; e < f.length; e++)
							(d = a.utils.getQueryStringValue(f[e], b)) && v(f[e], d)
					}
				;(function () {
					var f = a.utils.getQueryStringValue(g.querystringPrefix + 'medium', b)
					if (f) {
						var d = new t(),
							f =
								'function' === typeof d.medium[f]
									? new d.medium[f]()
									: new d.Custom()
						f.setProperties(b)
						n = f.format()
					} else n = a.utils.getQueryStringValue('xtor', b)
					r = a.utils.getQueryStringValue('xtdt', b)
					q = a.utils.getQueryStringValue('xts', b)
				})()
				g.enableUTMTracking && f()
			},
			x = function (b, f) {
				var d = a.storage[c](b)
				if (null !== d) return 'object' === typeof d && !(d instanceof Array)
				a.storage[k](b, {}, f)
				return !0
			}
		;(function () {
			a.plugins.waitForDependencies(['Storage', 'Utils'], function () {
				k = 'set' + (g.domainAttribution ? '' : 'Private')
				c = 'get' + (g.domainAttribution ? '' : 'Private')
				b = a.storage[c](['atredir', 'gopc'])
				d = a.storage[c](['atredir', 'gopc_err'])
				h = a.storage[c](['atredir', 'camp'])
				a.storage.del(['atredir', 'gopc'])
				a.storage.del(['atredir', 'gopc_err'])
				a.storage.del(['atredir', 'camp'])
				l = a.storage[c](['atsession', 'histo_camp'])
				e = a.storage[c](['atreman', 'camp'])
				f = a.storage[c](['atreman', 'date'])
				w()
				m = a.getContext('forcedCampaign')
				p = !!a.getConfig('redirect')
				u = !!(n && r && q)
				s = !1
				if (u) {
					var t = new Date().getTime() / 6e4
					s =
						(!p && q !== a.getConfig('site')) ||
						0 > t - r ||
						t - r >= a.getConfig('visitLifetime')
				}
				t = m || h || n
				if (
					p &&
					t &&
					x('atredir', { path: '/', end: a.getConfig('redirectionLifetime') })
				) {
					a.storage[k](['atredir', 'camp'], t)
					var B = (t = !1)
					m || (h ? ((t = b), (B = d)) : ((t = u), (B = s)))
					a.storage[k](['atredir', 'gopc'], t)
					a.storage[k](['atredir', 'gopc_err'], B)
				}
				!p &&
					e &&
					(v('xtor', e),
					(t = new Date().getTime() / 36e5),
					(t = Math.floor(t - f)),
					v('roinbh', 0 <= t ? t : 0))
				p ||
					((t = null),
					(t = h ? (b ? m || t : m || h) : u ? m : m || n || t),
					l && l instanceof Array && -1 < l.indexOf(t) && (t = null),
					t && v('xto', t))
				if (!p && !m) {
					var A
					h ? d && (A = h) : s && (A = n)
					A && v('pgt', A)
				}
				if (
					!p &&
					(A = h ? m || h : m || n || null) &&
					!((!m && !h && u && s) || (!m && h && b && d))
				) {
					if (
						(!l || (l instanceof Array && 0 > l.indexOf(A))) &&
						x('atsession', {
							path: '/',
							session: 60 * a.getConfig('visitLifetime'),
						})
					)
						a.storage[k](['atsession', 'histo_camp'], l && l.push(A) ? l : [A])
					;(e && !g.lastPersistence) ||
						!x('atreman', { path: '/', session: 86400 * g.lifetime }) ||
						(a.storage[k](['atreman', 'camp'], A),
						a.storage[k](['atreman', 'date'], new Date().getTime() / 36e5))
				}
				a.emit('Campaigns:process:done', { lvl: 'INFO' })
			})
		})()
	}
	ATInternet.Tracker.addPlugin('Campaigns')
}

function pluginStorage() {
	var dfltPluginCfg = {}
	var dfltGlobalCfg = { storageMode: 'cookie' }
	ATInternet.Tracker.Plugins.Storage = function (a) {
		var g = this,
			k = {},
			c = !1,
			b = null
		a.configPlugin('Storage', dfltPluginCfg || {}, function (a) {
			k = a
			'localStorage' === k.storageMode &&
				(c = ATInternet.Utils.isLocalStorageAvailable())
		})
		var d = {},
			h = function (b) {
				return a.getConfig('base64Storage')
					? ATInternet.Utils.Base64.encode(b)
					: encodeURIComponent(b)
			},
			l = function (b) {
				return a.getConfig('base64Storage')
					? ATInternet.Utils.Base64.decode(b)
					: decodeURIComponent(b)
			},
			e = function () {
				this.getData = function (a) {
					var b = null
					;(a =
						RegExp('(?:^| )' + a + '=([^;]+)').exec(document.cookie) || null) &&
						(b = l(a[1]))
					return b
				}
				this.setData = function (b) {
					var d = !1
					if (b.name && 'string' === typeof b.name) {
						var c = b.options || {},
							f = c.end || {},
							e = c.domain || a.getConfig('cookieDomain'),
							g = c.secure || a.getConfig('cookieSecure'),
							k = ATInternet.Utils.jsonSerialize(b),
							k = b.name + '=' + h(k),
							k =
								k +
								(c.path && 'string' === typeof c.path ? ';path=' + c.path : ''),
							k =
								k +
								(e && 'string' === typeof e ? ';domain=' + e : '') +
								(g && 'boolean' === typeof g ? ';secure' : '')
						'function' === typeof f.toUTCString
							? (k += ';expires=' + f.toUTCString())
							: 'number' === typeof f && (k += ';max-age=' + f.toString())
						document.cookie = k
						this.getData(b.name) && (d = !0)
					}
					return d
				}
			}
		b = c
			? new (function () {
					var a = function (a) {
							var b = +new Date(),
								c = !1,
								d
							a.options &&
								('undefined' !== typeof a.options.expires
									? (d = a.options.expires)
									: ((a = a.options.end || {}),
									  'function' === typeof a.getTime
											? (d = a.getTime())
											: 'number' === typeof a && (d = b + 1e3 * a)))
							'number' === typeof d && b >= d && (c = !0)
							return { itemToDelete: c, timestamp: d }
						},
						b = function (a) {
							var b = !1
							try {
								localStorage.removeItem(a), (b = !0)
							} catch (d) {}
							return b
						}
					this.getData = function (d) {
						var c = null,
							f = localStorage.getItem(d)
						if (f) {
							var f = l(f),
								e = ATInternet.Utils.jsonParse(f)
							e && 'object' === typeof e
								? (a(e).itemToDelete && b(d)) ||
								  (delete e.options.expires,
								  (c = ATInternet.Utils.jsonSerialize(e)))
								: (c = f)
						}
						return c
					}
					this.setData = function (d) {
						var c = !1
						if (d.name && 'string' === typeof d.name) {
							var f = a(d)
							'number' === typeof f.timestamp &&
								(d.options.expires = f.timestamp)
							var e = ATInternet.Utils.jsonSerialize(d)
							if (f.itemToDelete) c = b(d.name)
							else
								try {
									localStorage.setItem(d.name, h(e)), (c = !0)
								} catch (g) {}
						}
						return c
					}
			  })()
			: new e()
		var f = function (d, c) {
				var f = !1
				d &&
					'object' === typeof d &&
					(c ||
						(ATInternet.Utils.consent &&
							!a.getConfig('disableCookie') &&
							!a.getConfig('disableStorage'))) &&
					(f = b.setData(d))
				return f
			},
			n = function (a, b, d) {
				a = { name: a, val: b }
				d && d.session && 'number' === typeof d.session && (d.end = d.session)
				a.options = d || {}
				return a
			},
			r = function (d) {
				var c = null,
					f = null
				a.getConfig('disableCookie') ||
					a.getConfig('disableStorage') ||
					!d ||
					'string' !== typeof d ||
					(f = b.getData(d))
				;(d = f) && (c = ATInternet.Utils.jsonParse(d))
				return c
			},
			q = function (a, b) {
				var d = ATInternet.Utils.cloneSimpleObject(a)
				return f(d, b)
					? ATInternet.Utils.jsonParse(ATInternet.Utils.jsonSerialize(a))
					: null
			},
			m = function (a, b, c) {
				if (!c && d[a]) c = d[a]
				else if ((c = r(a)))
					(c.options = c.options || {}),
						c.options.session &&
							'number' === typeof c.options.session &&
							((c.options.end = c.options.session), q(c, !1)),
						(d[a] = c)
				return c
					? b
						? ((a = null),
						  !c ||
								'object' !== typeof c.val ||
								c.val instanceof Array ||
								void 0 === c.val[b] ||
								(a = c.val[b]),
						  a)
						: c.val
					: null
			},
			p = function (a, b, c, f, e) {
				if (b) {
					if ((e = r(a)))
						!e || 'object' !== typeof e.val || e.val instanceof Array
							? (e = null)
							: 'undefined' === typeof c
							? delete e.val[b]
							: (e.val[b] = c),
							e && (e = q(e, f))
				} else (e = e || {}), (e = n(a, c, e)), (e = q(e, f))
				return e ? ((d[a] = e), e.val) : null
			},
			u = function (a, b) {
				if (b) p(a, b, void 0, !0, null)
				else {
					d[a] = void 0
					var c = n(a, '', {
						end: new Date('Thu, 01 Jan 1970 00:00:00 UTC'),
						path: '/',
					})
					f(c, !0)
				}
			}
		a.storage = {}
		a.storage.getAll = function () {
			return d
		}
		a.storage.get = g.get = function (a, b) {
			b = !!b
			return a instanceof Array ? m(a[0], a[1], b) : m(a, '', b)
		}
		a.storage.getPrivate = g.getPrivate = function (b, c) {
			b instanceof Array
				? (b[0] += a.getConfig('site'))
				: (b += a.getConfig('site'))
			return g.get(b, c)
		}
		a.storage.set = g.set = function (a, b, c, d) {
			var e
			a instanceof Array
				? ((e = a[0]), (a = a[1]), (c = null))
				: ((e = a), (a = null))
			return ATInternet.Utils.privacy.testStorageParam(e, a).toSetInStorage || d
				? p(e, a, b, d, c)
				: null
		}
		a.storage.setPrivate = g.setPrivate = function (b, c, d) {
			b instanceof Array
				? (b[0] += a.getConfig('site'))
				: (b += a.getConfig('site'))
			return g.set(b, c, d)
		}
		a.storage.del = g.del = function (a) {
			a instanceof Array ? u(a[0], a[1]) : u(a, '')
		}
		a.storage.delPrivate = g.delPrivate = function (b) {
			b instanceof Array
				? (b[0] += a.getConfig('site'))
				: (b += a.getConfig('site'))
			g.del(b)
		}
		a.storage.cacheInvalidation = g.cacheInvalidation = function () {
			d = {}
		}
	}
	ATInternet.Tracker.addPlugin('Storage')
}

function pluginUtils() {
	var dfltPluginCfg = {}
	var dfltGlobalCfg = {}
	ATInternet.Tracker.Plugins.Utils = function (a) {
		var g = this,
			k = {}
		a.utils = {}
		a.utils.getQueryStringValue = g.getQueryStringValue = function (a, c) {
			var g = ATInternet.Utils.hashcode(c).toString()
			if (!k[g]) {
				k[g] = {}
				for (
					var l = RegExp('[&#?]{1}([^&=#?]*)=([^&#]*)?', 'g'), e = l.exec(c);
					null !== e;

				)
					(k[g][e[1]] = e[2]), (e = l.exec(c))
			}
			return k[g].hasOwnProperty(a) ? k[g][a] : null
		}
		a.utils.manageChapters = g.manageChapters = function (b, c, g) {
			var k = ''
			if (b)
				for (
					var e = a.getConfig('ignoreEmptyChapterValue'), f = '', n = 1;
					n < parseInt(g, 10) + 1;
					n++
				)
					(f = b[c + n] || ''),
						(k = e
							? k + (f ? f + '::' : '')
							: k + (b.hasOwnProperty(c + n) ? f + '::' : ''))
			return k
		}
		a.utils.getDocumentLevel = g.getDocumentLevel = function () {
			var b = a.getConfig('documentLevel')
			if (b) {
				if (0 > b.indexOf('.')) return window[b] || document
				b = b.split('.')
				return window[b[0]][b[1]] || document
			}
			return document
		}
		a.utils.getLocation = g.getLocation = function () {
			return g.getDocumentLevel().location.href
		}
		a.utils.getHostName = g.getHostName = function () {
			return g.getDocumentLevel().location.hostname
		}
		a.dispatchIndex = {}
		a.dispatchStack = []
		a.dispatchEventFor = {}
		var c = 0
		a.dispatchSubscribe = function (b) {
			return a.dispatchIndex[b]
				? !1
				: (a.dispatchStack.push(b), (a.dispatchIndex[b] = !0))
		}
		a.dispatchSubscribed = function (b) {
			return !0 === a.dispatchIndex[b]
		}
		a.addSpecificDispatchEventFor = function (b) {
			return a.dispatchEventFor[b]
				? !1
				: ((a.dispatchEventFor[b] = !0), c++, !0)
		}
		a.processSpecificDispatchEventFor = function (b) {
			a.dispatchEventFor[b] &&
				((a.dispatchEventFor[b] = !1),
				c--,
				0 === c &&
					((a.dispatchEventFor = {}),
					a.emit('Tracker:Plugin:SpecificEvent:Exec:Complete', {
						lvl: 'INFO',
					})))
		}
		a.dispatch = function (b, d) {
			var g = function () {
					for (var c = '', f = null; 0 < a.dispatchStack.length; )
						(c = a.dispatchStack.pop()),
							0 === a.dispatchStack.length && (f = b),
							a[c].onDispatch(f, d)
					a.dispatchIndex = {}
					a.delContext(void 0, 'customObject')
				},
				k = function () {
					if (a.plugins.isExecWaitingLazyloading())
						a.onTrigger(
							'Tracker:Plugin:Lazyload:Exec:Complete',
							function () {
								g()
							},
							!0
						)
					else g()
				}
			if (0 === c) k()
			else
				a.onTrigger(
					'Tracker:Plugin:SpecificEvent:Exec:Complete',
					function () {
						k()
					},
					!0
				)
		}
		a.dispatchRedirect = function (b) {
			var c = !0,
				g = '',
				k = null
			b &&
				((k = null),
				b.hasOwnProperty('event') && (k = b.event || window.event),
				!ATInternet.Utils.isTabOpeningAction(k) &&
					b.elem &&
					a.plugins.exec(
						'TechClicks',
						'manageClick',
						[b.elem, k],
						function (a) {
							c = a.preservePropagation
							g = a.elementType
						}
					),
				(k = b.callback))
			a.dispatch(k, g)
			return c
		}
		a.manageSend = function (b) {
			if (!ATInternet.Utils.isPreview() || a.getConfig('preview'))
				ATInternet.Utils.isPrerender(function (a) {
					b(a)
				}) || b()
		}
		a.processTagObject = function (b, c, g) {
			if ((b = a.getParam(b, !0)) && b._options.permanent) {
				for (var k = !1, e = b._options.hitType || [], f = 0; f < e.length; f++)
					if (-1 !== ATInternet.Utils.arrayIndexOf(c.concat('all'), e[f])) {
						k = !0
						break
					}
				k && (g = ATInternet.Utils.completeFstLevelObj(b._value || {}, g, !0))
			}
			return g
		}
		a.processContextObjectAndSendHit = function (b, c, g, k) {
			var e = {
					hitType: c.hitType,
					encode: c.encode,
					separator: c.separator,
					truncate: c.truncate,
				},
				f = a.getParam(b, !0)
			if (f) {
				for (var n = !1, r = f._options.hitType || [], q = 0; q < r.length; q++)
					if (
						-1 !== ATInternet.Utils.arrayIndexOf(c.hitType.concat('all'), r[q])
					) {
						n = !0
						break
					}
				n
					? ((n = ATInternet.Utils.cloneSimpleObject(f)),
					  (n._value = ATInternet.Utils.completeFstLevelObj(
							n._value || {},
							g,
							!0
					  )),
					  a.setParam(b, n._value, e),
					  a.manageSend(function () {
							a.sendHit(
								null,
								[['hitType', c.hitType]],
								k,
								c.requestMethod,
								c.elementType
							)
					  }),
					  f._options.permanent && a.setParam(b, f._value, f._options))
					: (a.setParam(b, g, e),
					  a.manageSend(function () {
							a.sendHit(
								null,
								[['hitType', c.hitType]],
								k,
								c.requestMethod,
								c.elementType
							)
					  }),
					  a.setParam(b, f._value, f._options))
			} else
				a.setParam(b, g, e),
					a.manageSend(function () {
						a.sendHit(
							null,
							[['hitType', c.hitType]],
							k,
							c.requestMethod,
							c.elementType
						)
					})
		}
	}
	ATInternet.Tracker.addPlugin('Utils')
}

function pluginTechClicks() {
	var dfltPluginCfg = {
		clicksAutoManagementEnabled: true,
		clicksAutoManagementTimeout: 500,
	}
	var dfltGlobalCfg = {}
	ATInternet.Tracker.Plugins.TechClicks = function (a) {
		var g = this,
			k = [
				'Tracker:Hit:Sent:Ok',
				'Tracker:Hit:Sent:Error',
				'Tracker:Hit:Sent:NoTrack',
			],
			c,
			b,
			d = !1
		a.configPlugin('TechClicks', dfltPluginCfg || {}, function (a) {
			c = a.clicksAutoManagementEnabled
			b = a.clicksAutoManagementTimeout
		})
		var h = function (a) {
				if (!d)
					switch (((d = !0), a.target)) {
						case '_top':
							window.top.location.href = a.url
							break
						case '_parent':
							window.parent.location.href = a.url
							break
						default:
							window.location.href = a.url
					}
			},
			l = function (a) {
				a.mailto
					? (g.timeout = setTimeout(function () {
							window.location.href = a.mailto
					  }, a.timeout))
					: a.form
					? (g.timeout = setTimeout(function () {
							a.form.submit()
					  }, a.timeout))
					: a.url &&
					  (g.timeout = setTimeout(function () {
							h({ url: a.url, target: a.target })
					  }, a.timeout))
			},
			e = function (b) {
				for (var c = 0; c < k.length; c++)
					a.onTrigger(k[c], function (a, c) {
						b && b(c)
					})
			},
			f = function (a) {
				for (var c, d = '_self'; a; ) {
					if (a.href && 0 === a.href.indexOf('http')) {
						c = a.href.split('"').join('\\"')
						d = a.target ? a.target : d
						break
					}
					a = a.parentNode
				}
				c &&
					(e(function (a) {
						a.details.isMultiHit ||
							a.details.elementType !== ATInternet.Utils.CLICKS_REDIRECTION ||
							(g.timeout && clearTimeout(g.timeout), h({ url: c, target: d }))
					}),
					l({ url: c, target: d, timeout: b }))
			},
			n = function (a) {
				for (var c = a; c && 'FORM' !== c.nodeName; ) c = c.parentNode
				c &&
					(e(function (a) {
						a.details.isMultiHit ||
							a.details.elementType !== ATInternet.Utils.CLICKS_FORM ||
							(g.timeout && clearTimeout(g.timeout), c.submit())
					}),
					l({ form: c, timeout: b }))
			},
			r = function (a) {
				for (var c = a; c && !(c.href && 0 <= c.href.indexOf('mailto:')); )
					c = c.parentNode
				c &&
					(e(function (a) {
						a.details.isMultiHit ||
							a.details.elementType !== ATInternet.Utils.CLICKS_MAILTO ||
							(g.timeout && clearTimeout(g.timeout),
							(window.location.href = c.href))
					}),
					l({ mailto: c.href, timeout: b }))
			},
			q = function (a) {
				for (var b = a; b; ) {
					if (b.href) {
						if (0 <= b.href.indexOf('mailto:'))
							return ATInternet.Utils.CLICKS_MAILTO
						if (0 === b.href.indexOf('http'))
							return ATInternet.Utils.CLICKS_REDIRECTION
					} else if ('FORM' === b.nodeName) {
						var c = a
						a = !1
						c &&
							((b = c.tagName || ''),
							(b = b.toLowerCase()),
							'form' === b
								? (a = !0)
								: ((c = c.getAttribute('type') || ''),
								  (c = c.toLowerCase()),
								  'button' === b
										? 'reset' !== c && 'button' !== c && (a = !0)
										: 'input' === b && 'submit' === c && (a = !0)))
						if (a) return ATInternet.Utils.CLICKS_FORM
						break
					}
					b = b.parentNode
				}
				return ''
			}
		g.isFormSubmit = function (a) {
			for (; a; ) {
				if ('FORM' === a.nodeName) return !0
				a = a.parentNode
			}
			return !1
		}
		a.techClicks = {}
		a.techClicks.manageClick = g.manageClick = function (a, b) {
			var d = !0,
				e = ''
			if (c && a) {
				var g
				a: {
					for (e = a; e; ) {
						if (
							'function' === typeof e.getAttribute &&
							('_blank' === e.getAttribute('target') ||
								'no' === e.getAttribute('data-atclickmanagement'))
						) {
							g = !0
							break a
						}
						e = e.parentNode
					}
					e = a
					g = window.location.href
					for (var h; e; ) {
						if (
							(h = e.href) &&
							0 <= h.indexOf('#') &&
							g.substring(
								0,
								0 <= g.indexOf('#') ? g.indexOf('#') : g.length
							) === h.substring(0, h.indexOf('#'))
						) {
							g = !0
							break a
						}
						e = e.parentNode
					}
					g = !1
				}
				e = q(a)
				if (!g && e) {
					switch (e) {
						case ATInternet.Utils.CLICKS_MAILTO:
							r(a)
							d = !1
							break
						case ATInternet.Utils.CLICKS_FORM:
							n(a)
							d = !1
							break
						case ATInternet.Utils.CLICKS_REDIRECTION:
							f(a), (d = !1)
					}
					b &&
						((g = b.defaultPrevented),
						'function' === typeof b.isDefaultPrevented &&
							(g = b.isDefaultPrevented()),
						g || (b.preventDefault && b.preventDefault()))
				}
			}
			return { preservePropagation: d, elementType: e }
		}
		a.techClicks.deactivateAutoManagement = function () {
			c = !1
		}
	}
	ATInternet.Tracker.addPlugin('TechClicks')
}

function pluginClicks() {
	var dfltPluginCfg = { requestMethod: 'POST' }
	var dfltGlobalCfg = {}
	ATInternet.Tracker.Plugins.Clicks = function (a) {
		var g = {}
		a.configPlugin('Clicks', dfltPluginCfg || {}, function (a) {
			g = a
		})
		var k = function (a) {
				var b = ''
				switch (a) {
					case 'exit':
						b = 'S'
						break
					case 'download':
						b = 'T'
						break
					case 'action':
						b = 'A'
						break
					case 'navigation':
						b = 'N'
				}
				return b
			},
			c = function (b) {
				return a.utils.manageChapters(b, 'chapter', 3) + (b.name ? b.name : '')
			},
			b = function (b, h) {
				var l = { p: c(b), s2: b.level2 || '', click: k(b.type) || '' },
					e = ['click'],
					f = a.getContext('page') || {}
				l.pclick = c(f)
				l.s2click = f.level2 || ''
				if ((f = b.customObject))
					(f = a.processTagObject('stc', e, f)),
						(l.stc = {
							_value: ATInternet.Utils.jsonSerialize(f),
							_options: {
								hitType: e,
								encode: !0,
								separator: ',',
								truncate: !0,
							},
						})
				a.sendHit(l, [['hitType', e]], b.callback, g.requestMethod, h)
			}
		a.click = {}
		a.clickListener = {}
		a.click.send = function (d) {
			d = d || {}
			var c = !0,
				l = '',
				e = null
			d.hasOwnProperty('event') && (e = d.event || window.event)
			!d.elem ||
				('POST' === g.requestMethod &&
					ATInternet.Utils.isBeaconMethodAvailable()) ||
				ATInternet.Utils.isTabOpeningAction(e) ||
				((l = a.techClicks.manageClick(d.elem, e)),
				(c = l.preservePropagation),
				(l = l.elementType))
			b(d, l)
			return c
		}
		a.clickListener.send = function (d) {
			d = d || {}
			if (d.elem) {
				var c = 'click',
					l = ''
				a.plugins.exec('TechClicks', 'isFormSubmit', [d.elem], function (a) {
					c = a ? 'submit' : 'click'
				})
				ATInternet.Utils.addEvtListener(d.elem, c, function (e) {
					;('POST' === g.requestMethod &&
						ATInternet.Utils.isBeaconMethodAvailable()) ||
						ATInternet.Utils.isTabOpeningAction(e) ||
						(l = a.techClicks.manageClick(d.elem, e).elementType)
					b(d, l)
				})
			}
		}
		a.click.set = function (b) {
			b = b || {}
			a.dispatchSubscribe('click')
			a.setContext('click', {
				name: c(b),
				level2: b.level2 || '',
				customObject: b.customObject,
			})
			a.setParam('click', k(b.type) || '', { hitType: ['click'] })
		}
		a.click.onDispatch = function (b, h) {
			var l = ['click'],
				e = a.getContext('click') || {},
				f = a.getContext('page') || {}
			a.setParam('pclick', c(f), { hitType: l })
			a.setParam('s2click', f.level2 || '', { hitType: l })
			a.setParam('p', e.name, { hitType: l })
			a.setParam('s2', e.level2, { hitType: l })
			;(e = e.customObject)
				? a.processContextObjectAndSendHit(
						'stc',
						{
							hitType: l,
							encode: !0,
							separator: ',',
							truncate: !0,
							requestMethod: g.requestMethod,
							elementType: h,
						},
						e,
						b
				  )
				: a.manageSend(function () {
						a.sendHit(null, [['hitType', l]], b, g.requestMethod, h)
				  })
			a.delContext('click')
		}
	}
	ATInternet.Tracker.addPlugin('Clicks')
}

function pluginContextVariables() {
	var dfltPluginCfg = { domainAttribution: true }
	var dfltGlobalCfg = { redirectionLifetime: 30 }
	ATInternet.Tracker.Plugins.ContextVariables = function (a) {
		var g = '',
			k = null,
			c,
			b = '',
			d = '',
			h = {}
		a.configPlugin('ContextVariables', dfltPluginCfg || {}, function (a) {
			h = a
		})
		a.setConfig('redirectionLifetime', dfltGlobalCfg.redirectionLifetime, !0)
		var l = function (b, f) {
				var d = null
				a.plugins.exec('Storage', b, f, function (a) {
					d = a
				})
				return d
			},
			e = function () {
				a.setParam(
					'hl',
					function () {
						var a = new Date()
						return a.getHours() + 'x' + a.getMinutes() + 'x' + a.getSeconds()
					},
					{ permanent: !0, hitType: ['all'] }
				)
			},
			f = function (a) {
				;(a = c
					? c
					: 'acc_dir' === g
					? ''
					: null !== g
					? g
					: 'acc_dir' === k
					? ''
					: k
					? k
					: a
					? a.referrer
					: '') &&
					(a = a.replace(/[<>]/g, '').substring(0, 1600).replace(/&/g, '$'))
				return a
			}
		a.plugins.waitForDependencies(['Storage', 'Utils'], function () {
			b = 'set' + (h.domainAttribution ? '' : 'Private')
			d = 'get' + (h.domainAttribution ? '' : 'Private')
			var n = a.utils.getLocation()
			g = a.utils.getQueryStringValue('xtref', n)
			void 0 === g && (g = '')
			c = a.getContext('forcedReferer')
			if (a.getConfig('redirect')) {
				var n = a.utils.getDocumentLevel(),
					n = c ? c : null !== g ? g : n ? n.referrer : 'acc_dir',
					r
				if ((r = n)) {
					r = { path: '/', end: a.getConfig('redirectionLifetime') }
					var q = l(d, ['atredir'])
					null !== q
						? (r = 'object' === typeof q && !(q instanceof Array))
						: (l(b, ['atredir', {}, r]), (r = !0))
				}
				r && l(b, [['atredir', 'ref'], n])
			} else {
				k = l(d, [['atredir', 'ref']])
				l('del', [['atredir', 'ref']])
				a.setParam('vtag', a.version, { permanent: !0, hitType: ['all'] })
				a.setParam('ptag', 'js', { permanent: !0, hitType: ['all'] })
				n = ''
				try {
					n +=
						window.screen.width +
						'x' +
						window.screen.height +
						'x' +
						window.screen.pixelDepth +
						'x' +
						window.screen.colorDepth
				} catch (m) {}
				a.setParam('r', n, { permanent: !0, hitType: ['all'] })
				n = ''
				window.innerWidth
					? (n += window.innerWidth + 'x' + window.innerHeight)
					: document.body &&
					  document.body.offsetWidth &&
					  (n += document.body.offsetWidth + 'x' + document.body.offsetHeight)
				a.setParam('re', n, { permanent: !0, hitType: ['all'] })
				e()
				window.navigator &&
					a.setParam(
						'lng',
						window.navigator.language || window.navigator.userLanguage,
						{ permanent: !0, hitType: ['all'] }
					)
				n = ATInternet.Utils.uuid().num(13)
				a.setParam('idp', n, {
					permanent: !0,
					hitType: ['page', 'clickzone'],
				})
				window.navigator &&
					a.setParam('jv', window.navigator.javaEnabled() ? '1' : '0', {
						hitType: ['page'],
					})
				n = a.utils.getDocumentLevel()
				a.setParam('ref', f(n), {
					permanent: !0,
					last: !0,
					hitType: ['page', 'ecommerce', 'avinsights', 'events'],
				})
			}
			a.emit('ContextVariables:Ready', { lvl: 'INFO' })
		})
	}
	ATInternet.Tracker.addPlugin('ContextVariables')
}

function pluginPage() {
	var dfltPluginCfg = {}
	var dfltGlobalCfg = {}
	ATInternet.Tracker.Plugins.Page = function (a) {
		var g = ['pageId', 'chapterLabel', 'update'],
			k = ['pid', 'pchap', 'pidt'],
			c = ['page', 'site'],
			b = ['f', 'x'],
			d = function (b) {
				return a.utils.manageChapters(b, 'chapter', 3) + (b.name ? b.name : '')
			},
			h = function (a, b, d) {
				b ? (a = b) : a || 'undefined' === typeof d || (a = d)
				return a
			},
			l = function (a, b, d) {
				b.hasOwnProperty(d) && (a[d] = h(a[d], b[d], void 0))
			},
			e = function (d, f, e) {
				if (f)
					for (var g = 0; g < c.length; g++)
						if (f.hasOwnProperty(c[g]) && f[c[g]])
							for (var h in f[c[g]])
								f[c[g]].hasOwnProperty(h) &&
									(e
										? (d[b[g] + h] = f[c[g]][h])
										: a.setParam(b[g] + h, f[c[g]][h]))
			},
			f = function (b, d, f) {
				if (d) {
					var c = a.utils.manageChapters(d, 'chapter', 3)
					c && (d.chapterLabel = c.replace(/::$/gi, ''))
					for (c = 0; c < k.length; c++)
						d.hasOwnProperty(g[c]) &&
							(f ? (b[k[c]] = d[g[c]]) : a.setParam(k[c], d[g[c]]))
				}
			},
			n = function (b, d, f) {
				if (d && d.keywords instanceof Array) {
					var c = d.keywords.length
					if (0 < c) {
						for (var e = '', g = 0; g < c; g++)
							e += '[' + d.keywords[g] + ']' + (g < c - 1 ? '|' : '')
						f ? (b.tag = e) : a.setParam('tag', e)
					}
				}
			},
			r = function (b, d, f) {
				if (d) {
					var c,
						e = function (a) {
							return a ? a : '0'
						}
					c = '' + (e(d.category1) + '-')
					c += e(d.category2) + '-'
					c += e(d.category3)
					f ? (b.ptype = c) : a.setParam('ptype', c)
				}
			},
			q = function (b, d, f) {
				if (d)
					for (var c in d)
						d.hasOwnProperty(c) &&
							'undefined' !== typeof d[c] &&
							(f ? (b[c] = d[c]) : a.setParam(c, d[c]))
			}
		a.customVars = {}
		a.customVars.set = function (b) {
			var d = a.getContext('page') || {},
				f = d.customVars
			if (f) {
				if (b)
					for (var c in b)
						b.hasOwnProperty(c) &&
							(f[c] = ATInternet.Utils.completeFstLevelObj(f[c], b[c], !0))
			} else f = b
			d.customVars = f
			a.setContext('page', d)
		}
		a.dynamicLabel = {}
		a.dynamicLabel.set = function (b) {
			var d = a.getContext('page') || {}
			d.dynamicLabel = ATInternet.Utils.completeFstLevelObj(
				d.dynamicLabel,
				b,
				!0
			)
			a.setContext('page', d)
		}
		a.tags = {}
		a.tags.set = function (b) {
			var d = a.getContext('page') || {}
			d.tags = ATInternet.Utils.completeFstLevelObj(d.tags, b, !0)
			a.setContext('page', d)
		}
		a.customTreeStructure = {}
		a.customTreeStructure.set = function (b) {
			var d = a.getContext('page') || {}
			d.customTreeStructure = ATInternet.Utils.completeFstLevelObj(
				d.customTreeStructure,
				b,
				!0
			)
			a.setContext('page', d)
		}
		a.page = {}
		a.page.reset = function () {
			a.delContext('page')
		}
		a.page.set = function (b) {
			b = b || {}
			a.dispatchSubscribe('page')
			var d = a.getContext('page') || {}
			d.name = h(d.name, b.name, '')
			d.level2 = h(d.level2, b.level2, '')
			l(d, b, 'chapter1')
			l(d, b, 'chapter2')
			l(d, b, 'chapter3')
			d.customObject = ATInternet.Utils.completeFstLevelObj(
				d.customObject,
				b.customObject,
				!0
			)
			a.setContext('page', d)
		}
		a.page.send = function (b) {
			b = b || {}
			var c = !0,
				g = '',
				k = { p: d(b), s2: b.level2 || '' },
				t = b.customObject
			if (t) {
				var v = ['page'],
					t = a.processTagObject('stc', v, t)
				k.stc = {
					_value: ATInternet.Utils.jsonSerialize(t),
					_options: { hitType: v, encode: !0, separator: ',', truncate: !0 },
				}
			}
			t = a.getContext('page') || {}
			t.vrn && ((k.vrn = t.vrn), a.delContext('page', 'vrn'))
			v = a.getContext('InternalSearch') || {}
			'undefined' !== typeof v.keyword &&
				((k.mc = ATInternet.Utils.cloneSimpleObject(v.keyword)),
				'undefined' !== typeof v.resultPageNumber &&
					(k.np = ATInternet.Utils.cloneSimpleObject(v.resultPageNumber)),
				a.delContext('InternalSearch'))
			ATInternet.Utils.isPreview() && a.getConfig('preview') && (k.pvw = 1)
			e(k, b.customVars, !0)
			f(k, b.dynamicLabel, !0)
			n(k, b.tags, !0)
			r(k, b.customTreeStructure, !0)
			v = a.getContext('campaigns') || {}
			q(k, v, !0)
			a.delContext('campaigns')
			v = null
			b && b.hasOwnProperty('event') && (v = b.event || window.event)
			!ATInternet.Utils.isTabOpeningAction(v) &&
				b.elem &&
				((v = a.techClicks.manageClick(b.elem, v)),
				(c = v.preservePropagation),
				(g = v.elementType))
			a.manageSend(function () {
				a.sendHit(k, null, b.callback, null, g)
			})
			t.name = h(t.name, b.name, '')
			t.level2 = h(t.level2, b.level2, '')
			l(t, b, 'chapter1')
			l(t, b, 'chapter2')
			l(t, b, 'chapter3')
			a.setContext('page', t)
			return c
		}
		a.page.onDispatch = function (b, c) {
			var g = a.getContext('page') || {},
				h = a.getContext('InternalSearch') || {}
			a.setParam('p', d(g))
			a.setParam('s2', g.level2 || '')
			g.vrn && (a.setParam('vrn', g.vrn), a.delContext('page', 'vrn'))
			'undefined' !== typeof h.keyword &&
				(a.setParam('mc', ATInternet.Utils.cloneSimpleObject(h.keyword)),
				'undefined' !== typeof h.resultPageNumber &&
					a.setParam(
						'np',
						ATInternet.Utils.cloneSimpleObject(h.resultPageNumber)
					),
				a.delContext('InternalSearch'))
			ATInternet.Utils.isPreview() &&
				a.getConfig('preview') &&
				a.setParam('pvw', 1)
			e(null, g.customVars, !1)
			f(null, g.dynamicLabel, !1)
			n(null, g.tags, !1)
			r(null, g.customTreeStructure, !1)
			h = a.getContext('campaigns') || {}
			q(null, h, !1)
			a.delContext('campaigns')
			var k = ['page']
			;(g = g.customObject)
				? a.processContextObjectAndSendHit(
						'stc',
						{
							hitType: k,
							encode: !0,
							separator: ',',
							truncate: !0,
							elementType: c,
						},
						g,
						b
				  )
				: a.manageSend(function () {
						a.sendHit(null, [['hitType', k]], b, null, c)
				  })
		}
	}
	ATInternet.Tracker.addPlugin('Page')
}

function pluginClientSideUserId() {
	var dfltPluginCfg = {
		clientSideMode: 'always',
		userIdCookieDuration: 397,
		userIdExpirationMode: 'fixed',
		optOut: 'OPT-OUT',
		userIdStorageName: 'atuserid',
		userIdHitName: 'idclient',
		itpCompliant: false,
		baseDomain: '',
	}
	var dfltGlobalCfg = {}
	ATInternet.Tracker.Plugins.ClientSideUserId = function (a) {
		var g = {},
			k = !1,
			c = !1,
			b = null,
			d = -1
		a.configPlugin('ClientSideUserId', dfltPluginCfg || {}, function (a) {
			g = a
		})
		var h = function () {
				var b = g.baseDomain
				if (!b) {
					var f = a.getConfig('cookieDomain')
					f && ((b = f), '.' === b.charAt(0) && (b = b.substring(1, b.length)))
				}
				var f = a.builder.getCollectDomain(),
					d = a.utils.getHostName()
				return !!(b && f && d && -1 !== f.indexOf(b) && -1 !== d.indexOf(b))
			},
			l = function () {
				b = {
					contextUserId: void 0,
					storageUserId: null,
					finalUserId: null,
					isFromTrackerContext: !1,
					forceStorage: !1,
					optout: { isOptedout: !1, fromStorage: !1 },
				}
			},
			e = function () {
				if (
					'relative' === g.userIdExpirationMode ||
					('fixed' === g.userIdExpirationMode && null === b.storageUserId) ||
					b.isFromTrackerContext
				) {
					var f = new Date()
					f.setTime(f.getTime() + 864e5 * g.userIdCookieDuration)
					a.storage.set(
						g.userIdStorageName,
						b.finalUserId,
						{ end: f, path: '/' },
						b.forceStorage
					)
					ATInternet.Utils.consent &&
						!b.isFromTrackerContext &&
						b.finalUserId !== a.storage.get(g.userIdStorageName, !0) &&
						a.setParam(g.userIdHitName, b.finalUserId + '-NO', {
							multihit: !0,
							permanent: !0,
							hitType: ['all'],
						})
				}
			},
			f = function () {
				a.setParam(g.userIdHitName, b.finalUserId, {
					multihit: !0,
					permanent: !0,
					hitType: ['all'],
				})
				e()
			},
			n = function () {
				l()
				var d = !1
				null === ATInternet.Utils.optedOut
					? a.storage.get(g.userIdStorageName, !0) === g.optOut
						? (d = ATInternet.Utils.optedOut = !0)
						: (ATInternet.Utils.optedOut = !1)
					: !1 === ATInternet.Utils.optedOut &&
					  (a.getParam(g.userIdHitName) === g.optOut &&
							a.delParam(g.userIdHitName),
					  a.storage.get(g.userIdStorageName, !0) === g.optOut &&
							a.storage.del(g.userIdStorageName))
				b.optout.isOptedout = ATInternet.Utils.optedOut
				b.optout.fromStorage = d
				b.contextUserId = a.getContext('userIdentifier')
				b.storageUserId = a.storage.get('atuserid', !0)
				d = !1
				if ('required' === g.clientSideMode) {
					var e = ''
					window.navigator && (e = window.navigator.userAgent)
					if (
						(/Safari/.test(e) && !/Chrome/.test(e)) ||
						/iPhone|iPod|iPad/.test(e)
					)
						d = !0
				} else 'always' === g.clientSideMode && (d = !0)
				c = d
				d = !1
				if (
					!a.getConfig('forceHttp') &&
					g.itpCompliant &&
					'undefined' === typeof b.contextUserId &&
					!b.optout.isOptedout
				)
					switch (g.clientSideMode) {
						case 'never':
							d = h()
							break
						case 'always':
						case 'required':
							;(c && null !== b.storageUserId) || (d = h())
					}
				;(k = d) ||
				(!c && !b.optout.isOptedout && 'undefined' === typeof b.contextUserId)
					? a.setConfig('userIdOrigin', 'server')
					: (a.setConfig('userIdOrigin', 'client'),
					  (b.isFromTrackerContext = !1),
					  (b.forceStorage = !1),
					  b.optout.isOptedout
							? ((b.finalUserId = g.optOut),
							  (b.isFromTrackerContext = !b.optout.fromStorage),
							  (b.forceStorage = !0))
							: a.getConfig('disableCookie') || a.getConfig('disableStorage')
							? ((b.finalUserId = a.getParam(g.userIdHitName)),
							  (b.isFromTrackerContext = !0))
							: 'undefined' !== typeof b.contextUserId
							? ((b.finalUserId = b.contextUserId),
							  (b.isFromTrackerContext = !0))
							: (b.finalUserId =
									null !== b.storageUserId
										? b.storageUserId
										: ATInternet.Utils.uuid().v4()),
					  f())
			},
			r = function (a) {
				a &&
					(a = a.detail) &&
					'clientsideuserid' === a.name &&
					a.id === d &&
					n()
			}
		;(function () {
			a.plugins.waitForDependencies(['Storage', 'Utils'], function () {
				var a = ATInternet.Utils.uuid()
				d = parseInt(a.num(8))
				ATInternet.Utils.removeOptOutEvent(r)
				ATInternet.Utils.addOptOutEvent(d, r)
				n()
			})
		})()
		a.clientSideUserId = {}
		a.clientSideUserId.set = function (a) {
			b.optout.isOptedout ||
				((b.finalUserId = a),
				(b.isFromTrackerContext = !0),
				(b.forceStorage = !1),
				f())
		}
		a.clientSideUserId.store = function () {
			b.finalUserId = a.getParam(g.userIdHitName) || b.finalUserId
			null !== b.finalUserId &&
				b.finalUserId !== ATInternet.Utils.privacy.CONSENTNO &&
				b.finalUserId !== b.storageUserId &&
				((b.isFromTrackerContext = !0), (b.forceStorage = !0), e())
		}
		a.clientSideUserId.get = function () {
			b.finalUserId = a.getParam(g.userIdHitName) || b.finalUserId
			return b.finalUserId
		}
		a.clientSideUserId.clear = function () {
			l()
			a.delParam(g.userIdHitName)
			a.storage.del(g.userIdStorageName)
		}
	}
	ATInternet.Tracker.addPlugin('ClientSideUserId')
}

function pluginPrivacy() {
	var dfltPluginCfg = {
		authorityStorageName: 'atauthority',
		authorities: {
			default: {
				name: 'default',
				optin: {
					name: 'optin',
					storageDuration: 397,
					trackerSettings: { disableStorage: false, disableCookie: false },
					add: {
						buffer: {
							visitorConsent: { param: 'vc', value: true },
							visitorMode: { param: 'vm', value: 'optin' },
						},
					},
					include: { storage: '*', buffer: '*' },
				},
				optout: {
					name: 'optout',
					storageDuration: 397,
					trackerSettings: { disableStorage: false, disableCookie: false },
					add: {
						buffer: {
							visitorConsent: { param: 'vc', value: false },
							visitorMode: { param: 'vm', value: 'optout' },
						},
					},
					include: {
						storage: ['atuserid', 'atauthority'],
						buffer: [
							's',
							'idclient',
							'ts',
							'vc',
							'vm',
							'click',
							'type',
							'olt',
							'cn',
							'mh',
						],
					},
				},
				'no-consent': {
					name: 'no-consent',
					storageDuration: 0,
					trackerSettings: { disableStorage: true, disableCookie: true },
					add: {
						buffer: {
							visitorConsent: { param: 'vc', value: false },
							visitorMode: { param: 'vm', value: 'no-consent' },
							idclient: { param: 'idclient', value: 'Consent-NO' },
						},
					},
					include: {
						storage: [],
						buffer: [
							's',
							'idclient',
							'ts',
							'vc',
							'vm',
							'click',
							'type',
							'olt',
							'cn',
							'mh',
						],
					},
				},
				random: {
					name: 'random',
					storageDuration: 0,
					trackerSettings: { disableStorage: false, disableCookie: false },
					add: {
						buffer: {
							visitorConsent: { param: 'vc', value: false },
							visitorMode: { param: 'vm', value: 'before-consent' },
						},
					},
					include: {
						storage: [],
						buffer: [
							's',
							'idclient',
							'p',
							'vtag',
							'ptag',
							'ts',
							'vc',
							'vm',
							'ref',
							'xto',
							'click',
							'type',
							'olt',
							'cn',
							'mh',
						],
					},
				},
			},
			cnil: {
				name: 'cnil',
				exempt: {
					name: 'exempt',
					storageDuration: 397,
					trackerSettings: { disableStorage: false, disableCookie: false },
					add: {
						buffer: {
							visitorConsent: { param: 'vc', value: false },
							visitorMode: { param: 'vm', value: 'exempt' },
						},
					},
					include: {
						storage: ['atuserid', 'atauthority'],
						buffer: [
							's',
							'idclient',
							'p',
							'vtag',
							'ptag',
							'ts',
							'vc',
							'vm',
							'click',
							'type',
							'olt',
							'cn',
							'mh',
						],
					},
				},
			},
		},
		parametersToInclude: [
			'click',
			's2',
			'p',
			'x1',
			'pclick',
			's2click',
			'f1',
			'x2',
			'f2',
			'stc',
			'ref',
			'page_url',
			'medium',
		],
	}
	var dfltGlobalCfg = {}
	ATInternet.Tracker.Plugins.Privacy = function (a) {
		var g = function (c) {
				function b() {
					if (r && q) {
						var b = new Date()
						b.setTime(b.getTime() + 864e5 * q.storageDuration)
						a.storage.set(
							p.authorityStorageName,
							{ authority_name: r.name, visitor_mode: q.name },
							{ end: b, path: '/' }
						)
					}
				}
				function d(d) {
					q &&
						(0 < q.storageDuration
							? d
								? b()
								: ((d = a.storage.get(p.authorityStorageName, !0)),
								  null === d
										? b()
										: 'object' === typeof d &&
										  ((d.authority_name === r.name &&
												d.visitor_mode === q.name) ||
												b()))
							: a.storage.del(p.authorityStorageName))
				}
				function g() {
					ATInternet.Utils.privacy.processStorageParams(
						function (b) {
							a.storage.del(b)
							a.storage.delPrivate(b)
						},
						function (b) {
							return a.storage.get(b, !0) || a.storage.getPrivate(b, !0)
						},
						function (b) {
							return a.storage.getAll(b, !0) || a.storage.getAllPrivate(b, !0)
						}
					)
				}
				function k() {
					ATInternet.Utils.privacy.processBufferParams(
						function (b) {
							a.delParam(b)
						},
						function () {
							return a.getParams([])
						},
						function (b, d, f) {
							a.setParam(b, d, f)
						}
					)
				}
				function e(a, b, d) {
					if (q && q.include) {
						q.include[b] instanceof Array
							? a instanceof Array
								? (q.include[b] = q.include[b].concat(a))
								: a && q.include[b].push(a)
							: q.include[b] !== ATInternet.Utils.privacy.ALL &&
							  (a instanceof Array
									? (q.include[b] = a)
									: a && (q.include[b] = [a]))
						a = m
						var f = b + 'Params',
							c = q.include[b]
						b = []
						for (var e = {}, g = 0; g < c.length; g++)
							if ('object' === typeof c[g])
								for (var h in c[g])
									c[g].hasOwnProperty(h) &&
										(e[h] = (e[h] || []).concat(c[g][h]))
							else b.push(c[g])
						for (var k in e)
							e.hasOwnProperty(k) && ((h = {}), (h[k] = e[k]), b.push(h))
						a[f] = b
						ATInternet.Utils.privacy.setParameters(m)
						d && d()
					}
				}
				function f(b, f, c, e) {
					if (p.authorities && p.authorities[b] && p.authorities[b][f]) {
						c && a.clientSideUserId.clear()
						e && n.setVisitorOptin()
						r = p.authorities[b]
						if ((q = r[f]))
							for (var w in q.trackerSettings)
								q.trackerSettings.hasOwnProperty(w) &&
									a.setConfig(w, q.trackerSettings[w])
						if (q && q.add)
							for (var x in q.add.buffer)
								q.add.buffer.hasOwnProperty(x) &&
									a.setParam(q.add.buffer[x].param, q.add.buffer[x].value, {
										multihit: !0,
										permanent: !0,
										hitType: ['all'],
									})
						if (q && q.include) {
							for (var y in q.include)
								q.include.hasOwnProperty(y) &&
									((b =
										q.include[y] instanceof Array
											? q.include[y]
											: [q.include[y]]),
									(m[y + 'Params'] = b))
							ATInternet.Utils.privacy.setParameters(m)
							d(!1)
						}
						0 < p.parametersToInclude.length &&
							(n.extendIncludeStorage(p.parametersToInclude),
							n.extendIncludeBuffer(p.parametersToInclude))
						g()
						k()
					}
				}
				var n = this,
					r = null,
					q = null,
					m = { storageParams: [], bufferParams: [] },
					p = c
				n.setVisitorOptout = function () {
					ATInternet.Utils.consentReceived(!0)
					f('default', 'optout', !1, !1)
					ATInternet.Utils.userOptedOut()
				}
				n.setVisitorOptin = function () {
					ATInternet.Utils.consentReceived(!0)
					a.clientSideUserId.store()
					f('default', 'optin', !1, !1)
					ATInternet.Utils.userOptedIn()
				}
				n.setVisitorRandomID = function () {
					ATInternet.Utils.consentReceived(!1)
					f('default', 'random', !1, !1)
					ATInternet.Utils.userOptedIn()
				}
				n.setVisitorMode = function (a, b, d) {
					var c = !0
					'cnil' === a && 'exempt' === b
						? (c = !1)
						: 'boolean' === typeof d && (c = d)
					c && r && q && (c = a !== r.name || b !== q.name)
					f(a, b, c, !0)
				}
				n.getAuthority = function () {
					return r
				}
				n.getVisitorMode = function () {
					return q
				}
				n.addAuthority = function (a) {
					a &&
						'object' === typeof a &&
						((p.authorities = p.authorities || {}), (p.authorities[a.name] = a))
				}
				n.extendIncludeStorage = function (a) {
					e(a, 'storage', g)
				}
				n.extendIncludeBuffer = function (a) {
					e(a, 'buffer', k)
				}
				n.updateStorageDuration = function (a) {
					q && ((q.storageDuration = a), d(!0))
				}
				;(function () {
					var b = a.storage.get([p.authorityStorageName, 'authority_name'], !0),
						d = a.storage.get([p.authorityStorageName, 'visitor_mode'], !0)
					b &&
						d &&
						('default' === b
							? 'optin' === d
								? n.setVisitorOptin()
								: 'optout' === d
								? n.setVisitorOptout()
								: 'random' === d
								? n.setVisitorRandomID()
								: n.setVisitorMode(b, d)
							: n.setVisitorMode(b, d))
				})()
			},
			k = null
		a.privacy = {
			setVisitorOptout: function () {},
			setVisitorOptin: function () {},
			setVisitorRandomID: function () {},
			setVisitorMode: function () {},
			getAuthority: function () {},
			getVisitorMode: function () {},
			addAuthority: function () {},
			extendIncludeStorage: function () {},
			extendIncludeBuffer: function () {},
			updateStorageDuration: function () {},
		}
		;(function () {
			a.plugins.waitForDependencies(
				['Storage', 'Utils', 'ClientSideUserId'],
				function () {
					var c = null
					a.configPlugin('Privacy', dfltPluginCfg || {}, function (a) {
						c = ATInternet.Utils.cloneSimpleObject(a)
					})
					null !== c &&
						((k = new g(c)),
						(a.privacy.setVisitorOptout = k.setVisitorOptout),
						(a.privacy.setVisitorOptin = k.setVisitorOptin),
						(a.privacy.setVisitorRandomID = k.setVisitorRandomID),
						(a.privacy.setVisitorMode = k.setVisitorMode),
						(a.privacy.getAuthority = k.getAuthority),
						(a.privacy.getVisitorMode = k.getVisitorMode),
						(a.privacy.addAuthority = k.addAuthority),
						(a.privacy.extendIncludeStorage = k.extendIncludeStorage),
						(a.privacy.extendIncludeBuffer = k.extendIncludeBuffer),
						(a.privacy.updateStorageDuration = k.updateStorageDuration))
				}
			)
		})()
	}
	ATInternet.Tracker.addPlugin('Privacy')
}

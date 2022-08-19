// We wrap the whole file into a condition, but it might be preferable to use a
// conditionnal import to exclude this whole file from the SSR bundle
// https://github.com/vitejs/vite/discussions/6377
if (!import.meta.env.SSR) {

  ; (function () {
    var dfltPluginCfg = {}; var dfltGlobalCfg = { "site": 617190, "log": "", "logSSL": "", "domain": "urssaf.fr", "collectDomain": "tm.urssaf.fr", "collectDomainSSL": "tm.urssaf.fr", "userIdOrigin": "server", "pixelPath": "/tm.ur", "disableCookie": false, "disableStorage": false, "cookieSecure": true, "cookieDomain": ".urssaf.fr", "preview": false, "plgs": ["Campaigns", "Clicks", "ContextVariables", "Page", "ClientSideUserId", "Privacy", "Events"], "lazyLoadingPath": "", "documentLevel": "document", "redirect": false, "activateCallbacks": true, "medium": "", "ignoreEmptyChapterValue": false, "base64Storage": false, "sendHitWhenOptOut": true, "forceHttp": false, "requestMethod": "GET", "maxHitSize": 2000, "urlPropertyAuto": true, "urlPropertyQueryString": false, "sameSiteStrict": false }; (function (a) { a.ATInternet = a.ATInternet || {}; a.ATInternet.Tracker = a.ATInternet.Tracker || {}; a.ATInternet.Tracker.Plugins = a.ATInternet.Tracker.Plugins || {} })(window);
    var Utils = function () {
      function a(g) { var b = typeof g; if ("object" !== b || null === g) return "string" === b && (g = '"' + g + '"'), String(g); var f, e, d = [], c = g.constructor === Array; for (f in g) g.hasOwnProperty(f) && (e = g[f], b = typeof e, "function" !== b && "undefined" !== b && ("string" === b ? e = '"' + e.replace(/[^\\]"/g, '\\"') + '"' : "object" === b && null !== e && (e = a(e)), d.push((c ? "" : '"' + f + '":') + String(e)))); return (c ? "[" : "{") + String(d) + (c ? "]" : "}") } function k(a) { return null === a ? "" : (a + "").replace(d, "") } function h(a) {
        var l, f = null; return (a = k(a + "")) &&
          !k(a.replace(b, function (a, g, b, d) { l && g && (f = 0); if (0 === f) return a; l = b || g; f += !d - !b; return "" })) ? Function("return " + a)() : null
      } var c = this, b = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g, d = RegExp("^[\\x20\\t\\r\\n\\f]+|((?:^|[^\\\\])(?:\\\\.)*)[\\x20\\t\\r\\n\\f]+$", "g"); c.isLocalStorageAvailable = function () { try { var a = localStorage; a.setItem("__storage_test__", "__storage_test__"); a.removeItem("__storage_test__"); return !0 } catch (b) { return !1 } };
      c.isBeaconMethodAvailable = function () { return window.navigator && "function" === typeof window.navigator.sendBeacon }; c.Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (a) {
          var b = "", f, e, d, n, p, m, r = 0; for (a = c.Base64._utf8_encode(a); r < a.length;)f = a.charCodeAt(r++), e = a.charCodeAt(r++), d = a.charCodeAt(r++), n = f >> 2, f = (f & 3) << 4 | e >> 4, p = (e & 15) << 2 | d >> 6, m = d & 63, isNaN(e) ? p = m = 64 : isNaN(d) && (m = 64), b = b + this._keyStr.charAt(n) + this._keyStr.charAt(f) + this._keyStr.charAt(p) + this._keyStr.charAt(m);
          return b
        }, decode: function (a) { var b = "", f, e, d, n, p, m = 0; for (a = a.replace(/[^A-Za-z0-9\+\/\=]/g, ""); m < a.length;)f = this._keyStr.indexOf(a.charAt(m++)), e = this._keyStr.indexOf(a.charAt(m++)), n = this._keyStr.indexOf(a.charAt(m++)), p = this._keyStr.indexOf(a.charAt(m++)), f = f << 2 | e >> 4, e = (e & 15) << 4 | n >> 2, d = (n & 3) << 6 | p, b += String.fromCharCode(f), 64 != n && (b += String.fromCharCode(e)), 64 != p && (b += String.fromCharCode(d)); return b = c.Base64._utf8_decode(b) }, _utf8_encode: function (a) {
          a = a.replace(/\r\n/g, "\n"); for (var b = "", f = 0; f <
            a.length; f++) { var e = a.charCodeAt(f); 128 > e ? b += String.fromCharCode(e) : (127 < e && 2048 > e ? b += String.fromCharCode(e >> 6 | 192) : (b += String.fromCharCode(e >> 12 | 224), b += String.fromCharCode(e >> 6 & 63 | 128)), b += String.fromCharCode(e & 63 | 128)) } return b
        }, _utf8_decode: function (a) {
          for (var b = "", f = 0, e, d, c; f < a.length;)e = a.charCodeAt(f), 128 > e ? (b += String.fromCharCode(e), f++) : 191 < e && 224 > e ? (d = a.charCodeAt(f + 1), b += String.fromCharCode((e & 31) << 6 | d & 63), f += 2) : (d = a.charCodeAt(f + 1), c = a.charCodeAt(f + 2), b += String.fromCharCode((e & 15) << 12 |
            (d & 63) << 6 | c & 63), f += 3); return b
        }
      }; c.loadScript = function (a, b) {
        var f; b = b || function () { }; f = document.createElement("script"); f.type = "text/javascript"; f.src = a.url; f.async = !1; f.defer = !1; f.onload = f.onreadystatechange = function (a) { a = a || window.event; if ("load" === a.type || /loaded|complete/.test(f.readyState) && (!document.documentMode || 9 > document.documentMode)) f.onload = f.onreadystatechange = f.onerror = null, b(null, a) }; f.onerror = function (a) { f.onload = f.onreadystatechange = f.onerror = null; b({ msg: "script not loaded", event: a }) };
        var e = document.head || document.getElementsByTagName("head")[0]; e.insertBefore(f, e.lastChild)
      }; c.cloneSimpleObject = function (a, b) { if ("object" !== typeof a || null === a || a instanceof Date) return a; var f = new a.constructor, e; for (e in a) a.hasOwnProperty(e) && (void 0 === e || b && void 0 === a[e] || (f[e] = c.cloneSimpleObject(a[e]))); return f }; c.isEmptyObject = function (a) { for (var b in a) if (a.hasOwnProperty(b)) return !1; return !0 }; c.isObject = function (a) { return null !== a && "object" === typeof a && !(a instanceof Array) }; c.ATVALUE = "_ATVALUE";
      c.ATPREFIX = "_ATPREFIX"; c.object2Flatten = function (a, b, f, e, d) { var n = {}, p = "", m = "", r = [], h = "", s = 0, u; for (u in a) if (a.hasOwnProperty(u)) if (n = c.splitProtocolAndKey(u, d), p = n.prefix || e || "", m = (b ? b + "_" : "") + n.key, c.isObject(a[u])) c.object2Flatten(a[u], m, f, p, d); else { r = m.split("_"); h = ""; for (s = 0; s < r.length; s++)n = c.splitProtocolAndKey(r[s], d), p = n.prefix || p, h += n.key + (s < r.length - 1 ? "_" : ""); m = h || m; f[m] = f[m] || {}; f[m][c.ATVALUE] = a[u]; f[m][c.ATPREFIX] = p } }; c.flatten2Object = function (a, b, f) {
        b = b.split("_"); var e, d; for (d = 0; d <
          b.length - 1; d++)e = b[d], a[e] || (a[e] = {}), a = a[e]; if (a.hasOwnProperty(c.ATVALUE)) { e = a[c.ATVALUE]; var n = a[c.ATPREFIX]; delete a[c.ATVALUE]; delete a[c.ATPREFIX]; a.$ = {}; a.$[c.ATVALUE] = e; a.$[c.ATPREFIX] = n } f = c.cloneSimpleObject(f); a[b[d]] ? a[b[d]].$ = f : a[b[d]] = f
      }; c.getFormattedObject = function (a) { var b = {}, f, e; for (e in a) a.hasOwnProperty(e) && (a[e].hasOwnProperty(c.ATVALUE) ? (f = a[e][c.ATPREFIX] ? a[e][c.ATPREFIX] + ":" + e : e, b[f] = a[e][c.ATVALUE]) : b[e] = c.getFormattedObject(a[e])); return b }; c.completeFstLevelObj = function (a,
        b, f) { if (a) { if (b) for (var e in b) !b.hasOwnProperty(e) || a[e] && !f || (a[e] = b[e]) } else a = b; return a }; c.getObjectKeys = function (a) { var b = [], f; for (f in a) a.hasOwnProperty(f) && b.push(f); return b }; c.objectToLowercase = function (a) { var b = {}, f; for (f in a) a.hasOwnProperty(f) && (c.isObject(a[f]) ? b[f.toLowerCase()] = c.objectToLowercase(a[f]) : b[f.toLowerCase()] = a[f]); return b }; c.splitProtocolAndKey = function (a, b) {
          var f, e; 2 > a.length || ":" !== a[1] ? (f = "", e = a) : 4 > a.length || ":" !== a[3] ? (f = a.substring(0, 1), e = a.substring(2, a.length)) :
            (f = a.substring(0, 3), e = a.substring(4, a.length)); b && (f = f.toLowerCase(), e = e.toLowerCase()); return { prefix: f, key: e }
        }; c.jsonSerialize = function (b) { try { return "undefined" !== typeof JSON && JSON.stringify ? JSON.stringify(b) : a(b) } catch (d) { return null } }; c.jsonParse = function (a) { try { return "undefined" !== typeof JSON && JSON.parse ? JSON.parse(a + "") : h(a) } catch (b) { return null } }; c.trim = function (a) { try { return String.prototype.trim ? a.trim() : a.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "") } catch (b) { return a } }; c.arrayIndexOf =
          function (a, b) { if (Array.prototype.indexOf) { var f = -1; "undefined" !== typeof a.indexOf(b) && (f = a.indexOf(b)); return f } return function (a) { if (null == this) throw new TypeError; var b = Object(this), f = b.length >>> 0; if (0 === f) return -1; var g = 0; 1 < arguments.length && (g = Number(arguments[1]), g != g ? g = 0 : 0 != g && Infinity != g && -Infinity != g && (g = (0 < g || -1) * Math.floor(Math.abs(g)))); if (g >= f) return -1; for (g = 0 <= g ? g : Math.max(f - Math.abs(g), 0); g < f; g++)if (g in b && b[g] === a) return g; return -1 }.apply(a, [b]) }; c.uuid = function () {
            function a(e) {
              var g =
                Math.random(); try { f && (g = b.getRandomValues(new Uint32Array(1))[0] / Math.pow(2, 32)) } catch (d) { } return Math.floor((9 * g + 1) * Math.pow(10, e - 1))
            } var b = window.crypto || window.msCrypto, f = null !== b && "object" === typeof b; return {
              v4: function () {
                try { if (f) return ([1E7] + -1E3 + -4E3 + -8E3 + -1E11).replace(/[018]/g, function (a) { return (a ^ b.getRandomValues(new Uint32Array(1))[0] & 15 >> a / 4).toString(16) }) } catch (a) { } return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (a) {
                  var b = 16 * Math.random() | 0; return ("x" === a ? b : b & 3 |
                    8).toString(16)
                })
              }, num: function (b) { var f = new Date, d = function (a) { a -= 100 * Math.floor(a / 100); return 10 > a ? "0" + a : String(a) }; return d(f.getHours()) + "" + d(f.getMinutes()) + "" + d(f.getSeconds()) + "" + a(b - 6) }
            }
          }; c.isPreview = function () { return window.navigator && "preview" === window.navigator.loadPurpose }; c.isPrerender = function (a) {
            var b, f = !1, e = ["webkit", "ms"]; if ("prerender" === document.visibilityState) b = "visibilitychange"; else for (var d = 0; d < e.length; d++)"prerender" === document[e[d] + "VisibilityState"] && (b = e[d] + "visibilitychange");
            if ("undefined" !== typeof b) { var h = function (e) { a(e); c.removeEvtListener(document, b, h) }; c.addEvtListener(document, b, h); f = !0 } return f
          }; c.addEvtListener = function (a, b, f) { a.addEventListener ? a.addEventListener(b, f, !1) : a.attachEvent && a.attachEvent("on" + b, f) }; c.removeEvtListener = function (a, b, f) { a.removeEventListener ? a.removeEventListener(b, f, !1) : a.detachEvent && a.detachEvent("on" + b, f) }; c.hashcode = function (a) {
            var b = 0; if (0 === a.length) return b; for (var f = 0; f < a.length; f++)var e = a.charCodeAt(f), b = (b << 5) - b + e, b = b | 0;
            return b
          }; c.setLocation = function (a) { var b = a.location; a = window[a.target] || window; b && (a.location.href = b) }; c.dispatchCallbackEvent = function (a) { var b; if ("function" === typeof window.Event) b = new Event("ATCallbackEvent"); else try { b = document.createEvent("Event"), b.initEvent && b.initEvent("ATCallbackEvent", !0, !0) } catch (f) { } b && "function" === typeof document.dispatchEvent && (b.name = a, document.dispatchEvent(b)) }; c.addCallbackEvent = function (a) { c.addEvtListener(document, "ATCallbackEvent", a) }; c.removeCallbackEvent = function (a) {
            c.removeEvent("ATCallbackEvent",
              a)
          }; (function () { function a(b, f) { f = f || { bubbles: !1, cancelable: !1, detail: void 0 }; var e; try { e = document.createEvent("CustomEvent"), e.initCustomEvent(b, f.bubbles, f.cancelable, f.detail) } catch (d) { } return e } "function" === typeof window.CustomEvent ? window.ATCustomEvent = window.CustomEvent : ("function" === typeof window.Event && (a.prototype = window.Event.prototype), window.ATCustomEvent = a) })(); c.addEvent = function (a, b, f, e) { c[a] = new ATCustomEvent(a, { detail: { name: b, id: f } }); c.addEvtListener(document, a, e) }; c.removeEvent =
            function (a, b) { c.removeEvtListener(document, a, b) }; c.dispatchEvent = function (a, b) { c[a] = c[a] || new ATCustomEvent(a, { detail: { name: b, id: -1 } }); try { document.dispatchEvent(c[a]) } catch (f) { } }; c.privacy = new function () {
              function a(b, e) {
                var f = [], d, g; d = {}; for (var m = 0; m < b.length; m++) {
                  d = {}; c.object2Flatten(b[m], null, d, null, !0); for (var l in d) d.hasOwnProperty(l) && -1 === c.arrayIndexOf(e, l) && delete d[l]; if (!c.isEmptyObject(d)) {
                    g = {}; for (var h in d) d.hasOwnProperty(h) && c.flatten2Object(g, h, d[h]); d = c.getFormattedObject(g);
                    f.push(d)
                  }
                } return f
              } function b(a, d, e) { 1 < a.length ? ("undefined" === typeof d[a[0]] && (d[a[0]] = {}), b(a.slice(1, a.length), d[a[0]], e)) : d[a[0]] = e } function f(a, b, d, e, g) { var m = e ? e : {}; if (!a || "object" !== typeof a || a instanceof Array) if ("undefined" !== typeof a && 0 <= d.indexOf(g) || "undefined" === typeof d) m[g] = a; else for (b = 0; b < d.length; b++) { if (g && 0 === g.indexOf(d[b])) { m[g] = a; break } } else for (var c in a) a.hasOwnProperty(c) && f(a[c], b, d, m, (g ? g + b : "") + c); if (void 0 === e) return m } function e(a, d, e) {
                for (var g = [], m = 0; m < a.length; m++) {
                  var w;
                  w = f(a[m], e, d); var h = e, r = {}, n = void 0; for (n in w) if (w.hasOwnProperty(n)) { var p = n.split(h); b(p, r, w[n]) } w = r; c.isEmptyObject(w) || g.push(w)
                } return g
              } function d(a, b) { var e = "", f = { key: "", flattenedProperty: "" }; switch (!0) { case 0 === a.indexOf("stc_"): e = "stc_"; break; case 0 === a.indexOf("stc/"): e = "stc/"; break; case 0 === a.indexOf("events_"): e = "events_"; break; case 0 === a.indexOf("context_"): e = "context_"; break; default: f.key = a }if (e) { var g = e.substring(0, e.length - 1); f.key = g; 0 > b.indexOf(g) && (f.flattenedProperty = a.substring(e.length)) } return f }
              function h(a) { for (var b = [], e = {}, f = 0; f < a.length; f++)if ("string" === typeof a[f]) { var g = {}; if (-1 < a[f].indexOf("#")) { var m = a[f].split("#"); m[0] === r && (g = d(m[1], a)) } else g = d(a[f], a); g.key && 0 > b.indexOf(g.key) && b.push(g.key); g.flattenedProperty && (e[g.key] = (e[g.key] || []).concat(g.flattenedProperty)) } else for (var c in a[f]) a[f].hasOwnProperty(c) && (0 > b.indexOf(c) && b.push(c), 0 > a.indexOf(c) && (e[c] = (e[c] || []).concat(a[f][c]))); return { keys: b, values: e } } var p = this, m = { storageParams: null, bufferParams: null }, r = ""; p.CONSENTNO =
                "Consent-NO"; p.ALL = "*"; p.testStorageParam = function (a, b) { var e; if (m.storageParams instanceof Array) { for (var d, f = m.storageParams.length - 1; 0 <= f; f--)if (d = m.storageParams[f], "string" === typeof d) { if (d === a || d === p.ALL) return { toSetInStorage: !0 } } else { a: { e = a; var g = b, c = void 0, l = void 0; for (l in d) if (d.hasOwnProperty(l) && e === l) { if (!g) { e = !0; break a } c = []; d[l] instanceof Array ? c = d[l] : c.push(d[l]); for (var h = 0; h < c.length; h++)if (c[h] === g) { e = !0; break a } } e = !1 } if (e) return { toSetInStorage: !0 } } return { toSetInStorage: !1 } } return { toSetInStorage: !0 } };
              p.processStorageParams = function (a, b, e) { if (e) { e = e(); var d = h(m.storageParams); if (d.keys[0] !== p.ALL) for (var f in e) if (e.hasOwnProperty(f) && void 0 !== e[f]) if (-1 === c.arrayIndexOf(d.keys, f)) a && a(f); else if (c.isObject(e[f])) { var g = f, l = e[f].val, r = d.values[f], q = a, k = b; if ("undefined" !== typeof r) { var x = []; r instanceof Array ? x = r : x.push(r); r = void 0; for (r in l) l.hasOwnProperty(r) && -1 === c.arrayIndexOf(x, r) && q && q([g, r]); q && k && c.isEmptyObject(k(g)) && q(g) } } } }; p.testBufferParam = function (b, d) {
                var f, l; if (m.bufferParams instanceof
                  Array) {
                  f = h(m.bufferParams); for (l = 0; l < f.keys.length; l++)if (f.keys[l] === b || f.keys[l] === p.ALL) if (f.values.hasOwnProperty(f.keys[l])) {
                    var r = {}; r[f.keys[l]] = f.values[f.keys[l]]; a: {
                      f = b; l = d; if (c.isObject(r)) {
                        var w = void 0, q = [], k = !1, D = w = w = void 0; for (D in r) if (r.hasOwnProperty(D) && f === D && (w = l, "string" === typeof w && (w = c.jsonParse(w) || w), "object" === typeof w)) {
                          w instanceof Array ? (q = w, k = !0) : q.push(w); w = "stc" === f ? e(q, r[D], "/") : "events" === f || "context" === f ? e(q, r[D], "_") : a(q, r[D]); 0 === w.length ? (f = !1, l = void 0) : (w = k ?
                            w : w[0], f = !0, l = c.jsonSerialize(w)); break a
                        }
                      } f = !1; l = void 0
                    } if (f) return { toSetInBuffer: !0, value: l }; break
                  } else return { toSetInBuffer: !0, value: d }; return { toSetInBuffer: !1 }
                } return { toSetInBuffer: !0, value: d }
              }; p.processBufferParams = function (b, f, d) {
                if (f) {
                  f = f(); var l = h(m.bufferParams); if (l.keys[0] !== p.ALL) for (var r in f) if (f.hasOwnProperty(r)) if (-1 === c.arrayIndexOf(l.keys, r)) b && b(r); else {
                    var w = r, q = f[r], k = l.values[r], D = b, H = d; if ("undefined" !== typeof k && "undefined" !== typeof q) {
                      var x = [], y = q._value, z = [], I = !1, F = void 0,
                        F = void 0; k instanceof Array ? x = k : x.push(k); "string" === typeof y && (y = c.jsonParse(y) || y); "object" === typeof y && (y instanceof Array ? (z = y, I = !0) : z.push(y), F = "stc" === w ? e(z, x, "/") : "events" === w || "context" === w ? e(z, x, "_") : a(z, x), 0 === F.length ? D && D(w) : (F = I ? F : F[0], H && H(w, c.jsonSerialize(F), q._options)))
                    }
                  }
                }
              }; p.setMode = function (a) { r = a }; p.setParameters = function (a) { m = a }; p.getParameters = function () { return m }; p.resetParameters = function () { m = { storageParams: null, bufferParams: null } }
            }; c.optedOut = null; c.addOptOutEvent = function (a,
              b) { c.addEvent("ATOptOutEvent", "clientsideuserid", a, b) }; c.removeOptOutEvent = function (a) { c.removeEvent("ATOptOutEvent", a) }; c.dispatchOptOutEvent = function (a) { c.optedOut = a; c.dispatchEvent("ATOptOutEvent", "clientsideuserid") }; c.userOptedOut = function () { c.dispatchOptOutEvent(!0) }; c.userOptedIn = function () { c.dispatchOptOutEvent(!1) }; c.isOptedOut = function () {
                if (null === c.optedOut) {
                  var a; a: {
                    a = null; c.isLocalStorageAvailable() && (a = localStorage.getItem("atuserid")); if (null === a) {
                      var b = /(?:^| )atuserid=([^;]+)/.exec(document.cookie);
                      null !== b && (a = b[1])
                    } if (null !== a) try { a = decodeURIComponent(a) } catch (f) { } if (a && (a = c.jsonParse(a) || c.jsonParse(c.Base64.decode(a)), null !== a)) { a = "OPT-OUT" === a.val; break a } a = !1
                  } c.optedOut = a
                } return !!c.optedOut
              }; c.consentReceived = function (a) { c.consent = !!a }; c.consent = !0; c.isTabOpeningAction = function (a) { var b = !1; a || (a = window.event); a && (a.ctrlKey || a.shiftKey || a.metaKey || a.button && 1 === a.button) && (b = !0); return b }; c.CLICKS_REDIRECTION = "redirection"; c.CLICKS_FORM = "form"; c.CLICKS_MAILTO = "mailto"
    };
    ATInternet.Utils = new Utils;
    var BuildManager = function (a) {
      var k = this, h = 0, c = 0, b = ["dz"], d = "", g = function (a, b, f, e, d, g, c) { a = "&" + a + "="; return { param: a, paramSize: a.length, str: b, strSize: b.length, truncate: f, multihit: e, separator: d || "", encode: g, last: c } }, l = function (a, b) {
        var f = "", e = 0, d = 0, g = 0, e = -1, c = null, l = null, h; for (h in a) a.hasOwnProperty(h) && (c = a[h]) && (e = b - d, c.last && null !== l ? l[h] = c : c.strSize + c.paramSize <= e ? (f += c.param + c.str, d += c.paramSize + c.strSize) : (l = l || {}, l[h] = c, c.truncate && (g = e - c.paramSize, c.separator && (e = c.str.substring(0, e), e = c.encode ?
          e.lastIndexOf(encodeURIComponent(c.separator)) : e.lastIndexOf(c.separator), 0 < e && (g = e)), f += c.param + c.str.substring(0, g), d += c.paramSize + c.str.substring(0, g).length, l[h].str = c.str.substring(g, c.strSize), l[h].strSize = l[h].str.length))); return [f, l]
      }, f = function (f, e, d) {
        var h = "", s = function (e) {
          if (e === {}) return []; var f = [], d; d = {}; var m = !1, r = void 0, s, n, q, k, p, u, v, A, G = "", B; for (B in e) if (e.hasOwnProperty(B)) if (u = p = k = q = !1, s = e[B]._value, n = e[B]._options || {}, "boolean" === typeof n.encode && (q = n.encode), "function" === typeof s &&
            (s = s()), s = s instanceof Array ? s.join(n.separator || ",") : "object" === typeof s ? ATInternet.Utils.jsonSerialize(s) : "undefined" === typeof s ? "undefined" : s.toString(), q && (s = encodeURIComponent(s)), -1 < ATInternet.Utils.arrayIndexOf(b, B) ? k = !0 : "boolean" === typeof n.truncate && (k = n.truncate), "boolean" === typeof n.multihit && (p = n.multihit), "boolean" === typeof n.last && (u = n.last), s = g(B, s, k, p, n.separator, q, u), p) c -= s.paramSize + s.strSize, G += s.param + s.str; else if (u) s.paramSize + s.strSize > c && (s.str = s.str.substring(0, c - s.paramSize),
              s.strSize = s.str.length), v = B, A = s; else if (d[B] = s, d[B].paramSize + d[B].strSize > c && !d[B].truncate) { a.emit("Tracker:Hit:Build:Error", { lvl: "ERROR", msg: 'Too long parameter: "' + d[B].param + '"', details: { value: d[B].str } }); m = !0; r = B; break } v && (d[v] = A); d = [d, m, r, G]; e = d[0]; m = d[1]; h = d[3]; m && (d = d[2], e = e[d], e.str = e.str.substring(0, c - e.paramSize), e.strSize = e.str.length, m = {}, m.mherr = g("mherr", "1", !1, !1, "", !1, !1), m[d] = e, e = m); e = l(e, c); if (null === e[1]) f = e[0]; else for (f.push(e[0]); null !== e[1];)e = l(e[1], c), f.push(e[0]); return f
        },
          n = ""; a.buffer.presentInFilters(e, "hitType") || (e = a.buffer.addInFilters(e, "hitType", ["page"])); e = a.buffer.addInFilters(e, "hitType", ["all"]); var q, k; if (ATInternet.Utils.isObject(f)) {
            e = a.buffer.addInFilters(e, "permanent", !0); e = a.buffer.get(e, !0); for (q in f) f.hasOwnProperty(q) && (n = {}, f[q] && "object" === typeof f[q] && f[q].hasOwnProperty("_value") ? (k = f[q]._value, f[q].hasOwnProperty("_options") && (n = f[q]._options)) : k = f[q], k = ATInternet.Utils.privacy.testBufferParam(q, k), k.toSetInBuffer && (e[q] = {
              _value: k.value,
              _options: n
            })); n = s(e)
          } else for (q in e = a.buffer.get(e, !0), n = s(e), e) e.hasOwnProperty(q) && (e[q]._options && e[q]._options.permanent || a.buffer.del(q)); d && d(n, h)
      }; k.getCollectDomain = function () { var b = "", b = a.getConfig("logSSL") || a.getConfig("log"), e = a.getConfig("domain"); return b = b && e ? b + "." + e : a.getConfig("collectDomainSSL") || a.getConfig("collectDomain") }; var e = function (b) {
        var e = "", f = a.getConfig("baseURL"); if (f) e = f; else {
          var f = k.getCollectDomain(), d = a.getConfig("pixelPath"), d = d || "/"; "/" !== d.charAt(0) && (d = "/" +
            d); f && (e = (a.getConfig("forceHttp") ? "http://" : "https://") + f + d)
        } f = a.getConfig("site"); e && f ? b && b(null, e + "?s=" + f) : b && b({ message: "Config error" })
      }, q = function (a, b, d) { e(function (e, g) { e ? d && d(e) : (c = h - (g.length + 27), f(a, b, function (a, b) { var e = [], f = ATInternet.Utils.uuid().num(13); if (a instanceof Array) for (var c = 1; c <= a.length; c++)e.push(g + b + "&mh=" + c + "-" + a.length + "-" + f + a[c - 1]); else e.push(g + b + a); d && d(null, e) })) }) }, n = function (b, e, f, d, g, c, l) {
        return function () {
          return function (h) {
            a.emit(b, {
              lvl: g, details: {
                hit: e, method: f,
                event: h, isMultiHit: c, elementType: l
              }
            }); d && d()
          }
        }()
      }; k.send = function (b, e, f, d, g) { q(b, e, function (b, e) { if (b) a.emit("Tracker:Hit:Build:Error", { lvl: "ERROR", msg: b.message, details: {} }), f && f(); else for (var c = 0; c < e.length; c++)k.sendUrl(e[c], f, d, g) }) }; h = Math.max(a.getConfig("maxHitSize") || 0, 2E3); c = Math.max(a.getConfig("maxHitSize") || 0, 2E3); d = a.getConfig("requestMethod"); k.sendUrl = function (b, e, f, g) {
        var c = -1 < b.indexOf("&mh="); f = f || d; ATInternet.Utils.isOptedOut() && !a.getConfig("sendHitWhenOptOut") ? n("Tracker:Hit:Sent:NoTrack",
          b, f, e, "INFO", c, g)() : "POST" === f && ATInternet.Utils.isBeaconMethodAvailable() ? (g = "Tracker:Hit:Sent:Error", f = "ERROR", window.navigator.sendBeacon(b, null) && (g = "Tracker:Hit:Sent:Ok", f = "INFO"), n(g, b, "POST", e, f, c, "")()) : (f = new Image, f.onload = n("Tracker:Hit:Sent:Ok", b, "GET", e, "INFO", c, g), f.onerror = n("Tracker:Hit:Sent:Error", b, "GET", e, "ERROR", c, g), f.src = b)
      }
    }, TriggersManager = function () {
      function a(a, d, g) { for (var c = [], f = 0; f < a.length; f++)a[f].callback(d, g), a[f].singleUse || c.push(a[f]); return c } function k(a, d, g,
        c) { var f = a.shift(); if ("*" === f) return d["*"] = d["*"] || [], d["*"].push({ callback: g, singleUse: c }), d["*"].length - 1; if (0 === a.length) return k([f, "*"], d, g, c); d["*"] = d["*"] || []; d[f] = d[f] || {}; return k(a, d[f], g, c) } function h(b, d, g, c) { var f = d.shift(); "*" !== f && (0 === d.length ? h(b, [f, "*"], g, c) : g[f] && (g[f]["*"] = a(g[f]["*"], b, c), h(b, d, g[f], c))) } var c = {}; this.on = function (a, d, g) { g = g || !1; return k(a.split(":"), c, d, g) }; this.emit = function (b, d) { c["*"] && (c["*"] = a(c["*"], b, d)); h(b, b.split(":"), c, d) }
    }, PluginsManager = function (a) {
      var k =
        {}, h = {}, c = 0, b = {}, d = 0, g = function (a) { var b = !1; k[a] && (b = !0); return b }, l = this.unload = function (b) { g(b) ? (k[b] = void 0, a.emit("Tracker:Plugin:Unload:" + b + ":Ok", { lvl: "INFO" })) : a.emit("Tracker:Plugin:Unload:" + b + ":Error", { lvl: "ERROR", msg: "not a known plugin" }); return a }, f = this.load = function (b, e) {
          "function" === typeof e ? "undefined" === typeof a.getConfig.plgAllowed || 0 === a.getConfig.plgAllowed.length || -1 < a.getConfig.plgAllowed.indexOf(b) ? (k[b] = new e(a), h[b] && g(b) && (h[b] = !1, c--, g(b + "_ll") && l(b + "_ll"), 0 === c && a.emit("Tracker:Plugin:Lazyload:File:Complete",
            { lvl: "INFO", msg: "LazyLoading triggers are finished" })), a.emit("Tracker:Plugin:Load:" + b + ":Ok", { lvl: "INFO" })) : a.emit("Tracker:Plugin:Load:" + b + ":Error", { lvl: "ERROR", msg: "Plugin not allowed", details: {} }) : a.emit("Tracker:Plugin:Load:" + b + ":Error", { lvl: "ERROR", msg: "not a function", details: { obj: e } }); return a
        }, e = this.isLazyloading = function (a) { return a ? !0 === h[a] : 0 !== c }, q = function (a) { return !g(a) && !e(a) && g(a + "_ll") }, n = function (b) { h[b] = !0; c++; ATInternet.Utils.loadScript({ url: a.getConfig("lazyLoadingPath") + b + ".js" }) },
        p = function (a) { return q(a) ? (n(a), !0) : !1 }, m = function (a) { b[a] ? b[a]++ : b[a] = 1; d++ }, r = function (a, b, e, f) { var d = null; b = b.split("."); g(a) && k[a][b[0]] && (d = 1 < b.length && k[a][b[0]][b[1]] ? k[a][b[0]][b[1]].apply(k[a], e) : k[a][b[0]].apply(k[a], e)); f && f(d) }, t = function (e, f, g, c) { m(e); a.onTrigger("Tracker:Plugin:Load:" + e + ":Ok", function () { r(e, f, g, function (f) { b[e]--; d--; 0 === d && a.emit("Tracker:Plugin:Lazyload:Exec:Complete", { lvl: "INFO", msg: "All exec waiting for lazyloading are done" }); c && c(f) }) }, !0) }, s = function (a) {
          for (var b =
            { mcount: 0, plugins: {} }, e = 0; e < a.length; e++)k.hasOwnProperty(a[e]) || (b.mcount++, b.plugins[a[e]] = !0); return b
        }; this.isExecWaitingLazyloading = function () { return 0 !== d }; a.exec = this.exec = function (a, b, f, d) { q(a) ? (t(a, b, f, d), n(a)) : e(a) ? t(a, b, f, d) : r(a, b, f, d) }; this.waitForDependencies = function (b, e) {
          var f = s(b); if (0 === f.mcount) a.emit("Tracker:Plugin:Dependencies:Loaded", { lvl: "INFO", details: { dependencies: b } }), e(); else for (var d in f.plugins) f.plugins.hasOwnProperty(d) && (a.emit("Tracker:Plugin:Dependencies:Error",
            { lvl: "WARNING", msg: "Missing plugin " + d }), a.onTrigger("Tracker:Plugin:Load:" + d, function (a, b) { var d = a.split(":"), g = d[3]; "Ok" === d[4] && (f.plugins[g] = !1, f.mcount--, 0 === f.mcount && e()) }, !0), p(d))
        }; this.init = function () { for (var a in ATInternet.Tracker.pluginProtos) ATInternet.Tracker.pluginProtos.hasOwnProperty(a) && f(a, ATInternet.Tracker.pluginProtos[a]) }
    }, CallbacksManager = function (a) {
      var k = this, h = {}, c = function (b) {
        if (b.name) {
          var d = !0, g = a.getConfig("callbacks"); "undefined" !== typeof g && (g.include instanceof Array &&
            -1 === ATInternet.Utils.arrayIndexOf(g.include, b.name) && (d = !1), g.exclude instanceof Array && -1 !== ATInternet.Utils.arrayIndexOf(g.exclude, b.name) && (d = !1)); ATInternet.Callbacks && ATInternet.Callbacks.hasOwnProperty(b.name) && (g = {}, g[b.name] = { "function": ATInternet.Callbacks[b.name] }, d && k.load(b.name, g[b.name]["function"]), ATInternet.Tracker.callbackProtos[b.name] || (ATInternet.Tracker.callbackProtos[b.name] = g[b.name]))
        }
      }; k.load = function (b, d) {
        "function" === typeof d ? (new d(a), a.emit("Tracker:Callback:Load:" +
          b + ":Ok", { lvl: "INFO", details: { obj: d } })) : a.emit("Tracker:Callback:Load:" + b + ":Error", { lvl: "ERROR", msg: "not a function", details: { obj: d } }); return a
      }; k.init = function () {
        if (a.getConfig("activateCallbacks")) {
          var b = a.getConfig("callbacks"); if ("undefined" !== typeof b && b.include instanceof Array) for (var d = 0; d < b.include.length; d++)ATInternet.Callbacks && ATInternet.Callbacks.hasOwnProperty(b.include[d]) && (h[b.include[d]] = { "function": ATInternet.Callbacks[b.include[d]] }, ATInternet.Tracker.callbackProtos[b.include[d]] ||
            (ATInternet.Tracker.callbackProtos[b.include[d]] = h[b.include[d]])); else for (d in ATInternet.Callbacks) ATInternet.Callbacks.hasOwnProperty(d) && (h[d] = { "function": ATInternet.Callbacks[d] }, ATInternet.Tracker.callbackProtos[d] || (ATInternet.Tracker.callbackProtos[d] = h[d])); if ("undefined" !== typeof b && b.exclude instanceof Array) for (d = 0; d < b.exclude.length; d++)delete h[b.exclude[d]]; for (var g in h) h.hasOwnProperty(g) && h[g] && k.load(g, h[g]["function"]); ATInternet.Utils.addCallbackEvent(c)
        }
      }; k.removeCallbackEvent =
        function () { ATInternet.Utils.removeCallbackEvent(c) }
    }, BufferManager = function (a) {
      var k = this, h = {}; k.set = function (a, b, c) { b = ATInternet.Utils.privacy.testBufferParam(a, b); b.toSetInBuffer && (c = c || {}, c.hitType = c.hitType || ["page"], h[a] = { _value: b.value, _options: c }) }; var c = function (a, b, c) { return (a = ATInternet.Utils.cloneSimpleObject(a[b])) && !c ? a._value : a }, b = function g(a, b) {
        if (!(a && b instanceof Array && a instanceof Array)) return []; if (0 === a.length) return b; var e = a[0], c, n = [], k = ATInternet.Utils.cloneSimpleObject(a);
        k.shift(); for (var m = 0; m < b.length; m++)if ("object" !== typeof e[1]) h[b[m]] && h[b[m]]._options[e[0]] === e[1] && n.push(b[m]); else { c = e[1].length; for (var r = 0; r < c; r++)if (h[b[m]] && h[b[m]]._options[e[0]] instanceof Array && 0 <= ATInternet.Utils.arrayIndexOf(h[b[m]]._options[e[0]], e[1][r])) { n.push(b[m]); break } } return g(k, n)
      }; k.get = function (a, l) { var f = {}; if ("string" === typeof a) f = c(h, a, l); else for (var e = b(a, ATInternet.Utils.getObjectKeys(h)), q = 0; q < e.length; q++)f[e[q]] = c(h, e[q], l); return f }; k.presentInFilters = function (a,
        b) { return a && 0 !== a.length ? a[0][0] === b ? !0 : k.presentInFilters(a.slice(1), b) : !1 }; k.addInFilters = function (a, b, f, e) { if (!a || 0 === a.length) return e ? [] : [[b, f]]; var c = a[0][0], h = a[0][1]; c === b && (h instanceof Array && -1 === ATInternet.Utils.arrayIndexOf(h, f[0]) && h.push(f[0]), e = !0); return [[c, h]].concat(k.addInFilters(a.slice(1), b, f, e)) }; k.del = function (a) { h[a] = void 0 }; k.clear = function () { h = {} }
    }, PropertiesManager = function (a) {
      var k = this, h = {}; k.setProp = function (a, b, d) { "undefined" !== typeof a && (h[a] = { value: b, persistent: !!d }) };
      k.setProps = function (a, b) { if (ATInternet.Utils.isObject(a)) for (var d in a) a.hasOwnProperty(d) && k.setProp(d, a[d], b) }; k.delProp = function (c, b) { "undefined" !== typeof h[c] && delete h[c]; !b && a.delParam(c.toLowerCase()) }; k.delProps = function (a) { for (var b in h) h.hasOwnProperty(b) && k.delProp(b, a) }; k.getProp = function (a) { h = h || {}; return h[a] }; k.getProps = function () { return h }
    }, Tag = function (a, k, h) {
      k = k || {}; var c = this; c.version = "5.29.4"; var b = ATInternet.Utils.cloneSimpleObject(k); c.triggers = new TriggersManager(c); c.emit =
        c.triggers.emit; c.onTrigger = c.triggers.on; var d = ATInternet.Utils.cloneSimpleObject(dfltGlobalCfg) || {}, g; for (g in a) a.hasOwnProperty(g) && (d[g] = a[g]); c.getConfig = function (a) { return d[a] }; c.setConfig = function (a, b, g) { void 0 !== d[a] && g || (c.emit("Tracker:Config:Set:" + a, { lvl: "INFO", details: { bef: d[a], aft: b } }), d[a] = b) }; c.configPlugin = function (a, b, g) {
          d[a] = d[a] || {}; for (var l in b) b.hasOwnProperty(l) && void 0 === d[a][l] && (d[a][l] = b[l]); g && (g(d[a]), c.onTrigger("Tracker:Config:Set:" + a, function (a, b) { g(b.details.aft) }));
          return d[a]
        }; c.getAllContext = function () { return b }; c.getContext = function (a) { return b[a] }; c.setContext = function (a, e) { c.emit("Tracker:Context:Set:" + a, { lvl: "INFO", details: { bef: b[a], aft: e } }); b[a] = e }; c.delContext = function (a, e) { c.emit("Tracker:Context:Deleted:" + a + ":" + e, { lvl: "INFO", details: { key1: a, key2: e } }); if (a) b.hasOwnProperty(a) && (e ? b[a] && b[a].hasOwnProperty(e) && (b[a][e] = void 0) : b[a] = void 0); else if (e) for (var d in b) b.hasOwnProperty(d) && b[d] && b[d].hasOwnProperty(e) && (b[d][e] = void 0) }; c.plugins = new PluginsManager(c);
      c.buffer = new BufferManager(c); c.setParam = c.buffer.set; c.getParams = function (a) { return c.buffer.get(a, !1) }; c.getParam = c.buffer.get; c.delParam = c.buffer.del; c.builder = new BuildManager(c); c.sendUrl = c.builder.sendUrl; c.callbacks = new CallbacksManager(c); c.properties = new PropertiesManager(c); c.setProp = c.properties.setProp; c.setProps = c.properties.setProps; c.delProp = c.properties.delProp; c.delProps = c.properties.delProps; c.getProp = c.properties.getProp; c.getProps = c.properties.getProps; c.sendHit = function (a, b, d,
        g, l) { var m = c.getProps(), h, k; for (k in m) m.hasOwnProperty(k) && (h = m[k].value, m[k].persistent ? c.setParam(k.toLowerCase(), h, { permanent: !0, hitType: ["all"], encode: !0 }) : (ATInternet.Utils.isObject(a) ? a[k.toLowerCase()] = { _value: h, _options: { hitType: ["all"], encode: !0 } } : c.setParam(k.toLowerCase(), h, { hitType: ["all"], encode: !0 }), c.delProp(k, !0))); c.builder.send(a, b, d, g, l) }; ATInternet.Utils.privacy.resetParameters(); c.setParam("ts", function () { return (new Date).getTime() }, { permanent: !0, hitType: ["all"] }); (c.getConfig("disableCookie") ||
          c.getConfig("disableStorage")) && c.setParam("idclient", ATInternet.Utils.privacy.CONSENTNO, { permanent: !0, hitType: ["all"] }); c.getConfig("medium") && c.setParam("medium", c.getConfig("medium"), { permanent: !0, hitType: ["all"] }); if (c.getConfig("urlPropertyAuto") && "undefined" !== typeof window && "undefined" !== typeof window.location) {
            g = (c.getConfig("urlPropertyQueryString") ? window.location.href : window.location.protocol + "//" + window.location.host + window.location.pathname).replace(/[<>]/g, "").substring(0, 1600).replace(/&/g,
              "$").replace(/#/g, "\u00b5"); var l = c.getContext("page") || {}; l.url = window.encodeURIComponent(g); c.setContext("page", l); c.setParam("page_url", g, { permanent: !0, hitType: "page click publisher selfPromotion onSiteAdsClick onSiteAdsImpression InternalSearch mvtesting richmedia".split(" ") })
          } c.plugins.init(); c.callbacks.init(); c.emit("Tracker:Ready", { lvl: "INFO", msg: "Tracker initialized", details: { tracker: c, args: { config: a, context: k, callback: h } } }); h && h(c); ATInternet.Tracker.instances.push(c)
    };
    ATInternet.Tracker.Tag = Tag; ATInternet.Tracker.instances = []; ATInternet.Tracker.pluginProtos = {}; ATInternet.Tracker.addPlugin = function (a, k) { k = k || ATInternet.Tracker.Plugins[a]; if (!ATInternet.Tracker.pluginProtos[a]) { ATInternet.Tracker.pluginProtos[a] = k; for (var h = 0; h < ATInternet.Tracker.instances.length; h++)ATInternet.Tracker.instances[h].plugins.load(a, k) } }; ATInternet.Tracker.delPlugin = function (a) { if (ATInternet.Tracker.pluginProtos[a]) { ATInternet.Tracker.pluginProtos[a] = void 0; for (var k = 0; k < ATInternet.Tracker.instances.length; k++)ATInternet.Tracker.instances[k].plugins.unload(a) } };
    ATInternet.Tracker.callbackProtos = {};
  }).call(window); (function () {
    var dfltPluginCfg = { "lifetime": 30, "lastPersistence": true, "domainAttribution": true, "enableUTMTracking": true, "UTMParameters": ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"], "querystringPrefix": "at_" }; var dfltGlobalCfg = { "visitLifetime": 30, "redirectionLifetime": 30 }; ATInternet.Tracker.Plugins.Campaigns = function (a) {
      function k(a, b, e) { for (var d = {}, f = RegExp("[&#?]{1}([^&=#?]*)=([^&#]*)?", "g"), c = f.exec(b); null !== c;)0 === c[1].indexOf(a) && (d[e + c[1].substring(a.length)] = c[2]), c = f.exec(b); return d } a.setConfig("visitLifetime", dfltGlobalCfg.visitLifetime, !0); a.setConfig("redirectionLifetime", dfltGlobalCfg.redirectionLifetime, !0); var h = {}, c, b; a.configPlugin("Campaigns", dfltPluginCfg || {}, function (a) { h = a }); var d, g, l, f, e, q, n, p, m, r, t, s, u, v, A, w = function () {
        var b = function (a) {
          var b =
            ""; a && (b = isNaN(a) && -1 === a.search(/^\[(.*?)\]$/g) && -1 === a.search(/^\d+\[(.*?)\]$/g) ? "[" + a + "]" : a); return b
        }, e = function (a) { var b = a; -1 !== a.search(/[-]/g) && -1 === a.search(/^\[(.*?)\]$/g) && (b = "[" + a + "]"); return b }, d = function (a) { for (; "-" === a.charAt(a.length - 1);)a = a.substring(0, a.length - 1); return a }; this.SponsoredLinks = function () {
          var f = {
            google: "goo", yahoo: "ysm", miva: "miv", orange: "wan", msn: "msn", mirago: "mir", sklik: "skl", adfox: "adf", etarget: "etg", yandex: "yan", ebay: "eba", searchalliance: "sal", bing: "bin", naver: "nav",
            baidu: "bdu", qwant: "qwt", waze: "waz", amazon: "amz"
          }, c = { search: "s", content: "c" }; this.atMedium = "sl"; this.atTerm = this.atNetwork = this.atVariant = this.atCreation = this.atPlatform = this.atCampaign = ""; this.format = function () { var a = "sec", g = b(this.atCampaign), m = f[this.atPlatform] || e(this.atPlatform), l = b(this.atCreation), h = b(this.atVariant), s = c[this.atNetwork] || e(this.atNetwork), n = b(this.atTerm); return d(a + ("-" + g + "-" + m + "-" + l + "-" + h + "-" + s + "-" + n)) }; this.setProperties = function (b) {
            var e = a.utils.getQueryStringValue(h.querystringPrefix +
              "source", b) || ""; this.atCampaign = a.utils.getQueryStringValue(h.querystringPrefix + "campaign", b) || ""; this.atPlatform = a.utils.getQueryStringValue(h.querystringPrefix + "platform", b) || ""; this.atCreation = a.utils.getQueryStringValue(h.querystringPrefix + "creation", b) || ""; this.atVariant = a.utils.getQueryStringValue(h.querystringPrefix + "variant", b) || ""; this.atNetwork = a.utils.getQueryStringValue(h.querystringPrefix + "network", b) || ""; this.atTerm = a.utils.getQueryStringValue(h.querystringPrefix + "term", b) || ""; a.setContext("campaigns_events",
                { source: e, medium: this.atMedium, campaign: this.atCampaign, platform: this.atPlatform, creation: this.atCreation, variant: this.atVariant, network: this.atNetwork, term: this.atTerm })
          }
        }; this.Email = function () {
          var f = { acquisition: "erec", retention: "epr", promotion: "es" }; this.atMedium = "email"; this.atSendTime = this.atRecipientList = this.atRecipientId = this.atLink = this.atSendDate = this.atCreation = this.atCampaign = this.atEmailtype = ""; this.format = function () {
            var a = f[this.atEmailtype] || f.promotion, c = b(this.atCampaign), g = b(this.atCreation),
              m = e(this.atSendDate), l = b(this.atLink), h = e(this.atRecipientId) + (this.atRecipientList ? "@" + e(this.atRecipientList) : ""), s = e(this.atSendTime); return d(a + ("-" + c + "-" + g + "-" + m + "-" + l + "-" + h + "-" + s))
          }; this.setProperties = function (b) {
            var e = a.utils.getQueryStringValue(h.querystringPrefix + "source", b) || ""; this.atEmailtype = a.utils.getQueryStringValue(h.querystringPrefix + "emailtype", b) || ""; this.atCampaign = a.utils.getQueryStringValue(h.querystringPrefix + "campaign", b) || ""; this.atCreation = a.utils.getQueryStringValue(h.querystringPrefix +
              "creation", b) || ""; this.atSendDate = a.utils.getQueryStringValue(h.querystringPrefix + "send_date", b) || ""; this.atLink = a.utils.getQueryStringValue(h.querystringPrefix + "link", b) || ""; this.atRecipientId = a.utils.getQueryStringValue(h.querystringPrefix + "recipient_id", b) || ""; this.atRecipientList = a.utils.getQueryStringValue(h.querystringPrefix + "recipient_list", b) || ""; this.atSendTime = a.utils.getQueryStringValue(h.querystringPrefix + "send_time", b) || ""; a.setContext("campaigns_events", {
                source: e, medium: this.atMedium,
                emailtype: this.atEmailtype, campaign: this.atCampaign, creation: this.atCreation, send_date: this.atSendDate, link: this.atLink, recipient_id: this.atRecipientId, recipient_list: this.atRecipientList, send_time: this.atSendTime
              })
          }
        }; this.Affiliate = function () {
          this.atMedium = "affiliate"; this.atVariant = this.atCreation = this.atFormat = this.atIdentifier = this.atType = this.atCampaign = ""; this.format = function () {
            var a = "al", e = b(this.atCampaign), f = b(this.atType), c = b(this.atIdentifier), g = b(this.atFormat), m = b(this.atCreation), l =
              b(this.atVariant); return d(a + ("-" + e + "-" + f + "-" + c + "-" + g + "-" + m + "-" + l))
          }; this.setProperties = function (b) {
            var e = a.utils.getQueryStringValue(h.querystringPrefix + "source", b) || ""; this.atCampaign = a.utils.getQueryStringValue(h.querystringPrefix + "campaign", b) || ""; this.atType = a.utils.getQueryStringValue(h.querystringPrefix + "type", b) || ""; this.atIdentifier = a.utils.getQueryStringValue(h.querystringPrefix + "identifier", b) || ""; this.atFormat = a.utils.getQueryStringValue(h.querystringPrefix + "format", b) || ""; this.atCreation =
              a.utils.getQueryStringValue(h.querystringPrefix + "creation", b) || ""; this.atVariant = a.utils.getQueryStringValue(h.querystringPrefix + "variant", b) || ""; a.setContext("campaigns_events", { source: e, medium: this.atMedium, campaign: this.atCampaign, type: this.atType, identifier: this.atIdentifier, format: this.atFormat, creation: this.atCreation, variant: this.atVariant })
          }
        }; this.Display = function () {
          this.atMedium = "display"; this.atDetailPlacement = this.atGeneralPlacement = this.atChannel = this.atFormat = this.atVariant = this.atCreation =
            this.atCampaign = ""; this.format = function () { var a = "ad", e = b(this.atCampaign), f = b(this.atCreation), c = b(this.atVariant), g = b(this.atFormat), m = b(this.atChannel), l = b(this.atGeneralPlacement), h = b(this.atDetailPlacement); return d(a + ("-" + e + "-" + f + "-" + c + "-" + g + "-" + m + "-" + l + "-" + h)) }; this.setProperties = function (b) {
              var e = a.utils.getQueryStringValue(h.querystringPrefix + "source", b) || ""; this.atCampaign = a.utils.getQueryStringValue(h.querystringPrefix + "campaign", b) || ""; this.atCreation = a.utils.getQueryStringValue(h.querystringPrefix +
                "creation", b) || ""; this.atVariant = a.utils.getQueryStringValue(h.querystringPrefix + "variant", b) || ""; this.atFormat = a.utils.getQueryStringValue(h.querystringPrefix + "format", b) || ""; this.atChannel = a.utils.getQueryStringValue(h.querystringPrefix + "channel", b) || ""; this.atGeneralPlacement = a.utils.getQueryStringValue(h.querystringPrefix + "general_placement", b) || ""; this.atDetailPlacement = a.utils.getQueryStringValue(h.querystringPrefix + "detail_placement", b) || ""; a.setContext("campaigns_events", {
                  source: e, medium: this.atMedium,
                  campaign: this.atCampaign, creation: this.atCreation, variant: this.atVariant, format: this.atFormat, channel: this.atChannel, general_placement: this.atGeneralPlacement, detail_placement: this.atDetailPlacement
                })
            }
        }; this.Custom = function () {
          this.atCustom4 = this.atCustom3 = this.atCustom2 = this.atCustom1 = this.atCampaign = this.atMedium = ""; this.format = function () {
            var a = ""; /\d+$/.test(this.atMedium) && (a = /\d+$/.exec(this.atMedium)[0]); var a = "cs" + a, e = b(this.atCampaign), f = b(this.atCustom1), c = b(this.atCustom2), g = b(this.atCustom3),
              m = b(this.atCustom4); return d(a + ("-" + e + "-" + f + "-" + c + "-" + g + "-" + m))
          }; this.setProperties = function (b) {
            var e = a.utils.getQueryStringValue(h.querystringPrefix + "source", b) || ""; this.atMedium = a.utils.getQueryStringValue(h.querystringPrefix + "medium", b) || ""; this.atCampaign = a.utils.getQueryStringValue(h.querystringPrefix + "campaign", b) || ""; this.atCustom1 = a.utils.getQueryStringValue(h.querystringPrefix + "custom1", b) || ""; this.atCustom2 = a.utils.getQueryStringValue(h.querystringPrefix + "custom2", b) || ""; this.atCustom3 =
              a.utils.getQueryStringValue(h.querystringPrefix + "custom3", b) || ""; this.atCustom4 = a.utils.getQueryStringValue(h.querystringPrefix + "custom4", b) || ""; a.setContext("campaigns_events", { source: e, medium: this.atMedium, campaign: this.atCampaign, custom1: this.atCustom1, custom2: this.atCustom2, custom3: this.atCustom3, custom4: this.atCustom4 })
          }
        }; this.CustomNdf = function () { this.format = function () { }; this.setProperties = function (b) { a.setProps(k(h.querystringPrefix, b, "src_"), !0) } }; this.medium = {
          sl: this.SponsoredLinks, email: this.Email,
          affiliate: this.Affiliate, display: this.Display
        }
      }, C = function (b, e) { var d = a.getContext("campaigns") || {}; d[b] = e; a.setContext("campaigns", d) }, E = function () {
        var b = a.utils.getLocation(), e = function () { var e = k("utm_", b, ""), d = !1, f; for (f in e) e.hasOwnProperty(f) && (C("utm_" + f, e[f]), d = !0); d && a.setContext("campaigns_utm_events", e) }; (function () {
          var e = a.utils.getQueryStringValue(h.querystringPrefix + "medium", b); if (e && !t) {
            var d = new w, e = "function" === typeof d.medium[e] ? new d.medium[e] : 0 === e.indexOf("custom") ? new d.Custom :
              new d.CustomNdf; e.setProperties(b); n = e.format()
          } else n = a.utils.getQueryStringValue("xtor", b); p = a.utils.getQueryStringValue("xtdt", b); m = a.utils.getQueryStringValue("xts", b)
        })(); h.enableUTMTracking && e()
      }, D = function (e, d) { var f = a.storage[b](e); if (null !== f) return "object" === typeof f && !(f instanceof Array); a.storage[c](e, {}, d); return !0 }; (function () {
        a.plugins.waitForDependencies(["Storage", "Utils"], function () {
          c = "set" + (h.domainAttribution ? "" : "Private"); b = "get" + (h.domainAttribution ? "" : "Private"); d = a.storage[b](["atredir",
            "gopc"]); g = a.storage[b](["atredir", "gopc_err"]); l = a.storage[b](["atredir", "camp"]); a.storage.del(["atredir", "gopc"]); a.storage.del(["atredir", "gopc_err"]); a.storage.del(["atredir", "camp"]); f = a.storage[b](["atsession", "histo_camp"]); e = a.storage[b](["atreman", "camp"]); q = a.storage[b](["atreman", "date"]); r = a.getContext("forcedCampaign"); t = a.getContext("forcedCampaignV2"); a: {
              var k = t; if (k) {
                var x = "", y; for (y in k) k.hasOwnProperty(y) && (x += "&" + h.querystringPrefix + y + "=" + k[y]); if (k = a.utils.getQueryStringValue(h.querystringPrefix +
                  "medium", x)) { y = new w; k = "function" === typeof y.medium[k] ? new y.medium[k] : 0 === k.indexOf("custom") ? new y.Custom : new y.CustomNdf; k.setProperties(x); s = k.format(); break a }
              } s = void 0
            } E(); u = !!a.getConfig("redirect"); v = !!(n && p && m); A = !1; v && (x = (new Date).getTime() / 6E4, A = !u && m !== a.getConfig("site") || 0 > x - p || x - p >= a.getConfig("visitLifetime")); x = s || r || l || n; u && x && D("atredir", { path: "/", end: a.getConfig("redirectionLifetime") }) && (a.storage[c](["atredir", "camp"], x), k = x = !1, r || s || (l ? (x = d, k = g) : (x = v, k = A)), a.storage[c](["atredir",
              "gopc"], x), a.storage[c](["atredir", "gopc_err"], k)); !u && e && (C("xtor", e), x = (new Date).getTime() / 36E5, x = Math.floor(x - q), C("roinbh", 0 <= x ? x : 0)); u || (x = null, x = l ? d ? s || r || x : s || r || l : v ? s || r : s || r || n || x, f && f instanceof Array && -1 < f.indexOf(x) && (x = null), x && C("xto", x)); if (!u && !r && !s) { var z; l ? g && (z = l) : A && (z = n); z && C("pgt", z) } if (!u && (z = l ? s || r || l : s || r || n || null) && !(!r && !s && !l && v && A || !r && !s && l && d && g)) {
                if ((!f || f instanceof Array && 0 > f.indexOf(z)) && D("atsession", { path: "/", session: 60 * a.getConfig("visitLifetime") })) a.storage[c](["atsession",
                  "histo_camp"], f && f.push(z) ? f : [z]); e && !h.lastPersistence || !D("atreman", { path: "/", session: 86400 * h.lifetime }) || (a.storage[c](["atreman", "camp"], z), a.storage[c](["atreman", "date"], (new Date).getTime() / 36E5))
              } a.emit("Campaigns:process:done", { lvl: "INFO" })
        })
      })()
    }; ATInternet.Tracker.addPlugin("Campaigns");
  }).call(window); (function () {
    var dfltPluginCfg = {}; var dfltGlobalCfg = { "storageMode": "cookie" }; ATInternet.Tracker.Plugins.Storage = function (a) {
      var k = this, h = {}, c = !1, b = null; a.configPlugin("Storage", dfltPluginCfg || {}, function (a) { h = a; "localStorage" === h.storageMode && (c = ATInternet.Utils.isLocalStorageAvailable()) }); var d = {}, g = function (b) { return a.getConfig("base64Storage") ? ATInternet.Utils.Base64.encode(b) : encodeURIComponent(b) }, l = function (b) { return a.getConfig("base64Storage") ? ATInternet.Utils.Base64.decode(b) : decodeURIComponent(b) }, f = function () {
        this.getData = function (a) {
          var b = null; (a = RegExp("(?:^| )" +
            a + "=([^;]+)").exec(document.cookie) || null) && (b = l(a[1])); return b
        }; this.setData = function (b) {
          var c = !1; if (b.name && "string" === typeof b.name) {
            var d = b.options || {}, e = d.end || {}, f = d.domain || a.getConfig("cookieDomain"), h = d.secure || a.getConfig("cookieSecure"), k = d.samesite || a.getConfig("sameSiteStrict"), l = ATInternet.Utils.jsonSerialize(b), l = b.name + "=" + g(l), l = l + (d.path && "string" === typeof d.path ? ";path=" + d.path : ""), l = l + (f && "string" === typeof f ? ";domain=" + f : "") + (h && "boolean" === typeof h ? ";secure" : ""), l = l + (k && "boolean" ===
              typeof k ? ";samesite=strict" : ""); "function" === typeof e.toUTCString ? l += ";expires=" + e.toUTCString() : "number" === typeof e && (l += ";max-age=" + e.toString()); document.cookie = l; this.getData(b.name) && (c = !0)
          } return c
        }
      }; b = c ? new function () {
        var a = function (a) { var b = +new Date, c = !1, d; a.options && ("undefined" !== typeof a.options.expires ? d = a.options.expires : (a = a.options.end || {}, "function" === typeof a.getTime ? d = a.getTime() : "number" === typeof a && (d = b + 1E3 * a))); "number" === typeof d && b >= d && (c = !0); return { itemToDelete: c, timestamp: d } },
          b = function (a) { var b = !1; try { localStorage.removeItem(a), b = !0 } catch (c) { } return b }; this.getData = function (c) { var d = null, e = localStorage.getItem(c); if (e) { var e = l(e), f = ATInternet.Utils.jsonParse(e); f && "object" === typeof f ? a(f).itemToDelete && b(c) || (delete f.options.expires, d = ATInternet.Utils.jsonSerialize(f)) : d = e } return d }; this.setData = function (c) {
            var d = !1; if (c.name && "string" === typeof c.name) {
              var e = a(c); "number" === typeof e.timestamp && (c.options.expires = e.timestamp); var f = ATInternet.Utils.jsonSerialize(c); if (e.itemToDelete) d =
                b(c.name); else try { localStorage.setItem(c.name, g(f)), d = !0 } catch (h) { }
            } return d
          }
      } : new f; var e = function (c, d) { var e = !1; c && "object" === typeof c && (d || ATInternet.Utils.consent && !a.getConfig("disableCookie") && !a.getConfig("disableStorage")) && (e = b.setData(c)); return e }, q = function (a, b, c) { a = { name: a, val: b }; c && c.session && "number" === typeof c.session && (c.end = c.session); a.options = c || {}; return a }, n = function (c) {
        var d = null, e = null; a.getConfig("disableCookie") || a.getConfig("disableStorage") || !c || "string" !== typeof c || (e =
          b.getData(c)); (c = e) && (d = ATInternet.Utils.jsonParse(c)); return d
      }, p = function (a, b) { var c = ATInternet.Utils.cloneSimpleObject(a); return e(c, b) ? ATInternet.Utils.jsonParse(ATInternet.Utils.jsonSerialize(a)) : null }, m = function (a, b, c) {
        if (!c && d[a]) c = d[a]; else if (c = n(a)) c.options = c.options || {}, c.options.session && "number" === typeof c.options.session && (c.options.end = c.options.session, p(c, !1)), d[a] = c; return c ? b ? (a = null, !c || "object" !== typeof c.val || c.val instanceof Array || void 0 === c.val[b] || (a = c.val[b]), a) : c.val :
          null
      }, r = function (a, b, c, e, f) { if (b) { if (f = n(a)) !f || "object" !== typeof f.val || f.val instanceof Array ? f = null : "undefined" === typeof c ? delete f.val[b] : f.val[b] = c, f && (f = p(f, e)) } else f = f || {}, f = q(a, c, f), f = p(f, e); return f ? (d[a] = f, f.val) : null }, t = function (a, b) { if (b) r(a, b, void 0, !0, null); else { d[a] = void 0; var c = q(a, "", { end: new Date("Thu, 01 Jan 1970 00:00:00 UTC"), path: "/" }); e(c, !0) } }; a.storage = {}; a.storage.getAll = function () { return d }; a.storage.get = k.get = function (a, b) {
        b = !!b; return a instanceof Array ? m(a[0], a[1], b) :
          m(a, "", b)
      }; a.storage.getPrivate = k.getPrivate = function (b, c) { b instanceof Array ? b[0] += a.getConfig("site") : b += a.getConfig("site"); return k.get(b, c) }; a.storage.set = k.set = function (a, b, c, d) { var e; a instanceof Array ? (e = a[0], a = a[1], c = null) : (e = a, a = null); return ATInternet.Utils.privacy.testStorageParam(e, a).toSetInStorage || d ? r(e, a, b, d, c) : null }; a.storage.setPrivate = k.setPrivate = function (b, c, d) { b instanceof Array ? b[0] += a.getConfig("site") : b += a.getConfig("site"); return k.set(b, c, d) }; a.storage.del = k.del = function (a) {
        a instanceof
          Array ? t(a[0], a[1]) : t(a, "")
      }; a.storage.delPrivate = k.delPrivate = function (b) { b instanceof Array ? b[0] += a.getConfig("site") : b += a.getConfig("site"); k.del(b) }; a.storage.cacheInvalidation = k.cacheInvalidation = function () { d = {} }
    }; ATInternet.Tracker.addPlugin("Storage");
  }).call(window); (function () {
    var dfltPluginCfg = {}; var dfltGlobalCfg = {}; ATInternet.Tracker.Plugins.Utils = function (a) {
      var k = this, h = {}; a.utils = {}; a.utils.getQueryStringValue = k.getQueryStringValue = function (a, c) { var g = ATInternet.Utils.hashcode(c).toString(); if (!h[g]) { h[g] = {}; for (var k = RegExp("[&#?]{1}([^&=#?]*)=([^&#]*)?", "g"), f = k.exec(c); null !== f;)h[g][f[1]] = f[2], f = k.exec(c) } return h[g].hasOwnProperty(a) ? h[g][a] : null }; a.utils.manageChapters = k.manageChapters = function (b, c, g) {
        var h = ""; if (b) for (var f = a.getConfig("ignoreEmptyChapterValue"), e = "", k = 1; k < parseInt(g, 10) + 1; k++)e = b[c +
          k] || "", h = f ? h + (e ? e + "::" : "") : h + (b.hasOwnProperty(c + k) ? e + "::" : ""); return h
      }; a.utils.getDocumentLevel = k.getDocumentLevel = function () { var b = a.getConfig("documentLevel"); if (b) { if (0 > b.indexOf(".")) return window[b] || document; b = b.split("."); return window[b[0]][b[1]] || document } return document }; a.utils.getLocation = k.getLocation = function () { return k.getDocumentLevel().location.href }; a.utils.getHostName = k.getHostName = function () { return k.getDocumentLevel().location.hostname }; a.dispatchIndex = {}; a.dispatchStack = [];
      a.dispatchEventFor = {}; var c = 0; a.dispatchSubscribe = function (b) { return a.dispatchIndex[b] ? !1 : (a.dispatchStack.push(b), a.dispatchIndex[b] = !0) }; a.dispatchSubscribed = function (b) { return !0 === a.dispatchIndex[b] }; a.addSpecificDispatchEventFor = function (b) { return a.dispatchEventFor[b] ? !1 : (a.dispatchEventFor[b] = !0, c++, !0) }; a.processSpecificDispatchEventFor = function (b) { a.dispatchEventFor[b] && (a.dispatchEventFor[b] = !1, c--, 0 === c && (a.dispatchEventFor = {}, a.emit("Tracker:Plugin:SpecificEvent:Exec:Complete", { lvl: "INFO" }))) };
      a.dispatch = function (b, d) { var g = function () { for (var c = "", e = null; 0 < a.dispatchStack.length;)c = a.dispatchStack.pop(), 0 === a.dispatchStack.length && (e = b), a[c].onDispatch(e, d); a.dispatchIndex = {}; a.delContext(void 0, "customObject") }, h = function () { if (a.plugins.isExecWaitingLazyloading()) a.onTrigger("Tracker:Plugin:Lazyload:Exec:Complete", function () { g() }, !0); else g() }; if (0 === c) h(); else a.onTrigger("Tracker:Plugin:SpecificEvent:Exec:Complete", function () { h() }, !0) }; a.dispatchRedirect = function (b) {
        var c = !0, g = "", h =
          null; b && (!ATInternet.Utils.isTabOpeningAction(b.event) && b.elem && a.plugins.exec("TechClicks", "manageClick", [b.elem], function (a) { c = a.preservePropagation; g = a.elementType }), h = b.callback); a.dispatch(h, g); return c
      }; a.manageSend = function (b) { if (!ATInternet.Utils.isPreview() || a.getConfig("preview")) ATInternet.Utils.isPrerender(function (a) { b(a) }) || b() }; a.processTagObject = function (b, c, g) {
        if ((b = a.getParam(b, !0)) && b._options.permanent) {
          for (var h = !1, f = b._options.hitType || [], e = 0; e < f.length; e++)if (-1 !== ATInternet.Utils.arrayIndexOf(c.concat("all"),
            f[e])) { h = !0; break } h && (g = ATInternet.Utils.completeFstLevelObj(b._value || {}, g, !0))
        } return g
      }; a.processContextObjectAndSendHit = function (b, c, g, h) {
        var f = { hitType: c.hitType, encode: c.encode, separator: c.separator, truncate: c.truncate }, e = a.getParam(b, !0); if (e) {
          for (var k = !1, n = e._options.hitType || [], p = 0; p < n.length; p++)if (-1 !== ATInternet.Utils.arrayIndexOf(c.hitType.concat("all"), n[p])) { k = !0; break } k ? (k = ATInternet.Utils.cloneSimpleObject(e), k._value = ATInternet.Utils.completeFstLevelObj(k._value || {}, g, !0), a.setParam(b,
            k._value, f), a.manageSend(function () { a.sendHit(null, [["hitType", c.hitType]], h, c.requestMethod, c.elementType) }), e._options.permanent && a.setParam(b, e._value, e._options)) : (a.setParam(b, g, f), a.manageSend(function () { a.sendHit(null, [["hitType", c.hitType]], h, c.requestMethod, c.elementType) }), a.setParam(b, e._value, e._options))
        } else a.setParam(b, g, f), a.manageSend(function () { a.sendHit(null, [["hitType", c.hitType]], h, c.requestMethod, c.elementType) })
      }
    }; ATInternet.Tracker.addPlugin("Utils");
  }).call(window); (function () {
    var dfltPluginCfg = { "clicksAutoManagementEnabled": true, "clicksAutoManagementTimeout": 500 }; var dfltGlobalCfg = {}; ATInternet.Tracker.Plugins.TechClicks = function (a) {
      var k = this, h = ["Tracker:Hit:Sent:Ok", "Tracker:Hit:Sent:Error", "Tracker:Hit:Sent:NoTrack"], c, b, d = !1; a.configPlugin("TechClicks", dfltPluginCfg || {}, function (a) { c = a.clicksAutoManagementEnabled; b = a.clicksAutoManagementTimeout }); var g = function (a) { d = !1; switch (a.target) { case "_top": window.top.location.href = a.url; break; case "_parent": window.parent.location.href = a.url; break; default: window.location.href = a.url } }, l = function (a) {
        a.mailto ? k.timeout = setTimeout(function () {
          window.location.href =
            a.mailto
        }, a.timeout) : a.form ? k.timeout = setTimeout(function () { a.form.submit() }, a.timeout) : a.url && (k.timeout = setTimeout(function () { g({ url: a.url, target: a.target }) }, a.timeout))
      }, f = function (b) { for (var c = 0; c < h.length; c++)a.onTrigger(h[c], function (a, c) { b && b(c) }) }, e = function (a) {
        for (var c, e = "_self"; a;) { if (a.href && 0 === a.href.indexOf("http")) { c = a.href.split('"').join('\\"'); e = a.target ? a.target : e; break } a = a.parentNode } c && !d && (d = !0, f(function (a) {
          a.details.isMultiHit || a.details.elementType !== ATInternet.Utils.CLICKS_REDIRECTION ||
            (k.timeout && clearTimeout(k.timeout), g({ url: c, target: e }))
        }), l({ url: c, target: e, timeout: b }))
      }, q = function (a) { for (var c = a; c && "FORM" !== c.nodeName;)c = c.parentNode; c && (f(function (a) { a.details.isMultiHit || a.details.elementType !== ATInternet.Utils.CLICKS_FORM || (k.timeout && clearTimeout(k.timeout), c.submit()) }), l({ form: c, timeout: b })) }, n = function (a) {
        for (var c = a; c && !(c.href && 0 <= c.href.indexOf("mailto:"));)c = c.parentNode; c && (f(function (a) {
          a.details.isMultiHit || a.details.elementType !== ATInternet.Utils.CLICKS_MAILTO ||
            (k.timeout && clearTimeout(k.timeout), window.location.href = c.href)
        }), l({ mailto: c.href, timeout: b }))
      }, p = function (a) {
        for (var b = a; b;) {
          if (b.href) { if (0 <= b.href.indexOf("mailto:")) return ATInternet.Utils.CLICKS_MAILTO; if (0 === b.href.indexOf("http")) return ATInternet.Utils.CLICKS_REDIRECTION } else if ("FORM" === b.nodeName) {
            var c = a; a = !1; c && (b = c.tagName || "", b = b.toLowerCase(), "form" === b ? a = !0 : (c = c.getAttribute("type") || "", c = c.toLowerCase(), "button" === b ? "reset" !== c && "button" !== c && (a = !0) : "input" === b && "submit" === c && (a =
              !0))); if (a) return ATInternet.Utils.CLICKS_FORM; break
          } b = b.parentNode
        } return ""
      }; k.isFormSubmit = function (a) { for (; a;) { if ("FORM" === a.nodeName) return !0; a = a.parentNode } return !1 }; a.techClicks = {}; a.techClicks.manageClick = k.manageClick = function (a, b) {
        var d = !0, f = ""; if (c && a) {
          var g; a: {
            for (f = a; f;) { if ("function" === typeof f.getAttribute && ("_blank" === f.getAttribute("target") || "no" === f.getAttribute("data-atclickmanagement"))) { g = !0; break a } f = f.parentNode } f = a; g = window.location.href; for (var h; f;) {
              if ((h = f.href) && 0 <= h.indexOf("#") &&
                g.substring(0, 0 <= g.indexOf("#") ? g.indexOf("#") : g.length) === h.substring(0, h.indexOf("#"))) { g = !0; break a } f = f.parentNode
            } g = !1
          } f = p(a); if (!g && f) { switch (f) { case ATInternet.Utils.CLICKS_MAILTO: n(a); d = !1; break; case ATInternet.Utils.CLICKS_FORM: q(a); d = !1; break; case ATInternet.Utils.CLICKS_REDIRECTION: e(a), d = !1 }b && (g = b.defaultPrevented, "function" === typeof b.isDefaultPrevented && (g = b.isDefaultPrevented()), g || b.preventDefault && b.preventDefault()) }
        } return { preservePropagation: d, elementType: f }
      }; a.techClicks.deactivateAutoManagement =
        function () { c = !1 }
    }; ATInternet.Tracker.addPlugin("TechClicks");
  }).call(window); (function () {
    var dfltPluginCfg = { "requestMethod": "POST" }; var dfltGlobalCfg = {}; ATInternet.Tracker.Plugins.Clicks = function (a) {
      var k = {}; a.configPlugin("Clicks", dfltPluginCfg || {}, function (a) { k = a }); var h = function (a) { var b = ""; switch (a) { case "exit": b = "S"; break; case "download": b = "T"; break; case "action": b = "A"; break; case "navigation": b = "N" }return b }, c = function (b) { return a.utils.manageChapters(b, "chapter", 3) + (b.name ? b.name : "") }, b = function (b, g) {
        var l = { p: c(b), click: h(b.type) || "" }; "undefined" !== typeof b.level2 && (l.s2 = b.level2); var f = ["click"], e = a.getContext("page") || {}; l.pclick = c(e); "undefined" !==
          typeof e.level2 && (l.s2click = e.level2); if (e = b.customObject) e = a.processTagObject("stc", f, e), l.stc = { _value: ATInternet.Utils.jsonSerialize(e), _options: { hitType: f, encode: !0, separator: ",", truncate: !0 } }; a.sendHit(l, [["hitType", f]], b.callback, k.requestMethod, g)
      }; a.click = {}; a.clickListener = {}; a.click.send = function (d) {
        d = d || {}; var c = !0, l = ""; !d.elem || "POST" === k.requestMethod && ATInternet.Utils.isBeaconMethodAvailable() || ATInternet.Utils.isTabOpeningAction(d.event) || (l = a.techClicks.manageClick(d.elem), c = l.preservePropagation,
          l = l.elementType); b(d, l); return c
      }; a.clickListener.send = function (d) { d = d || {}; if (d.elem) { var c = "click", l = ""; a.plugins.exec("TechClicks", "isFormSubmit", [d.elem], function (a) { c = a ? "submit" : "click" }); ATInternet.Utils.addEvtListener(d.elem, c, function (f) { "POST" === k.requestMethod && ATInternet.Utils.isBeaconMethodAvailable() || ATInternet.Utils.isTabOpeningAction(f) || (l = a.techClicks.manageClick(d.elem, f).elementType); b(d, l) }) } }; a.click.set = function (b) {
        b = b || {}; a.dispatchSubscribe("click"); a.setContext("click", {
          name: c(b),
          level2: b.level2 || "", customObject: b.customObject
        }); a.setParam("click", h(b.type) || "", { hitType: ["click"] })
      }; a.click.onDispatch = function (b, g) {
        var l = ["click"], f = a.getContext("click") || {}, e = a.getContext("page") || {}; a.setParam("pclick", c(e), { hitType: l }); a.setParam("s2click", e.level2 || "", { hitType: l }); a.setParam("p", f.name, { hitType: l }); "undefined" !== typeof f.level2 && a.setParam("s2", f.level2, { hitType: l }); (f = f.customObject) ? a.processContextObjectAndSendHit("stc", {
          hitType: l, encode: !0, separator: ",", truncate: !0,
          requestMethod: k.requestMethod, elementType: g
        }, f, b) : a.manageSend(function () { a.sendHit(null, [["hitType", l]], b, k.requestMethod, g) }); a.delContext("click")
      }
    }; ATInternet.Tracker.addPlugin("Clicks");
  }).call(window); (function () {
    var dfltPluginCfg = { "domainAttribution": true }; var dfltGlobalCfg = { "redirectionLifetime": 30 }; ATInternet.Tracker.Plugins.ContextVariables = function (a) {
      var k = "", h = null, c, b = "", d = "", g = {}; a.configPlugin("ContextVariables", dfltPluginCfg || {}, function (a) { g = a }); a.setConfig("redirectionLifetime", dfltGlobalCfg.redirectionLifetime, !0); var l = function (b, e) { var d = null; a.plugins.exec("Storage", b, e, function (a) { d = a }); return d }, f = function () { a.setParam("vtag", a.version, { permanent: !0, hitType: ["all"] }) }, e = function () { a.setParam("ptag", "js", { permanent: !0, hitType: ["all"] }) }, q = function () {
        var b = ""; try {
          b += window.screen.width +
            "x" + window.screen.height + "x" + window.screen.pixelDepth + "x" + window.screen.colorDepth
        } catch (e) { } a.setParam("r", b, { permanent: !0, hitType: ["all"] })
      }, n = function () { var b = ""; window.innerWidth ? b += window.innerWidth + "x" + window.innerHeight : document.body && document.body.offsetWidth && (b += document.body.offsetWidth + "x" + document.body.offsetHeight); a.setParam("re", b, { permanent: !0, hitType: ["all"] }) }, p = function () {
        window.navigator && a.setParam("lng", window.navigator.language || window.navigator.userLanguage, {
          permanent: !0,
          hitType: ["all"]
        })
      }, m = function () { var b = ATInternet.Utils.uuid().num(13); a.setParam("idp", b, { permanent: !0, hitType: ["page", "clickzone"] }) }, r = function () { window.navigator && a.setParam("jv", window.navigator.javaEnabled() ? "1" : "0", { hitType: ["page"] }) }, t = function () { a.setParam("hl", function () { var a = new Date; return a.getHours() + "x" + a.getMinutes() + "x" + a.getSeconds() }, { permanent: !0, hitType: ["all"] }) }, s = function (a) {
        (a = c ? c : "acc_dir" === k ? "" : null !== k ? k : "acc_dir" === h ? "" : h ? h : a ? a.referrer : "") && (a = a.replace(/[<>]/g, "").substring(0,
          1600).replace(/&/g, "$")); return a
      }, u = function () { var b = a.utils.getDocumentLevel(); a.setParam("ref", s(b), { permanent: !0, last: !0, hitType: ["page", "ecommerce", "avinsights", "events"] }) }, v = function () {
        b = "set" + (g.domainAttribution ? "" : "Private"); d = "get" + (g.domainAttribution ? "" : "Private"); var s = a.utils.getLocation(); k = a.utils.getQueryStringValue("xtref", s); void 0 === k && (k = ""); c = a.getContext("forcedReferer"); if (a.getConfig("redirect")) {
          var s = a.utils.getDocumentLevel(), s = c ? c : null !== k ? k : s ? s.referrer : "acc_dir", v;
          if (v = s) { v = { path: "/", end: a.getConfig("redirectionLifetime") }; var C = l(d, ["atredir"]); null !== C ? v = "object" === typeof C && !(C instanceof Array) : (l(b, ["atredir", {}, v]), v = !0) } v && l(b, [["atredir", "ref"], s])
        } else h = l(d, [["atredir", "ref"]]), l("del", [["atredir", "ref"]]), f(), e(), q(), n(), t(), p(), m(), r(), u(); a.emit("ContextVariables:Ready", { lvl: "INFO" })
      }; a.contextVariables = {}; a.contextVariables.params = {}; a.contextVariables.params.vtag = f; a.contextVariables.params.ptag = e; a.contextVariables.params.r = q; a.contextVariables.params.re =
        n; a.contextVariables.params.lng = p; a.contextVariables.params.idp = m; a.contextVariables.params.jv = r; a.contextVariables.params.hl = t; a.contextVariables.params.ref = u; a.contextVariables.setAll = v; a.plugins.waitForDependencies(["Storage", "Utils"], v)
    }; ATInternet.Tracker.addPlugin("ContextVariables");
  }).call(window); (function () {
    var dfltPluginCfg = {}; var dfltGlobalCfg = {}; ATInternet.Tracker.Plugins.Page = function (a) {
      var k = ["pageId", "chapterLabel", "update"], h = ["pid", "pchap", "pidt"], c = ["page", "site"], b = ["f", "x"], d = function (b) { return a.utils.manageChapters(b, "chapter", 3) + (b.name ? b.name : "") }, g = function (a, b, e) { b ? a = b : a || "undefined" === typeof e || (a = e); return a }, l = function (a, b, e) { b.hasOwnProperty(e) && (a[e] = g(a[e], b[e], void 0)) }, f = function (e, d, f) {
        if (d) for (var g = 0; g < c.length; g++)if (d.hasOwnProperty(c[g]) && d[c[g]]) for (var h in d[c[g]]) d[c[g]].hasOwnProperty(h) && (f ? e[b[g] + h] = d[c[g]][h] :
          a.setParam(b[g] + h, d[c[g]][h]))
      }, e = function (b, e, d) { if (e) { var c = a.utils.manageChapters(e, "chapter", 3); c && (e.chapterLabel = c.replace(/::$/gi, "")); for (c = 0; c < h.length; c++)e.hasOwnProperty(k[c]) && (d ? b[h[c]] = e[k[c]] : a.setParam(h[c], e[k[c]])) } }, q = function (b, e, d) { if (e && e.keywords instanceof Array) { var c = e.keywords.length; if (0 < c) { for (var f = "", g = 0; g < c; g++)f += "[" + e.keywords[g] + "]" + (g < c - 1 ? "|" : ""); d ? b.tag = f : a.setParam("tag", f) } } }, n = function (b, e, d) {
        if (e) {
          var c, f = function (a) { return a ? a : "0" }; c = "" + (f(e.category1) + "-");
          c += f(e.category2) + "-"; c += f(e.category3); d ? b.ptype = c : a.setParam("ptype", c)
        }
      }, p = function (b, e, d) { if (e) for (var c in e) e.hasOwnProperty(c) && "undefined" !== typeof e[c] && (d ? b[c] = e[c] : a.setParam(c, e[c])) }; a.customVars = {}; a.customVars.set = function (b) { var e = a.getContext("page") || {}, d = e.customVars; if (d) { if (b) for (var c in b) b.hasOwnProperty(c) && (d[c] = ATInternet.Utils.completeFstLevelObj(d[c], b[c], !0)) } else d = b; e.customVars = d; a.setContext("page", e) }; a.dynamicLabel = {}; a.dynamicLabel.set = function (b) {
        var e = a.getContext("page") ||
          {}; e.dynamicLabel = ATInternet.Utils.completeFstLevelObj(e.dynamicLabel, b, !0); a.setContext("page", e)
      }; a.tags = {}; a.tags.set = function (b) { var e = a.getContext("page") || {}; e.tags = ATInternet.Utils.completeFstLevelObj(e.tags, b, !0); a.setContext("page", e) }; a.customTreeStructure = {}; a.customTreeStructure.set = function (b) { var e = a.getContext("page") || {}; e.customTreeStructure = ATInternet.Utils.completeFstLevelObj(e.customTreeStructure, b, !0); a.setContext("page", e) }; a.page = {}; a.page.reset = function () { a.delContext("page") };
      a.page.set = function (b) { b = b || {}; a.dispatchSubscribe("page"); var e = a.getContext("page") || {}; e.name = g(e.name, b.name, ""); "undefined" !== typeof b.level2 && (e.level2 = b.level2); l(e, b, "chapter1"); l(e, b, "chapter2"); l(e, b, "chapter3"); e.customObject = ATInternet.Utils.completeFstLevelObj(e.customObject, b.customObject, !0); a.setContext("page", e) }; a.page.send = function (b) {
        b = b || {}; var c = !0, h = "", k = { p: d(b) }; "undefined" !== typeof b.level2 && (k.s2 = b.level2); var u = b.customObject; if (u) {
          var v = ["page"], u = a.processTagObject("stc",
            v, u); k.stc = { _value: ATInternet.Utils.jsonSerialize(u), _options: { hitType: v, encode: !0, separator: ",", truncate: !0 } }
        } u = a.getContext("page") || {}; u.vrn && (k.vrn = u.vrn, a.delContext("page", "vrn")); v = a.getContext("InternalSearch") || {}; "undefined" !== typeof v.keyword && (k.mc = ATInternet.Utils.cloneSimpleObject(v.keyword), "undefined" !== typeof v.resultPageNumber && (k.np = ATInternet.Utils.cloneSimpleObject(v.resultPageNumber)), a.delContext("InternalSearch")); ATInternet.Utils.isPreview() && a.getConfig("preview") && (k.pvw =
          1); f(k, b.customVars, !0); e(k, b.dynamicLabel, !0); q(k, b.tags, !0); n(k, b.customTreeStructure, !0); v = a.getContext("campaigns") || {}; p(k, v, !0); a.delContext("campaigns"); !ATInternet.Utils.isTabOpeningAction(b.event) && b.elem && (v = a.techClicks.manageClick(b.elem), c = v.preservePropagation, h = v.elementType); a.manageSend(function () { a.sendHit(k, null, b.callback, null, h) }); u.name = g(u.name, b.name, ""); "undefined" !== typeof b.level2 && (u.level2 = b.level2); l(u, b, "chapter1"); l(u, b, "chapter2"); l(u, b, "chapter3"); a.setContext("page",
            u); return c
      }; a.page.onDispatch = function (b, c) {
        var g = a.getContext("page") || {}, h = a.getContext("InternalSearch") || {}; a.setParam("p", d(g)); "undefined" !== typeof g.level2 && a.setParam("s2", g.level2); g.vrn && (a.setParam("vrn", g.vrn), a.delContext("page", "vrn")); "undefined" !== typeof h.keyword && (a.setParam("mc", ATInternet.Utils.cloneSimpleObject(h.keyword)), "undefined" !== typeof h.resultPageNumber && a.setParam("np", ATInternet.Utils.cloneSimpleObject(h.resultPageNumber)), a.delContext("InternalSearch")); ATInternet.Utils.isPreview() &&
          a.getConfig("preview") && a.setParam("pvw", 1); f(null, g.customVars, !1); e(null, g.dynamicLabel, !1); q(null, g.tags, !1); n(null, g.customTreeStructure, !1); h = a.getContext("campaigns") || {}; p(null, h, !1); a.delContext("campaigns"); var k = ["page"]; (g = g.customObject) ? a.processContextObjectAndSendHit("stc", { hitType: k, encode: !0, separator: ",", truncate: !0, elementType: c }, g, b) : a.manageSend(function () { a.sendHit(null, [["hitType", k]], b, null, c) })
      }
    }; ATInternet.Tracker.addPlugin("Page");
  }).call(window); (function () {
    var dfltPluginCfg = { "clientSideMode": "always", "userIdCookieDuration": 397, "userIdExpirationMode": "fixed", "optOut": "OPT-OUT", "userIdStorageName": "atuserid", "userIdHitName": "idclient", "itpCompliant": false, "baseDomain": "" }; var dfltGlobalCfg = {}; ATInternet.Tracker.Plugins.ClientSideUserId = function (a) {
      var k = {}, h = !1, c = !1, b = null, d = -1; a.configPlugin("ClientSideUserId", dfltPluginCfg || {}, function (a) { k = a }); var g = function () { var b = k.baseDomain; if (!b) { var e = a.getConfig("cookieDomain"); e && (b = e, "." === b.charAt(0) && (b = b.substring(1, b.length))) } var e = a.builder.getCollectDomain(), d = a.utils.getHostName(); return !!(b && e && d && -1 !== e.indexOf(b) && -1 !== d.indexOf(b)) }, l = function () {
        b = {
          contextUserId: void 0, storageUserId: null, finalUserId: null, isFromTrackerContext: !1,
          forceStorage: !1, optout: { isOptedout: !1, fromStorage: !1 }
        }
      }, f = function () {
        if ("relative" === k.userIdExpirationMode || "fixed" === k.userIdExpirationMode && null === b.storageUserId || b.isFromTrackerContext) {
          var e = new Date; e.setTime(e.getTime() + 864E5 * k.userIdCookieDuration); a.storage.set(k.userIdStorageName, b.finalUserId, { end: e, path: "/" }, b.forceStorage); ATInternet.Utils.consent && !b.isFromTrackerContext && b.finalUserId !== a.storage.get(k.userIdStorageName, !0) && a.setParam(k.userIdHitName, b.finalUserId + "-NO", {
            multihit: !0,
            permanent: !0, hitType: ["all"]
          })
        }
      }, e = function () { a.setParam(k.userIdHitName, b.finalUserId, { multihit: !0, permanent: !0, hitType: ["all"] }); f() }, q = function () {
        l(); var d = !1; null === ATInternet.Utils.optedOut ? a.storage.get(k.userIdStorageName, !0) === k.optOut ? d = ATInternet.Utils.optedOut = !0 : ATInternet.Utils.optedOut = !1 : !1 === ATInternet.Utils.optedOut && (a.getParam(k.userIdHitName) === k.optOut && a.delParam(k.userIdHitName), a.storage.get(k.userIdStorageName, !0) === k.optOut && a.storage.del(k.userIdStorageName)); b.optout.isOptedout =
          ATInternet.Utils.optedOut; b.optout.fromStorage = d; b.contextUserId = a.getContext("userIdentifier"); b.storageUserId = a.storage.get("atuserid", !0); d = !1; if ("required" === k.clientSideMode) { var f = ""; window.navigator && (f = window.navigator.userAgent); if (/Safari/.test(f) && !/Chrome/.test(f) || /iPhone|iPod|iPad/.test(f)) d = !0 } else "always" === k.clientSideMode && (d = !0); c = d; d = !1; if (!a.getConfig("forceHttp") && k.itpCompliant && "undefined" === typeof b.contextUserId && !b.optout.isOptedout) switch (k.clientSideMode) {
            case "never": d =
              g(); break; case "always": case "required": c && null !== b.storageUserId || (d = g())
          }(h = d) || !c && !b.optout.isOptedout && "undefined" === typeof b.contextUserId ? a.setConfig("userIdOrigin", "server") : (a.setConfig("userIdOrigin", "client"), b.isFromTrackerContext = !1, b.forceStorage = !1, b.optout.isOptedout ? (b.finalUserId = k.optOut, b.isFromTrackerContext = !b.optout.fromStorage, b.forceStorage = !0) : a.getConfig("disableCookie") || a.getConfig("disableStorage") ? (b.finalUserId = a.getParam(k.userIdHitName), b.isFromTrackerContext = !0) :
            "undefined" !== typeof b.contextUserId ? (b.finalUserId = b.contextUserId, b.isFromTrackerContext = !0) : b.finalUserId = null !== b.storageUserId ? b.storageUserId : ATInternet.Utils.uuid().v4(), e())
      }, n = function (a) { a && (a = a.detail) && "clientsideuserid" === a.name && a.id === d && q() }; (function () { a.plugins.waitForDependencies(["Storage", "Utils"], function () { var a = ATInternet.Utils.uuid(); d = parseInt(a.num(8)); ATInternet.Utils.removeOptOutEvent(n); ATInternet.Utils.addOptOutEvent(d, n); q() }) })(); a.clientSideUserId = {}; a.clientSideUserId.set =
        function (a) { b.optout.isOptedout || (b.finalUserId = a, b.isFromTrackerContext = !0, b.forceStorage = !1, e()) }; a.clientSideUserId.store = function () { b.finalUserId = a.getParam(k.userIdHitName) || b.finalUserId; null !== b.finalUserId && b.finalUserId !== ATInternet.Utils.privacy.CONSENTNO && b.finalUserId !== b.storageUserId && (b.isFromTrackerContext = !0, b.forceStorage = !0, f()) }; a.clientSideUserId.get = function () { b.finalUserId = a.getParam(k.userIdHitName) || b.finalUserId; return b.finalUserId }; a.clientSideUserId.clear = function () {
          l();
          a.delParam(k.userIdHitName); a.storage.del(k.userIdStorageName)
        }
    }; ATInternet.Tracker.addPlugin("ClientSideUserId");
  }).call(window); (function () {
    var dfltPluginCfg = { "authorityStorageName": "atauthority", "authorities": { "default": { "name": "default", "optin": { "name": "optin", "storageDuration": 397, "trackerSettings": { "disableStorage": false, "disableCookie": false }, "add": { "buffer": { "visitorConsent": { "param": "vc", "value": true }, "visitorMode": { "param": "vm", "value": "optin" } } }, "include": { "storage": "*", "buffer": "*" } }, "optout": { "name": "optout", "storageDuration": 397, "trackerSettings": { "disableStorage": false, "disableCookie": false }, "add": { "buffer": { "visitorConsent": { "param": "vc", "value": false }, "visitorMode": { "param": "vm", "value": "optout" } } }, "include": { "storage": ["atuserid", "atauthority"], "buffer": ["s", "idclient", "ts", "vc", "vm", "click", "type", "olt", "cn", "mh"] } }, "no-consent": { "name": "no-consent", "storageDuration": 0, "trackerSettings": { "disableStorage": true, "disableCookie": true }, "add": { "buffer": { "visitorConsent": { "param": "vc", "value": false }, "visitorMode": { "param": "vm", "value": "no-consent" }, "idclient": { "param": "idclient", "value": "Consent-NO" } } }, "include": { "storage": [], "buffer": ["s", "idclient", "ts", "vc", "vm", "click", "type", "olt", "cn", "mh"] } }, "random": { "name": "random", "storageDuration": 0, "trackerSettings": { "disableStorage": false, "disableCookie": false }, "add": { "buffer": { "visitorConsent": { "param": "vc", "value": false }, "visitorMode": { "param": "vm", "value": "before-consent" } } }, "include": { "storage": [], "buffer": ["s", "idclient", "p", "vtag", "ptag", "ts", "vc", "vm", "ref", "xto", "click", "type", "olt", "cn", "mh"] } } }, "cnil": { "name": "cnil", "exempt": { "name": "exempt", "storageDuration": 397, "trackerSettings": { "disableStorage": false, "disableCookie": false }, "add": { "buffer": { "visitorConsent": { "param": "vc", "value": false }, "visitorMode": { "param": "vm", "value": "exempt" } } }, "include": { "storage": ["atuserid", "atauthority"], "buffer": ["s", "idclient", "p", "vtag", "ptag", "ts", "vc", "vm", "click", "type", "olt", "cn", "mh", "ref", "pclick", "s2click"] } } } }, "parametersToInclude": ["click", "events_data_page", "events_data_page_chapter1", "events_data_page_chapter2", "events_data_page_chapter3", "ref", "page_url", "env_language", "n:simulateur_embarque", "events_name", "events_data_site_level2", "events_data_click", "events_data_click_chapter1", "events_data_click_chapter2", "events_data_click_chapter3", "goal_type", "evenement_type"] }; var dfltGlobalCfg = {}; ATInternet.Tracker.Plugins.Privacy = function (a) {
      var k = function (c) {
        function b() { if (p && m) { var b = new Date; b.setTime(b.getTime() + 864E5 * m.storageDuration); a.storage.set(t.authorityStorageName, { authority_name: p.name, visitor_mode: m.name }, { end: b, path: "/" }) } } function d(e) { m && (0 < m.storageDuration ? e ? b() : (e = a.storage.get(t.authorityStorageName, !0), null === e ? b() : "object" === typeof e && (e.authority_name === p.name && e.visitor_mode === m.name || b())) : a.storage.del(t.authorityStorageName)) } function g() {
          ATInternet.Utils.privacy.processStorageParams(function (b) { a.storage.del(b) },
            function (b) { return a.storage.get(b, !0) || a.storage.getPrivate(b, !0) }, function () { return a.storage.getAll() }, n.getVisitorMode().name)
        } function h() { ATInternet.Utils.privacy.processBufferParams(function (b) { a.delParam(b) }, function () { return a.getParams([]) }, function (b, e, d) { a.setParam(b, e, d) }, n.getVisitorMode().name) } function f(a, b, e) {
          if (m && m.include) {
            m.include[b] instanceof Array ? a instanceof Array ? m.include[b] = m.include[b].concat(a) : a && m.include[b].push(a) : m.include[b] !== ATInternet.Utils.privacy.ALL && (a instanceof
              Array ? m.include[b] = a : a && (m.include[b] = [a])); a = r; var d = b + "Params", c = m.include[b]; b = []; for (var f = {}, g = 0; g < c.length; g++)if ("object" === typeof c[g]) for (var h in c[g]) c[g].hasOwnProperty(h) && (f[h] = (f[h] || []).concat(c[g][h])); else b.push(c[g]); for (var k in f) f.hasOwnProperty(k) && (h = {}, h[k] = f[k], b.push(h)); a[d] = b; ATInternet.Utils.privacy.setParameters(r); e && e()
          }
        } function e(b, e, c, f) {
          if (t.authorities && t.authorities[b] && t.authorities[b][e]) {
            c && a.clientSideUserId.clear(); f && n.setVisitorOptin(); p = t.authorities[b];
            m = p[e]; ATInternet.Utils.privacy.setMode(e); if (m) for (var w in m.trackerSettings) m.trackerSettings.hasOwnProperty(w) && a.setConfig(w, m.trackerSettings[w]); if (m && m.add) for (var C in m.add.buffer) m.add.buffer.hasOwnProperty(C) && a.setParam(m.add.buffer[C].param, m.add.buffer[C].value, { multihit: !0, permanent: !0, hitType: ["all"] }); if (m && m.include) {
              for (var E in m.include) m.include.hasOwnProperty(E) && (b = m.include[E] instanceof Array ? m.include[E] : [m.include[E]], r[E + "Params"] = b); ATInternet.Utils.privacy.setParameters(r);
              d(!1)
            } 0 < t.parametersToInclude.length && (n.extendIncludeStorage(t.parametersToInclude), n.extendIncludeBuffer(t.parametersToInclude)); g(); h(); k()
          }
        } function k() { for (var b = r.bufferParams, e = b.length, d = 0; d < e; d++) { var c = b[d]; if (c === ATInternet.Utils.privacy.ALL) { a.contextVariables.setAll(); break } (c = a.contextVariables.params[c]) && c() } } var n = this, p = null, m = null, r = { storageParams: [], bufferParams: [] }, t = c; n.setVisitorOptout = function () { ATInternet.Utils.consentReceived(!0); e("default", "optout", !1, !1); ATInternet.Utils.userOptedOut() };
        n.setVisitorOptin = function () { ATInternet.Utils.consentReceived(!0); a.clientSideUserId.store(); e("default", "optin", !1, !1); ATInternet.Utils.userOptedIn() }; n.setVisitorRandomID = function () { ATInternet.Utils.consentReceived(!1); e("default", "random", !1, !1); ATInternet.Utils.userOptedIn() }; n.setVisitorMode = function (a, b, d) { var c = !0; "cnil" === a && "exempt" === b ? c = !1 : "boolean" === typeof d && (c = d); c && p && m && (c = a !== p.name || b !== m.name); e(a, b, c, !0) }; n.getAuthority = function () { return p }; n.getVisitorMode = function () { return m };
        n.addAuthority = function (a) { a && "object" === typeof a && (t.authorities = t.authorities || {}, t.authorities[a.name] = a) }; n.extendIncludeStorage = function (a) { f(a, "storage", g) }; n.extendIncludeBuffer = function (a) { f(a, "buffer", h); k() }; n.updateStorageDuration = function (a) { m && (m.storageDuration = a, d(!0)) }; (function () {
          var b = a.storage.get([t.authorityStorageName, "authority_name"], !0), e = a.storage.get([t.authorityStorageName, "visitor_mode"], !0); b && e && ("default" === b ? "optin" === e ? n.setVisitorOptin() : "optout" === e ? n.setVisitorOptout() :
            "random" === e ? n.setVisitorRandomID() : n.setVisitorMode(b, e) : n.setVisitorMode(b, e))
        })()
      }, h = null; a.privacy = { setVisitorOptout: function () { }, setVisitorOptin: function () { }, setVisitorRandomID: function () { }, setVisitorMode: function () { }, getAuthority: function () { }, getVisitorMode: function () { }, addAuthority: function () { }, extendIncludeStorage: function () { }, extendIncludeBuffer: function () { }, updateStorageDuration: function () { } }; (function () {
        a.plugins.waitForDependencies(["Storage", "Utils", "ClientSideUserId", "ContextVariables"],
          function () {
            var c = null; a.configPlugin("Privacy", dfltPluginCfg || {}, function (a) { c = ATInternet.Utils.cloneSimpleObject(a) }); null !== c && (h = new k(c), a.privacy.setVisitorOptout = h.setVisitorOptout, a.privacy.setVisitorOptin = h.setVisitorOptin, a.privacy.setVisitorRandomID = h.setVisitorRandomID, a.privacy.setVisitorMode = h.setVisitorMode, a.privacy.getAuthority = h.getAuthority, a.privacy.getVisitorMode = h.getVisitorMode, a.privacy.addAuthority = h.addAuthority, a.privacy.extendIncludeStorage = h.extendIncludeStorage, a.privacy.extendIncludeBuffer =
              h.extendIncludeBuffer, a.privacy.updateStorageDuration = h.updateStorageDuration)
          })
      })()
    }; ATInternet.Tracker.addPlugin("Privacy");
  }).call(window); (function () {
    var dfltPluginCfg = {}; var dfltGlobalCfg = {}; ATInternet.Tracker.Plugins.Events = function (a) {
      var k = function (a) { var c = {}; a = ATInternet.Utils.cloneSimpleObject(a); ATInternet.Utils.object2Flatten(a, null, c, null, !0); a = {}; for (var b in c) c.hasOwnProperty(b) && ATInternet.Utils.flatten2Object(a, b, c[b]); return ATInternet.Utils.getFormattedObject(a) }; a.events = {}; a.events.send = function (h, c, b) { b = b || {}; b.origin = "events"; var d = c; ATInternet.Utils.isObject(c) && (d = k(c)); a.event.send(h, d, b) }; a.events.add = function (h, c) {
        var b = c; ATInternet.Utils.isObject(c) && (b = k(c));
        for (var d = a.getContext("events") || [], g = !1, l = 0; l < d.length; l++)if (typeof d[l].hasOwnProperty(h)) { g = !0; break } g ? a.event.add(h, b, "events") : a.event.set(h, b, null, "events")
      }; a.events.onDispatch = function (h, c) { a.event.onDispatch(h, c, "events") }
    }; ATInternet.Tracker.addPlugin("Events");
  }).call(window); (function () {
    var dfltPluginCfg = { "hitParameter": "col", "hitValue": "2" }; var dfltGlobalCfg = {}; ATInternet.Tracker.Plugins.EventRoot = function (a) {
      var k = {}, h = function (a) { for (var b = [], e, d = 0; d < a.length; d++)for (var c in a[d]) a[d].hasOwnProperty(c) && (e = ATInternet.Utils.isObject(a[d][c]) ? ATInternet.Utils.objectToLowercase(a[d][c]) : a[d][c], b.push({ name: c.toLowerCase(), data: e })); return ATInternet.Utils.jsonSerialize(b) }, c = function (b, d) { var e = d || "event"; a.setParam("events", h(b), { hitType: [e], encode: !0, truncate: !0, separator: "," }) }, b = function (b, d, e) {
        var c = "", g = {}, h = {}; if ("undefined" !== typeof b) {
          g = {}; b.name &&
            (g.$ = b.name); for (var h = a.getConfig("ignoreEmptyChapterValue"), m = "", k = "", t = 1; 3 >= t; t++)if (k = "chapter" + t, m = b[k] || "", h && m || !h && b.hasOwnProperty(k)) g[k] = m; b.url && (g.url = b.url); h = {}; "string" === typeof b.level2 ? (b = ATInternet.Utils.trim(b.level2), 0 < b.length && (isNaN(b) ? h.level2 = b : h.level2_id = Number(b))) : "number" === typeof b.level2 && (h.level2_id = b.level2)
        } b = {}; ATInternet.Utils.isEmptyObject(g) || (b.page = g); ATInternet.Utils.isEmptyObject(h) || (b.site = h); "undefined" !== typeof d && (b.src = d); "undefined" !== typeof e &&
          (b.utm = e); ATInternet.Utils.isEmptyObject(b) || (c = ATInternet.Utils.jsonSerialize([{ data: b }])); return c
      }, d = function (d, f, e, c) { c = c || "event"; d = b(d, f, e); "" !== d && a.setParam("context", d, { truncate: !0, hitType: [c], encode: !0 }) }, g = function (a, b) { return a instanceof Array && b instanceof Array ? a.concat(b) : ATInternet.Utils.isObject(a) && ATInternet.Utils.isObject(b) ? ATInternet.Utils.completeFstLevelObj(a, b, !0) : b }; a.event = {}; a.event.reset = function (b) { b = b || "event"; a.getContext(b); a.delContext(b) }; a.event.send = function (d,
        c, e) {
        var g = !0, n = "", p = "event"; e && e.origin && (p = e.origin); var m = {}; m[d] = c; var r = {}; r[k.hitParameter] = { _value: k.hitValue, _options: { multihit: !0 } }; d = a.getContext("page"); c = a.getContext("campaigns_events"); var t = a.getContext("campaigns_utm_events"); if ("undefined" !== typeof d || "undefined" !== typeof c || "undefined" !== typeof t) r.context = { _value: b(d, c, t), _options: { truncate: !0, encode: !0 } }; r.events = { _value: h([m]), _options: { encode: !0, truncate: !0, separator: "," } }; ATInternet.Utils.isPreview() && a.getConfig("preview") &&
          (r.pvw = 1); e && !ATInternet.Utils.isTabOpeningAction(e.event) && e.elem && (m = a.techClicks.manageClick(e.elem), g = m.preservePropagation, n = m.elementType); a.manageSend(function () { var b; e && (b = e.callback); a.sendHit(r, [["hitType", [p]]], b, null, n) }); return g
      }; a.event.set = function (b, d, e, c) {
        c = c || "event"; a.setParam(k.hitParameter, k.hitValue, { multihit: !0, hitType: [c] }); a.dispatchSubscribe(c); for (var h = a.getContext(c) || [], p = !1, m = 0; m < h.length; m++)h[m][b] && (p = !0, e ? ATInternet.Utils.isObject(h[m][b]) && (h[m][b][e] = g(h[m][b][e],
          d)) : h[m][b] = g(h[m][b], d)); p || (p = {}, e ? (p[b] = {}, p[b][e] = d) : p[b] = d, h.push(p)); a.setContext(c, h)
      }; a.event.add = function (b, d, e) { e = e || "event"; var c = a.getContext(e) || [], g = {}; g[b] = d; c.push(g); a.setContext(e, c) }; a.event.onDispatch = function (b, f, e) {
        var g = e || "event"; e = a.getContext("page"); var h = a.getContext("campaigns_events"), k = a.getContext("campaigns_utm_events"); "undefined" === typeof e && "undefined" === typeof h && "undefined" === typeof k || d(e, h, k, g); e = a.getContext(g); "undefined" !== typeof e && c(e, g); a.delContext(g);
        ATInternet.Utils.isPreview() && a.getConfig("preview") && a.setParam("pvw", 1, { hitType: [g] }); a.manageSend(function () { a.sendHit(null, [["hitType", [g]]], b, null, f) })
      }; (function () { a.plugins.waitForDependencies(["Utils"], function () { a.configPlugin("EventRoot", dfltPluginCfg || {}, function (a) { k = a }) }) })()
    }; ATInternet.Tracker.addPlugin("EventRoot");
  }).call(window);
  if (typeof window.ATInternet.onTrackerLoad === 'function') { window.ATInternet.onTrackerLoad(); }
}
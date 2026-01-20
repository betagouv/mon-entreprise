if (!import.meta.env.SSR) {
	var pianoAnalytics = ((j) => {
		var H = {
			site: "",
			collectDomain: "",
			path: "event",
			visitorStorageMode: "fixed",
			storageLifetimeVisitor: 395,
			storageLifetimeUser: 395,
			storageLifetimePrivacy: 395,
			privacyDefaultMode: "optin",
			sendEventWhenOptout: !0,
			isVisitorClientSide: !0,
			enableCallbacks: !0,
			cookieDomain: "",
			cookieSecure: !0,
			cookiePath: "/",
			cookieSameSite: "lax",
			encodeStorageBase64: !1,
			addEventURL: "withoutQS",
			clickAutoManagement: !0,
			enableUTMTracking: !0,
			campaignPrefix: ["at_"],
			storageVisitor: "pa_vid",
			storageUser: "pa_user",
			version: "6.17.0",
			minHeartbeat: 5,
			minBufferingHeartbeat: 1,
			queueVarName: "_paq",
			globalVarName: "pa",
			enableAutomaticPageRefresh: !0,
			allowHighEntropyClientHints: !0,
			sendEmptyProperties: !0,
			enableExtendedOptout: !1,
			instantTracking: !1,
			useSendBeacon: !0,
			privacy: {
				storageKey: "pa_privacy",
				legacyKeys: { pa_vid: !0, pa_privacy: !0, atuserid: !0 },
				storageKeys: { pa_user: !0 },
				modes: {
					optin: {
						name: "optin",
						properties: {
							include: {
								visitor_privacy_consent: !0,
								visitor_privacy_mode: "optin",
							},
							allowed: { "*": { "*": !0 } },
							forbidden: { "*": {} },
						},
						storage: { allowed: { "*": !0 }, forbidden: {} },
						events: { allowed: { "*": !0 }, forbidden: {} },
					},
					optout: {
						name: "optout",
						visitorId: "OPT-OUT",
						properties: {
							include: {
								visitor_privacy_consent: !1,
								visitor_privacy_mode: "optout",
							},
							allowed: { "*": {} },
							forbidden: { "*": {} },
						},
						storage: { allowed: { pa_vid: !0, pa_privacy: !0 }, forbidden: {} },
						events: { allowed: { "*": !0 }, forbidden: {} },
					},
					"no-consent": {
						name: "no-consent",
						visitorId: "no-consent",
						properties: {
							include: {
								visitor_privacy_consent: !1,
								visitor_privacy_mode: "no-consent",
							},
							allowed: { "*": {} },
							forbidden: { "*": {} },
						},
						storage: { allowed: {}, forbidden: { "*": !0 } },
						events: { allowed: { "*": !0 }, forbidden: {} },
					},
					"no-storage": {
						name: "no-storage",
						visitorId: "no-storage",
						properties: {
							include: {
								visitor_privacy_consent: !1,
								visitor_privacy_mode: "no-storage",
							},
							allowed: { "*": { "*": !0 } },
							forbidden: { "*": {} },
						},
						storage: { allowed: {}, forbidden: { "*": !0 } },
						events: { allowed: { "*": !0 }, forbidden: {} },
					},
					exempt: {
						name: "exempt",
						properties: {
							include: {
								visitor_privacy_consent: !1,
								visitor_privacy_mode: "exempt",
							},
							allowed: {
								"*": {
									app_crash: !0,
									app_crash_class: !0,
									app_crash_screen: !0,
									app_version: !0,
									browser: !0,
									browser_cookie_acceptance: !0,
									browser_group: !0,
									browser_version: !0,
									click: !0,
									click_chapter1: !0,
									click_chapter2: !0,
									click_chapter3: !0,
									click_full_name: !0,
									connection_monitor: !0,
									connection_organisation: !0,
									cookie_creation_date: !0,
									date: !0,
									date_day: !0,
									date_daynumber: !0,
									date_month: !0,
									date_monthnumber: !0,
									date_week: !0,
									date_year: !0,
									date_yearofweek: !0,
									device_brand: !0,
									device_display_height: !0,
									device_display_width: !0,
									device_name: !0,
									device_name_tech: !0,
									device_screen_diagonal: !0,
									device_screen_height: !0,
									device_screen_width: !0,
									device_type: !0,
									event_collection_platform: !0,
									event_collection_version: !0,
									event_hour: !0,
									event_id: !0,
									event_minute: !0,
									event_position: !0,
									event_second: !0,
									event_time: !0,
									event_time_utc: !0,
									event_url: !0,
									event_url_domain: !0,
									event_url_full: !0,
									exclusion_cause: !0,
									exclusion_type: !0,
									geo_city: !0,
									geo_continent: !0,
									geo_country: !0,
									geo_metro: !0,
									geo_region: !0,
									goal_type: !0,
									hit_time_utc: !0,
									os: !0,
									os_group: !0,
									os_version: !0,
									os_version_name: !0,
									page: !0,
									page_chapter1: !0,
									page_chapter2: !0,
									page_chapter3: !0,
									page_duration: !0,
									page_full_name: !0,
									page_position: !0,
									page_title_html: !0,
									page_url: !0,
									pageview_id: !0,
									previous_url: !0,
									privacy_status: !0,
									site: !0,
									site_env: !0,
									site_id: !0,
									site_platform: !0,
									src: !0,
									src_detail: !0,
									src_direct_access: !0,
									src_organic: !0,
									src_organic_detail: !0,
									src_portal_domain: !0,
									src_portal_site: !0,
									src_portal_site_id: !0,
									src_portal_url: !0,
									src_referrer_site_domain: !0,
									src_referrer_site_url: !0,
									src_referrer_url: !0,
									src_se: !0,
									src_se_category: !0,
									src_se_country: !0,
									src_type: !0,
									src_url: !0,
									src_url_domain: !0,
									src_webmail: !0,
								},
							},
							forbidden: { "*": {} },
						},
						storage: {
							allowed: { pa_vid: !0, pa_privacy: !0, atuserid: !0 },
							forbidden: {},
						},
						events: {
							allowed: {
								"click.exit": !0,
								"click.navigation": !0,
								"click.download": !0,
								"click.action": !0,
								"page.display": !0,
							},
							forbidden: {},
						},
					},
					"*": {
						properties: {
							allowed: {
								"*": {
									connection_type: !0,
									device_timestamp_utc: !0,
									visitor_privacy_consent: !0,
									visitor_privacy_mode: !0,
									"ch_ua*": !0,
								},
							},
							forbidden: { "*": {} },
						},
						storage: { allowed: {}, forbidden: {} },
						events: { allowed: {}, forbidden: {} },
					},
				},
			},
		};
		function B(e, t) {
			(null == t || t > e.length) && (t = e.length);
			for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
			return r;
		}
		function R(e, t, n, r, o, i, a) {
			try {
				var u = e[i](a),
					s = u.value;
			} catch (e) {
				return n(e);
			}
			u.done ? t(s) : Promise.resolve(s).then(r, o);
		}
		function b(e, t) {
			var n,
				r,
				o,
				i,
				a =
					("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
			if (a)
				return (
					(o = !(r = !0)),
					{
						s: function () {
							a = a.call(e);
						},
						n: function () {
							var e = a.next();
							return ((r = e.done), e);
						},
						e: function (e) {
							((o = !0), (n = e));
						},
						f: function () {
							try {
								r || null == a.return || a.return();
							} finally {
								if (o) throw n;
							}
						},
					}
				);
			if (
				Array.isArray(e) ||
				(a = ((e, t) => {
					var n;
					if (e)
						return "string" == typeof e
							? B(e, t)
							: "Map" ===
										(n =
											"Object" === (n = {}.toString.call(e).slice(8, -1)) &&
											e.constructor
												? e.constructor.name
												: n) || "Set" === n
								? Array.from(e)
								: "Arguments" === n ||
										/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
									? B(e, t)
									: void 0;
				})(e)) ||
				t
			)
				return (
					a && (e = a),
					(i = 0),
					{
						s: (t = function () {}),
						n: function () {
							return i >= e.length ? { done: !0 } : { done: !1, value: e[i++] };
						},
						e: function (e) {
							throw e;
						},
						f: t,
					}
				);
			throw new TypeError(
				"Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
			);
		}
		function U(e, t, n) {
			return (
				(t = ((e) =>
					"symbol" ==
					typeof (e = ((e, t) => {
						if ("object" != typeof e || !e) return e;
						var n = e[Symbol.toPrimitive];
						if (void 0 === n) return ("string" === t ? String : Number)(e);
						if ("object" != typeof (n = n.call(e, t))) return n;
						throw new TypeError("@@toPrimitive must return a primitive value.");
					})(e, "string"))
						? e
						: e + "")(t)) in e
					? Object.defineProperty(e, t, {
							value: n,
							enumerable: !0,
							configurable: !0,
							writable: !0,
						})
					: (e[t] = n),
				e
			);
		}
		function V() {
			var v,
				e = "function" == typeof Symbol ? Symbol : {},
				t = e.iterator || "@@iterator",
				n = e.toStringTag || "@@toStringTag";
			function r(e, t, n, r) {
				var o,
					i,
					a,
					u,
					s,
					c,
					l,
					d,
					f,
					t = t && t.prototype instanceof h ? t : h,
					t = Object.create(t.prototype);
				return (
					y(
						t,
						"_invoke",
						((o = e),
						(i = n),
						(l = r || []),
						(d = !1),
						(f = {
							p: (c = 0),
							n: 0,
							v: v,
							a: p,
							f: p.bind(v, 4),
							d: function (e, t) {
								return ((a = e), (u = 0), (s = v), (f.n = t), g);
							},
						}),
						function (e, t, n) {
							if (1 < c) throw TypeError("Generator is already running");
							for (
								d && 1 === t && p(t, n), u = t, s = n;
								(m = u < 2 ? v : s) || !d;
							) {
								a ||
									(u
										? u < 3
											? (1 < u && (f.n = -1), p(u, s))
											: (f.n = s)
										: (f.v = s));
								try {
									if (((c = 2), a)) {
										if ((m = a[(e = u ? e : "next")])) {
											if (!(m = m.call(a, s)))
												throw TypeError("iterator result is not an object");
											if (!m.done) return m;
											((s = m.value), u < 2 && (u = 0));
										} else
											(1 === u && (m = a.return) && m.call(a),
												u < 2 &&
													((s = TypeError(
														"The iterator does not provide a '" + e + "' method",
													)),
													(u = 1)));
										a = v;
									} else if ((m = (d = f.n < 0) ? s : o.call(i, f)) !== g) break;
								} catch (e) {
									((a = v), (u = 1), (s = e));
								} finally {
									c = 1;
								}
							}
							return { value: m, done: d };
						}),
						!0,
					),
					t
				);
				function p(e, t) {
					for (u = e, s = t, m = 0; !d && c && !n && m < l.length; m++) {
						var n,
							r = l[m],
							o = f.p,
							i = r[2];
						3 < e
							? (n = i === t) &&
								((s = r[(u = r[4]) ? 5 : (u = 3)]), (r[4] = r[5] = v))
							: r[0] <= o &&
								((n = e < 2 && o < r[1])
									? ((u = 0), (f.v = t), (f.n = r[1]))
									: o < i &&
										(n = e < 3 || r[0] > t || i < t) &&
										((r[4] = e), (r[5] = t), (f.n = i), (u = 0)));
					}
					if (n || 1 < e) return g;
					throw ((d = !0), t);
				}
			}
			var g = {};
			function h() {}
			function o() {}
			function i() {}
			var m = Object.getPrototypeOf,
				e = [][t]
					? m(m([][t]()))
					: (y((m = {}), t, function () {
							return this;
						}),
						m),
				a = (i.prototype = h.prototype = Object.create(e));
			function u(e) {
				return (
					Object.setPrototypeOf
						? Object.setPrototypeOf(e, i)
						: ((e.__proto__ = i), y(e, n, "GeneratorFunction")),
					(e.prototype = Object.create(a)),
					e
				);
			}
			return (
				y(a, "constructor", (o.prototype = i)),
				y(i, "constructor", o),
				y(i, n, (o.displayName = "GeneratorFunction")),
				y(a),
				y(a, n, "Generator"),
				y(a, t, function () {
					return this;
				}),
				y(a, "toString", function () {
					return "[object Generator]";
				}),
				(V = function () {
					return { w: r, m: u };
				})()
			);
		}
		function y(e, t, n, r) {
			var i = Object.defineProperty;
			try {
				i({}, "", {});
			} catch (e) {
				i = 0;
			}
			(y = function (e, t, n, r) {
				function o(t, n) {
					y(e, t, function (e) {
						return this._invoke(t, n, e);
					});
				}
				t
					? i
						? i(e, t, {
								value: n,
								enumerable: !r,
								configurable: !r,
								writable: !r,
							})
						: (e[t] = n)
					: (o("next", 0), o("throw", 1), o("return", 2));
			})(e, t, n, r);
		}
		function c(e) {
			return (c =
				"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
					? function (e) {
							return typeof e;
						}
					: function (e) {
							return e &&
								"function" == typeof Symbol &&
								e.constructor === Symbol &&
								e !== Symbol.prototype
								? "symbol"
								: typeof e;
						})(e);
		}
		var D = function (e, t) {
			if ("object" !== c(e) || null === e || e instanceof Date) return e;
			var n,
				r = new e.constructor();
			for (n in e)
				Object.prototype.hasOwnProperty.call(e, n) &&
					void 0 !== n &&
					(r[n] = D(e[n]));
			return r;
		};
		function q() {
			var u;
			return (
				(u = V().m(function e(t, n, r) {
					var o;
					return V().w(
						function (e) {
							for (;;)
								switch ((e.p = e.n)) {
									case 0:
										if (
											((o = !1),
											!(o =
												window.navigator &&
												"function" == typeof window.navigator.sendBeacon &&
												t.getConfiguration("useSendBeacon")
													? window.navigator.sendBeacon(n, r)
													: o) && window.fetch)
										)
											return (
												(e.p = 1),
												(e.n = 2),
												window.fetch(n, {
													method: "POST",
													body: r,
													keepalive: !0,
													headers: { "Content-Type": "text/plain;charset=UTF-8" },
												})
											);
										e.n = 4;
										break;
									case 2:
										(e.v.ok || K(n, r), (e.n = 4));
										break;
									case 3:
										((e.p = 3), K(n, r));
									case 4:
										return e.a(2);
								}
						},
						e,
						null,
						[[1, 3]],
					);
				})),
				(q = function () {
					var e = this,
						a = arguments;
					return new Promise(function (t, n) {
						var r = u.apply(e, a);
						function o(e) {
							R(r, t, n, o, i, "next", e);
						}
						function i(e) {
							R(r, t, n, o, i, "throw", e);
						}
						o(void 0);
					});
				}).apply(this, arguments)
			);
		}
		function K(e, t) {
			window.fetch(e, {
				method: "POST",
				body: t,
				headers: { "Content-Type": "text/plain;charset=UTF-8" },
			});
		}
		var Y,
			F = {
				post: function (e, t, n) {
					return q.apply(this, arguments);
				},
			},
			l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
			J = {
				utf8: {
					encode: function (e) {
						e = e.replace(/\r\n/g, "\n");
						for (var t = "", n = 0; n < e.length; n++) {
							var r = e.charCodeAt(n);
							r < 128
								? (t += String.fromCharCode(r))
								: (t =
										127 < r && r < 2048
											? (t += String.fromCharCode((r >> 6) | 192)) +
												String.fromCharCode((63 & r) | 128)
											: (t =
													(t += String.fromCharCode((r >> 12) | 224)) +
													String.fromCharCode(((r >> 6) & 63) | 128)) +
												String.fromCharCode((63 & r) | 128));
						}
						return t;
					},
					decode: function (e) {
						var t,
							n,
							r,
							o = "",
							i = 0;
						for (t = 0; i < e.length; )
							(r = e.charCodeAt(i)) < 128
								? ((o += String.fromCharCode(r)), i++)
								: 191 < r && r < 224
									? ((t = e.charCodeAt(i + 1)),
										(o += String.fromCharCode(((31 & r) << 6) | (63 & t))),
										(i += 2))
									: ((t = e.charCodeAt(i + 1)),
										(n = e.charCodeAt(i + 2)),
										(o += String.fromCharCode(
											((15 & r) << 12) | ((63 & t) << 6) | (63 & n),
										)),
										(i += 3));
						return o;
					},
				},
				base64: {
					encode: function (e) {
						var t,
							n,
							r,
							o,
							i,
							a,
							u = "",
							s = 0;
						for (e = J.utf8.encode(e); s < e.length; )
							((r = (t = e.charCodeAt(s++)) >> 2),
								(o = ((3 & t) << 4) | ((t = e.charCodeAt(s++)) >> 4)),
								(i = ((15 & t) << 2) | ((n = e.charCodeAt(s++)) >> 6)),
								(a = 63 & n),
								isNaN(t) ? (i = a = 64) : isNaN(n) && (a = 64),
								(u = u + l.charAt(r) + l.charAt(o) + l.charAt(i) + l.charAt(a)));
						return u;
					},
					decode: function (e) {
						var t,
							n,
							r,
							o,
							i,
							a,
							u = "",
							s = 0;
						for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); s < e.length; )
							((r = l.indexOf(e.charAt(s++))),
								(t =
									((15 & (o = l.indexOf(e.charAt(s++)))) << 4) |
									((i = l.indexOf(e.charAt(s++))) >> 2)),
								(n = ((3 & i) << 6) | (a = l.indexOf(e.charAt(s++)))),
								(u += String.fromCharCode((r << 2) | (o >> 4))),
								64 != i && (u += String.fromCharCode(t)),
								64 != a && (u += String.fromCharCode(n)));
						return (u = J.utf8.decode(u));
					},
				},
			},
			W =
				((Y = window.crypto || window.msCrypto),
				{
					v4: function () {
						try {
							if (null !== Y && "object" === c(Y))
								return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
									/[018]/g,
									function (e) {
										return (
											e ^
											(Y.getRandomValues(new Uint32Array(1))[0] & (15 >> (e / 4)))
										).toString(16);
									},
								);
						} catch (e) {
							console.error(e);
						}
						return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
							/[xy]/g,
							function (e) {
								var t = (16 * Math.random()) | 0;
								return ("x" === e ? t : (3 & t) | 8).toString(16);
							},
						);
					},
				}),
			z = function (e, t, n) {
				for (
					var r = {},
						o = new RegExp("[&#?]{1}([^&=#?]*)=([^&#]*)?", "g"),
						i = o.exec(t);
					null !== i;
				)
					(0 === i[1].indexOf(e) &&
						(r[n + i[1].substring(e.length)] =
							void 0 === i[2] ? "" : window.decodeURIComponent(i[2])),
						(i = o.exec(t)));
				return r;
			};
		function G(e) {
			var n = e;
			function r(e, t) {
				null !== t && "" !== t && void 0 !== t && (n[e] = t);
			}
			return {
				setConfiguration: r,
				setConfigurations: function (e) {
					for (var t in e)
						Object.prototype.hasOwnProperty.call(e, t) && r(t, e[t]);
				},
				getConfiguration: function (e) {
					return void 0 !== n[e] ? D(n[e]) : null;
				},
				cloneData: function () {
					return D(n);
				},
				deleteProperty: function (e) {
					delete n[e];
				},
			};
		}
		function $(t) {
			var n = [];
			return {
				push: function (e) {
					(n.push(e), 1 === n.length && t[e[0]].apply(t, e.slice(1)));
				},
				next: function () {
					var e;
					(n.shift(), 0 < n.length && t[(e = n[0])[0]].apply(t, e.slice(1)));
				},
			};
		}
		function X(i, e, t) {
			((this.properties = D(i._properties)),
				(this.addEventsProperty = function (e, t) {
					if (i._privacy.call("isPropAllowed", e)) {
						var n,
							r = b(this.events);
						try {
							for (r.s(); !(n = r.n()).done; ) {
								var o = n.value;
								this.isPropertyAbsentForEvent(e, o) && (o.data[e] = t);
							}
						} catch (e) {
							r.e(e);
						} finally {
							r.f();
						}
					}
				}),
				(this.hasProperty = function (e) {
					return Object.prototype.hasOwnProperty.call(this.properties, e);
				}),
				(this.getConfiguration = t.getConfiguration),
				(this.setConfiguration = t.setConfiguration),
				(this.options = e.options || {}),
				(this.visitorId = null),
				(this.build = { url: "", data: {} }),
				(this.events = e.events || []),
				(this.isPropertyAbsentForEvent = function (e, t) {
					if (void 0 !== t.data[e]) return !1;
					if (this.hasProperty(e)) {
						if (void 0 === this.properties[e].options.events) return !1;
						var n,
							r = b(this.properties[e].options.events);
						try {
							for (r.s(); !(n = r.n()).done; ) {
								var o = n.value;
								if (
									t.name === o ||
									("*" === o.charAt(o.length - 1) &&
										0 === t.name.indexOf(o.substring(0, o.length - 1)))
								)
									return !1;
							}
						} catch (e) {
							r.e(e);
						} finally {
							r.f();
						}
					}
					return !0;
				}));
		}
		function w(e, t, n, r) {
			!1 !== r && 0 < n.length && "function" == typeof n[0]
				? n[0](e, t, n.slice(1))
				: e._queue.next();
		}
		function Z(e, t, n) {
			var r = t.getConfiguration("collectDomain"),
				o = r.startsWith("https://") || r.startsWith("http://") ? "" : "https://",
				o = "".concat(o).concat(r, "/").concat(t.getConfiguration("path")),
				r = "?s="
					.concat(t.getConfiguration("site"))
					.concat(t.visitorId ? "&idclient=" + t.visitorId : "");
			((t.build.url = o + r), (t.build.data = { events: t.events }), w(e, t, n));
		}
		function Q(e, t, n, r, o) {
			var i,
				a = z(r, n, o),
				u = !1;
			for (i in a)
				(Object.prototype.hasOwnProperty.call(a, i) &&
					!t.properties[i] &&
					t.addEventsProperty(i, a[i], { persistent: !0 }),
					(u = !0));
			return u;
		}
		function ee(e, t, n) {
			var r,
				o = document.location.href,
				i = b(t.getConfiguration("campaignPrefix"));
			try {
				for (i.s(); !(r = i.n()).done; ) if (Q(0, t, o, r.value, "src_")) break;
			} catch (e) {
				i.e(e);
			} finally {
				i.f();
			}
			(t.getConfiguration("enableUTMTracking") && Q(0, t, o, "utm_", "utm_"),
				w(e, t, n));
		}
		function te(e) {
			return (
				0 === e.indexOf('"') &&
					(e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")),
				ie(e)
			);
		}
		var ne,
			re,
			oe = function (e) {
				function t(e) {
					e && r.setDate(r.getDate() + e);
				}
				var n,
					r = new Date();
				return (
					e instanceof Date
						? (r = e)
						: "number" == typeof e
							? t(e)
							: ((n = e.days),
								(e = e.minutes),
								t(n),
								e && r.setMinutes(r.getMinutes() + e)),
					r
				);
			},
			ie = function (t) {
				t = t.replace(/\+/g, " ").replace(/^\s+|\s+$/g, "");
				try {
					return decodeURIComponent(t);
				} catch (e) {
					return t;
				}
			},
			m =
				((ne = "_cookie_test"),
				(re = "https:" === document.location.protocol),
				{
					set: ue,
					get: ce,
					getNames: function () {
						var t = [];
						return (
							se(function (e) {
								t.push(e);
							}),
							t
						);
					},
					remove: le,
					getTopLevelDomain: function (e) {
						void 0 === e && (e = []);
						var t = window.location.hostname.split("."),
							n =
								new Date().getTime().toString(36) +
								Math.round(2147483647 * Math.random()).toString(36),
							r = new Date();
						r.setSeconds(r.getSeconds() + 30);
						for (var o = 0; o < t.length; o++)
							try {
								var i = t.slice(-(o + 1)).join(".");
								if (!e.includes(i)) {
									ue(ne, n, { expires: r, path: "/", domain: i, secure: re });
									var a = ce(ne) === n;
									if ((le(ne, { path: "/", domain: i }), a)) return i;
								}
							} catch (e) {}
					},
					__private__: { _generateCookieString: ae },
				});
		function ae(e, t, n) {
			var r = (n = void 0 === n ? {} : n).path,
				o = n.domain,
				i = n.expires,
				a = n.secure,
				u = n.samesite,
				s = n.raw,
				n = n.priority;
			return (
				(s ? e : encodeURIComponent(e)) +
				"=" +
				(s ? t : encodeURIComponent(t)) +
				(i ? "; expires=".concat(oe(i).toUTCString()) : "") +
				(r ? "; path=".concat(r) : "") +
				(o ? "; domain=".concat(o) : "") +
				(a ? "; secure" : "") +
				(u
					? "boolean" == typeof u
						? "; sameSite"
						: "; sameSite=".concat(u)
					: "") +
				(n ? "; priority=".concat(n) : "")
			);
		}
		function ue(e, t, n, r) {
			void 0 === t ||
				(void 0 !== r &&
					encodeURI(t).split(/%(?:u[\dA-F]{2})?[\dA-F]{2}|./).length - 1 > r) ||
				(document.cookie = ae(e, t, n));
		}
		function se(e) {
			for (var t = document.cookie.split(";"), n = 0; n < t.length; n++) {
				var r = t[n].split("=");
				if (e(ie(r[0]), r[1] || "")) return;
			}
		}
		function ce(n) {
			var r = null,
				o = {};
			return (
				se(function (e, t) {
					if (n) return e === n && ((r = te(t)), 1);
					o[e] = te(t);
				}),
				n ? r : o
			);
		}
		function le(e, t) {
			ue(e, "", Object.assign({}, t, { expires: -1 }));
		}
		((de = "_ls_ttl"),
			(fe = function () {
				try {
					var e = window.localStorage.getItem(de);
					return e ? JSON.parse(e) : null;
				} catch (e) {
					return null;
				}
			}),
			(pe = function (e) {
				try {
					Object.keys(e).length
						? window.localStorage.setItem(de, JSON.stringify(e))
						: window.localStorage.removeItem(de);
				} catch (e) {}
			}),
			ge());
		var de,
			fe,
			pe,
			ve = {
				get: function (e) {
					var t;
					ge();
					try {
						return null != (t = window.localStorage.getItem(e)) ? t : null;
					} catch (e) {
						return null;
					}
				},
				set: function (e, t, n) {
					if (
						((r = e),
						(n = (n = void 0 === n ? {} : n).expires),
						(o = fe()),
						void 0 === n
							? (null != o && o[r] && (delete o[r], pe(o)), !0)
							: (n = oe(n).getTime()) > Date.now() &&
								(((o = o || {})[r] = n.toString(36)), pe(o), !0))
					)
						try {
							window.localStorage.setItem(e, t);
						} catch (e) {}
					var r, o;
				},
				getNames: he,
				remove: function (e) {
					try {
						window.localStorage.removeItem(e);
					} catch (e) {}
					ge();
				},
				expires: ge,
				__protected__: {
					get ttlName() {
						return de;
					},
				},
			};
		function ge() {
			var n = he(),
				r = fe(),
				o = {};
			r &&
				(Object.keys(r).forEach(function (e) {
					if (n.includes(e)) {
						var t = r[e] ? parseInt(r[e], 36) : null;
						if (!(t = t) || t > Date.now()) o[e] = r[e];
						else
							try {
								window.localStorage.removeItem(e);
							} catch (e) {}
					}
				}),
				JSON.stringify(r) !== JSON.stringify(o)) &&
				pe(o);
		}
		function he() {
			try {
				return Object.keys(window.localStorage);
			} catch (e) {
				return [];
			}
		}
		function t(t, e) {
			return {
				cookieName: (e = void 0 === e ? "_pctx" : e),
				readonly: !1,
				init: function (e) {
					return null != (e = null != e ? e : t) ? e : null;
				},
				refresh: function (e) {
					return e;
				},
				update: function (e) {
					return e;
				},
				set: function (e) {
					return e;
				},
				get: function (e) {
					return e;
				},
			};
		}
		function e(e) {
			return _(_({}, t(e)), { cookieName: null });
		}
		function me(e) {
			return null == e;
		}
		function ye() {
			var t = {};
			return {
				add: function (e) {
					t[e] = !0;
				},
				values: function () {
					return d(t);
				},
			};
		}
		function _e(n, r) {
			var o,
				i = NaN,
				a = NaN;
			return function (e) {
				var t = null == r ? void 0 : r();
				return ((e === a && i === t) || ((i = t), (o = n((a = e)))), o);
			};
		}
		function be(n) {
			var r;
			return function (e) {
				var t = n();
				t !== r && e((r = t));
			};
		}
		function we(e) {
			return C(e, function (e) {
				return "CX" !== (null == e ? void 0 : e.type);
			});
		}
		function Ce(e, t) {
			return (t({ protect: !0 }), Me());
		}
		function ke(r, o, i) {
			var e = qe().reduce(function (e, t) {
				var t = t.id,
					n = i(null == r ? void 0 : r[t], null == o ? void 0 : o[t], t);
				return (n && (e[t] = n), e);
			}, {});
			return He(e, o) ? o : e;
		}
		function Pe(e, t) {
			return ke(e, t, function (e, t, n) {
				return e || t || at()[n];
			});
		}
		function Ae() {
			return !!v().requireConsent;
		}
		var Oe,
			Ee,
			Se = {
				get: function (e) {
					try {
						return window.sessionStorage.getItem(e);
					} catch (e) {
						return null;
					}
				},
				set: function (e, t) {
					try {
						window.sessionStorage.setItem(e, t);
					} catch (e) {}
				},
				getNames: function () {
					try {
						return Object.keys(window.sessionStorage);
					} catch (e) {
						return [];
					}
				},
				remove: function (e) {
					try {
						window.sessionStorage.removeItem(e);
					} catch (e) {}
				},
			},
			_ = function () {
				return (_ =
					Object.assign ||
					function (e) {
						for (var t, n = 1, r = arguments.length; n < r; n++)
							for (var o in (t = arguments[n]))
								Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
						return e;
					}).apply(this, arguments);
			},
			xe = t("anon"),
			d = function (e) {
				return e ? Object.keys(e) : [];
			},
			p = function (e) {
				return Array.isArray(e);
			},
			De = function (e) {
				return !me(e);
			},
			Ie = function (e) {
				return "object" === c(e);
			},
			f = function (e) {
				return "string" == typeof e;
			},
			Me = function () {
				for (var e = new Date().getTime().toString(36); e.length < 16; )
					e += Math.round(2147483647 * Math.random()).toString(36);
				return e.substr(0, 16);
			},
			C = function (n, t) {
				return (
					n &&
					d(n)
						.filter(function (e) {
							return t(n[e]);
						})
						.reduce(function (e, t) {
							return _(_({}, e), (((e = {})[t] = n[t]), e));
						}, {})
				);
			},
			Te = function (o, i) {
				return Ie(o)
					? d(o).reduce(function (e, t) {
							var n = o[t],
								r = i[t],
								r = r && r(n);
							return (void 0 !== r && (e[t] = r), e);
						}, {})
					: o;
			},
			Ne = function (e) {
				return "true" === e || !0 === e;
			},
			o = function (e, t) {
				try {
					return e();
				} catch (e) {
					return t ? o(t) : null;
				}
			},
			Le = function (e, t) {
				return (
					void 0 === t && (t = !1),
					o(
						function () {
							return JSON.parse(e);
						},
						function () {
							return t ? JSON.parse(window.atob(e)) : null;
						},
					) || null
				);
			},
			je = function (e, t) {
				void 0 === t && (t = !1);
				var n = JSON.stringify(e);
				return (
					o(function () {
						return t ? window.btoa(n) : n;
					}) || n
				);
			},
			He = function (t, n) {
				var e, r;
				return (
					t === n ||
					(t && n
						? ((e = d(t)),
							(r = d(n)),
							e.length === r.length &&
								!e.some(function (e) {
									return t[e] !== n[e];
								}))
						: null)
				);
			},
			n = _(_({}, t(null)), {
				init: function (e) {
					return we(e || null);
				},
				refresh: we,
				set: function (e, t) {
					return null === e
						? null
						: C(_(_({}, t), e), function (e) {
								return null !== e;
							});
				},
			}),
			Be = "pdl",
			v = function () {
				return window[Be] || {};
			},
			Re = _(_({}, e()), {
				init: function (e, t) {
					return (t({ protect: !0 }), v().pageViewId || Me());
				},
				refresh: Ce,
				update: Ce,
				set: function (e, t, n) {
					return (n({ protect: !0 }), e);
				},
			}),
			s = "DL",
			i = ["PA", "DMP", "COMPOSER", "ID", "VX", "ESP", "SOCIAL_FLOW", s].map(
				function (e, t) {
					return { name: e, id: t };
				},
			),
			g = i.reduce(function (e, t, n) {
				t = t.name;
				return _(_({}, e), (((e = {})[t] = n), (e[t.toLowerCase()] = n), e));
			}, {}),
			Ue =
				((g["social flow"] = g.SOCIAL_FLOW),
				(g["Social Flow"] = g.SOCIAL_FLOW),
				function () {
					var e;
					return null == (e = Bt(v().consent)) ? void 0 : e.products;
				}),
			Ve = be(Ue),
			qe =
				((Oe = i),
				function () {
					return (
						Ve(function (t) {
							Oe = t
								? i.filter(function (e) {
										return t.includes(e.name) || e.name === s;
									})
								: i;
						}),
						Oe
					);
				}),
			Ke = function (e) {
				var t = Number(e);
				return Number.isNaN(t)
					? null != (e = g[e.toLowerCase()])
						? e
						: null
					: t < i.length
						? t
						: null;
			},
			Ye = function (r, o) {
				return d(r).reduce(function (e, t) {
					var n = i[Number(t)].name,
						t = r[t];
					return ((e[n] = o ? o(t, n) : t), e);
				}, {});
			},
			Fe = "not-acquired",
			Je = "opt-in",
			We = "essential",
			ze = "opt-out",
			Ge = "custom",
			$e = [Je, We, ze],
			Xe = $e.concat(Ge),
			Ze = Xe.reduce(function (e, t, n) {
				return _(_({}, e), (((e = {})[n] = t), e));
			}, {}),
			Qe = [Fe, Je, Ge, We, ze],
			et = function (e, t) {
				((e = Qe.indexOf(e)), (t = Qe.indexOf(t)));
				return Qe[Math.max(e, t)];
			},
			tt = function (e) {
				return Xe.includes(e);
			},
			nt = function (e) {
				return $e.includes(e);
			},
			rt = {
				AD: ["DMP", "SOCIAL_FLOW"],
				CP: ["COMPOSER"],
				AM: ["PA"],
				PR: ["ESP", "VX", "ID"],
				DL: ["DL"],
			},
			ot = d(rt).reduce(function (t, n) {
				return (
					rt[n].forEach(function (e) {
						e = g[e];
						t[e] = n;
					}),
					t
				);
			}, {}),
			it = be(function () {
				var e;
				return null == (e = Bt(v().consent)) ? void 0 : e.defaultPurposes;
			}),
			at =
				((Ee = _({}, ot)),
				function () {
					return (
						it(function (n) {
							((Ee = _({}, ot)),
								n &&
									d(n).forEach(function (e) {
										var t = g[e];
										Ee[t] = null == (t = n[e]) ? void 0 : t.substring(0, 32);
									}));
						}),
						Ee
					);
				}),
			ut = _(_({}, t(null, "_pprv")), {
				init: function (e) {
					return h() ? Pe(e || null, null) : null;
				},
				set: function (e, t) {
					return h()
						? null == e
							? t
							: Pe(
									d((r = e)).reduce(function (e, t) {
										var n = Ke(t),
											t = vt(r[t]);
										return (
											null !== n && t !== dt && n !== g[s] && t && (e[n] = t),
											e
										);
									}, {}),
									t,
								)
						: null;
					var r;
				},
			}),
			st = function () {
				return v().consent_modifiers || null;
			},
			h = function () {
				return "v2" === v().requireConsent;
			},
			ct = function () {
				return !!v().strictConsent;
			},
			lt = function (e, t) {
				return e === Ge && !(null != (e = st()) && e[t]);
			},
			dt = "DL",
			ft = ["AD", "AM", "CP", "PR", dt].reduce(function (e, t) {
				return _(_({}, e), (((e = {})[t] = t), (e[t.toLowerCase()] = t), e));
			}, {}),
			pt = function (e) {
				return ft[(null == e ? void 0 : e.toLowerCase()) || ""] || null;
			},
			vt = function (e) {
				return pt(e) || (null == e ? void 0 : e.substring(0, 32));
			},
			gt = function (e, t, n) {
				return "".concat(e.join(", "), " ").concat(1 < e.length ? n : t);
			},
			ht = "Consent v2 is disabled",
			mt = 'the "DL" purpose is reserved',
			yt = function (e) {
				return '"'.concat(e, '" can not be applied for the dl product');
			},
			_t = function (e) {
				return "".concat(e, " is unknown consent mode");
			},
			bt = function (e) {
				return (
					gt(e, "does", "do") +
					"n't have modifier in the pdl. Custom mode can't be applied"
				);
			},
			wt = "Unknown purpose. Provide a product or define within pdl config",
			Ct = function (e) {
				return "Custom purpose: " + gt(e, "is", "are") + " unknown";
			};
		function kt(u, e, t, n, r) {
			function o(e, t) {
				return (
					(t = vt(t)),
					ft[t] || Object.values(u || {}).includes(t) ? f(e, t) : d(wt)
				);
			}
			var i,
				a,
				s,
				c,
				l,
				d = function (e) {
					return { error: e };
				},
				f = function (r, o, i) {
					var e,
						a = [];
					return tt(r)
						? ((e = qe().reduce(function (e, t) {
								var n = t.id,
									t = t.name;
								return (
									(!o ||
										(null == u ? void 0 : u[n]) === o ||
										(null != i && i.includes(n))) &&
										(lt(r, t) ? a.push(t) : (e[n] = { mode: r })),
									e
								);
							}, {})),
							a.length ? d(bt(a)) : Object.keys(e).length ? { consent: e } : null)
						: d(_t(r));
				};
			return h()
				? r
					? ((i = n),
						(r = r),
						(c = vt((a = t))),
						(r = p(r) ? r : [r]),
						(l = r.map(Ke).filter(De)).length
							? c !== dt && l.includes(g.DL)
								? { error: yt(c) }
								: c === dt &&
										l.some(function (e) {
											return e !== g.DL;
										})
									? d(mt)
									: null != (s = f(i, c, l)) && s.error
										? s
										: ((l = l.reduce(function (e, t) {
												return ((e[t] = c), e);
											}, {})),
											{
												consent: (null == s ? void 0 : s.consent) || null,
												purposes: l,
											})
							: pt(a)
								? o(i, a)
								: d(Ct(r)))
					: n
						? o(n, t)
						: f(t)
				: d(ht);
		}
		function Pt(e) {
			var t = e && e.length;
			return 16 === t || 36 === t ? e : null;
		}
		function At(t, n) {
			return function (e) {
				return n(t + e);
			};
		}
		function Ot(o, a) {
			var e, u;
			return (
				void 0 === a && (a = Nt),
				o
					? ((e = {}),
						o.products &&
							(p(o.products)
								? (e.products = o.products.reduce(function (e, t) {
										t = Lt(t, At("consent.products: ", a));
										return (t && e.push(t), e);
									}, []))
								: a("consent.products: should be an array")),
						o.defaultPreset &&
							(e.defaultPreset = d(o.defaultPreset).reduce(function (e, t) {
								var n = Lt(t, At("consent.defaultPreset: ", a)),
									r = jt(o.defaultPreset[t]);
								return (
									r || a("consent.defaultPreset: " + Tt(t, $e)),
									n && r && (e[n] = r),
									e
								);
							}, {})),
						(u = o.defaultPurposes) &&
							(e.defaultPurposes = d(u).reduce(function (e, t) {
								var n = At("consent.defaultPurposes: ", a),
									r = Lt(t, n),
									o = u[t],
									i = vt(o);
								return (
									i === dt || r === s
										? n('"'.concat(t, ": ").concat(o, '" - invalid config'))
										: r && i && (e[r] = i),
									e
								);
							}, {})),
						e)
					: null
			);
		}
		function Et(e) {
			return e.reduce(function (e, t, n) {
				return _(_({}, e), (((e = {})[n] = { mode: Ze[t] }), e));
			}, {});
		}
		function St(e, t) {
			var o = ct();
			return ke(e, t, function (e, t, n) {
				var r = n === g[s],
					r = o && !r ? null : Jt()[0].preset[n].mode,
					n = (null == e ? void 0 : e.mode) || (null == t ? void 0 : t.mode) || r;
				return null === n
					? null
					: n !== (null == t ? void 0 : t.mode)
						? { mode: n }
						: t;
			});
		}
		function xt(e) {
			var t = Number(e);
			return Number.isNaN(t) ? String(e) : t;
		}
		function Dt(e) {
			return p(e)
				? e
				: e.split(",").map(function (e) {
						return e.trim().replace(/^['"](.+)['"]$/, "$1");
					});
		}
		function r(e) {
			return e;
		}
		var a,
			It = function (o, e) {
				var i, a;
				return o
					? ((i = Ye(e || ot)),
						(a = ct()),
						qe().reduce(function (e, t) {
							var t = t.name,
								n = i[t],
								r =
									(null == (r = o[t]) ? void 0 : r.mode) ||
									(a && !(t === s) ? Fe : Je);
							return (
								e[n]
									? ((e[n].mode = et(e[n].mode, r)), e[n].products.push(t))
									: (e[n] = { mode: r, products: [t] }),
								e
							);
						}, {}))
					: null;
			},
			Mt = ["include", "exclude", "obfuscate"],
			Tt = function (e, t) {
				return '"'.concat(e, '" should be one of ').concat(t.join(", "));
			},
			Nt = function () {},
			Lt = function (e, t) {
				void 0 === t && (t = Nt);
				var n = g[e.toLowerCase()];
				return void 0 !== n
					? i[n].name
					: (t('"'.concat(e, '" is not found')), null);
			},
			jt = function (e) {
				return nt(e) ? e : null;
			},
			Ht = function (e, i) {
				void 0 === i && (i = Nt);
				var t = e.source,
					e = e.patches || [];
				return (
					jt(t) || (i(Tt("source", $e)), (t = Je)),
					p(e) || (i('"patches" should be an array'), (e = [])),
					{
						source: t,
						patches: (e = e.reduce(function (e, t, n) {
							var r, o;
							return (
								!Ie(t) || p(t)
									? i(
											"patch[".concat(
												n,
												"]: should be type of {action, item, with?}",
											),
										)
									: ((r = t.action),
										(o = t.item),
										Mt.includes(r)
											? o && Ie(o) && o.key && o.type
												? e.push(t)
												: i(
														"patch[".concat(
															n,
															']: "item" should be type of {key, type}',
														),
													)
											: i("patch[".concat(n, "]: ") + Tt("action", Mt))),
								e
							);
						}, [])),
					}
				);
			},
			Bt = _e(Ot),
			Rt = function (o, i) {
				return (
					void 0 === i && (i = Nt),
					d(o || {}).reduce(function (e, t) {
						var n = null == o ? void 0 : o[t],
							r = Lt((null == n ? void 0 : n.source) || "", i);
						return ((e[t] = _(_({}, n), { source: r })), e);
					}, {})
				);
			},
			Ut = _(_({}, t(null, "_pcid")), {
				init: function (e, t) {
					return (t({ protect: !0 }), Pt(v().browserId || null) || e || Me());
				},
				update: function (e, t) {
					return (t({ protect: !0 }), Me());
				},
				set: function (e, t, n) {
					return (n({ protect: !0 }), e);
				},
			}),
			Vt = _(_({}, e()), {
				init: function () {
					return v().referrer || document.referrer;
				},
			}),
			qt = _(_({}, e()), {
				init: function () {
					return v().sessionReferrer || document.referrer;
				},
			}),
			Kt = [
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 2, 2, 2, 2, 2, 0],
				[1, 2, 2, 2, 2, 2, 2, 1],
				[0, 2, 0, 2, 2, 2, 0, 0],
				[1, 2, 2, 2, 2, 2, 1, 1],
				[2, 0, 0, 2, 2, 2, 2, 0],
				[2, 0, 2, 2, 2, 2, 2, 0],
				[2, 2, 2, 2, 2, 2, 0, 2],
				[2, 2, 0, 0, 0, 0, 2, 0],
				[2, 2, 1, 2, 1, 2, 2, 1],
				[2, 2, 1, 1, 2, 2, 2, 1],
			],
			Yt = Kt.map(function (e, t) {
				return { id: t, preset: Et(e) };
			}),
			Ft = be(function () {
				var e;
				return null == (e = Bt(v().consent)) ? void 0 : e.defaultPreset;
			}),
			Jt =
				((a = Yt),
				function () {
					return (
						Ft(function (n) {
							((a = Yt.slice()),
								n &&
									((a[0] = { id: 0, preset: _({}, a[0].preset) }),
									d(n).forEach(function (e) {
										var t = n[e],
											e = g[e];
										a[0].preset[e] = { mode: t };
									})));
						}),
						a
					);
				}),
			Wt = _(_({}, t(null, "_pprv")), {
				init: function (e) {
					return Ae() && e ? St(e, null) : null;
				},
				set: function (e, t) {
					var n, r, o;
					return Ae()
						? null != e &&
							(n =
								"number" == typeof e
									? (null == (n = Jt()[e]) ? void 0 : n.preset) || null
									: p(e)
										? ((o = null),
											e.forEach(function (e) {
												var n = Kt[e];
												!o && n
													? (o = n)
													: o &&
														n &&
														(o = o.map(function (e, t) {
															return Math.min(e, n[t]);
														}));
											}),
											o && Et(o))
										: d((r = e)).reduce(function (e, t) {
												var n = r[t],
													t = Ke(t);
												return (
													null !== t &&
														(n = tt(n.mode) ? n.mode : null) &&
														((e = e || {})[t] = { mode: n }),
													e
												);
											}, null))
							? St(n, t)
							: t
						: null;
				},
				get: _e(
					function (e) {
						return (
							e &&
							Ye(e, function (e, t) {
								var n,
									e = _({}, e);
								return (
									e.mode === Ge &&
										(e.modifier = (null == (n = st()) ? void 0 : n[t]) || null),
									e
								);
							})
						);
					},
					function () {
						return st();
					},
				),
			}),
			zt = _(_({}, e()), { init: Jt, set: Jt }),
			Gt = _(_({}, e()), { init: qe, set: qe }),
			$t = _(_({}, e(null)), {
				readonly: !0,
				set: function () {
					return null;
				},
				get: st,
			}),
			Xt = {
				id: r,
				type: r,
				zone: r,
				createdAt: xt,
				modifiedAt: xt,
				authors: Dt,
				section: r,
				tags: Dt,
				keywords: Dt,
				title: r,
				description: r,
				isNative: Ne,
			},
			Zt = function (e) {
				return "all" === e;
			},
			Qt = function (e) {
				return "first" === e;
			},
			en = function (e) {
				return "last" === e;
			};
		function tn(e, t) {
			return (
				void 0 === e && (e = "meta"),
				Qt(t)
					? document.querySelector(e)
					: ((e = document.querySelectorAll(e)),
						en(t) ? e[e.length - 1] : Array.from(e))
			);
		}
		nn = null;
		var nn,
			rn = {
				refresh: function () {
					(nn = tn() || null) &&
						setTimeout(function () {
							nn = null;
						}, 0);
				},
				find: function (a, u) {
					return (
						void 0 === u && (u = !1),
						nn
							? nn.reduce(function (e, t) {
									for (var n = 0, r = a; n < r.length; n++) {
										var o = r[n],
											o = (("name" === o ? t.name : t.getAttribute(o)) || "")
												.trim()
												.toLowerCase(),
											i = t.content;
										if (o && (!u || i)) {
											(e[o] || (e[o] = []), e[o].push(t));
											break;
										}
									}
									return e;
								}, {})
							: null
					);
				},
			},
			on = function (e) {
				var r =
					e.getContent ||
					function (e) {
						return e.content;
					};
				if (e.selector)
					return ((t = tn(e.selector, e.take || "first")) && r(t)) || null;
				var o = rn.find(e.attr || ["name"], e.hasContent),
					t = e.names || [],
					i = !Zt(e.take),
					a = en(e.take);
				if (o)
					for (var n = 0, u = t; n < u.length; n++) {
						var s = ((e) => {
							var t,
								n = [];
							if ((e = o[e])) {
								if (i)
									return ((t = e[a ? e.length - 1 : 0]), { value: r(t) || "" });
								e.forEach(function (e) {
									n = n.concat(r(e) || "");
								});
							}
							if (n.length) return { value: n };
						})(u[n]);
						if ("object" === c(s)) return s.value;
					}
				return null;
			},
			an = function (e) {
				for (var t = 0, n = e; t < n.length; t++) {
					var r = n[t],
						r = on(r);
					if (r) return r;
				}
			},
			u = function (e, t, n) {
				var r,
					o = Xt[t];
				!Boolean(e[t]) &&
					o &&
					(o =
						(r = (
							"function" == typeof n
								? n
								: function () {
										return (p(n) ? an : on)(n);
									}
						)()) && o(r)) &&
					(e[t] = o);
			},
			un = function (e) {
				return { attr: ["property"], names: [e] };
			},
			sn = function (e) {
				return { names: [e] };
			};
		function cn(e) {
			return e && f(e["@type"]) && e["@type"].includes("Article");
		}
		function ln() {
			var e = document.querySelectorAll('script[type="application/ld+json"]');
			return (
				(e &&
					((e = Array.from(e).flatMap(function (e) {
						return Le(e.innerHTML);
					})),
					p((e = e))) &&
					e.find(cn)) ||
				{}
			);
		}
		function dn(e) {
			var t = e
					.replace(/DAY/g, "(0?[1-9]|[12][0-9]|3[01])")
					.replace(/MONTHLONG/g, "(" + d(fn).join("|") + ")")
					.replace(/MONTH/g, "(0?[1-9]|1[012])")
					.replace(/YEAR2/g, "([0-9][0-9])")
					.replace(/YEAR/g, "(197[1-9]|19[8-9][0-9]|20[0-9][0-9])")
					.replace(
						/TIME/g,
						"([0-9][0-9]):([0-9][0-9]):([0-9][0-9])(?:\\.[0-9][0-9][0-9])?([zZ]|[+-][0-9][0-9](?::?[0-9][0-9])?)?",
					),
				e = e.replace(/.*?([YMD])(EAR|ONTH|AY).*?/g, "$1").substring(0, 3);
			return [new RegExp(t), e];
		}
		var fn = {
				januar: "01",
				january: "01",
				jan: "01",
				februar: "02",
				february: "02",
				feb: "02",
				mars: "03",
				march: "03",
				mar: "03",
				april: "04",
				apr: "04",
				mai: "05",
				may: "05",
				juni: "06",
				june: "06",
				jun: "06",
				juli: "07",
				july: "07",
				jul: "07",
				august: "08",
				aug: "08",
				september: "09",
				sept: "09",
				sep: "09",
				oktober: "10",
				october: "10",
				okt: "10",
				oct: "10",
				november: "11",
				nov: "11",
				desember: "12",
				december: "12",
				dec: "12",
				des: "12",
			},
			pn = [
				"\\bDAY\\.MONTH\\.YEAR\\b",
				"\\bDAY\\.?\\s{0,3}MONTHLONG\\.?\\s{1,3}YEAR\\b",
				"\\bYEAR-MONTH-DAY(?:[tT]|\\b)",
				"\\bMONTHLONG\\.?\\s{0,3}DAY(?:st|nd|rd|th)?,?\\s{1,3}YEAR\\b",
				"\\bDAY(?:st|nd|rd|th|\\.)?\\s{0,3}MONTHLONG\\.?,?\\s{1,3}YEAR\\b",
				"\\bYEAR[/年]MONTH[/月]DAY(?=\\b|日)",
				"\\bDAY\\.MONTH\\.YEAR2\\b",
				"\\bDAY/MONTH/YEAR\\b",
			].map(dn),
			vn = dn("YEAR-MONTH-DAY[tT]TIME")[0],
			k = function (e) {
				return (e && parseInt(e, 10)) || 0;
			};
		function gn(e, t, n, r, o, i, a) {
			((e = new Date(Date.UTC(k(e), k(t) - 1, k(n), k(r), k(o), k(i)))),
				(t = (a || "").match(/^([+-][0-9][0-9])(?::?([0-9][0-9])?)$/)),
				t &&
					(e = new Date(
						e.getTime() - 36e5 * Number(t[1]) - 6e4 * (Number(t[2]) || 0),
					)),
				(n = Date.now() - e.getTime()));
			return 0 < n || -n < 1728e5 ? e.toISOString() : null;
		}
		function hn(e) {
			var t = (e = e.toLowerCase()).match(vn);
			if (t) return gn(t[1], t[2], t[3], t[4], t[5], t[6], t[7]);
			for (var n = 0, r = pn; n < r.length; n++) {
				var o = r[n],
					i = e.match(o[0]);
				if (i)
					return gn(
						2 ===
							(i =
								"DMY" === o[1]
									? ["", i[3], i[2], i[1]]
									: "MDY" === o[1]
										? ["", i[3], i[1], i[2]]
										: i)[1].length
							? (k(i[1]) < 60 ? "20" : "19") + i[1]
							: i[1],
						i[2].length <= 2 ? i[2] : fn[i[2]],
						i[3],
					);
			}
		}
		var mn = function (e) {
			return e
				.replace(/<\/?[^>?]*\/?>/g, " ")
				.replace(/\s+/g, " ")
				.trim();
		};
		function yn(e) {
			return mn(
				(e = void 0 === e ? "" : e).replace(/,(?=\s*(jr|sr)(\.?)\b)/g, " "),
			);
		}
		function P(e) {
			return _(_({}, e), { take: "last" });
		}
		function A(e) {
			return _(_({}, e), {
				take: "last",
				hasContent: !0,
				getContent: function (e) {
					return mn(e.content || "");
				},
			});
		}
		function _n() {
			var e,
				t,
				n = Array.from(
					document.querySelectorAll("meta[property^=content]"),
				).reduce(function (e, t) {
					var n =
							null == (n = null == t ? void 0 : t.getAttribute("property"))
								? void 0
								: n.split(":").pop(),
						r = Xt[n];
					return (
						r &&
							t &&
							(e[n] = r((null == t ? void 0 : t.getAttribute("content")) || "")),
						e
					);
				}, {});
			return (
				rn.refresh(),
				u((e = n), "type", un("og:type")),
				u(e, "section", sn("section")),
				u(e, "id", sn("id")),
				u(e, "authors", sn("author")),
				u((e = n), "createdAt", function () {
					var e = an(kn);
					return e ? hn(e.toLowerCase()) : null;
				}),
				u(e, "modifiedAt", function () {
					var e = an(Pn);
					return e ? hn(e.toLowerCase()) : null;
				}),
				u(e, "authors", An),
				u(e, "keywords", function () {
					var e = an(On);
					return e && e.length <= 1024 ? e : null;
				}),
				u(e, "title", Sn),
				u(e, "description", En),
				(e = n),
				cn((t = ln())) &&
					(u(e, "createdAt", function () {
						var e = t.datePublished;
						return e ? hn(e.toLowerCase()) : null;
					}),
					u(e, "modifiedAt", function () {
						var e = t.dateModified;
						return e ? hn(e.toLowerCase()) : null;
					}),
					u(e, "authors", function () {
						var e = t.author;
						return e
							? p(e)
								? e
										.map(function (e) {
											return e.name;
										})
										.join(", ")
								: e.name
							: null;
					}),
					u(e, "keywords", function () {
						var e = t.keywords;
						return f(e) && e.length <= 1024 ? e : null;
					}),
					u(e, "title", function () {
						return t.headline;
					}),
					u(e, "description", function () {
						return t.description;
					})),
				n
			);
		}
		function bn(e, t, n) {
			return (
				void 0 === n && (n = !1),
				{
					cookieName: e,
					consent: (t = void 0 === t ? Hn : t),
					encode: function (e) {
						return je(e, n);
					},
					decode: function (e) {
						return Le(e, !0);
					},
				}
			);
		}
		function wn(e) {
			function r(e) {
				return _(_({}, f), C(e || {}, De));
			}
			function n(e, t) {
				var n = e && t;
				(!v() && n && g(),
					v() && !n && h(),
					v() && n && !c && g(),
					(a = e),
					(l = t));
			}
			var o = e.cookieName,
				t = e.consent,
				i = m.get(o),
				a = !!i,
				u = a,
				s = Ln(i, e),
				c = !!s.fixedAt,
				l = a,
				d = null,
				f = _({}, Dn),
				p = null,
				v = function () {
					return a && l;
				},
				g = function (e) {
					var t,
						e = r(e),
						n = d || (p ? s.encode(p, e) : "");
					(n ||
						((t = m.get(o)), (n = (t = s.decode(t || "")) ? s.encode(t, e) : "")),
						n && ((c = !0), m.set(o, n, s.bindOptions(e)), (u = !0)));
				},
				h = function (e) {
					v() && (u && m.remove(o, r(e)), (u = !1));
				};
			return (
				s.onChange(function () {
					v() && ((c = !1), g());
				}),
				{
					get cookieName() {
						return o;
					},
					get cookieEnabled() {
						return v();
					},
					get fixedAt() {
						return s.fixedAt;
					},
					get consent() {
						return t;
					},
					set: function (e, t) {
						((p = e), v() && g(t));
					},
					get: function () {
						return s.decode(m.get(o) || "");
					},
					remove: h,
					setCookieOptions: function (e) {
						((f = r(e)), v() && g());
					},
					setCookieEnabled: function (e, t) {
						(void 0 === t && (t = null), (d = e ? t : null), n(e, l));
					},
					lazyActive: function () {
						n(a, !0);
					},
					setFixedMode: function (e) {
						s.setMode(e);
					},
				}
			);
		}
		var Cn,
			kn = [
				P({
					attr: ["name", "property", "itemprop"],
					names: [
						"cxenseparse:publishtime",
						"cxenseparse:recs:publishtime",
						"article:published_time",
						"date",
						"dc.date",
						"dc.date.created",
						"dc.terms.issued",
						"pub_date",
						"article.published",
						"datepublished",
						"og:article:published_time",
					],
				}),
				P({
					selector: "time.published[datetime],time[pubdate][datetime]",
					getContent: function (e) {
						return e.getAttribute("datetime");
					},
				}),
				P({
					selector: 'time[itemprop="datePublished"][datetime]',
					getContent: function (e) {
						return e.getAttribute("datetime");
					},
				}),
			],
			Pn = [
				P({
					attr: ["name", "property", "itemprop"],
					names: ["article:modified_time", "datemodified"],
				}),
				P({
					selector: 'time[itemprop="dateModified"][datetime]',
					getContent: function (e) {
						return e.getAttribute("datetime");
					},
				}),
			],
			An = [
				{
					attr: ["property", "name"],
					names: [
						"cxenseparse:author",
						"og:article:author",
						"article:author",
						"og:book:author",
						"book:author",
						"author",
						"dc.creator",
						"article.author",
					],
					take: "all",
					getContent: function (e) {
						var t = e.getAttribute("data-separator"),
							e = e.content;
						return t
							? yn(e).split(t)
							: yn(
									(t = void 0 === (t = e) ? "" : t)
										.replace(/\n+/, ";")
										.replace(/(\<|&lt;)br(\>|&gt;)/, ";")
										.replace(/\b(and|und|og)\b/g, ";"),
								).split(/[,;]/);
					},
				},
			],
			On = [
				A({ names: ["cxenseparse:keywords"] }),
				A({ attr: ["property", "name"], names: ["news_keywords"] }),
				A({ names: ["keywords"] }),
			],
			En = [
				A({ names: ["cxenseparse:description"] }),
				A({ attr: ["property"], names: ["og:description"] }),
				A({ names: ["description"] }),
			],
			Sn = [
				{ names: ["cxenseparse:title"] },
				P({ attr: ["property", "name"], names: ["og:title"] }),
			],
			xn = _(_({}, e(null)), {
				init: _n,
				refresh: function (e) {
					var t = _n();
					return (
						null != e &&
							e._fixed_ &&
							null != e &&
							e._fixed_.forEach(function (e) {
								delete t[e];
							}),
						_(_({}, e), t)
					);
				},
				set: function (n, e) {
					var t, r;
					return null === n
						? {}
						: ((t = new Set(e && e._fixed_)),
							(r = function (e, t) {
								d(C(n, e)).forEach(t);
							})(De, function (e) {
								t.add(e);
							}),
							r(me, function (e) {
								t.delete(e);
							}),
							C(_(_(_({}, e), n), { _fixed_: Array.from(t.values()) }), De));
				},
				get: _e(function (e) {
					var t = _({}, e);
					return (delete t._fixed_, e && t);
				}),
			}),
			O = _(_({}, t(null, "_pcus")), {
				init: function (e) {
					return (
						(e = void 0 === e ? null : e) &&
						C(e, function (e) {
							return Ie(e) && p(e.segments);
						})
					);
				},
			}),
			Re = {
				pageViewId: Re,
				browserId: Ut,
				users: n,
				userStatus: xe,
				siteId: t(),
				consent: Wt,
				consentPresets: zt,
				products: Gt,
				consentModifiers: $t,
				purposes: ut,
				content: xn,
				userSegments: O,
				referrer: Vt,
				sessionReferrer: qt,
			},
			Ut = ["pantheon.io", "go-vip.net", "go-vip.co"],
			xe =
				void 0 ===
				(n =
					null == (n = null == (n = v()) ? void 0 : n.cookieDefault)
						? void 0
						: n.domain)
					? m.getTopLevelDomain(Ut)
					: n,
			Dn = {
				path: "/",
				expires: 395,
				samesite: "lax",
				secure: "https:" === window.location.protocol,
				domain: xe,
			},
			In = function (e) {
				var t = new Date();
				if (e instanceof Date) t = e;
				else {
					if ("number" != typeof e) return null;
					t.setDate(t.getDate() + e);
				}
				return t;
			},
			Mn = function (e) {
				return e.getTime().toString(36);
			},
			Tn = function (e) {
				return e
					? o(function () {
							return new Date(parseInt(e, 36));
						})
					: null;
			},
			Nn = "_t",
			Ln = function (e, t) {
				function n(e) {
					return (a = a || In(e.expires));
				}
				var r = t.encode,
					o = t.decode,
					i = !1,
					a = null,
					u = null,
					s = null;
				(t = null == (t = o(e || "")) ? void 0 : t[Nn]) &&
					((t = t.split("|")), (a = Tn(t[0])), (u = Tn(t[1])), (i = !!a));
				return {
					get fixedAt() {
						return i ? [u, a] : null;
					},
					onChange: function (e) {
						s = e;
					},
					setMode: function (e) {
						var t = i;
						(i = e) !== t && (u = a = null) != s && s(i);
					},
					bindOptions: function (e) {
						return i && (a = n(e)) ? _(_({}, e), { expires: a }) : e;
					},
					decode: function (e) {
						e = o(e);
						return (null != e && e[Nn] && delete e[Nn], e);
					},
					encode: function (e, t) {
						return (
							i
								? (a = n(t)) && (e[Nn] = Mn(a) + "|" + Mn((u = u || new Date())))
								: delete e[Nn],
							r(e)
						);
					},
				};
			},
			jn = "essential",
			Hn = "optional",
			Bn = "mandatory",
			Rn = String.fromCharCode,
			Un = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
			Vn = {};
		function qn(e) {
			if (null == e) return "";
			var t = e,
				n = 6,
				r = function (e) {
					return Un.charAt(e);
				};
			if (null == t) return "";
			for (
				var o,
					i,
					a,
					u,
					s = {},
					c = {},
					l = "",
					d = 2,
					f = 3,
					p = 2,
					v = [],
					g = 0,
					h = 0,
					m = 0;
				m < t.length;
				m += 1
			)
				if (
					((a = t.charAt(m)),
					Object.prototype.hasOwnProperty.call(s, a) ||
						((s[a] = f++), (c[a] = !0)),
					(u = l + a),
					Object.prototype.hasOwnProperty.call(s, u))
				)
					l = u;
				else {
					if (Object.prototype.hasOwnProperty.call(c, l)) {
						if (l.charCodeAt(0) < 256) {
							for (o = 0; o < p; o++)
								((g <<= 1), h == n - 1 ? ((h = 0), v.push(r(g)), (g = 0)) : h++);
							for (i = l.charCodeAt(0), o = 0; o < 8; o++)
								((g = (g << 1) | (1 & i)),
									h == n - 1 ? ((h = 0), v.push(r(g)), (g = 0)) : h++,
									(i >>= 1));
						} else {
							for (i = 1, o = 0; o < p; o++)
								((g = (g << 1) | i),
									h == n - 1 ? ((h = 0), v.push(r(g)), (g = 0)) : h++,
									(i = 0));
							for (i = l.charCodeAt(0), o = 0; o < 16; o++)
								((g = (g << 1) | (1 & i)),
									h == n - 1 ? ((h = 0), v.push(r(g)), (g = 0)) : h++,
									(i >>= 1));
						}
						(0 == --d && ((d = Math.pow(2, p)), p++), delete c[l]);
					} else
						for (i = s[l], o = 0; o < p; o++)
							((g = (g << 1) | (1 & i)),
								h == n - 1 ? ((h = 0), v.push(r(g)), (g = 0)) : h++,
								(i >>= 1));
					(0 == --d && ((d = Math.pow(2, p)), p++),
						(s[u] = f++),
						(l = String(a)));
				}
			if ("" !== l) {
				if (Object.prototype.hasOwnProperty.call(c, l)) {
					if (l.charCodeAt(0) < 256) {
						for (o = 0; o < p; o++)
							((g <<= 1), h == n - 1 ? ((h = 0), v.push(r(g)), (g = 0)) : h++);
						for (i = l.charCodeAt(0), o = 0; o < 8; o++)
							((g = (g << 1) | (1 & i)),
								h == n - 1 ? ((h = 0), v.push(r(g)), (g = 0)) : h++,
								(i >>= 1));
					} else {
						for (i = 1, o = 0; o < p; o++)
							((g = (g << 1) | i),
								h == n - 1 ? ((h = 0), v.push(r(g)), (g = 0)) : h++,
								(i = 0));
						for (i = l.charCodeAt(0), o = 0; o < 16; o++)
							((g = (g << 1) | (1 & i)),
								h == n - 1 ? ((h = 0), v.push(r(g)), (g = 0)) : h++,
								(i >>= 1));
					}
					(0 == --d && ((d = Math.pow(2, p)), p++), delete c[l]);
				} else
					for (i = s[l], o = 0; o < p; o++)
						((g = (g << 1) | (1 & i)),
							h == n - 1 ? ((h = 0), v.push(r(g)), (g = 0)) : h++,
							(i >>= 1));
				0 == --d && ((d = Math.pow(2, p)), p++);
			}
			for (i = 2, o = 0; o < p; o++)
				((g = (g << 1) | (1 & i)),
					h == n - 1 ? ((h = 0), v.push(r(g)), (g = 0)) : h++,
					(i >>= 1));
			for (;;) {
				if (((g <<= 1), h == n - 1)) {
					v.push(r(g));
					break;
				}
				h++;
			}
			return v.join("");
		}
		function Kn(r) {
			if (null == r) return "";
			if ("" == r) return null;
			for (
				var e,
					t,
					n,
					o,
					i,
					a,
					u = (r = r.replace(/ /g, "+")).length,
					s = 32,
					c = function (e) {
						var t = Un,
							e = r.charAt(e);
						if (!Vn[t]) {
							Vn[t] = {};
							for (var n = 0; n < t.length; n++) Vn[t][t.charAt(n)] = n;
						}
						return Vn[t][e];
					},
					l = [],
					d = 4,
					f = 4,
					p = 3,
					v = "",
					g = [],
					h = { val: c(0), position: s, index: 1 },
					m = 0;
				m < 3;
				m += 1
			)
				l[m] = m;
			for (t = 0, o = Math.pow(2, 2), i = 1; i != o; )
				((n = h.val & h.position),
					(h.position >>= 1),
					0 == h.position && ((h.position = s), (h.val = c(h.index++))),
					(t |= (0 < n ? 1 : 0) * i),
					(i <<= 1));
			switch (t) {
				case 0:
					for (t = 0, o = Math.pow(2, 8), i = 1; i != o; )
						((n = h.val & h.position),
							(h.position >>= 1),
							0 == h.position && ((h.position = s), (h.val = c(h.index++))),
							(t |= (0 < n ? 1 : 0) * i),
							(i <<= 1));
					a = Rn(t);
					break;
				case 1:
					for (t = 0, o = Math.pow(2, 16), i = 1; i != o; )
						((n = h.val & h.position),
							(h.position >>= 1),
							0 == h.position && ((h.position = s), (h.val = c(h.index++))),
							(t |= (0 < n ? 1 : 0) * i),
							(i <<= 1));
					a = Rn(t);
					break;
				case 2:
					return "";
			}
			for (e = l[3] = a, g.push(a); ; ) {
				if (u < h.index) return "";
				for (t = 0, o = Math.pow(2, p), i = 1; i != o; )
					((n = h.val & h.position),
						(h.position >>= 1),
						0 == h.position && ((h.position = s), (h.val = c(h.index++))),
						(t |= (0 < n ? 1 : 0) * i),
						(i <<= 1));
				switch ((a = t)) {
					case 0:
						for (t = 0, o = Math.pow(2, 8), i = 1; i != o; )
							((n = h.val & h.position),
								(h.position >>= 1),
								0 == h.position && ((h.position = s), (h.val = c(h.index++))),
								(t |= (0 < n ? 1 : 0) * i),
								(i <<= 1));
						((l[f++] = Rn(t)), (a = f - 1), d--);
						break;
					case 1:
						for (t = 0, o = Math.pow(2, 16), i = 1; i != o; )
							((n = h.val & h.position),
								(h.position >>= 1),
								0 == h.position && ((h.position = s), (h.val = c(h.index++))),
								(t |= (0 < n ? 1 : 0) * i),
								(i <<= 1));
						((l[f++] = Rn(t)), (a = f - 1), d--);
						break;
					case 2:
						return g.join("");
				}
				if ((0 == d && ((d = Math.pow(2, p)), p++), l[a])) v = l[a];
				else {
					if (a !== f) return null;
					v = e + e.charAt(0);
				}
				(g.push(v),
					(l[f++] = e + v.charAt(0)),
					(e = v),
					0 == --d && ((d = Math.pow(2, p)), p++));
			}
		}
		function Yn() {
			function r(r, o, i) {
				void 0 === i && (i = !1);
				var a = [];
				return (
					d(o).forEach(function (e) {
						var t = o[e],
							n = !s.has(e) || s.get(e) === r || i;
						t && n ? s.set(e, r) : !t && n ? s.delete(e) : a.push(e);
					}),
					0 < a.length ? a : null
				);
			}
			var i = _r(),
				a = {},
				u = null,
				o = new Map(),
				s = new Map(),
				c = [];
			return function (e, t) {
				var n = Me();
				return (
					o.set(n, e),
					t && i.register(t),
					(a = _(_({}, i.get()), a)),
					{
						getInitCookieData: function () {
							return a;
						},
						getCachedData: function () {
							return u || Cr;
						},
						setProtectionData: function (e) {
							return r(n, e);
						},
						setProtectionDataUnsafe: function (e) {
							return r(n, e, !0);
						},
						updateData: function (e) {
							return (
								(n = {}),
								(r = {}),
								d((t = e)).forEach(function (e) {
									s.has(e)
										? (n[e] = (null == u ? void 0 : u[e]) || null)
										: (r[e] = t[e]);
								}),
								(e = u || a),
								(o = _(_({}, u), r)),
								He(o, e) ||
									(i.set(o, e),
									(u = o),
									c.forEach(function (e) {
										return (0, e[1])(r);
									})),
								0 < d(n).length ? n : null
							);
							var t, n, r, o;
						},
						onUpdateData: function (e) {
							c.push([n, e]);
						},
						terminate: function () {
							var t;
							((t = n),
								(c = c.filter(function (e) {
									return e[0] !== t;
								})),
								o.delete(n));
						},
						setCookieOptions: function () {
							return null;
						},
						setCookieEnabled: function () {
							return null;
						},
						get registeredCookiesWrapper() {
							return i.wrappers;
						},
					}
				);
			};
		}
		function Fn(t) {
			return d(t)
				.filter(Pr)
				.map(function (e) {
					return Ar(e, t[e]);
				});
		}
		function Jn(e, t, n) {
			if (!(t = t && Ht(t, n))) return null;
			for (var r = [], o = {}, i = 0, a = t.patches; i < a.length; i++) {
				var u = a[i],
					s = u.action,
					c = u.with,
					u = u.item;
				u.type === e &&
					((o[u.key] = s = { action: s, data: void 0 === c ? null : c }),
					Pr(u.key)) &&
					r.push(Ar(u.key, s));
			}
			return {
				source: t.source,
				getModifier: function (e) {
					return o[e] || Or(e, r);
				},
			};
		}
		function Wn(e, t) {
			switch (e) {
				case Je:
					return !0;
				case We:
					return t === jn || t === Bn;
				case ze:
					return t === Bn;
				default:
					return !0;
			}
		}
		function zn(e) {
			switch (e) {
				case "include":
					return !0;
				case "exclude":
					return !1;
				case "obfuscate":
					return !0;
			}
		}
		function Gn(e, t) {
			return "obfuscate" === e ? t : null;
		}
		function $n(e) {
			var t;
			return !(!e || e === s || !(t = Ue()) || t.includes(e));
		}
		function Xn(e) {
			function t(e) {
				return o(function () {
					return window.localStorage.getItem(e);
				});
			}
			var n = t(e),
				r = o(function () {
					return parseInt(Le(t("_ls_ttl"))[e], 36);
				});
			return r && r <= Date.now() ? null : n;
		}
		function Zn(o) {
			var e,
				i = _({}, Rt(null == (e = v()) ? void 0 : e.migration));
			d(i).forEach(function (e) {
				var t,
					n = o.params.get(e),
					r = null == (r = i[e]) ? void 0 : r.source,
					r = (r && (null == (r = xr[r]) ? void 0 : r[e])) || [];
				n &&
					r.length &&
					((t = v()[e]), (r = Sr(r))) &&
					!t &&
					((n.readonly = !1), o.updateValues(e, r, !0), (n.readonly = !0));
			});
		}
		function Qn() {
			function n(e) {
				return Te(e, {
					path: String,
					domain: String,
					secure: Ne,
					expires: function (e) {
						return e instanceof Date ? e : Number(e);
					},
					samesite: function (e) {
						return f(e) ? e : Ne(e);
					},
				});
			}
			var r = _({}, window[Be]);
			return (
				null != r &&
					r.cookies &&
					(r.cookies = d(r.cookies).reduce(function (e, t) {
						return ((e[t] = n(r.cookies[t])), e);
					}, {})),
				null != r && r.cookieDefault && (r.cookieDefault = n(r.cookieDefault)),
				r
			);
		}
		function er(n) {
			function e(e) {
				return e || (null == (e = n.get("consent")) ? void 0 : e.DL) || null;
			}
			function r(e, t) {
				var r = Tr(t),
					o =
						null == (t = n.getConnection()) ? void 0 : t.registeredCookiesWrapper;
				o &&
					((t = d(o).map(function (e) {
						return o[e].cookieName;
					})),
					i(t, e).forEach(function (e) {
						var t = e.name,
							n = e.allowed && !r[t];
						o[t].setCookieEnabled(n, e.data || null);
					}));
			}
			var t = d(yr).reduce(function (e, t) {
					return ((e[t] = yr[t].consent), e);
				}, {}),
				i = Er({ items: t, type: "cookie", getConsent: e }),
				o = e(),
				a = (null == (t = n.get("consent")) ? void 0 : t.PA) || null;
			(n.addChangeListener("consent", function (e) {
				var t = (null == e ? void 0 : e.DL) || null,
					n = (null == e ? void 0 : e.PA) || null;
				((null == o ? void 0 : o.mode) === (null === t ? void 0 : t.mode) &&
					(null == a ? void 0 : a.mode) === (null === n ? void 0 : n.mode)) ||
					((a = n), r((o = t), e));
			}),
				r(o, n.get("consent")));
		}
		function tr(n) {
			function t(o) {
				var i,
					e,
					t = It(o, n.get("purposes"));
				t &&
					o &&
					((i = !1),
					(e = d(t).reduce(function (n, e) {
						var r = t[e].mode;
						return (
							t[e].products.forEach(function (e) {
								var t;
								r !== Fe &&
									r !== (null == (t = o[e]) ? void 0 : t.mode) &&
									(lt(r, e)
										? a[e] || ((a[e] = !0), Nr(e, r, 1))
										: ((n[e] = { mode: r }), (i = !0), Nr(e, r, 2)));
							}),
							n
						);
					}, {})),
					i) &&
					n.updateValues({ consent: e });
			}
			var r = null,
				a = {};
			(n.addChangeListener("consent", function (e) {
				h() &&
					(r && (clearTimeout(r), (r = null)),
					(r = setTimeout(function () {
						(t(e), (r = null));
					}, 200)));
			}),
				h() && t(n.get("consent")));
		}
		(Cn = Cn || {}).URI = "URI";
		var nr,
			rr,
			or,
			ir,
			ar,
			ur,
			E,
			sr,
			S,
			x,
			cr,
			lr,
			I,
			M,
			dr,
			fr,
			pr,
			vr,
			gr,
			hr = { URI: { prefix: "{u}", compress: qn, decompress: Kn } },
			mr = d(hr).reduce(function (e, t) {
				return ((e[hr[t].prefix] = hr[t]), e);
			}, {}),
			Wt = {
				cookieName: "_pctx",
				consent: Bn,
				encode: function (e, t) {
					void 0 === t && (t = Cn.URI);
					((e = JSON.stringify(e)), (e = hr[t].compress(e)));
					return hr[t].prefix + e;
				},
				decode: function (e) {
					e = ((e) => {
						var t = e.slice(0, 3),
							e = e.slice(3);
						if (!mr[t]) return null;
						if (!(t = mr[t].decompress(e))) return null;
						try {
							return JSON.parse(t);
						} catch (e) {
							return null;
						}
					})(e || "");
					return Ie(e) ? e : null;
				},
			},
			yr = {
				_pprv: bn(
					"_pprv",
					Bn,
					!!(
						null == (zt = null == (zt = v().cookies) ? void 0 : zt._pprv) ||
						!zt.jsonOnly
					),
				),
				_pcid: bn("_pcid", jn),
				_pcus: bn("_pcus", Hn, !0),
				_pctx: Wt,
			},
			Gt = d((nr = yr)).reduce(function (e, t) {
				return ((e[t] = wn(nr[t])), e);
			}, {}),
			_r = function () {
				var a = null,
					u = null;
				return {
					register: function (e) {
						return (
							(a = _(_({}, e.fields), a)),
							(u = _(_({}, e.cookieByName), u))
						);
					},
					get wrappers() {
						return u;
					},
					get: function () {
						var t = {};
						return (
							u &&
								d(u).forEach(function (e) {
									t = _(_({}, t), u[e].get());
								}),
							t
						);
					},
					set: function (r, o) {
						void 0 === o && (o = null);
						var i = {};
						(d(r).forEach(function (e) {
							var t = r[e],
								n = null == a ? void 0 : a[e];
							n &&
								(i[n] ||
									(i[n] = {
										wrapper: null == u ? void 0 : u[n],
										data: {},
										update: !1,
										remove: !0,
									}),
								(i[n].data[e] = t),
								(i[n].remove = i[n].remove && null === t),
								(o && (i[n].update || t === o[e])) || (i[n].update = !0));
						}),
							d(i).forEach(function (e) {
								var t = i[e],
									n = t.wrapper,
									r = t.update,
									t = t.remove;
								(t && n.remove(), r && !t && n.set(i[e].data));
							}));
					},
				};
			},
			br = "__pctx_connection__",
			wr = "uvm42pas28m",
			Cr = {},
			kr =
				(void 0 === rr && (rr = !1),
				function (e, t) {
					var n = Yn();
					try {
						Object.defineProperty(window, br, {
							configurable: rr,
							set: function (e) {
								var t = e();
								t === wr ? e(n) : "mrlqf5trgho" === t && (n = Yn());
							},
						});
					} catch (e) {}
					return (
						(window[br] = function (e) {
							return (e && (n = e), wr);
						}),
						n(e, t)
					);
				}),
			Pr = function (e) {
				return e.includes("*");
			},
			Ar = function (e, t) {
				return [new RegExp("^" + e.replace(/\*/g, ".*") + "$"), t];
			},
			Or = function (e, t) {
				for (var n = 0, r = t; n < r.length; n++) {
					var o = r[n];
					if (o[0].test(e)) return o[1];
				}
				return null;
			},
			Er = function (c) {
				function l(e) {
					return t[e] || Or(e, n) || Hn;
				}
				var d = c.product || null,
					t = Object.assign({}, c.items),
					n = Fn(t);
				return function (e, t) {
					var r,
						o,
						n,
						i = v().requireConsent,
						a = !p(e),
						u = a ? [e] : e,
						e = (n = t || c.getConsent())
							? n.mode === Ge
								? (r = Jn(c.type, n.modifier, c.log))
									? ((o = r.source),
										u.map(function (e) {
											var t = r.getModifier(e),
												n = Gn(
													null == t ? void 0 : t.action,
													null == t ? void 0 : t.data,
												),
												t = {
													name: e,
													allowed:
														null != t && t.action ? zn(t.action) : Wn(o, l(e)),
												};
											return (null !== n && (t.data = n), t);
										}))
									: s()
								: u.map(function (e) {
										return { name: e, allowed: Wn(n.mode, l(e)) };
									})
							: s();
					function s() {
						return u.map(function (e) {
							return { name: e, allowed: !i || $n(d) };
						});
					}
					return a ? e[0] : e;
				};
			},
			$t = Object.freeze({
				__proto__: null,
				createCheckConsentWrapper: Er,
				createMask: Ar,
				getByMask: Or,
				isMask: Pr,
				itemsToMask: Fn,
			}),
			Sr =
				((or = {
					pa_vid: function (e) {
						return Pt(Le(e || "", !0) || e);
					},
					atuserid: function (e) {
						return Pt((null == (e = Le(e || "", !0)) ? void 0 : e.val) || "");
					},
				}),
				function (e) {
					for (var t = 0, n = e; t < n.length; t++) {
						var r = ((e) => {
							try {
								var t = e.ls
									? Xn(e.ls) || null
									: ((n = m.get(e)), or[e] && n ? or[e](n) : n);
								if (t) return { value: t };
							} catch (e) {}
							var n;
						})(n[t]);
						if ("object" === c(r)) return r.value;
					}
					return null;
				}),
			xr = { PA: { browserId: ["pa_vid", "atuserid"] } },
			Dr = (ut = "@@Data-layer/") + "update_value",
			Ir = ut + "refresh_value",
			Mr = function (e) {
				var t = v(),
					n = (null == (n = t.consent) ? void 0 : n.products) || [],
					n = 1 === n.length && "PA" === n[0],
					e =
						"opt-out" ===
						(null == (e = null == e ? void 0 : e.PA) ? void 0 : e.mode);
				return !!t.requireConsent && n && e;
			},
			Tr = function (e) {
				e = Mr(e);
				return { _pprv: !v().requireConsent, _pctx: e, _pcid: e, _pcus: e };
			},
			Nr = function (e, t, n) {
				n = 1 === n ? "can not be" : "was";
				console.warn(
					'[DL]: Consent v2: the "'.concat(
						e,
						'" has a conflicted consent mode, ',
					) + "mode ".concat(n, ' changed to "').concat(t, '"'),
				);
			},
			T =
				((ar = function (e) {
					(er(e), Zn(e), tr(e));
				}),
				(xn = xn = Gt),
				(sr = {
					fields: d((ur = ir = Re)).reduce(function (e, t) {
						var n = ur[t].cookieName;
						return (null !== n && (e[t] = n), e);
					}, {}),
					cookieByName: xn,
				}),
				(S = kr("data-layer", sr)),
				(x = !1),
				(cr = new Map()),
				(lr = new Set()),
				(I = new Map()),
				(M = function () {
					if (S) return S;
					throw new Error("DataLayer can't be connected");
				}),
				(dr = function (e) {
					var t = M().registeredCookiesWrapper;
					t && e(t);
				}),
				(fr = function (e) {
					dr(function (t) {
						e.forEach(function (e) {
							e = t[e];
							e && e.lazyActive();
						});
					});
				}),
				(pr = function () {
					function t(r) {
						return d(o).reduce(function (e, t) {
							var n = o[t];
							return (void 0 !== n[r] && (e[t] = n[r]), e);
						}, {});
					}
					var o = {};
					return {
						add: function (e, t) {
							o[e] = t;
						},
						call: function () {
							var e;
							((e = t("protect")),
								0 < d(e).length && M().setProtectionData(e),
								(e = t("protectUnsafe")),
								0 < d(e).length && M().setProtectionDataUnsafe(e));
						},
					};
				}),
				(vr = function (o, i) {
					return d(o).reduce(function (e, t) {
						var n = I.get(t),
							r = o[t];
						return (n && (e[t] = i ? i(n, r) : n.get(r)), e);
					}, {});
				}),
				(gr = function (e, t, n) {
					void 0 === n && (n = !1);
					var r,
						i = e,
						a = ye(),
						u = (f(e) && (((r = {})[e] = t), (i = r)), pr()),
						s = pr(),
						i = d(i).reduce(function (e, t) {
							var n = i[t],
								r = I.get(t),
								o = t;
							return (
								(null != r && r.readonly) ||
									(r && r.cookieName && a.add(r.cookieName),
									r &&
										n !== E[t] &&
										(n === Ir
											? ((e[t] = r.refresh(E[t], function (e) {
													s.add(o, e);
												})),
												e[t] !== E[t] && u.add(o, { protectUnsafe: !1 }))
											: (e[t] =
													n === Dr
														? r.update(E[t], function (e) {
																s.add(o, e);
															})
														: r.set(n, E[t], function (e) {
																s.add(o, e);
															})))),
								e
							);
						}, {}),
						e = (fr(a.values()), u.call(), M().updateData(i));
					return (
						e &&
							n &&
							((t = d(e).reduce(function (e, t) {
								return _(_({}, e), (((e = {})[t] = !1), e));
							}, {})),
							M().setProtectionDataUnsafe(t),
							M().updateData(i)),
						s.call(),
						e && vr(e)
					);
				}),
				{
					init: function (e) {
						var a, u, o, i, s, c;
						(void 0 === e && (e = {}),
							x ||
								((S = S || kr("data-layer", sr)),
								(a = _(_({}, e), Qn())),
								(u = a.cookieDefault),
								dr(function (i) {
									d(i).forEach(function (e) {
										var t,
											n,
											r = i[e].cookieName,
											o = null == (o = a.cookies) ? void 0 : o[r],
											r =
												"fixed" ===
												(null == (r = a.cookies) ? void 0 : r.storageMode);
										(null != (n = (t = i[e]).setFixedMode) && n.call(t, r),
											(u || o) && i[e].setCookieOptions(_(_({}, u), o)));
									});
								}),
								(x = !0),
								d(ir).forEach(function (e) {
									var t = ir[e];
									(cr.set(e, new Set()), I.set(e, t));
								}),
								(o = !1),
								(i = M().getInitCookieData()),
								(s = M().getCachedData()),
								(c = pr()),
								(e = d(ir).reduce(function (e, t) {
									var n = t,
										r = ir[t];
									return (
										(e[t] =
											(null == s ? void 0 : s[n]) ||
											r.init(null == i ? void 0 : i[n], function (e) {
												c.add(n, e);
											})),
										(null != s && s[n]) || (o = !0),
										e
									);
								}, {})),
								(E = e),
								o && M().updateData(e),
								c.call(),
								M().onUpdateData(Hr),
								null != ar && ar(jr())));
					},
					set: Rr,
					get: Br,
					update: function (e) {
						return Ur(e);
					},
					refresh: function () {
						var n, e;
						return (
							!M().setProtectionData(
								(((e = {})["@@Data-layer/refresh_locked_key"] = !0), e),
							) &&
							((n = []),
							I.forEach(function (e, t) {
								return n.push(t);
							}),
							(e = n.reduce(function (e, t) {
								return ((e[t] = Ir), e);
							}, {})),
							gr(e),
							!0)
						);
					},
					protect: function (e, t) {
						return Vr(e, t);
					},
					addChangeListener: qr,
					removeChangeListener: function (t) {
						(lr.delete(t),
							cr.forEach(function (e) {
								return e.delete(t);
							}));
					},
					terminate: function () {
						(null != S && S.terminate(),
							cr.clear(),
							lr.clear(),
							(S = null),
							(x = !1),
							(E = {}));
					},
					updateMigration: function () {
						x && Zn(jr());
					},
					get isReady() {
						return x;
					},
					utils: {
						validateModifier: Ht,
						validateConsent: Ot,
						checkConsent: $t,
						setConsent: function (e, t, n) {
							if ((Br("consent"), (e = kt(Br("purposes"), 0, e, t, n)))) {
								if (e.error) return e.error;
								Rr({ consent: e.consent, purposes: e.purposes });
							}
							return null;
						},
						getConsent: function () {
							var e = Br(["consent", "purposes"]),
								t = e.consent;
							return It(t, e.purposes);
						},
						notAcquiredConsent: h()
							? d(rt).reduce(function (e, t) {
									return ((e[t] = { mode: Fe, products: rt[t] }), e);
								}, {})
							: null,
						compressLz: qn,
						decompressLz: Kn,
					},
					get cookies() {
						return Lr();
					},
					get cookieEnabled() {
						return Lr();
					},
					setUnsafe: function (e, t) {
						gr(e, t, !0);
					},
					protectUnsafe: function (e, t) {
						return Vr(e, t, !0);
					},
					updateUnsafe: function (e) {
						return Ur(e, !0);
					},
					setCookieEnabled: function (r) {
						dr(function (n) {
							var e = d(r);
							e.length
								? e.forEach(function (e) {
										var t = n[e];
										t && t.setCookieEnabled(r[e]);
									})
								: d(n).forEach(function (e) {
										n[e].setCookieEnabled(r);
									});
						});
					},
				});
		function Lr() {
			var e = null;
			return (
				dr(function (o) {
					e = d(o).reduce(function (e, t) {
						var n = o[t].cookieEnabled,
							r = o[t].fixedAt || null;
						return (
							(e[o[t].cookieName] = n ? { enabled: n, fixedAt: r } : null),
							e
						);
					}, {});
				}),
				e
			);
		}
		function jr() {
			return {
				params: I,
				getConnection: M,
				addChangeListener: qr,
				get: Br,
				updateValues: gr,
			};
		}
		function Hr(r) {
			var o = !1;
			(d(r).forEach(function (e) {
				var t,
					n = I.get(e);
				n &&
					((t = r[e]), E[e] !== t) &&
					((E[e] = t), (o = !0), null != (e = cr.get(e))) &&
					e.forEach(function (e) {
						return e(n.get(t));
					});
			}),
				o &&
					lr.forEach(function (e) {
						return e(vr(E));
					}));
		}
		function Br(e) {
			var n = ye(),
				t = f(e),
				r =
					void 0 === e
						? E
						: t
							? (((r = {})[e] = E[e]), r)
							: e.reduce(function (e, t) {
									return (I.has(t) && (e[t] = E[t]), e);
								}, {});
			return (
				(r = vr(r, function (e, t) {
					return (e.cookieName && n.add(e.cookieName), e.get(t));
				})),
				fr(n.values()),
				t ? r[e] : r
			);
		}
		function Rr(e, t) {
			return gr(e, t, !1);
		}
		function Ur(e, t) {
			void 0 === t && (t = !1);
			var n = e;
			return (
				p(e) || (n = [e]),
				gr(
					n.reduce(function (e, t) {
						return ((e[t] = Dr), e);
					}, {}),
					void 0,
					t,
				)
			);
		}
		function Vr(e, t, n) {
			var r,
				n = (n = void 0 === n ? !1 : n)
					? M().setProtectionDataUnsafe
					: M().setProtectionData,
				o = e;
			return (f(e) && (((r = {})[e] = t), (o = r)), n(o));
		}
		function qr(e, t) {
			var n;
			f(e) ? null != (n = cr.get(e)) && n.add(t) : lr.add(e);
		}
		var Kr = "pageview_id",
			Yr = null,
			Fr = !1,
			Jr = [
				["createdAt", "content_publication_date"],
				["modifiedAt", "content_update_date"],
				["tags", "tags_array"],
			];
		function Wr(n) {
			var e,
				r = T.get("content");
			for (e in r)
				((t) => {
					var e;
					Object.prototype.hasOwnProperty.call(r, t) &&
						((e = (e = Jr.find(function (e) {
							return e[0] === t;
						}))
							? e[1]
							: "content_"
									.concat(t)
									.replace(/[\w]([A-Z])/g, function (e) {
										return e[0] + "_" + e[1];
									})
									.toLowerCase()),
						n.addEventsProperty(e, r[t]));
				})(e);
		}
		function zr(e, t) {
			var n = [
				{ metric: "brands", property: "ch_ua" },
				{ metric: "architecture", property: "ch_ua_arch" },
				{ metric: "bitness", property: "ch_ua_bitness" },
				{ metric: "fullVersionList", property: "ch_ua_full_version_list" },
				{ metric: "mobile", property: "ch_ua_mobile" },
				{ metric: "model", property: "ch_ua_model" },
				{ metric: "platform", property: "ch_ua_platform" },
				{ metric: "platformVersion", property: "ch_ua_platform_version" },
				{ metric: "uaFullVersion", property: "ch_ua_full_version" },
			];
			if (Gr(t))
				for (var r = 0; r < n.length; r++)
					Gr(t[n[r].metric]) &&
						e.addEventsProperty(n[r].property, t[n[r].metric]);
		}
		function Gr(e) {
			return void 0 !== e;
		}
		var $r,
			Xr = new URL(window.location.href);
		function Zr(t) {
			function e() {
				var e = window.location.href;
				((e = new URL(e)).href !== Xr.href &&
					(($r = Xr.href.split("#")[0]), (Xr = e)),
					t());
			}
			"complete" === document.readyState
				? t(!0)
				: window.addEventListener(
						"load",
						function () {
							t(!0);
						},
						{ once: !0 },
					);
			var n = window.history.pushState;
			((window.history.pushState = function () {
				(n.apply(window.history, arguments), e());
			}),
				window.addEventListener("popstate", e),
				window.addEventListener(
					"unload",
					function () {
						window.removeEventListener("popstate", e);
					},
					{ once: !0 },
				));
		}
		function Qr() {
			return (Xr =
				Xr.href !== window.location.href ? new URL(window.location.href) : Xr);
		}
		function eo(e, t, n) {
			(t.addEventsProperty("event_collection_platform", "js"),
				t.addEventsProperty(
					"event_collection_version",
					t.getConfiguration("version"),
				));
			var r,
				o = new Date(),
				i =
					(t.addEventsProperty("device_timestamp_utc", o.getTime() / 1e3),
					t.addEventsProperty("device_local_hour", o.getTime()),
					t.addEventsProperty("device_hour", o.getHours()),
					e),
				a = t,
				u = b(a.events);
			try {
				for (u.s(); !(r = u.n()).done; ) {
					var s = r.value;
					("page.display" === s.name &&
						(null === Yr && Fr && (Yr = !1),
						i.getConfiguration("enableAutomaticPageRefresh") &&
							!1 === Yr &&
							Fr &&
							T.refresh(),
						(Fr = Fr || !0)),
						i._privacy.call("isPropAllowed", Kr) &&
							a.isPropertyAbsentForEvent(Kr, s) &&
							(s.data[Kr] = T.get("pageViewId")));
				}
			} catch (e) {
				u.e(e);
			} finally {
				u.f();
			}
			Wr(t);
			try {
				var c = new Date(
					new Date(T.cookies._pcid.fixedAt[0]).setUTCSeconds(0, 0),
				).toISOString();
				t.addEventsProperty("cookie_creation_date", c);
			} catch (e) {}
			(t.addEventsProperty("has_access", T.get("userStatus")),
				t.addEventsProperty("device_screen_width", window.screen.width),
				t.addEventsProperty("device_screen_height", window.screen.height),
				t.addEventsProperty("device_display_width", to("Width")),
				t.addEventsProperty("device_display_height", to("Height")));
			var l,
				d,
				o = ((e) => {
					var t,
						n = window.navigator
							? window.navigator.language || window.navigator.userLanguage
							: "",
						r = b(e);
					try {
						for (r.s(); !(t = r.n()).done; ) {
							var o,
								i = t.value;
							if (-1 < n.indexOf(i))
								return [(o = n.split(i))[0], o.slice(1).join(i)];
						}
					} catch (e) {
						r.e(e);
					} finally {
						r.f();
					}
					return ["", ""];
				})(["-", "_"]),
				c =
					(t.addEventsProperty("browser_language", o[0]),
					t.addEventsProperty("browser_language_local", o[1]),
					t.addEventsProperty("previous_url", $r || document.referrer || ""),
					document.title &&
						t.addEventsProperty("page_title_html", document.title),
					"true" === t.getConfiguration("addEventURL").toString());
			((!c && "withoutQS" !== t.getConfiguration("addEventURL")) ||
				((o = Qr()),
				t.addEventsProperty(
					"event_url_full",
					c
						? o.href.split("#")[0]
						: "".concat(o.protocol, "//").concat(o.host).concat(o.pathname),
				)),
				(l = e),
				(d = t),
				new Promise(function (t) {
					try {
						var e;
						l.getConfiguration("allowHighEntropyClientHints")
							? window.navigator.userAgentData
									.getHighEntropyValues([
										"architecture",
										"bitness",
										"brands",
										"mobile",
										"model",
										"platform",
										"platformVersion",
										"uaFullVersion",
										"fullVersionList",
									])
									.then(function (e) {
										zr(d, e);
									})
									.finally(function () {
										t();
									})
							: ((e = {
									brands: window.navigator.userAgentData.brands,
									platform: window.navigator.userAgentData.platform,
									mobile: window.navigator.userAgentData.mobile,
								}),
								zr(d, e),
								t());
					} catch (e) {
						t();
					}
				}).finally(function () {
					w(e, t, n);
				}));
		}
		function to(e) {
			return window["inner".concat(e)] ||
				(document.documentElement && document.documentElement["client".concat(e)])
				? document.documentElement["client".concat(e)]
				: "";
		}
		function no(t, n, r) {
			function e(e) {
				w(t, n, r, e);
			}
			n.options && n.options.onBeforeBuild
				? n.options.onBeforeBuild(t, n, e)
				: e();
		}
		function ro(t, n, r) {
			function e(e) {
				w(t, n, r, e);
			}
			n.options && n.options.onBeforeSend ? n.options.onBeforeSend(t, n, e) : e();
		}
		function oo(e, t, n) {
			(e._privacy.call("filterEvents", t.events),
				e._privacy.call("filterProps", t.properties));
			for (var r = t.events, o = 0; o < r.length; o++) {
				e._privacy.call("filterProps", r[o].data, r[o].name);
				var i,
					a = e._privacy.call("getModeMetadata") || {};
				for (i in a)
					Object.prototype.hasOwnProperty.call(a, i) &&
						t.addEventsProperty(i, a[i]);
			}
			w(e, t, n);
		}
		function io(e, t, n) {
			var r,
				o = [];
			for (r in t.properties)
				if (Object.prototype.hasOwnProperty.call(t.properties, r)) {
					var i,
						a = !1,
						u = b(t.events);
					try {
						for (u.s(); !(i = u.n()).done; ) {
							var s = i.value,
								c = !1,
								l = t.properties[r].options.events;
							if (l)
								if (-1 < l.indexOf(s.name)) c = !0;
								else {
									var d,
										f = b(l);
									try {
										for (f.s(); !(d = f.n()).done; ) {
											var p = d.value;
											if (
												"*" === p.charAt(p.length - 1) &&
												0 === s.name.indexOf(p.substring(0, p.length - 1))
											) {
												c = !0;
												break;
											}
										}
									} catch (e) {
										f.e(e);
									} finally {
										f.f();
									}
								}
							else c = !0;
							c &&
								void 0 === s.data[r] &&
								((s.data[r] = t.properties[r].value), (a = !0));
						}
					} catch (e) {
						u.e(e);
					} finally {
						u.f();
					}
					a && !t.properties[r].options.persistent && o.push(r);
				}
			for (var v = 0, g = o; v < g.length; v++) delete e._properties[g[v]];
			if (!t.getConfiguration("sendEmptyProperties")) {
				var h,
					m = b(t.events);
				try {
					for (m.s(); !(h = m.n()).done; ) {
						var y,
							_ = h.value;
						for (y in _.data)
							!Object.prototype.hasOwnProperty.call(_.data, y) ||
								("" !== _.data[y] && void 0 !== _.data[y]) ||
								delete _.data[y];
					}
				} catch (e) {
					m.e(e);
				} finally {
					m.f();
				}
			}
			w(e, t, n);
		}
		function ao(e, t, n) {
			((e._privacy.call("getMode") !== e._privacy.getOptoutValue() ||
				(e._privacy.call("getMode") === e._privacy.getOptoutValue() &&
					t.getConfiguration("sendEventWhenOptout"))) &&
				0 < t.build.data.events.length &&
				F.post(t, t.build.url, JSON.stringify(t.build.data)),
				w(e, t, n));
		}
		function uo(n, r, o) {
			void 0 !== r.properties.user_id
				? w(n, r, o)
				: n.getUser(function (e) {
						var t;
						(null !== e &&
							(r.addEventsProperty("user_id", e.id, (t = { persistent: !0 })),
							r.addEventsProperty("user_category", e.category, t),
							r.addEventsProperty("user_recognition", !0, t)),
							w(n, r, o));
					});
		}
		function so(n, r, o) {
			n._storage.getItem(r.getConfiguration("storageVisitor"), function (e) {
				var t;
				(r.getConfiguration("isVisitorClientSide") &&
					((r.visitorId = n._visitorId.value || T.get("browserId")),
					n._privacy.isLegacyPrivacy ||
						"opt-out" !== n.consent.getMode() ||
						(r.visitorId = "OPT-OUT"),
					(t =
						"OPT-OUT" !== r.visitorId &&
						"no-consent" !== r.visitorId &&
						"no-storage" !== r.visitorId &&
						r.visitorId !== n._visitorId.value),
					r.visitorId !== T.get("browserId")) &&
					t &&
					(r.visitorId = r.visitorId + "-NO"),
					w(n, r, o));
			});
		}
		var co = function (o) {
			((this.setItem = function (e, t, n, r) {
				((e = ""
					.concat(e, "=")
					.concat(
						o.getConfiguration("encodeStorageBase64")
							? J.base64.encode(JSON.stringify(t))
							: encodeURIComponent(JSON.stringify(t)),
					)),
					(e =
						(e =
							(e =
								(e =
									(e += ";path=".concat(o.getConfiguration("cookiePath"))) +
									";domain=".concat(o.getConfiguration("cookieDomain"))) +
								(o.getConfiguration("cookieSecure") ? ";secure" : "")) +
							";samesite=".concat(o.getConfiguration("cookieSameSite"))) +
						(n ? ";expires=".concat(n.toUTCString()) : "")));
				((document.cookie = e), r && r());
			}),
				(this.getItem = function (t, e) {
					var n = null,
						t =
							new RegExp("(?:^| )".concat(t, "=([^;]+)")).exec(document.cookie) ||
							null;
					if (t)
						try {
							n = JSON.parse(decodeURIComponent(t[1]));
						} catch (e) {
							n = JSON.parse(J.base64.decode(t[1]));
						}
					e && e(n);
				}),
				(this.deleteItem = function (e, t) {
					var n = new Date();
					(n.setTime(n.getTime() - 1e3), this.setItem(e, "", n, t));
				}));
		};
		function lo(o) {
			var i = o.getConfiguration("storageUser");
			((o.setUser = function (e, t, n) {
				var r = { id: e, category: t };
				(o.setProperties(
					{ user_id: e, user_category: t, user_recognition: !1 },
					{ persistent: !0 },
				),
					!1 !== n &&
						((e = new Date()).setTime(
							e.getTime() +
								24 * o.getConfiguration("storageLifetimeUser") * 60 * 60 * 1e3,
						),
						o._privacy.call("setItem", i, r, e)));
			}),
				(o.getUser = function (n) {
					o._storage.getItem(i, function (e) {
						var t = e;
						(!e &&
							o._properties.user_id &&
							(t = {
								id: o._properties.user_id.value,
								category: o._properties.user_category.value,
							}),
							n && n(t));
					});
				}),
				(o.deleteUser = function (e) {
					(o.deleteProperty("user_id"),
						o.deleteProperty("user_category"),
						o.deleteProperty("user_recognition"),
						o._storage.deleteItem(i, function () {
							e && e();
						}));
				}));
		}
		function fo(n, e, t, r) {
			var o,
				i = t ? null : n,
				a = e || [],
				u = !1,
				s = !1,
				c = !1;
			if (0 < a.length) {
				for (var l = 0; l < a.length; l++) d(a[l], i);
				f();
			}
			function d(e, t) {
				try {
					(function e(t, n, r, o) {
						var i = t[n[0]];
						return (
							void 0 === i ||
							(1 === n.length ? (i.apply(o || t, r), !1) : e(i, n.slice(1), r, o))
						);
					})(n, e[0].split("."), e.slice(1), t)
						? (s = !0)
						: (u = !0);
				} catch (e) {
					s = !0;
				}
			}
			function f() {
				s &&
					u &&
					!c &&
					(console.error(
						"Piano Analytics SDK - window.".concat(
							r,
							' is used for Piano Analytics integration and somewhere else. Please check "queueVarName" configuration if needed.',
						),
					),
					(c = !0));
			}
			t &&
				((o = window[r].push.bind(window[r])),
				(window[r].push = function (e) {
					(d(e), f(), o(e));
				}));
		}
		function po(C) {
			function k() {
				((this.debugError = {
					trigger: "AvInsights:Media:setContentValues:Error",
					level: "ERROR",
					messageObject: "Not an object",
				}),
					(this.processHeartbeatValue = function (e, t) {
						e = parseInt(e, 10);
						return e ? Math.max(e, t) : 0;
					}),
					(this.value2Number = function (e) {
						var t = 0;
						return (isNaN(Number(e)) || (t = Number(e)), Math.max(t, 0));
					}));
			}
			var P = {
					minHeartbeat: C.getConfiguration("minHeartbeat"),
					minBufferingHeartbeat: C.getConfiguration("minBufferingHeartbeat"),
				},
				A = "_ATVALUE",
				O = "_ATPREFIX";
			function E(e) {
				var e =
						e.length < 2 || ":" !== e[1]
							? ((t = ""), e)
							: e.length < 4 || ":" !== e[3]
								? ((t = e.substring(0, 1)), e.substring(2, e.length))
								: ((t = e.substring(0, 3)), e.substring(4, e.length)),
					t = t.toLowerCase();
				return { prefix: t, key: (e = e.toLowerCase()) };
			}
			function S(e) {
				return null !== e && "object" === c(e) && !(e instanceof Array);
			}
			function x(e, t, n, r) {
				var o,
					i,
					a,
					u = "",
					s = "",
					c = "",
					l = 0;
				for (a in e)
					if (Object.prototype.hasOwnProperty.call(e, a))
						if (
							((u = (o = E(a)).prefix || r || ""),
							(s = (t ? t + "_" : "") + o.key),
							S(e[a]))
						)
							x(e[a], s, n, u);
						else {
							for (i = s.split("_"), c = "", l = 0; l < i.length; l++)
								((u = (o = E(i[l])).prefix || u),
									(c += o.key + (l < i.length - 1 ? "_" : "")));
							((n[(s = c || s)] = n[s] || {}), (n[s][A] = e[a]), (n[s][O] = u));
						}
			}
			((C.avInsights = {}),
				(C.avInsights.Media = function (e, t, n) {
					function r() {
						((p.previousCursorPosition = 0),
							(p.currentCursorPosition = 0),
							(p.eventDuration = 0),
							(p.previousEvent = ""),
							(p.sessionId = W.v4()));
					}
					function o(e) {
						e
							? (p.delayBufferingConfiguration = D(
									p.delayBufferingConfigurationBackup,
								))
							: (p.delayConfiguration = D(p.delayConfigurationBackup));
					}
					function i(e, t) {
						if (t) {
							m(e);
							var n,
								r = {};
							for (n in (S(t)
								? (r = t)
								: isNaN(t)
									? (r = JSON.parse(t))
									: (r[0] = t),
							r))
								Object.prototype.hasOwnProperty.call(r, n) &&
									(e
										? p.delayBufferingConfiguration.push({
												delay: f.processHeartbeatValue(n, 0),
												number: 0,
												timeout: -1,
												refresh: f.processHeartbeatValue(
													r[n],
													P.minBufferingHeartbeat,
												),
											})
										: p.delayConfiguration.push({
												delay: f.processHeartbeatValue(n, 0),
												number: 0,
												timeout: -1,
												refresh: f.processHeartbeatValue(r[n], P.minHeartbeat),
											}));
							(y(e), h(e));
						}
					}
					function a(e, t, n, r) {
						var o = D(g),
							t =
								((o.av_session_id = {}),
								(o.av_session_id[A] = p.sessionId),
								(o.av_session_id[O] = ""),
								t && (b(o), (p.previousEvent = e)),
								S(r) && x(r, null, o, null),
								w(o));
						C.sendEvent(e, t, n);
					}
					function u() {
						var e = this,
							t = 0,
							n = 0;
						((e.getEventDuration = function () {
							var e = new Date().getTime() - t - n;
							return ((n += e), e);
						}),
							(e.initBaseTime = function () {
								0 === t && (t = new Date().getTime());
							}),
							(e.resetProperties = function () {
								n = t = 0;
							}),
							(e.initHeartbeatTimer = function (e, t) {
								var n = t ? p.delayBufferingConfiguration : p.delayConfiguration;
								0 < n.length &&
									0 < n[0].refresh &&
									(_(t),
									clearTimeout(n[0].timeout),
									(n[0].timeout = setTimeout(function () {
										(0 === n[0].number && n.splice(0, 1), e && e());
									}, 1e3 * n[0].refresh)));
							}),
							(e.stopHeartbeatTimer = function (e) {
								for (
									var t = e
											? p.delayBufferingConfiguration
											: p.delayConfiguration,
										n = 0;
									n < t.length;
									n++
								)
									(clearTimeout(t[n].timeout), (t[n].timeout = -1));
							}));
					}
					function s(e, t, n, r, o) {
						(v.initBaseTime(),
							(p.eventDuration = v.getEventDuration()),
							(p.previousCursorPosition = p.currentCursorPosition),
							(p.currentCursorPosition = e
								? p.previousCursorPosition +
									Math.floor(p.playbackSpeed * p.eventDuration)
								: n),
							t &&
								0 < p.delayConfiguration[0].refresh &&
								v.initHeartbeatTimer(function () {
									s(!0, !0);
								}, !1),
							a("av.heartbeat", !0, r, o));
					}
					function c(e, t, n) {
						(v.initBaseTime(),
							(p.eventDuration = v.getEventDuration()),
							e &&
								0 < p.delayBufferingConfiguration[0].refresh &&
								v.initHeartbeatTimer(function () {
									c(!0);
								}, !0),
							a("av.buffer.heartbeat", !0, t, n));
					}
					function l(e, t, n) {
						(v.initBaseTime(),
							(p.eventDuration = v.getEventDuration()),
							(p.previousCursorPosition = p.currentCursorPosition),
							e &&
								0 < p.delayBufferingConfiguration[0].refresh &&
								v.initHeartbeatTimer(function () {
									l(!0);
								}, !0),
							a("av.rebuffer.heartbeat", !0, t, n));
					}
					var d = this,
						f = new k(),
						p = null,
						v = null,
						g = null,
						h = function (e) {
							e
								? (p.delayBufferingConfigurationBackup = D(
										p.delayBufferingConfiguration,
									))
								: (p.delayConfigurationBackup = D(p.delayConfiguration));
						},
						m = function (e) {
							e
								? ((p.delayBufferingConfiguration = []),
									(p.delayBufferingConfigurationBackup = []))
								: ((p.delayConfiguration = []),
									(p.delayConfigurationBackup = []));
						},
						y = function (e) {
							(e ? p.delayBufferingConfiguration : p.delayConfiguration).sort(
								function (e, t) {
									return e.delay < t.delay ? -1 : t.delay < e.delay ? 1 : 0;
								},
							);
						},
						_ = function (e) {
							var t,
								e = e ? p.delayBufferingConfiguration : p.delayConfiguration;
							void 0 === (t = void 0 !== e[1] ? e[1].delay : t)
								? (e[0].number = 1)
								: 0 < e[0].number
									? e[0].number--
									: "number" == typeof t &&
										(e[0].number =
											Math.floor((60 * (t - e[0].delay)) / e[0].refresh) - 1);
						},
						b = function (e) {
							((e.av_previous_position = {}),
								(e.av_previous_position[A] = p.previousCursorPosition),
								(e.av_previous_position[O] = ""),
								(e.av_position = {}),
								(e.av_position[A] = p.currentCursorPosition),
								(e.av_position[O] = ""),
								(e.av_duration = {}),
								(e.av_duration[A] = p.eventDuration),
								(e.av_duration[O] = ""),
								(e.av_previous_event = {}),
								(e.av_previous_event[A] = p.previousEvent),
								(e.av_previous_event[O] = ""));
						},
						w = function (e) {
							var t,
								n = {};
							for (t in e)
								Object.prototype.hasOwnProperty.call(e, t) &&
									(Object.prototype.hasOwnProperty.call(e[t], A)
										? (n[e[t][O] ? "".concat(e[t][O], ":").concat(t) : t] =
												e[t][A])
										: (n[t] = e[t]));
							return n;
						};
					((d.set = function (e, t) {
						e = E(e);
						((g[e.key] = g[e.key] || {}),
							(g[e.key][A] = t),
							(g[e.key][O] = e.prefix));
					}),
						(d.get = function (e) {
							var t = null,
								e = E(e);
							return (t = void 0 !== g[e.key] ? g[e.key][A] : t);
						}),
						(d.del = function (e) {
							e = E(e);
							void 0 !== g[e.key] && delete g[e.key];
						}),
						(d.setProps = function (e) {
							S(e) && x(e, null, g, null);
						}),
						(d.getProps = function () {
							var e,
								t = null;
							for (e in g)
								Object.prototype.hasOwnProperty.call(g, e) &&
									((t = t || {})[e] = g[e][A]);
							return t;
						}),
						(d.delProps = function () {
							g = {};
						}));
					((d.setPlaybackSpeed = function (e) {
						e = f.value2Number(e) || p.playbackSpeed;
						e !== p.playbackSpeed &&
							(v.stopHeartbeatTimer(!1),
							p.isPlaying &&
								(s(!0, !1),
								v.initHeartbeatTimer(function () {
									s(!0, !0);
								}, !1)),
							(p.playbackSpeed = e));
					}),
						(d.getSessionID = function () {
							return p.sessionId;
						}),
						(d.track = function (e, t, n, r) {
							var o = t || {};
							switch (e) {
								case "av.heartbeat":
									d.heartbeat(o.av_position, n, r);
									break;
								case "av.buffer.heartbeat":
									d.bufferHeartbeat(n, r);
									break;
								case "av.rebuffer.heartbeat":
									d.rebufferHeartbeat(n, r);
									break;
								case "av.play":
									d.play(o.av_position, n, r);
									break;
								case "av.buffer.start":
									d.bufferStart(o.av_position, n, r);
									break;
								case "av.start":
									d.playbackStart(o.av_position, n, r);
									break;
								case "av.resume":
									d.playbackResumed(o.av_position, n, r);
									break;
								case "av.pause":
									d.playbackPaused(o.av_position, n, r);
									break;
								case "av.stop":
									d.playbackStopped(o.av_position, n, r);
									break;
								case "av.backward":
									d.seekBackward(o.av_previous_position, o.av_position, n, r);
									break;
								case "av.forward":
									d.seekForward(o.av_previous_position, o.av_position, n, r);
									break;
								case "av.seek.start":
									d.seekStart(o.av_previous_position, n, r);
									break;
								case "av.error":
									d.error(o.av_player_error, n, r);
									break;
								default:
									a(e, !1, n, r);
							}
						}),
						(d.heartbeat = function (e, t, n) {
							var r,
								o = !0;
							(null != e && 0 <= e && ((o = !1), (r = f.value2Number(e))),
								s(o, !1, r, t, n));
						}),
						(d.bufferHeartbeat = function (e, t) {
							c(!1, e, t);
						}),
						(d.rebufferHeartbeat = function (e, t) {
							l(!1, e, t);
						}),
						(d.play = function (e, t, n) {
							v.initBaseTime();
							e = f.value2Number(e);
							((p.eventDuration = 0),
								(p.previousCursorPosition = e),
								(p.currentCursorPosition = e),
								(p.isPlaying = !1),
								(p.isPlaybackActivated = !1),
								v.stopHeartbeatTimer(!1),
								v.stopHeartbeatTimer(!0),
								a("av.play", !0, t, n));
						}),
						(d.bufferStart = function (e, t, n) {
							v.initBaseTime();
							e = f.value2Number(e);
							((p.eventDuration = v.getEventDuration()),
								(p.previousCursorPosition = p.currentCursorPosition),
								(p.currentCursorPosition = e),
								v.stopHeartbeatTimer(!1),
								v.stopHeartbeatTimer(!0),
								p.isPlaybackActivated
									? (v.initHeartbeatTimer(function () {
											l(!0);
										}, !0),
										a("av.rebuffer.start", !0, t, n))
									: (v.initHeartbeatTimer(function () {
											c(!0);
										}, !0),
										a("av.buffer.start", !0, t, n)));
						}),
						(d.playbackStart = function (e, t, n) {
							v.initBaseTime();
							e = f.value2Number(e);
							((p.eventDuration = v.getEventDuration()),
								(p.previousCursorPosition = e),
								(p.currentCursorPosition = e),
								(p.isPlaying = !0),
								(p.isPlaybackActivated = !0),
								v.stopHeartbeatTimer(!1),
								v.stopHeartbeatTimer(!0),
								v.initHeartbeatTimer(function () {
									s(!0, !0);
								}, !1),
								a("av.start", !0, t, n));
						}),
						(d.playbackResumed = function (e, t, n) {
							v.initBaseTime();
							e = f.value2Number(e);
							((p.eventDuration = v.getEventDuration()),
								(p.previousCursorPosition = p.currentCursorPosition),
								(p.currentCursorPosition = e),
								(p.isPlaying = !0),
								(p.isPlaybackActivated = !0),
								v.stopHeartbeatTimer(!1),
								v.stopHeartbeatTimer(!0),
								v.initHeartbeatTimer(function () {
									s(!0, !0);
								}, !1),
								a("av.resume", !0, t, n));
						}),
						(d.playbackPaused = function (e, t, n) {
							v.initBaseTime();
							e = f.value2Number(e);
							((p.eventDuration = v.getEventDuration()),
								(p.previousCursorPosition = p.currentCursorPosition),
								(p.currentCursorPosition = e),
								(p.isPlaying = !1),
								(p.isPlaybackActivated = !0),
								v.stopHeartbeatTimer(!1),
								v.stopHeartbeatTimer(!0),
								a("av.pause", !0, t, n));
						}),
						(d.playbackStopped = function (e, t, n) {
							v.initBaseTime();
							e = f.value2Number(e);
							((p.eventDuration = v.getEventDuration()),
								(p.previousCursorPosition = p.currentCursorPosition),
								(p.currentCursorPosition = e),
								(p.isPlaying = !1),
								(p.isPlaybackActivated = !1),
								v.stopHeartbeatTimer(!1),
								v.stopHeartbeatTimer(!0),
								v.resetProperties(),
								o(!1),
								o(!0),
								a("av.stop", !0, t, n),
								r());
						}),
						(d.playbackKill = function () {
							(v.initBaseTime(),
								(p.isPlaying = !1),
								(p.isPlaybackActivated = !1),
								v.stopHeartbeatTimer(!1),
								v.stopHeartbeatTimer(!0),
								v.resetProperties(),
								o(!1),
								o(!0),
								r());
						}),
						(d.seek = function (e, t, n, r) {
							((e = f.value2Number(e)), (t = f.value2Number(t)));
							t < e ? d.seekBackward(e, t, n, r) : d.seekForward(e, t, n, r);
						}),
						(d.seekBackward = function (e, t, n, r) {
							(d.seekStart(e, null, r),
								(p.eventDuration = 0),
								(p.previousCursorPosition = f.value2Number(e)),
								(p.currentCursorPosition = f.value2Number(t)),
								a("av.backward", !0, n, r));
						}),
						(d.seekForward = function (e, t, n, r) {
							(d.seekStart(e, null, r),
								(p.eventDuration = 0),
								(p.previousCursorPosition = f.value2Number(e)),
								(p.currentCursorPosition = f.value2Number(t)),
								a("av.forward", !0, n, r));
						}),
						(d.seekStart = function (e, t, n) {
							e = f.value2Number(e);
							((p.previousCursorPosition = p.currentCursorPosition),
								(p.currentCursorPosition = e),
								p.isPlaying
									? (p.eventDuration = v.getEventDuration())
									: (p.eventDuration = 0),
								a("av.seek.start", !0, t, n));
						}),
						(d.adClick = function (e, t) {
							a("av.ad.click", !1, e, t);
						}),
						(d.adSkip = function (e, t) {
							a("av.ad.skip", !1, e, t);
						}),
						(d.error = function (e, t, n) {
							var r = {};
							(((r = S(n) ? n : r).av_player_error = String(e)),
								a("av.error", !1, t, r));
						}),
						(d.display = function (e, t) {
							a("av.display", !1, e, t);
						}),
						(d.close = function (e, t) {
							a("av.close", !1, e, t);
						}),
						(d.volume = function (e, t) {
							a("av.volume", !1, e, t);
						}),
						(d.subtitleOn = function (e, t) {
							a("av.subtitle.on", !1, e, t);
						}),
						(d.subtitleOff = function (e, t) {
							a("av.subtitle.off", !1, e, t);
						}),
						(d.fullscreenOn = function (e, t) {
							a("av.fullscreen.on", !1, e, t);
						}),
						(d.fullscreenOff = function (e, t) {
							a("av.fullscreen.off", !1, e, t);
						}),
						(d.quality = function (e, t) {
							a("av.quality", !1, e, t);
						}),
						(d.speed = function (e, t) {
							a("av.speed", !1, e, t);
						}),
						i(
							!(p = {
								previousCursorPosition: 0,
								currentCursorPosition: 0,
								eventDuration: 0,
								playbackSpeed: 1,
								previousEvent: "",
								isPlaybackActivated: !(d.share = function (e, t) {
									a("av.share", !1, e, t);
								}),
								isPlaying: !1,
								sessionId: "",
								delayConfiguration: [],
								delayConfigurationBackup: [],
								delayBufferingConfiguration: [],
								delayBufferingConfigurationBackup: [],
							}),
							e,
						),
						i(!0, t),
						(p.sessionId = n || W.v4()),
						(v = new u()),
						(e = window),
						(t = "pagehide"),
						(n = function () {
							(v.stopHeartbeatTimer(!1), v.stopHeartbeatTimer(!0));
						}),
						e.addEventListener
							? e.addEventListener(t, n, !1)
							: e.attachEvent && e.attachEvent("on" + t, n),
						(g = {}));
				}));
		}
		function vo(n) {
			((this.value = null),
				(n.getVisitorId = function (e) {
					var t = ((e, t) => (t && t(e), e))(this.value || T.get("browserId"), e);
					if (void 0 === e) return t;
				}.bind(this)),
				(n.setVisitorId = function (e) {
					this.value = e;
					var t = new Date();
					(t.setTime(
						t.getTime() +
							24 * n.getConfiguration("storageLifetimeVisitor") * 60 * 60 * 1e3,
					),
						n._privacy.call(
							"setItem",
							n.getConfiguration("storageVisitor"),
							e,
							t,
							function () {
								T.updateMigration();
							},
						));
				}.bind(this)));
		}
		function go(o) {
			function n(e, t, n, r) {
				return ((n = s(t[n].events[e], r)), (t = s(t["*"].events[e], r)), n || t);
			}
			function r(e, t, n, r, o) {
				var i,
					o = o
						? ((i = c(t[n].properties, e, r, o)), c(t["*"].properties, e, r, o))
						: ((i = l(t[n].properties, e, r)), l(t["*"].properties, e, r));
				return i || o;
			}
			function i(e, t, n, r) {
				return (
					(n = d(t[n].storage, e, r)),
					(t = d(t["*"].storage, e, r)),
					n || t
				);
			}
			var a = o.getConfiguration("privacy"),
				u =
					((this.currentMode = ""),
					(this.modes = a.modes),
					(this._storageKeys = Object.assign(a.legacyKeys, a.storageKeys)),
					(this.init = function () {
						o._privacy.isLegacyPrivacy &&
							((window._pac = window._pac || { privacy: [] }),
							fo(this, window._pac.privacy),
							o._storage.getItem(
								a.storageKey,
								function (e) {
									this.setMode(
										e && this.modes[e]
											? e
											: o.getConfiguration("privacyDefaultMode"),
									);
								}.bind(this),
							));
					}),
					(this.setMode = function (t) {
						t !== this.currentMode &&
							this.modes[t] &&
							((this.currentMode = t),
							o._storage.getItem(
								a.storageKey,
								function (e) {
									("optout" === t || "no-consent" === t || "no-storage" === t
										? (o._visitorId.value = this.modes[t].visitorId)
										: ("OPT-OUT" !== o._visitorId.value &&
												"no-consent" !== o._visitorId.value &&
												"no-storage" !== o._visitorId.value) ||
											(o._visitorId.value = null),
										this.filterProps(o._properties),
										this.filterKeys(),
										e !== t &&
											((e = new Date()).setTime(
												e.getTime() +
													24 *
														o.getConfiguration("storageLifetimePrivacy") *
														60 *
														60 *
														1e3,
											),
											this.setItem(a.storageKey, t, e)));
								}.bind(this),
							));
					}),
					(this.createMode = function (e, t) {
						var n;
						this.modes[e] ||
							(((n = D(this.modes.exempt)).name = e),
							(n.properties.include.visitor_privacy_mode = e),
							(n.properties.include.visitor_privacy_consent = t),
							(this.modes[e] = n));
					}),
					(this.getMode = function () {
						return this.currentMode;
					}),
					function (e, t, n, r, o, i) {
						var a = ["*"],
							u = ["*"],
							s = "properties",
							c = r ? "forbidden" : "allowed";
						(t && (a = "string" == typeof t ? [t] : t),
							n && (u = "string" == typeof n ? [n] : n),
							o && (s = "storage"),
							i && (s = "events"));
						for (var l = 0; l < a.length; l++)
							if (void 0 !== this.modes[a[l]])
								for (var d = this.modes[a[l]], f = 0; f < u.length; f++) {
									var p = d[s][c];
									void 0 !== p[u[f]] || o || i || (p[u[f]] = {});
									for (var v = 0; v < e.length; v++)
										o || i ? (p[e[v]] = !0) : (p[u[f]][e[v]] = !0);
								}
					}.bind(this)),
				s =
					((this.include = {
						properties: function (e, t, n) {
							u(e, t, n);
						},
						property: function (e, t, n) {
							u([e], t, n);
						},
						storageKeys: function (e, t) {
							u(e, t, null, !1, !0);
						},
						storageKey: function (e, t) {
							u([e], t, null, !1, !0);
						},
						events: function (e, t) {
							u(e, t, null, !1, !1, !0);
						},
						event: function (e, t) {
							u([e], t, null, !1, !1, !0);
						},
					}),
					(this.exclude = {
						properties: function (e, t, n) {
							u(e, t, n, !0);
						},
						property: function (e, t, n) {
							u([e], t, n, !0);
						},
						storageKeys: function (e, t) {
							u(e, t, null, !0, !0);
						},
						storageKey: function (e, t) {
							u([e], t, null, !0, !0);
						},
						events: function (e, t) {
							u(e, t, null, !0, !1, !0);
						},
						event: function (e, t) {
							u([e], t, null, !0, !1, !0);
						},
					}),
					function (e, t) {
						if (e[t]) return !0;
						for (var n in e)
							if (
								Object.prototype.hasOwnProperty.call(e, n) &&
								"*" === n.charAt(n.length - 1) &&
								0 === t.indexOf(n.substring(0, n.length - 1))
							)
								return !0;
						return !1;
					}),
				c =
					((this.isEventAllowed = function (e) {
						var t = n("forbidden", this.modes, this.currentMode, e),
							e = n("allowed", this.modes, this.currentMode, e);
						return !t && e;
					}),
					function (e, t, n, r) {
						var o,
							i = e[t];
						if ((i[r] && i[r][n]) || i["*"][n]) return !0;
						for (o in i)
							if (
								(Object.prototype.hasOwnProperty.call(i, o) &&
									"*" === o.charAt(o.length - 1) &&
									0 === r.indexOf(o.substring(0, o.length - 1))) ||
								o === r
							)
								for (var a in i[o])
									if (
										Object.prototype.hasOwnProperty.call(i[o], a) &&
										(("*" === a.charAt(a.length - 1) &&
											0 === n.indexOf(a.substring(0, a.length - 1))) ||
											n === a)
									)
										return !0;
						return !1;
					}),
				l = function (e, t, n) {
					if ("forbidden" === t && e[t]["*"][n]) return !0;
					for (var r in e[t])
						if (Object.prototype.hasOwnProperty.call(e[t], r)) {
							if (e[t][r][n]) return !0;
							for (var o in e[t][r])
								if (
									"*" === o.charAt(o.length - 1) &&
									0 === n.indexOf(o.substring(0, o.length - 1))
								)
									return !0;
						}
					return !1;
				},
				d =
					((this.isPropAllowed = function (e, t) {
						var n = r("forbidden", this.modes, this.currentMode, e, t),
							e = r("allowed", this.modes, this.currentMode, e, t);
						return !n && e;
					}),
					function (e, t, n) {
						var r,
							o = e[t];
						if (o[n]) return !0;
						for (r in o)
							if (
								Object.prototype.hasOwnProperty.call(o, r) &&
								"*" === r.charAt(r.length - 1) &&
								0 === n.indexOf(r.substring(0, r.length - 1))
							)
								return !0;
						return !1;
					});
			((this.isKeyAllowed = function (e) {
				var t = i("forbidden", this.modes, this.currentMode, e),
					e = i("allowed", this.modes, this.currentMode, e);
				return !t && e;
			}),
				(this.setItem = function (e, t, n, r) {
					this.isKeyAllowed(e) ? o._storage.setItem(e, t, n, r) : r && r();
				}),
				(this.filterProps = function (e, t) {
					for (var n in e)
						Object.prototype.hasOwnProperty.call(e, n) &&
							!this.isPropAllowed(n, t || void 0) &&
							delete e[n];
				}),
				(this.filterKeys = function () {
					for (var e in this._storageKeys)
						Object.prototype.hasOwnProperty.call(this._storageKeys, e) &&
							!this.isKeyAllowed(e) &&
							o._storage.deleteItem(e);
				}),
				(this.filterEvents = function (e) {
					for (var t = e.length - 1; 0 <= t; t--)
						this.isEventAllowed(e[t].name) || e.splice(t, 1);
				}),
				(this.getModeMetadata = function () {
					return this.modes[this.getMode()].properties.include;
				}),
				this.init());
		}
		function ho(o, e, t) {
			function n(e) {
				null != (e = i(wo(t.dataLayer, t.items, o.getNames), e)) &&
					e.forEach(function (e) {
						e.allowed ? e.data && o.set(e.name, e.data) : o.remove(e.name);
					});
			}
			var r = yo(t),
				i = bo(t.dataLayer, {
					items: t.items,
					type: e,
					getConsent: r,
					product: t.productName,
				});
			return (
				(e = void 0 === t.checkConsentOnInit && t.enableAutoRemove),
				t.enableAutoRemove && _o(t, n),
				e && n(r()),
				Object.assign({}, o, {
					set: function (e, t, n) {
						var r = i(e);
						null != r &&
							r.allowed &&
							((r = null != (r = r.data) ? r : t),
							o.set.apply(null, n ? [e, r, n] : [e, r]));
					},
					check: i,
				})
			);
		}
		function mo(e, t) {
			return {
				check: bo(t.dataLayer, {
					items: t.items,
					type: e,
					getConsent: yo(t),
					product: t.productName,
				}),
			};
		}
		var yo = function (t) {
				return function () {
					var e = t.dataLayer.get("consent");
					return (e && e[t.productName]) || null;
				};
			},
			_o = function (t, n) {
				function e(e) {
					(e = (null == e ? void 0 : e[t.productName]) || null) !== r &&
						n((r = e));
				}
				var r = null;
				return (
					t.dataLayer.addChangeListener("consent", e),
					function () {
						t.dataLayer.removeChangeListener(e);
					}
				);
			},
			bo = function (e, t) {
				return e.utils.checkConsent.createCheckConsentWrapper(t);
			},
			wo = function (e, t, n) {
				var r = e.utils.checkConsent,
					o = r.itemsToMask(t),
					i = Object.keys(t).filter(function (e) {
						return !r.isMask(e);
					});
				return n().filter(function (e) {
					return i.includes(e) || r.getByMask(e, o);
				});
			},
			Co = {
				createLocalStorage: function (e) {
					((t = e.dataLayer),
						(o = ve.__protected__.ttlName),
						(r = bo((t = { dataLayer: t, productName: "DL" }).dataLayer, {
							items: (((n = {})[o] = "mandatory"), n),
							type: "localStorage",
							getConsent: yo(t),
							product: t.productName,
						})),
						(i = function () {
							var e = r(o);
							return e.allowed && !e.data;
						}),
						(a = !0),
						_o(t, s),
						s());
					var t,
						n,
						r,
						o,
						i,
						a,
						u = function () {
							return a;
						};
					function s() {
						(a = i()) || ve.remove(o);
					}
					var c = ho(ve, "localStorage", e);
					return Object.assign({}, c, {
						set: function (e, t, n) {
							var r = n;
							return (
								null != n &&
									n.expires &&
									!u() &&
									delete (r = Object.assign({}, n)).expires,
								c.set(e, t, r)
							);
						},
					});
				},
				createProperty: function (e) {
					return mo("property", e);
				},
				createCookie: function (a) {
					function e(e) {
						null != (e = i(wo(a.dataLayer, l, m.getNames), e)) &&
							e.forEach(function (e) {
								function t() {
									return s[e.name] || u.getByMask(e.name, c) || r;
								}
								e.allowed
									? e.data && m.set(e.name, e.data, t())
									: m.remove(e.name, t());
							});
					}
					var t,
						u = a.dataLayer.utils.checkConsent,
						n = yo(a),
						s = {},
						c = [],
						l = {},
						r = {},
						i =
							(Object.keys(a.items).forEach(function (e) {
								var t,
									n,
									r,
									o,
									i = a.items[e];
								i.type
									? ((t = i.type),
										(n = i.domain),
										(r = i.path),
										(o = {}),
										(l[e] = t),
										n && (o.domain = n),
										r && (o.path = r),
										u.isMask(e) ? c.push(u.createMask(e, o)) : (s[e] = o))
									: (l[e] = i);
							}),
							bo(a.dataLayer, {
								items: l,
								type: "cookie",
								getConsent: n,
								product: a.productName,
							}));
					((t = !(void 0 !== a.checkConsentOnInit || !a.enableAutoRemove)),
						a.enableAutoRemove && ((r = a.enableAutoRemove), _o(a, e)),
						t && e(n()));
					return Object.assign({}, m, {
						check: i,
						set: function (e, t, n, r) {
							var o = i(e);
							null != o &&
								o.allowed &&
								m.set(e, null != (e = o.data) ? e : t, n, r);
						},
					});
				},
				createSessionStorage: function (e) {
					return ho(Se, "sessionStorage", e);
				},
				createEvent: function (e) {
					return mo("event", e);
				},
			},
			ko = {
				cookieItems: {
					"*": "optional",
					pa_vid: "mandatory",
					pa_privacy: "mandatory",
					atuserid: "essential",
				},
				eventItems: {
					"click.exit": "mandatory",
					"click.navigation": "mandatory",
					"click.download": "mandatory",
					"click.action": "mandatory",
					"page.display": "mandatory",
				},
				propertyItems: {
					"*": "optional",
					connection_type: "mandatory",
					device_timestamp_utc: "mandatory",
					visitor_privacy_consent: "mandatory",
					visitor_privacy_mode: "mandatory",
					ch_ua: "mandatory",
					ch_ua_arch: "mandatory",
					ch_ua_bitness: "mandatory",
					ch_ua_full_version: "mandatory",
					ch_ua_full_version_list: "mandatory",
					ch_ua_mobile: "mandatory",
					ch_ua_model: "mandatory",
					ch_ua_platform: "mandatory",
					ch_ua_platform_version: "mandatory",
					app_crash: "essential",
					app_crash_class: "essential",
					app_crash_screen: "essential",
					app_version: "essential",
					browser: "essential",
					browser_cookie_acceptance: "essential",
					browser_group: "essential",
					browser_version: "essential",
					click: "essential",
					click_chapter1: "essential",
					click_chapter2: "essential",
					click_chapter3: "essential",
					click_full_name: "essential",
					connection_monitor: "essential",
					connection_organisation: "essential",
					cookie_creation_date: "essential",
					date: "essential",
					date_day: "essential",
					date_daynumber: "essential",
					date_month: "essential",
					date_monthnumber: "essential",
					date_week: "essential",
					date_year: "essential",
					date_yearofweek: "essential",
					device_brand: "essential",
					device_display_height: "essential",
					device_display_width: "essential",
					device_name: "essential",
					device_name_tech: "essential",
					device_screen_diagonal: "essential",
					device_screen_height: "essential",
					device_screen_width: "essential",
					device_type: "essential",
					event_collection_platform: "essential",
					event_collection_version: "essential",
					event_hour: "essential",
					event_id: "essential",
					event_minute: "essential",
					event_position: "essential",
					event_second: "essential",
					event_time: "essential",
					event_time_utc: "essential",
					event_url: "essential",
					event_url_domain: "essential",
					event_url_full: "essential",
					exclusion_cause: "essential",
					exclusion_type: "essential",
					geo_city: "essential",
					geo_continent: "essential",
					geo_country: "essential",
					geo_metro: "essential",
					geo_region: "essential",
					goal_type: "essential",
					hit_time_utc: "essential",
					os: "essential",
					os_group: "essential",
					os_version: "essential",
					os_version_name: "essential",
					page: "essential",
					page_chapter1: "essential",
					page_chapter2: "essential",
					page_chapter3: "essential",
					page_duration: "essential",
					page_full_name: "essential",
					page_position: "essential",
					page_title_html: "essential",
					page_url: "essential",
					pageview_id: "essential",
					previous_url: "essential",
					privacy_status: "essential",
					site: "essential",
					site_env: "essential",
					site_id: "essential",
					site_platform: "essential",
					src: "essential",
					src_detail: "essential",
					src_direct_access: "essential",
					src_organic: "essential",
					src_organic_detail: "essential",
					src_portal_domain: "essential",
					src_portal_site: "essential",
					src_portal_site_id: "essential",
					src_portal_url: "essential",
					src_referrer_site_domain: "essential",
					src_referrer_site_url: "essential",
					src_referrer_url: "essential",
					src_se: "essential",
					src_se_category: "essential",
					src_se_country: "essential",
					src_type: "essential",
					src_url: "essential",
					src_url_domain: "essential",
					src_webmail: "essential",
				},
			};
		function Po(e, t) {
			var n;
			return (
				(n = t),
				window.pdl &&
					window.pdl.consent_items &&
					window.pdl.consent_items.PA &&
					window.pdl.consent_items.PA[n] &&
					Object.assign(e, window.pdl.consent_items.PA[t]),
				e
			);
		}
		function Ao(o) {
			function r() {
				return "v2" === window.pdl.requireConsent;
			}
			var n = o.getConfiguration("consentDefaultMode") || "opt-in";
			((this.storageKeys = ["pa_vid", "pa_user", "pa_privacy", "atuserid"]),
				(this.propertyConsent = {}),
				(this.eventConsent = {}),
				(this.storageConsent = {}),
				(this.consentItems = {
					propertyItems: {},
					eventItems: {},
					cookieItems: {},
				}),
				(this.modeMetadata = {
					"opt-in": {
						visitor_privacy_consent: !0,
						visitor_privacy_mode: "optin",
					},
					"opt-out": {
						visitor_privacy_consent: !1,
						visitor_privacy_mode:
							!0 === o.getConfiguration("enableExtendedOptout")
								? "extended-optout"
								: "optout",
					},
					essential: {
						visitor_privacy_consent: !1,
						visitor_privacy_mode: "exempt",
					},
					custom: { visitor_privacy_consent: !1, visitor_privacy_mode: "custom" },
				}));
			((this.isPAConsentDisabled = function () {
				var e = T.get("consent");
				return !(e && e.PA);
			}),
				(this.init = function () {
					((this.consentItems = {
						propertyItems: Po(ko.propertyItems, "properties"),
						eventItems: Po(ko.eventItems, "events"),
						cookieItems: Po(ko.cookieItems, "storages"),
					}),
						(this.propertyConsent = Co.createProperty({
							dataLayer: T,
							productName: "PA",
							items: this.consentItems.propertyItems,
						})),
						(this.eventConsent = Co.createEvent({
							dataLayer: T,
							productName: "PA",
							items: this.consentItems.eventItems,
						})),
						(this.storageConsent = Co.createCookie({
							dataLayer: T,
							productName: "PA",
							items: this.consentItems.cookieItems,
						})),
						o._privacy.isLegacyPrivacy || (this.initMode(), this.filterKeys()));
				}),
				(this.initMode = function () {
					null === T.get("consent") &&
						(window.pdl.consent && window.pdl.consent.defaultPreset
							? T.set("consent", 0)
							: this.setMode(n));
				}),
				(this.setMode = function (e) {
					(T.set("consent", { PA: { mode: e } }), this.filterKeys());
				}),
				(this.setPresets = function (e) {
					(T.set("consent", e), this.filterKeys());
				}),
				(this.getMode = function () {
					var e = n,
						t = T.get("consent");
					return (e = t && t.PA && t.PA.mode ? T.get("consent").PA.mode : e);
				}),
				(this.setCustomModeMetadata = function (e, t) {
					((this.modeMetadata.custom.visitor_privacy_mode = t || "custom"),
						(this.modeMetadata.custom.visitor_privacy_consent = e));
				}),
				(this.setAllPurposes = function (e) {
					if (r()) return T.utils.setConsent(e);
				}),
				(this.setByPurpose = function (e, t, n) {
					r() && T.utils.setConsent(e, t, n);
				}),
				(this.getByPurpose = function () {
					return T.utils.getConsent();
				}),
				(this.getModeMetadata = function () {
					return this.modeMetadata[this.getMode()] || {};
				}),
				(this.getConsentItems = function () {
					return this.consentItems;
				}),
				(this.isPropAllowed = function (e) {
					return (
						!!(
							this.isPAConsentDisabled() ||
							(!0 === o.getConfiguration("enableExtendedOptout") &&
								"opt-out" === this.getMode())
						) || this.propertyConsent.check(e).allowed
					);
				}.bind(this)),
				(this.isEventAllowed = function (e) {
					return (
						!!(
							this.isPAConsentDisabled() ||
							(!0 === o.getConfiguration("enableExtendedOptout") &&
								"opt-out" === this.getMode())
						) || this.eventConsent.check(e).allowed
					);
				}.bind(this)),
				(this.isKeyAllowed = function (e) {
					return (
						!!this.isPAConsentDisabled() || this.storageConsent.check(e).allowed
					);
				}.bind(this)),
				(this.filterProps = function (e) {
					for (var t in e)
						Object.prototype.hasOwnProperty.call(e, t) &&
							!this.isPropAllowed(t) &&
							delete e[t];
				}),
				(this.filterEvents = function (e) {
					for (var t = e.length - 1; 0 <= t; t--)
						this.isEventAllowed(e[t].name) || e.splice(t, 1);
				}),
				(this.filterKeys = function () {
					var e,
						t = b(this.storageKeys);
					try {
						for (t.s(); !(e = t.n()).done; ) {
							var n = e.value;
							this.isKeyAllowed(n) || o._storage.deleteItem(n);
						}
					} catch (e) {
						t.e(e);
					} finally {
						t.f();
					}
				}),
				(this.setItem = function (e, t, n, r) {
					this.isKeyAllowed(e) ? o._storage.setItem(e, t, n, r) : r && r();
				}),
				(this.dl = T),
				this.init());
		}
		var Oo = {
			migration: { browserId: { source: "PA" } },
			cookies: { storageMode: "fixed" },
		};
		function Eo(i) {
			((this.isLegacyPrivacy = !0),
				(this.getOptoutValue = function () {
					return this.isLegacyPrivacy ? "optout" : "opt-out";
				}),
				(this.call = function (e) {
					for (
						var t = this.isLegacyPrivacy ? "privacy" : "consent",
							n = arguments.length,
							r = new Array(1 < n ? n - 1 : 0),
							o = 1;
						o < n;
						o++
					)
						r[o - 1] = arguments[o];
					return i[t][e].apply(i[t], r);
				}));
		}
		function So(e, t) {
			t &&
				((e._privacy.isLegacyPrivacy = !1),
				(window.pdl.requireConsent = "v2"),
				(window.pdl.consent = { products: ["PA"] }));
		}
		var xo = new URL(window.location.href),
			Do = { all: 0, queryString: 1, path: 2 };
		function Io(t) {
			for (
				var n = z("", Qr(), ""),
					e = 0,
					r = ["q", "s", "search", "query", "keyword"];
				e < r.length;
				e++
			) {
				var o,
					i,
					a = r[e];
				for (i in n)
					if (
						(o = ((e) => {
							if (
								Object.prototype.hasOwnProperty.call(n, e) &&
								a === e &&
								"" !== n[e]
							)
								return (
									setTimeout(function () {
										t.sendEvent("internal_search_result.display", {
											event_collection_auto: !0,
											ise_keyword: n[e],
										});
									}, 100),
									{ v: void 0 }
								);
						})(i))
					)
						return o.v;
			}
		}
		var Mo,
			To =
				/\.(pdf|xlsx?|docx?|txt|rtf|csv|exe|key|pp(s|t|tx)|7z|pkg|rar|gz|zip|avi|mov|mp4|mpe?g|wmv|midi?|mp3|wav|wma)(\?.+)?$/;
		function No() {
			(Array.from(document.getElementsByTagName("a")).forEach(Lo),
				new MutationObserver(function (e) {
					e.forEach(function (e) {
						e.addedNodes.forEach(function (e) {
							("A" === e.nodeName && Lo(e),
								"function" == typeof e.querySelectorAll &&
									Array.from(e.querySelectorAll("a")).map(Lo));
						});
					});
				}).observe(document.body, { subtree: !0, childList: !0 }));
		}
		function Lo(e) {
			if (To.test(e.href)) {
				var t;
				try {
					t = new URL(e.href, window.location.href);
				} catch (e) {
					return;
				}
				e.addEventListener("click", function () {
					Mo.sendEvent("click.download", {
						event_collection_auto: !0,
						click: t.pathname,
						click_chapter1: e.text,
					});
				});
			}
		}
		var N = !1;
		function jo(e) {
			var t = e.getConfiguration("instantTracking");
			if (
				(!1 !== e.getConfiguration("instantTracking") &&
					Zr(
						function (e) {
							N = this.getConfiguration("instantTracking");
							e = ((e, t) => {
								var n;
								return (
									!!e ||
									((e = Qr()),
									(t =
										Do[
											t && "string" == typeof t.urlDetection
												? t.urlDetection
												: "all"
										] || 0),
									(n = ""
										.concat(e.protocol, "//")
										.concat(e.host)
										.concat(e.pathname)
										.concat(t < 2 ? e.search : "")
										.concat(t < 1 ? e.hash : "")),
									""
										.concat(xo.protocol, "//")
										.concat(xo.host)
										.concat(xo.pathname)
										.concat(t < 2 ? xo.search : "")
										.concat(t < 1 ? xo.hash : "") !== n &&
										((xo = new URL(e.href)), !0))
								);
							})(e, N.pages);
							(!0 === N || (N && N.pages)) &&
								e &&
								((e) => {
									setTimeout(function () {
										e.sendEvent("page.display", { event_collection_auto: !0 });
									}, 100);
								})(this);
							(!0 === N || (N && !0 === N.searches)) && Io(this);
						}.bind(e),
					),
				!0 === t || (t && t.downloads))
			) {
				t = e;
				try {
					((Mo = t),
						"complete" === document.readyState
							? No()
							: window.addEventListener("load", No, { once: !0 }));
				} catch (e) {}
			}
		}
		function Ho(e, t) {
			for (var n in t)
				Object.prototype.hasOwnProperty.call(t, n) &&
					"privacy" !== n &&
					e.setConfiguration(n, t[n]);
		}
		function L(e) {
			(((t = this).cfg = new G(D(e) || H)),
				(t.setConfiguration = t.cfg.setConfiguration),
				(t.setConfigurations = t.cfg.setConfigurations),
				(t.getConfiguration = t.cfg.getConfiguration));
			var t,
				n,
				e = t;
			try {
				Ho(e, JSON.parse(document.currentScript.dataset.config));
			} catch (e) {}
			((window._pac = window._pac || { privacy: [] }),
				Ho(e, window._pac),
				(this._storage = new co(this)),
				(this._queue = new $(this)),
				(this._properties = {}),
				(this._sendEvent = Bo),
				(this._setProperty = Ro),
				(this._deleteProperty = Uo),
				(this._visitorId = new vo(this)),
				((t = this)._privacy = new Eo(t)),
				(e = t.getConfiguration("consentDefaultMode")),
				void 0 === window.pdl
					? ((window.pdl = Oo), So(t, e))
					: (window.pdl.requireConsent
							? (t._privacy.isLegacyPrivacy = !1)
							: So(t, e),
						void 0 === window.pdl.cookies
							? (window.pdl.cookies = { storageMode: "fixed" })
							: window.pdl.cookies &&
								void 0 === window.pdl.cookies.storageMode &&
								(window.pdl.cookies.storageMode = "fixed")),
				T.init({
					cookieDefault: {
						domain: t.getConfiguration("cookieDomain") || null,
						secure: t.getConfiguration("cookieSecure"),
						path: t.getConfiguration("cookiePath"),
						samesite: t.getConfiguration("cookieSameSite"),
					},
					cookies: {
						_pcid: { expires: t.getConfiguration("storageLifetimeVisitor") },
					},
				}),
				(t.privacy = new go(t)),
				(t.consent = new Ao(t)),
				(this.user = new lo(this)),
				po(this),
				(this.refresh = function () {
					(Yr = null === Yr ? !0 : Yr) && T.refresh();
				}),
				((n = this).setContentProperty = function (t, e) {
					var n = Jr.find(function (e) {
						return e[1] === t;
					});
					T.set("content", U({}, n ? n[0] : t, e));
				}),
				(n.setContentProperties = function (e) {
					for (var t in e)
						Object.prototype.hasOwnProperty.call(e, t) &&
							n.setContentProperty(t, e[t]);
				}),
				(t = (e = this).getConfiguration("queueVarName")),
				(window[t] = window[t] || []),
				fo(e, window[t], !0, t),
				jo(this));
		}
		function Bo(e, t) {
			for (
				var n = [oo, so, uo, ee, eo, io, no, Z, ro, ao], r = 0;
				r < e.length;
				r++
			) {
				var o = { name: "", data: {} };
				if ("string" == typeof e[r]) o.name = e[r];
				else {
					if (void 0 !== e[r].data) continue;
					o.name = e[r].name;
				}
				e[r] = o;
			}
			var i,
				t = { events: D(e), options: D(t) };
			0 < n.length &&
				"function" == typeof n[0] &&
				((i = new G(this.cfg.cloneData())),
				n[0](this, new X(this, t, i), n.slice(1)));
		}
		function Ro(e, t, n, r) {
			(e._privacy.call("isPropAllowed", t) &&
				(e._properties[t] = { value: n, options: r || {} }),
				e._queue.next());
		}
		function Uo(e, t) {
			(delete e._properties[t], e._queue.next());
		}
		return (
			(L.prototype.setProperty = function (e, t, n) {
				this._queue.push(["_setProperty", this, e, t, n]);
			}),
			(L.prototype.setProperties = function (e, t) {
				for (var n in e)
					Object.prototype.hasOwnProperty.call(e, n) &&
						this.setProperty(n, e[n], t);
			}),
			(L.prototype.deleteProperty = function (e) {
				this._queue.push(["_deleteProperty", this, e]);
			}),
			(L.prototype.sendEvent = function (e, t, n) {
				this._queue.push(["_sendEvent", [{ name: e, data: t }], n]);
			}),
			(L.prototype.sendEvents = function (e, t) {
				this._queue.push(["_sendEvent", e, t]);
			}),
			(O = new (L.prototype.PA = L)(H)),
			window &&
				!window[O.getConfiguration("globalVarName")] &&
				(window[O.getConfiguration("globalVarName")] = O),
			(j.pianoAnalytics = Vt = O),
			j
		);
	})({});
}

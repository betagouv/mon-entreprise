import { ExpirationPlugin } from 'workbox-expiration'
import {
	cleanupOutdatedCaches,
	createHandlerBoundToURL,
	precacheAndRoute,
} from 'workbox-precaching'
import { NavigationRoute, registerRoute, Route } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', (event) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	if (event.data && event.data.type === 'SKIP_WAITING') {
		void self.skipWaiting()
	}
})

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

// Allow work offline
registerRoute(
	new NavigationRoute(
		createHandlerBoundToURL(
			location.href.startsWith(import.meta.env.VITE_FR_BASE_URL)
				? 'mon-entreprise.html'
				: 'infrance.html'
		),
		{ denylist: [/^\/api\/.*/, /^\/twemoji\/.*/, /^\/dev\/storybook\/.*/] }
	)
)

const HOUR = 60 * 60
const DAY = HOUR * 24
const YEAR = DAY * 365

const networkFirstJS = new Route(
	({ sameOrigin, url }) => {
		return sameOrigin && /assets\/.*\.js$/.test(url.pathname)
	},
	new NetworkFirst({
		cacheName: 'js-cache',
		plugins: [
			new ExpirationPlugin({
				maxAgeSeconds: 30 * DAY,
				maxEntries: 40,
			}),
		],
		fetchOptions: {},
	})
)

registerRoute(networkFirstJS)

const staleWhileRevalidate = new Route(
	({ request, sameOrigin, url }) => {
		return (
			sameOrigin &&
			(url.pathname.startsWith('/twemoji/') || request.destination === 'image')
		)
	},
	new StaleWhileRevalidate({
		cacheName: 'images',
		plugins: [
			new ExpirationPlugin({
				maxAgeSeconds: 1 * YEAR,
				maxEntries: 150,
				purgeOnQuotaError: true,
			}),
		],
	})
)

registerRoute(staleWhileRevalidate)

const networkFirstPolyfill = new Route(
	({ sameOrigin, url }) => {
		return !sameOrigin && url.hostname === 'polyfill.io'
	},
	new NetworkFirst({
		cacheName: 'external-polyfill',
		plugins: [
			new ExpirationPlugin({
				maxAgeSeconds: 1 * YEAR,
				maxEntries: 5,
			}),
		],
	})
)

registerRoute(networkFirstPolyfill)

const networkFirstAPI = new Route(
	({ sameOrigin, url }) => {
		return (
			(!sameOrigin &&
				[
					'api.recherche-entreprises.fabrique.social.gouv.fr',
					'geo.api.gouv.fr',
				].includes(url.hostname)) ||
			(sameOrigin && /data\/.*\.json$/.test(url.pathname))
		)
	},
	new NetworkFirst({
		cacheName: 'external-api',
		plugins: [
			new ExpirationPlugin({
				maxAgeSeconds: 7 * DAY,
				maxEntries: 40,
			}),
		],
	})
)

registerRoute(networkFirstAPI)

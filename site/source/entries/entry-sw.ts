import { ExpirationPlugin } from 'workbox-expiration'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { offlineFallback } from 'workbox-recipes'
import { registerRoute, Route, setDefaultHandler } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'

declare let self: ServiceWorkerGlobalScope

const HOUR = 60 * 60
const DAY = 24 * HOUR
const YEAR = 365 * DAY
const MONTH = YEAR / 12

self.addEventListener('message', (event) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	if (event.data && event.data.type === 'SKIP_WAITING') {
		void self.skipWaiting()
	}
})

cleanupOutdatedCaches()

// Filter EN files on the FR app and vice versa
const precache = self.__WB_MANIFEST.filter(
	(entry) =>
		typeof entry !== 'string' &&
		!entry.url.includes(
			location.href.startsWith(import.meta.env.VITE_FR_BASE_URL)
				? 'infrance'
				: 'mon-entreprise'
		)
)

precacheAndRoute(precache)

// Allow work offline
offlineFallback({
	// When the user is offline and loads a page that is not cached, we return the French/English index file.
	pageFallback: location.href.startsWith(import.meta.env.VITE_FR_BASE_URL)
		? '/mon-entreprise.html'
		: '/infrance.html',
})

// Set the default handler with network first so that every requests (css, js, html, image, etc.)
// goes through the service worker and will be cache
setDefaultHandler(
	new NetworkFirst({
		cacheName: 'default-network-first',
		plugins: [
			new ExpirationPlugin({
				maxAgeSeconds: 3 * MONTH,
				maxEntries: 40,
			}),
		],
	})
)

const networkFirstJS = new Route(
	({ sameOrigin, url }) => sameOrigin && /assets\/.*\.js$/.test(url.pathname),
	new NetworkFirst({
		cacheName: 'js-cache',
		plugins: [
			new ExpirationPlugin({
				maxAgeSeconds: 1 * MONTH,
				maxEntries: 40,
			}),
		],
	})
)

registerRoute(networkFirstJS)

// const networkFirstPiano = new Route(
// 	({ url }) => url.hostname === 'tag.aticdn.net',
// 	new NetworkFirst({
// 		fetchOptions: {
// 			mode: 'cors',
// 		},
// 		cacheName: 'piano-cache',
// 		plugins: [
// 			new ExpirationPlugin({
// 				maxAgeSeconds: 1 * MONTH,
// 				maxEntries: 40,
// 			}),
// 		],
// 	})
// )

// registerRoute(networkFirstPiano)

const staleWhileRevalidate = new Route(
	({ request, sameOrigin, url }) => {
		return (
			sameOrigin &&
			(url.pathname.startsWith('/twemoji/') ||
				request.destination === 'image' ||
				request.destination === 'font')
		)
	},
	new StaleWhileRevalidate({
		cacheName: 'media',
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
				maxAgeSeconds: 3 * MONTH,
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
					'recherche-entreprises.api.gouv.fr',
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

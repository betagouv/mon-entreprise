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
		)
	)
)

// StaleWhileRevalidate runtime cache
const staleWhileRevalidate = new Route(({ request, sameOrigin, url }) => {
	return (
		sameOrigin &&
		(url.pathname.startsWith('/twemoji/') || request.destination === 'image')
	)
}, new StaleWhileRevalidate({ cacheName: 'images' }))

registerRoute(staleWhileRevalidate)

// NetworkFirst runtime cache
const networkFirst = new Route(({ sameOrigin, url }) => {
	return (
		!sameOrigin &&
		[
			'polyfill.io',
			'api.recherche-entreprises.fabrique.social.gouv.fr',
		].includes(url.hostname)
	)
}, new NetworkFirst({ cacheName: 'external' }))

registerRoute(networkFirst)

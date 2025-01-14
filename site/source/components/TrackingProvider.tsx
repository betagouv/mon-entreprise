import i18next from 'i18next'
import { useEffect, useState } from 'react'

import { TrackingContext } from '@/components/ATInternetTracking'
import {
	ATTracker,
	createTracker,
} from '@/components/ATInternetTracking/Tracker'
import * as safeLocalStorage from '@/storage/safeLocalStorage'

export function TrackingProvider({ children }: { children: React.ReactNode }) {
	const [tracker, setTracker] = useState<ATTracker | null>(null)
	const [injected, setInjected] = useState<boolean>(false)

	useEffect(() => {
		console.log('Initialisation du TrackingProvider')
		console.log('Constitution du script')
		const script = document.createElement('script')
		script.src = 'https://tag.aticdn.net/piano-analytics.js'
		script.type = 'text/javascript'
		script.crossOrigin = 'anonymous'
		script.async = true

		script.onload = () => {
			console.log('Script Piano chargé')
			const siteId = import.meta.env.VITE_AT_INTERNET_SITE_ID

			const ATTrackerClass = createTracker(
				siteId,
				safeLocalStorage.getItem('tracking:do_not_track') === '1' ||
					navigator.doNotTrack === '1'
			)

			const instance = new ATTrackerClass({
				language: i18next.language as 'fr' | 'en',
			})

			setTracker(instance)
			console.log('Tracker configuré')
		}

		script.onerror = () => {
			// eslint-disable-next-line no-console
			console.error('Failed to load Piano Analytics script')
		}

		if ('serviceWorker' in navigator) {
			console.log('En attente du service worker')
			navigator.serviceWorker.ready
				.then(() => {
					console.log("Service worker is ready, let's add the script")
					requestIdleCallback(() => {
						document.body.appendChild(script)
						setInjected(true)
					})
				})
				.catch((error) => {
					console.error(
						'Impossible d’initialiser le suivi car le service worker n’a pas démarré',
						error
					)
				})
		} else {
			console.log("No support for service worker, let's add the script")
			document.body.appendChild(script)
			setInjected(true)
		}

		return () => {
			console.log('Démontage du composant')
			if (injected) {
				document.body.removeChild(script)
			}
		}
	}, [])

	if (!tracker) {
		return <>{children}</>
	}

	return (
		<TrackingContext.Provider value={tracker}>
			{children}
		</TrackingContext.Provider>
	)
}

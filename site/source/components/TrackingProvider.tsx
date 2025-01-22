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
	const [script, setScript] = useState<HTMLScriptElement | null>(null)
	const [injected, setInjected] = useState<boolean>(false)

	useEffect(() => {
		const script = document.createElement('script')
		script.src = 'https://tag.aticdn.net/piano-analytics.js'
		script.type = 'text/javascript'
		script.crossOrigin = 'anonymous'
		script.async = true

		script.onload = () => {
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
		}

		script.onerror = () => {
			// eslint-disable-next-line no-console
			console.error('Failed to load Piano Analytics script')
		}

		setScript(script)
	}, [])

	useEffect(() => {
		if (script) {
			if (injected) {
				return () => {
					document.body.removeChild(script)
				}
			}

			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.ready
					.then(() => {
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
				document.body.appendChild(script)
				setInjected(true)
			}
		}
	}, [script, injected])

	if (!tracker) {
		return <>{children}</>
	}

	return (
		<TrackingContext.Provider value={tracker}>
			{children}
		</TrackingContext.Provider>
	)
}

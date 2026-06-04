import i18next from 'i18next'
import { useEffect, useState } from 'react'

import {
	createPianoTracker,
	PianoTracker,
} from '@/components/PianoAnalytics/PianoTracker'
import { PianoTrackerContext } from '@/components/PianoAnalytics/PianoTrackerContext'
import * as safeLocalStorage from '@/storage/safeLocalStorage'
import { scheduleWhenIdle } from '@/utils/polyfill'

export function PianoTrackerProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [tracker, setTracker] = useState<PianoTracker | null>(null)
	const [script, setScript] = useState<HTMLScriptElement | null>(null)
	const [injected, setInjected] = useState<boolean>(false)

	useEffect(() => {
		configureConsent()

		const script = prepareScript()

		script.onload = () => {
			const siteId = import.meta.env.VITE_AT_INTERNET_SITE_ID

			const PianoTrackerClass = createPianoTracker(
				siteId,
				safeLocalStorage.getItem('tracking:do_not_track') === '1' ||
					navigator.doNotTrack === '1'
			)

			const instance = new PianoTrackerClass({
				language: i18next.language as 'fr' | 'en',
			})

			setTracker(instance)
		}

		script.onerror = () => {
			// eslint-disable-next-line no-console
			console.warn('Le script Piano Analytics n’a pas pu être chargé.')
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
						scheduleWhenIdle(() => {
							document.body.appendChild(script)
							setInjected(true)
						})
					})
					.catch((error) => {
						// eslint-disable-next-line no-console
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
		<PianoTrackerContext.Provider value={tracker}>
			{children}
		</PianoTrackerContext.Provider>
	)
}

const configureConsent = () => {
	window.pdl = window.pdl || {}
	window.pdl.requireConsent = 'v2'
	window.pdl.consent = {
		defaultPreset: {
			PA: 'essential',
		},
	}
	window.pdl.consent.products = ['PA']
}

const prepareScript = (): HTMLScriptElement => {
	const script = document.createElement('script')
	script.src = 'https://tag.aticdn.net/piano-analytics.js'
	script.type = 'text/javascript'
	script.crossOrigin = 'anonymous'
	script.async = true

	return script
}

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
	createPianoTracker,
	PianoTracker,
} from '@/components/PianoAnalytics/PianoTracker'
import { PianoTrackerContext } from '@/components/PianoAnalytics/PianoTrackerContext'
import { parseLangue } from '@/locales/langue'
import { environnement } from '@/services/environnement/environnement'
import * as safeLocalStorage from '@/storage/safeLocalStorage'
import { scheduleWhenIdle } from '@/utils/polyfill'

export function PianoTrackerProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const { i18n } = useTranslation()
	const [tracker, setTracker] = useState<PianoTracker | null>(null)
	const [script, setScript] = useState<HTMLScriptElement | null>(null)
	const [injected, setInjected] = useState<boolean>(false)

	useEffect(() => {
		configureConsent()

		const script = prepareScript()

		script.onload = () => {
			const siteId = environnement.tracking.piano.siteId

			const PianoTrackerClass = createPianoTracker(
				siteId,
				safeLocalStorage.getItem('tracking:do_not_track') === '1' ||
					navigator.doNotTrack === '1'
			)

			const instance = new PianoTrackerClass({
				language: parseLangue(i18n.language),
			})

			setTracker(instance)
		}

		script.onerror = () => {
			// eslint-disable-next-line no-console
			console.warn('Le script Piano Analytics n’a pas pu être chargé.')
		}

		setScript(script)
	}, [i18n])

	useEffect(() => {
		if (!script) {
			return
		}

		if (injected) {
			return () => {
				document.body.removeChild(script)
			}
		}

		const appendScript = () => {
			document.body.appendChild(script)
			setInjected(true)
		}

		scheduleWhenIdle(appendScript)
	}, [script, injected])

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

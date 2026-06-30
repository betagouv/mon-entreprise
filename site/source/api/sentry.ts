import { CaptureConsole } from '@sentry/integrations'
import {
	BrowserTracing,
	init,
	reactRouterV6Instrumentation,
} from '@sentry/react'
import { useEffect } from 'react'
import {
	createRoutesFromChildren,
	matchRoutes,
	useLocation,
	useNavigationType,
} from 'react-router-dom'

import { environnement } from '@/services/environnement/environnement'

if (environnement.branche && environnement.déployé === 'staging') {
	// eslint-disable-next-line no-console
	console.info(
		`ℹ Vous êtes sur la branche : %c${environnement.branche}`,
		'font-weight: bold; text-decoration: underline;'
	)
}

if (!import.meta.env.SSR && environnement.déployé !== 'développement') {
	init({
		release: environnement.sentryRelease,
		dsn: 'https://d857393f4cfb40eebc0b9b54893bab23@sentry.incubateur.net/9',
		integrations: [
			new CaptureConsole({ levels: ['error'] }),
			new BrowserTracing({
				routingInstrumentation: reactRouterV6Instrumentation(
					useEffect,
					useLocation,
					useNavigationType,
					createRoutesFromChildren,
					matchRoutes
				),
			}),
		],
		normalizeDepth: 10,
		enableTracing: true,
		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 0.1,
	})
}

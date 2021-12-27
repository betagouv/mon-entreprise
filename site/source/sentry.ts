import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

let branch: string | undefined = import.meta.env.VITE_GITHUB_REF?.split(
	'/'
)?.slice(-1)?.[0]

if (branch === 'merge') {
	branch = import.meta.env.VITE_GITHUB_HEAD_REF
}

const release =
	branch && `${branch}-` + import.meta.env.VITE_GITHUB_SHA?.substring(0, 7)

if (branch && branch !== 'master') {
	// eslint-disable-next-line no-console
	console.info(
		`ℹ Vous êtes sur la branche : %c${branch}`,
		'font-weight: bold; text-decoration: underline;'
	)
}

// We use this variable to hide some features in production while keeping them
// in feature-branches. In case we do A/B testing with several branches served
// in production, we should add the public faced branch names in the test below.
// This is different from the import.meta.env.MODE in that a feature branch may
// be build in production mode (with the NODE_ENV) but we may still want to show
// or hide some features.
export const productionMode = ['master', 'next'].includes(branch ?? '')

if (productionMode) {
	Sentry.init({
		dsn: 'https://92bbc21937b24136a2fe1b1d922b000f@o548798.ingest.sentry.io/5745615',
		integrations: [new Integrations.BrowserTracing()],
		release,
		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 0.5,
	})
}

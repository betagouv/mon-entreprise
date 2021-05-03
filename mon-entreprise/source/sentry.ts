import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

let branch: string | undefined = process.env.GITHUB_REF?.split('/')?.slice(
	-1
)?.[0]

if (branch === 'merge') {
	branch = process.env.GITHUB_HEAD_REF
}

const release = branch && `${branch}-` + process.env.GITHUB_SHA?.substring(0, 7)

if (branch && branch !== 'master') {
	console.info(
		`ℹ Vous êtes sur la branche : %c${branch}`,
		'font-weight: bold; text-decoration: underline;'
	)
}
Sentry.init({
	dsn:
		'https://92bbc21937b24136a2fe1b1d922b000f@o548798.ingest.sentry.io/5745615',
	integrations: [new Integrations.BrowserTracing()],
	release,
	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 0.5,
})

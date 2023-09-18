import NodeWorker from '@eshaz/web-worker'
import { createWorkerEngineClient } from '@publicodes/worker'
import { I18nProvider } from '@react-aria/i18n'
import { withProfiler } from '@sentry/react'
import { createRoot, hydrateRoot } from 'react-dom/client'

import { Actions } from '@/worker/socialWorkerEngine.worker'

import App from '../components/App'
import i18next from '../locales/i18n'

import '../api/sentry'

const basename = 'mon-entreprise'

console.log('import.meta.env.SSR', import.meta.env, IS_DEVELOPMENT)

console.time('worker ready!')
// import.meta.env.DEV
// 	? '../worker/socialWorkerEngine.worker.ts?nodejs'
// 	:

export const worker = import.meta.env.SSR
	? // Node doesn't support web worker :( upvote issue here: https://github.com/nodejs/node/issues/43583
	  new NodeWorker(
			new URL('./worker/socialWorkerEngine.worker.js?nodejs', import.meta.url),
			{ type: 'module' }
	  )
	: new Worker(
			new URL('@/worker/socialWorkerEngine.worker.js', import.meta.url),
			{ type: 'module', name: 'SocialeWorkerEngine' }
	  )

console.log('worker', worker)

const workerClient = createWorkerEngineClient<Actions>(worker, {
	initParams: [{ basename }],
})

declare global {
	interface Window {
		PRERENDER?: boolean
	}
}

const AppFr = () => {
	return (
		<I18nProvider locale="fr-FR">
			<App basename={basename} workerClient={workerClient} />
		</I18nProvider>
	)
}

export const AppFrWithProfiler = withProfiler(AppFr)

if (!import.meta.env.SSR) {
	i18next.changeLanguage('fr').catch((err) =>
		// eslint-disable-next-line no-console
		console.error(err)
	)
	const container = document.querySelector('#js') as Element
	if (window.PRERENDER) {
		container.innerHTML = container.innerHTML.trim() // Trim before hydrating to avoid mismatche error.
		const root = hydrateRoot(container, <AppFrWithProfiler />)
		// root.render(<AppFrWithProfiler />)
		console.log('>>> hydrateRoot DONE', root)
	} else {
		const root = createRoot(container)
		root.render(<AppFrWithProfiler />)
	}
}

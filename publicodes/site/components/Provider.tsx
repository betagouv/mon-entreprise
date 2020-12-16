// TODO: This code comes from mon-entreprise.fr and could be simplified for
// publi.codes

import { createBrowserHistory } from 'history'
import React, { createContext, useMemo } from 'react'
import { Router } from 'react-router-dom'
import { ThemeColorsProvider } from './colors'

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/sw.js')
			.then((registration) => {
				// eslint-disable-next-line no-console
				console.log('SW registered: ', registration)
			})
			.catch((registrationError) => {
				// eslint-disable-next-line no-console
				console.log('SW registration failed: ', registrationError)
			})
	})
}

type SiteName = 'publicodes'

export const SiteNameContext = createContext<SiteName | null>(null)

export type ProviderProps = {
	basename: SiteName
	children: React.ReactNode
}

export default function Provider({ basename, children }: ProviderProps) {
	const history = useMemo(
		() =>
			createBrowserHistory({
				basename: process.env.NODE_ENV === 'production' ? '' : basename,
			}),
		[]
	)

	// Remove loader
	const css = document.createElement('style')
	css.type = 'text/css'
	css.innerHTML = `
#js {
	animation: appear 0.5s;
	opacity: 1;
}
#loading {
	display: none !important;
}`
	document.body.appendChild(css)

	return (
		<ThemeColorsProvider>
			<SiteNameContext.Provider value={basename}>
				<Router history={history}>
					<>{children}</>
				</Router>
			</SiteNameContext.Provider>
		</ThemeColorsProvider>
	)
}

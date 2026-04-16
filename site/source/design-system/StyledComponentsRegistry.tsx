'use client'

import { useServerInsertedHTML } from 'next/navigation'
import React, { useState } from 'react'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

/**
 * Registry pour styled-components avec Next.js App Router.
 *
 * Ce composant collecte les styles générés pendant le rendu serveur
 * et les injecte dans le HTML avant l'hydratation côté client,
 * évitant ainsi le FOUC (Flash of Unstyled Content).
 *
 * @see https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-components
 */
export default function StyledComponentsRegistry({
	children,
}: {
	children: React.ReactNode
}) {
	// N'exécuter qu'une seule fois avec lazy initial state
	// Évite de recréer la ServerStyleSheet à chaque rendu
	const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

	useServerInsertedHTML(() => {
		const styles = styledComponentsStyleSheet.getStyleElement()
		styledComponentsStyleSheet.instance.clearTag()

		return <>{styles}</>
	})

	// Côté client, pas besoin du StyleSheetManager
	// Les styles sont déjà injectés dans le DOM
	if (typeof window !== 'undefined') {
		return <>{children}</>
	}

	return (
		<StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
			{children}
		</StyleSheetManager>
	)
}

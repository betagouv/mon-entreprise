import React from 'react'
import { ScrollToTop } from 'Components/utils/Scroll'
import { Header } from './Header'
import api from '../../../../publicodes/docs/api.md'
import { MarkdownWithAnchorLinks } from 'Components/utils/markdown'

// TODO Améliorer l'affichage des blocs de code JS et les rendre executables

export default function Api() {
	return (
		<>
			<div className="app-content ui__ container" css="margin: 2rem 0">
				<ScrollToTop />
				<Header />
				<MarkdownWithAnchorLinks source={api} />
			</div>
		</>
	)
}

import { ScrollToTop } from 'Components/utils/Scroll'
import React from 'react'
import { Header } from './Header'

export default function Api() {
	// const apiSource = import('../../data/docs/classes/_engine_index_.engine.md')
	return (
		<div className="app-content ui__ container" css="margin: 2rem 0">
			<ScrollToTop />
			<Header />
			<br />
			<br />
			{/* <Markdown source={apiSource} /> */}
		</div>
	)
}

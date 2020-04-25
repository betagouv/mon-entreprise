import React from 'react'
import ContributionButton from './ContributionButton'
import DocumentationButton from './DocumentationButton'
import Suggestions from './Suggestions'

export default () => {
	return (
		<div>
			<h1 css="margin-top: 1rem; font-size: 140%; line-height: 1.2em">
				Découvre l'impact de chaque geste du quotidien !
			</h1>
			<Suggestions />
			<DocumentationButton />
			<ContributionButton />
		</div>
	)
}

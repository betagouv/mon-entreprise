import React from 'react'
import { createMarkdownDiv } from 'Engine/marked'
import { CheckItem } from 'Ui/Checklist'

export default ({ exonérations, dispatch, answers, title }) => {
	if (!exonérations) return null
	let multiple = exonérations['toutes ces conditions']
	let items = Array.isArray(multiple) ? multiple : [exonérations]

	return (
		<div
			css={`
				margin: 1em 0;
			`}>
			{items.length > 1 && <p>Respectez-vous ces conditions ? </p>}

			{items.map(({ titre, explication }, index) => (
				<CheckItem
					name={titre}
					title={titre}
					explanations={createMarkdownDiv(explication)}
					onChange={checked =>
						dispatch({
							type: 'UPDATE_ACTIVITY',
							title,
							data: {
								...answers,
								exonerations: [
									answers.exonerations.map((v, answerIndex) =>
										answerIndex === index ? checked : v
									)
								]
							}
						})
					}
				/>
			))}
		</div>
	)
}

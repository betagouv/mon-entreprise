import React from 'react'
import { createMarkdownDiv } from 'Engine/marked'
import { CheckItem } from 'Ui/Checklist'
import { update } from 'ramda'

export default ({ exonérations, dispatch, answers, title }) => {
	if (!exonérations) return null

	return (
		<div
			css={`
				margin: 1em 0;
			`}>
			{exonérations.length > 1 && <p>Respectez-vous ces conditions ? </p>}

			{exonérations.map(({ titre, explication }, index) => (
				<CheckItem
					name={titre}
					title={titre}
					explanations={createMarkdownDiv(explication)}
					onChange={checked => {
						let action = {
							type: 'UPDATE_ACTIVITY',
							title,
							data: {
								...answers,
								exonérations: update(index, checked, answers.exonérations)
							}
						}
						dispatch(action)
					}}
				/>
			))}
		</div>
	)
}

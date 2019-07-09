import { Markdown } from 'Components/utils/markdown'
import { update } from 'ramda'
import React from 'react'
import { CheckItem } from 'Ui/Checklist'

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
					explanations={<Markdown source={explication} />}
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

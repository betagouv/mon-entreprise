/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import * as Animate from './animate'
import { toPairs } from 'ramda'

type Props = {
	data: { [string]: boolean },
	onChecklistItemChange: (string, boolean) => void
}

export default ({ checklistName, title, subtitle, items, conclusion }) =>
	connect(
		state => ({
			data: state.inFranceApp[checklistName]
		}),
		{
			onChecklistItemChange: (checklist, name, value) => ({
				type: 'CHANGE_CHECKLIST_ITEM',
				checklist,
				name,
				value
			})
		}
	)(({ onChecklistItemChange, data }: Props) => (
		<Animate.fromBottom>
			<h1 className="question__title">{title}</h1>
			<p>
				{subtitle}
				This checklist will guide you thoughout all the necessary steps to
				register your company with the French administration.
			</p>
			<ul className="ui__ no-bullet">
				{toPairs(items).map(([key, content]) => (
					<li key={key}>
						<input
							type="checkbox"
							name={key}
							defaultChecked={data[key]}
							onChange={({ target }) =>
								onChecklistItemChange(target.name, target.checked)
							}
						/>
						{content}
					</li>
				))}
			</ul>
			<p>
				You can add this page to your favorite and keep track of your progress
				in the different administrative tasks.
			</p>
			{conclusion}
		</Animate.fromBottom>
	))

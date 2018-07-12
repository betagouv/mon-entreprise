/* @flow */
import { toPairs } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import * as Animate from 'Ui/animate'
import './Checklist.css'

type Props = {
	data: { [string]: boolean },
	onChecklistItemChange: (string, string, boolean) => void
}

export default ({
	name: checklistName,
	title,
	subtitle,
	items,
	conclusion
}: any) =>
	connect(
		state => ({
			data: state.inFranceApp.checklists[checklistName]
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
		<div className="checklist">
			<Animate.fromBottom>
				<h1 className="question__title">{title}</h1>
				<p>{subtitle}</p>
				<ul className="ui__ no-bullet items">
					{toPairs(items).map(([key, content]) => (
						<li key={key}>
							<input
								type="checkbox"
								name={key}
								defaultChecked={data[key]}
								onChange={({ target }) =>
									onChecklistItemChange(
										checklistName,
										target.name,
										target.checked
									)
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
		</div>
	))

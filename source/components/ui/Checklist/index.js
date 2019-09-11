/* @flow */
import classnames from 'classnames'
import { Markdown } from 'Components/utils/markdown'
import { ScrollToElement } from 'Components/utils/Scroll'
import withTracker from 'Components/utils/withTracker'
import React, { Component, useState } from 'react'
import Animate from 'Ui/animate'
import Checkbox from '../Checkbox'
import './index.css'

import type Tracker from '../../../Tracker'
import type { ChildrenArray, Node, Element } from 'react'

type CheckItemProps = {
	title: Node,
	name: string,
	explanations: Node,
	onChange?: boolean => void,
	tracker: Tracker,
	defaultChecked?: boolean
}

function CheckItemComponent({
	title,
	name,
	explanations,
	onChange,
	tracker,
	defaultChecked
}: CheckItemProps) {
	const [displayExplanations, setDisplayExplanations] = useState(false)

	const handleChecked = (e: SyntheticInputEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setDisplayExplanations(false)
		}
		onChange && onChange(e.target.checked)
		tracker.push([
			'trackEvent',
			'CheckItem',
			e.target.checked ? 'check' : 'uncheck',
			name
		])
	}

	const handleClick = () => {
		tracker.push(['trackEvent', 'CheckItem', 'click', name])
		setDisplayExplanations(!displayExplanations)
	}

	return (
		<ScrollToElement onlyIfNotVisible when={displayExplanations}>
			<div className="ui__ checkItemLabel">
				{/* TODO ACCESSIBILITY: impossible to tick the checkbox with keyboard ?  */}
				<Checkbox
					name={name}
					id={name}
					onChange={handleChecked}
					defaultChecked={defaultChecked}
				/>

				<button
					className={classnames('ui__ checklist-button', {
						opened: displayExplanations
					})}
					onClick={handleClick}>
					{title}
				</button>
			</div>
			{displayExplanations && explanations && (
				<Animate.appear>
					{typeof explanations === 'string' ? (
						<Markdown
							className="ui__ checklist-explanation"
							source={explanations}
						/>
					) : (
						explanations
					)}
				</Animate.appear>
			)}
		</ScrollToElement>
	)
}
export const CheckItem = withTracker(CheckItemComponent)

type ChecklistProps = {
	children: ChildrenArray<null | false | Element<typeof CheckItem>>,
	onItemCheck: (string, boolean) => void,
	onInitialization: (Array<string>) => void,
	defaultChecked: { [string]: boolean }
}
export class Checklist extends Component<ChecklistProps> {
	checklist: Array<Element<typeof CheckItem>>
	static defaultProps = {
		defaultChecked: {},
		onItemCheck: () => {},
		onInitialization: () => {}
	}
	constructor(props: ChecklistProps) {
		super(props)
		this.checklist = React.Children.toArray(props.children)
			.filter(Boolean)
			.map(
				// $FlowFixMe
				(child: Element<typeof CheckItem>) =>
					// $FlowFixMe
					React.cloneElement(child, {
						// $FlowFixMe
						onChange: checked => props.onItemCheck(child.props.name, checked),
						// $FlowFixMe
						defaultChecked:
							child.props.defaultChecked ||
							props.defaultChecked[child.props.name]
					})
			)
		props.onInitialization &&
			// $FlowFixMe
			props.onInitialization(this.checklist.map(child => child.props.name))
	}
	render() {
		return (
			<ul className="ui__ no-bullet checklist">
				{this.checklist.map(checkItem => (
					// $FlowFixMe
					<li key={checkItem.props.name}>{checkItem}</li>
				))}
			</ul>
		)
	}
}

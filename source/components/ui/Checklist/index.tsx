import classnames from 'classnames'
import Animate from 'Ui/animate'
import { Markdown } from 'Components/utils/markdown'
import { ScrollToElement } from 'Components/utils/Scroll'
import { TrackerContext } from 'Components/utils/withTracker'
import React, { Component, useContext, useState } from 'react'
import Checkbox from '../Checkbox'
import './index.css'

type CheckItemProps = {
	title: React.ReactNode
	name: string
	explanations?: React.ReactNode
	onChange?: (checked: boolean) => void
	defaultChecked?: boolean
}

export function CheckItem({
	title,
	name,
	explanations,
	onChange,
	defaultChecked
}: CheckItemProps) {
	const tracker = useContext(TrackerContext)
	const [displayExplanations, setDisplayExplanations] = useState(false)

	const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
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

type ChecklistProps = {
	children: React.ReactNode
	onItemCheck: (string, boolean) => void
	onInitialization: (arg: Array<string>) => void
	defaultChecked: { [key: string]: boolean }
}
export class Checklist extends Component<ChecklistProps> {
	checklist: any
	static defaultProps = {
		defaultChecked: {},
		onItemCheck: () => {},
		onInitialization: () => {}
	}
	constructor(props: ChecklistProps) {
		super(props)
		this.checklist = React.Children.toArray(props.children)
			.filter(Boolean)
			.map((child: any) =>
				React.cloneElement(child, {
					onChange: checked => props.onItemCheck(child.props.name, checked),
					defaultChecked:
						child.props.defaultChecked || props.defaultChecked[child.props.name]
				})
			)
		props.onInitialization &&
			props.onInitialization(
				this.checklist.map((child: any) => child.props.name)
			)
	}
	render() {
		return (
			<ul className="ui__ no-bullet checklist">
				{this.checklist.map((checkItem: any) => (
					<li key={checkItem.props.name}>{checkItem}</li>
				))}
			</ul>
		)
	}
}

import classnames from 'classnames'
import { Markdown } from 'Components/utils/markdown'
import { ScrollToElement } from 'Components/utils/Scroll'
import { TrackerContext } from 'Components/utils/withTracker'
import React, { useContext, useEffect, useState } from 'react'
import Animate from 'Components/ui/animate'
import Checkbox from '../Checkbox'
import './index.css'

type CheckItemProps = {
	title: React.ReactNode
	name: string
	explanations?: React.ReactNode
	onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
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
		onChange?.(e)
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
					onClick={handleClick}
				>
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

export type ChecklistProps = {
	children: React.ReactNode
	onItemCheck?: (name: string, isChecked: boolean) => void
	onInitialization?: (arg: Array<string>) => void
	defaultChecked?: { [key: string]: boolean }
}
export function Checklist({
	children,
	onItemCheck,
	onInitialization,
	defaultChecked
}: ChecklistProps) {
	const checklist = React.Children.toArray(children)
		.filter(Boolean)
		.map(child => {
			if (!React.isValidElement(child)) {
				throw new Error('Invalid child passed to Checklist')
			}
			return React.cloneElement(child, {
				onChange: (evt: React.ChangeEvent<HTMLInputElement>) =>
					onItemCheck?.(child.props.name, evt.target.checked),
				defaultChecked:
					child.props.defaultChecked || defaultChecked?.[child.props.name]
			})
		})

	useEffect(() => {
		onInitialization?.(checklist.map(child => child.props.name))
	}, [])

	return (
		<ul className="ui__ no-bullet checklist">
			{checklist.map(checkItem => (
				<li key={checkItem.props.name}>{checkItem}</li>
			))}
		</ul>
	)
}

/* @flow */
import classnames from 'classnames'
import { Markdown } from 'Components/utils/markdown'
import { ScrollToElement } from 'Components/utils/Scroll'
import withTracker from 'Components/utils/withTracker'
import React, { Component } from 'react'
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
type CheckItemState = {
	displayExplanations: boolean
}
class CheckItemComponent extends Component<CheckItemProps, CheckItemState> {
	state = {
		displayExplanations: false
	}
	handleChecked = (e: SyntheticInputEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			this.setState({ displayExplanations: false })
		}
		this.props.onChange && this.props.onChange(e.target.checked)
		this.props.tracker.push([
			'trackEvent',
			'CheckItem',
			e.target.checked ? 'check' : 'uncheck',
			this.props.name
		])
	}
	handleClick = () => {
		this.props.tracker.push([
			'trackEvent',
			'CheckItem',
			'click',
			this.props.name
		])
		this.setState(({ displayExplanations }) => ({
			displayExplanations: !displayExplanations
		}))
	}
	render() {
		return (
			<ScrollToElement onlyIfNotVisible when={this.state.displayExplanations}>
				<div className="ui__ checkItemLabel">
					{/* TODO ACCESSIBILITY: impossible to tick the checkbox with keyboard ?  */}
					<Checkbox
						name={this.props.name}
						id={this.props.name}
						onChange={this.handleChecked}
						defaultChecked={this.props.defaultChecked}
					/>

					<button
						className={classnames('ui__ checklist-button', {
							opened: this.state.displayExplanations
						})}
						onClick={this.handleClick}>
						{this.props.title}
					</button>
				</div>
				{this.state.displayExplanations && this.props.explanations && (
					<Animate.appear>
						{typeof this.props.explanations === 'string' ? (
							<Markdown
								className="ui__ checklist-explanation"
								source={this.props.explanations}
							/>
						) : (
							this.props.explanations
						)}
					</Animate.appear>
				)}
			</ScrollToElement>
		)
	}
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

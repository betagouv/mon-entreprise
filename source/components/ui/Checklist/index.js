/* @flow */
import classnames from 'classnames'
import { ScrollToElement } from 'Components/utils/Scroll'
import withTracker from 'Components/utils/withTracker'
import React, { Component } from 'react'
import Animate from 'Ui/animate'
import './index.css'
import type { Tracker } from 'Components/utils/withTracker'
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
					<input
						type="checkbox"
						className="ui__ checkbox-input"
						style={{ display: 'none' }}
						name={this.props.name}
						id={this.props.name}
						defaultChecked={this.props.defaultChecked}
						onChange={this.handleChecked}
					/>
					<label
						htmlFor={this.props.name}
						className="ui__ checkbox"
						tabIndex="0">
						<svg width="18px" height="18px" viewBox="0 0 18 18">
							<path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z" />
							<polyline points="1 9 7 14 15 4" />
						</svg>
					</label>
					<button
						className={classnames('ui__ checklist-button', {
							opened: this.state.displayExplanations
						})}
						onClick={this.handleClick}>
						{this.props.title}
					</button>
				</div>
				{this.state.displayExplanations &&
					this.props.explanations && (
						<Animate.fadeIn>
							<div className="ui__ checklist-explanation">
								{this.props.explanations}
							</div>
						</Animate.fadeIn>
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
						defaultChecked: props.defaultChecked[child.props.name]
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

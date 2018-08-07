/* @flow */
import { ScrollToElement } from 'Components/utils/Scroll'
import React, { Component } from 'react'
import Animate from 'Ui/animate'
import './index.css'
import type { ChildrenArray, Node, Element } from 'react'
type CheckItemProps = {
	title: Node,
	name: string,
	explanations: Node
}
type CheckItemState = {
	displayExplanations: boolean
}
export class CheckItem extends Component<CheckItemProps, CheckItemState> {
	state = {
		displayExplanations: false
	}
	render() {
		return (
			<>
				{this.state.displayExplanations && <ScrollToElement />}
				<input
					type="checkbox"
					className="ui__ checkbox-input"
					style={{ display: 'none' }}
					name={this.props.name}
					id={this.props.name}
				/>
				{/* TODO ACCESSIBILITY: impossible to tick the checkbox with keyboard ?  */}
				<label htmlFor={this.props.name} className="ui__ checkbox" tabIndex="0">
					<svg width="18px" height="18px" viewBox="0 0 18 18">
						<path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z" />
						<polyline points="1 9 7 14 15 4" />
					</svg>
				</label>
				<button
					className="ui__ link-button"
					onClick={() =>
						this.setState(({ displayExplanations }) => ({
							displayExplanations: !displayExplanations
						}))
					}>
					{this.props.title}
				</button>
				{this.state.displayExplanations && (
					<Animate.fadeIn>
						<div className="ui__ checklist-explanation">
							{this.props.explanations}
						</div>
					</Animate.fadeIn>
				)}
			</>
		)
	}
}

type ChecklistProps = {
	children: ChildrenArray<Element<typeof CheckItem>>
}
export const Checklist = ({ children }: ChecklistProps) => {
	return (
		<ul className="ui__ no-bullet checklist">
			{React.Children.map(children, child => (
				<li key={child.props.name}>{child}</li>
			))}
		</ul>
	)
}

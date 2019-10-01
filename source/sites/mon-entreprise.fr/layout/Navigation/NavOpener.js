/* @flow */

import classnames from 'classnames'
import withTracker from 'Components/utils/withTracker'
import { compose } from 'ramda'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import type { Tracker } from 'Components/utils/withTracker'
import type { Location } from 'react-router-dom'
import type { ChildrenArray, Node, Element } from 'react'

type OwnProps = {
	children: ChildrenArray<Element<any>>,
	to?: ?string,
	title: Node
}
type Props = OwnProps & {
	location: Location,
	tracker: Tracker
}
type State = {
	opened: boolean,
	previousLocation: Location,
	controlled: boolean
}

const containsActiveChildren = (
	children: ChildrenArray<Element<any>>,
	currentLocation: Location
) =>
	React.Children.toArray(children).some(child => {
		if (!React.isValidElement(child)) {
			return false
		}
		if (child.props.to === currentLocation.pathname) {
			return true
		}
		return containsActiveChildren(child.props.children, currentLocation)
	})

class NavOpener extends Component<Props, State> {
	constructor(props) {
		super(props)
		const containingActiveChildren = containsActiveChildren(
			props.children,
			props.location
		)
		this.state = {
			opened: containingActiveChildren,
			previousLocation: props.location,
			controlled: false
		}
	}
	static getDerivedStateFromProps(props, state) {
		const containingActiveChildren = containsActiveChildren(
			props.children,
			props.location
		)
		return state.previousLocation !== props.location
			? {
					previousLocation: props.location,
					opened: state.opened || containingActiveChildren
			  }
			: null
	}
	handleToggle = event => {
		this.props.tracker.push([
			'trackEvent',
			'Sidebar',
			'click',
			event.target.textContent
		])
		this.setState(({ opened }) => ({ opened: !opened, controlled: true }))
	}

	render() {
		const parentClassNames = {
			opened: this.state.controlled
				? this.state.opened
				: containsActiveChildren(this.props.children, this.props.location),
			active: this.props.location.pathname === this.props.to
		}
		return (
			<>
				<span className={classnames('navigation__item', parentClassNames)}>
					<button
						className="ui__ text-button navigation__caret"
						onClick={this.handleToggle}>
						›
					</button>
					{this.props.to ? (
						<NavLink
							to={this.props.to}
							onClick={event =>
								this.props.tracker.push([
									'trackEvent',
									'Sidebar',
									'click',
									event.target.textContent
								])
							}
							exact
							className="ui__ text-button">
							{this.props.title}
						</NavLink>
					) : (
						<button
							className={classnames('ui__', 'text-button', parentClassNames)}
							onClick={this.handleToggle}>
							{this.props.title}
						</button>
					)}
				</span>
				{this.props.children}
			</>
		)
	}
}

export default (compose(
	withTracker,
	withRouter
)(NavOpener): React$ComponentType<OwnProps>)

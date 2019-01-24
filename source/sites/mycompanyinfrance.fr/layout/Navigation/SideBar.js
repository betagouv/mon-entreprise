/* @flow */

import classnames from 'classnames'
import withTracker from 'Components/utils/withTracker'
import backSvg from 'Images/back.svg'
import mobileMenuSvg from 'Images/mobile-menu.svg'
import { compose } from 'ramda'
import React from 'react'
import { withRouter } from 'react-router'
import './SideBar.css'
import type { Tracker } from 'Components/utils/withTracker'
import type { Node } from 'react'
import type { Location } from 'react-router-dom'

type State = {
	opened: boolean,
	sticky: boolean
}

type Props = {
	tracker: Tracker,
	location: Location,
	/* ownProps */
	children: Node
}

const bigScreen = window.matchMedia('(min-width: 1500px)')
const isParent = (parentNode, children) => {
	if (children === parentNode) {
		return true
	}
	if (!children) {
		return false
	}
	return isParent(parentNode, children.parentNode)
}

class SideBar extends React.Component<Props, State> {
	state = {
		opened: false,
		sticky: bigScreen.matches
	}
	ref = null
	componentDidMount() {
		window.addEventListener('click', this.handleClick)
		bigScreen.addListener(this.handleMediaQueryChange)
	}
	componentWillUnmount() {
		window.removeEventListener('click', this.handleClick)
		bigScreen.removeListener(this.handleMediaQueryChange)
	}
	handleClick = event => {
		if (
			!this.state.sticky &&
			!isParent(this.ref, event.target) &&
			this.state.opened
		) {
			this.handleClose()
		}
	}
	handleMediaQueryChange = () => {
		this.setState({ sticky: bigScreen.matches })
	}
	handleClose = () => {
		this.props.tracker.push(['trackEvent', 'Sidebar', 'close'])
		this.setState({ opened: false })
	}
	handleOpen = () => {
		this.props.tracker.push(['trackEvent', 'Sidebar', 'open'])
		this.setState({ opened: true })
	}

	componentDidUpdate(previousProps) {
		if (!this.state.sticky && previousProps.location !== this.props.location) {
			this.setState({ opened: false })
		}
	}

	render() {
		return (
			<div
				className={classnames(
					'sidebar__container',
					this.state.opened && 'opened'
				)}
				ref={ref => (this.ref = ref)}>
				<div className="sidebar">{this.props.children}</div>
				<button
					className="menu__button"
					onClick={this.state.opened ? this.handleClose : this.handleOpen}>
					<img src={this.state.opened ? backSvg : mobileMenuSvg} />
				</button>
			</div>
		)
	}
}

export default compose(
	withRouter,
	withTracker
)(SideBar)

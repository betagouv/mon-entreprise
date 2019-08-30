/* @flow */

import classnames from 'classnames'
import withTracker from 'Components/utils/withTracker'
import { compose } from 'ramda'
import React from 'react'
import { withRouter } from 'react-router'
import backSvg from './back.svg'
import mobileMenuSvg from './mobile-menu.svg'
import './SideBar.css'
import type Tracker from '../../../../Tracker'
import type { Location } from 'react-router-dom'

type OwnProps = {|
	children: React$Node
|}

type Props = OwnProps & {
	tracker: Tracker,
	location: Location
}
type State = {
	opened: boolean,
	sticky: boolean
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
				css="transform: translate(-100%)" // prevent FOUC effect
				className={classnames('sidebar__container', {
					opened: this.state.opened
				})}
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

export default (compose(
	withTracker,
	withRouter
)(SideBar): React$ComponentType<OwnProps>)

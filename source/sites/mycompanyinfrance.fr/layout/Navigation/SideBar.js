import classnames from 'classnames'
import React from 'react'
import { withRouter } from 'react-router'
import backSvg from './back.svg'
import mobileMenuSvg from './mobile-menu.svg'
import './SideBar.css'

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
class SideBar extends React.Component {
	state = {
		opened: false,
		sticky: bigScreen.matches
	}
	componentDidMount() {
		window.addEventListener('click', this.handleClick)
		bigScreen.addListener(this.handleMediaQueryChange)
	}
	componentWillUnmount() {
		window.removeEventListener('click', this.mediaQueryChanged)
		bigScreen.removeListener(this.handleMediaQueryChange)
	}
	handleClick = event => {
		if (!this.state.sticky && !isParent(this.ref, event.target)) {
			this.setState({ opened: false })
		}
	}
	handleMediaQueryChange = () => {
		this.setState({ sticky: bigScreen.matches })
	}
	handleClose = () => {
		this.setState({ opened: false })
	}
	handleOpen = () => {
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

export default withRouter(SideBar)

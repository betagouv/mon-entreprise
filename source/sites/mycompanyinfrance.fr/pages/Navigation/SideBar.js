import classnames from 'classnames'
import React from 'react'
import { withRouter } from 'react-router'
import backSvg from './back.svg'
import mobileMenuSvg from './mobile-menu.svg'
import './SideBar.css'

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
		opened: false
	}
	componentDidMount() {
		window.addEventListener('click', this.handleClick)
	}
	componentWillUnmount() {
		window.removeEventListener('click', this.mediaQueryChanged)
	}
	handleClick = event => {
		if (!isParent(this.ref, event.target)) {
			this.setState({ opened: false })
		}
	}
	handleClose = () => {
		this.setState({ opened: false })
	}
	handleOpen = () => {
		this.setState({ opened: true })
	}

	componentDidUpdate(previousProps) {
		if (previousProps.location !== this.props.location) {
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

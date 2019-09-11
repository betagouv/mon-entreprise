/* @flow */

import classnames from 'classnames'
import withTracker from 'Components/utils/withTracker'
import { compose } from 'ramda'
import React, { useEffect, useRef, useState } from 'react'
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

function SideBar({ location, tracker, children }) {
	const [opened, setOpened] = useState(false)
	const [sticky, setSticky] = useState(bigScreen.matches)
	const [previousLocation, setPreviousLocation] = useState(location)
	const ref = useRef()

	useEffect(() => {
		window.addEventListener('click', handleClick)
		bigScreen.addListener(handleMediaQueryChange)

		return () => {
			window.removeEventListener('click', handleClick)
			bigScreen.removeListener(handleMediaQueryChange)
		}
	}, [opened, sticky])

	useEffect(() => {
		if (!sticky && previousLocation !== location) {
			setOpened(false)
		}
		setPreviousLocation(location)
	})

	const handleClick = event => {
		if (!sticky && !isParent(ref.current, event.target) && opened) {
			handleClose()
		}
	}
	const handleMediaQueryChange = () => {
		setSticky(bigScreen.matches)
	}
	const handleClose = () => {
		tracker.push(['trackEvent', 'Sidebar', 'close'])
		setOpened(false)
	}
	const handleOpen = () => {
		tracker.push(['trackEvent', 'Sidebar', 'open'])
		setOpened(true)
	}

	return (
		<div
			css="transform: translate(-100%)" // prevent FOUC effect
			className={classnames('sidebar__container', {
				opened: opened
			})}
			ref={ref}>
			<div className="sidebar">{children}</div>
			<button
				className="menu__button"
				onClick={opened ? handleClose : handleOpen}>
				<img src={opened ? backSvg : mobileMenuSvg} />
			</button>
		</div>
	)
}

export default (compose(
	withTracker,
	withRouter
)(SideBar): React$ComponentType<OwnProps>)

import { omit } from 'ramda'
import React, { Component } from 'react'

const forEachParent = (node, fn) => {
	if (!node) {
		return
	}
	fn(node)
	forEachParent(node.parentNode, fn)
}
export class ScrollToTop extends Component {
	static defaultProps = {
		behavior: 'auto'
	}
	componentDidMount() {
		if ('parentIFrame' in window) {
			window.parentIFrame.scrollToOffset(0, 0)
			return
		}
		forEachParent(this.ref, elem => (elem.scrollTop = 0))
		try {
			window.scroll({
				top: 0,
				behavior: this.props.behavior
			})
		} catch (e) {
			window.scroll(0, 0)
		}
	}
	render() {
		return (
			<div
				ref={ref => {
					this.ref = ref
				}}
			/>
		)
	}
}

export class ScrollToElement extends Component {
	static defaultProps = {
		behavior: 'smooth',
		style: {},
		onlyIfNotVisible: false
	}
	scrollIfNeeded = () => {
		if (
			this.props.when === false ||
			(this.props.onlyIfNotVisible &&
				this.ref.getBoundingClientRect().top >= 0 &&
				this.ref.getBoundingClientRect().bottom <= window.innerHeight)
		) {
			return
		}
		try {
			this.ref.scrollIntoView({
				behavior: this.props.behavior,
				block: 'nearest',
				inline: 'nearest'
			})
		} catch (error) {
			this.ref.scrollIntoView({
				behavior: this.props.behavior
			})
		}
	}
	componentDidMount() {
		this.scrollIfNeeded()
	}
	componentDidUpdate() {
		this.scrollIfNeeded()
	}
	render() {
		return (
			<div
				{...omit(['onlyIfNotVisible', 'when'], this.props)}
				style={{
					...this.props.style,
					...(!this.props.children ? { position: 'absolute' } : {})
				}}
				ref={ref => (this.ref = ref)}
			/>
		)
	}
}

export default {
	toElement: ScrollToElement,
	toTop: ScrollToTop
}

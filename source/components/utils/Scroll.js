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
		window.scroll({
			top: 0,
			behavior: this.props.behavior
		})
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
		this.ref.scrollIntoView({
			behavior: this.props.behavior,
			block: 'nearest',
			inline: 'nearest'
		})
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
				{...this.props}
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

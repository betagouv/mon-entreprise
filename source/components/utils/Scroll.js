import React, { Component } from 'react'

export class ScrollToTop extends Component {
	static defaultProps = {
		behavior: 'auto'
	}
	componentDidMount() {
		window.scroll({
			top: 0,
			behavior: this.props.behavior
		})
	}
	render() {
		return null
	}
}

export class ScrollToElement extends Component {
	static defaultProps = {
		behavior: 'smooth'
	}
	componentDidMount() {
		this.ref.scrollIntoView({
			behavior: this.props.behavior
		})
	}
	render() {
		return (
			<div style={{ position: 'absolute' }} ref={ref => (this.ref = ref)} />
		)
	}
}

export default {
	toElement: ScrollToElement,
	toTop: ScrollToTop
}

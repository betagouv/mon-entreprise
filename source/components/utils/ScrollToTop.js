import { Component } from 'react'

export default class ScrollToTop extends Component {
	props = {
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

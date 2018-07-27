import { Component } from 'react'

export default class ScrollToTop extends Component {
	componentDidMount() {
		window.scroll({
			top: 0
		})
	}
	render() {
		return null
	}
}

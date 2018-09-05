import { Component } from 'react'

export default class DisableScroll extends Component {
	componentDidMount() {
		document.documentElement.style.overflow = 'hidden'
	}
	componentWillUnmount() {
		document.documentElement.style.overflow = ''
	}
	render() {
		return null
	}
}

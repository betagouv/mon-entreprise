import { Component } from 'react'

class SetCSSColor extends Component {
	updateCSSColor = () => {
		Object.entries(this.props.colors).forEach(([key, value]) => {
			document.body.style.setProperty(`--${key}`, value)
		}, this.props.colors)
	}
	constructor(props) {
		super(props)
		this.updateCSSColor()
	}
	componentDidUpdate() {
		this.updateCSSColor()
	}
	render() {
		return null
	}
}

export default SetCSSColor

import { Component } from 'react'
import withColours from './withColours'

class SetCSSColour extends Component {
	updateCSSColour = () => {
		Object.entries(this.props.colours).forEach(([key, value]) => {
			document.body.style.setProperty(`--${key}`, value)
		}, this.props.colours)
	}
	constructor(props) {
		super(props)
		this.updateCSSColour()
	}
	componentDidUpdate() {
		this.updateCSSColour()
	}
	render() {
		return null
	}
}

export default withColours(SetCSSColour)

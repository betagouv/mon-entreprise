import { Component } from 'react'
import withColours from './withColours'

class SetCSSColour extends Component {
	updateCSSColour = () => {
		document.body.style.setProperty('--colour', this.props.colours.colour)
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

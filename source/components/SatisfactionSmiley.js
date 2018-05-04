import React, { Component } from 'react'
import withColours from './withColours'
import HoverDecorator from './HoverDecorator'
import './SatisfactionSmiley.css'
@withColours
@HoverDecorator
export default class SatisfactionSmiley extends Component {
	render() {
		return (
			<button
				onClick={() => this.props.onClick(this.props.text)}
				className="satisfaction-smiley"
				style={
					this.props.hover
						? {
								background: this.props.colours.colour,
								color: 'white',
								borderColor: 'transparent'
						  }
						: {
								color: this.props.colours.colour,
								borderColor: this.props.colours.colour
						  }
				}>
				{this.props.text}
			</button>
		)
	}
}

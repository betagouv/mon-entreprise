import React from 'react'
import './BlueButton.css'
import { connect } from 'react-redux'

export default connect(state => ({
	themeColours: state.themeColours
}))(({ themeColours, children, disabled, style }) => (
	<button
		disabled={disabled}
		className="blueButton"
		style={{ ...style, background: themeColours.colour }}
	>
		{children}
	</button>
))

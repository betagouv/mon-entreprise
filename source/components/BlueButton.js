import React from 'react'
import './BlueButton.css'
import { connect } from 'react-redux'

export default connect(state => ({
	themeColours: state.themeColours
}))(({ themeColours, children, disabled, style, onClick }) => (
	<button
		disabled={disabled}
		onClick={onClick}
		className="blueButton"
		style={{ ...style, background: themeColours.colour }}
	>
		{children}
	</button>
))

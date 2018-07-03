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
		style={{
			...style,
			background: `linear-gradient(45deg, ${themeColours.darkerColour}, ${
				themeColours.colour
			})`,
			animation: 'AnimatedGradient 6s ease infinite',
			backgroundSize: '400% 400%'
		}}>
		{children}
	</button>
))

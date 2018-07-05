import React from 'react'
import withColours from '../../withColours'
import './BlueButton.css'

export default withColours(
	({ colours, children, disabled, style, onClick }) => (
		<button
			disabled={disabled}
			onClick={onClick}
			className="blueButton"
			style={{ ...style, background: colours.colour }}>
			{children}
		</button>
	)
)

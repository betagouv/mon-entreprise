import React from 'react'
import './BlueButton.css'
import { connect } from 'react-redux'

export default connect(state => ({
	themeColours: state.themeColours
}))(({ themeColours, children }) => (
	<button className="blueButton" style={{ background: themeColours.colour }}>
		{children}
	</button>
))

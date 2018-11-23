import { SliderPicker } from 'react-color'
import React from 'react'

export default ({ couleur, changeColour }) => (
	<SliderPicker color={couleur} onChangeComplete={changeColour} />
)

import React from 'react'
import styled from 'styled-components'

// From https://www.w3schools.com/howto/howto_css_switch.asp
export default function ToggleSwitch(
	props: React.HTMLAttributes<HTMLInputElement>
) {
	return (
		<Switch>
			<input type="checkbox" {...props} />
			<span className="slider round"></span>
		</Switch>
	)
}

const Switch = styled.label`
	/* The switch - the box around the slider */
	position: relative;
	display: inline-block;
	width: 60px;
	height: 34px;

	/* Hide default HTML checkbox */
	input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* The slider */
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		transition: 0.4s;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		transition: 0.4s;
	}

	input:checked + .slider {
		background-color: #7dbb81;
	}

	input:focus + .slider {
		box-shadow: 0 0 1px #7dbb81;
	}

	input:checked + .slider:before {
		transform: translateX(26px);
	}

	/* Rounded sliders */
	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}
`
